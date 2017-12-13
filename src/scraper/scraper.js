const LunoClient = require('../client/LunoClient')
const DatastoreFactory = require('../datastore/DatastoreFactory')

class Scraper {

    constructor(oldestDate = '2017/11/01') {
        this.client = LunoClient.getClient()
        this.dataStore = DatastoreFactory.getDatastore(false, oldestDate);
    }

    async sleep(ms) {
        console.log("api rate limit - waiting " + ms / 1000 + " seconds")
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    process(response) {
        this.dataStore.addTrades(response.trades)
    }

    async getData(ms) {
        try {
            let response = await this.client.getTrades(this.dataStore.lastDate.getTime())
            this.process(response)
            console.log(response)
        } catch (reason) {
            let error = reason.error
            if (error.status === 429) { //api rate limit == 429
                await this.sleep(ms)
                throw reason
            } else {
                console.log(reason)
            }
        }

    }

    async run() {
        this.dataStore.on('ready', async ()=> {
            let mustRun = true
            let sleepTime = 1000
            while (mustRun) {
                try {
                    await this.getData(sleepTime)
                    sleepTime = 1000
                } catch (error) {
                    sleepTime += 1000
                }
            }
        })
    }

}

module.exports = Scraper
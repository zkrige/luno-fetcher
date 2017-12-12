const fs = require('fs')
const LunoClient = require('LunoClient')
var _ = require('lodash');

class Scraper {

    constructor(oldestDate = '2017/11/01') {
        this.client = LunoClient.getClient()
        this.lastDate = Scraper.getLastDate() //resume from last scraped date
        this.fs = fs.createWriteStream('luno-data.txt',{'flags': 'a'}) //append existing file
        this.oldestDate = oldestDate
    }

    static getLastDate() {
        let data = []
        let rows = []
        try {
            data = fs.readFileSync('luno-data.txt', 'utf8')
            rows = data.trim().split("\n")
            let lastRow = rows.splice(-1)[0]
            let lastTrade = JSON.parse(lastRow)
            let lastTimeStamp = lastTrade.timestamp
            return new Date(lastTimeStamp)
        } catch (exception) {
            return new Date(this.oldestDate) //dont go further back than 2017/11/01
        }
    }

    async sleep(ms) {
        console.log("api rate limit - waiting " + ms / 1000 + " seconds")
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    process(response) {
        this.fs.cork()
        let trades = _.sortBy(response.trades, "timestamp")
        trades.forEach((trade) => {
            let tradeJSON = JSON.stringify(trade)
            this.fs.write(tradeJSON)
            this.fs.write("\n")
        })
        let lastTrade = trades[trades.length - 1]
        this.lastDate = new Date(lastTrade.timestamp);
        this.fs.uncork()//flush fs buffer
    }

    async getData(ms) {
        try {
            let response = await this.client.getTrades(this.lastDate.getTime())
            this.process(response)
            console.log(response)
        } catch (reason) {
            let error = reason.error
            if (error.status === 429) {
                await this.sleep(ms)
                throw reason
            } else {
                console.log(reason)
            }
        }

    }

    async run() {
        this.fs.on('open', async (fs)=> {
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

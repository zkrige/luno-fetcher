const StoreFactory = require('./model/StoreFactory.js')
const TradingClientFactory = require('../tradingclient/TradingClientFactory.js')

class Trading {

    constructor(){

        this.trailingStopLoss = {
            latestPrice: '250000.00',
            margin: '10000',
            sell: '240000',
            volume: '1.000000',
            pair: 'XBTZAR'
        }

        this.dataStore = StoreFactory.getStore(false)
        this.client = TradingClientFactory.getTradingClient(false)
    }

    private async sleep(ms) {
        console.log("api rate limit - waiting " + ms / 1000 + " seconds")
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private submitSellOrder() {
        this.client.postOrder('ASK', this.trailingStopLoss.volume, this.trailingStopLoss.sell, this.trailingStopLoss.pair)
    }

    private process(response) {
        this.trailingStopLoss.latestPrice = response.last_trade
        if (response.last_trade > this.trailingStopLoss.latestPrice) {
            this.trailingStopLoss.sell = response.last_trade - this.trailingStopLoss.margin
        }
        if (response.last_trade <= this.trailingStopLoss.sell) {
            this.submitSellOrder()
        }
    }

    private async getData() {
        try {
            let response = await this.dataStore.getNextTrade()
            this.process(response)
            console.log(response)
        } catch (reason) {
            let error = reason.error
            if (error.status === 429) {
                await this.sleep(10000)
            } else {
                console.log(reason)

            }
        }

    }

    public async run() {
        let mustRun = true
        while (mustRun) {
            await this.getData()
        }
    }

}

module.exports = Trading
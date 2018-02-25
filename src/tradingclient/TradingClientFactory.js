const TradingClient = require('../interface/TradingClient.js')
const APITradingClient = require('./APITradingClient.js')

class TradingClientFactory {
    static getTradingClient(isLive){
        if (isLive) {
            return new APITradingClient(client)
        } else {
            return new TradingClient()
        }
    }
}

module.exports = TradingClientFactory
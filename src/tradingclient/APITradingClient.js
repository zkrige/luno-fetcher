"use strict";
const TradingClient = require('../interface/TradingClient.js')

class APITradingClient extends TradingClient {

    constructor(client){
        super()
        this.client = client
    }

    async postOrder(type = '', volume = '', price = '', pair = ''){
        await this.client.postOrder(type, volume, price, pair)
    }
}

module.exports = APITradingClient
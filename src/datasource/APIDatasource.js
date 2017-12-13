"use strict";

const Datasource = require('../interface/Datasource.js')

class APIDatasource extends Datasource {

    constructor(client){
        super()
        this.client = client
    }

    async getNextTrade() {
        return await this.client.getTicker()

    }
}

module.exports = APIDatasource
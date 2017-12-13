"use strict"
var EventEmitter = require('events').EventEmitter;

class Datastore extends EventEmitter {

    constructor(){
        super()
        this.lastDate = null
    }

    async getLastDate(startDate) {
        try {
            let lastTrade = await this.getLastTrade()
            let lastTimeStamp = lastTrade.timestamp
            return new Date(lastTimeStamp)
        } catch (exception) {
            return new Date(startDate) //dont go further back than 2017/11/01
        }
    }

    getLastTrade() {}

    addTrades(trades = []) {}

}

Datastore.prototype.lastDate = String

module.exports = Datastore
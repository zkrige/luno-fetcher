const fs = require('fs')
const Datastore = require('../interface/Datastore.js')
const filename = 'luno-data.txt'
const _ = require('lodash');

class FileDatastore extends Datastore {

    constructor(){
        super()
        this.emitReady = this.emitReady.bind(this)
        this.fs = fs.createWriteStream(filename, {'flags': 'a'}) //append existing file
        this.lastDate = undefined
        this.fs.on('open',this.emitReady)
        this.getLastDate("2017/11/01").then((date) => {
            this.lastDate = date
            this.emitReady()
        })
    }

    emitReady(){
        if (this.lastDate !== undefined && //last date has been read
            this.fs.fd !== null) { //filestream is ready
            this.emit('ready')
        }
    }

    getLastTrade(){
        let data = fs.readFileSync(filename, 'utf8')
        let rows = data.trim().split("\n")
        let lastRow = rows.splice(-1)[0]
        return JSON.parse(lastRow)
    }

    addTrades(trades) {
        this.fs.cork()
        trades = _.sortBy(trades, "timestamp")
        trades.forEach((trade) => {
            let tradeJSON = JSON.stringify(trade)
            this.fs.write(tradeJSON)
            this.fs.write("\n")
        })
        this.fs.uncork()//flush fs buffer
        let lastTrade = trades[trades.length - 1]
        this.lastDate = new Date(lastTrade.timestamp);

    }
}

module.exports = FileDatastore
const Datastore = require('../interface/Datastore.js')
const firebase = require('firebase-admin');
const serviceAccount = require('../config/firebaseConfig.json');
const _ = require('lodash');

class FirebaseDatastore extends Datastore {
    constructor() {
        super()
        this.emitReady = this.emitReady.bind(this)
        firebase.initializeApp({
            credential: firebase.credential.cert(serviceAccount),
            databaseURL: "https://luno-bot.firebaseio.com"
        });
        this.lastDate = null
        this.getLastDate("2017/11/01").then(function(date){
            this.lastDate = date
            this.emitReady()
        }.bind(this))
    }

    emitReady() {
        this.emit('ready')
    }

    async getLastTrade() {
        let row = await firebase.database().ref("trades").orderByChild("timestamp").limitToLast(1).once("value")
        let trade = row.val()
        return trade
    }

    addTrades(trades) {
        trades = _.sortBy(trades, "timestamp")
        trades.forEach((trade) => {
            firebase.database().ref("trades").push(trade)
        })
        let lastTrade = trades[trades.length - 1]
        this.lastDate = new Date(lastTrade.timestamp);
    }
}

module.exports = FirebaseDatastore
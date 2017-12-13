"use strict";

const APIDatasource = require('./APIDatasource.js')
const FileDatasource = require('./FileDatasource.js')
const LunoClient = require('../client/LunoClient')

class StoreFactory {
    static getStore(isLive){
        if (isLive) {
            let client = LunoClient.getClient()
            return new APIDatasource(client)
        } else {
            return new FileDatasource()
        }
    }
}

module.exports = StoreFactory
const Luno = require('luno-api')
const lunoAccount = require('../config/lunoConfig.json');

class LunoClient {
    
    static getClient() {
        let client = new Luno(lunoAccount)
        return client
    }
}

module.exports = LunoClient
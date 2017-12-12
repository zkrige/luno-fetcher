const Luno = require('luno-api')

class LunoClient {
    
    static getClient() {
        let client = new Luno({
            key: 'your key',
            secret: 'your secret',
            defaultPair: 'XBTZAR' // Default pair that is used for requests. if not provided, it will be set to XBTZAR
        })
        return client
    }
}

module.exports = LunoClient

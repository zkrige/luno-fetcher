const Datasource = require('../interface/Datasource.js')

class FileDatasource extends Datasource {

    constructor(){
        super()
        let data = fs.readFileSync('luno-data.txt', 'utf8')
        this.trades = data.trim().split("\n")
        this.currentItem = 0
    }

    async getNextTrade() {
        return this.trades[this.currentItem++]
    }
}

module.exports = FileDatasource
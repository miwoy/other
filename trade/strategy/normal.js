const Strategy = require("./Class")
const debug = require("debug")("trade:strategy:普通")


class Normal extends Strategy{
    constructor(data, opts) {
        opts = opts || {}
        super("一次购入", data, {
            ...opts,
            // logger: debug
        })
    }
    oper(row, i) {
        if (this.index === 0) { // 首次
            let amount = this.total/1.00027
            amount = amount >= 20000 ? amount:(this.total-5)/1.00002
            let vol = Math.floor(amount/row[0] / 100) * 100
            this.buy(vol, row[0])
        }
    }
}

module.exports = Normal
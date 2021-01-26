const Strategy = require("./Class")
const debug = require("debug")("trade:strategy:normal")


class Normal extends Strategy{
    constructor(data, opts) {
        opts = opts || {}
        if (opts.total <= 0) throw new Error("投入资金过小或不存在")
        super("定投", data, {
            ...opts,
            logger: debug
        })
        this.split = Math.floor(this.total / data.length)
        
    }
    oper(row) {
        this.buy(this.split/row[0], row[0])
    }
}

module.exports = Normal
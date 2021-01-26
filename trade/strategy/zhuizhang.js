const Strategy = require("./Class")
const debug = require("debug")("trade:strategy:追涨")


class Normal extends Strategy{
    constructor(data, opts) {
        opts = opts || {}
        if (opts.total <= 0) throw new Error("投入资金过小或不存在")
        super("追涨", data, {
            ...opts,
            investment: 0,
            logger: debug
        })
        this.lever = 2 // 杠杆
        this.space = 0.001 // 利润空间
        this.sed = data[0][0] // 累计涨幅
    }
    oper(row) {
        let rate = (row[0] - this.sed)/this.sed
        if (rate > this.space) {
            
            let vol = Math.abs(this.balance * rate * this.lever / row[0])
            this.buy(vol, row[0])
            this.sed = row[0]
        } else {
            if (row[0]<this.sed) this.sed = row[0]
        }
        
    }
}

module.exports = Normal
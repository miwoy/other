const Strategy = require("./Class")
const debug = require("debug")("trade:strategy:追涨杀跌")


class Normal extends Strategy {
    constructor(data, opts) {
        opts = opts || {}
        if (opts.total <= 0) throw new Error("投入资金过小或不存在")
        super("追涨杀跌", data, {
            ...opts,
            logger: debug
        })
        this.buyLever = opts.buyLever || 10 // 杠杆
        this.sellLever = opts.sellLever || 10
        this.space = opts.space || 0.001 // 利润空间
        this.sed = data[0][0] // 累计涨幅
    }
    oper(row) {
        let rate = (row[0] - this.sed) / this.sed
        if (rate > this.space) {
            let vol = Math.floor(Math.abs(this.volume * rate * this.sellLever)/100)*100
            this.sell(vol, row[0])
            this.sed = row[0]
        } else if (rate < -this.space) {
            let vol = Math.floor(Math.abs(this.balance * rate * this.buyLever / row[0])/100)*100
            this.buy(vol, row[0])
            this.sed = row[0]
        }
    }
}

module.exports = Normal
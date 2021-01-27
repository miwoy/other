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
        this.buySpace = opts.buySpace
        this.sellSpace = opts.sellSpace
        // this.sed = data[0][0] // 
        this.max = data[0][0]
        this.min = data[0][0]
    }
    oper(row) {
        let rate = row[1] > 0 ? (row[0] - this.min) / this.min : (row[0] - this.max) / this.max
        if (rate > this.sellSpace) {
            let vol = Math.floor(Math.abs(this.volume * rate * this.sellLever) / 100) * 100
            this.sell(vol, row[0])
            this.max = row[0]
            this.min = row[0]
        } else if (rate < -this.buySpace) {
            let vol = Math.floor(Math.abs(this.balance * rate * this.buyLever / row[0]) / 100) * 100
            this.buy(vol, row[0])
            this.max = row[0]
            this.min = row[0]
        } else {
            if (row[1] > 0) {
                this.max = row[0] > this.max ? row[0] : this.max
            } else {
                this.min = row[0] < this.min ? row[0] : this.min
            }
        }
    }
}

module.exports = Normal
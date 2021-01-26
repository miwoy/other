class Strategy {
    constructor(name, data, opts) {
        opts = opts || {}
        this.name = name
        this.data = data
        this.index = 0
        this.logger = opts.logger || function(){}
        this.total = opts.total
        this.balance = opts.total
        this.volume = 0
        this.buyCount = 0
        this.sellCount = 0
        this.sxf = 0
        this.result = {}
        this.closeSXF = opts.closeSXF || false

    }
    start() {
        this.data.forEach((row, i) => {
            // 买卖计算
            this.index = i
            this.oper(row, i)
            this.logger(`【账户】${this.index}\t当前价格: ${row[0].toFixed(4)}\t涨幅:${(row[1]*100).toFixed(4)}%\t当前份额:${this.volume}\t可用资金:${this.balance.toFixed(2)}`)
            this.settle()
        })
    }
    settle() {
        this.result = {
            name: this.name,
            total: this.total,
            buyCount: this.buyCount,
            sellCount: this.sellCount,
            settlement: Math.round((this.data[this.index][0] * this.volume + this.balance) * 100) / 100, // 清仓结算
            profit: Math.round((this.data[this.index][0] * this.volume + this.balance - this.total) * 100) / 100, // 清仓盈利
            profitRate: (this.data[this.index][0] * this.volume + this.balance - this.total) / this.total,
            sxf: Math.round(this.sxf * 100) / 100
        }

        return this.result
    }
    end() {
        this.settle()
        console.log(`【结算】(${this.name})购买次数:${this.result.buyCount}\t卖出次数:${this.result.sellCount}\t总手续费:${this.result.sxf.toFixed(4)}\t持仓盈利:${this.result.profit.toFixed(4)}\t持仓收益率:${(this.result.profitRate*100).toFixed(2)}%`)
    }
    oper() {
        throw new Error("必须实现oper")
    }
    buySxf(amount) {
        if (this.closeSXF) return 0
        let _sxf = 0
        _sxf += amount * 0.00025 > 5 ? amount * 0.00025 : 5 // 佣金
        _sxf += amount * 0.00002 // 过户
        return _sxf
    }
    sellSxf(amount) {
        if (this.closeSXF) return 0
        let _sxf = 0
        _sxf += amount * 0.00025 > 5 ? amount * 0.00025 : 5 // 佣金
        _sxf += amount * 0.00002 // 过户
        _sxf += amount * 0.001 // 印花
        return _sxf
    }
    buy(vol, price) {
        if (vol <= 0) {
            return this.logger("【买入】购买份额不能少于100")
        }
        let sxf = this.buySxf(vol * price)
        if (vol * price + sxf > this.balance) {
            return this.logger("【买入】余额不足")
        }
        this.volume += vol
        this.balance -= vol * price
        this.balance -= sxf
        this.sxf += sxf
        this.buyCount++
        this.logger(`【买入】份额:${vol}\t价格:${price.toFixed(4)}\t手续费:${sxf.toFixed(4)}`)
    }
    sell(vol, price) {
        if (vol <= 0) {
            return this.logger("【卖出】卖出份额不能少于100")
        }
        if (vol > this.volume) {
            return this.logger("【卖出】份额不足")
        }
        let sxf = this.sellSxf(vol * price)
        this.volume -= vol
        this.balance += vol * price
        this.balance -= sxf
        this.sxf += sxf
        this.sellCount++
        this.logger(`【卖出】份额:${vol}\t价格:${price.toFixed(4)}\t手续费:${sxf.toFixed(4)}`)
    }
}

module.exports = Strategy
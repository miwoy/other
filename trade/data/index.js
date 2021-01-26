const debug = require('debug')("trade:data")
/**
 * 数据类型
 * 1.波动
 * 2.下滑
 * 3.上升
 */
class Data {
    constructor() {
        this.DAY_COUNT = Math.round(250) //次数
        this.BOTTOM = 10 // 初始市值
        this.FLUCTUATION = this.BOTTOM * 0.06 // 波动
        this.increase = this.BOTTOM * 0.2 // 涨幅
        this.decrease = this.BOTTOM * 0.2 // 跌幅
        debug(`次数:${this.DAY_COUNT}\t初始市值:${this.BOTTOM}\t波动:${this.FLUCTUATION}\t涨幅:${this.increase}\t跌幅:${this.decrease}`)
    }
    logger(name, data) {
        console.log(`【${name}】起始价:${data[0][0]}\t终止价:${data[data.length-1][0]}\t涨幅:${((data[data.length-1][0]-data[0][0])/data[0][0]*100).toFixed(2)}%`)
    }
    getCenter() {
        let now = 0
        let data = new Array(this.DAY_COUNT).fill(0).map((d, i) => {
            let n = now==0 ? this.BOTTOM : Math.random() * this.FLUCTUATION-this.FLUCTUATION/2 + this.BOTTOM
            let rent = now == 0 ? 0 : ((n - now) / now)
            now = n
            return [n, rent]
        })
        // this.logger("波动型", data)
        return data
    }
    getDown() {
        let now = 0
        let data = new Array(this.DAY_COUNT).fill(0).map((d, i) => {
            let n = now==0 ? this.BOTTOM : Math.round(Math.random() * this.FLUCTUATION +this. BOTTOM - this.decrease / (this.DAY_COUNT - i))
            let rent = now == 0 ? 0 : ((n - now) / now)
            now = n
            return [n, rent]
        })
        // this.logger("下跌型", data)
        return data
    }
    getUp() {
        let now = 0
        let data = new Array(this.DAY_COUNT).fill(0).map((d, i) => {
            let n = now==0 ? this.BOTTOM : Math.round(Math.random() * this.FLUCTUATION + this.BOTTOM + this.increase / (this.DAY_COUNT - i))
            let rent = now == 0 ? 0 : ((n - now) / now)
            now = n
            return [n, rent]
        })
        // this.logger("上升型", data)
        return data
    }
}

module.exports = Data
/**
 * 数据类型
 * 1.波动
 * 2.下滑
 * 3.上升
 */
const DAY_COUNT=Math.round(365) //次数
const BOTTOM = 100 // 初始市值
const FLUCTUATION = BOTTOM * 0.01  // 波动
const increase = BOTTOM * 0.2 // 涨幅
const decrease = BOTTOM * 0.2// 跌幅

function data1() {
    let now = 0
    let data = new Array(DAY_COUNT).fill(0).map((d,i) => {
        let n = Math.round(Math.random() * FLUCTUATION + BOTTOM)
        let rent = now == 0 ? 0 : ((n - now) / now)
        now = n
        return [n, rent]
    })
    return data
}

function data2() {
    let now = 0
    let data = new Array(DAY_COUNT).fill(0).map((d, i) => {
        let n = Math.round(Math.random() * FLUCTUATION + BOTTOM - decrease/(DAY_COUNT-i))
        let rent = now == 0 ? 0 : ((n - now) / now)
        now = n
        return [n, rent]
    })
    return data
}

function data3() {
    let now = 0
    let data = new Array(DAY_COUNT).fill(0).map((d, i) => {
        let n = Math.round(Math.random() * FLUCTUATION + BOTTOM + increase/(DAY_COUNT-i))
        let rent = now == 0 ? 0 : ((n - now) / now)
        now = n
        return [n, rent]
    })
    return data
}


module.exports = [{
    name: "波动性",
    data: data1()
}, {
    name: "下跌型",
    data: data2()
}, {
    name: "上涨型",
    data: data3()
}]
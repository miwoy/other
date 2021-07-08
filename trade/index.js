const Data = require("./data")
const Normal = require("./strategy/normal")
const Dingtou = require("./strategy/dingtou")
const Strategy = require("./strategy/zzsd")
const sh601398 = require("./data/601398.SH.json")
const sh600189 = require("./data/600189.SH.json")
const sz002142 = require("./data/002142.SZ.json")
const sz002149 = require("./data/002149.SZ.json")
const {
    Context
} = require("../GA/NGA/main")

let DNA = [1, 0.24617066, 0.24617066, 3.66507803, 0.0001755]
let ds = [
    ["sh601398", formatData(sh601398)],
    ["sz002149", formatData(sz002149)],
    ["sh600189", formatData(sh600189)],
    ["sz002142", formatData(sz002142)]
]
// ds = [["sz002149", formatData(sz002149)]]
let total = 20000 * (1+DNA[0])
let buySpace = DNA[1]
let sellSpace = DNA[2]
let buyLever = DNA[3]
let sellLever = DNA[4]

console.log(`【参数】总投入:${total}`)
ds.map((dd, i) => {
    console.log("数据分组-" + dd[0])
    let d = dd[1]
    let strategy = new Strategy(d, {
        total,
        buyLever,
        sellLever,
        buySpace,
        sellSpace
    })
    let normal = new Normal(d, {
        total
    })
    let dingtou = new Dingtou(d, {
        total
    })
    strategy.start()
    dingtou.start()
    normal.start()
    normal.end()
    dingtou.end()
    strategy.end()
})

function formatData(data) {
    data = JSON.parse(JSON.stringify(data))
    return data.reverse().map(d => [d[2], d[3] / (d[2] - d[3])])
}


function formatData1(data) {
    let pre_close = data[0][2] * 1
    return data.map(d => {
        d[2] = d[2] * 1
        let day = [d[2], (d[2] - pre_close) / pre_close]
        pre_close = d[2]
        return day
    })
}
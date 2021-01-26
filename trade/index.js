const Data = require("./data")
const Normal = require("./strategy/normal")
const Dingtou = require("./strategy/dingtou")
const Strategy = require("./strategy/zzsd")
const sz515030 = require("./data/515030.SZ.json")
const sh601398 = require("./data/601398.SH.json")
const sh600189 = require("./data/600189.SH.json")
const sz002142 = require("./data/002142.SZ.json")
const {
    Context
} = require("../GA/NGA/main")

let data = new Data()
let d1 = data.getUp()
let d2 = data.getCenter()
let d3 = data.getDown()
let ds = [formatData(sh601398),formatData(sz515030), formatData(sh600189), formatData(sz002142)]
// ds = [formatData(sz515030)]
let DNA = [3.00754416,0.15484771,0.0143154]
let total = 20000 //20000 * (1 + DNA[0])
let buyLever = DNA[0]
let sellLever = DNA[1]
let space = DNA[2]

console.log(`【参数】总投入:${total},盈利空间:${space}`)
ds.map((d) => {
    let strategy = new Strategy(d, {
        total,
        buyLever,
        sellLever,
        space
    })
    let normal = new Normal(d, {
        total
    })
    let dingtou = new Dingtou(d, {
        total
    })
    normal.start()
    dingtou.start()
    strategy.start()
    normal.end()
    dingtou.end()
    strategy.end()
})


function formatData(data) {
    let pre_close = data[0][2]*1
    return data.map(d => {
        d[2] = d[2] * 1
        let day = [d[2], (d[2] - pre_close) / pre_close]
        pre_close = d[2]
        return day
    })
}
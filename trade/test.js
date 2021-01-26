const Data = require("./data")
const Normal = require("./strategy/normal")
const Strategy = require("./strategy/zzsd")
const {Context} = require("../GA/NGA/main")
const sz515030 = require("./data/515030.SZ.json")
const sh601398 = require("./data/601398.SH.json")
const sh600189 = require("./data/600189.SH.json")
const sz002142 = require("./data/002142.SZ.json")
let ds = [sz515030, sh601398, sh600189, sz002142]

const total = 20000
ds = ds.map(dd=>formatData(dd))

const finishRate = 3
let context =  new Context({
	DNALength: 3,
    bit: 100000000,
    finishRate,
    totalCount: 100,
    mutationRate:0.001
})

context.validate = function(entity) {
    let DNA = entity.DNA
    let total = 20000 
    let buyLever = DNA[0]
    let sellLever = DNA[1]
    let space = DNA[2]
    let avg = ds.map(d=> {
        let strategy = new Strategy(d, {
            total,
            space,
            buyLever,
            sellLever
        })
        strategy.start()
        return strategy.result.profitRate
    }).reduce((t,d)=>{
        return t+d
    }, 0) / ds.length
    
	if (avg>=finishRate) {
        console.log("success", Object.values(entity.DNA).join(","));
        data.logger("数据", d)
    }
    console.log(`种群:${this.popCount},第「${entity.dai}」代「${Object.values(entity.DNA)}」验证得分:${avg};目标得分:${this.finishRate}`)
	return avg;
};
context.run()
// let normal = new Normal(d, {
//     total
// })

// normal.start()
// normal.end()

function formatData(data) {
    let pre_close = data[0][2]*1
    return data.map(d => {
        d[2] = d[2] * 1
        let day = [d[2], (d[2] - pre_close) / pre_close]
        pre_close = d[2]
        return day
    })
}
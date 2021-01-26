const Data = require("./data")
const Normal = require("./strategy/normal")
const Strategy = require("./strategy/zzsd")
const {Context} = require("../GA/NGA/main")
const dd = require("./data/515030.SZ.json")

const total = 20000
let data = new Data()
let d = formatData(dd)

const finishRate = 3
let context =  new Context({
	DNALength: 3,
    bit: 100000000,
    finishRate,
    totalCount: 15,
    mutationRate:0.001
})

context.validate = function(entity) {
    let DNA = entity.DNA
    let total = 20000 
    let buyLever = DNA[0]
    let sellLever = DNA[1]
    let space = DNA[2]
    let strategy = new Strategy(d, {
        total,
        space,
        buyLever,
        sellLever
    })
    
    strategy.start()
	// context.mutationRate = Math.abs(finishRate / strategy.result.profitRate) * 0.01
	if (strategy.result.profitRate>=finishRate) {
        console.log("success", Object.values(entity.DNA).join(","));
        data.logger("数据", d)
	}
	return strategy.result.profitRate;
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
const debug = require('debug')("NGA")
/**
 *  --> 生命激活中...
 *  --> 生命已激活。
 *  --> 开始物像转化...
 *  --> 实体构建完成。
 *  --> 开启分支模式?验证实体有效性 : 遗传
 *  --> 准备遗传(寻找配对实体)
 *  --> 配对成功。开始遗传...
 *  --> 随机性自由组合完成。
 *  --> 生成新的DNA成功。
 *  --> 构建新的域，将DNA植入域
 *  --> 开始复制物像转化器
 *  --> 遗传成功。
 *  --> 正在激活新生命...
 */


class Context {
    constructor(opt) {
        this.entities = {} // 环境下所有实体
        this.popCount = 0 //当前种群数量
        this.DNALength = opt.DNALength
        this.totalCount = opt.totalCount || Math.round(opt.DNALength / 0.382)
        this.bit = opt.bit || 1 // DNA 小数位
        this.mutationRate = opt.mutationRate || 0.001 // 变异率
        this.discardRate = 0.01
        this.rate = 1
        this.finishRate = opt.finishRate || 1
        this.totalRate = 0
        this.finished = false
        this.timeout = opt.timeout || 0
    }
    sigmoid(val) {
		return 1 / (1 + Math.exp(-val));
	}
    calculationMutationRate(rate) {
        return  this.mutationRate // (1  / this.popCount * 10 ) / (rate/this.finishRate)
    }
    /**
     * ASIC-II 转换
     * 数字码位从 48~57
     * 大写字母码位 65~90
     */
    fromCharCode(num) {
        if (num + 49 > 57) { // 字母
            num = num + 56;

            // 过滤掉I,O,U,V.并用其code值补码
            if (num === 73) num = 90;
            if (num === 79) num = 89;
            if (num === 85) num = 88;
            if (num === 86) num = 87;
        } else { // 数字 过滤掉0
            num += 49;
        }

        return String.fromCharCode(num);
    }
    getNewId() {
        let str = ""
        for (let i = 0; i < 16; i++) {
            str += this.fromCharCode(Math.round(Math.random() * 30));
        }
        return str;
    }
    destroy(id) {
        debug(`开始销毁「${id}」...`);
        this.totalRate -= this.entities[id].rate
        this.popCount--;
        delete this.entities[id];
        debug(`销毁「${id}」完成。`);
    }
    addEntity(entity) {
        this.entities[entity.id] = entity;
        this.popCount++;
        debug(`新实体「${entity.id}」构建完成.`)
        debug(`种群数量: ${this.popCount}`)
    }
    mutation(DNA, rate) {
        let mutationRate = this.calculationMutationRate(rate)
        for (let key in DNA) {
            if (Math.random() <= mutationRate) {
                DNA[key] =  Math.round((DNA[key] * (Math.random() + 0.5)) * this.bit) / this.bit
            }
        }
        return DNA;
    }
    crossover = function (DNA1, DNA2) {

        let _DNA1 = Object.keys(DNA1).reduce((a, k) => {
            a[k] = DNA1[k]
            return a
        }, {});
        if (Math.random() <= this.rate) {
            let num = 0;

            let rdm = Math.round(Math.random() * this.DNALength);
            for (let key in DNA1) {
                if (num >= rdm) {
                    _DNA1[key] = DNA2[key];
                }
                num++;
            }
            // console.log(this.popCount, Object.values(this.entities).reduce((acc, cur)=> {
            //     return !acc?acc: Object.values(cur.DNA).join("") == Object.values(DNA1).join("")
            // },true))
        }

        return _DNA1;
    }
    roulette = function (key) {
        let random = Math.random()
        let temp = 0;
        for (let k in this.entities) {
            temp += this.entities[k].rate / this.totalRate;
            temp = isNaN(temp)?Infinity:temp
            if (k !== key) {
                if (temp >= random) {
                    return this.entities[k];
                }
            }
        }

        // console.log(temp, this.entities, random);
    }
    validate() {
        throw new Error("必须设置适用性分数验证函数")
    }
    run() {
        for (let i = 0; i < this.totalCount; i++) {
            this.build(this.initDNA(this.DNALength, this.bit), 1);
        }
    }
    initDNA = function () {
        let _DNA = {};
        for (let i = 0; i < this.DNALength; i++) {
            _DNA[i] = Math.round(Math.random() * this.bit) / this.bit;
        }
        return _DNA;
    }
    build(DNA, dai) {


        let atom = new Atom({
            id: 0,
            fieldKey: "core",
            DNA: DNA,
            dai: dai,
            context: this
        });

        atom.activate();
    }

}



class Atom {
    constructor(opt) {
        this.DNA = opt.DNA; // 基础基因有遗传与销毁能力
        this.entityId = null; // 实体唯一标识，激活时赋值
        this.fieldKey = opt.fieldKey || "core"; // 对应到DNA内的域Id
        this.id = opt.id; // 域内单位Id
        this.dai = opt.dai
        this.context = opt.context
    }
    activate() {
        this.forward();
    }
    forward() {
        debug("开始构建实体...");
        let entity = new Entity({
            id: this.context.getNewId(),
            DNA: this.DNA,
            dai: this.dai,
            field: {
                core: [this]
            },
            context: this.context
        });

        // debug("开始物像转化...");
        // // this.DNA.forEach(function() {
        // //     // 物像转化
        // // });
        // debug("物像转化完成。");
        this.context.addEntity(entity);

        debug("等待遗传...");
        entity.use();
    }
}

class Entity {
    constructor(opt) {
        this.DNA = opt.DNA
        this.id = opt.id
        this.field = {}
        this.num = 2 // 遗传计数
        this.age = 5 // 年龄计数
        this.dai = opt.dai
        this.rate = 0 // 遗传概率
        this.context = opt.context
    }
    use() { // 实体生命周期
        debug(`验证实体「${this.id}」有效性...`);
        if (this.context.target) return;
        let func = function (entity) { // 递归函数
            /**
             * 适用性分数
             * 1. 遗传终点，评分达到多少时销毁环境
             * 2. 增长式适用性
             * 3. 计算平均分
             * 4. 计算
             * 高于平均分的属于优品
             * 低于平均的属于次品
             * 评分越高配对机会越高
             * 
             */
            if (entity.context.finished) return
            let result = entity.context.validate(entity);
            if (result >= entity.context.finishRate) return entity.context.finished = true;
            if (--entity.num <= 0) return entity.context.destroy(entity.id);
            entity.context.totalRate += result - entity.rate
            entity.rate = result;

            setTimeout(function () {
                entity.heredit();
                entity.DNA = entity.context.mutation(entity.DNA, entity.rate);
                func(entity);
            }, entity.context.timeout);
        };

        func(this)

    }
    heredit() {
        let gamete = this.context.roulette(this.id);
        debug(`配对成功【${this.id}-${gamete.id}】。开始遗传...`);
        // 自由组合
        let _DNA = this.context.crossover(this.DNA, gamete.DNA);
        debug("随机性自由组合完成。");

        // 生成_DNA
        debug("生成新的DNA成功。");
        _DNA = this.context.mutation(_DNA, (gamete.rate + this.rate) / 2);
        this.context.build(_DNA, this.dai + 1);
    }
}


module.exports = {
    Atom: Atom,
    Entity: Entity,
    Context: Context
};
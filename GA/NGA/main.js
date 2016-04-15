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


// 环境对象，用于存储生成的实体
var context = {
    totalCount: 400,
    totalRate: 0,
    entities: {},
    popCount: 0,
    DNALength: 16,
    mutationRate: 0.001,
    target: false,
    getNewId: function() {
        var str = "";
        for (var i = 0; i < 16; i++) {
            str += fromCharCode(Math.round(Math.random() * 30));
        }
        return str;
    },
    destroy: function(id) {
        console.log("开始销毁...");
        this.totalRate -= this.entities[id].discardRate;
        delete this.entities[id];
        this.popCount--;
        console.log("销毁完成。");
    },
    addEntity: function(entity) {
        this.entities[entity.id] = entity;
        this.popCount++;
        this.totalRate += entity.discardRate;
    },
    validate: function() {}
};

/**
 * ASIC-II 转换
 * 数字码位从 48~57
 * 大写字母码位 65~90
 */
function fromCharCode(num) {
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


function Atom() {
    this.DNA = {}; // 基础基因有遗传与销毁能力
    this.entityId = ""; // 实体唯一标识，激活时赋值
    this.fieldKey = "core"; // 对应到DNA内的域Id
    this.id = 0; // 域内单位Id
}

Atom.prototype.activate = function(entity) {
    console.log("开始构建实体...");
    this.forward();

};

Atom.prototype.forward = function() {
    var _entity = context.entities[this.entityId];
    var self = this;

    console.log("开始物像转化...");
    // this.DNA.forEach(function() {
    //     // 物像转化
    // });
    console.log("物像转化完成。");
    console.log("实体构建完成。");
    context.entities[this.entityId] = _entity; // 在实体中拥有验证与遗传能力

    console.log("等待遗传...");
    // setTimeout(function() {
    //     context.entities[self.entityId].use();
    // });
    context.entities[self.entityId].use();
};


function Entity() {
    this.DNA = {};
    this.id = "";
    this.field = {};
    this.num = 2; // 遗传计数
    this.age = 5; // 年龄计数
    this.discardRate = 1;



}

Entity.prototype.use = function() {
    console.log("验证实体有效性\n等待中...");
    if (context.target) return;
    (function(ctx) {
        var result = context.validate(ctx);
        var args = arguments;
        if (result === 1) return context.target = true;
        if (--ctx.num <= 0) return context.destroy(ctx.id);

        if (result < 0.1) return context.destroy((ctx.id));

        context.totalRate += (1 + result - ctx.discardRate);
        ctx.discardRate = result + 1;

        /**
         * 此处想加入动态控制种群长度功能
         */
        // if (context.popCount / context.totalCount < 0.5) {
        //  setTimeout(function() {
        //      ctx.heredit();
        //  });

        // }

        setTimeout(function() {
            ctx.heredit();
        });


        if (context.entities[ctx.id]) {
            ctx.DNA = mutation(context.mutationRate, ctx.DNA);
            setTimeout(function() {
                args.callee(ctx);
            });
        }

    })(this);

};

Entity.prototype.heredit = function() {

    var self = this;
    var gamete = roulette(this.id);

    console.log("配对成功。开始遗传...");

    // 自由组合
    var _DNA = crossover(context.DNALength, this.DNA, gamete.DNA);


    console.log("随机性自由组合完成。");

    // 生成_DNA
    _DNA = mutation(context.mutationRate, _DNA);

    console.log("生成新的DNA成功。");

    console.log("构建新的域，将DNA植入域。");
    this.num--;
    buildEntity(_DNA);
};

/**
 * 算法部分
 */

// 变异
var mutation = function(rate, DNA) {
    for (var key in DNA) {
        if (Math.random() <= rate) {
            DNA[key] = DNA[key] === 0 ? 1 : 0;
        }
    }

    return DNA;
};

// 杂交
var crossover = function(length, DNA1, DNA2) {
    var _DNA = DNA1;
    var num = 0;
    var rdm = Math.round(Math.random() * length);
    for (var key in DNA1) {
        if (num >= rdm) {
            _DNA[key] = DNA2[key];
        }

        num++;
    }

    return _DNA;
};

// 轮盘选择
var roulette = function(key) {
    var random = Math.random();
    var temp = 0;
    for (var k in context.entities) {

        temp += context.entities[k].discardRate / context.totalRate;
        if (k !== key) {
            // console.log("debug: temp", temp, context.totalRate);
            if (temp > random) {
                return context.entities[k];
            }
        }
    }
};


var buildEntity = function(DNA) {

    var entity = new Entity();
    var atom = new Atom();

    atom.id = 0;
    atom.fieldKey = "core";
    entity.DNA = atom.DNA = DNA;
    entity.id = atom.entityId = context.getNewId();
    entity.field = {
        core: [atom]
    };

    context.addEntity(entity);
    // console.log("初始实体", context);
    atom.activate();
};

var run = function(length) {

    if (!length) return console.log("length 不能为空");
    context.DNALength = length;
    context.totalCount = length / 0.382;   // 种群长度为基因长度5倍
    for (var i = 0; i < context.totalCount; i++) {
        buildEntity(initDNA(length));
    }
};


var initDNA = function(length) {
    length = length || context.DNALength;
    var _DNA = {};

    for (var i = 0; i < length; i++) {
        _DNA[i] = Math.round(Math.random());
    }

    return _DNA;
};

module.exports = {
    Atom: Atom,
    Entity: Entity,
    context: context,
    run: run
};

var Neuron = require("./Neuron");

/**
 * 前馈神经网络
 * @param {[type]} option [description]
 */
function BP(option) {
    if (typeof option != 'object') throw new Error("option arg error.");
    if (typeof option.iptLen != 'number') throw new Error("option.iptLen arg error.");
    if (typeof option.hidLen != 'number') throw new Error("option.hidLen arg error.");
    if (typeof option.optLen != 'number') throw new Error("option.optLen arg error.");
    if (!(typeof option.errornum == 'number' && option.errornum > 0 && option.errornum < 1))
        throw new Error("option.errornum arg error.");

    this.iptLen = option.iptLen;
    this.hidLen = option.hidLen;
    this.optLen = option.optLen;

    this.output = new Array(this.optLen).fill(0).map(v => new Neuron());
    this.hidden = new Array(this.hidLen).fill(0).map(v => new Neuron());
    this.input = new Array(this.iptLen).fill(0).map(v => new Neuron());

    this.errornum = option.errornum;
    this.momentum = 0.1;
    this.eta = 0.3;

    this.output.map(optLayer => {
        this.hidden.map(hidLayer => {
            this.input.map(iptLayer => {
                iptLayer.addDendrite(hidLayer);
            });
            hidLayer.addDendrite(optLayer);
        });
    });

    console.log(`神经网络已构建,输入层${this.iptLen},隐藏层${this.hidLen},输出层${this.optLen}`);
}

/**
 * [2,3,1]
 * @param {[type]} option [description]
 */
function BP(option) {
    this.struct = option.struct;

    this.network = [];

    for (let i = this.struct.length - 1; i >= 0; i--) {
        let layer = new Array(this.struct[i]).fill(0).map(v => new Neuron());
        if (this.network[0]) {
            this.network[0].map(connectNeuron => {
                layer.map(neuron => {
                    neuron.addDendrite(connectNeuron);
                });
            })
        }

        this.network.unshift(layer);
    }

    this.errornum = option.errornum;
    this.momentum = 0.1;
    this.eta = 0.3;


    console.log(`神经网络已构建,输入层${this.iptLen},隐藏层${this.hidLen},输出层${this.optLen}`);
}

/**
 * 训练函数
 * @param  datas = []
 * @param  datas[].input = [number]
 * @param  datas[].output = [number]
 */
BP.prototype.train = function(datas) {
    let errornum = 0;
    console.log("开始训练数据,数据长度为: " + datas.length)
    while (true) {
        let errSum = 0;
        let errAvg = 0;
        datas.forEach((data) => {
            this.forward(data.input);
            errornum =  this.calculateErr(data.output);
            this.adjustWeight();
        });
        errAvg = errSum/datas.length
        console.log("errornum:", errornum);
        // console.log("layers:", this.getLayers())
        // console.log("layers:", this.getLayer(2))
        // console.log("weights:", this.getWeights());
        if (errornum <= this.errornum) break;
    }

};

/**
 * 测试函数
 * @param  input = [number]
 */
BP.prototype.run = function(input) {
    console.log("开始预测, 预测数据为: ");
    console.log(input.join(","))
    this.forward(input);
    return this.getLayer(2);
};

/**
 * 获取层信号值
 * @param  level = number  层索引
 */
BP.prototype.getLayer = function(level) {
    return this.network[level].map(neuron=> neuron.value);
};

/**
 * 获取所有层信号值，从上至下
 */
BP.prototype.getLayers = function() {
    return this.network.map(layer => layer.map(neuron=> neuron.value));
}

/**
 * 获取单独层的树突权重(损失量)
 */
BP.prototype.getWeights = function(level) {
    return this.network[level].map(neuron=> Object.values(neuron.dendrites).map(dendrite=>dendrite.weight));
}

/**
 * 获取所有层的树突权重(损失量)
 */
BP.prototype.getWeights = function() {
    return this.network.map(layer=>layer.map(neuron=> Object.values(neuron.dendrites).map(dendrite=>dendrite.weight)));
}

/**
 * 内部函数，信号从输入层向前传导
 * @param  iptData = [number] 输入层获取的数据
 */
BP.prototype.forward = function(iptData) {
    this.network[0].map((n, i) => {
        n.receive(iptData[i]);
    });
}


BP.prototype._calculateErr = function(layer, errnums) {
    var errnum = 0;
    for (var i = 0; i < layer.length; i++) {
        var o = layer[i].value;

        var dendrites = Object.values(layer[i].dendrites);
        layer[i].delta = o * (1 - o) * errnums[i];
        errnum += Math.abs(layer[i].delta);
    }
    return errnum;
}

BP.prototype.calculateErr = function(target) {
    let errnum, result;
    let errnums = this.network[this.network.length - 1].map((neuron, i) => {
        return target[i] - neuron.value;
    });

    for (let i = this.network.length - 1; i > 0; i--) {
        errnum = this._calculateErr(this.network[i], errnums);
        errnums = new Array(this.network[i - 1].length).fill(errnum);
        if (i == this.network.length - 1) result = errnum;
        // console.log(`第${i+1}层误差值:${errnum}`)
    }

    return result;
}

/**
 * 调整权重实现
 * @param layer = [] 层
 */
BP.prototype._adjustWeight = function(layer) {
    for (var i = 0; i < layer.length; i++) {
        let dendrites = Object.values(layer[i].axon.dendrites);
        for (var j = 0; j < layer[i].axon.length; j++) {
            var newVal = this.momentum * dendrites[j].prevWeight + this.eta * layer[i].delta * dendrites[j].neuron.value;
            dendrites[j].weight += newVal;
            dendrites[j].prevWeight = newVal;

        }
    }
};

/**
 * 调整权重调用
 */
BP.prototype.adjustWeight = function() {
    for (let i = this.network.length - 1; i >= 0; i--) {
        this._adjustWeight(this.network[i]);
    }
};

module.exports = BP;

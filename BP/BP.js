var Neuron = require("./Neuron");

/**
 * 前馈神经网络
 * @example
 * option = {
 *     errornum: 0.005,
 *     momentum: 0.1,
 *     eta: option.eta || 0.3
 *     strcut: [2, 3, 1]
 * }
 */
function BP(option) {
    if (typeof option != 'object') throw new Error("option arg error.");
    if (typeof option.struct != 'object' || option.struct.length < 2)
        throw new Error("option.struct arg error.");
    if (!(typeof option.errornum == 'number' && option.errornum > 0 && option.errornum < 1))
        throw new Error("option.errornum arg error.");

    this.struct = option.struct;
    this.network = [];

    for (let i = this.struct.length - 1; i >= 0; i--) {
        let layer = new Array(this.struct[i]).fill(0).map(v => new Neuron());
        if (this.network[0]) {
            this.network[0].map(connectNeuron => {
                layer.map(neuron => {
                    neuron.addDendrite(connectNeuron);
                });
            });
        }

        this.network.unshift(layer);
    }

    // 处理截距(failed)
    // for (let i = 0; i < this.network.length - 1; i++) {
    //     let neuron = new Neuron(true);
    //     this.network[i + 1].map(connectNeuron => {
    //         neuron.addDendrite(connectNeuron);
    //     });
    //     this.network[i].push(neuron);
    // }

    this.errornum = option.errornum;
    this.momentum = option.momentum || 0.1;
    this.eta = option.eta || 0.5;


    console.log(`神经网络已构建`);
}

/**
 * 训练函数
 * @param  datas = []
 * @param  datas[].input = [number]
 * @param  datas[].output = [number]
 */
BP.prototype.train = function(datas) {
    console.log("开始训练数据,数据长度为: " + datas.length)
    let count = 1;
    while (true) {
        let errSum = 0;
        let errAvg = 0;
        datas.forEach((data) => {
            this.forward(data.input);
            errSum += this.calculateErr(data.output);
            this.adjustWeight();
        });
        errAvg = errSum / datas.length
        console.log("errornum:", errAvg);
        // console.log("layers:", this.getLayers())
        // console.log("weights:", this.getWeights());
        if (errAvg <= this.errornum) break;
        if (count===0) break;
    }



};

/**
 * 测试函数
 * @param  input = [number]
 */
BP.prototype.run = function(input) {
    console.log("开始预测, 预测数据为: ");
    this.forward(input);
    return this.getLayer(this.network.length-1);
};

/**
 * 内部函数，信号从输入层向前传导
 * @param  iptData = [number] 输入层获取的数据
 */
BP.prototype.forward = function(iptData) {
    this.network[0].map((n, i) => {
        n.receive(iptData[i]);
    });
}


BP.prototype._calculateErr = function(layer, target) {
    var errnum = 0;
    for (var i = 0; i < layer.length; i++) {
        var o = layer[i].value;
        var dendrites = Object.values(layer[i].dendrites);

        let x = 0;
        if (dendrites.length === 0) {
            x = target[i] - o; // 输出层误差计算

        } else {
            x = dendrites.reduce((total, dendrite) => {
                total += dendrite.weight * dendrite.connectNeuron.delta;
                return total;
            }, 0); // 其他隐藏层误差计算

        }

        layer[i].delta = o * (1 - o) * x;
        errnum += Math.abs(layer[i].delta);
    }

    return errnum;
}

BP.prototype.calculateErr = function(target) {
    let errnum, result;

    for (let i = this.network.length - 1; i > 0; i--) {
        errnum = this._calculateErr(this.network[i], target);
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

/**
 * 获取层信号值
 * @param  level = number  层索引
 */
BP.prototype.getLayer = function(level) {
    return this.network[level].map(neuron => neuron.value);
};

/**
 * 获取所有层信号值，从上至下
 */
BP.prototype.getLayers = function() {
    return this.network.map(layer => layer.map(neuron => neuron.value));
}

/**
 * 获取单独层的树突权重(损失量)
 */
BP.prototype.getWeights = function(level) {
    return this.network[level].map(neuron => Object.values(neuron.dendrites).map(dendrite => dendrite.weight));
}

/**
 * 获取所有层的树突权重(损失量)
 */
BP.prototype.getWeights = function() {
    return this.network.map(layer => layer.map(neuron => Object.values(neuron.dendrites).map(dendrite => dendrite.weight)));
}

module.exports = BP;

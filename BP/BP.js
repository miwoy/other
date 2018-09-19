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
 * 训练函数
 * @param  datas = []
 * @param  datas[].input = [number]
 * @param  datas[].output = [number]
 */
BP.prototype.train = function(datas) {
    let errornum = 0;
    console.log("开始训练数据,数据长度为: " + datas.length)
    while (true) {
        datas.forEach((data) => {
            this.forward(data.input);
            errornum = this.outputErr(data.output);
            this.hiddenErr();
            this.adjustWeight();
        });
        
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
    return this.getLayers()[level];
};

/**
 * 获取所有层信号值，从上至下
 */
BP.prototype.getLayers = function() {
    let layers = [];
    
    layers.push(this.input.map(layer => {
        return layer.value;
    }));
    layers.push(this.hidden.map(layer => {
        return layer.value;
    }));
    layers.push(this.output.map(layer => {
        return layer.value;
    }));

    return layers;
}

/**
 * 获取所有层的树突权重(损失量)
 */
BP.prototype.getWeights = function() {
    let weights = [];
    weights.push(this.output.map(layer => {
        weights.push(this.hidden.map(layer => {
            weights.push(this.input.map(layer => {
                return Object.values(layer.dendrites).map(dendrite => {
                    return dendrite.weight;
                });
            }));
            return Object.values(layer.dendrites).map(dendrite => {
                return dendrite.weight;
            });
        }));
        return Object.values(layer.dendrites).map(dendrite => {
            return dendrite.weight;
        });
    }));

    return weights;
}

/**
 * 内部函数，信号从输入层向前传导
 * @param  iptData = [number] 输入层获取的数据
 */
BP.prototype.forward = function(iptData) {
    this.input.map((n, i) => {
        n.receive(iptData[i]);
    });
}


/**
 * 计算输出层误差值，用于反向传播算法调整权重
 */
BP.prototype.outputErr = function(target) {
    var errSum = 0;
    for (var i = 0; i < this.optLen; i++) {
        var o = this.output[i].value;
        this.output[i].delta = o * (1 - o) * (target[i] - o);
        errSum += Math.abs(this.output[i].delta);
    }

    return errSum; // 总误差值
};

/**
 * 计算隐藏层误差值，用于反向传播算法调整权重
 */
BP.prototype.hiddenErr = function() {
    var errSum = 0;
    for (var i = 0; i < this.hidLen; i++) {
        var o = this.hidden[i].value;
        var sum = 0;
        var dendrites = Object.values(this.hidden[i].dendrites);
        for (var j = 0; j < this.optLen; j++)
            sum += dendrites[j].weight * dendrites[j].connectNeuron.delta;
        this.hidden[i].delta = o * (1 - o) * sum;
        errSum += Math.abs(this.hidden[i].delta);
    }
    return errSum;
};

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

    this._adjustWeight(this.output);
    this._adjustWeight(this.hidden);
    
};

module.exports = BP;

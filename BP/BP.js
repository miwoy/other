var ini = {
    eta: 0.25,
    momentum: 0.9
};

/**
 * BPNN.
 * 
 * @author RenaQiu
 * 
 */
function BP(inputSize, hiddenSize, outputSize) {
    /**
     * input vector.
     */
    // private final double[] input;
    this.input = new Array(inputSize + 1);
    each(this.input, function(v, i) { this.input[i] = 0.0; }, this);
    /**
     * hidden layer.
     */
    //private final double[] hidden;
    this.hidden = new Array(hiddenSize + 1);
    each(this.hidden, function(v, i) { this.hidden[i] = 0.0; }, this);
    /**
     * output layer.
     */
    // private final double[] output;
    this.output = new Array(outputSize + 1);
    each(this.output, function(v, i) { this.output[i] = 0.0; }, this);
    /**
     * target.
     */
    // private final double[] target;
    this.target = new Array(outputSize + 1);
    each(this.target, function(v, i) { this.target[i] = 0.0; }, this);

    /**
     * delta vector of the hidden layer .
     */
    // private final double[] hidDelta;
    this.hidDelta = new Array(hiddenSize + 1);
    each(this.hidDelta, function(v, i) { this.hidDelta[i] = 0.0; }, this);
    /**
     * output layer of the output layer.
     */
    // private final double[] optDelta;
    this.optDelta = new Array(outputSize + 1);
    each(this.optDelta, function(v, i) { this.optDelta[i] = 0.0; }, this);


    /**
     * learning rate.
     */
    // private final double eta;
    this.eta = ini.eta;
    /**
     * momentum.
     */
    // private final double momentum;
    this.momentum = ini.momentum;

    /**
     * weight matrix from input layer to hidden layer.
     */
    // private final double[][] iptHidWeights;
    this.iptHidWeights = new Array(inputSize + 1);
    each(this.iptHidWeights, function(v, i) {
        this.iptHidWeights[i] = new Array(hiddenSize + 1);
        each(this.iptHidWeights[i], function(v, j) { this.iptHidWeights[i][j] = 0.0; }, this);
    }, this);
    /**
     * weight matrix from hidden layer to output layer.
     */
    // private final double[][] hidOptWeights;
    this.hidOptWeights = new Array(hiddenSize + 1);
    each(this.hidOptWeights, function(v, i) {
        this.hidOptWeights[i] = new Array(outputSize + 1);
        each(this.hidOptWeights[i], function(v, j) { this.hidOptWeights[i][j] = 0.0; }, this);
    }, this);

    /**
     * previous weight update.
     */
    // private final double[][] iptHidPrevUptWeights;
    this.iptHidPrevUptWeights = new Array(inputSize + 1);
    each(this.iptHidPrevUptWeights, function(v, i) {
        this.iptHidPrevUptWeights[i] = new Array(hiddenSize + 1);
        each(this.iptHidPrevUptWeights[i], function(v, j) { this.iptHidPrevUptWeights[i][j] = 0.0; }, this);
    }, this);
    /**
     * previous weight update.
     */
    // private final double[][] hidOptPrevUptWeights;
    this.hidOptPrevUptWeights = new Array(hiddenSize + 1);
    each(this.hidOptPrevUptWeights, function(v, i) {
        this.hidOptPrevUptWeights[i] = new Array(outputSize + 1);
        each(this.hidOptPrevUptWeights[i], function(v, j) { this.hidOptPrevUptWeights[i][j] = 0.0; }, this);
    }, this);

    // public double optErrSum = 0d;
    this.optErrSum = 0;

    // public double hidErrSum = 0d;
    this.hidErrSum = 0;


    // private final Random random;
    randomizeWeights(this.iptHidWeights);
    randomizeWeights(this.hidOptWeights);

}

/**
 * Entry method. The train data should be a one-dim vector.
 * 
 * @param trainData  double[]
 * @param target  double[]
 */
BP.prototype.train = function(trainData, target) {
    this.loadInput(trainData);
    this.loadTarget(target);
    this.forward();
    this.calculateDelta();
    this.adjustWeight();
};

/**
 * Test the BPNN.
 * 
 * @param inData double[]
 * @return double[]
 */
BP.prototype.test = function(inData) {
    if (inData.length !== this.input.length - 1) {
        throw new Error("Size Do Not Match.");
    }
    this.input = [this.input[0]].concat(inData);
    this.forward();
    return this.getNetworkOutput();
};

/**
 * Return the output layer.
 * 
 * @return double[]
 */
BP.prototype.getNetworkOutput = function() {
    var len = this.output.length;
    var temp = new Array(len - 1);
    for (var i = 1; i !== len; i++)
        temp[i - 1] = this.output[i];
    return temp;
};

/**
 * Load the target data.
 * 
 * @param arg double[] 
 */
BP.prototype.loadTarget = function(arg) {
    if (arg.length !== this.target.length - 1) {
        throw new Error("Size Do Not Match.");
    }

    this.target = [this.target[0]].concat(arg);
};

/**
 * Load the training data.
 * 
 * @param inData
 */
BP.prototype.loadInput = function(inData) {
    if (inData.length !== this.input.length - 1) {
        throw new Error("Size Do Not Match.");
    }

    this.input = [this.input[0]].concat(inData);
};

/**
 * Forward.
 * 
 * @param layer0 double[] 
 * @param layer1 double[] 
 * @param weight double[][] 
 */
BP.prototype._forward = function(layer0, layer1, weight) {
    // threshold unit.
    layer0[0] = 1.0;
    for (var j = 1, len = layer1.length; j !== len; ++j) {
        var sum = 0;
        for (var i = 0, len2 = layer0.length; i !== len2; ++i)
            sum += weight[i][j] * layer0[i];
        layer1[j] = sigmoid(sum);
    }
};

/**
 * Forward.
 */
BP.prototype.forward = function() {
    this._forward(this.input, this.hidden, this.iptHidWeights);
    this._forward(this.hidden, this.output, this.hidOptWeights);
};

/**
 * Calculate output error.
 */
BP.prototype.outputErr = function() {
    var errSum = 0;
    for (var idx = 1, len = this.optDelta.length; idx !== len; ++idx) {
        var o = this.output[idx];
        this.optDelta[idx] = o * (1 - o) * (this.target[idx] - o);
        errSum += Math.abs(this.optDelta[idx]);
    }
    this.optErrSum = errSum;
};

/**
 * Calculate hidden errors.
 */
BP.prototype.hiddenErr = function() {
    var errSum = 0;
    for (var j = 1, len = this.hidDelta.length; j !== len; ++j) {
        var o = this.hidden[j];
        var sum = 0;
        for (var k = 1, len2 = this.optDelta.length; k !== len2; ++k)
            sum += this.hidOptWeights[j][k] * this.optDelta[k];
        this.hidDelta[j] = o * (1 - o) * sum;
        errSum += Math.abs(this.hidDelta[j]);
    }
    this.hidErrSum = errSum;
};

/**
 * Calculate errors of all layers.
 */
BP.prototype.calculateDelta = function() {
    this.outputErr();
    this.hiddenErr();
};

/**
 * Adjust the weight matrix.
 * 
 * @param delta double[] 
 * @param layer double[] 
 * @param weight double[][] 
 * @param prevWeight double[][] 
 */
BP.prototype._adjustWeight = function(delta, layer, weight, prevWeight) {
    layer[0] = 1;
    for (var i = 1, len = delta.length; i !== len; ++i) {
        for (var j = 0, len2 = layer.length; j !== len2; ++j) {
            var newVal = this.momentum * prevWeight[j][i] + this.eta * delta[i] * layer[j];
            weight[j][i] += newVal;
            prevWeight[j][i] = newVal;
        }
    }
};

/**
 * Adjust all weight matrices.
 */
BP.prototype.adjustWeight = function() {
    this._adjustWeight(this.optDelta, this.hidden, this.hidOptWeights, this.hidOptPrevUptWeights);
    this._adjustWeight(this.hidDelta, this.input, this.iptHidWeights, this.iptHidPrevUptWeights);
};

/**
 * Sigmoid.
 * 
 * @param val double
 * @return double
 */
function sigmoid(val) {
    return 1 / (1 + Math.exp(-val));
}

function randomizeWeights(matrix) {
    for (var i = 0, len = matrix.length; i !== len; i++)
        for (var j = 0, len2 = matrix[i].length; j !== len2; j++) {
            matrix[i][j] = Math.random() * 2 - 1;
        }
}

function each(array, callback, ctx) {
    for (var i = 0; i < array.length; i++) {
        callback.call(ctx, array[i], i);
    }
}

module.exports = BP;

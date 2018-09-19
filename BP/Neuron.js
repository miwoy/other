var uuid = require("node-uuid");

/**
 * 本应当信号实时收集，实时判断是否激活传递信号。
 * 此处为了试用反向传播而加了强制约束
 */
function Neuron() {
	this.id = uuid.v4(); // 神经元唯一标识
	this.value = 0; // 兴奋状态，向下传递
	this.dendrites = {}; // 拥有的树突数量
	this.axon = { length: 0, dendrites: {} }; // 连接树突的数量
	this.signalCount = 0; // 信号数量，用来判断是否已经接受完全部上层信号（可优化，信号逐步式传递）
	this.delta = 0; // 反向传播算法使用的神经元误差
}

// 冲激值，达到该值时神经元才做有效信号传递
Neuron.threshold = 0;

/**
 * 冲激函数
 */
Neuron.prototype.sigmoid = function(val) {
	return 1 / (1 + Math.exp(-val));
}

/**
 * 新增树突
 * @param {[type]} connectNeuron [description]
 */
Neuron.prototype.addDendrite = function(connectNeuron) {
	let dendrite = new Dendrite(this, connectNeuron);
	this.dendrites[dendrite.id] = dendrite;
}

/**
 * 接受信号
 */
Neuron.prototype.receive = function(value) {

	if (this.signalCount >= this.axon.length) {
		this.value = 0;
		this.signalCount = 0;
	}
	this.value += value;
	this.signalCount++;
	if (this.signalCount >= this.axon.length) { // 搜集满
		this.value = this.sigmoid(this.value);
		Object.keys(this.dendrites).map(key => {
			this.dendrites[key].transfer();
		});

	}
}

/**
 * 树突
 * 使用 id 的目的是为了方便寻找，如果有一点在树突中想要做一些比如销毁此树突时方便从神经元上删掉
 */
function Dendrite(neuron, connectNeuron) {
	this.id = uuid.v4(); // 唯一标识
	this.neuron = neuron; // 所在神经元, 作为反向寻找字段
	this.connectNeuron = connectNeuron; // 连接的下层神经元
	connectNeuron.axon.length++;
	connectNeuron.axon.dendrites[this.id] = this;
	this.weight = Math.random() * 2 - 1; // 初始化权重, -1至1之间
	this.prevWeight = 0; // 上一次权重值，此字段只为了调整权重时用
}

/**
 * 树突的信号传递
 */
Dendrite.prototype.transfer = function() {
	this.connectNeuron.receive(this.weight * this.neuron.value);
}

module.exports = Neuron;

var uuid = require("node-uuid");

/**
 * 本应当信号实时收集，实时判断是否激活传递信号。
 * 此处为了试用反向传播而加了强制约束
 */
function Neuron() {
	this.id = uuid.v4();
	this.value = 0; // 兴奋状态，达到刺激点后向下传递
	this.dendrites = {};
	this.axon = { length: 0, dendrites: {} }; // 连接树突的数量
	this.signalCount = 0;

	this.delta = 0;
}

Neuron.threshold = 0;

Neuron.prototype.sigmoid = function(val) { // 冲激函数
	return 1 / (1 + Math.exp(-val));
}

Neuron.prototype.addDendrite = function(connectNeuron) {
	let dendrite = new Dendrite(this, connectNeuron);
	this.dendrites[dendrite.id] = dendrite;
}

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

function Dendrite(neuron, connectNeuron) {
	this.id = uuid.v4();
	this.neuron = neuron;
	this.connectNeuron = connectNeuron;
	connectNeuron.axon.length++;
	connectNeuron.axon.dendrites[this.id] = this;
	this.weight = Math.random() * 2 - 1;
	this.prevWeight = 0;
}

Dendrite.prototype.transfer = function() {
	this.connectNeuron.receive(this.weight * this.neuron.value);
}

module.exports = Neuron;

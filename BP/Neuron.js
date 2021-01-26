var uuid = require("uuid");

/**
 * 本应当信号实时收集，实时判断是否激活传递信号。
 * 此处为了试用反向传播而加了强制约束
 */
class Neuron {
	constructor() {
		this.id = uuid.v4(); // 神经元唯一标识
		this.value = 0; // 信号值，向下传递
		this.dendrites = []; // 拥有的树突数量
		this.axon = new Axon(this); // 连接树突的数量，轴突发送信号
		this.signalCount = 0; // 信号数量，用来判断是否已经接受完全部上层信号（可优化，信号逐步式传递）
		this.delta = 0; // 反向传播算法使用的神经元误差
	}
	static threshold = 0 // 冲激值，达到该值时神经元才做有效信号传递
	/**
	 * 冲激函数
	 */
	sigmoid(val) {
		return 1 / (1 + Math.exp(-val));
	}
	/**
	 * 胞体的信号传递
	 * 胞体->轴突
	 */
	transfer(value) {

		if (this.signalCount >= this.axon.length) { // 下一次接受信号时，先初始化考量参数
			this.value = 0;
			this.signalCount = 0;
		}
		this.value += value;
		this.signalCount++;
		if (this.signalCount >= this.dendrites.length) { // 搜集满
			this.axon.transfer(this.sigmoid(this.value));
		}
	}
	/**
	 * 新增树突
	 * @param {[type]} connectNeuron [description]
	 */
	addDendrite(axon) {
		let dendrite = new Dendrite(this, axon);
		axon.dendrites.push(dendrite);
		this.dendrites.push(dendrite);
	}

}



/**
 * 树突-信号收集
 * 使用 id 的目的是为了方便寻找，如果有一点在树突中想要做一些比如销毁此树突时方便从神经元上删掉
 */
class Dendrite {
	constructor(neuron, axon) {
		this.id = uuid.v4(); // 唯一标识
		this.neuron = neuron; // 所在神经元, 作为反向寻找字段
		this.axon = axon; // 连接的下层神经元
		this.weight = Math.random() * 2 - 1; // 初始化权重, -1至1之间
		this.prevWeight = 0; // 上一次权重值，此字段只为了调整权重时用
	}
	/**
	 * 树突的信号传递
	 * 树突->胞体
	 */
	transfer(value) {
		this.neuron.transfer(this.weight * value);
	}
}

class Axon {
	constructor(neuron) {
		this.id = uuid.v4(); // 唯一标识
		this.neuron = neuron; // 所在神经元, 作为反向寻找字段
		this.dendrites = []; // 连接的树突
		this.value = 0;
	}
	/**
	 * 轴突的信号传递
	 * 轴突->树突
	 */
	transfer(value) {
		this.value = value;
		this.dendrites.map(dendrite => {
			dendrite.transfer(this.value);
		});
	}
}

module.exports = Neuron;
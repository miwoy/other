/**
 * 模块名称：对象类（人类基类）
 * 模块类型：生物（类）
 * 描述：基本对象类型，可被继承
 * 作者：Joyee
 * 创建时间：2014/6/30
 * 修改时间：2014/6/30
 * 版本：0.0.1
 */

var living = require("../conf/living");
var events = require("events");
var emitter = new events.EventEmitter();

// person类
function Person(name, types) {
	//events.EventEmitter.call(this);
	var self = this; //	自身对象
	var TYPE = living.YES
	this.emitter = emitter; //  事件监听器
	this.news = []; //  消息队列

	// 属性：名称
	this.name = name;
	this.emitter.on("ForName", function(n) {
		if (self.name === n) {
			self.emitter.emit("RaiseHand", self); // RaiseHand 举手模式
		}
	});

	// 属性：类型（可处理消息的类型）
	this.types = types; // 可能是数组
	this.emitter.on("ForType", function(t) {
		// 判读类型是否相等 
		// [冗余代码出]
		for (var p in self.types.value) {
			if (self.types.value.hasOwnProperty(p)) {
				if (self.types.value[p] == t) {
					self.emitter.emit("RaiseHand", self);
					break;
				}
			}
		}
	});

	this.emitter.on('hasNews', function(mes) {
		for (var p in self.types.value) {
			if (self.types.value.hasOwnProperty(p)) {
				if (self.types.value[p] == mes.type) {
					console.log("I'm ", self.name, ".I listen in a ", mes.type, " news, is {", mes.value, "}");
					break;
				}
			}
		}
		self.news.push(mes);
	});
}

Person.prototype.sayNews = function(message) {
	this.emitter.emit("hasNews", message);
}

module.exports = Person;
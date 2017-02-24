/**
 * 模块名称：事件
 * 模块类型：抽象 （类）
 * 描述：建立一个事件池。有用新增，触发，移除等功能
 * 作者：Joyee
 * 创建时间：2014/6/30
 * 修改时间：2014/7/22
 * 版本：0.1.1
 */

function Event(name) {
	var _events = {};
	this.name = name || "";

	// 注册事件
	if (!this.on) {
		Event.prototype.on = function(evtName, handler) {
			if (!_events.hasOwnProperty(evtName)) {
				_events[evtName] = [];
			}
			_events[evtName].push(handler);
		}
	}

	// 触发事件
	if (!this.emit) {
		Event.prototype.emit = function(evtName, message) {
			if (_events.hasOwnProperty(evtName)) {
				var i,
					evts = [];
				evts = _events[evtName];
				for (i = 0; i < evts.length; ++i) {
					evts[i](message);
				}
			} else {
				console.error('没有事件' + evtName + '相关信息');
			}
		}
	}

	// 移除事件
	if (!this.remove) {
		Event.prototype.remove = function(evtName, funcName) {

			// 没有参数时，移除所有
			// 一个参数时，移除evtName事件
			// 两个参数时，移除evtName事件下指定名称的处理函数
			// 如果第二个参数为数字时，移除指定索引下的处理函数
			if (arguments.length === 0) { // 没有参数
				_.event.length = 0;
			} else if (arguments.length === 1) { // 一个参数
				if (_events.hasOwnProperty(evtName)) {
					delete _events[evtName];
				} else {
					console.error('不存在的事件名：', evtName);
				}
			} else if (arguments.length === 2) { // 两个参数
				if (_events.hasOwnProperty(evtName)) {

					if (typeof funcName === 'string') {
						_events[evtName].forEach(function(key, value) {
							if (value.name === funcName) {
								_events[evtName].splice(key, 1);
							}
						});
					} else if (typeof funcName === 'number') {
						_events[evtName].splice(funcName, 1);
					} else {
						console.error('不可处理的参数类型:', funcName, '\n', typeof funcName);
					}
				} else {
					console.error('不存在的事件名：', evtName);
				}
			}
		}
	}

	// 查找事件
	if (!this.find) {
		Event.prototype.find = function(evtName) {
			if (_events.hasOwnProperty(evtName)) {
				return _events[evtName];
			} else {
				return [];
			}

		}
	}
}

// 创建一个事件池
function createEvents(name) {
	return new Event(name);
}

exports.createEvents = createEvents;
exports.Events = Event;
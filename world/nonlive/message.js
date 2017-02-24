/**
 * 模块名称：消息基类
 * 模块类型：非生物（类）
 * 描述：基本的消息类型，可被集成
 * 作者：Joyee
 * 创建时间：2014/6/30
 * 修改时间：2014/6/30
 * 版本：0.0.1
 */

var living = require("../conf/living");

//	消息类
function Message(value, type) {
	var TYPE = living.NO;
	this.value = value;	
	this.type = type;
}

module.exports = Message;
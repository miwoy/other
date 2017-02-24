/**
 * 模块名称：配置文件
 * 模块类型：非生物（对象）
 * 描述：配置数据（已填充）
 * 作者：Joyee
 * 创建时间：2014/6/30
 * 修改时间：2014/6/30
 * 版本：0.0.1
 */

var living = require("./conf/living");

// 消息类型 sound：声音，image：影像，feel：触感，
// 					taste：味道，smell：气味，other：其他
var types = {
	value: {
		"sound": 0,
		"image": 1,
		"feel": 2,
		"taste": 3,
		"smell": 4,
		"other": 5
	},
	TYPE: living.NO
}
exports.types = types;
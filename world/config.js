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
		"sound": 'sound',
		"image": 'image',
		"feel": 'feel',
		"taste": 'taste',
		"smell": 'smell',
		"other": 'other'
	},
	TYPE: living.NO
}
exports.types = types;
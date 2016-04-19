var  mongoose = require('../common/mongo');

/**
 * mongodb map
 */
var atomSchema = new mongoose.Schema({
    key: {
    	type: String,
    	index: true
    },
    value: {
    	type: String
    },
    type: {
    	type: String
    },
    _ref: {  // 引用
    	type: String
    },
    _logIds: {  // 被引用
        type: [mongoose.Schema.Types.ObjectId]
    }
});

/**
 * value Type: [text,voice,video,image}  暂限于文本
 */

module.exports = mongoose.model('Atom', atomSchema);
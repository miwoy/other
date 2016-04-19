var  mongoose = require('../common/mongo');

/**
 * mongodb map
 */
var logSchema = new mongoose.Schema({
    log: {
        type: String   // 仅限于文本
    },
    createTime: {
        type: Date
    },
    _ref: {
        type: [String]  // atom key
    }
});


module.exports = mongoose.model('Log', logSchema);
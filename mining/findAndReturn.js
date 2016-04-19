/**
 * 查找并执行策略并返回结果
 */

var Segment = require('segment');
var crypto = require('crypto');
var logModel = require('./models/log');
var atomModel = require('./models/atom');
var x = require('x-flow');
var _ = require('underscore');

module.exports = function(str, callback) {
    var segment = new Segment();
    segment.useDefault();
    var arry = segment.doSegment(str, { simple: true, stripPunctuation: true }); // 分词
    var directive = arry[0];
    arry = arry.slice(1);
    switch (arry[0]) {
        case 'f':
        case 'find':
        case '查找':
            directive = 'f';

            break;
        case 'c':
        case 'create':
        case '写入':
        case '创建':
        case '新增':
        case 'insert':
            directive = 'c';
            break;
    }
    x.begin()
        .step(function(ctx) {
            log(directive, arry, function(err, result) {
                if (err) {
                    return ctx.err(err);
                }

                ctx.logId = result;

                if (directive === 'f') {
                    ctx.go(1);
                } else {
                    ctx.go(2);
                }
            });
        })
        .step(function(ctx) {
            find(arry, function(err, result) {
                if (err) {
                    return ctx.err(err);
                }

                ctx.result = result;
                ctx.next();
            });
        })
        .step(function(ctx) {
            create(arry, ctx.logId, function(err, result) {
                if (err) {
                    return ctx.err(err);
                }


                if (!ctx.result || ctx.result.length === 0) {
                    if (result) {
                        ctx.result = "保存成功！";
                    } else {
                        ctx.result = "保存失败！";
                    }
                }

                ctx.end();
            });
        })
        .exec(function(err, results) {
            callback(err, results && results[0].result);
        });
};

function find(arry, callback) {
    x.begin()
        .step(function(ctx) {
            x.eachSync(arry, function(item) {
                var self = this;
                atomModel.findOne({ key: MD5(item) }, { value: 1, _logIds: 1, _ref: 1 }, function(err, result) {
                    if (err) {
                        return self.err(err);
                    }


                    if (result) {
                        self._logIds = self._logIds || result._logIds;
                        self._logIds = _.intersection(self._logIds, result._logIds);
                        if (self._logIds.length <= 1) {
                            self.end();
                        } else {
                            self.next();
                        }
                    } else {
                        self.next();
                    }

                });
            }, function(err, results) {
                if (err) {
                    return ctx.err(err);
                }

                ctx._logIds = results[0]._logIds;
                ctx.next();
            });
        })
        .step(function(ctx) {

        	logModel.find({_id: {$in:ctx._logIds}}, {log:1,_ref:1,createTime:1}, function(err,result) {
        		if (err) {
        			return ctx.err(err);
        		}

        		ctx.result = result;
        		ctx.next();
        	});

            // x.each(ctx._logIds, function(id) {
            //     var self = this;
            //     logModel.find({ _id: id }, { log: 1, _ref: 1, createTime: 1 }, function(err, result) {
            //         if (err) {
            //             return self.err(err);
            //         }

            //         self.result = result;
            //         self.end();

            //     });
            // }, function(err, results) {
            //     if (err) {
            //         return ctx.err(err);
            //     }


            //     ctx.result = [];
            //     _.each(results, function(item) {
            //         ctx.result.push(item.result);
            //     });

            //     ctx.next();
            // });
        })
        .step(function(ctx) {
            x.each(ctx.result, function(item) {
                var self = this;
                atomModel.find({ key: { $in: item._ref } }, { value: 1 }, function(err, result) {
                    if (err) {
                        return ctx.err(err);
                    }

                    console.log(result);
                    item.ref = result;
                    self.end();
                });
            }, function(err, results) {
                if (err) {
                    return ctx.err(err);
                }

                ctx.end();
            });
        })
        .exec(function(err, results) {
            callback(err, results && results[0].result);
        });
}

function create(arry, logId, callback) {
    x.begin()
        .step(function(ctx) {

            x.each(arry, function(item, index) {
                var self = this;
                atomModel.findOne({ key: MD5(item) }, null, function(err, result) {
                    if (err) {
                        return self.err(err);
                    }

                    if (result) {
                        result._logIds = result._logIds || [];
                        result._logIds.push(logId);
                        result.save(function(err, result) {
                            if (err) {
                                return self.err(err);
                            }

                            self.end();
                        });
                    } else {
                        atomModel.create({ key: MD5(item), value: item, _logIds: [logId], _ref: [((index + 1) < arry.length ? arry[index + 1] : undefined)] }, function(err, result) {
                            if (err) {
                                return self.err(err);
                            }

                            self.end();
                        });
                    }
                });
            }, function(err, results) {
                if (err) {
                    return ctx.err(err);
                }
                ctx.next();
            });
        })
        .step(function(ctx) {
            logModel.findOne({ _id: logId }, null, function(err, result) {
                if (err) {
                    return ctx.err(err);
                }

                if (result) {
                    result._ref = result._ref || [];
                    _.each(arry, function(item) {
                        result._ref.push(MD5(item));
                    });

                    ctx.log = result;
                }

                ctx.next();
            });
        })
        .step(function(ctx) {
            console.log("w")
            if (!ctx.log) return ctx.end();
            ctx.log.save(function(err, result) {
                if (err) {
                    return ctx.err(err);
                }

                ctx.result = true;
                ctx.end();
            });
        })
        .exec(function(err, results) {
            callback(err, results && results[0].result);
        });
}

function log(directive, str, callback) {
    var directiveKey = MD5(directive);
    x.begin()
        .step(function(ctx) {
            atomModel.findOne({ key: directiveKey }, null, function(err, result) {
                if (err) {
                    return ctx.err(err);
                }

                if (result) {
                    ctx.directive = result;
                    ctx.go(2);
                } else {
                    ctx.go(1);
                }
            });
        })
        .step(function(ctx) {
            atomModel.create({ key: directiveKey, value: directive, _ref: [], _logIds: [] }, function(err, result) {
                if (err) {
                    return ctx.err(err);
                }
                ctx.directive = result;
                ctx.next();
            });
        })
        .step(function(ctx) {
            logModel.create({ log: str, createTime: new Date(), _ref: [directiveKey] }, function(err, result) {
                if (err) {
                    return ctx.err(err);
                }

                ctx.directive._logIds.push(result._id);
                ctx.result = result._id;
                ctx.next();
            });
        })
        .step(function(ctx) {
            ctx.directive.save(function(err) {
                if (err) {
                    return ctx.err(err);
                }

                ctx.end();
            });
        })
        .exec(function(err, results) {
            if (err) {
                return callback(err);
            }

            callback(null, results[0].result);
        });
}

function MD5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

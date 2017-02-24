/**
 * 模块名称：运行环境
 * 模块类型：非生物（对象/环境）
 * 描述：对象交互环境，参与对象创建，消息传递
 * 作者：Joyee
 * 创建时间：2014/6/30
 * 修改时间：2014/6/30
 * 版本：0.0.1
 */
var living = require("./conf/living");
var config = require("./config");
var Person = require("./live/person");
var Message = require("./nonlive/message");

var gkb = new Person("guankaobo", config.types);
var my = new Person("mayi", config.types);
var cwb = new Person("chenweibing", config.types);

cwb.findResult = [];
cwb.output = function(q) {
    var query = q;
    // console.log("查询结果：", cwb.findResult, "\n 查询条件：", q);
}
cwb.emitter.on("RaiseHand", function(mes) {
    cwb.findResult.push(mes);
    console.log(`Here, I'm ${mes.name}, I raised my hand.`);
});

cwb.findForName = function(name) {
	console.log(`Name is ${name}, Please raise hand.`)
    this.emitter.emit("ForName", name);
    return name;
}

cwb.findForType = function(type) {
	console.log(`Type is ${type}, Please raise hand.`)
    this.emitter.emit("ForType", type);
    return type;
}


module.exports = function() {
    gkb.sayNews(new Message("Hello world!", config.types.value["sound"]));
    my.sayNews(new Message("Hey!", config.types.value["sound"]));
    cwb.findForType(config.types.value["sound"]);
    cwb.findForName("guankaob");

}

var events = require("./event").createEvents();

events.on("test", function(mes){
	setTimeout(function(){console.log("测试事件1,事件内容：",mes);},1000);
	
});

events.on("test", function(mes){
	console.log("测试事件2,事件内容：",mes);
});

events.on("test", function(mes){
	console.log("测试事件3,事件内容：",mes);
});

events.emit("test", "success!");
console.log(events.find("test"));
events.remove("test", 0);
console.log(events.find("test"));

var func = function(arg){
	console.log(arguments);
}
var {Context, Entity, Atom} = require("./main");


// 环境对象，用于存储生成的实体




var target = {
	0:1,
	1:0,
	2:0,
	3:0,
	4:1,
	5:1,
	6:0,
	7:1,
	8:0,
	9:1,
	10:0,
	11:0,
	12:1,
	13:1,
	14:0,
	15:1
};

let context =  new Context({
	DNALength: 16,
	bit: 1
})

console.time("耗时：")
context.validate = function(entity) {
	var num = 0;
	var length = 0;
	for(var v in entity.DNA) {
		length++;
		if (target[v] === entity.DNA[v]) num++;
	}

	if (num/length===1) {
		console.timeEnd("耗时：");
		console.log("success", entity);
	}
	return num/length;
};

context.run();







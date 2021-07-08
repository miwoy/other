var {Context, Entity, Atom} = require("./main");


// 环境对象，用于存储生成的实体

/**
 * 动态参数(动态环境)
 * 1. 动态变异率，混乱程度决定变异效率
 * 2. 动态变异程度，混乱程度决定变异程度
 * 3. 动态种群簇
 * 4. 动态预期（适用性越高越好策略）
 * 5. 多种数据类型共同验证
 */



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
		console.log("success", Object.values(entity.DNA).join(","));
	}
	return num/length;
};

context.run();







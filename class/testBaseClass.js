const BaseClass = require('./BaseClass')


let baseClass = new BaseClass()

// 测试 x 为空时出现非空验证异常
try {
	console.log('success,', baseClass.exampleFunc())
} catch(err) {
	if (err instanceof baseClass.RequiredException) console.log("测试 x 为空时出现非空验证异常, ok");
	else console.log("测试 x 为空时出现非空验证异常, failure", err);
}


// 测试 x 为非数值类型时出现类型验证异常
try {
	console.log('success,', baseClass.exampleFunc('2'))
} catch(err) {
	if (err instanceof baseClass.TypeException) console.log("测试 x 为非数值类型时出现类型验证异常, ok");
	else console.log("测试 x 为非数值类型时出现类型验证异常, failure", err);
}

// 测试 x 不是 0-5 之间的数字时出现限制验证异常
try {
	console.log('success,', baseClass.exampleFunc(-1))
} catch(err) {
	if (err instanceof baseClass.LimitException) console.log("测试 x 不是 0-5 之间的数字时出现限制验证异常, ok");
	else console.log("测试 x 不是 0-5 之间的数字时出现限制验证异常, failure", err);
}

// 测试 y 存在且类型不为 string 时出现类型验证异常
try {
	console.log('success,', baseClass.exampleFunc(2, 2))
} catch(err) {
	if (err instanceof baseClass.TypeException) console.log("测试 y 存在且类型不为 string 时出现类型验证异常, ok");
	else console.log("测试 y 存在且类型不为 string 时出现类型验证异常, failure", err);
}

// 测试 z 为空时出现非空验证异常
try {
	console.log('success,', baseClass.exampleFunc(2, '2'))
} catch(err) {
	if (err instanceof baseClass.RequiredException) console.log("测试 z 为空时出现非空验证异常, ok");
	else console.log("测试 z 为空时出现非空验证异常, failure", err);
}

// 测试 z 为非数值类型时出现类型验证异常
try {
	console.log('success,', baseClass.exampleFunc(2, '2', '2'))
} catch(err) {
	if (err instanceof baseClass.TypeException) console.log("测试 z 为非数值类型时出现类型验证异常, ok");
	else console.log("测试 z 为非数值类型时出现类型验证异常, failure", err);
}

// 测试 z 为0时出现限制验证异常
try {
	console.log('success,', baseClass.exampleFunc(2, '2', 0))
} catch(err) {
	if (err instanceof baseClass.LimitException) console.log("测试 z 为0时出现限制验证异常, ok");
	else console.log("测试 z 为0时出现限制验证异常, failure", err);
}

// 测试 x,y,z 正常时得到一个字符串类型的返回值
try {
	let r = baseClass.exampleFunc(2, '2', 1);
	if (r==='22')
		console.log("测试 x,y,z 正常时得到一个字符串类型的返回值, ok");
	else
		console.error(`测试 x,y,z 正常时得到一个字符串类型的返回值, failure. 预期得到字符串'22' 实际得到 ${typeof r}:${r}`);
} catch(err) {
	console.log("测试 x,y,z 正常时得到一个字符串类型的返回值, failure", err);
}


const BaseClass = require('./BaseClass');


class Example extends BaseClass {
	constructor() {
		super()
	}

	test(msg) {
		const metas = [new this.ArgsStruct({
			name: 'test',
			validator: {
				required: true,
				type: String,
				limit: (propName, propType, propValue)=> {
					if (propValue.length>10) throw new this.LimitException(`${propName} 必须小于10个字符。`)
				}
			}
		})]

		try {
			this.validate(metas, arguments);
			console.log(msg);
		} catch (err) {
			if (err instanceof this.Exception) throw err;
			else throw new this.UnknowError();
			// console.log(err)
		}
	}
}


Example.test = ()=> {

	const example = new Example();
	console.log(example.Exception)
	// 测试 test msg 为空时出现非空验证异常
	try {
		example.test()
		console.log("测试 test msg 为空时出现非空验证异常, failure, 未抛出异常");
	} catch(err) {
		if (err instanceof example.RequiredException) console.log("测试 test msg 为空时出现非空验证异常, ok");
		else console.log("测试 test msg 为空时出现非空验证异常, failure", err);
	}

	// 测试 test msg 为非字符串时时出现类型验证异常
	try {
		example.test(2)
		console.log("测试 test msg 为非字符串时时出现类型验证异常, failure, 未抛出异常");
	} catch(err) {
		if (err instanceof example.TypeException) console.log("测试 test msg 为非字符串时时出现类型验证异常, ok");
		else console.log("测试 test msg 为非字符串时时出现类型验证异常, failure", err);
	}

	// 测试 test msg 字符超过10个时时出现限制验证异常
	try {
		example.test('11111111111')
		console.log("测试 test msg 字符超过10个时时出现限制验证异常, failure, 未抛出异常");
	} catch(err) {
		if (err instanceof example.LimitException) console.log("测试 test msg 字符超过10个时时出现限制验证异常, ok");
		else console.log("测试 test msg 字符超过10个时时出现限制验证异常, failure", err);
	}
}

Example.test()
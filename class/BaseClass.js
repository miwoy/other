/* 
Author: Miwoes
Date: 2019-01-08

参数： 接口
个数
顺序
类型
限制
参数检测
个数检测
顺序检测
类型检测
限制检测
异常
参数异常
引用异常
其他非预知异常

预知异常：
参数检测异常， 对外部传进来的参数限定， 而调用者未曾遵守约定， 是函数作者无法控制的
引用数据状态发生改变， 非预期状态， 如： 锁
不可预知异常
作者逻辑错误
作者使用其他函数时未遵守约定（ 也属于逻辑错误）
作者使用的其他函数逻辑错误
作者使用的其他函数返回结果未遵守约定
不可预知的引用函数异常 * 对外隐藏

错误
不可预知的
异常
可预知的

输出
输出类型
输出限定
主体：
主体逻辑


调用：
参数式调用， 函数式编程
逻辑中引用

类型

日志

注释

测试

函数返回： 测试的目的
1. 正常返回： 类型
2. 正常返回： 验证
3. 非正常： 异常， 非测错误
*/


class UnknowError extends Error {

	/**
	 * 不可预知的错误，从属于错误类型
	 * 对于所有不可预知的错误包括引用其他函数内部的错误时对外展示均为次错误
	 * 通常这一类错误是由作者引起的，所以对于调用者来讲是不可处理的，
	 * 不需要将具体错误信息暴露给调用者，应该统一给调用者一个该错误信息。
	 * 该错误类也可以异常处理，将错误信息发送给作者，以便于作者 debug。
	 *
	 * 错误分类：
	 * 	- 函数内部逻辑错误
	 * 	- 引用其他函数返回的错误
	 * 	- 其他错误
	 * @param  {Error} err 一个已捕获的不可处理的异常
	 * @return
	 */
	constructor(err) {
		super(`不可预知的错误发生了. ${err.message}`)
		this.author = 'Miwoes';
		this.email = 'miwoes@163.com';
		this.raw_err = err;
		if (err) console.log(err);  // 异常处理
	}

	/**
	 * 通知作者
	 * 对于该类错误，调用者是无法处理的，最好的办法是通知函数作者。
	 * 所以在该类中定义了作者信息，与该通知函数，以便于及时反馈给函数作者。
	 * @return
	 */
	notify() {
		// notify func author
		// if (this.raw_err) this.email.send(this.raw_err)
	}
}

class RequiredError extends Error {

	/**
	 * 非空错误，从属于错误类
	 * @param  {string*} propName 
	 * @return
	 */
	constructor(propName) {
		if (propName === undefined) throw new RequiredError('propName');
		super(`${propName} 不能缺失。`);
	}
}

class TypeError extends Error {

	/**
	 * 类型错误，从属于错误类
	 * @param  {string*} propName     属性名称
	 * @param  {string*} defType 	预期的类型
	 * @param  {string*} getType 	得到的类型
	 * @return
	 */
	constructor(propName, defType, getType) {
		if (propName === undefined) throw new RequiredError('propName');
		if (defType === undefined) throw new RequiredError('defType');
		if (getType === undefined) throw new RequiredError('getType');

		super(`${propName} 类型不正确. 预期的是 ${defType}, 得到的是 ${getType}`);
	}
}

class LimitError extends Error {

	/**
	 * 限制类错误，从属于错误类
	 * 对属性函数等一些特殊限制所引发的错误类型
	 * 如：字符串长度，数字大小等。
	 * @param  {string*} errmsg 错误信息
	 * @return
	 */
	constructor(errmsg) {
		if (!errmsg) throw new RequiredError('errmsg');
		if (typeof errmsg !== 'string') throw new TypeError('errmsg', 'string', typeof errmsg);
		super(errmsg)
	}
}



class Exception extends Error {

	/**
	 * 异常基类，从属于错误
	 * Exception 与 UnkownError 对应，指代是可预知的异常类型
	 * 继承与 Exception 类型的异常均是可以直接抛给调用者的异常
	 * @param  {string} errmsg 异常信息
	 * @return
	 */
	constructor(errmsg) {
		super(errmsg);
	}
}

class TypeException extends Exception {

	/**
	 * 类型异常，从属于异常类
	 * @param  {string*} propName 属性名
	 * @param  {string*} defType 预期的类型
	 * @param  {string*} getType 得到的类型
	 * @return
	 */
	constructor(propName, defType, getType) {
		if (!propName) throw new RequiredError('propName');
		if (!defType) throw new RequiredError('defType');
		if (!getType) throw new RequiredError('getType');

		super(`${propName} 参数类型不正确. 预期的是 ${defType}, 得到的是 ${getType}`);
	}
}

class RequiredException extends Exception {

	/**
	 * 非空异常，从属于异常类
	 * @param  {string*} propName 属性名
	 * @return
	 */
	constructor(propName) {
		if (!propName) throw new RequiredError('propName');
		super(`缺少参数 ${propName}`);
	}
}

class LimitException extends Exception {

	/**
	 * 限制类异常，从属于异常类
	 * 对属性一些特殊限制所引发的异常类型
	 * 如：字符串长度，数字大小等。
	 * @param  {string*} errmsg 错误信息
	 * @return
	 */
	constructor(errmsg) {
		if (!errmsg) throw new RequiredError('errmsg');
		if (typeof errmsg !== 'string') throw new TypeError('errmsg', 'string', typeof errmsg);
		super(errmsg)
	}
}


class Validator {

	/**
	 * 验证器父类
	 * @param  {string='validator'} name 验证器名称，默认为‘validator’
	 * @return
	 */
	constructor(name = 'validator') {
		this.name = name;
	}

	/**
	 * 验证函数
	 * *该函数必须被重写
	 * @param  {string}	propName	属性名
	 * @param  {string}	propType 	属性类型
	 * @param  {object} propValue 	属性值
	 * @return
	 */
	validate(propName, propType, propValue) {
		throw new LimitError('必须重写的方法 validate!');
	}
}

class RequiredValidator extends Validator {

	/**
	 * 非空验证器
	 * @param  {string} name 验证器名称
	 * @return
	 */
	constructor(name = 'requiredValidator') {
		super(name);
	}

	/**
	 * validate overwrite
	 * @param  {string*}	propName	属性名
	 * @param  {string}		propType 	属性类型
	 * @param  {object*}	propValue 	属性值
	 * @return
	 */
	validate(propName, propType, propValue) {
		if (propName === undefined) throw new RequiredError('propName');
		if (propValue === undefined) throw new RequiredException(propName);
	}
}

class TypeValidator extends Validator {

	/**
	 * 类型验证器
	 * @param  {string} name 验证器名称
	 * @return
	 */
	constructor(name = 'typeValidator') {
		super(name)
	}

	/**
	 * validate overwrite
	 * @param  {string*}	propName	属性名
	 * @param  {function*}	propType 	属性类型
	 * @param  {object*}  	propValue 	属性值
	 * @return
	 */
	validate(propName, propType, propValue) {
		if (propName === undefined) throw new RequiredError('propName');
		if (propType === undefined) throw new RequiredError('propType');
		if (propValue === undefined) return;
		if (propValue.constructor !== propType) throw new TypeException(propName, propType.name, typeof propValue);
	}
}


class ArgsStruct {

	/**
	 * 参数结构
	 * @param {object*} 		struct 				结构
	 * @param {string*} 		struct.name     	参数名
	 * @param {object} 			struct.validator 	验证器
	 * @param {boolean]} 		struct.validator.required 	非空验证器
	 * @param {string*} 		struct.validator.type 		类型验证器
	 * @param {function} 		struct.validator.limit(propName, propType, propValue) 自定义验证器
	 * @return
	 */
	constructor(struct) {
		if (struct === undefined || struct === null) throw new RequiredError('struct');
		if (struct.name === undefined) throw new RequiredError('struct.name');

		this.name = struct.name;

		if (struct.validator) {
			this.validator = struct.validator;
			if (typeof struct.validator !== 'object') throw new TypeError('struct.validator', 'object', typeof struct.validator);
			if (struct.validator.type === undefined) throw new RequiredError('struct.validator.type');
			if (typeof struct.validator.type !== 'function') throw new TypeError('struct.validator.type', 'function', typeof struct.validator.type);

			if (struct.validator.required !== undefined && typeof struct.validator.required !== 'boolean')
				throw new TypeError('struct.validator.required', 'boolean', typeof struct.validator.required);
			if (struct.validator.limit && typeof struct.validator.limit !== 'function')
				throw new TypeError('struct.validator.limit', 'function', typeof struct.validator.limit);
			this.validator = struct.validator; 
		}
		
	}
}

class BaseClass {

	/**
	 * 基类
	 *  - 包含一组错误类，附加在函数对象上
	 *  - 包含一组异常类，附加在函数对象上
	 *  - 包含一个参数结构，附加在函数对象上
	 *  - 包含一个验证函数，附加在原型链上
	 *  - 包含一个自定义函数例子， 附加在原型链上
	 * @return
	 */
	constructor() {

	}

	/**
	 * 验证函数
	 * @param  {[ArgsStruct[]*]} 	metas 参数meta信息
	 * @param  {[object[]*]} 		args  参数值列表，可从函数中获取 arguments 对象
	 * @return
	 */
	validate(metas, args) {
		metas.map((meta, index) => {
			if (!meta || !meta.validator) return;

			let arg = args[index];
			if (meta.validator.required) {
				let requiredValidator = new this.RequiredValidator()
				requiredValidator.validate(meta.name, meta.validator.type, arg);
			}

			let typeValidator = new this.TypeValidator();
			typeValidator.validate(meta.name, meta.validator.type, arg);

			if (meta.validator.limit) {
				meta.validator.limit(meta.name, meta.validator.type, arg);
			}
		})
	}

	/**
	 * 标准函数
	 * - 参数类型和限制定义
	 * - 参数检测
	 * - 返回值类型和限制定义
	 * - 异常定义
	 * - 异常捕获
	 * - 异常处理(向上抛预知异常，与包装后的不可预知异常)
	 * - 日志记录
	 * - 注释(文档注释)
	 * - 测试
	 * @param  {number*}		x 	数字 x
	 * - RequiredValidator
	 * - TypeValidator
	 * - LimitValidator
	 * @param  {string='test'} 	y 	字符串 y
	 * - TypeValidator
	 * @param  {number}			z	数字 x
	 * - RequiredValidator
	 * - TypeValidator
	 * - LimitValidator                  
	 * @return {string}
	 */
	exampleFunc(x, y, z) {

		const metas = [
			new this.ArgsStruct({
				name: 'x',
				validator: {
					required: true,
					type: Number,
					limit: (propName, propType, propValue)=> {
						if (propValue < 0 || propValue > 5) throw new this.LimitException(`${propName} 必须是 0-5 之间的数字。`);
					}
				}
			}), new this.ArgsStruct({
				name: 'y',
				validator: {
					required: false,
					type: String
				}
			}), new this.ArgsStruct({
				name: 'z',
				validator: {
					required: true,
					type: Number,
					limit: (propName, propType, propValue)=> {
						if (propValue === 0) throw new this.LimitException(`${propName} 必须是不为 0 的数字`);
					}
				}
			})
		]



		// 逻辑
		try {
			// 参数验证
			this.validate(metas, arguments);

			// 默认值设置
			y = y || 'test';


			// 返回值
			return  x / z + y;
		} catch (err) {
			if (err instanceof this.Exception) throw err;
			throw new this.UnknowError(err);
		}
	}

}

BaseClass.prototype.UnknowError = UnknowError;
BaseClass.prototype.Exception = Exception;
BaseClass.prototype.TypeException = TypeException;
BaseClass.prototype.RequiredException = RequiredException;
BaseClass.prototype.LimitException = LimitException;
BaseClass.prototype.Validator = Validator;
BaseClass.prototype.RequiredValidator = RequiredValidator;
BaseClass.prototype.TypeValidator = TypeValidator;
BaseClass.prototype.ArgsStruct = ArgsStruct;





module.exports = BaseClass

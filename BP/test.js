var BP = require("./BP");

const inputSize = 32;
const hiddenSize = 15;
const outputSize = 4;

const simpleCount = 1000;
const trainCount = 200;

var bp = new BP({
	struct: [32, 15, 4],
    errornum: 0.0005
});

// 样本
var list = [];

// 初始化样本数量,有符号浮点型
for (var i = 0; i < simpleCount; i++) {

    // 初始化样本规则
    var value = Math.random() * Math.pow(2, 32) - Math.pow(2, 31);
    var real = new Array(4);
    each(real, function(v, i) { this[i] = 0.0; }, real);
    if (value >= 0) {
        if ((value & 1) === 1)
            real[0] = 1;
        else
            real[1] = 1;
    } else if ((value & 1) === 1) {

        real[2] = 1;
    } else {
        real[3] = 1;
    }
    var binary = new Array(32);
    each(binary, function(v, i) { this[i] = 0.0; }, binary);
    var index = 31;
    do {
        binary[index--] = (value & 1);
        value >>>= 1;
    } while (value !== 0);
    list.push({ binary: binary, real: real });
}

// 训练
let datas = [];
for (var j = 0; j < list.length; j++) {
    var value = list[j];
    // console.log(binary, real)
    datas.push({ input: value.binary, output: value.real });
}
bp.train(datas);

console.log("训练完毕，下面请输入一个任意数字，神经网络将自动判断它是正数还是复数，奇数还是偶数。");

// var input = new Array(10);
process.stdin.on('end', function() {
    process.stdout.write('end');
});


// gets 函数的简单实现
(function gets(cb) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function(chunk) {

        // process.stdin.pause();
        cb(chunk);
    });
})(function(rlt) {
    // 获取一个数字
    var value = parseInt(rlt);

    var rawVal = value;

    // 32位二进制数组
    var binary = new Array(32);

    // 初始化二进制数组
    each(binary, function(v, i) { this[i] = 0.0; }, binary);
    var index = 31;
    do {
        binary[index--] = (value & 1); // 奇偶判断 偶数 & 1 = 0; 奇数 & 1 = 1
        value >>>= 1; // ==  value = Math.floor(value/2)
    } while (value !== 0);

    var result = bp.run(binary);
    var max = -Math.pow(2, 31);
    var idx = -1;


    for (var i = 0; i < result.length; i++) {
        if (result[i] > max) {
            max = result[i];
            idx = i;
        }
    }

    /** 
     * 分布在四个点上，分别是0123
     * 0位置大数代表是个正奇数
     * 1代表正偶数
     * 2代表负奇数
     * 3代表负偶数
     **/
    switch (idx) {
        case 0:
            console.log("%d是一个正奇数\n", rawVal);
            break;
        case 1:
            console.log("%d是一个正偶数\n", rawVal);
            break;
        case 2:
            console.log("%d是一个负奇数\n", rawVal);
            break;
        case 3:
            console.log("%d是一个负偶数\n", rawVal);
            break;
    }


});

function each(array, callback, ctx) {
    for (var i = 0; i < array.length; i++) {
        callback.call(ctx, array[i], i);
    }
}

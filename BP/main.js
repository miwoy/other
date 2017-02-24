var BP = require("./BP");


var bp = new BP(32, 15, 4);

var list = [];
for (var i = 0; i !== 1000; i++) {
    var value = Math.random()*Math.pow(2, 32)-Math.pow(2, 31);
    list.push(value);
}

for (var i = 0; i !== 200; i++) {
    for (var j = 0; j < list.length; j++) {
        var value = list[j];

        var real = new Array(4);
        each(real, function(v,i) {this[i] = 0.0;}, real);
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
        each(binary, function(v,i) {this[i] = 0.0;}, binary);
        var index = 31;
        do {
            binary[index--] = (value & 1);
            value >>>= 1;
        } while (value !== 0);

        bp.train(binary, real);
    }

}

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
    var value = parseInt(rlt);

    var rawVal = value;
    var binary = new Array(32);
    each(binary, function(v,i) {this[i] = 0.0;}, binary);
    var index = 31;
    do {
        binary[index--] = (value & 1);
        value >>>= 1;
    } while (value !== 0);

    var result = bp.test(binary);

    var max = -Math.pow(2, 31);
    var idx = -1;

    
    for (var i = 0; i !== result.length; i++) {
        if (result[i] > max) {
            max = result[i];
            idx = i;
        }
    }

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

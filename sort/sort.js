/**
 * 排序算法
 */
var arry3 = [],
    arry1 = [],
    arry2 = [],
    num1 = 0,
    num2 = 0,
    num3 = 0,
    length = 100; // 测试数据数组长度
for (var i = 0; i < length; i++) {
    var rdm = Math.round(Math.random() * length);
    arry1.push(rdm);
    arry2.push(rdm);
    arry3.push(rdm);

}
var num1 = 0;

var num2 = 0;

var num3 = 0;

console.log("=====时长=====");

console.time("直接法");
arry1 = sort1(arry1);
console.timeEnd("直接法");

console.time("冒泡法");
arry2 = sort2(arry2);
console.timeEnd("冒泡法");

console.time("分冶法");
arry3 = sort3(arry3);
console.timeEnd("分冶法");

console.log("=====比较次数=====\n直接法：" + num1 + "\n冒泡法：" + num2 + "\n分冶法" + num3);



// 直接法
function sort1(arry) {
    for (var i = arry.length - 1; i > 0; i--) {
        for (var j = i; j < arry.length; j++) {
            num1++;
            if (arry[j - 1] > arry[j]) {
                arry[j - 1] ^= arry[j];
                arry[j] ^= arry[j - 1];
                arry[j - 1] ^= arry[j];

            } else {
                break;
            }

        }
    }
    return arry;
}

// 冒泡法
function sort2(arry) {
    for (var i = arry.length - 1; i >= 0; i--) {
        for (var j = 1; j <= i; j++) {
            num2++;
            if (arry[j] < arry[j - 1]) {
                arry[j - 1] ^= arry[j];
                arry[j] ^= arry[j - 1];
                arry[j - 1] ^= arry[j];
            }
        }
    }

    return arry;
}

// 分冶法
function sort3(arry) {

    if (arry.length <= 1) {
        return arry;
    }

    var after = [],
        before = [];
    for (var i = 1; i < arry.length; i++) {
        num3++;
        if (arry[0] >= arry[i])
            after.push(arry[i]);
        else
            before.push(arry[i]);
    }

    return sort3(after).concat(arry.slice(0, 1)).concat(sort3(before));
}

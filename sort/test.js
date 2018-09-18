/**
 * 排序算法
 */
var arry4 = [],
    arry3 = [],
    arry1 = [],
    arry2 = [],
    num1 = 0,
    num2 = 0,
    num3 = 0,
    length = 5000; // 测试数据数组长度
for (var i = 0; i < length; i++) {
    var rdm = Math.round(Math.random() * length);
    arry1.push(rdm);
    arry2.push(rdm);
    arry3.push(rdm);
    arry4.push(rdm);
}
var num1 = 0;

var num2 = 0;

var num3 = 0;

var num4 = 0;

console.log("=====时长=====");

console.time("直接法");
for (var i =  0; i <75009; i++) {
    arry2.splice(0, 1);
}

console.timeEnd("直接法");

console.time("默认排序");
sort4(arry4);
console.timeEnd("默认排序");


console.time("冒泡法");
sort2(arry2);
console.timeEnd("冒泡法");

console.time("分冶法");
sort3(arry3);
console.timeEnd("分冶法");






console.log("=====比较次数=====\n直接法:" + num1 + "\n冒泡法:" + num2 + "\n分冶法:" + num3 + "\n默认法:" + num4);



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
// function sort2(arry) {
//     for (var i = arry.length - 1; i >= 0; i--) {
//         for (var j = 1; j <= i; j++) {
//             num2++;
//             if (arry[j] < arry[j - 1]) {
//                 arry[j - 1] ^= arry[j];
//                 arry[j] ^= arry[j - 1];
//                 arry[j - 1] ^= arry[j];
//             }
//         }
//     }

//     return arry;
// }

　
function sort2(arr) {　　
    if (arr.length <= 1) { return arr; }　　
    var pivotIndex = Math.floor(Math.random(arr.length));　　
    var pivot = arr.splice(pivotIndex, 1)[0];　　
    var left = [];　　
    var right = [];　　
    for (var i = 0; i < arr.length; i++) {
        num2++;　　　　
        if (arr[i] < pivot) {　　
            left.push(arr[i]);　　　　
        } else {　　
            right.push(arr[i]);　　
        }　　
    }　　
    return sort2(left).concat([pivot], sort2(right));
};

// 分冶法
function sort3(arry, start, end) {

    if (start-end >= 0) {
        return;
    }

    start = start || 0;
    end = end || arry.length - 1;
    var index = start;
    for (var i = start + 1; i <= end; i++) {
        num3++;
        if (arry[index] > arry[i]) {
            arry.splice(index, 0, arry.splice(i, 1)[0]);
            index++;
        }
    }

    arguments.callee(arry, start, index);
    arguments.callee(arry, index + 1, end);
}

// 默认
function sort4(arry) {
    arry.sort(function(v1, v2) {
        num4++;
        return v1 - v2;
    });
}

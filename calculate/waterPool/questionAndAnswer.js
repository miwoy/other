/**
 * 问题描述
 * 我们有不同高度的挡板，用数组表示
 * 示例 [2,5,1,2,3,4,7]
 * 如下图 
 *             |
 *             |
 *   |         |
 *   |         |
 *   |     | | |
 * | |   | | | |
 * | | | | | | |
 * 假如开始下雨了，那么挡板之间能够存多少水呢？
 */

/**
 * 最精简的双指针法
 * 从数组左右两边同时遍历
 */
let calculate = function(arry) {
    let max = [arry.shift(), arry.pop()]; // 0 最左 1 最右
    let result = 0; // 结果

    while (arry.length > 0) {
        
        // 从最小的一边遍历，取值结果小与最值则累加，大于最值则同步最值
        let short = max[0] < max[1] ? 0 : 1,
            current = short ? arry.pop() : arry.shift();

        if (current > max[short])
            max[short] = current;
        else
            result += max[short] - current;
    }

    return result;
}



/**
 * 最符合直观思路的填补法
 */

/**
 * arr中相邻值去重
 * 
 * @param {Array} arr 
 * @returns {Array}
 */
const neighborUnique = (arr) => {
    return arr.map((value, index) => {
        return index === 0 || value !== arr[index - 1] ? value : undefined
    }).filter(value => value === undefined ? false : true)
}

/**
 * 对出现过的数值进行处理
 * 
 * @param {number} num - 当前数值
 * @param {number} preNum - 上一个数值
 */
const handler = (num, preNum) => {
    if (preNum !== undefined) {
        /**
         * 如果上一个数字不为undefined,将baseArr中所有上一次出现的数字转换为当前数字
         * example: [3,0,3,5,5] => [3,0,3,3,3]
         */
        baseArr = baseArr.map(value => value === preNum ? num : value)
        // console.log(baseArr)
    }

    /**
     * 将baseArr中相邻元素去重
     * example: [3,0,3,3] => [3,0,3]
     */
    // baseArr = neighborUnique(baseArr)

    /* 获取baseArr中所有与num相等值的下标 */
    let numIndexArr = []
    baseArr.forEach((value, index) => {
        if (value === num) numIndexArr.push(index)
    })

    /* 遍历获取到的下标 */
    numIndexArr.forEach((value, index) => {
        if (index === 0) return
        let start = numIndexArr[index - 1]
        let end = value
        for (let i = start + 1; i < end; i++) { // 累加start 到 end 之间能装的水
            sum += num - baseArr[i]

            /**
             * 将计算过的位置填平
             * example: [3,0,3] => [3,3,3]
             */
            baseArr[i] = num
        }
    })
}



/**
 * 测试
 */
let baseArr = [];
let baseArr1 = [];

for (var i = 0; i <= 1000000; i++) {
    let num = parseInt(Math.random() * 10);
    baseArr.push(num);
    baseArr1.push(num);
}

console.time("双指针法用时");
console.log("self", calculate(baseArr1))
console.timeEnd("双指针法用时");

let sum = 0
const main = () => {
    // 得到所有出现过的数字，按从大到小排列
    let numArr = Array.from(new Set(baseArr)).sort((a, b) => b - a)

    // 处理所有出现过的数字
    numArr.forEach((num, index) => handler(num, numArr[index - 1]))

    // print
    console.log(sum)
}
console.time("填补法用时");
main();
console.timeEnd("填补法用时");




#!/usr/bin/env node

let calculate = function(arry) {
    let maxL = arry.shift();  // 左最值
    let maxR = arry.pop();  // 右最值
    let result = 0;  // 结果

    while (arry.length > 0) {
        if (maxR > maxL) { // 从最小的一边遍历，取值结果小与最值则累加，大于最值则同步最值
            let v = arry.shift();
            if (v > maxL)
                maxL = v;
            else
                result += maxL - v;
        } else {
            let v = arry.pop();
            if (v > maxR)
                maxR = v;
            else
                result += maxR - v;
        }
    }
    return result;
}

console.log(calculate([1, 10, 0, 20, 0, 20, 0, 10, 1]))

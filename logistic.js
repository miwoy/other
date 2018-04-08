#!/usr/bin/env node

let R = 4.0; // 混沌率
let x0 = 0.5; // 初始值
let count = 5000; // 样本数量

/**
 * 逻辑斯蒂映射
 * 公式 X(n+1) = R * X(n) * (1-X(n));
 */
function logistic(xt){
	if (count===0) return;
	else count--;
	let xt1 = R*xt*(10000-xt)/10000; // 逻辑斯蒂方程
	console.log("X"+(count)+":", xt1)
	return logistic(xt1);
}


logistic(x0);
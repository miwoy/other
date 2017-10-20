#!/usr/bin/env node

let R = 2.1; // 混沌率
let x0 = 0.5; // 初始值
let count = 5000; // 样本数量

/**
 * 逻辑斯蒂映射
 * 公式 X(n+1) = R * X(n) * (1-X(n));
 */
function logistic(xt){
	if (count===0) return;
	else count--;
	let xt1 = R*xt*(1-xt); // 逻辑斯蒂方程
	console.log("X"+(100-count)+":", r)
	return logist(r);
}


logistic(x0);
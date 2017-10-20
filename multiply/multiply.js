/**
 * 增长复合函数
 * Z(t) = ∑x(t)-f(Z(t-1))
 * Z(t)表示t时刻的当前空间状态（样本数量）
 * x(t)表示在t时刻样本补充的数量
 * f(t)表示抑制函数，抑制函数与上一时刻的空间状态都有关系
 */

// 抑制函数
function f(totalCount) {
	if (totalCount === 0) return 0;

	// 以自然对数函数作为抑制函数
	return Math.round(Math.log(totalCount));
}

// 增长函数
function x() {
	return Math.round(Math.random() * 100);
}

// 空间状态函数
function Z() {
	let totalCount = 0; // 空间状态，样本数量
	let increment = 0;
	let decrement = 0;

	setInterval(function() {
		decrement = f(totalCount);
		totalCount -= decrement;

		console.log("当前增量:", increment);
		console.log("抑制量:", decrement);
		console.log("当前空间状态:", totalCount);

	}, 1000);

	setInterval(function() {
		increment = x();
		totalCount += increment;
	}, 3000);


}

Z();

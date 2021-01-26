var matrix = []; // 矩阵
var width = 100; // 矩阵宽度
var height = 100; // 矩阵长度
var count = 0;
var snakeCount = 0;

var deathPoint = 2; // 死亡点
var survivalPoint = 3; // 生存点
var inheritancePoint = 100; // 遗传点,未添加遗传算法

/**
 * 有限生存空间中的蛇
 * 假设在一个封闭的有限空间中
 * 有如下规则：
 * 	1. 相同时间间隔下在空间中会出现一个单位的正物质
 *  2. 在出现一个正物质同时，必然在空间中出现一个单位的反物质
 * 	3. 正反物质处在重叠位置上时将会相互抵消，这样将保证空间的总物质数量为0
 *  4. 在空间同一个位置上出现同一性别物质三个单位及以上，那么该位置将产生一个生命(蛇)
 *  5. 蛇虽然源自于物质，但蛇具有自主动能，将随机环游整个空间试图增大自身物质体积
 *  6. 蛇遇到与自身属性相同性别物质或其他蛇时将会吸收，遇到相反性别物质和蛇时将抵消
 *  7. 蛇不具有智能，分辨不出利弊关系，只能随机的环游下去，要么死亡，要么壮大
 * 
 * 那么，在时间无限的情况下，空间的形态最终会趋于稳定吗？会有体积很大的蛇出现吗？蛇会发展出智能吗？
 * 	
 */

function Snake(uuid, x, y) { // 蛇
	this.name = uuid;
	this.foods = [];
	this.x = x;
	this.y = y;
	snakeCount++;
	console.log("新增一个蛇", x, y, uuid)
	var self = this;
	var settime = setInterval(function() { // 移动
		var dir = direction(x, y);
		var space = matrix[dir.y][dir.x];
		if (space instanceof Snake) {
			if (space.foods.length < self.foods.length) {
				self.foods = self.foods.concat(space.foods);
				if (self.foods.length > inheritancePoint) {
					console.log("完成", self);
					process.exit();
				}
				matrix[dir.y][dir.x] = self;
				matrix[y][x] = [];
			} else {
				space.foods = space.foods.concat(self.foods);
				matrix[y][x] = [];
				snakeCount--;
				clearInterval(settime);
				console.log("销毁一个蛇", self.name);
			}
		} else if (!space[0] || space[0].type === true) {
			self.foods = self.foods.concat(space);
			if (self.foods.length > inheritancePoint) {
				console.log("完成", self);
				process.exit();
			}
			matrix[dir.y][dir.x] = self;
			matrix[y][x] = [];
		} else if (space[0].type === false) {
			if (space.length <= self.foods.length) {
				self.foods.splice(0, space.length);
				matrix[dir.y][dir.x] = self.foods.length <= deathPoint ? self.foods : self;
				matrix[y][x] = [];
				if (self.foods.length <= deathPoint) {
					snakeCount--;
					clearInterval(settime);
					console.log("销毁一个蛇", self.name);
				}
			} else {
				space.splice(0, self.foods.length);
				matrix[y][x] = [];
				snakeCount--;
				clearInterval(settime);
				console.log("销毁一个蛇", self.name);
			}
		}
	}, 1000);
};

/**
 * 计算方向
 */
function direction(x, y) {
	var t, b, l, r, d = { v: -100, x, y };
	t = compute(matrix[y - 1] && matrix[y - 1][x]);
	b = compute(matrix[y + 1] && matrix[y + 1][x]);
	l = compute(matrix[y][x - 1]);
	r = compute(matrix[y][x + 1]);

	if (d.v < t) {
		d.v = t;
		d.x = x;
		d.y = y - 1;
	}
	if (d.v < b) {
		d.v = b;
		d.x = d.x;
		d.y = d.y + 1;
	}
	if (d.v < l) {
		d.v = l;
		d.x = x - 1;
		d.y = y;
	}
	if (d.v < r) {
		d.v = r;
		d.x = x + 1;
		d.y = y;
	}

	return d;
}

/**
 * 计算权重
 */
function compute(space) {
	if (!space) return -3;
	if (space instanceof Snake) return -2;
	if (!space[0]) return 0;
	if (space[0].type === true) return 1;
	if (space[0].type === false) return -1;
}

/**
 * 食物类
 */
function Food(type, x, y) { // 食物
	this.type = type;
	this.x = x;
	this.y = y;
};

/**
 * 初始化矩阵环境
 */
function init() {
	matrix = new Array(height);
	for (var i = height - 1; i >= 0; i--) {
		matrix[i] = new Array(width);
		for (var j = width - 1; j >= 0; j--) {
			matrix[i][j] = [];
		}
	}
	console.log("矩阵初始化成功.")
}

var z = true;
/**
 * 生成物质
 */
function generalFood(type) {
	var food = new Food(type, parseInt(Math.random() * width), parseInt(Math.random() * height));
	cancel(food);
	setTimeout(function() {
		z = !z;
		generalFood(z);
	}, 10);
}

/**
 * 抵消算法
 */
function cancel(food) {
	var space = matrix[food.y][food.x];
	if (space instanceof Snake) { // 此空间是条蛇
		if (space.foods[0] && space.foods[0].type !== food.type) { // 异性抵消
			space.foods.pop();
			if (space.foods.length <= deathPoint) {
				matrix[food.y][food.x] = space.foods;
			}
		} else { // 同性累计
			space.foods.push(food);
		}
	} else { // 此空间是食物堆积

		if (space[0] && space[0].type !== food.type) { // 异性抵消
			space.pop();
		} else { // 同性累计

			space.push(food);
			if (food.type === true && space.length >= survivalPoint) {
				var snake = new Snake(++count, food.x, food.y);
				snake.foods = space;
				matrix[food.y][food.x] = snake;
			}
		}
	}
	// console.log("现在位置", matrix[food.y][food.x])
}

init();
generalFood(z);

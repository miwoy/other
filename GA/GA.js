// 染色体
function RanSeTi(ranSeTiCount) {

    this.jiYinZu = ""; // 基因组字符串
    this.length = ranSeTiCount; // 基因组位数
    this.shiYongXing = 0.0; // 适用性分数
    this.jiYinZu = (Math.round(Math.random() * (2**ranSeTiCount-1))).toString(2).padStart(ranSeTiCount,0) 
}

// 群
function Pop(ranSeTiCount, popCount) {
    this.ranSeTis = [];
    for (var i = 0; i < popCount; i++) {
        this.ranSeTis.push(new RanSeTi(ranSeTiCount));
    }
}

// 变异
var bianYi = function(bianYiLv, ranSeTi) {
    var _jiYinZu = ranSeTi.jiYinZu.split("");
    for (var i = _jiYinZu.length - 1; i >= 0; i--) {
        if (Math.random() <= bianYiLv) {
            _jiYinZu[i] = _jiYinZu[i]^1 
        }
    }
    ranSeTi.jiYinZu = _jiYinZu.join("");
    return ranSeTi;
};

// 杂交
var zaJiao = function(zaJiaoLv, bianYiLv, ranSeTiCount, ranSeTi1, ranSeTi2) {
    var newRanseTi1 = new RanSeTi(ranSeTiCount),
        newRanseTi2 = new RanSeTi(ranSeTiCount);
    newRanseTi1.jiYinZu = ranSeTi1.jiYinZu;
    newRanseTi2.jiYinZu = ranSeTi2.jiYinZu;
    if (Math.random() < zaJiaoLv) {
        var weiZhi = parseInt(Math.random() * ranSeTiCount) + 1;
        newRanseTi1.jiYinZu = ranSeTi1.jiYinZu.substr(0, weiZhi) + ranSeTi2.jiYinZu.substr(weiZhi);
        newRanseTi2.jiYinZu = ranSeTi2.jiYinZu.substr(0, weiZhi) + ranSeTi1.jiYinZu.substr(weiZhi);
        
        // for(var i = 0; i<Math.round(Math.random()*ranSeTiCount);i++) {
        //     var weizhi = Math.round(Math.random()* (ranSeTiCount -1));
        //     newRanseTi1.jiYinZu = ranSeTi1.jiYinZu.substr(0, weizhi) + ranSeTi2.jiYinZu.charAt(weizhi) + ranSeTi1.jiYinZu.substr(weizhi+1);
        //     newRanseTi2.jiYinZu = ranSeTi2.jiYinZu.substr(0, weizhi) + ranSeTi1.jiYinZu.charAt(weizhi) + ranSeTi2.jiYinZu.substr(weizhi+1);
        // }
    }

    newRanseTi1 = bianYi(bianYiLv, newRanseTi1);
    newRanseTi2 = bianYi(bianYiLv, newRanseTi2);


    return [newRanseTi1, newRanseTi2];
};

// 轮盘选择
var lunPanFa = function(pop) {
    var random = Math.random();
    var shiYongXingZongShu = 0;
    for (var i = 0; i < pop.length; i++) {
        shiYongXingZongShu += pop[i].shiYongXing;
        // console.log(shiYongXingZongShu);
        if (shiYongXingZongShu > random) {
            return pop[i];
        }
    }
};

// 遗传
var yiChuan = function(zaJiaoLv, bianYiLv, ranSeTiCount, pop) {

    var _pop = [];
    for (var i = 0; i < pop.length / 2; i++) {
        _pop = _pop.concat(zaJiao(zaJiaoLv, bianYiLv, ranSeTiCount, lunPanFa(pop), lunPanFa(pop)));
    }
    return _pop;
};


// 目标
var result = "1101010100011001"//110101010001100111010101000110011101010100011001";
var ini = {
    ranSeTiCount: result.length,
    popCount: 44,
    zaJiaoLv: 0.7,
    bianYiLv: 0.001
};




function main() {
    console.time("time");
    var pop = new Pop(result.length, ini.popCount).ranSeTis;
    var dai = 1;
    while (true) {

        var totalShiYongXing = 0;

        for (var i = pop.length - 1; i >= 0; i--) {

            var ranSeTi = pop[i].jiYinZu.split("");
            var _result = result.split("");
            var num = 0;
            for (var j = 0; j < result.length; j++) {
                if (_result[j] === ranSeTi[j]) num++;
            }

            pop[i].shiYongXing = (num / result.length) + 1;
            totalShiYongXing += pop[i].shiYongXing;
            console.log(pop[i].shiYongXing);
            if (pop[i].shiYongXing === 2) {
                console.timeEnd("time");
                return console.log("第"+ dai +"代已解决：", pop[i]);
            }

        }

        for (var k = pop.length - 1; k >= 0; k--) {
            pop[k].shiYongXing = pop[k].shiYongXing/totalShiYongXing;
        }
        // console.log(pop)
        pop = yiChuan(ini.zaJiaoLv, ini.bianYiLv, ini.ranSeTiCount, pop);
        dai++;
    }

}

console.log("start:");
main();

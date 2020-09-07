/**
 * 1.定期 波动型数据收益为0
 * 2.追低 收益为正
 * 3.组合 
 */



function s1(data) {
    let col = 9000
    let total = 0
    let max = 1000000000
    let vol = 0
    let split = 7
    for (let i = 0; i < data.length; i++) {
        if (i % split == 0 && total < max) {
            total += col
            vol += col / data[i][0]
        }
    }
    console.log(`定投-投入:${total}, 结算:${Math.round(data[data.length-1][0]*vol)},盈利:${Math.round(data[data.length-1][0]*vol-total)},盈利率:${((data[data.length-1][0]*vol-total)/total*100).toFixed(2)}%`)
}

function s2(data) {
    let col = 2000
    let total = 0
    let max = 1000000000
    let vol = 0
    for (let i = 0; i < data.length; i++) {
        if (data[i][1] < 0 && total < max) {
            total += col
            vol += col / data[i][0]
        }
    }
    console.log(`追跌-投入:${total}, 结算:${Math.round(data[data.length-1][0]*vol)},盈利:${Math.round(data[data.length-1][0]*vol-total)},盈利率:${((data[data.length-1][0]*vol-total)/total*100).toFixed(2)}%`)
}

function s3(data) {
    let col = 2000
    let total = 0
    let max = 1000000000
    let vol = 0
    let split = 7
    for (let i = 0; i < data.length; i++) {
        if (total > max) break;
        if (i % split == 0) {
            total += col
            vol += col / data[i][0]
        }
        if (data[i][1] < 0) {
            total += col
            vol += col / data[i][0]
        }

    }
    console.log(`组合-投入:${total}, 结算:${Math.round(data[data.length-1][0]*vol)},盈利:${Math.round(data[data.length-1][0]*vol-total)},盈利率:${((data[data.length-1][0]*vol-total)/total*100).toFixed(2)}%`)
}

function run() {
    let data01 = data1()
    let data02 = data2()
    let data03 = data3()
    console.log(`波动型-起始价:${data01[0][0]},终止价: ${data01[data01.length-1][0]},涨幅:${Math.round(((data01[data01.length-1][0]-data01[0][0])/data01[0][0])*100)}%`)
    s1(data01)
    s2(data01)
    s3(data01)
    console.log(`下滑型-起始价:${data02[0][0]},终止价: ${data02[data02.length-1][0]},涨幅:${(((data02[data02.length-1][0]-data02[0][0])/data02[0][0])*100).toFixed(2)}%`)
    s1(data02)
    s2(data02)
    s3(data02)
    console.log(`上升型-起始价:${data03[0][0]},终止价: ${data03[data03.length-1][0]},涨幅:${(((data03[data03.length-1][0]-data03[0][0])/data03[0][0])*100).toFixed(2)}%`)
    s1(data03)
    s2(data03)
    s3(data03)
}

/**
 * 数据类型
 * 1.波动
 * 2.下滑
 * 3.上升
 */

function data1() {
    let now = 0
    let data = new Array(1000000).fill(0).map((d,i) => {
        let n = Math.round(Math.random() * 20) + 100
        let rent = now == 0 ? 0 : ((n - now) / now)
        now = n
        return [n, rent]
    })
    return data
}

function data2() {
    let now = 0
    let data = new Array(1000000).fill(0).map((d, i) => {
        let n = Math.round(Math.random() * 20) + 100 - 20/(1000000-i)
        let rent = now == 0 ? 0 : ((n - now) / now)
        now = n
        return [n, rent]
    })
    return data
}

function data3() {
    let now = 0
    let data = new Array(1000000).fill(0).map((d, i) => {
        let n = Math.round(Math.random() * 20) + 100 + 20/(1000000-i)
        let rent = now == 0 ? 0 : ((n - now) / now)
        now = n
        return [n, rent]
    })
    return data
}

run()
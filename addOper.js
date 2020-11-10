/**
 * 逻辑计算器，半加法器
 */
function and(a, b) {
    return a & b
}

function or(a, b) {
    return a | b
}

function not(a) {
    return !a
}

function xor(a, b) {
    return a ^ b
}

function add(a, b) {
    console.log(`第一个数:${a},二进制:${a.toString(2).padStart(8,0)}`)
    console.log(`第二个数:${b},二进制:${b.toString(2).padStart(8,0)}`)
    a = a.toString(2).padStart(8, 0) // 数据寄存器1
    b = b.toString(2).padStart(8, 0) // 数据寄存器2
    let s = 0
    let r = [] // 结果寄存器
    for (let i = 7; i >= 0; i--) {
        let _r = xor(a[i], b[i]) // 留位
        _r = xor(_r, s)

        let _s = or(and(a[i], b[i]), and(a[i], s)) // 进位
        _s = or(_s, and(b[i], s))
        r[i] = _r
        s = _s
        console.log(`第${8-i}位计算`)
        console.log(`a[${8-i}]:${a[i]},b[${8-i}]:${b[i]}`)
        console.log(`本位:${_r}, 进位:${_s}, r:${r.join("").padStart(8, 0)}`)
    }

    return r.join("")
}

let a = 127,
    b = 127

console.log("结果:", parseInt(add(a, b), 2))
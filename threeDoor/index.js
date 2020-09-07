/**
 * 三门问题
 */
let sample = []// [0,0,1]

function run() {
    let sample = initSample()
    console.log("换",testThree(sample))
    console.log("不换",testTwo(sample))
}

function initSample() {
    return new Array(30000).fill(0).map(s=>{
        s = [0,0,0]
        s[Math.floor(Math.random()*3)]=1
        return s
    })
}

function testThree(sample) {
    let cr = 0
    let cr2 = 0
    sample.forEach(s=> {
        let num = Math.floor(Math.random()*3)
        let num1
        for (let i = 0; i < 3; i++) {
            if (i!=num && s[i]==0) {
                num1 = i
            }
        }

        let r = [0,1,2].find(n=>n!=num&&n!=num1)
        if (s[r]) cr++
        if (s[num]) cr2++
    })

    return cr/sample.length
}

function testTwo(sample) {
    let cr = 0
    sample.forEach(s=> {
        if (s[Math.floor(Math.random()*3)]) cr++
    })

    return cr/sample.length
}

run()
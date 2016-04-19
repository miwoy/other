/**
 * inupt nad output
 */
var findAndReturn = require('./findAndReturn');





gets();



function input(str) {
    findAndReturn(str, function(err, result) {
        if (err) {
            return console.error(err);
        }
        process.stdout.write("result")
        console.log("结果", result.sort ? result.join(',') : result);
    });

}

// gets 函数的简单实现
function gets() {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
}

process.stdin.on('data', function(chunk) {
    process.stdin.pause();
    input(chunk);
    gets();
});

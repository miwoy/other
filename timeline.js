var fs = require("fs");


// while(true) {
// 	console.log("")
// 	var content = process.stdin;
// 	console.log(content); 
// }

const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function timeline() {
	rl.question('请输入此刻的念头: ', (answer) => {
		// TODO: Log the answer in a database
		fs.appendFileSync("./TIMELINE",formatDate(new Date()) +"\n\t"+  answer +"\n");
		console.log(new Date().toISOString() +"\n"+  answer);

		// rl.close();
		timeline();
	});
}

process.on("close", function() {
	console.log("process exit")
	rl.close()
})

timeline()

/**
 * 时间格式化工具
 * @example 2017-07-13 00:00:00
 */
function formatDate(date, isDate) {
    if (Object.prototype.toString.call(date) !== "[object Date]") {
        throw new TypeError("date is not Date type");
    }

    return isDate?(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()):(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds())
}
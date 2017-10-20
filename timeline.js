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
		fs.appendFileSync("./TIMELINE",new Date().toISOString() +"\n\t"+  answer +"\n");
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
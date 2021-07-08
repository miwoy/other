var request = require('request');
var url="https://dataapi.joinquant.com/apis";
var requestData = {
    "method": "get_token",
    "mob": "15846661943",
    "pwd": "661943"
};
request({
    url: url,
    method: "POST",
    body:JSON.stringify(requestData)
}, function(error, response, token) {
    var requestData = {     
        "method": "get_all_securities",
        "token": token,
        "code": "etf"
    };
    request({
        url: url,
        method: "POST",
        body:JSON.stringify(requestData)
    }, function(error, response, body) {
        console.log(body)       
    });            
});  
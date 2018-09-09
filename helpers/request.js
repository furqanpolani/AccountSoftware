var request = require('request');

module.exports = function(options){
    var promise = new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
                console.log("NO error in helper");
                //var info = JSON.parse(body);
                //console.log(response);
                console.log(body);
                resolve(body);
            }else{
                console.log(response.statusCode);
                console.log("showing error in helper" + error);
                reject(body);
            }
		});
    });

    return promise;
}

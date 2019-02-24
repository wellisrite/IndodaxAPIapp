var http = require("http");
const request = require('request');
var crypto = require('crypto');
const querystring = require('querystring');
var MongoClient = require('mongodb');
var url = "mongodb://localhost:27017/trade";
//bot variable
var apik='2DMYDAI4-9VZCKEOI-BYSSMOHU-OBVIMEPP-ZYB4WR4V'; // your API-key
var secret = '0854dd967d556e5178765ac09123061de311db0137d839447ebfd478269b56b7487973e4216857db'; // your Secret-key
var stoplossrate=5;
// Bot class
var method = Bot.prototype;
// Constructor
function Bot() {
    this.apik = apik;
    this.secret= secret;
}
//getProfile
method.getProfile = function(callback){
	var method="getInfo";
	var req={};
	this.idx_query(method,req,function(response){
		callback(response);
	});
}
//insert into profile
method.insertProfile =  function(){

		// MongoClient.connect(url, { useNewUrlParser: true },function(err,db){
		// 	dbo.collection("profile").insertOne(myobj, function(err, res) {
		// 	    if (err) throw err;
		// 	    console.log("1 document inserted");
		// 	    db.close();
		// 	  });
		// });

}
//stoploss function
method.stopLoss = function(){

}
//idx query
method.idx_query = function(methodname,req,callback){
	var requ={};
	var log;
	requ['method']=methodname;
	if(req.coin!=null){
		requ['pair']=req.coin+"_idr";
	}
	requ['nonce']=Math.floor(Date.now()/1000);
	var post_data=querystring.stringify(requ, '&', '=');
	var sign=this.signHmacSha512(secret,post_data);
	var useragent="Mozilla/4.0 (compatible; INDODAXCOM PHP client; Linux; PHP/7.1.10)";
	var headers = {
	    sign : sign,
	    key : apik
	};
	request.post({
		url: 'https://indodax.com/tapi/',
		form: post_data,
		headers: headers
	},
	function(error,response, body){
		res=JSON.parse(response.body);
		callback(res);
	});
}
//to encrypt using sha512 algorithm
method.signHmacSha512 = function(key, str) {
  "use strict";
  let hmac = crypto.createHmac("sha512", key);
  let signed = hmac.update(new Buffer.from(str, 'utf-8')).digest("hex");
  return signed;
}
module.exports = Bot;
// End of Bot class
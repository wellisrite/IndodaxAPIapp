var http = require("http");
const request = require('request');
const SMA = require('technicalindicators').sma;
const querystring = require('querystring');
requ['pair']="idr";
requ['nonce']=Math.floor(Date.now()/1000);
var post_data=querystring.stringify(requ, '&', '=');
console.log(post_data);
// var headers ={
// 	fsym : "BTC",
// 	tsym : "USD",
// 	limit : 60,
// 	aggregate : 4,
// 	toTs : 1452463200
// };
//  request.post({
//     url: ' https://min-api.cryptocompare.com/data/histohour',
//     form: post_data,
//     headers: headers
//   },
//   function(error,response, body){
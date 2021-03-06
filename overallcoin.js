var http = require("http");
const request = require('request');
var crypto = require('crypto');
const querystring = require('querystring');
var apik = ''; // your API-key
var secret = ''; // your Secret-key
var parameter = process.argv[2];
var requ = {};
var lastprice = 0;
var lowprice = 0;
var highprice = 0;
requ['method'] = "tradeHistory";
requ['pair'] = parameter + "_idr";
requ['nonce'] = Math.floor(Date.now() / 1000);
console.log(parameter + " Overall status");
console.log('---------------------------------');
var post_data = querystring.stringify(requ, '&', '=');
var sign = signHmacSha512(secret, post_data);
var useragent = "Mozilla/4.0 (compatible; INDODAXCOM PHP client; Linux; PHP/7.1.10)";
var headers = {
	sign: sign,
	key: apik
};
function signHmacSha512(key, str) {
	"use strict";
	let hmac = crypto.createHmac("sha512", key);
	let signed = hmac.update(new Buffer(str, 'utf-8')).digest("hex");
	return signed;
}
request('https://indodax.com/api/' + parameter + '_idr/ticker', function (error, response, body) {
	lastprice = parseInt(JSON.parse(response.body).ticker.last);
	highprice = parseInt(JSON.parse(response.body).ticker.high);
	lowprice = parseInt(JSON.parse(response.body).ticker.low);
	console.log(parameter + "'s High : Rp" + highprice.toLocaleString() + ",00");
	console.log(parameter + "'s Price : Rp" + lastprice.toLocaleString() + ",00");
	console.log(parameter + "'s Low : Rp" + lowprice.toLocaleString() + ",00");
	console.log('---------------------------------');
});

request.post({
	url: 'https://indodax.com/tapi/',
	form: post_data,
	headers: headers
},
	function (error, response, body) {
		overallcoin(response);
	});

function overallcoin(response) {
	var return1 = JSON.parse(response.body);
	var buy = 0;
	var sell = 0;
	var hold = 0;
	var holdoa = 0;
	var holdb = 0;
	var counter = 0;
	console.log("Hold Balance Status");
	console.log("---------------------------------");
	for (i = return1.return.trades.length - 1; i >= 0; i--) {
		var type = "";
		var quantity = 0;
		var price = 0;
		var order_id = "";
		var fee = 0;
		Object.keys(return1.return.trades[i]).forEach(function (key) {
			var val = return1.return.trades[i];
			if (key == "order_id") {
				order_id = val[key];
			}
			if (key == "type") {
				type = val[key];
			}
			if (key == requ['pair'].split("_")[0]) {
				quantity = parseFloat(val[requ['pair'].split("_")[0]]);
			}
			if (key == "price") {
				price = parseInt(val[key]);
			}
			if (key == "fee") {
				fee = parseInt(val[key]);
			}
		});
		subtotal = parseInt(quantity * price);
		if (type == "buy") {
			var a = i;
			while (return1.return.trades[a] != null) {
				if (return1.return.trades[a]['type'] == "sell") {
					// statement
					buy = buy + subtotal - fee;
					break;
				}
				a--;
			}
			if (return1.return.trades[a] == null) {
				counter++;
				holdb = holdb + subtotal;
				console.log("On hold " + parameter + "[" + counter + "] " + order_id);
				var diff = price - lastprice;
				var percent = parseFloat(diff / price * 100).toFixed(2);
				console.log("balance  : Rp" + subtotal.toLocaleString() + ",00");
				var oa = parseInt(subtotal * percent / 100);
				if (price > lastprice) {
					console.log("loss : - Rp" + oa.toLocaleString() + ",00");
					subtotal = parseInt(subtotal - (subtotal * oa));
					console.log('percent : - ' + percent + " %");
					hold = hold - oa - fee;
				}
				else {
					console.log("profit : + Rp" + oa.toLocaleString() + ",00");
					subtotal = parseInt(subtotal + (subtotal * oa));
					console.log('percent : + ' + percent + " %");
					hold = hold + oa - fee;
				}
				console.log('----------------------------------');
			}
		} else {
			sell = sell + subtotal - fee;
		}
	}
	var total = parseInt(sell - buy);
	console.log("buy total : Rp" + buy.toLocaleString() + ",00");
	console.log("sell total : Rp" + sell.toLocaleString() + ",00");
	console.log("On hold balance : Rp" + holdb.toLocaleString() + ",00");
	if (hold < 0) {
		console.log("\x1b[31m", "On hold profit/loss : Rp" + hold.toLocaleString() + ",00");
	} else {
		console.log('\x1b[36m%s\x1b[0m', "On hold profit/loss : Rp" + hold.toLocaleString() + ",00");
	}
	console.log('Estimated on hold balance : Rp' + (holdb + hold).toLocaleString() + ",00");
	if (total + hold < 0) {
		console.log("\x1b[31m", "Overall of " + requ['pair'] + " : Rp" + (total + hold).toLocaleString() + ",00");
	} else {
		console.log('\x1b[36m%s\x1b[0m', "Overall of " + requ['pair'] + " : Rp" + (total + hold).toLocaleString() + ",00");
	}
}

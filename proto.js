var http = require("http");
const request = require('request');
var crypto = require('crypto');
const querystring = require('querystring');
var apik='2DMYDAI4-9VZCKEOI-BYSSMOHU-OBVIMEPP-ZYB4WR4V'; // your API-key
var secret = '0854dd967d556e5178765ac09123061de311db0137d839447ebfd478269b56b7487973e4216857db'; // your Secret-key
var parameter=process.argv[2];
var requ={};
requ['method']="tradeHistory";
requ['pair']=parameter+"_idr";
requ['nonce']=Math.floor(Date.now()/1000);
var post_data=querystring.stringify(requ, '&', '=');
var sign=signHmacSha512(secret,post_data);
var headers = {
    sign : sign,
    key : apik
  };
  var useragent="Mozilla/4.0 (compatible; INDODAXCOM PHP client; Linux; PHP/7.1.10)";
  request.post({
    url: 'https://indodax.com/tapi/',
    form: post_data,
    headers: headers
  },
  function(error,response, body){
  	var return1=JSON.parse(response.body);
  	//console.log(JSON.stringify(return1.return.trades[0]));
  	var buy=0;
  	var sell=0;
  	var counter=0;
  	console.log(return1.return.trades.length);
  	console.log(return1.return.trades);
  	for(i=return1.return.trades.length-1;i>=0;i--){
  		counter++;
  		//console.log(counter);
  		var type="";
  		var quantity=0;
  		var price=0;
	  	Object.keys(return1.return.trades[i]).forEach(function(key) {
	 	 	var val = return1.return.trades[i];
	 	 	if(key=="type"){
	 	 		type=val[key];
	 	 	//	console.log(type);
	 	 	}
	 	 	if(key==requ['pair'].split("_")[0]){
	 	 		quantity=parseFloat(val[requ['pair'].split("_")[0]]);
	 	 		//console.log(quantity);
	 	 	}
	 	 	if(key=="price"){
	 	 		price=parseInt(val[key]);
	 	 		//console.log(price);
	 	 	}
	 	 	//console.log(i+" "+key+" : "+val[key]);
		});
		if(type=="buy"){
			var a=i;
			while(return1.return.trades[a]!=null){
				if (return1.return.trades[a]['type']=="sell") {
					// statement
					buy=buy+parseInt(quantity*price);
					break;
				}
				a--;
				//console.log("buy: "+buy);
			}
		}else{
			sell=sell+parseInt(quantity*price);
			//console.log("sell: "+sell);
		}
		//console.log('');
	}
	var total=parseInt(sell-buy);
	console.log("Overall of "+requ['pair']+" : Rp"+total+",00");
   });
function signHmacSha512(key, str) {
  let hmac = crypto.createHmac("sha512", key);
  let signed = hmac.update(new Buffer.from(str, 'utf-8')).digest("hex");
  return signed;
}

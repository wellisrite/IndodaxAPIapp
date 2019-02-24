var Bot = require("./bot.js");
var request = require('request');
var scanf=require('scanf');

var idx = new Bot();
console.log("INDODAX BOT");
console.log("----------------------");
console.log('1.Info Balance dan coins\n'+
			'2.Pasang StopLoss\n'+
			'3.Exit\n'+
			'Pilihan Menu : '
	);
menu=scanf('%d');
var method;
req={};
	switch(menu){
		case 1:
			method="getInfo";
			getBalance();
			break;
		case 2:
			setStopLoss();
			break;
		case 3:
			process.exit()
			break;
		default:
			console.log("wrong input!");
			break;
	}
function setStopLoss(){
	method="openOrders";
	idx.idx_query(method,req,function(open){
		if(open.success==1){
			var orders=open.return.orders;
			var a=0;
			var keys=[];
			var done=0;
			while(!done){
				Object.keys(orders).forEach(function(key){
					console.log(a+1+".)"+key);
					keys.push(key);
					a++;
				});
				console.log("pilih pair:");
				var nopair=scanf('%d');
				if(keys[nopair-1]!=undefined)
					done=1;
				else
					console.log("pilihan salah!");
			}
			console.log(orders[keys[nopair-1]]);
		}else{
			console.log(open.error);
		}
	})
}
// console.log("input pair");
// pair=scanf('%s');
// if(pair!=null){
// 	req={'coin' : pair,'count':1,'from':0};
// }else{
// 	req={};
// }
// if(method=="orderHistory"){
// 	idx.idx_query(method,req, function(open){
// 		if(open.success==1){
// 			var orders=open.return.orders;
// 			Object.keys(orders).forEach(function(key){
// 				if(orders[key].status!="cancelled")
// 					console.log(open.return.orders[key]);	
// 			});
// 			//console.log(open.return);
// 		}
// 		else{
// 			console.log(open.error);
// 		}
// 	});
// }else if (method=="getInfo") {
	

// }
// else{
// 	idx.idx_query(method,req, function(open){
// 		if(open.success==1){
// 			console.log(open.return);
// 		}
// 		else{
// 			console.log(open.error);
// 		}
// 	});

// }
function getBalance(){
	console.log("PROFILE\n-----------------------------");
	idx.getProfile(function(open){
		if(open.success==1){
			var ownedcoins={};
			var idr=0;
			Object.keys(open.return.balance).forEach(function(key){
				var number=parseFloat(open.return.balance[key]);
				if(number>0&&key!="idr"){
					ownedcoins[key]=number;
				}else if (key=="idr") {
					idr+=number;
				}
			});
			Object.keys(open.return.balance_hold).forEach(function(key){
				var number=parseFloat(open.return.balance_hold[key]);
				if(number>0&&key!="idr"){
					ownedcoins[key]=number;
				}else if (key=="idr") {
					idr+=number;
				}
			});

			console.log(
				"Name  : "+open.return.name+"\n"+
				"Email : "+open.return.email+"\n"+
				"Owned coins : "+
				"\n----------------------------"
			);
			Object.keys(ownedcoins).forEach(function(key){
				console.log('\t* '+ownedcoins[key]+" "+key);
				request('https://indodax.com/api/'+key+'_idr/ticker', function (error, response, body) {
				  lastprice=parseInt(JSON.parse(response.body).ticker.last);
				  idr+=ownedcoins[key]*lastprice;
				});
			})
			setTimeout(showbalance,1050);
			function showbalance(){
				console.log('----------------------------\nEstimated balance : '+idr.toLocaleString()+" IDR");
			}
		}
		else{
			console.log(open.error);
		}
	});
}
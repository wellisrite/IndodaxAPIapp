var http = require("http");
const request = require('request');
var crypto = require('crypto');
const Table = require('cli-table');
const querystring = require('querystring');
var colors=require('colors');
var player = require('play-sound')(opts = {})

if(process.argv[3]!=null)
	var minutes=process.argv[3];
else
	var minutes=30;
var delay=minutes*60*1000;
var apik=''; // your API-key
var secret = ''; // your Secret-key
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var keys=process.argv[2];
tick();
setInterval(tick,delay);
//tick();
function tick(){
	//console.log("\u001b[2J\u001b[0;0H");
	var table = new Table({
		style: {
            head: [],
            border: []
        },
	    head: ["Time",'name',"Lastprice","Volume"],
	    colWidths : [20,7,20,17]
	});
	process.stdout.write('\033c');
	request('https://indodax.com/api/'+keys+'_idr/ticker', function (error, response, body) {
			var ticker=JSON.parse(response.body);
	        getCoin(ticker,keys);
	});
	function getCoin(tickers,coin){
		 MongoClient.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true },function(err,db){
	        dbo=db.db('trade');
	        dbo.collection("coins").find({_id:coin},{lastprice:1,_id:0}).toArray(function(err,result){
	        	lastpriceO=result[0].lastprice;
	        	volumeO=result[0].volume;
	        	updateandshow(tickers,coin,lastpriceO,volumeO);
	        });
		 });
		}
	 function updateandshow(tickers,coin,lastpriceO,volumeO){
	 	 var ticker=tickers.ticker;
		 var lastpriceO;
		 var lastprice=parseInt(ticker.last);
	     var highprice=parseInt(ticker.high);
	     var lowprice=parseInt(ticker.low);
	     var test="vol_"+coin;
	     var volume=parseFloat(ticker[test]);
	     var servertime=parseInt(ticker.server_time);
	       var myquery={_id: coin};
	        var newvalues={$set:{lastprice: lastprice,highprice:highprice,lowprice:lowprice,volume:volume,server_time:servertime}};
	        MongoClient.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true },function(err,db){
	        dbo=db.db('trade');
			dbo.collection('coins').updateOne(myquery, newvalues, function(err, res) {
	          if (err) throw err;
	          //process.stdout.write(coin+" updated");
	          // process.stdout.clearLine();
	          // process.stdout.cursorTo(0);
	    	});
	    	dbo.collection("coins").find({_id:coin}).toArray(function(err,result){
	    	//console.log(result);
	          var lastpricen=result[0].lastprice;
	          var volumen=result[0].volume;
	          var diff=lastpricen-lastpriceO;
	          var vdiff=volumen-volumeO;
	          if(diff>0)
	          		lastpricen=("▲ "+lastpricen.toLocaleString()+" IDR").cyan;
	          else if (diff<0) 
	          		lastpricen=("▼ "+lastpricen.toLocaleString()+" IDR").red;	
	          else
	          		lastpricen=(lastpricen.toLocaleString()+" IDR");		
	          if(vdiff>0)
	          		volume=("▲ "+volumen.toLocaleString()+" "+result[0].name).cyan;
	          else if (vdiff<0) 
	          		volume=("▼ "+volumen.toLocaleString()+" "+result[0].name).red;	
	          else
	          		volume=volume.toLocaleString()+" "+result[0].name;	
	          var date=new Date(result[0].server_time*1000);
	    	  var formattedDate =date.getDate()+"-"+(date.getMonth() + 1)+ '-' +date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	          table.push([
	          	[formattedDate],
	          	[result[0].name],
	          	[lastpricen],
	          	[volume]] 
	          );
	          console.log(table.toString());
	          process.stdout.write(" delay : "+(delay/1000/60).toFixed(2)+"m     ");
	          if(diff>0){
	          	process.stdout.write(" Price : ");	
	          	process.stdout.write(("▲ "+diff.toLocaleString()+" IDR\t").cyan);
	          	if(diff/lastpriceO*100>=1)
	          	player.play('/home/well/nodejs/tradeidx/high.mp3',{ timeout: 300 });
	          }else if (diff<0) {
	          	diff=diff*(-1);
	          	process.stdout.write(" Price : ");	
	          	process.stdout.write(("▼  "+diff.toLocaleString()+" IDR\t").red);
	          	if(diff/lastpriceO*100>=1)
	          	player.play('/home/well/nodejs/tradeidx/low.mp3',{ timeout: 300 });
 
	          }else{
	          	process.stdout.write(" No price change \t");
	          }
	          if(vdiff>0){
	          	process.stdout.write(" Volume : ");
	          	process.stdout.write(("▲ "+vdiff.toLocaleString()+" "+coin).cyan);
	          }
	          else if(vdiff<0){
	          	vdiff=vdiff*(-1);
	          	process.stdout.write(" Volume : ");
	          	process.stdout.write(("▼ "+vdiff.toLocaleString()+" "+coin).red);
	          }
	          else{
	          	process.stdout.write(" No volume change ");
	          }
	          db.close();
		    });
	     });
	 }
}

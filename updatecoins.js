var http = require("http");
const request = require('request');
var crypto = require('crypto');
const querystring = require('querystring');
var apik='2DMYDAI4-9VZCKEOI-BYSSMOHU-OBVIMEPP-ZYB4WR4V'; // your API-key
var secret = '0854dd967d556e5178765ac09123061de311db0137d839447ebfd478269b56b7487973e4216857db'; // your Secret-key
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 MongoClient.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true },function(err,db){
    dbo=db.db('trade');
    dbo.collection('onlowcoins').deleteMany( function(err) {
      if (err) throw err;
     console.log("onlowcoins Emptied");
     db.close();
    });
    // dbo.createCollection("onlowcoins",function(err,res){
    //       if (err) throw err;
    //       console.log("onlowcoins created");
    //       db.close();
    // });
  });
var requ={};
// var lastprice=0;
// var lowprice=0;
// var highprice=0;
requ['method']="getInfo";
// requ['pair']=parameter+"_idr";
requ['nonce']=Math.floor(Date.now()/1000);
console.log("Updating coins");
console.log('---------------------------------');
var post_data=querystring.stringify(requ, '&', '=');
var sign=signHmacSha512(secret,post_data);
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
    updateCoins(response);
});
function updateCoins(response){
  var profile=JSON.parse(response.body);
  var coins=profile.return.balance;
  Object.keys(profile.return.balance).forEach(function(keys){
    //console.log(keys);
    var lastprice=0;
    var highprice=0;
    var lowprice=0;
    if(keys!="idr"){
      request('https://indodax.com/api/'+keys+'_idr/ticker', function (error, response, body) {
        updatecoin(response);
      });
    }
    function updatecoin(response){
        var lastprice=parseInt(JSON.parse(response.body).ticker.last);
        var highprice=parseInt(JSON.parse(response.body).ticker.high);
        var lowprice=parseInt(JSON.parse(response.body).ticker.low);
        var test="vol_"+keys;
        var volume=parseFloat(JSON.parse(response.body).ticker[test]);
        var servertime=parseInt(JSON.parse(response.body).ticker.server_time);
        var difference=highprice-lowprice;
        var lastdiff=lastprice-lowprice;
        if(lastdiff/difference<(15/100)){
          //console.log(keys+" is on low price");
          //console.log(onlowcoins[1]);
        }else if (lastdiff/difference>50/100) {
         // console.log(keys+"is on high price");
        }
        // console.log(keys+"'s High : Rp"+highprice.toLocaleString()+",00");
        // console.log(keys+"'s Price : Rp"+lastprice.toLocaleString()+",00");
        // console.log(keys+"'s Low : Rp"+lowprice.toLocaleString()+",00");
        // console.log('---------------------------------');
        MongoClient.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true },function(err,db){
            dbo=db.db('trade');
            var myquery={_id: keys};
            var newvalues={$set:{lastprice: lastprice,highprice:highprice,lowprice:lowprice,volume:volume,server_time:servertime}};
             if(lastdiff/difference<(15/100)){
              var myobj={name: keys};
              dbo.collection("onlowcoins").insertOne(myobj, function(err, res) {
                  if (err) throw err;
                  //console.log("1 document inserted");
                });
             }
            dbo.collection('coins').updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
                  process.stdout.clearLine();
                  process.stdout.cursorTo(0);
                  process.stdout.write(keys+" updated");
              db.close();
            });
        });
      }
  });
  // console.log("On low price coins");
  // console.log('-------------------------------');
  // onlowcoins.forEach( function(element, index) {
  //   console.log(index+'). '+element);
  // });
  //process.exit();
}
function signHmacSha512(key, str) {
  let hmac = crypto.createHmac("sha512", key);
  let signed = hmac.update(new Buffer.from(str, 'utf-8')).digest("hex");
  return signed;
}

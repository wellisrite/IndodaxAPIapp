var http = require("http");
const request = require('request');
var crypto = require('crypto');
const querystring = require('querystring');
var apik = ''; // your API-key
var secret = ''; // your Secret-key
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
MongoClient.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true }, function (err, db) {
  dbo = db.db('trade');
  dbo.collection('onlowcoins').deleteMany(function (err) {
    if (err) throw err;
    console.log("onlowcoins Emptied");
    db.close();
  });
});
var requ = {};
requ['method'] = "getInfo";
requ['nonce'] = Math.floor(Date.now() / 1000);
console.log("Updating coins");
console.log('---------------------------------');
var post_data = querystring.stringify(requ, '&', '=');
var sign = signHmacSha512(secret, post_data);
var useragent = "Mozilla/4.0 (compatible; INDODAXCOM PHP client; Linux; PHP/7.1.10)";
var headers = {
  sign: sign,
  key: apik
};

request.post({
  url: 'https://indodax.com/tapi/',
  form: post_data,
  headers: headers
},
  function (error, response, body) {
    updateCoins(response);
  });
function updateCoins(response) {
  var profile = JSON.parse(response.body);
  var coins = profile.return.balance;
  Object.keys(profile.return.balance).forEach(function (keys) {
    var lastprice = 0;
    var highprice = 0;
    var lowprice = 0;
    if (keys != "idr") {
      request('https://indodax.com/api/' + keys + '_idr/ticker', function (error, response, body) {
        updatecoin(response);
      });
    }
    function updatecoin(response) {
      var lastprice = parseInt(JSON.parse(response.body).ticker.last);
      var highprice = parseInt(JSON.parse(response.body).ticker.high);
      var lowprice = parseInt(JSON.parse(response.body).ticker.low);
      var test = "vol_" + keys;
      var volume = parseFloat(JSON.parse(response.body).ticker[test]);
      var servertime = parseInt(JSON.parse(response.body).ticker.server_time);
      var difference = highprice - lowprice;
      var lastdiff = lastprice - lowprice;
      MongoClient.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true }, function (err, db) {
        dbo = db.db('trade');
        var myquery = { _id: keys };
        var newvalues = { $set: { lastprice: lastprice, highprice: highprice, lowprice: lowprice, volume: volume, server_time: servertime } };
        if (lastdiff / difference < (15 / 100)) {
          var myobj = { name: keys };
          dbo.collection("onlowcoins").insertOne(myobj, function (err, res) {
            if (err) throw err;
          });
        }
        dbo.collection('coins').updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(keys + " updated");
          db.close();
        });
      });
    }
  });

}
function signHmacSha512(key, str) {
  let hmac = crypto.createHmac("sha512", key);
  let signed = hmac.update(new Buffer.from(str, 'utf-8')).digest("hex");
  return signed;
}

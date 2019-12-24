const Table = require('cli-table');
var http = require("http");
const request = require('request');
var crypto = require('crypto');
const table = new Table({
  head: ['Id', 'Name', "Lastprice", "High", "Low", "Volume"],
  colWidths: [7, 10, 15, 15, 15, 20]
});

const querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var onlowcoins = [];
var requ = {};
requ['method'] = "getInfo";
requ['nonce'] = Math.floor(Date.now() / 1000);
console.log("Fetching coins");
console.log('---------------------------------');
MongoClient.connect("mongodb://localhost:27017/trade", { useNewUrlParser: true }, function (err, db) {
  dbo = db.db('trade');
  dbo.collection("coins").find({}).toArray(function (err, result) {
    if (err) throw err;
    for (i = 0; i < result.length - 1; i++) {
      var volume = result[i].volume.toFixed(2);
      table.push({ [i + 1]: [[result[i].name], [result[i].lastprice.toLocaleString()], [result[i].highprice.toLocaleString()], [result[i].lowprice.toLocaleString()], [result[i].volume.toLocaleString() + " " + result[i].name]] });
    }
    console.log(table.toString());
  });
  dbo.collection("onlowcoins").find({}).toArray(function (err, result) {
    console.log("On low price coins");
    console.log('-------------------------------');
    for (i = 0; i < result.length; i++) {
      process.stdout.write(result[i].name + ",");
    }
    console.log('');
    db.close();
  });
});

function signHmacSha512(key, str) {
  let hmac = crypto.createHmac("sha512", key);
  let signed = hmac.update(new Buffer.from(str, 'utf-8')).digest("hex");
  return signed;
}

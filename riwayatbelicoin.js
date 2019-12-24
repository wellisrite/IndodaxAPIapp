var http = require("http");
const request = require('request');
var crypto = require('crypto');
const querystring = require('querystring');
var coin = process.argv[2];
request('https://indodax.com/api/' + coin + '_idr/trades', function (error, response, body) {
  trades(response);
});
function trades(response) {
  console.log("jumlah jual dan beli " + coin);
  console.log("--------------------------------");
  var save = JSON.parse(response.body);
  var totalsold = 0;
  var totalbought = 0;
  for (i = 0; i < save.length; i++) {
    if (save[i].type == "sell") {
      totalsold = totalsold + parseFloat(save[i].amount);
    } else {
      totalbought = totalbought + parseFloat(save[i].amount);
    }
  }
  console.log("Jumlah Terjual : " + totalsold.toFixed(2));
  console.log("Jumlah Terbeli : " + totalbought.toFixed(2));
}

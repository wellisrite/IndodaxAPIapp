var http = require("http");
const request = require('request');
var crypto = require('crypto');
const querystring = require('querystring');
var coin=process.argv[2];
if(typeof process.argv[3]!="undefined"){
	var limit=process.argv[3];
}
else{
	var limit=10;
}
request('https://indodax.com/api/'+coin+'_idr/depth', function (error, response, body) {
  countDepth(response);
});
function countDepth(response){
  console.log("perbedaan volume jual dan beli "+coin);
  console.log("--------------------------------");
  var save=JSON.parse(response.body);
  var volsell=0;
  var volbuy=0;
  for(i=0;i<limit;i++){
    volsell=volsell+parseFloat(save['sell'][i][1]);
  }
  for(i=0;i<limit;i++){
    volbuy=volbuy+parseFloat(save['buy'][i][1]);
  }
  console.log("harga terendah jual : Rp"+save['sell'][0][0].toLocaleString()+",00");
  console.log("harga tertinggi beli : Rp"+save['buy'][0][0].toLocaleString()+",00");
  console.log("volume jual : "+volsell.toFixed(2));
  console.log("volume beli : "+volbuy.toFixed(2));
  if(volsell<volbuy){
    console.log("Demand lagi tinggi nih!");
  }else{
    console.log("Yang jualan banyak yang beli dikit?");
  }
}

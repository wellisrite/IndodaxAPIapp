var http = require("http");
const request = require('request');
var crypto = require('crypto');
const querystring = require('querystring');
var coin=process.argv[2];
request('https://indodax.com/api/'+coin+'_idr/trades', function (error, response, body) {
  trades(response);
});
function trades(response){
  console.log("jumlah jual dan beli "+coin);
  console.log("--------------------------------");
  var save=JSON.parse(response.body);
  var totalsold=0;
  var totalbought=0;
  //console.log(save);
  for(i=0;i<save.length;i++){
    if(save[i].type=="sell"){
      totalsold=totalsold+parseFloat(save[i].amount);
    }else{
      totalbought=totalbought+parseFloat(save[i].amount);
    }
  }
  console.log("Jumlah Terjual : "+totalsold.toFixed(2));
  console.log("Jumlah Terbeli : "+totalbought.toFixed(2));
  // var volsell=0;
  // var volbuy=0;
  // for(i=0;i<save['sell'].length;i++){
  //   volsell=volsell+parseFloat(save['sell'][i][1]);
  // }
  // for(i=0;i<save['buy'].length;i++){
  //   volbuy=volbuy+parseFloat(save['buy'][i][1]);
  // }
  // console.log("harga terendah jual : Rp"+save['sell'][0][0]+",00");
  // console.log("harga tertinggi beli : Rp"+save['buy'][0][0]+",00");
  // console.log("volume jual : "+volsell.toFixed(2));
  // console.log("volume beli : "+volbuy.toFixed(2));
  // if(volsell<volbuy){
  //   console.log("Demand lagi tinggi nih!");
  // }else{
  //   console.log("Yang jualan banyak yang beli dikit?");
  // }
}

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var coin = process.argv[2];
var quantity = process.argv[3];
console.log("Fetching " + coin + " price");
console.log('---------------------------------');
MongoClient.connect("mongodb://localhost:27017/trade", { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("trade");
      dbo.collection("coins").find({ _id: coin }).toArray(function (err, result) {
            var lastprice = result[0].lastprice;
            console.log(quantity + " " + coin + " = Rp " + (quantity * lastprice).toLocaleString() + ",00");
            db.close();
      });
});
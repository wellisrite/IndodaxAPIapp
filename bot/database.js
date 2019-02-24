//****************** create database named trade
// var MongoClient = require('mongodb')m
// var url = "mongodb://localhost:27017/trade";
//
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });


// ********************** create Collection
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
//
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("trade");
// dbo.createCollection("coins",function(err,res){
//   if (err) throw err;
//   console.log("coins created");
// })
//   dbo.createCollection("profile", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });
//
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
//
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("trade");
//   var myobj = { name: "Sam", balance: 100000000 };
//   var coins = [{ name: "btc"},{name : "eth"}];
//   dbo.collection("profile").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
//
//   dbo.collection("coins").insertMany(coins, function(err, res) {
//     if (err) throw err;
//     console.log("Number of documents inserted: " + res.insertedCount);
//     console.log(res);
//   db.close();
// });
// });

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("trade");
// dbo.createCollection("onlowcoins",function(err,res){
//   if (err) throw err;
//   console.log("coins created");
//   db.close();
// })
// });

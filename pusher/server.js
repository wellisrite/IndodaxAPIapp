var http = require('http');
var fs = require('fs');
var Pusherr=require('./asd');
http.createServer(function (req, res) {
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}).listen(8080);

Pusher.logToConsole = true;

var pusher = new Pusher('8348bfd951e9735a27ef', {
  cluster: 'ap1',
  encrypted: true
});

var channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
 console.log(JSON.stringify(data));
});
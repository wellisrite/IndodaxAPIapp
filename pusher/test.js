var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '572104',
  key: '8348bfd951e9735a27ef',
  secret: '7c8c9b5e3ba135f9d922',
  cluster: 'ap1',
  encrypted: true
});

pusher.trigger('my-channel', 'my-event', {
  "message": "hello world"
});
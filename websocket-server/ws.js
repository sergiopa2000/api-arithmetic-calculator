var WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({port: 8023});

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    ws.send('enviado desde server');
  });

  
});
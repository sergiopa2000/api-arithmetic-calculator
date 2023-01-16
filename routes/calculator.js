const WebSocket = require("ws");
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const spawn = require('child_process').spawn;

router.get('/calc', async (req, res) => {
    const ws = new WebSocket('ws://' + process.env.WS_IP + ':' + process.env.WS_PORT);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    let phpScript = spawn('php', ["./test.php", "(((1+3)*(3+4))*(2+5))/3"]);

    phpScript.stdout.on('data', data =>{
        setTimeout(() =>{
            ws.send('something');
            ws.close();
        }, 5000);
    })
    
    res.json({
        ip: process.env.WS_IP,
        port: process.env.WS_PORT,
        mensaje: 'waiting!'
    })
});
module.exports = router;
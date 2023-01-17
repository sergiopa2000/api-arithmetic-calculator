const WebSocket = require("ws");
const router = require('express').Router();
const spawn = require('child_process').spawn;
const jwt = require('jsonwebtoken');
router.get('/calc', async (req, res) => {
    let phpScript = spawn('php', ["./calculator.php", "(((1+3)*(3+4))*(2+5))/3"]);

    phpScript.stdout.on('data', data =>{
        console.log(data.toString());
    })
    
    res.json({
        ip: process.env.WS_IP,
        port: process.env.WS_PORT,
        mensaje: 'waiting!'
    })
});
module.exports = router;
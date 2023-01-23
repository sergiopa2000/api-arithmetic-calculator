const WebSocket = require("ws");
const https = require("https");
const router = require('express').Router();
const geoip = require('geoip-lite');
const spawn = require('child_process').spawn;
const jwt = require('jsonwebtoken');

function getLocalhostPublicIp(){
    return new Promise((resolve, reject) =>{
        https.get('https://ifconfig.me/ip', (res) => {
            let data = '';
    
            // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });
    
            // The whole response has been received. Print out the result.
            res.on('end', () => {
                console.log(data);
                resolve(data);
            });
    
            res.on('error', (err) => {
                reject(err);
            });
    
        })
    })
}

router.get('/calc', async (req, res) => {
    let ipAddress = req.socket.remoteAddress.replace(/^.*:/, '');
    if(ipAddress == "127.0.0.1"){
        ipAddress = await getLocalhostPublicIp();
    }
    const location = geoip.lookup(ipAddress);
    res.json({
        ip: process.env.WS_IP,
        port: process.env.WS_PORT,
        location: location
    })
});
module.exports = router;
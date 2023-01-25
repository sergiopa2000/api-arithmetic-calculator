
const url = require('url');
const parser = require('../jison/parser');
const Queue = require('bull');
const jobQueue = new Queue("requests", {
    limiter: {
      max: 500,
      duration: 5000
    }
});
const BlackListToken = require('../models/blacklist-token');
async function verifyToken(token){
    const jwt = require('jsonwebtoken');
    let isBlackListed = await BlackListToken.find({token: token});
    let verified = true;

    if(isBlackListed.length > 0) verified = false;
    
    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
        if(err) verified = false;
    });

    return verified;
}

function startWsServer(srv){
    const WebSocket = require('ws');
    require('dotenv').config()
    
    const wss = new WebSocket.Server({ server: srv, path: '/ws' });
    
    // Create an empty list that can be used to store WebSocket clients.
    let wsClients = [];
    
    wss.on('connection', async (ws, req) => {
        let token = url.parse(req.url, true).query.token;
        let operation = url.parse(req.url, true).query.operation;

        let tokenVerified = await verifyToken(token);
        if(!tokenVerified){
            ws.send(JSON.stringify({ message: "The token provided is invalid or expired"}));
            ws.close();
        }else{
            ws.send(JSON.stringify({message: 'Your operation is being processed...'}));
            let job = await jobQueue.add({token: token, operation: operation});
            let result = await job.finished();
            if(result){
                ws.send(JSON.stringify(result));
                ws.close();
            }
        }
    });

    jobQueue.process((job, done) => {
        let token = job.data.token;
        let operation = job.data.operation;

        if(!wsClients[token]){
            wsClients[token] = {
                attemps: 4
            };
        }else{
            wsClients[token].attemps--;
            if(wsClients[token].attemps == 0){
                const date = new Date(Date.now());
                date.setMinutes(date.getMinutes() + 10);
                let blacklisted = new BlackListToken({
                    token: token,
                    expiration: date
                });
                blacklisted.save();
                delete wsClients[token];
            }
        }
        if(operation){
            let parsed = parser.parse(operation);
            if(parsed.result && parsed.result.toString().length > 8){
                parsed.result = parsed.result.toExponential().replace(/e\+?/, ' x 10^');
            }
            setTimeout(() =>{
                done(null, {...parsed, operation: operation});
            }, Math.floor(Math.random() * 4000))
        }
    });
}

module.exports = startWsServer;
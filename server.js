const WebSocket = require('ws');
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const url = require('url');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express();
app.use(cors());
app.use(bodyparser.json());

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:1888/?authMechanism=DEFAULT`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
 })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);
const calcRoutes = require('./routes/calculator');
app.use('/api', calcRoutes);

const PORT = process.env.PORT || 3001;
const srv = app.listen(PORT, () => {
    console.log(`server listening on: ${PORT}`)
})

/* --------- Web socket server --------- */
const spawn = require('child_process').spawn;
const wss = new WebSocket.Server({ server: srv, path: '/ws' });
const BlackListToken = require('./models/blacklist-token');
const parser = require('./jison/parser');

// Create an empty list that can be used to store WebSocket clients.
var wsClients = [];

wss.on('connection', async (ws, req) => {
    let token = url.parse(req.url, true).query.token;
    let operation = url.parse(req.url, true).query.operation;
    let isBlackListed = await BlackListToken.find({token: token});

    if(isBlackListed.length > 0){
        ws.send(JSON.stringify({
            message: "Your token is obsolote, please renew it"
        }));
        ws.close();
    }
    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
        if (err) {
            ws.send(JSON.stringify({
                message: "Your token is obsolote, please renew it"
            }));
            ws.close();
        } else {
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
                ws.send(JSON.stringify({
                    message: 'Your operation is being processed...'
                }));
                setTimeout(() =>{
                    ws.send(JSON.stringify({...parsed, operation: operation}));
                    ws.close();
                }, 1000)
            }
        }
    });
});
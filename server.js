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

mongoose.connect('mongodb://mongoadmin:secret@localhost:1888/?authMechanism=DEFAULT', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'users',
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
const wss = new WebSocket.Server({ server: srv, path: '/ws' });

// Create an empty list that can be used to store WebSocket clients.
var wsClients = [];

wss.on('connection', (ws, req) => {
    let token = url.parse(req.url, true).query.token;
    console.log(token);
    // let wsUsername = "";

    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
        if (err) {
            ws.close();
        } else {
            if(!wsClients[token]){
                wsClients[token] = {
                    ws: ws,
                    attemps: 4
                };
            }else{
                wsClients[token].attemps--;
            }
            // wsUsername = decoded.username;
        }
    });
    console.log(wsClients);

    ws.on('message', (data) => {
        for (const [token, connection] of Object.entries(wsClients)) {
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
                if (err) {
                    connection.send("Error: Your token is no longer valid. Please reauthenticate.");
                    connection.close();
                } else {
                    connection.send(wsUsername + ": " + data);
                }
            });
        }
    });
});
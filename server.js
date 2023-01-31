const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const fs = require("fs");

const bodyparser = require('body-parser');
const cors = require('cors');
const startProxy = require('./proxy/proxy-server');
const startWsServer = require('./ws/ws-server');
require('dotenv').config()

const app = express();
app.use(cors());
app.use(bodyparser.json());

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);
const calcRoutes = require('./routes/calculator');
app.use('/api', calcRoutes);

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:1888/?authMechanism=DEFAULT`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
 })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

const BlackListToken = require('./models/blacklist-token');
// Periodically clean blacklisted tokens
setInterval(async () =>{
    const all = await BlackListToken.find();
    const date = new Date(Date.now());
    for (const token of all) {
        if(date > token.expiration) token.delete();
    }
}, 1000);

const PORT = process.env.PORT || 3001;
const srv = https
    .createServer({
        key: fs.readFileSync("./proxy/certificates/localhost.key"),
        cert: fs.readFileSync("./proxy/certificates/localhost.crt"),
    }, app)
    .listen(PORT, ()=>{
        console.log(`server listening on: ${PORT}`)
        startProxy();
        startWsServer(srv);
    });
const https = require('https');
const fs = require("fs");
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config()

const app = express();
app.use(cors());

const targetPort = process.env.PORT || 3001;
app.use('/api', createProxyMiddleware({ 
        target: `https://api_global:${targetPort}/`,
        secure: false,
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) =>{
            const cert = req.socket.getPeerCertificate();
            if (!cert.subject) {
                return res.status(401)
                .json({ error: 'Your need to provide a certificate' })
            } else if (!req.client.authorized) {
                return res.json({ error: 'Invalid certificate' })
            }
            proxyReq.setHeader('serial', cert.serialNumber);
        }
    }
));

const PORT = 443;
https
.createServer(
    {
        key: fs.readFileSync("./certificates/localhost.key"),
        cert: fs.readFileSync("./certificates/localhost.crt"),
        ca: fs.readFileSync("./certificates/rootSSL.pem"),
        requestCert: true,
        rejectUnauthorized: false
    }, app)
.listen(PORT, ()=>{
    console.log(`proxy listening on: ${PORT}`)
});
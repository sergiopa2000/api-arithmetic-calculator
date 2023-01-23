function startProxy(){
    const https = require('https');
    const fs = require("fs");
    const express = require('express');
    const cors = require('cors');
    const { createProxyMiddleware } = require('http-proxy-middleware');
    require('dotenv').config()
    
    const app = express();
    app.use(cors());
    
    app.use('/api', createProxyMiddleware({ 
            target: 'http://localhost:3000',
            changeOrigin: true
        }
    ));

    const PORT = 443;
    https
    .createServer(
        {
            key: fs.readFileSync("./proxy/certificates/proxy.key"),
            cert: fs.readFileSync("./proxy/certificates/proxy.crt"),
        }, app)
    .listen(PORT, ()=>{
        console.log(`proxy listening on: ${PORT}`)
    });
}

module.exports = startProxy;
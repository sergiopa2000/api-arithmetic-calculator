function startProxy(){
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
    
    const PORT = 8000;
    app.listen(PORT, () => {
        console.log(`proxy listening on: ${PORT}`)
    })
}

module.exports = startProxy;
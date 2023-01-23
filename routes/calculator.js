const WebSocket = require("ws");
const router = require('express').Router();
const spawn = require('child_process').spawn;
const jwt = require('jsonwebtoken');
router.get('/calc', async (req, res) => {
    res.json({
        ip: process.env.WS_IP,
        port: process.env.WS_PORT,
    })
});
module.exports = router;
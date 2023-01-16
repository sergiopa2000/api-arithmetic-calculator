const router = require('express').Router();
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    let process = spawn('php', ["./test.php", "(((1+3)*(3+4))*(2+5))/3"]);

    process.stdout.on('data', data =>{
        res.json({
            data: data.toString(),
            estado: true,
            mensaje: 'working!'
        })
    })
});
module.exports = router;
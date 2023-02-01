const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const isRegistered = await User.findOne({ email: req.body.email });
    if (isRegistered) return res.status(500).json({ error: 'Email has already been registered' });

    let response;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    });
    try{
        response = await user.save();
    }catch (err){
          response = { error: err.message };
    }finally{
          res.json(response);
    }
});

router.post('/login', async (req, res) => {
    const serialNumber = req.headers['serial'];
    const token = jwt.sign({
        serialNumber: serialNumber,
    }, process.env.PRIVATE_KEY
    , { expiresIn: 900 })

    res.json({
        message: 'You have successfully logged in',
        token: token,
        attemps: 5
    })
});
module.exports = router;
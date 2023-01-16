const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
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
          response = { message: err };
    }finally{
          res.json(response);
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Wrong password' })
    
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.PRIVATE_KEY
    , { expiresIn: 900 })
    
    res.json({
        message: 'You have successfully logged in',
        token: token
    })
});

router.post('/logout', (req, res) => {
    res.json({message: "success"})
})
module.exports = router;
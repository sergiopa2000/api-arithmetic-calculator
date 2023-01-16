const jwt = require('jsonwebtoken')

// middleware to validate token (rutas protegidas)
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return res.status(401).json({ error: 'Your need to provide a token to access this route' })
    try {
        const verified = jwt.verify(token, process.env.PRIVATE_KEY)
        req.user = verified
        next() // continuamos
    } catch (error) {
        res.status(400).json({error: 'The token is not valid'})
    }
}

module.exports = verifyToken;
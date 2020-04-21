// import jsonwebtoken
const jwt = require('jsonwebtoken')

// Middleware function
module.exports = function(req, res, next) {

    // get token from header
    // const token = req.header('auth-token')
    // console.log(req.body)
    const token = req.body.token
    // if have, then allow. If don't have, then don't allow
    if(!token) return res.status(401).json({ message: 'Accessed denied!' })
    // if(!token) return res.redirect('')

    try {

        // verify the exist token
        const varified = jwt.verify(token, process.env.TOKEN_4LOGINUSER)
        req.user = varified
        next()
    } catch(err) {
        res.status(400).json({ message: 'Invalid token!' })
    }

    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')
    // if(!token) return res.status(401).json({ message: 'Accessed denied!' })

    // jwt.verify(token, process.env.TOKEN_$LOGINUSER, (err, user) => {
    //     if(err) return res.status(400).json({ message: 'Invalid token!' })
    //     req.user = user
    //     next()
    // })
}
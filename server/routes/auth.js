// import express & router together
const router = require('express').Router()
// import Data model
const All = require('../models/All')
// import bcryptjs - password hashing
const bcrypt = require('bcryptjs')
// import jsonwebtoken
const jwt = require('jsonwebtoken')
// import validation.js
const {loginValidation, registerValidation} = require('../validation')

// send register credentials to 'register.html'
// send register credentials response to 'register.html'
router.get('/register', async (req, res) => {

    // 1. validation
    const {error} = registerValidation(req.body)
    // if has error don't save
    if(error) {
        
        let errorMessage = error.details[0].message
        let errorMessageEdited

        // changing "name.firstName" string to "First Name"
        if( errorMessage === `"name.firstName" length must be at least 4 characters long` ||
            errorMessage === `"name.firstName" is not allowed to be empty`) {
            errorMessageEdited = errorMessage.replace(`"name.firstName"`, `"First Name"`)
        }
        // changing "name.lastName" string to "Last Name"
        if( errorMessage === `"name.lastName" length must be at least 4 characters long` ||
            errorMessage === `"name.lastName" is not allowed to be empty`) {
            errorMessageEdited = errorMessage.replace(`"name.lastName"`, `"Last Name"`)
        }
        // changing "email" string to "Email"
        if( errorMessage === `"email" length must be at least 6 characters long` ||
            errorMessage === `"email" must be a valid email` ||
            errorMessage === `"email" is not allowed to be empty`) {
            errorMessageEdited = errorMessage.replace(`"email"`, `"Email"`)
        }
        // changing "password" string to "Password"
        if( errorMessage === `"password" length must be at least 6 characters long` ||
            errorMessage === `"password" is not allowed to be empty`) {
            errorMessageEdited = errorMessage.replace(`"password"`, `"Password"`)
        }

        return res.json({ message: errorMessageEdited })
    }

    // 2. cross check the existance of user in db
    const  emailExist = await All.findOne({ email: req.body.email })
    // if 'same/exist', then throw 'message/error'
    if(emailExist) return res.json({ message: `Email already exist!` })

    // 3. hash then password
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // create a new user
    // aasigner req to new user
    const user = new All({
        name: {
            firstName: req.body.name.firstName,
            lastName: req.body.name.lastName
        },
        email: req.body.email,
        password: req.body.password
    })  

    try {
        const saveNewUser = await user.save()
        res.json({ user: user._id})
        // console.log(dataPassed)
    } catch(err) {
        res.json({
            message: err
        })
    }
})

// send login credentials to 'login.html'
router.get('/login', async (req, res) => {

    const token = res.header('auth-token')
    console.log(token)

    try {
        const all = await All.findOne()
        res.send(all)
    } catch {
        res.json({
            message: err
        })
    }
})

// send login credentials response to 'login.html'
router.post('/login', async (req, res) => {

    // console.log(req.body)
    // console.log(req.headers['token-key'])
    // res.send(`Everything's fine.`)

    // 1. validation
    const {error} = loginValidation(req.body)
    // if has error, then don't save
    if(error) {
        
        let errorMessage = error.details[0].message
        let errorMessageEdited

        // changing "inputEmail" string to "Email"
        if( errorMessage === `"inputEmail" length must be at least 6 characters long` ||
            errorMessage === `"inputEmail" must be a valid email` ||
            errorMessage === `"inputEmail" is not allowed to be empty`) {
            errorMessageEdited = errorMessage.replace(`"inputEmail"`, `"Email"`)
        }
        // changing "inputPassword" string to "Password"
        if( errorMessage === `"inputPassword" length must be at least 6 characters long` ||
            errorMessage === `"inputPassword" is not allowed to be empty`) {
            errorMessageEdited = errorMessage.replace(`"inputPassword"`, `"Password"`)
        }

        return res.json({ message: errorMessageEdited })
    }

    // 2. check the existance of user/email in db
    const userEmail = await All.findOne({email: req.body.inputEmail})
    // if 'same/exist', then throw 'message/error'
    // if(!userEmail) return res.status(400).send(`Email doesn't exist!`) // can't work (don't know why)
    if(!userEmail) return res.json({ message: `Email doesn't exist!` })

    // 3. check password (is correct)
    const validPassword = await All.findOne({password: req.body.inputPassword})
    // if(!validPassword) return res.status(400).send(`Invalid password!`) // can't work (don't know why)
    if(!validPassword) return res.json({ message: `Invalid password!` })
    // res.render('/client/components/login.html', { email: userEmail._id })

    // 4. create a assign token to user
    const token = jwt.sign({ _id: userEmail._id}, process.env.TOKEN_4LOGINUSER)
    // 5. add 'token' to header - just for identifier purposes (can be named as any)
    // res.header('auth-token', token).send(token)
    // res.header('auth-token', token).json({ message: 'Logged In', token: token })
    // res.setHeader('auth-token', token)
    res
    // .header('Access-Control-Expose-Headers', 'auth-token')
    .header('auth-token', token)
    .json({ message: 'Logged In', token: token})

    // res.json({ message: 'Logged In', token: token })
})

module.exports = router
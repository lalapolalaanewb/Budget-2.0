// import express
const express = require('express')
const app = express()
// import mongoose
const mongoose = require('mongoose')
// import cors
const cors = require('cors')
// import dotenv
const dotenv = require('dotenv')
dotenv.config()
// import Routes
const authRoute = require('./routes/auth')
const homeRoute = require('./routes/home')
const testRoute = require('./routes/test')

// A. Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('Connected to Budget DB!')
)

// B. Global Middleware
// 1. Handle cors
app.use(cors({ exposedHeaders: 'auth-token' }))
// 2. Handle JSON body-parser
app.use(express.json())


// C. Routes Middleware
app.use('/auth', authRoute)
app.use('/', homeRoute)
app.use('/test', testRoute)

// D. Server Startup
app.listen(process.env.PORT || 5000, console.log('Budget server is up & running!'))
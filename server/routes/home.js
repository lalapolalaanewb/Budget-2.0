// import express & router together
const router = require('express').Router()
// import Data model
const All = require('../models/All')
// import verifyToken.js
const verify = require('../verifyToken')

router.post('/token', verify, async (req, res) => {
    
    // console.log(req.user)
    // const newData = await new All()
    const dbData = await All.findById({ _id: req.user._id})
    res.json({ name: dbData.name, data: dbData.data })

    // if no data in db create one
    // if(dbData) {
    //     res.json(dbData.data)
    // } else {
    //     res.json(newData.data)
    // }
})

router.post('/', verify, async (req, res) => {
    // res.send(req.user)

    // get user id from token
    const userID = req.user
    // console.log(userID._id)

    // handle try/catch for deleting existing data
    try {
        const dataPassed = await req.body.data
        console.log(dataPassed.budget)

        // 1. update data by user id
        const updateExisting = await All.findOne({ _id: userID._id})
        // console.log(updateExisting)
        updateExisting.data = {
            allItems: {
                exp: dataPassed.allItems.exp,
                inc: dataPassed.allItems.inc
            },
            totals: {
                exp: dataPassed.totals.exp,
                inc: dataPassed.totals.inc
            },
            budget: dataPassed.budget,
            percentage: dataPassed.percentage
        }

        // handle try/catch for saving new data
        try {
            const updateNew = await updateExisting.save()
            res.json({ message: 'Saved!' })
        } catch(err) {
            res.json({ message: err })
        }
        
        // res.send("Data removed & save")
    } catch(err) {
        res.json({
            message: err
        })
    }
})

module.exports = router
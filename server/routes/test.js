// import express & router together
const router = require('express').Router()
// import Data model
const All = require('../models/All')

router.get('/', async (req, res) => {

    try {
        const all = await All.find()
        res.send(all)
    } catch {
        res.json({
            message: err
        })
    }
})

router.post('/', async (req, res) => {

    const all = new All({
        name: {
            firstName: req.body.name.firstName,
            lastName: req.body.name.lastName
        },
        email: req.body.email,
        password: req.body.password,
        data: {
            allItems: {
                exp: req.body.data.allItems.exp,
                inc: req.body.data.allItems.inc
            },
            totals: {
                exp: req.body.data.totals.exp,
                inc: req.body.data.totals.inc
            },
            budget: req.body.data.budget,
            percentage: req.body.data.percentage
        }
    })

    try {
        const saveAll = await all.save()
        res.json(saveAll)
        // console.log(dataPassed)
    } catch(err) {
        res.json({
            message: err
        })
    }
})

module.exports = router
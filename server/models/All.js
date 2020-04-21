// import mongoose
const mongoose = require('mongoose')

// create Data Schema
const allSchema = new mongoose.Schema({
    name: {
        firstName: { type: String, required: true, min: 4, max: 255 },
        lastName: { type: String, required: true, min: 4, max: 255 }
    },
    email: { type: String, require: true, min: 6, max: 255 },
    password: { type: String, required: true, min: 6, max: 255 },
    data: {
        allItems: {
            // store all expenses here
            exp: [{
                id: { type: Number, require: true },
                description: { type: String, require: true, min: 2, max: 50 },
                value: { type: Number, require: true },
                percentage: { type: Number, require: true }
            }],
            // store all incomes here
            inc: [{
                id: { type: Number, require: true },
                description: { type: String, require: true, min: 2, max: 50 },
                value: { type: Number, require: true }
            }]
        },
        // store total incomes & expenses
        totals: {
            // sum of total expenses, init = 0
            exp: { type: Number, require: true, default: 0},
            // sum of total incomes, init = 0
            inc: { type: Number, require: true, default: 0}
        },
        // store total budgets, init = 0
        budget: { type: Number, require: true, default: 0 },
        // store percentage of total budget
        // init -1 = something is not in existance yet
        percentage: { type: Number, require: true, default: -1 }
    } 
})

module.exports = mongoose.model('All', allSchema)
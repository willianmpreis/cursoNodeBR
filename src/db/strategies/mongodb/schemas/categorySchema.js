const Mongoose = require('mongoose')

const categoryScheme = Mongoose.Schema({
    description: {
        type: String,
        require: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = Mongoose.model('category', categoryScheme)

const mongoose = require('mongoose')

const planetSchema = new mongoose.Schema({
    name: String,
    hasMoon: Boolean
})

const Planet = mongoose.model("Planet", planetSchema);

module.exports = Planet
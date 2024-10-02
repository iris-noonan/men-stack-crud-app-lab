const mongoose = require('mongoose')

const planetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hasMoon: { type: Boolean, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

const Planet = mongoose.model("Planet", planetSchema);

module.exports = Planet
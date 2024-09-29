// Imports
const mongoose = require('mongoose')
require('dotenv/config')

// Models
const Planet = require('../models/planet.js')


// Data
const planetData = require('./data/planets.js')

// Run seeds
const runSeeds = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('🔒 Database connection established')

        // Clear existing data
        const deletedPlanets = await Planet.deleteMany()
        console.log(`❌ ${deletedPlanets.deletedCount} planet deleted from the database`)

        // Add new data
        const planet = await Planet.create(planetData)
        console.log(`🪐 ${planet.length} planet added to the database`)

        // Close connection to the database
        await mongoose.connection.close()
        console.log('👋 Closing connection to MongoDB')

    } catch (error) {
        
    }
}
runSeeds()
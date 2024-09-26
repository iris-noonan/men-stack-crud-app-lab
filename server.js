const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv/config')

// ! -- Models
const Planet = require('./models/planet.js')

// ! -- Variables
const app = express()
const port = 3000

// ! -- Middleware
app.use(express.urlencoded({ extended: false}))
app.use(express.static('public'))
app.use(morgan('dev'))

// ! Route Handlers

// * Landing Page
app.get('/', (req, res) => {
  res.render('index.ejs')
})

// * New Page (form page)
app.get('/planets/new', (req, res) => {
  res.render('planets/new.ejs')
})

// * Create Route
app.post('/planets', async (req, res) => {
  try {
    if (req.body.hasMoon === 'on' ) {
      req.body.hasMoon = true
    } else {
      req.body.hasMoon = false
    }
    const planet = await Planet.create(req.body)
    console.log(planet)
    return res.redirect('/planets/new')
  } catch (error) {
    console.log(error)
    return res.status(500).send('An error occurred')  
  }
})

// ! -- 404
app.get('*', (req, res) => {
    return res.send('Page not found')
})

// ! -- Server Connections
const startServers = async () => {
    try {
        // Database Connection
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('🔒 Database connection established')
        // Server Connection
        app.listen(port, () => {
            console.log(`🚀 Sever up and running on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServers()
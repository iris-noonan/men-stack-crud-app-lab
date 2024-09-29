const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
require('dotenv/config')

// ! -- Models
const Planet = require('./models/planet.js')

// ! -- Variables
const app = express()
const port = 3000

// ! -- Middleware
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: false}))
app.use(express.static('public'))
app.use(morgan('dev'))

// ! Route Handlers

// * Landing Page
app.get('/', (req, res) => {
  res.render('index.ejs')
})

// * Index Page
app.get('/planets', async (req, res) => {
  try {
    const planets = await Planet.find()
    console.log(planets)
    return res.render('planets/index.ejs', {planets})
  } catch (error) {
    console.log(error)
    return res.status(500).send('<h1>An error occurred.<h1>')
  }
})

// * New Page (form page)
app.get('/planets/new', (req, res) => {
  res.render('planets/new.ejs')
})

// * Show Page
app.get('/planets/:planetId', async (req, res, next) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.planetId)) {
      const planet = await Planet.findById(req.params.planetId)
      if (!planet) return next()
      return res.render('planets/show.ejs', { planet })
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send('<h1>An error occurred.<h1>')
  }
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

// * Delete
app.delete('/planets/:planetId', async (req, res) => {
  try {
    const deletedPlanet = await Planet.findByIdAndDelete(req.params.planetId)
    return res.redirect('/planets')
  } catch (error) {
    console.log(error)
    return res.status(500).send('<h1>An error occurred.<h1>')
  }
})


// * Edit

app.get('/planets/:planetId/edit', async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.planetId)) {
      const planet = await Planet.findById(req.params.planetId)
      if (!planet) return next()
      return res.render('planets/edit.ejs', { planet })
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send('<h1>An error occurred.<h1>')
  }
});

app.put('/planets/:planetId', async (req, res) => {
  try {
    req.body.hasMoon = !!req.body.hasMoon
    const updatedPlanet = await Planet.findByIdAndUpdate(req.params.planetId, req.body)
    console.log(updatedPlanet)
    return res.redirect(`/planets/${updatedPlanet._id}`)
  } catch (error) {
    console.log(error)
    return res.status(500).send('<h1>An error occurred.<h1>')
  }
})


// ! -- 404
app.get('*', (req, res) => {
    return res.status(404).render('planets/404.ejs')
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
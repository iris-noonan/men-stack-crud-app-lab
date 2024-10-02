const mongoose = require('mongoose')
const express = require('express')

// ! -- Router
const router = express.Router()

// ! -- Model
const Planet = require('../models/planet.js')

// ! Middleware Functions
const isSignedIn = require('../middleware/is-signed-in.js')

// ! -- Routes
// * Each route is already prepended with `/planets`

// * Index Page
router.get('/', async (req, res) => {
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
  router.get('/new', isSignedIn, (req, res) => {
    res.render('planets/new.ejs')
  })
  
  // * Show Page
  router.get('/:planetId', async (req, res, next) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.planetId)) {
        const planet = await Planet.findById(req.params.planetId).populate('owner')
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
  router.post('/', isSignedIn, async (req, res) => {
    try {
      if (req.body.hasMoon === 'on' ) {
        req.body.hasMoon = true
      } else {
        req.body.hasMoon = false
      }
      req.body.owner = req.session.user._id
      const planet = await Planet.create(req.body)
      console.log(planet)
      return res.redirect('/planets')
    } catch (error) {
      console.log(error)
      return res.status(500).send('An error occurred')  
    }
  })
  
  // * Delete
  router.delete('/:planetId', async (req, res) => {
    try {
      const deletedPlanet = await Planet.findByIdAndDelete(req.params.planetId)
      return res.redirect('/planets')
    } catch (error) {
      console.log(error)
      return res.status(500).send('<h1>An error occurred.<h1>')
    }
  })
  
  
  // * Edit
  
  router.get('/:planetId/edit', isSignedIn, async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.planetId)) {
        const planet = await Planet.findById(req.params.planetId)
        if (!planet) return next()

        if (!planet.owner.equals(req.session.user._id)) {
          return res.redirect(`/plaents/${req.params.planetId}`)
        }

        return res.render('planets/edit.ejs', { planet })
      } else {
        next()
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send('<h1>An error occurred.<h1>')
    }
  });


  router.put('/:planetId', isSignedIn, async (req, res) => {
    try {
      req.body.hasMoon = !!req.body.hasMoon

      const planetToUpdate = await Planet.findById(req.params.planetId)
      console.log('PLANET: ', planetToUpdate)
      if (planetToUpdate.owner.equals(req.session.user._id)) {
        const updatedPlanet = await Planet.findByIdAndUpdate(req.params.planetId, req.body)
        return res.redirect(`/planets/${req.params.planetId}`)
      }

      throw new Error('User is not authorised to perform this action')

    } catch (error) {
      console.log(error)
      return res.status(500).send('<h1>An error occurred.<h1>')
    }
  })
  
  module.exports = router
  
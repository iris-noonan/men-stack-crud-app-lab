const express = require('express')
const bcrypt = require('bcryptjs')

// ! -- Router
const router = express.Router()

// ! - Model
const User = require('../models/user.js')

// ! Routes/Controllers
// * Each route is already prepended with `/auth`

// * -- Sign Up Form
// Method: GET
// Path: /auth/sign-up
router.get('/sign-up', (req, res) => {
  return res.render('auth/sign-up.ejs')
})

// * -- Create User
router.post('/sign-up', async (req, res) => {
  try {
    // Check passwords match
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(422).send('The passwords did not match')
    }

    // Hash password
    req.body.password = bcrypt.hashSync(req.body.password, 10)

    // Attempt to create a user
    const newUser = await User.create(req.body)

    // Redirect to the sign in page
    return res.redirect('/auth/sign-in')

  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      const unique = Object.entries(error.keyValue)[0]
      return res.status(422).send(`${unique[0]} "${unique[1]}" already taken`)
    }
    return res.status(500).send('<h1>An error occurred.</h1>')
  }
})

// * -- Sign In Form
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
  })
  
// * -- Sign In User
router.post('/sign-in', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.status(401).send('Login failed. Please try again.')
    }

    if (!bcrypt.compareSync(req.body.password, userInDatabase.password)) {
      console.log('Password did not match')
      return res.status(401).send('Login failed. Please try again.')
    }

    // Create a session to sign the user in
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    }

    // the save() method takes the information above that is stored in memory and saves it in the store (MongoDB)
    // This request is async since it's across the network, so a callback is provided that will be executed on completion
    req.session.save((err) => {
      console.log(err)
      return res.redirect('/')
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).send('<h1>An error occurred.</h1>')
  }
  });
  
// * Sign Out Route
router.get('/sign-out', (req, res) => {
  // Destroy existing session
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      return res.status(500).send('<h1>An error occurred.</h1>')
    }
    return res.redirect('/')
  })
})

// ! Export the Router
module.exports = router
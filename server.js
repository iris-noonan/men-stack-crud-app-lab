const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const isSignedIn = require('./middleware/is-signed-in.js')
const passUserToView = require('./middleware/pass-user-to-view.js')
require('dotenv/config')

// ! -- Routers/Controllers
const planetsRouter = require('./controllers/planets.js')
const authController = require("./controllers/auth.js");

// ! -- Variables
const app = express()
const port = 3000

// ! -- Middleware
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: false}))
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  }))
app.use(passUserToView)

// ! -- Route Handlers

// * Landing Page
app.get('/', (req, res) => {
  res.render('index.ejs')
  })

app.get("/vip-lounge", isSignedIn, (req, res) => {
  res.send(`Welcome to the party ${req.session.user.username}.`)
})

// * Routers
app.use('/planets', isSignedIn, planetsRouter)
app.use("/auth", authController);

// ! -- 404
app.get('*', (req, res) => {
    return res.status(404).render('404.ejs')
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
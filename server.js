//import modules
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jwt-simple');

//import url
let url = require('./url')

// Create rest object
let app = express()
// Set JSON as MIME type
app.use(bodyparser.json())
// Client is not sending form data -> encoding JSON
app.use(bodyparser.urlencoded({ extended: false }))
// Enable CORS -> Cross Origine Resource Sharing -> communication among various ports
app.use(cors())

// Connect to mongodb
mongoose.connect(url, { dbName: "MiniProject" })
    .then(() => {
        console.log('Connection Success')
    }, (errRes) => {
        console.log("Connection failure", errRes)
    })

// Import routes
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')

// JWT middleware
const jwtVerifyMiddleware = (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }
    try {
      const decoded = jwt.decode(token, new Date().toString());
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).send('Invalid token.');
    }
  };

// Use routes
app.use("/product", productRoutes)
app.use("/user", userRoutes)
app.use("/cart", jwtVerifyMiddleware, cartRoutes)

// Create port
let port = 8080

// Assign port to server
app.listen(port, () => {
    console.log('Server listening port no:- ', port)
})


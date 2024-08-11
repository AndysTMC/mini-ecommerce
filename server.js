//import modules
const express = require('express')
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

// Create rest object
let app = express()
// Set JSON as MIME type
app.use(bodyparser.json())
// Client is not sending form data -> encoding JSON
app.use(bodyparser.urlencoded({ extended: false }))
// Set cookie parser
app.use(cookieParser())

require('dotenv').config({path: './.env'})
// Enable CORS -> Cross Origine Resource Sharing -> communication among various ports
// origins are in .env, use them

// Dynamically set allowed origins based on environment variables
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
console.log('Allowed origins:', allowedOrigins);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ["Set-Cookie"]
};

app.use(cors(corsOptions));

// Connect to mongodb
mongoose.connect(process.env.MONGODB_URL, { dbName: "MiniProject" })
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
// const jwtVerifyMiddleware = (req, res, next) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).send('Access denied. No token provided.');
//     }
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//       req.u_name = decoded;
//       next();
//     } catch (ex) {
//       res.status(400).send('Invalid token.');
//     }
//   };
const jwtVerifyMiddleware = require('./middlewares/auth').isAuthenticatedUser

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


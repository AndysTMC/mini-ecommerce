const jwt = require('jsonwebtoken');
const User = require('../model/User');
const ErrorHandler = require('../utils/errorHandler');
const asyncErrorHandler = require('./asyncErrorHandler');

module.exports.isAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler("Please Login to Access", 401))
    }

    const { u_name } = jwt.verify(token, process.env.JWT_SECRET_KEY); 
    req.u_name = u_name;
    console.log(req.u_name)
    next();
});

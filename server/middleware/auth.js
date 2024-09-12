const jwt = require('jsonwebtoken');
const { errorHandler } = require('../error');
const Doctor = require('../models/doctor');

async function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return next(new errorHandler("Unauthorized access - No token provided!", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const doctor = await Doctor.findById(decoded.id);

        if (!doctor) {
            return next(new errorHandler("Unauthorized access - Invalid token!", 401));
        }

        req.doctor = doctor; 
        next();
    } catch (error) {
        return next(new errorHandler("Unauthorized access - Invalid token!", 401));
    }
}

module.exports = { verifyToken };

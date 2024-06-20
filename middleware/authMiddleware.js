const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = await User.findById(decoded.userId);
        if (!req.user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
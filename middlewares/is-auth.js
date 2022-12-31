const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        return res.status(401).json('Not authenticated!');
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'secret', (err, decode) => {
        if(err) {
            return res.status(401).json('Token is not valid!');
        }
        User.findById(decode.user._id)
            .then(result => {
                req.user = result;
                next();
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    });
}

const verifyCounselor = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.role === 'counselor' || req.user.role === 'admin') {
            next()
        } else {
            return res.status(403).json('Counselor not authenticated!');
        }
    })
} 

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.role === 'admin') {
            next()
        } else {
            return res.status(403).json('Admin not authenticated!');
        }
    })
} 

module.exports = {verifyToken, verifyCounselor, verifyAdmin}
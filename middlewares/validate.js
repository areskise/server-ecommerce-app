const { body } = require('express-validator');
const User = require('../models/user');

exports.validateLogin = [
    body('email')
        .notEmpty()
        .isEmail()
        .withMessage('Please enter email!')
        .custom((value, { req }) => {
            return User
                .findOne({ email: value })
                .then(user => {
                    if(!user) {
                        return Promise.reject('Email is not exists already!');
                    }
                }) 
            }),
    body('password')
        .notEmpty()
        .withMessage('Please enter password')
];

exports.validateSignup = [
    body('email')
        .notEmpty()
        .isEmail()
        .withMessage('Please enter email!')
        .custom((value, { req }) => {
        return User
            .findOne({ email: value })
            .then(user => {
                if(user) {
                    return Promise.reject('Email is exists already!');
                }
            }) 
        }),
    body('password', 'Please enter password least 4 characters')
        .notEmpty()
        .isLength({ min: 4 }),
    body('phone')
        .notEmpty()
        .withMessage('Please enter phone!')
        .custom((value, { req }) => {
            return User
                .findOne({ phone: value })
                .then(user => {
                    if(user) {
                        return Promise.reject('Phone is exists already!');
                    }
                }) 
            }),
];
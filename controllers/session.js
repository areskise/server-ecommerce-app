const Session = require('../models/session');
const io = require('../socket');

exports.getRoomByUser = (req, res, next) => {
    const userId = req.query.userId;
    Session.findOne({userId: userId})
        .then(result => {
            if(result) {
                res.cookie('roomId', result._id, {
                    maxAge: 86400000,
                });
                res.status(200).json(result)
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getMessageByRoomId = (req, res, next) => {
    const roomId = req.query.roomId;
    Session.findById(roomId)
        .then(result => {
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.createNewRoom = (req, res, next) => {
    const session = new Session({
        userId: req.user._id,
        messages: []
    });
    session.save()
        .then(result => {
            res.cookie('roomId', result._id, {
                maxAge: 86400000,
            });
            io.getIO().emit('create_room', {
                session: result,
                roomId: result._id
            });
            res.status(201).json(result._id);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.endRoom = (req, res, next) => {
    const {roomId} = req.body;
    Session.findByIdAndDelete(roomId)
        .then(result => {
            res.clearCookie('roomId');
            io.getIO().emit('end_room', {
                session: result,
                roomId: roomId
            });
            res.status(201).json(result);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.addMessage = (req, res, next) => {
    const {message, roomId, is_admin} = req.body;
    if(message) {
        Session.findByIdAndUpdate(roomId, {
            $push: {
                messages: {
                    message: message,
                    is_admin: is_admin
                }
            }
        })
            .then(result => {
                console.log(result);
                io.getIO().emit('send_message', {
                    session: result,
                    roomId: roomId
                });
                res.status(200).json('Save message success!');
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    }
}

exports.getRoomChat = (req, res, next) => {
    const search = req.query.search;
    console.log(search);
    if(search && search !=='') {
    Session.find({_id: search})
        .then(result => {
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    } else {
        Session.find()
        .then(result => {
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    }
}

exports.getMessage = (req, res, next) => {
    
}

exports.postMessage = (req, res, next) => {
    
}

exports.postConversation = (req, res, next) => {
    
}
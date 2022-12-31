const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    messages: [
        { 
            message: String,
            is_admin: Boolean 
        }
    ],
    created_at: { 
        type: Date, 
        required: true, 
        default: Date.now 
    }
})

module.exports = mongoose.model('Session', sessionSchema);
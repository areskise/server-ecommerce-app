const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    products: [
        {
            product: { 
                type: Object, 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true 
            },         
        }
    ],
    total: {
        type: Number,
        required: true,
    },
    created_at: { 
        type: Date, 
        required: true, 
        default: Date.now 
    }
})

module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PromotionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: String,
    slug: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    image: {
        original: String,
        thumbnail: String,
        cropped: String
    },
    prices: [{
        currency: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Currency',
            unique: true
        },
        key: {
            type: String,
            index: true,
            unique: true
        },
        was: Number,
        now: Number
    }],
    discount: Number,
    active: {
        type: Boolean,
        default: false
    },
    expiry: Date,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

PromotionSchema.plugin(mongoosePaginate);
const Promotion = mongoose.model('Promotion', PromotionSchema);

module.exports = Promotion;
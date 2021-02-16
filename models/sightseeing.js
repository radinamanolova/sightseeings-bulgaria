const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const SightseeingSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    region: String,
    moreInfo: String,
    workingDayStart: String,
    workingDayEnd: String,
    workingHourStart: Number,
    workingHourEnd: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    visits: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, opts);

SightseeingSchema.virtual('properties.popUpMarkup').get(function () {
    return `
        <strong><a href="/sightseeings/${this._id}">${this.title}</a></strong>
        <br>
        <span>${this.region}</span>
        <img src=${this.images[0].url} style="width: 80%; margin-top: 5px; margin-bottom: 5px;"/>
        <p>${this.description.substring(0, 150)}...</p>`;
});

SightseeingSchema.post('findOneAndDelete', async function (sightseeing) {
    if (sightseeing.reviews) {
        await Review.deleteMany({
            _id: {
                $in: sightseeing.reviews
            }
        });
    }
    if (sightseeing.images) {
        for (const img of sightseeing.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }
});

module.exports = mongoose.model('Sightseeing', SightseeingSchema);
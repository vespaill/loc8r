// Require Mongoose so that you can use its methods.
const mongoose = require('mongoose');

// Define a schema for opening times.
const openingTimeSchema = new mongoose.Schema({
    days: {
        type: String,
        required: true
    },
    opening: String,
    closing: String,
    closed: {
        type: Boolean,
        required: true
    }
});

// Define a schema for reviews.
const reviewSchema = new mongoose.Schema({
    author: String,
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: String,
    createdOn: {
        type: Date,
        'default': Date.now
    }
});

// Starts the main location schema definition.
const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    rating: {
        type: Number,
        'default': 0,
        min: 0,
        max: 5
    },
    facilities: [String],               // Array of Strings
    coords: {
        type: { type: String },
        /* Uses 2dsphere to add support for GeoJSON longitude and latitude
           coordinate pairs. */
        coordinates: [Number]           // Array of Numbers.
    },
    // Reference the opening time and review schemas to add nested subdocuments.
    openingTimes: [openingTimeSchema],  // Array of openingTimeSchema
    reviews: [reviewSchema]
});

/* Enable MongoDB to do the correct calculations when running queries and
   returning results. It will calculate geometries based on a spherical
   object. */
locationSchema.index({ coords: '2dsphere' });

// Build a model of the location schema.
mongoose.model('Location', locationSchema);

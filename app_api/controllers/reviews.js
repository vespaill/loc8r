const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const reviewsCreate = (req, res) => { };

const reviewsReadOne = (req, res) => {
    Loc
        // Tell the Location model what the query will be.
        .findById(req.params.locationid)    // Get locationid from URL params.

        /* Add the Mongoose select method to the model query to state that you
           want to get only the name and the reviews of a location. */
        .select('name reviews')

        // Execute the query.
        .exec((err, location) => {

            /* Error trap 1: If Mongoose doesn’t return a location, send a
               404 message and exit the function scope, using a return
               statement. */
            if (!location) {
                return res
                    .status(404)
                    .json({
                        "message": "location not found"
                    });

            /* Error trap 2: If Mongoose returns an error, send it as a 404
               response and exit the controller, using a return statement.*/
            } else if (err) {
                return res
                    .status(404)
                    .json(err);
            }

            // If no errors, check that the returned location has reviews.
            if (location.reviews && location.reviews.length > 0) {

                /* Use the Mongoose subdocument .id method as a helper for
                   searching for a matching ID. */
                const review = location.reviews.id(req.params.reviewid);

                // If a review isn't found, return an appropriate response.
                if (!review) {
                    return res
                        .status(400)
                        .json({
                            "message": "review not found"
                        });

                /* If a review is found, build a response object returning the
                   review and location name and ID. */
                } else {
                    response = {
                        location: {
                            name: location.name,
                            id: req.params.locationid
                        },
                        review
                    };
                    return res
                        .status(200)
                        .json(response);
                }

            // If no reviews are found, returns an appropriate error message.
            } else {
                return res
                    .status(404)
                    .json({
                        "message": "No reviews found"
                    });
            }
        });
};

const reviewsUpdateOne = (req, res) => { };
const reviewsDeleteOne = (req, res) => { };

module.exports = {
    reviewsCreate,
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne
};
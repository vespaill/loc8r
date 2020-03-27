// Give the controllers access to the database connection
const mongoose = require('mongoose');

/* Bring in the Location model so that you can interact with the Locations
   collection. */
const Loc = mongoose.model('Location');



const locationsListByDistance = (req, res) => {};
const locationsCreate = (req, res) => {};
const locationsReadOne = (req, res) => {
    Loc
        // Tell the Location model what the query will be.
        .findById(req.params.locationid) // Get locationid from URL parameters

        // Execute the query
        .exec(
            // Define callback to accept possible parameters
            (err, location) => {

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

                /* If Mongoose doesn’t error, send the document found as a JSON
                response with an HTTP status of 200. */
                res
                    .status(200)
                    .json(location);
        });
};
const locationsUpdateOne = (req, res) => {};
const locationsDeleteOne = (req, res) => {};



module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
};
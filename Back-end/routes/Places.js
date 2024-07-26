const express = require("express")
const router = express.Router();
const HttpError = require("../models/http-error").HttpError
const placesControllers = require("../contollers/places-controllers");



//app.use("/places", router)
//Fetch all places that belong to a User ID
router.get("/user/:uid", placesControllers.getPlaceByUserId)

//Fetch all places with the passed placeID
router.get("/:pid",placesControllers.getPlace)

router.post("/",placesControllers.createPlace)

module.exports = router; 
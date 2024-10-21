const express = require("express")
const router = express.Router();
const placesControllers = require("../contollers/places-controllers");
const {check} = require("express-validator")
const upload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

//app.use("/places", router)
//Fetch all places that belong to a User ID
router.get("/user/:uid", placesControllers.getPlaceByUserId)

//Fetch all places with the passed placeID
router.get("/:pid",placesControllers.getPlace)

router.use(checkAuth)

router.post("/new", upload.single("image"),
    [
        check("title").not().isEmpty(),
        check("description").isLength({min:5}),
        check("address").not().isEmpty()
    ],
    placesControllers.createPlace
)

router.patch("/:pid",
    [
        check("title").not().isEmpty(),
        check("description").isLength({min:5}),
    ],
    placesControllers.updatePlaceById)

    
router.delete("/:pid",placesControllers.deletePlace)

module.exports = router; 
const express = require("express")
const router = express.Router();
const usersControllers = require("../contollers/users-controller");
const {check} = require("express-validator");
const upload = require("../middleware/file-upload");

router.get("/", usersControllers.fetchUsers)


// We are using multer middleware to extract and store images
router.post("/signup", upload.single("image"),
    [
        check("name").not().isEmpty(),
        check("email").isEmail().isLength({ min: 6 }),
        check('password').not().isEmpty(),

    ],    
    usersControllers.signUp)

router.post("/login",
    [
        check("email").isEmail(),
        check('password').not().isEmpty(),

    ],  
    usersControllers.login)


module.exports = router; 
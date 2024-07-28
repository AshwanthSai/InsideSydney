const express = require("express")
const router = express.Router();
const usersControllers = require("../contollers/users-controller");
const {check} = require("express-validator")

router.get("/", usersControllers.fetchUsers)

router.post("/signup", 
    [
        check("name").not().isEmpty(),
        check("email").isEmail().isLength({ min: 18 }),
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
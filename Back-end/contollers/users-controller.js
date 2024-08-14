const { v4: uuidv4 } = require('uuid');
const { HttpError } = require('../models/http-error');
const{validationResult} = require("express-validator");
const User = require('../models/users');

const fetchUsers = async(req, res, next) => {
    console.log("Fetch Users Hit")
    let users;
    try {
        users = await User.find({}, "-password")
    } catch(err) {
        return next(new HttpError("Could not fetch users from DB", 500))
    }

    /* This fails because the Result is an Array and you have to Map */
    // res.status(200).json({users : users.toObject({getters:true})})
    console.log(users)
    res.status(200).json({users : users.map(user => user.toObject({getters:true}))})
}

/* /POST to Sign UP */
const signUp = async(req, res, next) => {
    console.log("Sign Up Hit")
    const err = validationResult(req)
    if(!err.isEmpty()){
        return next(new HttpError("Invalid Input", 422))
    }
    
    /* 
       We no longer accept places from user,
       that was Aux until we, start implementing relationships
    */

    const {name, email, password, image} = req.body

    let userExists;

    try {
        userExists = await User.findOne({email : email})
    } catch(err) {
        return next(new HttpError("Unable to check if user exists", 500))
    }

    if(userExists) {
        return next(new HttpError("User already exists", 422))
    }

    const newUser = new User({
        name, 
        email,
        password, 
        image : "test", 
        /* 
            Create an array in places field,
            which we will populate later.
         */
        places: []
    })

    try {
       await newUser.save()
    } catch(err) {
        return next(new HttpError("Unable to Save User Info", 500))
    }

    //201 - Items Created
    res.status(201).json({newUser:newUser.toObject({getters:true})})
}

/* POST to Login */
const login = async(req, res, next) => {
    console.log("Login Route Hit")
    const err = validationResult(req)
    if(!err.isEmpty()){
        return next(new HttpError("Invalid Input", 422))
    }

    const {email, password} = req.body
    
    let userExist;
    try {
         userExist = await User.findOne({email:email})
    } catch(err) {
        return next(new HttpError("Logging in Failed", 500))
    }

    if(!userExist || userExist.password !== password){
        return next(new HttpError("Invalid Credentials", 401))
    } else {
        res.status(200).json({message : "Logged In"})
    }
}



exports.fetchUsers = fetchUsers;
exports.signUp = signUp;
exports.login = login;
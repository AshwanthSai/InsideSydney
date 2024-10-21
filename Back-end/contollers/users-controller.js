const { v4: uuidv4 } = require('uuid');
const { HttpError } = require('../models/http-error');
const{validationResult} = require("express-validator");
const User = require('../models/users');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const fetchUsers = async(req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password")
    } catch(err) {
        return next(new HttpError("Could not fetch users from DB", 500))
    }

    /* This fails because the Result is an Array and you have to Map */
    // res.status(200).json({users : users.toObject({getters:true})})
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

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10)
    } catch(err) {
        next(new HttpError("Could not create user, try again later", 500))
    }

    const newUser = new User({
        name, 
        email,
        password : hashedPassword, 
        /* req.file.path is Automatically added by multer */
        image : req.file.path, 
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

    let token
    try {
        token = await jwt.sign({userId: newUser.id, email: newUser.email},"SuperSecret", {expiresIn: '1h' })
    } catch(error) {
        return next(new HttpError("Login : Could not register credentials, please try again later", 500))
    }

    //201 - Items Created
    res.status(201).json({newUser:newUser.toObject({getters:true}), token})
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
    
    let isValid; 
    try {
        isValid = await bcrypt.compare(password, userExist.password)
    } catch (err){
        return next(new HttpError("Sign Up : Could not validate credentials, Please try again later", 500))
    }

    let token;
    try {
        token = await jwt.sign({userId: userExist.id, email: userExist.email},"SuperSecret", {expiresIn: '1h' })
    } catch (err) {
        return next(new HttpError("Could not create JWT, Please try again later", 500))
        
    }

    if(!userExist || !isValid){
        return next(new HttpError("Invalid Credentials", 403))
    } else {
        res.status(200).json({message : "Logged In", userExist:userExist.toObject({getters:true}), token})
    }
}

exports.fetchUsers = fetchUsers;
exports.signUp = signUp;
exports.login = login;
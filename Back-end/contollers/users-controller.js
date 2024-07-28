const { v4: uuidv4 } = require('uuid');
const { HttpError } = require('../models/http-error');
const{validationResult} = require("express-validator")

let DUMMY_USERS = [
    {"name": "Sai", "email": "ashwanth.saie", "password": "5849048"},
    {"name": "John", "email": "john.doe", "password": "123456"},
    {"name": "Alice", "email": "alice.smith", "password": "abcdef"},
    {"name": "Bob", "email": "bob.jones", "password": "qwerty"},
    {"name": "Emily", "email": "emily.wilson", "password": "password123"}
];

const fetchUsers = (req, res, next) => {
    res.status(200).json(DUMMY_USERS)
}

/* /POST to Sign UP */
const signUp = (req, res, next) => {

    const err = validationResult(req)
    if(!err.isEmpty()){
        console.log(`Here`)
        throw new HttpError("Invalid Input", 422)
    }
    
    const {name, email, password} = req.body

    const userExists = DUMMY_USERS.find(user => user.email == email)
    if(userExists) {
        throw new HttpError("User already exists", 422)
    }

    const newUser = {
        id : uuidv4(),
        name, 
        email, 
        password
    }
    DUMMY_USERS.push(newUser)
    //201 - Items Created
    res.status(201).json(newUser)
}

/* POST to login In */
const login = (req, res, next) => {
    const err = validationResult(req)
    if(!err.isEmpty()){
        console.log(`Here`)
        throw new HttpError("Invalid Input", 422)
    }

    const {email, password} = req.body
    const userExist = DUMMY_USERS.findIndex(user => user.email == email)
    if(userExist >= 0){
        const passwordMatched = (DUMMY_USERS[userExist].password === password) ? true : false;
        if(passwordMatched) {
            res.status(200).json({message : "User Exists"})
        } else {
            throw new HttpError("User Does not Exist", 401)
        }
    } else {
        throw new HttpError("User Does not Exist", 401)
    }
}



exports.fetchUsers = fetchUsers;
exports.signUp = signUp;
exports.login = login;
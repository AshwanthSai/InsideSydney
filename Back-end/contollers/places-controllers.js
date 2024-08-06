const { v4: uuidv4 } = require('uuid');
const HttpError = require("../models/http-error").HttpError
const {validationResult} = require("express-validator");
const { getCordinates } = require('../utils/location');
const Place = require('../models/places');
const moongoose = require("mongoose");
const User = require('../models/users');

/* 
    /places/id -> Fetches particular id 
*/
const getPlace = async(req,res,next) => {
    // Internally is an Object with ids, {pid : value}
    const placeId = req.params.pid 
    // placeId = p1
    let result;
    try {
        result = await Place.findById(placeId)
    } catch(err){
        const error = new HttpError("Something Wrong, Cannot find place", 404)
        return next(error)
    }

    if(!result){
        const error = new Error("Place not found")
        error.code = 404
        return next(error); // Only Stops Execution
        // return res.status(404).json({message: "Place for user not found"})
    }
    // res.send("<h1>Handeller 1 instead of Handeller 2</h1>") // {result : result}
    res.status(201).json({result : result.toObject({getters:true})})
}

/* 
    Fetches all places of user id
*/
const getPlaceByUserId = async (req,res,next) => {
    const userID = req.params.uid;
    /*
        One user has many places
        Fetch the user and populate on places. 
            Places will have all place items as array items.
    */

    let result;
    try {
        result = await User.findById(userID).populate("places")
    } catch(err){
        const error = new HttpError("Something wrong, Cannot find user places", 404)
        return next(error)
    }
    
    console.log(result)

    if(!result){
          throw new HttpError("Place for user not found", 404)
 
       /*const error = new Error("Place for user not found")
         error.code = 404
         throw error; */ // Stops Execution
         // return res.status(404).json({message: "Place for user not found"})
     }
    // res.send("<h1>Handeller 2 instead of Handeller 1</h1>") 


    res.status(201).json({result : result.places.map((item) => item.toObject({getters:true}))})
}

const createPlace = async (req,res,next) => {
    const err = validationResult(req)
    if(!err.isEmpty()){
        return next(new HttpError("Invalid Input", 422))
    }
    
    const {title, description, address, creator, image} = req.body
    
    let coordinates;
    try {
        coordinates = await getCordinates(address)
    } catch(error) {
        return next(new HttpError("Geocoding Failed"))
    }


    const createdPlace = new Place({
        title,
        description,
        image,
        location : coordinates,
        address, 
        creator
    })

     /* 
     Before saving, check if creator exists in DB.
        Start a transaction
            Save place
            Save place ID into User.places array
        Commit transaction
     */

    let user;
    try {
        user = await User.findById(creator)
    } catch(err) {
        return next(new HttpError("Creating Place Failed", 500))
    } 
    
    if(!user){
        return next(new HttpError("Could not find user as a Creator", 404))
    }

    try {
        const session = await moongoose.startSession()
        session.startTransaction()
        await createdPlace.save({session:session}) // Saving Place, passing Session.
        user.places.push(createdPlace) // Creating a modified user
        console.log(`Point`)
        await user.save({session:session}) // Saving User, passing Session.
        session.commitTransaction()
    } catch(err) {
        return next(new HttpError("Creating Place Failed, problem during transaction", 500))
    }

    return res.status(201).json(createdPlace)
}
 

const updatePlaceById = async(req,res,next) => {
    const err = validationResult(req)
    if(!err.isEmpty()){
        return next(HttpError("Invalid Input", 422))
    }
    const placeId = req.params.pid 
    const{title, description} = req.body

    /* Fetching the item */
    let item; 
    try {
        console.log(placeId)
        item = await Place.findById(placeId)
    } catch(err) {
        const error = new HttpError("Cannot find place", 404)
        return next(error)
    }

    // Making changes in the Object
    item["title"] = title
    item["description"] = description

    // Overwriting record, by saving back to db.
    try {
        await item.save()
    } catch(err) {
        const error = new HttpError("Cannot Create Place", 500)
        return next(error)
    }

    res.status(200).json({place : item.toObject({getters:true})})
}

const deletePlace = async(req,res,next) => {
    const id = req.params.pid
    // Checking if Place Exists 
    
    /* 
        Find user that belongs to Place
            1. Use Populate on the Creator field within Places  
    */
    let item; 
    try {
        item = await Place.findById(id).populate("creator")
    } catch(err) {
        return next(new HttpError("Could not Delete Item"))
    }   
    
    if(!item){
      return next(new HttpError("Item does not Exist", 404))
    }

    /* 
        Start a Transaction
            1. Delete Place
            2. Remove Place ID from user using pull
        Commit Transaction
    */
    console.log(item);
    
    try {
        const session = await moongoose.startSession();
        session.startTransaction()
        await item.deleteOne({session : session})
        console.log(`Point`) 
        /* 
            Remove User ID from places
            This is not an array.pull method
        */
        item.creator.places.pull(item) 
        await item.creator.save({session : session})
        session.commitTransaction() 
    } catch(err) {
        return next(new HttpError("Something went wrong during Transaction", 500))
    }

    res.status(200).json({message : "Delete Complete"})
}


exports.getPlace = getPlace;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace; 
exports.updatePlaceById = updatePlaceById; 
exports.deletePlace = deletePlace; 

const { v4: uuidv4 } = require('uuid');
const HttpError = require("../models/http-error").HttpError
const {validationResult} = require("express-validator");
const { getCordinates } = require('../utils/location');
const Place = require('../models/places');


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

    let result;
    try {
        result = await Place.find({creator : userID})
    } catch(err){
        const error = new HttpError("Something wrong, Cannot find user places", 404)
        return next(error)
    }
    
    if(!result){
          throw new HttpError("Place for user not found", 404)
 
       /*const error = new Error("Place for user not found")
         error.code = 404
         throw error; */ // Stops Execution
         // return res.status(404).json({message: "Place for user not found"})
     }
    // res.send("<h1>Handeller 2 instead of Handeller 1</h1>") 
    res.status(201).json({result : result.map((item) => item.toObject({getters:true}))})
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
        return next(error)
    }


    const createdPlace = new Place({
        title,
        description,
        image,
        location : {
            lat: req.body.location.lat,
            lng : req.body.location.lng
        }, 
        address, 
        creator
    })

    try {
        createdPlace.save()
    } catch(err) {
        const error = new HttpError("Cannot Create Place", 500)
        return next(error)
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
    
    let item; 
    try {
        item = await Place.findById(id)
    } catch(err) {
      return next(new HttpError("Item does not Exist", 404))
    }   

    //Deleting from DB 
    try {
        console.log(item)
        await item.deleteOne();
    } catch(err){
        return next(new HttpError("Something wrong, cannot remove item", 500))
    }    

    res.status(200).json({message : "Delete Complete"})
}


exports.getPlace = getPlace;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace; 
exports.updatePlaceById = updatePlaceById; 
exports.deletePlace = deletePlace; 

const { v4: uuidv4 } = require('uuid');
const HttpError = require("../models/http-error").HttpError
const {validationResult} = require("express-validator");
const { getCordinates } = require('../utils/location');

let DUMMY_PLACES = [{
    id : "p1",
    title: "Sydney Opera House A",
    description : "One of the most famous buildings in the World",
    location : {
        lat: 4550.7484474,
        lng: 151.9871516
    },
    address: "Sydney, 2000",
    creator : "u1"
},
{
    id : "p2",
    title: "Sydney Opera House B",
    description : "One of the most famous buildings in the World",
    location : {
        lat: 4550.7484474,
        lng: 151.9871516
    },
    address: "Sydney, 2000",
    creator : "u2"
}]

const getPlace = (req,res,next) => {
    // Internally is an Object with ids, {pid : value}
    const placeId = req.params.pid 
    // placeId = p1
    const result = DUMMY_PLACES.find(item => item.id === placeId)
    if(!result){
        const error = new Error("Place not found")
        error.code = 404
        return next(error); // Only Stops Execution
        // return res.status(404).json({message: "Place for user not found"})
    }
    // res.send("<h1>Handeller 1 instead of Handeller 2</h1>") // {result : result}
    res.json({result})
}

const getPlaceByUserId = (req,res,next) => {
    const userID = req.params.uid;
    const result = DUMMY_PLACES.filter((item) => item.creator === userID )
    
    if(!result){
          throw new HttpError("Place for user not found", 404)
 
       /*const error = new Error("Place for user not found")
         error.code = 404
         throw error; */ // Stops Execution
         // return res.status(404).json({message: "Place for user not found"})
     }
    // res.send("<h1>Handeller 2 instead of Handeller 1</h1>") 
    res.json({result})
}


const createPlace = async (req,res,next) => {
    const err = validationResult(req)
    if(!err.isEmpty()){
        return next(new HttpError("Invalid Input", 422))
    }
    
    const {title, description, address, creator} = req.body
    
    let coordinates;
    try {
        coordinates = await getCordinates(address)
    } catch(error) {
        return next(error)
    }

    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location : coordinates, 
        address, 
        creator
    }

    DUMMY_PLACES.push(createdPlace);
    return res.status(201).json({createdPlace})
}
 
const updatePlaceById = (req,res,next) => {
    const err = validationResult(req)
    if(!err.isEmpty()){
        console.log(`Here`)
        throw new HttpError("Invalid Input", 422)
    }
    const id = req.params.pid 
    const{title, description} = req.body
    // Finding the Place
    const place = DUMMY_PLACES.find((place) => place.id == id)
    // Creating an Immutable Copy
    const placeCopy = {...place}

    //Returning Index of Object Array
    const placeId = DUMMY_PLACES.findIndex((place) => place.id == id)
    console.log(placeId)

    //Making Changes in the Object
    placeCopy["title"] = title
    placeCopy["description"] = description

    //Swapping in DUMMY PLACES
    DUMMY_PLACES[placeId] = placeCopy;
    res.status(200).json({place : placeCopy})
}

const deletePlace = (req,res,next) => {
    const id = req.params.pid
    const itemExists = DUMMY_PLACES.find((place) => place.id == id)
    if(!itemExists){
        throw new HttpError("Item does not exist")
    }
    //Deleting in a immutable way
    const db = DUMMY_PLACES.filter((place) => place.id != id)
    DUMMY_PLACES = db;
    res.status(200).json({message : "Delete Complete"})
}

exports.getPlace = getPlace;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace; 
exports.updatePlaceById = updatePlaceById; 
exports.deletePlace = deletePlace; 

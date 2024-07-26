const { v4: uuidv4 } = require('uuid');
const HttpError = require("../models/http-error").HttpError

const DUMMY_PLACES = [{
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


const createPlace = (req,res,next) => {
    const {title, description, coordinates, address, creator} = req.body
    
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
 

exports.getPlace = getPlace;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace; 

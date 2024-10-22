const express = require("express")
const fs = require("fs")
const path = require("path");
const app = express()
const placesRouter = require("./routes/places-route")
const usersRouter = require("./routes/users-route")
const mongo =  require("mongoose")
const { HttpError } = require("./models/http-error")
var cors = require('cors')

/* app.get("/", (req,res,next) => {
    res.json({"name" : "Sai"})
}) */

app.use(cors())
app.use(express.json())

/*
    Express.static matches the file Id with the images in the path and returns it back
        http://localhost:4000/uploads/images/a8ecca8f-0048-4de1-a6c6-7096377fdc68.jpeg
    Will return the appropriate image.
*/
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/places", placesRouter)
app.use("/users", usersRouter)

/* Unsupported Route Handeller */
app.use((req,res,next) => {
    //The below method will hang because it does not throw an error, 
    //return new HttpError("This route does not exist", 404)
    return next(new HttpError("This route does not exist", 404))
})

/* Default Error Handler */
app.use((err,req,res,next) => {
    /* 
        If req has a file and throws an Error. We have to delete the image
        from File System.
    */
    if(req.file) {
        /* 
            This is not a fatal error, you can always 
            manually delete files, so not try catching here.
            Turn this off, if you want to check if 
            Image upload is working.
        */
        fs.unlink(req.file.path, (err) => {
            console.log(err)
        }) 
    }
    if(res.headerSent){
        // We have already acknowledged the error
        return next(err)
    }
    //500 = Server Error
    res.status(err.code || 500)
    res.json({message : err.message || "An Unknown Error Occured"})
}) 

/*
    Here, 
    the name of the collection
    is InsideSydney
    after .net/
*/
mongo.connect(
    "mongodb+srv://ashwanthsaie:insideSydney123@insidesydney.e5fhyis.mongodb.net/InsideSydney?retryWrites=true&w=majority&appName=insideSydney"
)
.then(() => {
        console.log("Connected to DB")
        try {
            app.listen(4000)
            console.log("Server Running")
        } catch(err){
            console.log(err)
        }
    }
).catch((err) => {
    console.log(err)
    console.log("Cannot connect to DB")
})

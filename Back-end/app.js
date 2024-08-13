const express = require("express")
const app = express()
const placesRouter = require("./routes/places-route")
const usersRouter = require("./routes/users-route")
const mongo =  require("mongoose")
const { HttpError } = require("./models/http-error")

/* app.get("/", (req,res,next) => {
    res.json({"name" : "Sai"})
}) */

app.use(express.json())

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
mongo.connect("mongodb+srv://ashwanthsaie:insideSydney123@insidesydney.e5fhyis.mongodb.net/InsideSydney?retryWrites=true&w=majority&appName=insideSydney")
.then(() => {
        console.log("Connected to DB")
        app.listen(5211)
    }
).catch(() => {
    console.log("Cannot connect to DB")
})
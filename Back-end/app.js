const express = require("express")
const app = express()
const router = require("../Back-end/Routes/Places")
const { HttpError } = require("./models/http-error")

/* app.get("/", (req,res,next) => {
    res.json({"name" : "Sai"})
}) */

app.use(express.json())

app.use("/places", router)

/* Unsupported Route Handeller */
app.use((req,res,next) => {
    //The below method will hang because it does not throw an error, 
    //return new HttpError("This route does not exist", 404)
    return new HttpError("This route does not exist", 404)
})

/* Default Error Handler */
app.use((err,req,res,next) => {
    console.log(`Here`)
    if(res.headerSent){
        // We have already acknowledged the error
        return next(err)
    }
    //500 = Server Error
    res.status(err.code || 500)
    res.json({message : err.message || "An Unknown Error Occured"})
}) 


app.listen(5211)
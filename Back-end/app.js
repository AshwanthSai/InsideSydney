const express = require("express")
const app = express()
const router = require("../Back-end/Routes/Places")

/* app.get("/", (req,res,next) => {
    res.json({"name" : "Sai"})
}) */

app.use("/places", router)

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
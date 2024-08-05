const mongoose = require("mongoose")
const Schema = mongoose.Schema
const uniqueValidator = require("mongoose-unique-validator");

const usersSchema = new Schema({
    name: {type:String, required: true},
    email: {type: String, required : true, unique : true},
    password: {type: String, required : true, minlength : 6},
    image: {type: String, required : true},
    /* We will link to Places Table Later */
    places: {type: String, required : true},
});

/* 
    Pre-save validation for unique fields within a Mongoose schema
    this is not natively supported by MongoDB.
*/
usersSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", usersSchema)
const { HttpError } = require("../models/http-error");
const axios = require('axios');

const API = "AIzaSyCJpI2c3iNZD0oIyEbaBXd2uwidQ5ED1bc";


async function getCordinates(location) {
    const data = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?${encodeURIComponent(location)}=&key=${API}`)
    console.log(data) 

    if(!data || data.status == "ZERO_RESULTS"){
        throw HttpError("Could not locate address to geocode")
    }

    const result = {coordinates : data}
    return result;
}

const data = getCordinates("Santhom Medicals, Parripu Junction")
console.log(data)
// console.log(`data.result[0].geometry.location`) 


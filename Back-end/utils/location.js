const { HttpError } = require("../models/http-error");
const axios = require('axios');

const API = `${process.env.GOOGLE_API}`;

async function getCordinates(location) {
    const result = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}=&key=${API}`)
    /* Axios has an extra layer of Wrapping */
    const data = result.data

    if(!data || data.status == "ZERO_RESULTS"){
        throw HttpError("Could not locate address to geocode")
    }

    const coordinates = data["results"][0]["geometry"].location
    return coordinates;
}

exports.getCordinates = getCordinates;

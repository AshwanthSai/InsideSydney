import React from "react";
import "./UserPlaces.css"
import PlaceList from "../Components/PlaceList";

const DUMMY_PLACES = [
  {
    id :  "p1",
    title : "Sydney Opera House",
    description : "One of the Most Famous Buildings in the World!",
    imageUrl: "https://www.tripsavvy.com/thmb/gzMU2si2V__Ho-UPrD7Xp0ugJNs=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/OperaHouse-755d893182dc4811b608eb1a99792fd7.jpg",
    address: "Bennelong Point, Sydney NSW 2000, Australia",
    location : {
      lat: "-33.8568 S", 
      long : "151.2153 E"
    },
    creatorId : "u1",
  }
]

const UserPlaces = () => {
  return <PlaceList places = {DUMMY_PLACES}/>
};

export default UserPlaces;

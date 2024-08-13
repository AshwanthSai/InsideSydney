import React from "react";
import "./UserPlaces.css"
import PlaceList from "../Components/PlaceList";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";


/* 
  ! Places
  !   >   Place List
  !       >  Place Item
*/

const DUMMY_PLACES = [
  { 
    id :  "p1", 
    title : "Sydney Opera House", 
    description : "One of the Most Famous Buildings in the World!", 
    imageUrl: "https://www.tripsavvy.com/thmb/gzMU2si2V__Ho-UPrD7Xp0ugJNs=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/OperaHouse-755d893182dc4811b608eb1a99792fd7.jpg", 
    address: "Bennelong Point, Sydney NSW 2000, Australia", 
    location : { 
      lat: -33.8568,  
      lng : 151.2153 
    }, 
    creatorId : "u1", 
  }, 
  { 
    id: "p3", 
    title: "Machu Picchu", 
    description: "Ancient Incan Citadel in the Andes Mountains", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg", 
    address: "08680, Peru", 
    location: { 
      lat: 13.1631, 
      lng: 72.5450 
    }, 
    creatorId: "u2", 
  },{ 
    id: "p4", 
    title: "Great Wall of China", 
    description: "Historic Series of Fortifications in China", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg", 
    address: "China", 
    location: { 
      lat: 40.4319, 
      lng: 116.5704 
    }, 
    creatorId: "u3", 
  },{ 
    id: "p5", 
    title: "Taj Mahal", 
    description: "Ivory-White Marble Mausoleum in India", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg", 
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001, India", 
    location: { 
      lat: 27.1751, 
      lng: 78.0421  
    }, 
    creatorId: "u4", 
  },{ 
    id: "p6", 
    title: "Statue of Liberty", 
    description: "Iconic Symbol of Freedom in New York City", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Front_view_of_Statue_of_Liberty_with_pedestal_and_base_2024.jpg", 
    address: "New York, NY 10004, United States", 
    location: { 
      lat: 40.6892 , 
      lng: 74.0445 
    }, 
    creatorId: "u4", 
  },{ 
    id: "p7", 
    title: "Petra", 
    description: "Ancient City Carved into Rose-Red Cliffs", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Treasury_petra_crop.jpeg", 
    address: "Jordan", 
    location: { 
      lat: 30.3285, 
      lng: 35.4444 
    }, 
    creatorId: "u4", 
  }, { 
    id: "p8", 
    title: "Sagrada Familia", 
    description: "Basilica with Unique Architecture in Barcelona", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseo_2020.jpg", 
    address: "Carrer de Mallorca, 401, 08013 Barcelona, Spain", 
    location: { 
      lat: 41.4036, 
      lng: 2.1744 
    }, 
    creatorId: "u5", 
  }, { 
    id: "p9", 
    title: "Grand Canyon", 
    description: "Iconic Natural Wonder in Arizona", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Canyon_River_Tree_%28165872763%29.jpeg/1024px-Canyon_River_Tree_%28165872763%29.jpeg",
    address: "Grand Canyon Village, AZ 86023, United States", 
    location: { 
      lat: 36.1069, 
      lng: 112.1129 
    }, 
    creatorId: "u5", 
  } ,{ 
    id: "p10", 
    title: "The Colosseum", 
    description: "Iconic Ancient Roman Amphitheater", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1024px-Colosseo_2020.jpg", 
    address: "Piazza del Colosseo, 1, 00184 Roma RM, Italy", 
    location: { 
      lat: 41.8902, 
      lng: 12.4922 
    }, 
    creatorId: "u6", 
  },  { 
    id: "p11", 
    title: "Burj Khalifa", 
    description: "Tallest Building in the World in Dubai", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/93/Burj_Khalifa.jpg",
    address: "1 Sheikh Mohammed bin Rashid Blvd, Dubai, United Arab Emirates", 
    location: { 
      lat: 25.2769, 
      lng: 55.2963 
    }, 
    creatorId: "u1", 
  },{
    id: "p11", 
    title: "Mulla Periyar Dam", 
    description: "Old Dam in India", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/93/Burj_Khalifa.jpg",
    address: "G4HV+FPM, Periyar, Kerala 685532, India", 
    location: { 
      lat:77.14,
      lng: 9.52
    }, 
    creatorId: "u1", 
  }
]

const UserPlaces = () => {
  //  <Route path = "/:userId/places"
  const userId = useParams().userId
  const filteredPlaces = DUMMY_PLACES.filter(place => place.creatorId == userId )
  return <PlaceList places = {filteredPlaces}/>
};

export default UserPlaces;

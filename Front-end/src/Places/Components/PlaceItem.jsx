import React from "react";
import { useState } from "react";
import Card from "../../Shared/Components/UIElements/Card";
import Modal from "./Modal";
import "./PlaceItem.css"
import Button from "../../Shared/Components/UIElements/Button"

const PlaceItem = (props) => {
  //To Render Map.
  const [showMap, setShowMap] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);


  return (
    <React.Fragment>
      <Modal 
        //To render backdrop
        show = {showMap} 
        //For Click in Backdrop
        onCancel = {closeMapHandler}
        header = {props.address}

        contentClass = "place-item__modal-content"
        footerClass = "place-item__modal-actions"
        //Button in Footer is passed as Prop
        footer = {<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <h2>The Map !</h2>
        </div>
      </Modal>
      <li className="place-item">
          <Card className= "place-item__content">
              <div className="place-item__image">
                  <img src={props.image} alt = {props.title}/>
              </div>
              <div className="place-item__info">
                  <h2>{props.title}</h2>
                  <h3>{props.address}</h3>
                  <p>{props.description}</p>
              </div>
              <div className = "place-item__actions">
                <Button inverse onClick = {openMapHandler}>View on Map</Button>
                <Button to={`/places/${props.id}`}>Edit</Button>
                <Button danger>DELETE</Button>
              </div>
          </Card>
      </li>
    </React.Fragment>
  )
};

export default PlaceItem;

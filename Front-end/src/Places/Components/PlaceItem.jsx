import React, { useContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Card from "../../Shared/Components/UIElements/Card";
import Modal from "./Modal";
import "./PlaceItem.css"
import Button from "../../Shared/Components/FormElements/Button"
import Map from "../../Shared/Components/UIElements/Map";
import AuthContext from "../../Shared/Context/AuthContext";
import useHttpClient from "../../Shared/Components/hooks/http-hook";
import ErrorModal from "../../Shared/Components/FormElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/FormElements/LoadingSpinner";

const PlaceItem = (props) => {
  const {isLoggedIn,userId, token} = useContext(AuthContext);
  //To Render Map.
  const [showMap, setShowMap] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  /*Confirmation Modal State*/
  const[showConfirmModal, setShowConfirmModal] = useState(false)
  

  // Delete -> Show Modal
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true)
  }
  
  // Delete -> No or Anywhere outside the Modal
  const cancelDeleteWarningHandler = () => {
    setShowConfirmModal(false)
  }

  /*
    Only show edit and delete, if you are the owner. I need to add this logic to the 
    Backend and Front End
  */


  // Delete -> Yes
  const confirmDeleteHandler = () => {
    setShowConfirmModal(false)
    try {
     const deleteItem = async() => {
        const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`, "DELETE", null,  {
          'Authorization': 'Bearer ' +  token,
        })
        props.onDelete(props.id)
      }
      deleteItem() 
    } catch (error){} 
  }

  return (
    <React.Fragment>
      <ErrorModal error = {error} onClear = {clearError} />

    {/* Modal for Maps */}
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
            <Map center = {props.coordinates} zoom ={16}/>
          </div>
      </Modal>
      {/* Modal for Delete */}
      <Modal
        show = {showConfirmModal}
        header = "Are you sure ?"
        footerClass = "place-item__modal-actions"
        footer = {
          <React.Fragment>
              <Button inverse onClick = {() => cancelDeleteWarningHandler()}>CANCEL</Button>
              <Button danger onClick = {() => confirmDeleteHandler()}>DELETE</Button>
          </React.Fragment>
        }
        >
        <p>
          Do you want to proceed and delete this place ?
          Please note that it cannot be undone thereafter.
        </p>
      </Modal>
        {/* Each place as card item */}
        <li className="place-item">
            <Card className= "place-item__content">
                {isLoading && <LoadingSpinner asOverlay/>} 
                <div className="place-item__image">
                    <img src={`${process.env.REACT_APP_BACKEND_URL}\\` + props.image} alt = {props.title}/>
                </div>
                <div className="place-item__info">
                    <h2>{props.title}</h2>
                    <h3>{props.address}</h3>
                    <p>{props.description}</p>
                </div>
                <div className = "place-item__actions">
                  <Button inverse onClick = {openMapHandler}>View on Map</Button>
                 {isLoggedIn && props.creatorId === userId && <Button to={`/places/${props.id}`}>EDIT</Button>}
                 {isLoggedIn && props.creatorId === userId && <Button danger onClick = {() => showDeleteWarningHandler()}>DELETE</Button>}
                </div>
            </Card>
        </li>
    </React.Fragment>
  )
};

export default PlaceItem;

import React, { useContext, useEffect, useState } from "react";
import "./UserPlaces.css"
import PlaceList from "../Components/PlaceList";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import ErrorModal from "../../Shared/Components/FormElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/FormElements/LoadingSpinner";
import useHttpClient from "../../Shared/Components/hooks/http-hook";
import AuthContext from "../../Shared/Context/AuthContext";


/* 
  ! User Places
  !   >   Place List
  !       >  Place Item
*/


const UserPlaces = () => {
  //  <Route path = "/:userId/places"
  const[loadedPlaces, setLoadedPlaces] = useState()
  /* 
    Using our Custom HTTP Request Client
  */
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const userId = useParams().userId;
  /* 
    If you do not use useEffect, the function is re-evaluated for re-render
    If you do not store the result of useEffect in a State, it will not reload after fetch is complete
  */
  useEffect(()=> {
    const request = async() => {
      try {
        const filteredPlaces = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`)
        setLoadedPlaces(filteredPlaces.result)
      } catch (err) {
        /* We catch errors within our HTTP Client itself */
      }
    }
    request();
  }, [sendRequest, userId])

  const deleteItem = (deletedPlaceId) => {
    setLoadedPlaces((previousLoadedPlaces) => 
       previousLoadedPlaces.filter((place) => place.id !== deletedPlaceId))
  }

  return (
          <>
            <ErrorModal error = {error} onClear = {clearError} />
              {isLoading && 
                (<div className="center">
                  <LoadingSpinner asOverlay/>
                </div>)
              }
            {!isLoading && loadedPlaces && <PlaceList places = {loadedPlaces} onDelete = {deleteItem} />}
          </>  
        )
};

export default UserPlaces;

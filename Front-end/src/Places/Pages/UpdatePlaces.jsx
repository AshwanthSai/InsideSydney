import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../Shared/Components/FormElements/Input";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../Shared/Utils/validators";
import "./Place-form.css"
import Button from "../../Shared/Components/FormElements/Button";
import useForm from "../../Shared/Components/hooks/useHook";
import Card from "../../Shared/Components/UIElements/Card";
import useHttpClient from "../../Shared/Components/hooks/http-hook";
import LoadingSpinner from "../../Shared/Components/FormElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/FormElements/ErrorModal";

const UpdatePlaces = (props) => {
  const placeId = useParams().placeId;
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const[identifiedPlace, setIdentifiedPlace] = useState()
  /*
  setFormData -  
   What if the network request comes late
   We cannot initialize a hook in a fetch block
   So we will create an UpdatePlace method for useForm
   Initialize form with dummy values and then update them later.
  */
 
 const [formState, inputHandler, setFormData] = useForm({
   title : {
     value: "",
     isValid: true
    }, 
    description : {
      value: "",
      isValid: true
    }
  }, false)
  
  /*
  If you set the form directly
  useForm will internally update its State.
  Since we are subscribed to that state, this page reloads.
  Again, calling setForm into a while loop.
  */

  useEffect(() => {
   const send = async() => {
    /* Fetch the particular place details.*/
    try {
      const responseData = await sendRequest(`http://localhost:4000/places/${placeId}`)
      setIdentifiedPlace(responseData.result)
      setFormData({
        title : {
          value: responseData.result.title,
          isValid: true
         }, 
         description : {
           value: responseData.result.description,
           isValid: true
         }
       }, true)
    }catch(error){}
   } 
   send();
 }, [placeId, setFormData, sendRequest])
 
 if(isLoading) {
  return (
    <div className="center">
      <LoadingSpinner asOverlay/>
    </div>
  ) 
} 

  if(!identifiedPlace && !error && !isLoading){
    return (
        <div className = "center">
          <Card>
              <h2>Could not find place!</h2>
          </Card>
        </div>
    )
  }

  /* 
  router.patch("/:pid",
    [
        check("title").not().isEmpty(),
        check("description").isLength({min:5}),
    ],
    placesControllers.updatePlaceById) 
  */

  const placeSubmitHandler = (event) => {
    event.preventDefault()
    console.log(`Here`)
    const send = async() => {
      let body = {title : identifiedPlace.title, body : identifiedPlace.body}
      try {
        const responseData = await sendRequest(`http://localhost:4000/places/${placeId}`,"PATCH", 
          body , {
          "Content-Type": "application/json-patch+json",
          "Accept": "application/json"});
          console.log(responseData)
      } catch(error) {}
    send();
    }  
  }
    // const sendRequest = useCallback(async(url, method = "PATCH",body = null, headers = {}
 
  return (
    <React.Fragment>
    <ErrorModal error = {error} onClear = {clearError} />
    {!isLoading && identifiedPlace && <form className = "place-form " onSubmit = {placeSubmitHandler}>
        <Input 
            element="input" 
            id= "Title"
            type="text" 
            label="Title" 
            validators = {[VALIDATOR_REQUIRE()]}
            onInput = {inputHandler}
            errorText = "Please enter a valid title"
            value = {identifiedPlace.title}
            validity = {true}
            />
        <Input 
            element="textarea" 
            id= "Description"
            type="text" 
            label="Description" 
            validators = {[VALIDATOR_MINLENGTH(5)]}
            onInput = {inputHandler}
            errorText = "Please enter a longer address"
            value = {identifiedPlace.description}
            validity = {true}
            /> 
        <Button type = "submit">
            Update Place
        </Button> 
    </form>}
    </React.Fragment>
  ); 
};

export default UpdatePlaces;

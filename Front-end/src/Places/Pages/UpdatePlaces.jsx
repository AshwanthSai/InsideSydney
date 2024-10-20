import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../Shared/Components/FormElements/Input";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../Shared/Utils/validators";
import "./Place-form.css"
import Button from "../../Shared/Components/FormElements/Button";
import useForm from "../../Shared/Components/hooks/useHook";
import Card from "../../Shared/Components/UIElements/Card";
import useHttpClient from "../../Shared/Components/hooks/http-hook";
import LoadingSpinner from "../../Shared/Components/FormElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/FormElements/ErrorModal";
import AuthContext from "../../Shared/Context/AuthContext";

const UpdatePlaces = (props) => {
  const placeId = useParams().placeId;
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const[identifiedPlace, setIdentifiedPlace] = useState()
  const history = useHistory();
  const{userId} = useContext(AuthContext)
  
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
  
    Below is Aux to prevent, page reload when setting state.
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

  /*
   We send the Form State data because this store
   handles change to Place Information
   Identified Place is only for Form Population
  */
  const placeSubmitHandler = (event) => {
    event.preventDefault()

    const send = async() => {
      let body = {title : formState.inputs.title.value, description : formState.inputs.description.value}
      try {
        const responseData = await sendRequest(`http://localhost:4000/places/${placeId}`,"PATCH", 
          JSON.stringify(body) , {'Content-Type': 'application/json',
          'Accept': 'application/json'});
          // console.log(responseData)
        history.push(`/${userId}/places`)
      } catch(error) {}
    }
    send()   
  }
    // const sendRequest = useCallback(async(url, method = "PATCH",body = null, headers = {}
 
  return (
    <React.Fragment>
    <ErrorModal error = {error} onClear = {clearError} />
    {!isLoading && identifiedPlace && <form className = "place-form " onSubmit = {placeSubmitHandler}>
        <Input 
            element="input" 
            id= "title"
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
            id= "description"
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

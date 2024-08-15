import React, { useCallback, useContext, useReducer } from "react";
import "./Place-form.css"
import Input from "../../Shared/Components/FormElements/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../Shared/Utils/validators"
import Button from "../../Shared/Components/FormElements/Button"
import useForm from "../../Shared/Components/hooks/useHook";
import useHttpClient from "../../Shared/Components/hooks/http-hook";
import AuthContext from "../../Shared/Context/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorModal from "../../Shared/Components/FormElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/FormElements/LoadingSpinner";

  /* 
    NewPlaces
      > useForm for Overall State Validation
      > Input for Single Field Validation
        > Single Validation via aux within Validate.Js 
  */

const NewPlaces = () => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient()
  const {userId} = useContext(AuthContext)
  const[formState, inputHandler] = useForm({
      title : {
        value: "",
        isValid: true
      }, 
      description : {
        value: "",
        isValid: true
      }, 
      address : {
        value: "",
        isValid: true
      }
  }, false);
  const navigate = useHistory();

  /*
    Input internally uses a UseReducer. On input change, a useEffect
    is Run and data is passed up to parent via the prop function.
    The prop function is again passed as prop to Child.
    To prevent an While loop. We memoize, the inputHandler Function 
    within useForm().
  */

  const placeSubmitHandler = async(e) => {
    e.preventDefault()
    try {
      const responseData = await sendRequest("http://localhost:4000/place","POST", JSON.stringify({
        title : formState.inputs.title.value,
        description : formState.inputs.description.value,
        address : formState.inputs.address.value,
        creator : userId,
      }), {"Content-Type" : "application/json"})
      
     console.log(responseData)
     navigate.push("/")
    } catch(error){

    }
  }


  return (
    <>
      <ErrorModal error = {error} onClear = {clearError} />
        <form className="place-form">
        {/* All input is passed to Input Handler within useForm*/}
        {isLoading && <LoadingSpinner asOverlay/>}
        <Input 
          element="input" 
          id= "title"
          type="text" 
          label="Title" 
          validators = {[VALIDATOR_REQUIRE()]}
          onInput = {inputHandler}
          errorText = "Please enter a valid title"
          />
        <Input 
          element="textarea" 
          id= "description"
          type="text" 
          label="Description" 
          validators = {[VALIDATOR_MINLENGTH(5)]}
          onInput = {inputHandler}
          errorText = "Please enter a longer address"
          />
        <Input 
          element="textarea" 
          id= "address"
          type="text" 
          label="Address" 
          validators = {[VALIDATOR_MINLENGTH(5)]}
          onInput = {inputHandler}
          errorText = "Please enter a longer address"
          />
          {console.log(formState)}
        <Button type = "submit" 
          // If entire form state is inValid then, disable form
          disabled = {!formState.isValid}
          onClick = {placeSubmitHandler}>
          Submit 
        </Button>
        </form>
    </>
  )
};

export default NewPlaces;

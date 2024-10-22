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
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";

  /* 
    NewPlaces
      > useForm for Overall State Validation
      > Input for Single Field Validation
        > Single Validation via aux within Validate.Js 
  */

const NewPlaces = () => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient()
  /* 
    If we destructure the setter method for userId
    We can  write to Global Store Here.
  */
  const {userId, token} = useContext(AuthContext)
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
      },
      image : {
        value: null,
        isValid: false
      }
  }, false);

  /* For automatic routing to pages */
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
    /* 
      Remember for POST, PUT, DELETE requests 
      You need to send Metadata along with the request.
    */
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value)
      formData.append("description", formState.inputs.description.value)
      formData.append("address",formState.inputs.address.value)
      formData.append("image",formState.inputs.image.value)
      /* 
        Adding token within request header
      */
      const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/new`,"POST", formData, {
        "Authorization" : "Bearer " + token,
      })
      /* Here our custom hook, will catch and show any Errors */
      navigate.push("/")
    } catch(error){

    }
  }

  return (
    <>
      <ErrorModal error = {error} onClear = {clearError} />
        <form className="place-form">
        {/* All input is passed to Input Handler within useForm*/}
        {isLoading && <LoadingSpinner center asOverlay/>}
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
        <ImageUpload center id="image" onInput = {inputHandler} onError = "Please Pick a Valid File"/>
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

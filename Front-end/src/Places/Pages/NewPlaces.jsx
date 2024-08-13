import React, { useCallback, useReducer } from "react";
import "./Place-form.css"
import Input from "../../Shared/Components/FormElements/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../Shared/Utils/validators"
import Button from "../../Shared/Components/FormElements/Button"
import useForm from "../../Shared/Components/hooks/useHook";

  /* 
    NewPlaces
      > useForm for Overall State Validation
      > Input for Single Field Validation
        > Single Validation via aux within Validate.Js 
  */

const NewPlaces = () => {
  const[formState, inputHandler] = useForm({
      title : {
        value: "",
        isValid: false
      }, 
      description : {
        value: "",
        isValid: false
      }, 
      address : {
        value: "",
        isValid: false
      }, 
  }, true);

  /*
    Input internally uses a UseReducer. On input change, a useEffect
    is Run and data is passed up to parent via the prop function.
    The prop function is again passed as prop to Child.
    To prevent an While loop. We memoize, the inputHandler Function 
    within useForm().
  */

  return (
    <form className="place-form">
      {/* All input is passed to Input Handler within useForm*/}
      <Input 
        element="input" 
        id= "Title"
        type="text" 
        label="Title" 
        validators = {[VALIDATOR_REQUIRE()]}
        onInput = {inputHandler}
        errorText = "Please enter a valid title"
        />
      <Input 
        element="textarea" 
        id= "Description"
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
      <Button type = "submit" 
        // If entire form state is inValid then, disable form
        disabled = {!formState.isValid}>
        Submit 
      </Button>
    </form>
  )
};

export default NewPlaces;

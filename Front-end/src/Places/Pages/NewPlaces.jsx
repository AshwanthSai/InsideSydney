import React, { useCallback, useReducer } from "react";
import "./Place-form.css"
import Input from "../../Shared/Components/FormElements/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../Shared/Utils/validators"
import Button from "../../Shared/Components/FormElements/Button"
import useForm from "../../Shared/Components/hooks/useHook";



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

  return (
    <form className="place-form">
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
        disabled = {!formState.isValid}>
        Submit 
      </Button>
    </form>
  )
};

export default NewPlaces;

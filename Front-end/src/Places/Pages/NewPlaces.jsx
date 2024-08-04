import React, { useCallback, useReducer } from "react";
import "./NewPlaces.css"
import Input from "../../Shared/Components/FormElements/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../Shared/Utils/validators"
import Button from "../../Shared/Components/FormElements/Button"

const formReducer = (state, action) => {
  switch(action.type) {
    case "INPUT_CHANGE": 
      let formIsValid = true;
      /*
        Loop through all the isValid fields within Inputs
        Create a final is Form Valid Field.
      */
      for(const inputID in state.inputs){
        /* If active element then add to inputs */
        if(inputID === action.inputID){
          formIsValid = formIsValid && action.isValid
        } else {
          /* If inactive, keep old state */
          formIsValid = formIsValid && state.inputs[inputID].isValid
        }
      }
      return {
        /*
          All Previous State Variables, 
          If we add anything in the future
        */
        ...state, 
       inputs : {
        /* 
          All input items we have
        */
        ...state.inputs,
        /* 
          Find the Appropriate input Type, update its value.
          title : {value : newValue, isValid: newValue}
        */
       
        [action.inputID]  : {value : action.value, isValid: action.isValid}
      },
      /* Entire Form Validity */
        isValid : formIsValid
      }
    default : 
      return {...state}
  }
}

const NewPlaces = () => {
  const [formState,dispatch] = useReducer(formReducer, {
    inputs: {
      /* 
        Title, description are all input IDs
      */
      title:{

        value: '',
        isValid: 'false'
      }, 
      description : {
        value: '',
        isValid: 'false'
      }
    },
    /* For entire form */
    isValid:false
  });




  const inputHandler = useCallback((id, value, isValid) => {
    const eventType = "INPUT_CHANGE"
    const inputID = id
    dispatch({type: eventType, inputID, value, isValid})
  },[]);
 

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
      <Button type = "submit" disabled = {!formState.isValid}>
        Submit 
      </Button>
    </form>
  )
};

export default NewPlaces;

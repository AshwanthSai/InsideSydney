import React, { useCallback, useReducer } from "react";

/* 
  Idea behind Form Hook is to 
  Check validity of entire Inputs

  Internally uses Reducer for two way binding.
    Child sends parent value and validity
    We pass back state as value to input.

    UseForm uses UseReducer for Entire form (All Inputs)
      Input uses UseReducer for Entire Input
*/

const formReducer = (state, action) => {
    switch(action.type) {
      /* Recompute Entire Form Validity */
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

      case "SET_DATA": 
        return {
          inputs : action.inputs,
          isValid : action.formIsValid
        }
      /* If action does not match, Return old state */
      default : 
        return {...state}
    }
}

/*
 useHook does not accept props, but takes in argument
 Remember, this is a Hook.
*/
const useForm = (InitialInput, InitialValidity) => {
    const [formState,dispatch] = useReducer(formReducer, {
        inputs: InitialInput,
        /* For entire form */
        isValid:InitialValidity
    });

    /* 
      Value changed in input, 
      Push to Global Store and 
      Recompute Global Validity.
    */
    const inputHandler = useCallback((id, value, isValid) => {
        const eventType = "INPUT_CHANGE"
        const inputID = id
        dispatch({type: eventType, inputID, value, isValid})
    },[]);

    /* To set once, network request is resolved */
    const setFormData =  useCallback((inputData, formValidity) => {
      const eventType = "SET_DATA"
      dispatch({eventType, inputs : inputData, formIsValid : formValidity})
    },[])
  
  //Returning Initial State and Set Method for our Custom Hook
  return [formState, inputHandler, setFormData];
};

export default useForm;


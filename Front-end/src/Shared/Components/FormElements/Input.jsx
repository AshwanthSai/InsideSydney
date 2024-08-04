import React, { useEffect, useReducer } from "react";
import "./Input.css"
import {validate} from "../../Utils/validators"

const inputReducer = (state, action) => {
    switch(action.type) {
        case "CHANGE" : 
            return {...state, 
                value : action.value, isValid: validate(action.value, action.validators)
            }
        case "TOUCHED" : 
        return {...state, isTouched: action.isTouched}   
        default :  
            return state
    }
}

const Input = (props) => {
    const[inputState,dispatch] = useReducer(inputReducer, {value:"", isTouched: false, isValid:false})
    
    const changeHandler = (event) => {
        dispatch({type : "CHANGE",
             value : event.target.value,
             validators : props.validators
            }
        )
    }

    const blurHandler = (event) => {
        dispatch({type : "TOUCHED",
            isTouched : true
           }
       )
    } 

    const element =
        props.element ==="input" ? (
            <input id={props.id} type={props.type}
             placeholder={props.placeholder}
             value = {inputState.value}
             onChange = {changeHandler}
             onBlur={blurHandler}
             />
        ) : (
            <textarea id={props.id} rows={props.rows || 3}
             value = {inputState.value}
             onChange = {changeHandler}
             onBlur={blurHandler}
            />
        );
    
    const{id, onInput} = props
    const{value,isValid} = inputState

    useEffect(() => {
        onInput(id, value, isValid)
    }, [onInput,value,isValid])
  
  return (
    <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
        <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && 
            <p>{props.errorText}</p>}
    </div>
    );
};



export default Input;

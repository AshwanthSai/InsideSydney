import React, { useContext, useState } from "react";
import useForm from "../../Shared/Components/hooks/useHook";
import Input from "../../Shared/Components/FormElements/Input";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../Shared/Utils/validators";
import Button from "../../Shared/Components/FormElements/Button";
import Card from "../../Shared/Components/UIElements/Card";
import AuthContext from "../../Shared/Context/AuthContext";
import "./Authenticate.css"


const Authenticate = (props) => {
    const {logIn, logOut} = useContext(AuthContext)
    const [isLogedIn, setisLogedIn] = useState(true);

    const[formState, inputHandler, setFormState] = useForm({
            email: {
                value : "",
                isValid: false
            }, 
            password: {
                value : "",
                isValid: false
            }, 
        }, true);

    const authSubmitHandler = (e) => {
        e.preventDefault()
        //From Global Context
        logIn()
        console.log(formState)
    }    


    /* 
        In sign up, there is a new input field. i.e. Name
        When you switch to login, it should be removed from FormState 
        or will affect overall Form Validity
    */

    const switchModeHandler = () => {
        if(isLogedIn) {
            /* Remove name input from formState.inputs */
            delete formState.inputs.name
            console.log(formState)
        } else {
            // Adding name input field to formState
            setFormState({name:"", isvalid:false, ...formState}, formState.isValid)
        } 
        setisLogedIn(previousState => !previousState);
    }

    return(
        <>
            <Card className="authentication">   
                {isLogedIn ? (<h2> Log In </h2>) : (<h2> Sign Up </h2>)}
                <hr/>
                <form onSubmit={authSubmitHandler}>
                {!isLogedIn && (
                    <Input
                        element="input" 
                        id= "name"
                        type="text" 
                        label="Name"
                        validators = {[VALIDATOR_MINLENGTH(5),VALIDATOR_REQUIRE()]} 
                        onInput = {inputHandler}
                        errorText = "Please enter a valid name"
                    />
                )}
                    <Input
                        element="input" 
                        id= "email"
                        type="email" 
                        label="Email"
                        validators = {[VALIDATOR_EMAIL(),VALIDATOR_REQUIRE()]} 
                        onInput = {inputHandler}
                        errorText = "Please enter a valid email"
                    />
                    <Input
                        element="input" 
                        id= "password"
                        type="password" 
                        label="Password"
                        validators = {[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]} 
                        // onInput pass back to parent store
                        onInput = {inputHandler}
                        errorText = "Please enter a valid password"
                    />
                    <Button type = "submit" 
                        // If entire form state is inValid then, disable form
                        disabled = {!formState.isValid}>
                        Submit 
                    </Button>
                </form>
                <Button inverse onClick = {() => switchModeHandler()}>
                 Switch to {isLogedIn ? ("Log In") : ("Sign Up")}
                </Button>
            </Card>
        </>
    )
};

export default Authenticate;

import React, { useContext, useState } from "react";
import useForm from "../../Shared/Components/hooks/useHook";
import Input from "../../Shared/Components/FormElements/Input";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../Shared/Utils/validators";
import Button from "../../Shared/Components/FormElements/Button";
import Card from "../../Shared/Components/UIElements/Card";
import AuthContext from "../../Shared/Context/AuthContext";
import "./Authenticate.css"
import LoadingSpinner from "../../Shared/Components/FormElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/FormElements/ErrorModal";


const Authenticate = (props) => {
    const {logIn, logOut} = useContext(AuthContext)
    const [isLogedInMode, setisLogedInMode] = useState(true);
    // For Loading spinner.
    const[isLoading, setisLoading] = useState(false);
    /* For Modal */
    const[error, setError] = useState(false);

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

    const authSubmitHandler = async(e) => {
        console.log("Click Registered")
        e.preventDefault()
        /* Sign Up Mode */
        setisLoading(true)
        if(!isLogedInMode) { 
            try{
                const response = await fetch(`http://localhost:4000/users/signup`, {
                method : "POST",
                headers: {"Content-Type" : "application/json"},
                body : JSON.stringify({
                    name : formState.inputs.name.value,
                    email : formState.inputs.email.value,
                    password : formState.inputs.password.value,
                    })
                })
                if (!response.ok) {
                    // Handle non-2xx HTTP responses
                    throw new Error('Failed to sign up');
                } 
                const responseData = await response.json();
                console.log(responseData)
                setisLoading(false)
                logIn()
            } catch(err) {
                setisLoading(false)
                setError(err.message || "Something went wrong, please try again" )
                console.log(err)
            }
        } else {
            /* Login Mode */
            try{
                setisLoading(true)
                const response = await fetch(`http://localhost:4000/users/login`, {
                method : "POST",
                headers: {"Content-Type" : "application/json"},
                body : JSON.stringify({
                    email : formState.inputs.email.value,
                    password : formState.inputs.password.value,
                    })
                })
                if (!response.ok) {
                    // Handle non-2xx HTTP responses
                    throw new Error('Failed to sign in');
                } 
                const responseData = await response.json();
                console.log(responseData)
                logIn()
                setisLoading(false)
            } catch(err) {
                console.log(err)
                setisLoading(false)
                setError(err.message || "Invalid Credentials, please try again" )
            }
        }
    }    


    /* 
        In sign up, there is a new input field. i.e. Name
        When you switch to login, it should be removed from FormState 
        or will affect overall Form Validity
    */

    const errorHandler = () => {
        /* Because the Modal shows only when and error object exists */
        setError(null)
    }
    
    const switchModeHandler = () => {
        if(isLogedInMode) {
            /* Remove name input from formState.inputs */
            delete formState.inputs.name
            console.log(formState)
        } else {
            // Adding name input field to formState
            setFormState({name:"", isvalid:false, ...formState}, formState.isValid)
        } 
        setisLogedInMode(previousState => !previousState);
    }

    return(
        <>
            <ErrorModal error = {error} onClear = {errorHandler} />
            <Card className="authentication">   
                {isLogedInMode ? (<h2> Log In </h2>) : (<h2> Sign Up </h2>)}
                <hr/>
                <form onSubmit={authSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay/>}
                {!isLogedInMode && (
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
                 Switch to {!isLogedInMode ? ("Log In") : ("Sign Up")}
                </Button>
            </Card>
        </>
    )
};

export default Authenticate;

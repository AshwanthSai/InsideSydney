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
import useHttpClient from "../../Shared/Components/hooks/http-hook";
import { useHistory } from "react-router-dom"; 


const Authenticate = (props) => {
    const {userId, logIn, logOut} = useContext(AuthContext)
    const [isLogedInMode, setisLogedInMode] = useState(true);
    // For Loading spinner.
    /* For Modal */
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

    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const navigate = useHistory();

    const authSubmitHandler = async(e) => {
        console.log("Click Registered")
        e.preventDefault()
        
        /* Sign Up Mode */      
        if(!isLogedInMode) { 
            try{
                const responseData = await sendRequest(`http://localhost:4000/users/signup`,"POST", JSON.stringify({
                    name : formState.inputs.name.value,
                    email : formState.inputs.email.value,
                    password : formState.inputs.password.value,
                }), {"Content-Type" : "application/json"})
                
                // We are pulling out the User Id from the response of Login Data
                logIn(responseData.newUser.id)
                navigate.push("/") 
            } catch(err) {
                /* All states are passed to Error above, we do not need to explicitly do anything */
                console.log(err)
            }
        } else {
            /* Login Mode */
            try{
                const responseData = await sendRequest(`http://localhost:4000/users/login`,"POST", JSON.stringify({
                    email : formState.inputs.email.value,
                    password : formState.inputs.password.value,
                }), {"Content-Type" : "application/json"})
                console.log(error)
                console.log(responseData.userExist.id)
                logIn(responseData.userExist.id)
                navigate.push("/") 
            } catch(err) {
                console.log(error)
                console.log(err)
            }
        }
    }    


    /* 
        In sign up, there is a new input field. i.e. Name
        When you switch to login, it should be removed from FormState 
        or will affect overall Form Validity
    */
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
            <ErrorModal error = {error} onClear = {clearError} />
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

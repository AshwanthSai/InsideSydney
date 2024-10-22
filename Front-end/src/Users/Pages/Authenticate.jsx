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
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";


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
    /* For automatic routing to Page */
    const navigate = useHistory();

    const authSubmitHandler = async(event) => {
        /* Prevent Page reload on Form Submit */
        event.preventDefault()
        /* Sign Up Mode */      
        if(!isLogedInMode) { 
            try{    
                const formData = new FormData();
                formData.append("name", formState.inputs.name.value)
                formData.append("email", formState.inputs.email.value)
                formData.append("password",formState.inputs.email.value )
                formData.append("image",formState.inputs.image.value )
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signup`,"POST", 
                    formData
                )
                
                // We are pulling out the User Id from the response of Login Data
                console.log(responseData)
                logIn(responseData.newUser.id,responseData.token)
                navigate.push("/") 
            } catch(err) {
                /* All states are passed to Error above, we do not need to explicitly do anything */
                console.log(err)
            }
        } else {
            /* Login Mode */
            try{
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/login`,"POST", JSON.stringify({
                    email : formState.inputs.email.value,
                    password : formState.inputs.password.value,
                }), {"Content-Type" : "application/json"})
                console.log(responseData)
                logIn(responseData.userExist.id, responseData.token)
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
            // Adding name input field to formState
            // console.log("Sign up mode")
            console.log(formState)
            const modifiedFormState = {...formState}
            modifiedFormState.inputs.name =  {value : "", isValid : false}
            modifiedFormState.inputs.image =  {value : null, isValid : false}
            setFormState(modifiedFormState, formState.isValid)
        } else {
            /* Remove name input from formState.inputs */
            // console.log("Log in mode")
            console.log(formState)
            delete formState.inputs.name
            delete formState.inputs.image
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
                        // [{type: VALIDATOR_TYPE_MINLENGTH,val: 5}, {type: VALIDATOR_TYPE_REQUIRE }]
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
                    {!isLogedInMode && <ImageUpload center id="image" onInput = {inputHandler} onError = "Please Pick a Valid File"/>}
                    <Input
                        element="input" 
                        id= "password"
                        type="password" 
                        label="Password"
                        validators = {[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]} 
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

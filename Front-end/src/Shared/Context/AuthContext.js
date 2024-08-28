import { createContext } from "react";

/*Basic Structure of Context is Created Here */
const AuthContext = createContext({
    isLoggedIn : false,
    userId : null,
    logIn : () => {},
    logOut : () => {},
});

export default AuthContext;

import { createContext } from "react";

/*Basic Structure of Context is Created Here */
const AuthContext = createContext({
    isLoggedIn : false,
    token: null,
    userId : null,
    logIn : () => {},
    logOut : () => {},
});

export default AuthContext;

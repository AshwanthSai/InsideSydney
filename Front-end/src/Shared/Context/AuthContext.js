import { createContext } from "react";

const AuthContext = createContext({
    isLoggedIn : false,
    userId : null,
    logIn : () => {},
    logOut : () => {},
});

export default AuthContext;

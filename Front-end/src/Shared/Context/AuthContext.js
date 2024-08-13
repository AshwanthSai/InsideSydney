import { createContext } from "react";

const AuthContext = createContext({
    isLoggedIn : false,
    logIn : () => {},
    logOut : () => {},
});

export default AuthContext;

import React, { useCallback, useEffect, useRef, useState } from "react";

const useHttpClient = () => {
    const[error, setError] = useState()
    const[isLoading, setIsLoading] = useState(false)
    const activeFetchRequests = useRef([]);
    
    /*
        If you do not memoize, 
        re-render of components that use this function
        will cause this function to be re-evaluated
    */
      
    /* Below are default parameters */
    const sendRequest = useCallback(async(url, method = "GET",body = null, headers = {}) => {
        setIsLoading(true)
        const controller  = new AbortController();
        activeFetchRequests.current.push(controller);
        if(body) {
            body = JSON.stringify(body);
        }
        try {
            const response = await fetch(url, {
                method, headers, body, signal : controller.signal
            })

            /* Consumed Response will not have an Okay */
            
            if (!response.ok) {
                const responseData = await response.json(); // Parse only if response is not OK
                throw new Error(responseData.message || 'An error occurred'); // Provide a default error message
            }
        
            // If the response is OK, parse the JSON
            const responseData = await response.json();
            /* If request was success, remove the particular abort controller from useRef */
            activeFetchRequests.current = activeFetchRequests.current.filter((abortController) => abortController !== controller);
            setIsLoading(false)
            return responseData;
        } catch (error) {
            if(error.message !== 'The user aborted a request.'){
                setError(error.message)
                setIsLoading(false)
                // Because we are not doing anything explicitly in parent. Try, Catch Block.
                throw error
           }
        }
    },[])

    /* For Error Modal Clearing */
    const clearError = () => {
        setError(null)
    }

    useEffect(() => {
        /* Clean Up Function */
        return () => {
            activeFetchRequests.current.forEach(controller => controller.abort())
        }
    }, [])

    return {isLoading, error, sendRequest, clearError}
};

export default useHttpClient;

import React, { useEffect, useState } from "react";
import UserList from "../Components/UsersList";
import LoadingSpinner from "../../Shared/Components/FormElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/FormElements/ErrorModal";

/* 
 ! User Page
 !  > User List
 !    > UserItem
*/
const Users = () => {
  const[isLoading, setIsLoading] = useState(false);
  const[users, setUsers] = useState()
  const[error, setError] = useState()

  useEffect(() => {
    const sendRequest = async() => {
      try {
        const response = await fetch(`http://localhost:4000/users`)
        const responseData = await response.json();
        const users = responseData.users;
        if(!response.ok) {
          throw new Error ("Fetching Users Failed")
        }
        console.log(users)
        setUsers(users)
      } catch (error) {
        setError(error.message)
      } 
    setIsLoading(false)
    }
    sendRequest();
  }, [])

  const errorHandler = () => {
    setError(null)
  }

  return (
    <>
      <ErrorModal error = {error} onClear = {errorHandler} />
      {isLoading && 
        <div className = "center">
          <LoadingSpinner/>
        </div>
      }
      {!isLoading && users && <UserList users = {users} /> }
    </>
  )
};

export default Users;

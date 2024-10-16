import React, { useEffect, useState } from "react";
import UserList from "../Components/UsersList";
import LoadingSpinner from "../../Shared/Components/FormElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/FormElements/ErrorModal";
import useHttpClient from "../../Shared/Components/hooks/http-hook";

/* 
 ! User Page
 !  > User List
 !    > UserItem
*/
const Users = () => {
  const[users, setUsers] = useState()
  /* 
    useHttpClient is our custom hook to fetch data.
    In production, you would ideally use axios.
  */
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  useEffect(() => {
    const send = async() => {
      try {
        const response = await sendRequest(`http://localhost:4000/users`)
        setUsers(response.users)
      } catch (error) {
        
      }
    }
    send();
    }, [sendRequest])


  return (
    <>
      {/*
         Only renders if error prop exists, onClear will communicate upwards.
         Set error as null within this Component.
       */}
      <ErrorModal error = {error} onClear = {clearError} />
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

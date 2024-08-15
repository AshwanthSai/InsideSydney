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

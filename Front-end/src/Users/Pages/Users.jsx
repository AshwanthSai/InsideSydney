import React from "react";
import UserList from "../Components/UsersList";

/* 
 ! User Page
 !  > User List
 !    > UserItem
*/
const Users = () => {
  const USERS =    [ {
    id: 'u1',
    name: 'Ashwanth Sai',
    image: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671116.jpg?w=740&t=st=1721798675~exp=1721799275~hmac=7f73aa9feddf9d6751aac7e8436e59de80c6a3661c0447d508a35ab9a3f950cf",
    places: 3
  }]
  return <UserList users = {USERS}/>
};

export default Users;

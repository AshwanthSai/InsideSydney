import React from 'react';

import UserItem from './UserItem';
import './UsersList.css';
import useHttpClient from '../../Shared/Components/hooks/http-hook';


const UsersList = props => {  
  if (props.users.length === 0) {
    return (
      <div className="center">
        <h2>No users found.</h2>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.users.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;

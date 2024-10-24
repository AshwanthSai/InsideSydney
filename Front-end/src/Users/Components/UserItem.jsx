import React from 'react';
import { Link } from 'react-router-dom';
import './UserItem.css';
import Card from '../../Shared/Components/UIElements/Card';
import Avatar from '../../Shared/Components/UIElements/Avatar';

const UserItem = props => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            {/* Prepending URL to Convert Path to URL */}
            {/* Seems to be working when \ instead of  /  */}
            <Avatar image={`${process.env.REACT_APP_BACKEND_URL}\\` + props.image} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;

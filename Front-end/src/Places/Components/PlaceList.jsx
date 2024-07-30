
import "./PlaceList.css"
import Card from "../../Shared/Components/UIElements/Card";
import PlaceItem from "./PlaceItem"

const PlaceList = (props) => {
  if(props.places.length === 0){
    return <div className="place-list center">
        <Card>
            <h2>No places found. Maybe Create One?</h2>
            <button>Share Place</button>
        </Card>
    </div>
  }

  return (
    <ul className = "place-list">
        {props.places.map(place => {
            return <PlaceItem
                    key = {place.id}
                    id = {place.id}
                    image = {place.imageUrl}
                    title = {place.title}
                    description = {place.description}
                    address = {place.address}
                    creatorId = {place.creator}
                    coordinates = {place.location}
                />
        })}
    </ul>
  )
};

export default PlaceList;

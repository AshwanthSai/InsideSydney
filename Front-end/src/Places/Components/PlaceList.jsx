
import "./PlaceList.css"
import Card from "../../Shared/Components/UIElements/Card";
import PlaceItem from "./PlaceItem"
import Button from "../../Shared/Components/FormElements/Button";

const PlaceList = (props) => {
  if(props.places.length === 0){
    return <div className="place-list center">
        <Card>
            <h2>No places found. Maybe Create One?</h2>
            <Button>Share Place</Button>
        </Card>
    </div>
  }

  return (
    <ul className = "place-list">
        {props.places.map(place => {
            return <PlaceItem
                    key = {place.id}
                    id = {place.id}
                    image = {place.image}
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

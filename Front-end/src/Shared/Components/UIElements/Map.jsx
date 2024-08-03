import React, { useEffect, useRef } from "react";
import "./Map.css"
import {
    APIProvider,
    Map,
    AdvancedMarker,
    MapCameraChangedEvent,
    Pin
} from '@vis.gl/react-google-maps';

const PoiMarkers = (props) => {
    const {location} = props;
    return (
      <>
          <AdvancedMarker
            key={"Opera House"}
            position={location}>
             <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
      </>
    );
  };


const CustomMap = (props) => {
    const { center, zoom } = props

    // useEffect(() => {
   return ( <APIProvider apiKey={"AIzaSyCJpI2c3iNZD0oIyEbaBXd2uwidQ5ED1bc"} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
            defaultZoom={zoom}
            defaultCenter={center}
            mapId='DEMO_MAP_ID'>
            <PoiMarkers location={center} />
        </Map>
    </APIProvider>)
    // }, [center, zoom]);
}


const RenderMap = (props) => {
    // console.log(props)
    return <div  
             className={`map ${props.className}`}    
             style = {props.style}>
               jsx
               <CustomMap {...props}/>  
            </div>
}


export default RenderMap;

import React from "react";
import "./MainHeader.css"


/* 
  Why a dedicated Header Component ?
  1. Encapsulation - The component encapsulates the header's structure and styling,
     which keeps your code organized. Any changes to the header can be made in one 
     place without affecting other parts of the application. 
*/
const MainHeader = (props) => {
  return <header className = "main-header">{props.children}</header>;
};

export default MainHeader;



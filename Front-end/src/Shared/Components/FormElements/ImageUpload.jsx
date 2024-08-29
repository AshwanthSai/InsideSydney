import React, { useRef, useState } from "react";
import "./ImageUpload.css"
import Button from "./Button";


const ImageUpload = (props) => {
  const [isValid, setIsValid] = useState();
  const [file,setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();

  const filePickerRef = useRef(); 

  /* Aux to Show Preview and Send to Back End */
  const pickHandler = (event) => {
    let pickedFile = event.target.files[0];
    let fileValidity;
    /* File has been Received by Picker. */
    if(event.target.files || event.target.files.length == 1){
        
        /* Read file and set to */
        const fileReader = new FileReader()
        fileReader.onload(() => {
            setPreviewUrl(fileReader.result)
        })
        fileReader.readAsDataURL(pickedFile)
        setIsValid(true)
        fileValidity = true;
    } else {
        setIsValid(false);
        fileValidity = false;
    }

  }
  /*
    Button > Clicks the Image Picker which is not visible 
    to the User.
  */
  const pickImageHandler = () => {
    filePickerRef.current.click()
  }

  return (
    <div className = "form-control">
        <input
         id  = {props.id}
         style = {{display:"none"}} 
         type = "file" 
         accept = ".jpg,.png,.jpeg"
         ref = {filePickerRef}
         onChange = {pickHandler}
         />
        <div className = {`image-upload ${props.center && `center`}`}>
            <div className = "image-upload__preview">
                <img alt = "Preview" src=""/>
            </div>
            <Button type="button" onClick = {pickImageHandler}>Pick Image</Button>
        </div>
    </div>

  );
};

export default ImageUpload;

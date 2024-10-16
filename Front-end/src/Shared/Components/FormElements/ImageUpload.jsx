import React, { useEffect, useRef, useState } from "react";
import "./ImageUpload.css"
import Button from "./Button";


const ImageUpload = (props) => {
  const [file,setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState();

  /* Aux to click on this DOM Element. */
  const filePickerRef = useRef(); 

  /* Used to Set Preview */
  useEffect(() => {
    if(!file) {
      return
    }
    let fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result)
    }
    fileReader.readAsDataURL(file)
  }, [file]);

  /* OnChange in Picker, Sets id, file and Validity, aux to send to FormState */
  const pickHandler = (event) => {
    /* Files are stored in as File List */
    let pickedFile;
    let fileValidity;
    /* If event.target.file exists or if event.target.file list length == 1*/
    if(event.target.file || event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile)
      setIsValid(true)
      fileValidity = true  // State updates are not Synchronous, Aux to pull data on to FormState
    } else {
      setIsValid(false)
      fileValidity = false // State updates are not Synchronous,  Aux to pull data on to FormState
    }
    /* 
      useForm accepts
      onInput(id, value, isValid)
    */
    props.onInput(props.id,pickedFile,fileValidity)
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
                {!previewUrl && <p>Please Pick an Image</p>}
                {previewUrl && <img alt = "Preview" src={previewUrl}/>}
            </div>
            <Button type="button" onClick = {pickImageHandler}>Pick Image</Button>
        </div>
        {!isValid && <p>{props.error}</p>}
    </div>

  );
};

export default ImageUpload;

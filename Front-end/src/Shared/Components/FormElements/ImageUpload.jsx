import React, { useEffect, useRef, useState } from "react";
import "./ImageUpload.css"
import Button from "./Button";

const ImageUpload = (props) => {
  const[file, setFile] = useState();
  const[previewUrl, setPreviewUrl] = useState();
  const[isValid, setIsValid] = useState(false);

  const filePicker = useRef();
  const pickHandler = (event) => {
    filePicker.current.click();
  }

  /* 
    State changes are not immediate and
    we are passing it upwards. Hence we use a proxy boolean
    called fileValidity.
  */
  const pickedFileHandler = (event) => {
    let pickedFile;
    let fileValidity = isValid;
    if(event.target.files && event.target.files.length === 1){
      pickedFile = event.target.files[0]
      setFile(pickedFile)
      setIsValid(true)
      fileValidity = true;
    } else {
      setIsValid(false)
    }
    // console.log(pickedFile)
    // console.log(typeof pickedFile)
    props.onInput(props.id, pickedFile,fileValidity)
  }

  useEffect(() => {
    if (!file) {
      return;
    }
    /* 
      2, has to be specified before 1. 
      Clunky API
    */
    const fileReader = new FileReader();
    // Set the onload event handler
    fileReader.onload = () => {
      //2
      setPreviewUrl(fileReader.result); // Set the preview URL
    };
    // Start reading the file
    //1
    fileReader.readAsDataURL(file);
  }, [file]);

  return (
  <React.Fragment>
    <div className="form-control">
      <input 
        id = {props.id}
        type="file" 
        accept = ".jpg,.png,jpeg" 
        style ={{display:"none"}}
        ref = {filePicker}
        onChange={pickedFileHandler}
      />
      <div className = {`image-upload ${props.center && "center"}`}>
        <div className = "image-upload__preview" >
          {previewUrl && <img src={previewUrl} alt= "Preview"/>}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type = "button" onClick={pickHandler}>Pick Image</Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  </React.Fragment>)
};

export default ImageUpload;

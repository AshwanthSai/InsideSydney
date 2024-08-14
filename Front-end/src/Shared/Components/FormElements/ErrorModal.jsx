import React from 'react';
import Modal from "../../../Places/Components/Modal"

import Button from './Button';

const ErrorModal = props => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      // Truthy or Falsely, If error exists then Show
      // If falsy, convert to true and then convert back to false, for JSX evaluation
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;

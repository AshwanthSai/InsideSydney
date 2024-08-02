import React from 'react';
import ReactDOM from 'react-dom';
import './Backdrop.css';

// Portal which renders before Drawer Hook in Index.HTML
const Backdrop = props => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')
  );
};

export default Backdrop;

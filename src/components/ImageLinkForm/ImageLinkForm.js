import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit, input }) => {
  return (
    <div>
      <p className='f3'>
        {"Paste an image url or choose an image from your device (:"}
      </p>
      <div className='center'>
        <div className='form center pa4 br3 shadow-5'>
          <input
            className='f4 pa2 w-70 center'
            type='text'
            onChange={onInputChange}
            value={input}
            placeholder='https://'
          />
          <button
            className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
            onClick={onButtonSubmit}>
            Detect
          </button>
          <input
            className='f4 pa2 w-70 center'
            id='files_input'
            type='file'
            onChange={onInputChange}
            accept='image/*'
          />
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;

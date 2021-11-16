import React, { useState } from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit, input }) => {
  const [showUploadOption, setUploadOption] = useState(false);
  return (
    <div>
      <p className='f3' style={{ color: "white" }}>
        {"Paste an image url or choose an image from your device (:"}
      </p>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <label class='rad-label' onChange={() => setUploadOption(false)}>
          <input type='radio' class='rad-input' name='rad' defaultChecked />
          <div class='rad-design'></div>
          <div class='rad-text'>URL</div>
        </label>

        <label class='rad-label' onChange={() => setUploadOption(true)}>
          <input type='radio' class='rad-input' name='rad' />
          <div class='rad-design'></div>
          <div class='rad-text'>UPLOAD</div>
        </label>
      </div>
      <div className='center'>
        <div className='form center pa4 br3 shadow-5'>
          {showUploadOption === false ? (
            <input
              className='f4 pa2 w-70 center'
              type='text'
              onChange={onInputChange}
              value={input}
              placeholder='https://'
            />
          ) : (
            <input
              className='f4 pa2 w-70 center'
              id='files_input'
              type='file'
              onChange={onInputChange}
              accept='image/*'
            />
          )}
          <button
            className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
            onClick={onButtonSubmit}>
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;

import React from "react";
import Tilt from "react-tilt";
import ailogo from "./ai-logo.png";
import "./Logo.css";

const Logo = () => {
  return (
    <div className='ma4 mt0'>
      <Tilt
        className='Tilt br2 shadow-2'
        options={{ max: 50 }}
        style={{ height: 150, width: 150 }}>
        <div className='Tilt-inner'>
          <img src={ailogo} style={{ paddingTop: "5px" }} alt='logo' />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;

import React from "react";
import './loader.css';

const Loader = () => {
  return (
    <>
      <div className="main-div" style={{ width: '100%', display:'flex', alignItems:'center', justifyContent:'center'}} >
        <div className="loader-icon1 loader"></div>
        <div className="loader-icon2 loader"></div>
        <div className="loader-icon3 loader"></div>
        <div className="text">Loading...</div>
      </div>
    </>
  );
};

export default Loader;

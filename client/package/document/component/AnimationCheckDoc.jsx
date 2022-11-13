import React from "react";

const AnimationCheckDoc = ({ style }) => {
  return (
    <div
      className={
        "fixed p-0 top-0 left-0 right-0 bottom-0 flex justify-center w-full h-full bg-black bg-opacity-50 antialiased items-center " +
        (style ? "opacity-1 visible" : "opacity-0 invisible")
      }
      style={{transition:'all 0.4s'}}
    >
      <div className="py-5 px-32 rounded-md bg-white flex items-center justify-center flex-col">
        <div className="circle">
          <div className="file">
            <div className="image"></div>
            <div className="text-bar"></div>
            <div className="fill "></div>
          </div>
          <div className="scanner-bar "></div>
        </div>
        <div
          className="mt-2 uppercase text-5xl text-gray-600 font-bold animate-load"
          data-text="Checking..."
        >
          Checking...
        </div>
      </div>
    </div>
  );
};

export default AnimationCheckDoc;

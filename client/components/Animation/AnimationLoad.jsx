import React from "react";

const AnimationLoad = () => {
  return (
    <div className="fixed p-0 top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-full  bg-black bg-opacity-50 z-10">
      <div className="w-44 h-36 rounded-lg bg-white flex items-center justify-center">
        <div
          style={{ borderTopColor: "transparent" }}
          className="w-16 h-16 border-4 border-blue-500 border-double rounded-full animate-spin"
        />
      </div>
    </div>
  );
};

export default AnimationLoad;

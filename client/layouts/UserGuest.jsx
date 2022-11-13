
import React from "react";


const UserGuest = ({ children }) => {
  return (
    <div className="bg-background-login w-full h-full min-h-screen bg-cover relative flex items-center justify-center">
      <div className="bg-black opacity-50 w-full h-full absolute top-0 left-0 z-1"></div>
      {children}
    </div>
  );
};

export default UserGuest;

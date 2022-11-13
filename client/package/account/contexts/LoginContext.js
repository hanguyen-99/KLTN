import React from "react";

export const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  
  const [user, setUser] = React.useState(null);

  // Login updates the user data with a name parameter
  const dataLogin = (user) => {
    setUser(user)
  };

  const globalData = {
    user,
    dataLogin
  }

  return (
    <UserContext.Provider value={ globalData }>
      { children }
    </UserContext.Provider>
  );
}

export default UserProvider

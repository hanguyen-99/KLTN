import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useRouter } from "next/router";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../containers/Header/Header";

export const UserLayout = ({ children }) => {
  const router = useRouter();
  const token = Cookies.get("access_token");
  useEffect(() => {
    if (token === undefined) {
      return router.replace("/login");
    }
  }, []);
  return (
    <>
      {token !== undefined && (
        <div className="relative md:ml-72 bg-blueGray-100 h-full min-h-screen">
          
          <Sidebar />
          <Header />
          <div className="w-full">{children}</div>
        </div>
      )}
    </>
  );
};

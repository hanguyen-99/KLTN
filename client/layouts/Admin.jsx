import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect,useState } from "react";
import AnimationLoad from "../components/Animation/AnimationLoad";

import SidebarAdmin from "../components/Sidebar/SidebarAdmin";
import Header from "../containers/Header/Header";
import { UserRole } from "../package/account/model/Account";
import { accountService } from "../package/RestConnector";

export const AdminLayout = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const router = useRouter();
  const token = Cookies.get("access_token");
  const tokenRE = Cookies.get("refresh_token");
  useEffect(() => {
    getDataUser()
  }, [token,tokenRE]);
  const getDataUser = async () => {
    setIsCheck(true)
    try {
      const dataAPI = await accountService.getUserAfterLogin();
      if(!isAdminP(dataAPI.data.roleApps)){
        router.replace("/login");
      }
      else{
        setIsAdmin(true)
      }
      setIsCheck(false)
    } catch (e) {
      setIsCheck(false)
      router.replace("/login");
    }
  };
  const isAdminP = (role) => {
    const res = role.find((role) => role.name === UserRole.ROLE_ADMIN);
    if (res) return true;
    return false;
  };
  return (
    <>
      {isAdmin && (
        <div className="relative md:ml-72 bg-gray-100 h-full min-h-screen">
          <SidebarAdmin />
          <Header />
          <div className="w-full">{children}</div>
        </div>
      )}
      {isCheck && <AnimationLoad/>}
    </>
  );
};

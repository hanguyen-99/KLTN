import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { accountService } from "../../package/RestConnector";
import toastr from "toastr";
import AnimationLoad from "../Animation/AnimationLoad";

const menuItem = [
  {
    link: "/admin",
    label: "Dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-home"
        width={26}
        height={26}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#ffffff"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="5 12 3 12 12 3 21 12 19 12" />
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
      </svg>
    ),
  },
  {
    link: "/admin/users",
    label: "Manager account",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-users"
        width={26}
        height={26}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#ffffff"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx={9} cy={7} r={4} />
        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
      </svg>
    ),
  },
  {
    link: "/admin/document",
    label: "Manager document",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-files"
        width={26}
        height={26}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#ffffff"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M15 3v4a1 1 0 0 0 1 1h4" />
        <path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" />
        <path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
      </svg>
    ),
  },
  {
    link: "/admin/upload-document",
    label: "Upload document",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-file-symlink"
        width={26}
        height={26}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#ffffff"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 21v-4a3 3 0 0 1 3 -3h5" />
        <path d="M9 17l3 -3l-3 -3" />
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M5 11v-6a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-9.5" />
      </svg>
    ),
  },
  {
    link: "/admin/profile",
    label: "Profile",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-user"
        width={26}
        height={26}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#ffffff"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx={12} cy={7} r={4} />
        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const [isCheck, setIsCheck] = React.useState(false);
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const router = useRouter();

  const getSidebarNavItemLinkClass = (path) => {
    const matched =
      path === "/admin"
        ? router.pathname === path
        : router.pathname.match(new RegExp(`^${path}($|/.*)`));
    return matched
      ? " text-gray-800 hover:text-lightBlue-600 bg-white rounded-md shadow"
      : " text-Gray-500 hover:text-blueGray-500";
  };
  const logout = async () => {
    setIsCheck(true)
    try{
      await accountService.logout();
      setIsCheck(false)
    }catch(e){
      toastr.error('Logout fail!!!')
      setIsCheck(false)
    }
    await router.replace("/");
  };
  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow bg-black bg-opacity-80 flex flex-wrap items-center justify-between relative md:w-72 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto text-gray-500">
          {/* Toggler */}
          <button
            className="cursor-pointer text-blue-800 opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <div className="md:block text-left text-blueGray-600 mr-0 inline-block whitespace-nowrap uppercase font-bold text-xl text-white p-5 px-0 border-b-2">
            Check duplicate
          </div>
          <div className="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ">
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {menuItem.map((item, index) => (
                <li className="items-center" key={index}>
                  <Link href={item.link}>
                    <a
                      href="#pablo"
                      className={
                        "text-sm p-3 font-bold flex items-center" +
                        getSidebarNavItemLinkClass(item.link)
                      }
                    >
                      <div className="bg-gradient-to-r from-pink-500 to-yellow-500 rounded-md p-1 mr-3 ">
                        {item.icon}
                      </div>
                      {item.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
            <div
              className="mt-auto px-3 py-4 rounded-lg bg-black font-semibold text-white flex justify-center items-center"
              style={{ cursor: "pointer" }}
              onClick={() => logout()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-logout mr-1"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ffffff"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M7 12h14l-3 -3m0 6l3 -3" />
              </svg>
              Logout
            </div>
          </div>
        </div>
      </nav>
      {isCheck && <AnimationLoad />}
    </>
  );
}

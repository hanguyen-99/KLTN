import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { accountService } from "../../package/RestConnector";
import AnimationLoad from "../Animation/AnimationLoad";

const menuItem = [
  {
    link: "/document",
    label: "Document",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-report"
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
        <path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
        <path d="M18 14v4h4" />
        <path d="M18 11v-4a2 2 0 0 0 -2 -2h-2" />
        <rect x={8} y={3} width={6} height={4} rx={2} />
        <circle cx={18} cy={18} r={4} />
        <path d="M8 11h4" />
        <path d="M8 15h3" />
      </svg>
    ),
  },
  {
    link: "/profile",
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

  const getSidebarClass = (path) => {
    const matched =
      path === "admin"
        ? router.pathname === path
        : router.pathname.match(new RegExp(`^${path}($|/.*)`));
    return matched
      ? " text-gray-800 hover:text-lightBlue-600 bg-white rounded-md shadow"
      : " text-white hover:text-blueGray-500";
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
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link href="/">
                    <a
                      href="#pablo"
                      className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    >
                      Check duplicate
                    </a>
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {menuItem.map((item, index) => (
                <li className="items-center" key={index}>
                  <Link href={item.link}>
                    <a
                      href="#pablo"
                      className={
                        "text-sm p-3 font-bold flex items-center" +
                        getSidebarClass(item.link)
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

import React, { useEffect, useState } from "react";
import Image from "next/image";

const Header = () => {
  const [title, setTitle] = useState(null);
  useEffect(() => {
    if (process.browser) {
      setTitle(document.title);
    }
  });
  return (
    <nav className="w-full bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center px-20 py-4 h-20 border-b-2 border-gray-400">
      <div className="w-full h-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap">
        {/* Brand */}
        <a
          className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-xl uppercase lg:inline-block font-semibold cursor-default"
          href="#pablo"
          onClick={(e) => e.preventDefault()}
        >
          {title}
        </a>
        {/* Form */}
        {/* <form className="md:flex flex-row flex-wrap items-center lg:ml-auto mr-3">
          <div className="relative flex w-full flex-wrap items-stretch">
            <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search here..."
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white  rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
            />
          </div>
        </form> */}
        {/* User */}
        {/* <ul className="flex-col md:flex-row list-none items-center md:flex relative">
          <div className="text-blueGray-500 block relative">
            <div className="items-center flex">
              <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-r from-green-400 to-blue-500">
                <Image
                  alt="..."
                  className="w-full align-middle rounded-full "
                  src="/static/img/avt.jpg"
                  width={44}
                  height={44}
                />
              </span>
            </div>
          </div>
        </ul> */}
      </div>
    </nav>
  );
};

export default Header;

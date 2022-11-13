import React, { useState, useEffect } from "react";
import Image from "next/image";
import moment from "moment";
import toastr from "toastr";
import { accountService } from "../../RestConnector";
import AnimationLoad from "../../../components/Animation/AnimationLoad";

const ViewProfileUserModal = ({ style, value, closeModal, changeBlock, changeUnlock }) => {
  const [isCheck, setIsCheck] = useState(false);
  const [isBlock, setIsBlock] = useState(value.isActive);

  useEffect(() => {
    setIsBlock(value.isActive);
  }, [value]);
  const lockAccount = async () => {
    const { id } = value;
    if (id) {
      setIsCheck(true);
      try {
        const dataAPI = await accountService.lockAccount(id);
        toastr.success("Lock account success");
        setIsCheck(false);
        setIsBlock(false);
        changeBlock(id);
      } catch (e) {
        let msg;
        switch (e.code) {
          default: {
            msg = e.message;
          }
        }
        setIsCheck(false);
        toastr.error("Lock account fail!");
      }
    }
  };

  const unLockAccount = async () => {
    const { id } = value;
    if (id) {
      setIsCheck(true);
      try {
        await accountService.unLockAccount(id);
        toastr.success("Unlock account success");
        setIsCheck(false);
        setIsBlock(true);
        changeUnlock(id);
      } catch (e) {
        let msg;
        switch (e.code) {
          default: {
            msg = e.message;
          }
        }
        setIsCheck(false);
        toastr.error("Unlock account fail!");
      }
    }
  };
  return (
    <>
      <div
        className={
          "fixed p-0 top-0 left-0 right-0 bottom-0 flex justify-center w-full h-full bg-black bg-opacity-50 antialiased overflow-x-hidden overflow-y-auto " +
          (style ? "opacity-1 visible z-10" : "opacity-0 invisible z-0")
        }
        style={{ transition: "all 0.4s" }}
      >
        <div className="my-10 mx-auto w-auto relative min-w-1/2 bg-white border-gray-300 shadow-xl box-border rounded-lg overflow-hidden">
          <div className="flex justify-between items-center px-6 border-b-2 py-3">
            <div className="text-2xl font-semibold text-gray-700">
              Information User
            </div>
            <div
              className="text-xl font-semibold text-gray-700 cursor-pointer"
              onClick={closeModal}
            >
              x
            </div>
          </div>
          <div
            className="w-full p-6 overflow-y-auto flex flex-col items-center justify-center"
            style={{ height: "90%" }}
          >
            <div className="shadow-2xl p-10 min-w-3/4">
              <div className="flex items-center">
                <Image
                  alt="..."
                  className="w-full align-middle rounded-full object-cover"
                  src={
                    value.avatar
                      ? value.avatar
                      : "https://res.cloudinary.com/ddxkbr7ma/image/upload/v1641305022/images/qmlkihv5sjhqihnq39y3.jpg"
                  }
                  width={150}
                  height={150}
                />
                <div className="ml-5">
                  <div className="mt-3 font-bold text-gray-600 text-lg">
                    {value.firstName &&
                      value.firstName.concat(" ", value.lastName)}
                  </div>
                  <div className="">{value.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 box-border mt-3">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Id
                  </label>
                  <input
                    value={value.id}
                    className="appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm"
                    type="text"
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Gender
                  </label>
                  <input
                    value={value.gender}
                    className="appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm"
                    type="text"
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 box-border mt-3">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date of birth
                  </label>
                  <input
                    value={moment(value.dob).format("YYYY-MM-DD")}
                    className="appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm"
                    type="text"
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    User code
                  </label>
                  <input
                    value={value.userCode}
                    className="appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm"
                    type="text"
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 box-border mt-3">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status
                  </label>
                  <input
                    value={isBlock ? "Active" : "In Active"}
                    className="appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm"
                    type="text"
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Phone number
                  </label>
                  <input
                    value={value.phoneNumber}
                    className="appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm"
                    type="text"
                    disabled
                  />
                </div>
                <div className="flex">
                  {isBlock ? (
                    <button
                      className="flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold disabled:cursor-not-allowed mr-2"
                      onClick={() => lockAccount()}
                    >
                      Lock account
                    </button>
                  ) : (
                    <button
                      className="flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold disabled:cursor-not-allowed mr-2"
                      onClick={() => unLockAccount()}
                    >
                      Unlock account
                    </button>
                  )}
                  <button
                    className="flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold disabled:cursor-not-allowed"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isCheck && <AnimationLoad />}
    </>
  );
};

export default ViewProfileUserModal;

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import UserGuest from "../../layouts/UserGuest";
import AnimationLoad from "../../components/Animation/AnimationLoad";
import { accountService } from "../../package/RestConnector";

const ConfirmAccount = () => {
  const [isCheck, setIsCheck] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isReActive, setIsReActive] = useState(false);
  const router = useRouter();
  const dataRouter = router.query;
  useEffect(() => {
    activeNewAccount();
  }, [dataRouter]);

  const activeNewAccount = async () => {
    const { id, uuid } = router.query;
    setIsCheck(true);
    if ((id, uuid)) {
      try {
        await accountService.activeAccount(id, uuid);
        setIsCheck(false);
        setIsActive(true);
      } catch (e) {
        let msg;
        switch (e.code) {
          default: {
            msg = e.message;
          }
        }
        setIsCheck(false);
        setIsActive(false);
        setIsReActive(true);
      }
    }
  };
  return (
    <>
      <Head>
        <title>Confirm account</title>
      </Head>
      {isActive && (
        <div className="w-full max-w-md relative z-10">
          <div className="p-20 bg-success flex items-center flex-col">
            <div className="w-20 h-20 rounded-full bg-transparent border-2 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-check"
                width={40}
                height={40}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ffffff"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12l5 5l10 -10" />
              </svg>
            </div>
            <div className="text-white text-2xl font-semibold mt-2">
              SUCCESS
            </div>
          </div>
          <div className="bg-white p-10 flex justify-center flex-col items-center">
            <div className="text-center text-gray-600">
              Congratulations, your account has been activated now you can log
              in.
            </div>
            <Link href="/login">
              <a
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold inline-block w-1/3 mt-5"
                href="#"
              >
                Login
              </a>
            </Link>
          </div>
        </div>
      )}
      {isReActive && (
        <div className="w-full max-w-md relative z-10">
          <div className="p-20 bg-success flex items-center flex-col">
            <div className="w-20 h-20 rounded-full bg-transparent border-2 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-check"
                width={40}
                height={40}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ffffff"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12l5 5l10 -10" />
              </svg>
            </div>
            <div className="text-white text-2xl font-semibold mt-2">
              SUCCESS
            </div>
          </div>
          <div className="bg-white p-10 flex justify-center flex-col items-center">
            <div className="text-center text-gray-600">
              Congratulations, your account has been activated now you can log
              in.
            </div>
            <Link href="/login">
              <a
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold inline-block w-1/3 mt-5"
                href="#"
              >
                Login
              </a>
            </Link>
          </div>
        </div>
      )}
      {isCheck && <AnimationLoad />}
    </>
  );
};

ConfirmAccount.getLayout = function getLayout(page) {
  return <UserGuest>{page}</UserGuest>;
};

export default ConfirmAccount;

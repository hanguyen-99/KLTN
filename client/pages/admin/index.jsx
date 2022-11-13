import React, { useEffect, useState } from "react";
import Head from "next/head";

import { AdminLayout } from "../../layouts/Admin";
import { accountService } from "../../package/RestConnector";
import AnimationLoad from "../../components/Animation/AnimationLoad";

export default function AdminDashboard() {
  const [dataDashboard, setDataDashboard] = useState([]);
  const [isGetData, setIsGetData] = useState(false);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    setIsGetData(true);
    try {
      const data = await accountService.getDashboard();
      setDataDashboard(data.data);
      setIsGetData(false);
    } catch (err) {
      let msg;
      switch (err.code) {
        default: {
          msg = err.message;
        }
      }
      setIsGetData(false);
    }
  };
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="py-10 px-20 grid grid-cols-3 gap-5">
        <div className="px-4 py-8 rounded shadow-md bg-gray-200 flex justify-between">
          <div className="w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-user-check"
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
              <circle cx={9} cy={7} r={4} />
              <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              <path d="M16 11l2 2l4 -4" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-xl">Number of users active</div>
            <div className="text-right mt-3 text-lg">
              {dataDashboard.countUserActive}
            </div>
          </div>
        </div>
        <div className="px-4 py-8 rounded shadow-md bg-gray-200 flex justify-between">
          <div className="w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-user-exclamation"
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
              <circle cx={9} cy={7} r={4} />
              <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              <line x1={19} y1={7} x2={19} y2={10} />
              <line x1={19} y1={14} x2={19} y2="14.01" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-xl">Number of user inactive</div>
            <div className="text-right mt-3 text-lg">
              {dataDashboard.countUserNotActive}
            </div>
          </div>
        </div>
        <div className="px-4 py-8 rounded shadow-md bg-gray-200 flex justify-between">
          <div className="w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-files"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              strokeWidth={2}
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
          </div>
          <div>
            <div className="font-medium text-xl">Number of document</div>
            <div className="text-right mt-3 text-lg">
              {dataDashboard.countDocument}
            </div>
          </div>
        </div>
      </div>
      {isGetData && <AnimationLoad />}
    </>
  );
}

AdminDashboard.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

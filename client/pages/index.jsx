import React, { useEffect } from "react";
import UserGuest from "../layouts/UserGuest";
import { useRouter } from "next/router";


const IndexPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="h-full flex items-center justify-center relative z-10">
      <div className="h-1/4 min-w-1/4 p-10 flex items-center justify-center bg-white rounded-md shadow-md flex-col ">
        <div className="flex gap-3"><div
          style={{ borderTopColor: "transparent" }}
          className="w-16 h-16 border-4 border-blue-500 border-double rounded-full animate-spin"
        />
        <div
          style={{ borderTopColor: "transparent" }}
          className="w-16 h-16 border-4 border-yellow-500 border-double rounded-full animate-spin"
        />
        <div
          style={{ borderTopColor: "transparent" }}
          className="w-16 h-16 border-4 border-red-500 border-double rounded-full animate-spin"
        />
        <div
          style={{ borderTopColor: "transparent" }}
          className="w-16 h-16 border-4 border-green-500 border-double rounded-full animate-spin"
        />
        <div
          style={{ borderTopColor: "transparent" }}
          className="w-16 h-16 border-4 border-pink-500 border-double rounded-full animate-spin"
        /></div>
        <div className="font-bold text-xl mt-7 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500">Page Loading...Please Wait</div>
      </div>
    </div>
  );
};
IndexPage.getLayout = function getLayout(page) {
  return <UserGuest>{page}</UserGuest>;
};
export default IndexPage;


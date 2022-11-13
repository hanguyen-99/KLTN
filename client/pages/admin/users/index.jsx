import React, { useMemo, useEffect, useState } from "react";
import Head from "next/head";
import { useTable, usePagination, useFilters,useGlobalFilter } from "react-table";
import AnimationLoad from "../../../components/Animation/AnimationLoad";
import { AdminLayout } from "../../../layouts/Admin";
import { ColumnFilter } from "../../../package/account/columns/ColumnFilter";
import { COLUMN_ACOUNT } from "../../../package/account/columns/Columns";
import ViewProfileUserModal from "../../../package/account/component/ViewProfileUserModal";
import { accountService } from "../../../package/RestConnector";

export default function ManagerUsers() {
  const [listUser, setListUser] = useState([]);
  const [isShowInfo, setIsShowInfo] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);
  const [isGetData, setIsGetData] = useState(false);
  const columns = useMemo(() => COLUMN_ACOUNT, []);
  const data = useMemo(() => listUser, [listUser]);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsGetData(true);
    try {
      const data = await accountService.getListUser();
      setListUser(data.data);
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

  const getProfileInfo = (data) => {
    setDataEdit(data.row.original);
    setIsShowInfo(true);
  };

  const reNewData = (id) =>{
    const newList = [...listUser]
    const selectIndex = listUser.findIndex((item)=>item.id === id)
    newList[selectIndex].isActive = false
    setListUser(newList)
  }

  const reNewDataUnlock = (id) =>{
    const newList = [...listUser]
    const selectIndex = listUser.findIndex((item)=>item.id === id)
    newList[selectIndex].isActive = true
    setListUser(newList)
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter
  } = tableInstance;


  return (
    <>
    <Head>
        <title>Manager account</title>
      </Head>
      <div className="px-20 py-10">
        <div className="p-3 bg-white rounded-md shadow">
          <div className="mb-4 text-2xl font-semibold">List account</div>
          <ColumnFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <table
            className=" w-full table text-gray-600 border-separate space-y-6 text-sm"
            {...getTableProps()}
          >
            <thead className="bg-gray-400 text-gray-900">
              {headerGroups.map((headerGroup, index) => (
                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      className="p-3"
                      key={index}
                      {...column.getHeaderProps()}
                    >
                      {column.render("Header")}
                      {/* <div>{column.render("Filter")}</div> */}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-gray-900" {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr className="bg-gray-300" key={i} {...row.getRowProps()}>
                    {row.cells.map((cell, index) => {
                      return (
                        <td
                          onClick={() => getProfileInfo(cell)}
                          className="p-3 text-center"
                          key={index}
                          {...cell.getCellProps()}
                          style={{ cursor: "pointer" }}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination flex items-center justify-center mt-3">
            <button
              className="py-3 px-5 bg-gradient-to-r from-green-400 to-blue-500 disabled:opacity-50 disabled:cursor-default border-2 rounded-l-lg ro border-blue-500"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {"First"}
            </button>{" "}
            <button
              className="py-3 px-5 bg-gradient-to-r from-green-400 to-blue-500 disabled:opacity-50 disabled:cursor-default border-t-2 border-b-2 border-r-2 border-blue-500"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {"<"}
            </button>{" "}
            <div className="border-t-2 border-b-2 border-blue-300">
              <span className="py-3 border-r-2 border-blue-300 px-3">
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{" "}
              </span>
              <span className="py-3 border-r-2 border-blue-300 px-3">
                Go to page:{" "}
                <input
                  type="number"
                  className="border-2 border-blue-300 pl-2"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(page);
                  }}
                  style={{ width: "100px" }}
                />
              </span>{" "}
              <select
                className="p-3 focus:outline-none"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="py-3 px-5 bg-gradient-to-r from-green-400 to-blue-500 disabled:opacity-50 disabled:cursor-default border-t-2 border-b-2 border-l-2 border-blue-500"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {">"}
            </button>{" "}
            <button
              className="py-3 px-5 bg-gradient-to-r from-green-400 to-blue-500 disabled:opacity-50 disabled:cursor-default border-2 rounded-r-lg ro border-blue-500"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {"Last"}
            </button>{" "}
          </div>
        </div>
      </div>
      {dataEdit && (
        <ViewProfileUserModal
          style={isShowInfo}
          value={dataEdit}
          closeModal={() => setIsShowInfo(false)}
          changeBlock={(id) => reNewData(id)}
          changeUnlock={(id)=> reNewDataUnlock(id)}
        />
      )}

      {isGetData && <AnimationLoad />}
    </>
  );
}

ManagerUsers.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

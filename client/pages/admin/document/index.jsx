import React, { useMemo, useEffect, useState } from "react";
import Head from "next/head";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import toastr from "toastr";

import { COLUMN_DOCUMENT } from "../../../package/document/columns/ColumnDocument";
import { AdminLayout } from "../../../layouts/Admin";
import { documentService } from "../../../package/RestConnector";
import ViewFileDetail from "../../../package/account/component/ViewFileDetail";
import AnimationLoad from "../../../components/Animation/AnimationLoad";
import { ColumnFilter } from "../../../package/account/columns/ColumnFilter";

const RateSchema = Yup.object().shape({
  rate: Yup.number()
    .required("rate required!")
    .typeError("you must specify a number")
    .min(60, "Min value 60.")
    .max(100, "Max value 100."),
  type: Yup.string().required("type required"),
});

const ManageDocument = () => {
  const [listDocument, setListDocument] = useState([]);
  const [isShowInfo, setIsShowInfo] = useState(false);
  const [isGetData, setIsGetData] = useState(false);
  const [dataEdit, setDataEdit] = useState([]);
  const [isPercent, setIsPercent] = useState(false);
  const [dataRateEdit, setDataRateEdit] = useState(null);
  const [rate, setRate] = useState([]);

  const columns = useMemo(() => COLUMN_DOCUMENT, []);
  const data = useMemo(() => listDocument, [listDocument]);
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );

  useEffect(() => {
    getData();
    getRate();
  }, []);

  const getData = async () => {
    setIsGetData(true);
    try {
      const data = await documentService.getListDocumentByAdmin();
      const dataDoc = data.data;
      dataDoc.sort(
        (x, y) => new Date(y.createdStamp) - new Date(x.createdStamp),
        0
      );

      setListDocument(dataDoc);
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

  const getProfileInfo = async (data) => {
    await getDetailFile(data.row.original.documentId);
    setIsShowInfo(true);
  };

  const getRate = async () => {
    try {
      const data = await documentService.getRate();
      const dataRate = data.data;
      setRate(dataRate);
    } catch (err) {
      let msg;
      switch (err.code) {
        default: {
          msg = err.message;
        }
      }
    }
  };

  const getDetailFile = async (id) => {
    setIsGetData(true);
    try {
      const data = await documentService.getDetailDocument(id);
      setDataEdit(data.data);
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

  const handleRate = async (values, actions) => {
    const { setSubmitting } = actions;
    setSubmitting(true);
    if (dataRateEdit) {
      try {
        const res = await documentService.updateRate(values);
        toastr.success("Update success!");
        const newList = [...rate]
        const dataFind = rate.findIndex((x) => x.id === res.data.id);
        newList[dataFind].rate = res.data.rate;
        setRate(newList)
      } catch (e) {
        toastr.error("Update fail!");
        setSubmitting(false);
      }
    } else {
      try {
        const res = await documentService.createRate(values);
        toastr.success("Create success!");
        getRate();
      } catch (e) {
        toastr.error("Create fail!");
        setSubmitting(false);
      }
    }
  };

  const setDelete = async (id) => {
    try {
      const res = await documentService.deleteRate(id);
      toastr.success("Delete success");
      const listRate = rate.filter((x) => x.id !== id);
      setRate(listRate);
    } catch (e) {
      toastr.error("Delete fail!");
    }
  };

  const setEdit = async (data) => {
    setDataRateEdit(data);
  };

  const resetForm = () => {
    setDataRateEdit(null);
  };

  const SetRateModal = () => {
    return (
      <>
      <div
        className="fixed p-0 top-0 left-0 right-0 bottom-0 inline-flex justify-center w-full h-full  bg-black bg-opacity-50 z-10"
        style={{ transition: "all 0.4s" }}
      >
        <div className="w-2/3 mt-16">
          <div className="w-full flex flex-col p-5 bg-white">
            <div className="flex justify-between mb-4">
              <div className="font-semibold text-xl">Set rate</div>
              <svg
                className="w-6 h-6 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setIsPercent(false)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="w-full overflow-y-auto flex">
              <div className="w-1/2">
                <table className="w-full table text-gray-600 border-separate space-y-6 text-sm">
                  <thead className="bg-gray-400 text-gray-900">
                    <tr>
                      <th className="p-3">Rate</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">action</th>
                    </tr>
                  </thead>
                  {rate.length > 0 ? (
                    <tbody className="bg-gray-300 text-gray-900">
                      {rate.map((data, index) => (
                        <tr key={index}>
                          <td className="p-3 text-center">{data.rate}%</td>
                          <td className="p-3 text-center">{data.type}</td>
                          <td className="p-3 text-center cursor-pointer">
                            <span
                              className="underline mr-2"
                              onClick={() => setDelete(data.id)}
                            >
                              delete
                            </span>
                            <span
                              className="underline"
                              onClick={() => setEdit(data)}
                            >
                              edit
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <div className="w-full text-md">No data</div>
                  )}
                </table>
              </div>
              <div className="w-1/2">
                <Formik
                  initialValues={{
                    rate: dataRateEdit ? dataRateEdit.rate : "",
                    type: dataRateEdit ? dataRateEdit.type : rate.find((x) => x.type === "DOCUMENT")? "SENTENCE": "DOCUMENT",
                  }}
                  validationSchema={RateSchema}
                  onSubmit={handleRate}
                >
                  {(props) => (
                    <div className="w-full">
                      <Form
                        onSubmit={props.handleSubmit}
                        className="bg-white pl-8"
                      >
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Rate
                          </label>
                          <div className="relative">
                            <Field
                              name="rate"
                              className={
                                "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                                (props.errors.rate && props.touched.rate
                                  ? "border-red-500"
                                  : "border-green-500")
                              }
                              type="number"
                            />
                            {props.errors.rate && props.touched.rate ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-alert-triangle absolute right-2 top-1/2"
                                width={22}
                                height={22}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="#ff2825"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ transform: "translateY(-50%)" }}
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <path d="M12 9v2m0 4v.01" />
                                <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                              </svg>
                            ) : null}
                          </div>

                          {props.errors.rate && props.touched.rate ? (
                            <div className="text-red-600 text-sm mt-2 flex items-center">
                              {props.errors.rate}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            type
                          </label>
                          <div className="relative">
                            {dataRateEdit ? (
                              <Field
                                name="type"
                                className={
                                  "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                                  (props.errors.type && props.touched.type
                                    ? "border-red-500"
                                    : "border-green-500")
                                }
                                as="select"
                              >
                                <option value="DOCUMENT">Document</option>
                                <option value="SENTENCE">Sentence</option>
                              </Field>
                            ) : (
                              <Field
                                name="type"
                                className={
                                  "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                                  (props.errors.type && props.touched.type
                                    ? "border-red-500"
                                    : "border-green-500")
                                }
                                as="select"
                                disabled={rate.length===2}
                              >
                                {!rate.find((x) => x.type === "DOCUMENT") && (
                                  <option value="DOCUMENT">Document</option>
                                )}
                                {!rate.find((x) => x.type === "SENTENCE") && (
                                  <option value="SENTENCE">Sentence</option>
                                )}
                              </Field>
                            )}

                            {props.errors.type && props.touched.type ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-alert-triangle absolute right-2 top-1/2"
                                width={22}
                                height={22}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="#ff2825"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ transform: "translateY(-50%)" }}
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <path d="M12 9v2m0 4v.01" />
                                <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                              </svg>
                            ) : null}
                          </div>

                          {props.errors.type && props.touched.type ? (
                            <div className="text-red-600 text-sm mt-2 flex items-center">
                              {props.errors.type}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex items-center">
                          {dataRateEdit?<button
                            className="flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold disabled:cursor-not-allowed mr-3"
                            type="submit"
                            disabled={
                              props.isSubmitting ||
                              !props.isValid
                            }
                          >
                            {props.isSubmitting && (
                              <svg
                                className="animate-spin mr-2 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx={12}
                                  cy={12}
                                  r={10}
                                  stroke="currentColor"
                                  strokeWidth={4}
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                            )}
                            Save
                          </button>:<button
                            className="flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold disabled:cursor-not-allowed mr-3"
                            type="submit"
                            disabled={
                              props.isSubmitting ||
                              !props.isValid ||
                              rate.length === 2
                            }
                          >
                            {props.isSubmitting && (
                              <svg
                                className="animate-spin mr-2 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx={12}
                                  cy={12}
                                  r={10}
                                  stroke="currentColor"
                                  strokeWidth={4}
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                            )}
                            Create
                          </button>}
                          
                          {dataRateEdit && (
                            <button
                              className="flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold disabled:cursor-not-allowed"
                              onClick={() => resetForm()}
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </Form>
                    </div>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      
    );
  };

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
    setGlobalFilter,
  } = tableInstance;
  return (
    <>
    <Head>
        <title>Manager document</title>
      </Head>
      <div className="px-20 py-10">
        <div className="p-3 bg-white rounded-md shadow">
          <div className="mb-4  flex justify-between">
            <div className="text-2xl font-semibold">List document</div>
            <div
              className="flex p-3 items-center bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 cursor-pointer rounded-md relative"
              style={{ cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-file-plus"
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
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                <line x1={12} y1={11} x2={12} y2={17} />
                <line x1={9} y1={14} x2={15} y2={14} />
              </svg>
              <div
                className="ml-2 font-medium"
                onClick={() => setIsPercent(true)}
              >
                Set rate check
              </div>
            </div>
          </div>
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
      <ViewFileDetail
        style={isShowInfo}
        value={dataEdit}
        closeModal={() => setIsShowInfo(false)}
      />
      {isPercent && <SetRateModal />}
      {isGetData && <AnimationLoad />}
    </>
  );
};

ManageDocument.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ManageDocument;

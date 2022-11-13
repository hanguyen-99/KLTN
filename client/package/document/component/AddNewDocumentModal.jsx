import { Form, Formik, Field } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import toastr from "toastr";

import { documentService } from "../../RestConnector";
import SinglePdfPage from "./SinglePdf";
import AnimationCheckDoc from "./AnimationCheckDoc";
import CompareFileModal from "./CompareFileModal";
import SameModal from "./SameModal";

const AddNewDocumentModal = ({ closeModal, style, reloadData }) => {
  const [fileDocumentPriview, setFileDocumentPriview] = useState([]);
  const [isSimilar, setIsSimilar] = useState(false);
  const [isSame, setIsSame] = useState(false);
  const [dataSame, setDataSame] = useState(null);
  const [dataSimilar, setDataSimilar] = useState(null);
  const handleUpload = async (values, actions) => {
    const { setSubmitting, resetForm } = actions;
    const { document, title, note } = values;
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("multipartFile", document);
      data.append("title", title);
      data.append("note", note);
      data.getAll("multipartFile", "title", "note");
      // data.append("file",document)
      const dataAPI = await documentService.uploadDocument(data);
      if (dataAPI.data === null) {
        setFileDocumentPriview([]);
        setSubmitting(false);
        resetForm();
        reloadData();
        closeModal();
        toastr.success("upload success");
      } else {
        if (dataAPI.data.rate === 100) {
          console.log("same");
          setDataSame(dataAPI.data);
          setIsSame(true);
        } else {
          console.log("data-same", dataAPI.data);
          setDataSimilar(dataAPI.data);
          setIsSimilar(true);
        }
      }
    } catch (e) {
      let msg;
      switch (e.code) {
        default: {
          msg = e.message;
        }
      }
      toastr.error("Upload fail!");
      setSubmitting(false);
    }
  };

  const uploadSchema = Yup.object().shape({
    title: Yup.string().required("Title required"),
    // note: Yup.string().required("Note required"),
    // mark: Yup.number()
    //   .required("Mark required")
    //   .typeError("you must specify a number")
    //   .min(0, "Min value 0.")
    //   .max(10, "Max value 10."),
    document: Yup.mixed().required("Document required"),
  });

  const previewPDF = (file) => {
    if (file) {
      setFileDocumentPriview(URL.createObjectURL(file));
    }
  };

  const revmoveDocument = (resetForm) => {
    setFileDocumentPriview([]);
    resetForm();
  };

  return (
    <>
      <div
        className={
          "fixed p-0 top-0 left-0 right-0 bottom-0 flex justify-center w-full h-full  bg-black bg-opacity-50 antialiased overflow-x-hidden overflow-y-auto " +
          (style ? "opacity-100 visible z-10" : "opacity-0 invisible z-0")
        }
        style={{ transition: "all 0.4s" }}
      >
        <div className="my-10 mx-auto w-auto relative lg:max-w-xl lg:min-w-1/2">
          <div className="border-gray-300 shadow-xl box-border w-full">
            <div className="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg">
              <p className="font-semibold text-gray-800">Upload document</p>
              <svg
                className="w-6 h-6 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => closeModal()}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="w-100 p-6 bg-white rounded-bl-lg rounded-br-lg">
              <Formik
                initialValues={{
                  document: "",
                  title: "",
                  note: "",
                }}
                validationSchema={uploadSchema}
                onSubmit={handleUpload}
              >
                {(props) => (
                  <Form onSubmit={props.handleSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="document"
                      >
                        Document
                      </label>
                      {fileDocumentPriview.length === 0 ? (
                        <div>
                          <div className="relative h-40 rounded-lg border-dashed border-2 border-gray-200 bg-white flex justify-center items-center hover:cursor-pointer">
                            <div className="absolute">
                              <div className="flex flex-col items-center ">
                                {" "}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-cloud-upload"
                                  width={64}
                                  height={64}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#9e9e9e"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
                                  <polyline points="9 15 12 12 15 15" />
                                  <line x1={12} y1={12} x2={12} y2={21} />
                                </svg>{" "}
                                <span className="block text-gray-400 font-normal">
                                  Attach you files here
                                </span>{" "}
                                <span className="block text-gray-400 font-normal">
                                  or
                                </span>{" "}
                                <span className="block text-blue-400 font-normal">
                                  Browse files
                                </span>{" "}
                              </div>
                            </div>{" "}
                            <input
                              id="document"
                              name="document"
                              type="file"
                              onChange={(event) => {
                                props.setFieldValue(
                                  "document",
                                  event.currentTarget.files[0]
                                );
                                if (event.currentTarget.files[0]) {
                                  previewPDF(event.currentTarget.files[0]);
                                }
                              }}
                              className="h-full w-full opacity-0"
                              accept="application/pdf"
                            />
                          </div>
                          {props.errors.document && props.touched.document ? (
                            <div className="text-red-600 text-sm mt-2 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-alert-triangle mr-2"
                                width={22}
                                height={22}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="#ff2825"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <path d="M12 9v2m0 4v.01" />
                                <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                              </svg>
                              {props.errors.document}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div id="preview-before-upload" className="border-2">
                          <div className="p-3 bg-white h-full w-full flex">
                            <div className="w-1/2 border shadow-md pr-3 overflow-hidden">
                              <SinglePdfPage
                                pdf={fileDocumentPriview}
                                revmoveDocument={() =>
                                  revmoveDocument(props.resetForm)
                                }
                              />
                            </div>
                            <div className="w-1/2 pl-3">
                              <div className="mb-4">
                                <label
                                  className="block text-gray-700 text-sm font-bold mb-2"
                                  htmlFor="title"
                                >
                                  Title
                                </label>
                                <div className="relative">
                                  <Field
                                    id="title"
                                    name="title"
                                    placeholder="Báo cáo abc"
                                    className={
                                      "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                                      (props.errors.title && props.touched.title
                                        ? "border-red-500"
                                        : "border-green-500")
                                    }
                                    type="text"
                                  />
                                  {props.errors.title && props.touched.title ? (
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

                                {props.errors.title && props.touched.title ? (
                                  <div className="text-red-600 text-sm mt-2 flex items-center">
                                    {props.errors.title}
                                  </div>
                                ) : null}
                              </div>
                              <div className="mb-4">
                                <label
                                  className="block text-gray-700 text-sm font-bold mb-2"
                                  htmlFor="note"
                                >
                                  Note
                                </label>
                                <Field
                                  name="note"
                                  placeholder="Báo cáo abc"
                                  className="appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm"
                                  as="textarea"
                                  rows={4}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      className="flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold disabled:cursor-not-allowed"
                      type="submit"
                      disabled={props.isSubmitting || !props.isValid}
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
                      Upload
                    </button>
                    <AnimationCheckDoc style={props.isSubmitting} />
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      {dataSimilar && (
        <CompareFileModal
          style={isSimilar}
          value={dataSimilar}
          closeModal={() => setIsSimilar(false)}
        />
      )}
      {dataSame && (
        <SameModal
          style={isSame}
          value={dataSame}
          closeModal={() => setIsSame(false)}
        />
      )}
    </>
  );
};

export default AddNewDocumentModal;

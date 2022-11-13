import React, { useState } from "react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import toastr from "toastr";
import { documentService } from "../../RestConnector";

const uploadSchema = Yup.object().shape({
  title: Yup.string().required("Title required"),
});

const PreviewModal = ({ document, toggle, setNewDoc }) => {
  const handleUpdateDocument = async (values, actions) => {
    const id = document.documentId;
    const { setSubmitting } = actions;
    setSubmitting(true);
    if (id) {
      try {
        await documentService.updateDocument(id, values);
        toastr.success("Update document success");
        setNewDoc(id, values.title, values.note);
        setSubmitting(false);
      } catch (err) {
        toastr.error("Update document fail");
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed p-0 top-0 left-0 right-0 bottom-0 flex justify-center w-full h-full  bg-black bg-opacity-50 antialiased overflow-x-hidden overflow-y-auto">
      <div className="my-10 min-w-1/3 h-5/6">
        <div className="border-gray-300 shadow-xl box-border w-full">
          <div className="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg">
            <p className="font-semibold text-gray-800">Detail Document</p>
            <svg
              className="w-6 h-6 cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => toggle()}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <div className="h-full w-full flex flex-col">
          <div className="bg-white flex">
            <div className="w-full p-5">
              <Formik
                initialValues={{
                  title: document.title,
                  note: document.note,
                }}
                validationSchema={uploadSchema}
                onSubmit={handleUpdateDocument}
              >
                {(props) => (
                  <Form onSubmit={props.handleSubmit}>
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
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
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
                      Save
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;

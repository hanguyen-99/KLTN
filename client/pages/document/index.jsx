import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Form, Formik, Field } from "formik";

import { UserLayout } from "../../layouts/User";
import DocumentFile from "../../package/document/component/Document";
import AddNewDocumentModal from "../../package/document/component/AddNewDocumentModal";
import { documentService } from "../../package/RestConnector";

const Document = () => {
  const [isShowAddNewDocument, setIsShowAddNewDocument] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [document, setDocument] = useState([]);
  const [documentSave,setDocumentSave] = useState([])
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    setFlag(false);
    try {
      const data = await documentService.getDocument();
      const dataDoc = data.data;
      dataDoc.sort(
        (x, y) => new Date(y.createdStamp) - new Date(x.createdStamp),
        0
      );
      setDocument(dataDoc);
      setDocumentSave(dataDoc)
      setFlag(true);
    } catch (err) {
      let msg;
      switch (err.code) {
        default: {
          msg = err.message;
        }
      }
    }
  };

  const handleSearch = (values) =>{
    const { key } = values
    if(key!==''){
      const search = documentSave.filter(x=> x.title === key)
      if(search.length>0){
        setDocument(search)
      }
      else{
        setDocument(search)
      }
    }
    else{
      setDocument(documentSave)
    }
  }

  const ModalSearch = () => {
    return (
      <div
        id="modal-search"
        className="fixed p-0 top-0 left-0 right-0 bottom-0 inline-flex justify-center w-full h-full  bg-black bg-opacity-50 z-10"
        style={{ transition: "all 0.4s" }}
      >
        <div className="w-2/3 mt-5">
          <div className="w-full flex flex-col p-5 bg-white">
            <div className="flex justify-between mb-4">
              <div className="font-semibold text-xl">Search</div>
              <svg
                className="w-6 h-6 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setIsSearch(false)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <Formik
              initialValues={{
                key: "",
              }}
              onSubmit={handleSearch}
            >
              {(props) => (
                <Form className="w-full" onSubmit={props.handleSubmit}>
                  <div className="w-full relative">
                    <Field
                      type="text"
                      className="appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm"
                      name="key"
                      id="key"
                    />
                    <button
                      className="absolute top-1/2 right-2 cursor-pointer"
                      type="submit"
                      style={{ transform: "translateY(-50%)" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-search"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#000000"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx={10} cy={10} r={7} />
                        <line x1={21} y1={21} x2={15} y2={15} />
                      </svg>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Document</title>
      </Head>
      <div className="px-20 py-10">
        <div className="shadow-md p-3 bg-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="font-medium text-2xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              List document
            </div>
            <div className="flex items-center">
              <div
                className="flex p-3 items-center bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 cursor-pointer rounded-md relative mr-3"
                onClick={() => setIsSearch(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-search"
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
                  <circle cx={10} cy={10} r={7} />
                  <line x1={21} y1={21} x2={15} y2={15} />
                </svg>
                <div className="ml-2 font-medium">Search</div>
              </div>
              <div
                className="flex p-3 items-center bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 cursor-pointer rounded-md relative"
                onClick={() => setIsShowAddNewDocument(true)}
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
                <div className="ml-2 font-medium">Add new document</div>
              </div>
            </div>
          </div>
          {flag ? <DocumentFile file={document} /> : <div>Loading data...</div>}
        </div>
      </div>
      <AddNewDocumentModal
        style={isShowAddNewDocument}
        closeModal={() => setIsShowAddNewDocument(false)}
        reloadData={() => getData()}
      />
      {isSearch && <ModalSearch />}
    </>
  );
};

Document.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default Document;

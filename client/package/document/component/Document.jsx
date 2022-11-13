import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import toastr from "toastr";
import PreviewModal from "../../../package/document/component/PreviewModal";
import { documentService } from "../../RestConnector";
import AnimationLoad from "../../../components/Animation/AnimationLoad";

const FileViewer = dynamic(() => import("react-file-viewer"), {
  ssr: false,
});
const DocumentFile = ({ file, flag }) => {
  const [listDocument, setListDocument] = useState(file);
  const [document, setDocument] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [dataDelete, setDataDelete] = useState(null);
  const [isGetDelete, setIsGetDelete] = useState(false);
  const previewPDF = (contens) => {
    const url = URL.createObjectURL(
      new Blob([new Uint8Array(contens)], {
        type: "application/pdf",
      })
    );
    window.open(url);
  };

  useEffect(() => {
    setListDocument(file);
  }, [file]);

  const setNewDoc = (id, title, note) => {
    const newList = [...listDocument];
    const data = listDocument.findIndex((item) => item.documentId === id);
    newList[data].title = title;
    newList[data].note = note;
    setDocument(newList);
  };

  const handleDeleteDocument = async (id) => {
    setIsGetDelete(true);
    try {
      const res = await documentService.deleteDocument(id);
      const listDoc = listDocument.filter((x) => x.documentId !== id);
      setListDocument(listDoc);
      setIsGetDelete(false);
      toastr.success("Delete success");
    } catch (err) {
      // let msg = e.response.data.message;
      setIsGetDelete(false);
      toastr.error("Delete fail");
    }
  };

  const setDelete = (data) => {
    setDataDelete(data);
    setIsDelete(true);
  };

  const cancelDelete = () => {
    setDataDelete(null);
    setIsDelete(false);
  };

  const deletefile = () => {
    setIsDelete(false);
    handleDeleteDocument(dataDelete.documentId);
  };

  const ConfirmDeleteDocumentModal = () => {
    return (
      <>
        <div className="fixed z-50 h-full w-full top-0 left-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="flex items-center justify-center flex-col bg-white px-10 py-5 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-circle-x"
              width={98}
              height={98}
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="#ff2825"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx={12} cy={12} r={9} />
              <path d="M10 10l4 4m0 -4l-4 4" />
            </svg>
            <div className="mt-2 font-medium text-2xl">Are you sure?</div>
            <div className="mt-2">
              Do you really want to delete {dataDelete.title}?
            </div>
            <div className="flex mt-5">
              <button
                className="mr-3 bg-blue-500 text-white px-8 py-2 rounded-md cursor-pointer flex items-center"
                onClick={() => deletefile()}
              >
                Yes
              </button>
              <button
                className="bg-red-500 text-white px-8 py-2 rounded-md cursor-pointer"
                onClick={() => cancelDelete()}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      {listDocument.length > 0 ? (
        <div id="list-doc" className="grid grid-cols-3 gap-5">
          {listDocument.map((data, index) => (
            <div className="p-3 bg-white" key={index}>
              <div className="w-full view-pdf-s relative group">
                <FileViewer
                  fileType="pdf"
                  filePath={URL.createObjectURL(
                    new Blob([new Uint8Array(data.contents)], {
                      type: "application/pdf",
                    })
                  )}
                />
                <div
                  className="absolute top-1/2 left-1/2 p-5 flex opacity-0 invisible group-hover:visible group-hover:opacity-100"
                  style={{ transform: "translate(-50%,-50%)" }}
                >
                  <div
                    className="p-3 bg-black bg-opacity-50 rounded-md cursor-pointer invisible opacity-0 group-hover:visible group-hover:opacity-100"
                    onClick={() => previewPDF(data.contents)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-eye"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="#ffffff"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx={12} cy={12} r={2} />
                      <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
                    </svg>
                  </div>
                  <div className="p-3 bg-black bg-opacity-50 mx-2 rounded-md cursor-pointer opacity-0 group-hover:visible group-hover:opacity-100">
                    <a
                      href={URL.createObjectURL(
                        new Blob([new Uint8Array(data.contents)], {
                          type: "application/pdf",
                        })
                      )}
                      download
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-file-download"
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
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                        <line x1={12} y1={11} x2={12} y2={17} />
                        <polyline points="9 14 12 17 15 14" />
                      </svg>
                    </a>
                  </div>
                  <div
                    className="p-3 bg-black bg-opacity-50 rounded-md cursor-pointer opacity-0 group-hover:visible group-hover:opacity-100"
                    onClick={() => setDelete(data)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-trash"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="#ffffff"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1={4} y1={7} x2={20} y2={7} />
                      <line x1={10} y1={11} x2={10} y2={17} />
                      <line x1={14} y1={11} x2={14} y2={17} />
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-2">{data.title}</div>
              <div
                className="w-full mt-2 rounded-md text-center font-medium cursor-pointer p-3 bg-gradient-to-r from-green-400 to-blue-500"
                onClick={() => setDocument(data)}
              >
                View detail
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No data...</div>
      )}

      {document && (
        <PreviewModal
          toggle={() => setDocument(null)}
          document={document}
          setNewDoc={(id, title, note) => setNewDoc(id, title, note)}
        />
      )}
      {isDelete && <ConfirmDeleteDocumentModal />}
      {isGetDelete && <AnimationLoad />}
    </>
  );
};

export default DocumentFile;

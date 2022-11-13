import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const ViewFileDetail = ({ style, value, closeModal }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (value.contents) {
      setUrl(
        URL.createObjectURL(
          new Blob([new Uint8Array(value.contents)], {
            type: "application/pdf",
          })
        )
      );
    }
  }, [value.contents]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }
  return (
    <div
      className={
        "fixed p-0 top-0 left-0 right-0 bottom-0 flex justify-center w-full h-full  bg-black bg-opacity-50 antialiased overflow-x-hidden overflow-y-auto " +
        (style ? "opacity-1 visible z-10" : "opacity-0 invisible z-0")
      }
      style={{ transition: "all 0.1s" }}
    >
      <div className="my-10 mx-auto w-auto relative lg:max-w-xl lg:min-w-1/2 rounded-lg overflow-hidden bg-white">
      <div className="flex justify-between items-center border-b-2 px-6 py-3">
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
        <div className="border-gray-300 shadow-xl box-border w-full h-full p-6">
          
          <div className="flex" style={{height:'90%'}}>
            <div className="w-1/2 border shadow-md">
              <div className="w-full h-full detail-doc">
                {value.contents && (
                  <Document
                    file={URL.createObjectURL(
                      new Blob([new Uint8Array(value.contents)], {
                        type: "application/pdf",
                      })
                    )}
                    options={{ workerSrc: "/pdf.worker.js" }}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                )}
              </div>
            </div>
            <div className="w-1/2 ml-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Document ID
                </label>
                <input
                  value={value.documentId}
                  className="appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm"
                  type="text"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  value={value.title}
                  className="appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm"
                  type="text"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Note
                </label>
                <input
                  value={value.note}
                  className="appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm"
                  type="text"
                  disabled
                />
              </div>
              {value.contents && <a
                className="flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold disabled:cursor-not-allowed"
                href={URL.createObjectURL(
                  new Blob([new Uint8Array(value.contents)], {
                    type: "application/pdf",
                  })
                )}
                download
              >
                Download
              </a>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFileDetail;

import React from "react";

const SameModal = ({ style, value, closeModal }) => {
  return (
    <div
      className={
        "fixed p-0 top-0 left-0 right-0 bottom-0 flex justify-center w-full h-full  bg-black bg-opacity-50 antialiased overflow-x-hidden overflow-y-auto " +
        (style ? "opacity-100 visible z-10" : "opacity-0 invisible z-0")
      }
      style={{ transition: "all 0.4s" }}
    >
      <div
        className="my-10 mx-auto w-auto relative min-w-2/3 overflow-y-hidden"
        style={{ maxWidth: "80%", maxHeight: "90%",minWidth:'70%' }}
      >
        <div className="border-gray-300 shadow-xl box-border w-full bg-white p-6">
          <div className="flex flex-row justify-between py-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg">
            <p className="font-semibold text-gray-800">Document</p>
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
          <div className="overflow-y-auto" style={{ height: "700px" }}>
            <div className="mb-5">
              <div className="w-full px-2 py-3 border-r border-l text-center font-bold text-2xl bg-gradient-to-r from-green-300 to-blue-400">
                Comparison Summary
              </div>
              <table className="w-full border">
                <thead>
                  <tr className="border-b bg-gradient-to-r from-green-500 to-blue-500">
                    <th className="border-r p-2">Plagiarism Rate</th>
                    <th className="border-r p-2">All Sentences</th>
                    <th className="border-r p-2">Same Sentences</th>
                    <th className="border-r p-2">Similar Sentences</th>
                    <th className="border-r p-2">Title</th>
                    <th className="border-r p-2">Download file</th>
                    {/* contents: null
                    documentId: 680
                    message: "SAME"
                    note: "dsad"
                    plagiarism: null
                    rate: 100
                    status: false
                    title: "test" */}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="p-2 border-r text-center">
                      {value.rate.toFixed(2)}%
                    </td>
                    <td className="p-2 border-r text-center">
                     0
                    </td>
                    <td className="p-2 border-r text-center">
                      0
                    </td>
                    <td className="p-2 border-r text-center">
                     0
                    </td>
                    <td className="p-2 border-r text-center">{value.title}</td>
                    <td className="p-2 border-r text-center">
                      <a
                      href={URL.createObjectURL(
                        new Blob([new Uint8Array(value.contents)], {
                          type: "application/pdf",
                        })
                      )}
                      download
                    >download</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SameModal;

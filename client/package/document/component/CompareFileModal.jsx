import React from "react";
const CompareFileModal = ({ style, value, closeModal }) => {
  return (
    <>
      {value.plagiarism && (
        <div
          id="my-report"
          className={
            "fixed p-0 top-0 left-0 right-0 bottom-0 flex justify-center w-full h-full  bg-black bg-opacity-50 antialiased overflow-x-hidden overflow-y-auto " +
            (style ? "opacity-100 visible z-10" : "opacity-0 invisible z-0")
          }
          style={{ transition: "all 0.4s" }}
        >
          <div
            className="my-10 mx-auto w-auto relative lg:min-w-2/3 overflow-y-hidden"
            style={{ maxWidth: "80%", maxHeight: "90%" }}
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gray-50">
                        <td className="p-2 border-r text-center">
                          {value.rate.toFixed(2)}%
                        </td>
                        <td className="p-2 border-r text-center">
                          {value.plagiarism.length}
                        </td>
                        <td className="p-2 border-r text-center">
                          {value.plagiarism.filter((x) => x.rate == 100).length}
                        </td>
                        <td className="p-2 border-r text-center">
                          {value.plagiarism.filter((x) => x.rate != 100).length}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-2 mb-5 gap-1">
                  <div className="bg-green-400 text-center font-semibold py-2">
                    Target Document
                  </div>
                  <div className="bg-red-500 text-center font-semibold py-2">
                    Matching Comparison Text
                  </div>
                </div>
                {value.plagiarism.length > 0 &&
                  value.plagiarism.map((data, index) => {
                    let arrTarget = [];
                    let arrMatching = [];
                    if (0 < data.rate < 100) {
                      if (
                        data.tokenizerPlagiarism &&
                        data.tokenizerPlagiarism.length > 0
                      ) {
                        arrTarget = data.tokenizerPlagiarism.sort(
                          (a, b) => a.startTarget - b.startTarget,
                          0
                        );
                        arrMatching = data.tokenizerPlagiarism;
                      }
                    }

                    return (
                      <div key={index} className="grid grid-cols-2 mb-4 gap-1">
                        <div>
                          <div className="bg-green-300 text-right pr-2 bg-opacity-50 py-1 mb-2">
                            Plagiarism Rate:{" "}
                            <span className="font-semibold">{data.rate}%</span>
                          </div>
                          {data.rate === 100 ? (
                            <mark>{data.target}</mark>
                          ) : data.rate === 0 ? (
                            <span>{data.target}</span>
                          ) : (
                            <>
                              {arrTarget.map((data1, index) => {
                                if (index >= 1) {
                                  if (
                                    arrTarget[index].startTarget -
                                      (arrTarget[index - 1].startTarget +
                                        arrTarget[index - 1].length) ==
                                    0
                                  ) {
                                    return (
                                      <mark key={index}>
                                        {data.target.substring(
                                          data1.startTarget,
                                          data1.startTarget + data1.length
                                        )}
                                      </mark>
                                    );
                                  } else if (
                                    arrTarget[index].startTarget -
                                      (arrTarget[index - 1].startTarget +
                                        arrTarget[index - 1].length) ==
                                    1
                                  ) {
                                    return (
                                      <mark key={index}>
                                        {data.target.substring(
                                          data1.startTarget - 1,
                                          data1.startTarget + data1.length
                                        )}
                                      </mark>
                                    );
                                  } else if (
                                    arrTarget[index].startTarget -
                                      (arrTarget[index - 1].startTarget +
                                        arrTarget[index - 1].length) >
                                    1
                                  ) {
                                    return (
                                      <span key={index}>
                                        <span>
                                          {data.target.substring(
                                            arrTarget[index - 1].startTarget +
                                              arrTarget[index - 1].length,
                                            data1.startTarget
                                          )}
                                        </span>
                                        <mark>
                                          {data.target.substring(
                                            data1.startTarget,
                                            data1.startTarget + data1.length
                                          )}
                                        </mark>
                                      </span>
                                    );
                                  }
                                } else {
                                  if (arrTarget.length === 1) {
                                    if (data1.startTarget > 0) {
                                      return (
                                        <span key={index}>
                                          <span>
                                            {data.target.substring(
                                              0,
                                              data1.startTarget
                                            )}
                                          </span>
                                          <mark>
                                            {data.target.substring(
                                              data1.startTarget,
                                              data1.startTarget + data1.length
                                            )}
                                          </mark>
                                        </span>
                                      );
                                    } else {
                                      return (
                                        <span key={index}>
                                          <mark>
                                            {data.target.substring(
                                              data1.startTarget,
                                              data1.startTarget + data1.length
                                            )}
                                          </mark>
                                          <span>
                                            {data.target.substring(
                                              data1.startTarget + data1.length,
                                              data.target.length
                                            )}
                                          </span>
                                        </span>
                                      );
                                    }
                                  } else {
                                    if (data1.startTarget > 0) {
                                      return (
                                        <span key={index}>
                                          <span>
                                            {data.target.substring(
                                              0,
                                              data1.startTarget
                                            )}
                                          </span>
                                          <mark>
                                            {data.target.substring(
                                              data1.startTarget,
                                              data1.startTarget + data1.length
                                            )}
                                          </mark>
                                        </span>
                                      );
                                    } else {
                                      return (
                                        <mark key={index}>
                                          {data.target.substring(
                                            data1.startTarget,
                                            data1.startTarget + data1.length
                                          )}
                                        </mark>
                                      );
                                    }
                                  }
                                }
                              })}
                            </>
                          )}
                        </div>
                        <div>
                          <div className="bg-red-300 pl-2 bg-opacity-50 py-1 mb-2">
                            Document similar:{" "}
                            <span className="font-semibold">{value.title}</span>
                          </div>
                          {data.rate === 100 ? (
                            <mark>{data.matching}</mark>
                          ) : (
                            <>
                              {arrMatching &&
                                arrMatching
                                  .sort(
                                    (a, b) => a.startMatching - b.startMatching,
                                    0
                                  )
                                  .map((data1, index) => {
                                    if (index >= 1) {
                                      if (
                                        arrMatching[index].startMatching -
                                          (arrMatching[index - 1]
                                            .startMatching +
                                            arrMatching[index - 1].length -
                                            1) ==
                                        1
                                      ) {
                                        return (
                                          <mark key={index}>
                                            {data.matching.substring(
                                              data1.startMatching,
                                              data1.startMatching + data1.length
                                            )}
                                          </mark>
                                        );
                                      } else if (
                                        arrMatching[index].startMatching -
                                          (arrMatching[index - 1]
                                            .startMatching +
                                            arrMatching[index - 1].length -
                                            1) ==
                                        2
                                      ) {
                                        return (
                                          <mark key={index}>
                                            {data.matching.substring(
                                              data1.startMatching - 1,
                                              data1.startMatching + data1.length
                                            )}
                                          </mark>
                                        );
                                      } else if (
                                        arrMatching[index].startMatching -
                                          (arrMatching[index - 1]
                                            .startMatching +
                                            arrMatching[index - 1].length -
                                            1) >
                                        2
                                      ) {
                                        return (
                                          <span key={index}>
                                            <span>
                                              {data.matching.substring(
                                                arrMatching[index - 1]
                                                  .startMatching +
                                                  arrMatching[index - 1].length,
                                                data1.startMatching
                                              )}
                                            </span>
                                            <mark>
                                              {data.matching.substring(
                                                data1.startMatching,
                                                data1.startMatching +
                                                  data1.length
                                              )}
                                            </mark>
                                          </span>
                                        );
                                      }
                                    } else {
                                      if (arrMatching.length === 1) {
                                        if (data1.startMatching > 0) {
                                          return (
                                            <span key={index}>
                                              <span>
                                                {data.matching.substring(
                                                  0,
                                                  data1.startMatching
                                                )}
                                              </span>
                                              <mark>
                                                <span>
                                                  {data.matching.substring(
                                                    data1.startMatching,
                                                    data1.startMatching +
                                                      data1.length
                                                  )}
                                                </span>
                                              </mark>
                                            </span>
                                          );
                                        } else {
                                          return (
                                            <span key={index}>
                                              <mark>
                                                {data.matching.substring(
                                                  data1.startMatching,
                                                  data1.startMatching +
                                                    data1.length
                                                )}
                                              </mark>
                                              <span>
                                                {data.matching.substring(
                                                  data1.startMatching +
                                                    data1.length,
                                                  data.matching.length
                                                )}
                                              </span>
                                            </span>
                                          );
                                        }
                                      } else {
                                        if (data1.startMatching > 0) {
                                          return (
                                            <span key={index}>
                                              <span>
                                                {data.matching.substring(
                                                  0,
                                                  data1.startMatching
                                                )}
                                              </span>
                                              <mark>
                                                <span>
                                                  {data.matching.substring(
                                                    data1.startMatching,
                                                    data1.startMatching +
                                                      data1.length
                                                  )}
                                                </span>
                                              </mark>
                                            </span>
                                          );
                                        } else {
                                          return (
                                            <mark key={index}>
                                              {data.matching.substring(
                                                data1.startMatching,
                                                data1.startMatching +
                                                  data1.length
                                              )}
                                            </mark>
                                          );
                                        }
                                      }
                                    }
                                  })}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareFileModal;

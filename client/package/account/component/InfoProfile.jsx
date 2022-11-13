import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";
import toastr from "toastr";
import moment from "moment";
import { accountService } from "../../RestConnector";

const InfoProfile = ({user,updateProfile}) => {
  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required("First name required"),
    lastName: Yup.string().required("Last name required"),
    dob: Yup.date().required("Date of birth required"),
    gender: Yup.string().required("Gender required"),
    phoneNumber: Yup.string().required("Phone number required"),
    userCode: Yup.string().required("User code required"),
  });

  const handleChangeProfile = async (values, action) => {
    const { setSubmitting } = action;
    const id = user.id;
    if (id) {
      try {
        await accountService.changeProfile(id, values);
        setSubmitting(false);
        toastr.success("Update info user success");
        updateProfile(values)
      } catch (e) {
        let msg;
        switch (e.code) {
          default: {
            msg = e.message;
          }
        }
        toastr.error("Get info fail!");
        setSubmitting(false);
      }
    }
  };
  
  return (
    <div>
      {user.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <Formik
          initialValues={{
            firstName: user && user.firstName,
            lastName: user && user.lastName,
            email: user && user.email,
            dob: user && moment(user.dob).format("YYYY-MM-DD"),
            gender: user && user.gender,
            phoneNumber: user && user.phoneNumber,
            userCode: user && user.userCode,
          }}
          validationSchema={ProfileSchema}
          onSubmit={handleChangeProfile}
        >
          {(props) => (
            <div className="w-full max-w-md">
              <Form
                onSubmit={props.handleSubmit}
                className="bg-white pt-6 pb-8"
              >
                <div className="grid grid-cols-2 gap-2 box-border mt-3">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="firstname"
                    >
                      First name
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      placeholder="Thang"
                      className={
                        "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                        (props.errors.firstName && props.touched.firstName
                          ? "border-red-500"
                          : "border-green-500")
                      }
                      type="text"
                    />
                    {props.errors.firstName && props.touched.firstName ? (
                      <div className="text-red-600 text-sm mt-2">
                        {props.errors.firstName}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="lastname"
                    >
                      Last Name
                    </label>
                    <Field
                      id="lastName"
                      name="lastName"
                      placeholder="Nguyen"
                      className={
                        "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                        (props.errors.lastName && props.touched.lastName
                          ? "border-red-500"
                          : "border-green-500")
                      }
                      type="text"
                    />
                    {props.errors.lastName && props.touched.lastName ? (
                      <div className="text-red-600 text-sm mt-2">
                        {props.errors.lastName}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="dob"
                  >
                    Date of Birth
                  </label>
                  <Field
                    id="dob"
                    name="dob"
                    placeholder="example@hcmute.edu.vn"
                    className={
                      "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                      (props.errors.dob && props.touched.dob
                        ? "border-red-500"
                        : "border-green-500")
                    }
                    type="date"
                  />
                  {props.errors.dob && props.touched.dob ? (
                    <div className="text-red-600 text-sm mt-2">
                      {props.errors.dob}
                    </div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="gender"
                  >
                    Gender
                  </label>
                  <div role="group" aria-labelledby="my-radio-group">
                    <label className="mr-10">
                      <Field
                        className="mr-2 form-radio"
                        type="radio"
                        name="gender"
                        value="MALE"
                      />
                      Male
                    </label>
                    <label>
                      <Field
                        className="mr-2 form-radio"
                        type="radio"
                        name="gender"
                        value="FEMALE"
                      />
                      Female
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 box-border mt-3">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="phoneNumber"
                    >
                      Phone number
                    </label>
                    <Field
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="0978686868"
                      className={
                        "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                        (props.errors.phoneNumber && props.touched.phoneNumber
                          ? "border-red-500"
                          : "border-green-500")
                      }
                      type="text"
                    />
                    {props.errors.phoneNumber && props.touched.phoneNumber ? (
                      <div className="text-red-600 text-sm mt-2">
                        {props.errors.phoneNumber}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="userCode"
                    >
                      User code
                    </label>
                    <Field
                      id="userCode"
                      name="userCode"
                      placeholder="17110230"
                      className={
                        "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                        (props.errors.userCode && props.touched.userCode
                          ? "border-red-500"
                          : "border-green-500")
                      }
                      type="text"
                    />
                    {props.errors.userCode && props.touched.userCode ? (
                      <div className="text-red-600 text-sm mt-2">
                        {props.errors.userCode}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center justify-between">
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
                </div>
              </Form>
            </div>
          )}
        </Formik>
      )}
    </div>
  );
};

export default InfoProfile;

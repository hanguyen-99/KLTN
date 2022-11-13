import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";
import toastr from "toastr";

import { accountService } from "../../package/RestConnector";
import UserGuest from "../../layouts/UserGuest";
const SignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const SignupSchema = Yup.object().shape({
    firstName: Yup.string().required("First name required"),
    lastName: Yup.string().required("Last name required"),
    email: Yup.string().email("Invalid email").required("Your email required"),
    dob: Yup.date().required("Date of birth required"),
    gender: Yup.string().required("Gender required"),
    phoneNumber: Yup.string().required("Phone number required"),
    userCode: Yup.string().required("User code required"),
    password: Yup.string()
      .min(8, "Your password is too short!")
      .max(30, "Your password is too Long!")
      .required("Your password required!"),
    confirmPassword: Yup.string()
      .min(8, "Your password is too short!")
      .max(30, "Your password is too Long!")
      .required("Your password required!"),
  });

  const handleSignup = async (values, actions) => {
    const { setSubmitting } = actions;
    setSubmitting(true);
    if (values.password === values.confirmPassword) {
      try {
        await accountService.signUpUser(values);
        setIsSignUp(true);
        toastr.success("Success");
        setSubmitting(false);
      } catch (e) {
        let msg;
        switch (e.code) {
          default: {
            msg = e.message;
          }
        }
        setSubmitting(false);
        toastr.error(e.response.data.message);
      }
    } else {
      toastr.warning("Password and confirm password must be the same!");
    }
  };

  return (
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <Head>
        <title>Sign up</title>
      </Head>
      {!isSignUp ? (
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            dob: "",
            gender: "MALE",
            phoneNumber: "",
            userCode: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {(props) => (
            <div className="w-full max-w-md">
              <Form
                onSubmit={props.handleSubmit}
                className="bg-white shadow-md rounded-md px-8 pt-6 pb-8"
              >
                <h1 className="text-gray-600 font-bold text-2xl text-center">
                  Sign Up
                </h1>
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
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    placeholder="demo@student.hcmute.edu.vn"
                    className={
                      "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                      (props.errors.email && props.touched.email
                        ? "border-red-500"
                        : "border-green-500")
                    }
                    type="email"
                  />
                  {props.errors.email && props.touched.email ? (
                    <div className="text-red-600 text-sm mt-2">
                      {props.errors.email}
                    </div>
                  ) : null}
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
                      placeholder="0987654321"
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
                      htmlFor="phoneNumber"
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
                <div className="grid grid-cols-2 gap-2 box-border mt-3">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      placeholder="********"
                      className={
                        "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                        (props.errors.password && props.touched.password
                          ? "border-red-500"
                          : "border-green-500")
                      }
                      type="password"
                      autoComplete="new-password"
                    />
                    {props.errors.password && props.touched.password ? (
                      <div className="text-red-600 text-sm mt-2">
                        {props.errors.password}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="********"
                      className={
                        "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                        (props.errors.confirmPassword &&
                        props.touched.confirmPassword
                          ? "border-red-500"
                          : "border-green-500")
                      }
                      type="password"
                    />
                    {props.errors.confirmPassword &&
                    props.touched.confirmPassword ? (
                      <div className="text-red-600 text-sm mt-2">
                        {props.errors.confirmPassword}
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
                    Sign up
                  </button>
                  <Link href="/login">
                    <a
                      className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                      href="#"
                    >
                      Login
                    </a>
                  </Link>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      ) : (
        <div className="w-full max-w-md">
          <div className="p-20 bg-success flex items-center flex-col">
            <div className="w-20 h-20 rounded-full bg-transparent border-2 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-user-check"
                width={40}
                height={40}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#fff"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx={9} cy={7} r={4} />
                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                <path d="M16 11l2 2l4 -4" />
              </svg>
            </div>
            <div className="text-white text-2xl font-semibold mt-2">
              SUCCESS
            </div>
          </div>
          <div className="bg-white p-10 flex justify-center flex-col items-center">
            <div className="text-center text-gray-600">
              Congratulations, please check your email and confirm
            </div>
            <Link href="/login">
              <a
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold inline-block w-1/3 mt-5"
                href="#"
              >
                Login
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
SignUp.getLayout = function getLayout(page) {
  return <UserGuest>{page}</UserGuest>;
};
export default SignUp;

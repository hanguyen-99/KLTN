import Head from "next/head";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import toastr from "toastr";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import UserGuest from "../../layouts/UserGuest";
import { accountService, documentService } from "../../package/RestConnector";
import { UserRole } from "../../package/account/model/Account";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const isAdmin = (role) => {
    const res = role.find((role) => role === UserRole.ROLE_ADMIN);
    if (res) return true;
    return false;
  };

  // useEffect(() => {
  //   test()
  // }, [])

  const test = async() =>{
    const z = await documentService.getDocumentTest()
    const contens = z.data.contents
    const url = URL.createObjectURL(
      new Blob([new Uint8Array(contens)], {
        type: "application/pdf",
      })
    );
    window.open(url)
  }

  const handleLogin = async (values, actions) => {
    const { setSubmitting } = actions;
    setSubmitting(true);
    try {
      const res = await accountService.loginAdmin(values);
      const nextPage = isAdmin(res.roles) ? "/admin" : "/document";
      toastr.success("login success");
      Cookies.set('check-reset', 0)
      setSubmitting(false);
      router.replace(nextPage);
    } catch (e) {
      toastr.error(e.response.data.message);
      setSubmitting(false);
    }
  };

  const SignupSchema = Yup.object().shape({
    password: Yup.string()
      .required("Your password required!"),
    email: Yup.string().email("Invalid email").required("Your email required"),
  });

  return (
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <Head>
        <title>login</title>
      </Head>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={handleLogin}
      >
        {(props) => (
          <div className="w-full max-w-md">
            <Form
              onSubmit={props.handleSubmit}
              className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4"
            >
              <h1 className="text-gray-600 font-bold text-2xl text-center">
                Sign In
              </h1>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <Field
                    id="email"
                    name="email"
                    placeholder="example@hcmute.edu.vn"
                    className={
                      "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                      (props.errors.email && props.touched.email
                        ? "border-red-500"
                        : "border-green-500")
                    }
                    type="text"
                  />
                  {props.errors.email && props.touched.email ? (
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

                {props.errors.email && props.touched.email ? (
                  <div className="text-red-600 text-sm mt-2 flex items-center">
                    {props.errors.email}
                  </div>
                ) : null}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
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
                  />
                  {props.errors.password && props.touched.password ? (
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

                {props.errors.password && props.touched.password ? (
                  <div className="text-red-600 text-sm mt-2 flex items-center">
                    {props.errors.password}
                  </div>
                ) : null}
                {/* <ErrorMessage name="password" /> */}
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
                  Sign in
                </button>
                <Link href="/forgot-password"><a
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                  href="#"
                >
                  Forgot password?
                </a>
                </Link>
                
              </div>
              <div className="text-center text-sm mt-4 text-gray-500 font-medium">
                Don&#39;t have an account?{" "}
                <Link href="/signup">
                  <a
                    href="#"
                    className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500"
                  >
                    {" "}
                    Sign up
                  </a>
                </Link>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};
Login.getLayout = function getLayout(page) {
  return <UserGuest>{page}</UserGuest>;
};
export default Login;

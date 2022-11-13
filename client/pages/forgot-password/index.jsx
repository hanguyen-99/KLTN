import React, { useState } from "react";
import Head from "next/head";
import * as Yup from "yup";
import toastr from "toastr";
import { Formik, Field, Form } from "formik";
import Link from "next/link";
import UserGuest from "../../layouts/UserGuest";
import { accountService } from "../../package/RestConnector";
import Cookies from "js-cookie";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Your email required"),
});

const ForgotPassword = () => {
  const [isSendMail, setIsSendMail] = useState(false);
  const [countDown, setCountDown] = useState(false);
  const [mailSend,setMailSend] = useState([])
  const handleForgotPassword = async (values, actions) => {
    const { setSubmitting } = actions;
    const { email } = values;
    setSubmitting(true);
    try {
      await accountService.forgotPassword(email);
      setIsSendMail(true);
      Cookies.set("check-reset", 0);
      setMailSend(email);
      setCountDown(true);
      setTimeout(() => {
        setCountDown(false);
      }, 60000);
      toastr.success("Send email reset success");
      setSubmitting(false);
    } catch (e) {
      toastr.error("This email does not exist in the system");
      setSubmitting(false);
    }
  };
  const resendMail = async() =>{
    const email = mailSend
    try {
      await accountService.forgotPassword(email);
      setIsSendMail(true);
      Cookies.set("check-reset", 0);
      setMailSend(email);
      setCountDown(true);
      setTimeout(() => {
        setCountDown(false);
      }, 60000);
      toastr.success("Send email reset success");
    } catch (e) {
      toastr.error("This email does not exist in the system");
    }
  }

  return (
    <>
    <Head>
        <title>Forgot password</title>
      </Head>
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      {isSendMail === false ? (
        <div className="p-5 bg-white rounded-md shadow-md min-w-1/4">
          <h1 className="text-gray-600 font-bold uppercase text-2xl text-center">
            Forgot password
          </h1>
          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleForgotPassword}
          >
            {(props) => (
              <div className="w-full max-w-md">
                <Form
                  onSubmit={props.handleSubmit}
                  className="px-8 pt-6 pb-8 mb-4"
                >
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
                      Send email
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
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="p-20 bg-success flex items-center flex-col">
            <div className="w-20 h-20 rounded-full bg-transparent border-2 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-check"
                width={40}
                height={40}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ffffff"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12l5 5l10 -10" />
              </svg>
            </div>
            <div className="text-white text-2xl font-semibold mt-2">
              SUCCESS
            </div>
          </div>
          <div className="bg-white p-10 flex justify-center flex-col items-center">
            <div className="text-center text-gray-600">
              Password reset request was sent successfully. Please check your
              email to reset your password.
            </div>
            <button
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 px-10 rounded focus:outline-none focus:shadow-outline font-semibold inline-block mt-5"
              disabled={countDown}
              onClick={()=> resendMail()}
            >
              Resend
            </button>
            {countDown && (
              <div className="text-red-500 mt-2">please wait 1 minute to resend</div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
    
  );
};
ForgotPassword.getLayout = function getLayout(page) {
  return <UserGuest>{page}</UserGuest>;
};
export default ForgotPassword;

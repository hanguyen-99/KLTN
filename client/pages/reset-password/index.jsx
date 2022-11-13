import React, { useState } from "react";
import Head from "next/head";
import { Formik, Field, Form } from "formik";
import Link from "next/link";
import toastr from "toastr";
import * as Yup from "yup";
import UserGuest from "../../layouts/UserGuest";
import { useRouter } from "next/router";
import { accountService } from "../../package/RestConnector";
import Cookies from "js-cookie";

const SignupSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Your password is too short!")
    .max(70, "Your password is too Long!")
    .required("Your new password required!"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), "null"], "Confirm password is not correct")
    .required("Your confirm password required!"),
});

const ResetPassword = () => {
  const [isReset, setIsReset] = useState(false);
  const [isCheck,setIscheck] = useState(Cookies.get("check-reset"));
  const router = useRouter();
  const uuidAndMail = router.query;

  const handleResetPassword = async (values, actions) => {
    const { uuid, email } = uuidAndMail;
    const { newPassword } = values;
    const { setSubmitting } = actions;
    const data = {
      password: newPassword,
    };
    setSubmitting(true);
    try {
      await accountService.resetPassword(email, uuid, data);
      toastr.success("Reset password success");
      setIsReset(true);
      setSubmitting(false);
      Cookies.set("check-reset", 1);
      setIscheck(1)
    } catch (e) {
      let msg;
      switch (e.code) {
        default: {
          msg = e.message;
        }
      }
      toastr.error("Reset password fail!");
      setSubmitting(false);
    }
  };
  return (
    <>
    <Head>
        <title>Reset password</title>
      </Head>
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      {isReset == false && isCheck == 0 && (
        <div className="min-w-1/4 p-14 bg-white rounded-lg shadow-md">
          <h1 className="text-gray-600 font-bold uppercase text-2xl text-center">
            Reset password
          </h1>
          <Formik
            initialValues={{
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={handleResetPassword}
          >
            {(props) => (
              <div className="w-full max-w-md mt-5">
                <Form onSubmit={props.handleSubmit} className="">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="newPassword"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <Field
                        id="newPassword"
                        name="newPassword"
                        placeholder="********"
                        className={
                          "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                          (props.errors.newPassword && props.touched.newPassword
                            ? "border-red-500"
                            : "border-green-500")
                        }
                        type="password"
                      />
                      {props.errors.newPassword && props.touched.newPassword ? (
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
                    {props.errors.newPassword && props.touched.newPassword ? (
                      <div className="text-red-600 text-sm mt-2 flex items-center">
                        {props.errors.newPassword}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="confirmPassword"
                    >
                      Confirm new password
                    </label>
                    <div className="relative">
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

                    {props.errors.confirmPassword &&
                    props.touched.confirmPassword ? (
                      <div className="text-red-600 text-sm mt-2 flex items-center">
                        {props.errors.confirmPassword}
                      </div>
                    ) : null}
                  </div>
                  <div className="">
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
        </div>
      )}
      {isCheck == 1 && (
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
              Your password has been changed successfully.
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
    </>
    
  );
};
ResetPassword.getLayout = function getLayout(page) {
  return <UserGuest>{page}</UserGuest>;
};
export default ResetPassword;

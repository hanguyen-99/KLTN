import React, { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import toastr from "toastr";

import { accountService } from "../../package/RestConnector";
import { UserLayout } from "../../layouts/User";
import InfoProfile from "../../package/account/component/InfoProfile";

const avtDefault = "https://res.cloudinary.com/ddxkbr7ma/image/upload/v1641305022/images/qmlkihv5sjhqihnq39y3.jpg"

const Profile = () => {
  const [isProfile, setIsProfile] = useState(true);
  const [avt, setAvt] = useState(null);
  const [avtPreview, setAvtPreview] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [user, setUser] = useState([]);
  const [isChangeAvt,setIsChangeAvt] = useState(false);
  

  const SignupSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Your password required!"),
    newPassword: Yup.string()
      .min(8, "Your password is too short!")
      .max(70, "Your password is too Long!")
      .required("Your new password required!"),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("newPassword"), "null"],
        "Confirm password is not correct"
      )
      .required("Your confirm password required!"),
  });

  useEffect(() => {
    getDataUser();
  }, []);

  const getDataUser = async () => {
    try {
      const dataAPI = await accountService.getUserAfterLogin();
      const userData = dataAPI.data;
      setUser(userData);
    } catch (e) {
      let msg;
      switch (e.code) {
        default: {
          msg = e.message;
        }
      }
      toastr.error("Get info fail!");
    }
  };
  
  const cancelFileAvt = () =>{
    setShowConfirm(false)
    setAvtPreview(null)
  }

  const handleChangePassword = async (values, actions) => {
    const data = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    actions.setSubmitting(true);
    try {
      await accountService.changePassword(data);
      toastr.success("Change password success");
      actions.setSubmitting(false);
      actions.resetForm();
    } catch (err) {
      toastr.error("Current password is not correct!");
      actions.setSubmitting(false);
    }
  };

  const setImageAvt = async (file) => {
    if (file) {
      setAvt(file);
      setAvtPreview(URL.createObjectURL(file));
      setShowConfirm(true);
    }
  };

  const changeAvatar = async () => {
    setIsChangeAvt(true)
    try {
      await accountService.changeAvatar(avt);
      toastr.success("Change avatar success");
      setShowConfirm(false);
      setIsChangeAvt(false)
    } catch (e) {
      let msg;
      switch (e.code) {
        default: {
          msg = e.message;
        }
      }
      setIsChangeAvt(false);
      toastr.error("Change avatar fail!!");
    }
  };

  const reNew = (values) =>{
    const newUser = user
    newUser.dob = values.dob
    newUser.email = values.email
    newUser.firstName = values.firstName
    newUser.gender = values.gender
    newUser.lastName = values.lastName
    newUser.phoneNumber = values.phoneNumber
    newUser.userCode = values.userCode
    setUser(newUser)
  }
  const confirmSaveImageModal = () => {
    return (
      <>
        <div
          className={
            "fixed z-50 h-full w-full top-0 left-0 bg-black bg-opacity-20 flex items-center justify-center " +
            (showConfirm ? "opacity-1 visible" : "opacity-0 invisible")
          }
        >
          <div className="flex items-center justify-center flex-col bg-white px-10 py-5 rounded-md translate-y-0 animate-wiggle">
            <div className="p-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Image
                alt="..."
                className="w-full align-middle rounded-full border object-cover"
                src={avtPreview?avtPreview:user.avatar?user.avatar:avtDefault}
                width={150}
                height={150}
              />
            </div>

            <div className="mt-2">
              Are you sure you want to change this avatar?
            </div>
            <div className="flex mt-5">
              <button
                className="mr-3 bg-blue-500 text-white px-8 py-2 rounded-md cursor-pointer flex items-center"
                onClick={() => changeAvatar()}
                disabled={isChangeAvt}
              >
                {isChangeAvt && (
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
                Yes
              </button>
              <button
                className="bg-red-500 text-white px-8 py-2 rounded-md cursor-pointer"
                onClick={() => cancelFileAvt()}
                disabled={isChangeAvt}
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
      <Head>
        <title>Profile</title>
      </Head>

      <div className="flex justify-center">
        <div className="w-3/4 py-10">
          {user.length === 0 ? (
            <div className="bg-white w-full rounded-md shadow-sm py-10 px-5">Retrieving user information...</div>
          ) : (
            <div className="bg-white w-full flex rounded-md shadow-sm">
              <div className="border-r-2 p-4 w-1/4">
                <div className="text-center relative group">
                  <Image
                    alt="..."
                    className="w-full align-middle rounded-full object-cover"
                    src={avtPreview ? avtPreview : user.avatar ? user.avatar:avtDefault}
                    width={150}
                    height={150}
                  />
                  <div
                    className="w-20 h-20 rounded-full bg-black flex items-center justify-center bg-opacity-50 absolute top-1/2 left-1/2 opacity-0 invisible group-hover:visible group-hover:opacity-100 cursor-pointer"
                    style={{ transform: "translate(-50%,-50%" }}
                  >
                    <input
                      className="absolute w-full h-full opacity-0 cursor-pointer top-0 left-0 "
                      type="file"
                      name="avatar"
                      id="avatar"
                      accept="image/png, image/gif, image/jpeg"
                      onChange={(event) => setImageAvt(event.target.files[0])}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-camera-plus"
                      width={30}
                      height={30}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#ffffff"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx={12} cy={13} r={3} />
                      <path d="M5 7h2a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                      <line x1={15} y1={6} x2={21} y2={6} />
                      <line x1={18} y1={3} x2={18} y2={9} />
                    </svg>
                  </div>
                </div>
                <div className="text-center mt-3 font-bold text-gray-600 text-lg">
                  {user && user.firstName.concat(" ",user.lastName)}
                </div>
                <div className="text-center">{user && user.email}</div>
              </div>
              <div className="p-4 w-3/4">
                <div className="border-b border-red-500">
                  <div className="font-bold text-2xl text-gray-700">
                    Profile and Password
                  </div>
                  <div className="flex mt-4">
                    <div
                      className={
                        "py-3 px-4 cursor-pointer font-medium flex " +
                        (isProfile ? "border-b-2 border-red-500" : null)
                      }
                      onClick={() => setIsProfile(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-id mr-2"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#ff4500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <rect x={3} y={4} width={18} height={16} rx={3} />
                        <circle cx={9} cy={10} r={2} />
                        <line x1={15} y1={8} x2={17} y2={8} />
                        <line x1={15} y1={12} x2={17} y2={12} />
                        <line x1={7} y1={16} x2={17} y2={16} />
                      </svg>
                      Profile
                    </div>
                    <div
                      className={
                        "cursor-pointer py-3 px-4 font-medium flex " +
                        (!isProfile ? "border-b-2 border-red-500" : null)
                      }
                      onClick={() => setIsProfile(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-shield-lock mr-2"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth="1.7"
                        stroke="#ff4500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
                        <circle cx={12} cy={11} r={1} />
                        <line x1={12} y1={12} x2={12} y2="14.5" />
                      </svg>
                      Change password
                    </div>
                  </div>
                </div>
                {isProfile ? (
                  <div>
                    <InfoProfile user={user} updateProfile={(values)=> reNew(values)} />
                  </div>
                ) : (
                  <div className="mt-3">
                    <Formik
                      initialValues={{
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      }}
                      validationSchema={SignupSchema}
                      onSubmit={handleChangePassword}
                    >
                      {(props) => (
                        <div className="w-full max-w-md">
                          <Form onSubmit={props.handleSubmit} className="">
                            <div className="mb-4">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="currentPassword"
                              >
                                Current password
                              </label>
                              <Field
                                id="currentPassword"
                                name="currentPassword"
                                placeholder="********"
                                className={
                                  "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                                  (props.errors.currentPassword &&
                                  props.touched.currentPassword
                                    ? "border-red-500"
                                    : "border-green-500")
                                }
                                type="text"
                              />
                              {props.errors.currentPassword &&
                              props.touched.currentPassword ? (
                                <div className="text-red-600 text-sm mt-2 flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-alert-triangle"
                                    width={22}
                                    height={22}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#ff2825"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    />
                                    <path d="M12 9v2m0 4v.01" />
                                    <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                                  </svg>
                                  {props.errors.currentPassword}
                                </div>
                              ) : null}
                            </div>
                            <div className="mb-4">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="newPassword"
                              >
                                New password
                              </label>
                              <Field
                                id="newPassword"
                                name="newPassword"
                                placeholder="********"
                                className={
                                  "appearance-none border-2 rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none text-sm " +
                                  (props.errors.newPassword &&
                                  props.touched.newPassword
                                    ? "border-red-500"
                                    : "border-green-500")
                                }
                                type="password"
                                autoComplete="new-password"
                              />
                              {props.errors.newPassword &&
                              props.touched.newPassword ? (
                                <div className="text-red-600 text-sm mt-2 flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-alert-triangle"
                                    width={22}
                                    height={22}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#ff2825"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    />
                                    <path d="M12 9v2m0 4v.01" />
                                    <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                                  </svg>
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
                                <div className="text-red-600 text-sm mt-2 flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-alert-triangle"
                                    width={22}
                                    height={22}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#ff2825"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    />
                                    <path d="M12 9v2m0 4v.01" />
                                    <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                                  </svg>
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
              </div>
            </div>
          )}
        </div>
      </div>

      {confirmSaveImageModal()}
    </>
  );
};

Profile.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default Profile;

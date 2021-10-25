import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useParams,
  // useLocation 
} from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { WS_LINK } from "../../../globals";
import { getSessionInfo, clearSessionInfo } from "../../../variable";

import InputText from "../../../components/InputText/InputText";
import InputNumeric from "../../../components/InputNumeric/InputNumeric";
import Selector from "../../../components/Selector/Selector";
import SuccessModal from "../../../components/PageModals/CheckMail";
import ForgotModal from "../../../components/PageModals/ForgotModal";

import { Button } from "reactstrap";
import { toast } from "react-toastify";

import "./editProfile.css";
import "../../../App.css";
import "../../Common/Register/Register.css";

import Avatar from "@material-ui/core/Avatar";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export default function UpdateProfile(props) {


  // const location = useLocation();

  // page url
  let { user_id } = useParams();
  if (user_id !== undefined) user_id = decodeURIComponent(atob(user_id));

  // STATES
  const [forgotModal, setForgotModal] = useState(false);
  const [mailModal, setMailModal] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [modalPath, setModalPath] = useState(false);

  const [updateObj, setUpdateObj] = useState({
    name: " ",
    email: " ",
    mobileNumber: " ",
    mobileCode: " ",
    officeNumber: "",
    officeCode: " ",
    jobRole: " ",
    gender: "",
    otherJobRole: '',
    department: '',
    otherDepartment: ''
  });

  const [otherInputOpen, setOtherInputOpen] = useState({
    jobRole: false,
    department: false
  })



  // SET STATES

  const [retrievedData, setRetrievedData] = useState({
    departments: []
  })

  const handleOtherInputs = (isOther, name) => {
    if (isOther && !otherInputOpen[name]) setOtherInputOpen({ ...otherInputOpen, [name]: true })
    else if (!isOther && otherInputOpen[name]) setOtherInputOpen({ ...otherInputOpen, [name]: false })
  }

  const closeModal = () => {
    setMailModal(!mailModal);
  };
  const closeforgotModal = () => {
    setForgotModal(!forgotModal);
  };
  const handleChange = (name, value) => {
    setUpdateObj({ ...updateObj, [name]: value });
  };



  // FORM VALIDATION
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: updateObj });


  useEffect(() => {
    props.setPageTitle('Edit Profile', 'تعديل الملف الشخصي')
    if (getSessionInfo('role') === 1) {
      const cancelToken = axios.CancelToken;
      const source = cancelToken.source();

      axios({
        method: "get",
        url: `${WS_LINK}fill_data`,
        cancelToken: source.token,
      })
        .then((res) => {

          setRetrievedData({
            departments: res.data[5].map(item => ({
              value: item.option_id,
              label: getSessionInfo('language') === 'arabic' ? item.option_value_a : item.option_value_e
            }))
          });


          if (
            user_id !== undefined &&
            getSessionInfo("id") !== user_id &&
            getSessionInfo("role") === 4
          )
            get_user_profile(res.data[5]);
          else get_profile(res.data[5]);

        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("request canceled");
          } else {
            console.log("request failed");
          }
        });
    }
    else {
      if (
        user_id !== undefined &&
        getSessionInfo("id") !== user_id &&
        getSessionInfo("role") === 4
      )
        get_user_profile([]);
      else get_profile([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const get_user_profile = (departments) => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
      user: user_id,
    };

    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${WS_LINK}get_admin_user_detail`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        props.toggleSpinner(false);

        if (res.data !== "role error" && res.data !== "token error") {
          if (res.data.length === 1) {
            setLoaded(true);
            const mobileCode = res.data[0].user_mobile
              ? res.data[0].user_mobile.substr(
                0,
                res.data[0].user_mobile.indexOf(" ")
              )
              : "";
            const officeCode = res.data[0].user_office_number
              ? res.data[0].user_office_number.substr(
                0,
                res.data[0].user_office_number.indexOf(" ")
              )
              : "";

            // eslint-disable-next-line eqeqeq
            const dept = departments.filter(item => item.option_id == res.data[0].user_department)

            setUpdateObj({
              name: res.data[0].user_name,
              email: res.data[0].user_email,
              mobileNumber: res.data[0].user_mobile
                ? res.data[0].user_mobile.substr(
                  res.data[0].user_mobile.indexOf(" ") + 1
                )
                : "",
              mobileCode: { value: mobileCode, label: mobileCode },
              officeNumber: res.data[0].user_office_number
                ? res.data[0].user_office_number.substr(
                  res.data[0].user_office_number.indexOf(" ") + 1
                )
                : "",
              officeCode: { value: officeCode, label: officeCode },
              jobRole: {
                value: res.data[0].user_role,
                label: res.data[0].user_role,
              },
              department: dept.length > 0 ? { value: dept[0].option_id, label: getSessionInfo('language') === 'arabic' ? dept[0].option_value_a : dept[0].option_value_e } : ''
            });

          } else {
            toast.error("something went wrong...", {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });
          }
        } else {
          clearSessionInfo();
          window.location.reload(false).then(props.history.replace("/"));
        }
      })
      .catch((err) => {
        props.toggleSpinner(false);

        if (axios.isCancel(err)) {
          console.log("request canceled");
        } else {
          console.log("request failed");
        }
      });
  };




  const get_profile = (departments) => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
    };

    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${WS_LINK}get_user_detail`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        props.toggleSpinner(false);
        if (res.data !== "role error" && res.data !== "token error") {
          if (res.data.length === 1) {
            setLoaded(true);
            const mobileCode = res.data[0].user_mobile
              ? res.data[0].user_mobile.substr(
                0,
                res.data[0].user_mobile.indexOf(" ")
              )
              : "";
            const officeCode = res.data[0].user_office_number
              ? res.data[0].user_office_number.substr(
                0,
                res.data[0].user_office_number.indexOf(" ")
              )
              : "";


            // eslint-disable-next-line eqeqeq
            const dept = departments.filter(item => item.option_id == res.data[0].user_department)

            setUpdateObj({
              name: res.data[0].user_name,
              email: res.data[0].user_email,
              mobileNumber: res.data[0].user_mobile
                ? res.data[0].user_mobile.substr(
                  res.data[0].user_mobile.indexOf(" ") + 1
                )
                : "",
              mobileCode: { value: mobileCode, label: mobileCode },
              officeNumber: res.data[0].user_office_number
                ? res.data[0].user_office_number.substr(
                  res.data[0].user_office_number.indexOf(" ") + 1
                )
                : "",
              officeCode: officeCode && {
                value: officeCode,
                label: officeCode,
              },
              jobRole: {
                value: res.data[0].user_role,
                label: res.data[0].user_role,
              },
              gender: res.data[0].user_gender,
              department: dept.length > 0 ? { value: dept[0].option_id, label: getSessionInfo('language') === 'arabic' ? dept[0].option_value_a : dept[0].option_value_e } : '',
            });



          } else {
            toast.error("something went wrong...", {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });
          }
        } else {
          clearSessionInfo();
          window.location.reload(false).then(props.history.replace("/"));
        }
      })
      .catch((err) => {
        props.toggleSpinner(false);

        if (axios.isCancel(err)) {
          console.log("request canceled");
        } else {
          console.log("request failed");
        }
      });

  };




  useEffect(() => {
    reset(updateObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateObj]);






  const onSubmit = (data) => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    let postedData;
    if (getSessionInfo("role") === 3) {
      postedData = {
        userid: getSessionInfo("id"),
        token: getSessionInfo("token"),
        name: updateObj.name,
        country_code_1: updateObj.mobileCode.value,
        phone: updateObj.mobileNumber,
        country_code_2:
          watch("officeCode") !== null && watch("officeCode").length !== 0
            ? data.officeCode.value
            : "",
        office_number: data.officeNumber,
        job: otherInputOpen.jobRole ? updateObj.otherJobRole : updateObj.jobRole.value,
        department: '',
        department_spec: ''
      };
    } else {
      postedData = {
        userid: getSessionInfo("id"),
        token: getSessionInfo("token"),
        name: updateObj.name,
        country_code_1: updateObj.mobileCode.value,
        phone: updateObj.mobileNumber,
        country_code_2:
          watch("officeCode") !== null && watch("officeCode").length !== 0
            ? data.officeCode.value
            : "",
        office_number: data.officeNumber,
        job: updateObj.jobRole.value,
        id_to_edit: parseInt(user_id),
        department: updateObj.department.value,
        department_spec: otherInputOpen.department ? data.otherDepartment : ''
      };
    }


    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${!(
        user_id !== undefined &&
        getSessionInfo("id") !== user_id &&
        getSessionInfo("role") === 4
      )
        ? WS_LINK + "update_user_detail"
        : WS_LINK + "admin_update_user_detail"
        }`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        props.toggleSpinner(false);

        if (user_id !== getSessionInfo("id") && getSessionInfo("role") === 4)
          setModalPath("/cnam_users");
        else setModalPath("/dashboard");
        setMailModal(true);
      })
      .catch((err) => {
        props.toggleSpinner(false);
        toast.error("Something went wrong...", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        });

        if (axios.isCancel(err)) {
          console.log("request canceled");
        } else {
          console.log("request failed");
        }
      });
  };




  let avatarName = '';
  if (getSessionInfo("loggedIn")) {
    const name = getSessionInfo("name");
    const names = name.split(" ");
    for (let i = 0; i < names.length && i < 3; i++) {
      names[i] = names[i].charAt(0).toUpperCase();
      avatarName += names[i];
    }
  }












  return (
    <>
      {loaded && (
        <>
          <div className="container-fluid editProfileContainer">
            {mailModal && (
              <div className="col-12">
                <SuccessModal
                  props={props}
                  state={mailModal}
                  toggleState={closeModal}
                  message={getSessionInfo('language') === 'arabic' ? '!تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully!'}
                  path={modalPath}
                />
              </div>
            )}
            {forgotModal && (
              <div className="col-12">
                <ForgotModal
                  props={props}
                  state={forgotModal}
                  toggleState={closeforgotModal}
                  email={updateObj.email}
                />
              </div>
            )}


            {/* ////////////////////////////////////////////////////////////////// */}
            {/* ////////////////////////////////////////////////////////////////// */}
            {/* ////////////////////////////////////////////////////////////////// */}
            {/* ////////////////////////////////////////////////////////////////// */}
            {/* ////////////////////////////////////////////////////////////////// */}
            {getSessionInfo('language') === 'arabic' ?
              <>
                <div
                  className="mt-3 back text-right"
                  style={{ color: "rgb(198 2 36)", fontFamily: 'cnam-bold-ar' }}
                  onClick={() => props.history.goBack()}
                >
                  <ArrowBackIosIcon
                    style={{ fontSize: "13px", marginTop: "-2px", transform: 'rotate(180deg)' }}
                  />
                  عودة
                </div>

                <div className="mt-4 mb-3">
                  <h5
                    className="text-right"
                    style={{ fontFamily: "cnam-bold-ar", fontSize: "1.3rem" }}
                  >
                    تعديل الملف الشخصي
                  </h5>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="row">
                  <div className="d-flex col-12 col-md-6 circlemob_wrapper">
                    <div className="mt-2 ml-3 ">
                      <div className='text-right'>
                        <Avatar
                          className="circlemob"
                          style={{
                            backgroundColor: "rgb(198 2 36)",
                            fontSize: "28px",
                            width: "70px",
                            height: "70px",
                          }}
                        >
                          {avatarName}
                        </Avatar>
                      </div>
                    </div>

                    <div className="flex-fill">
                      <div className="text-right">
                        <div
                          className=" mb-1 mt-2 text-right"
                          style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}
                        >
                          الاسم *
                        </div>
                        <div className="row pl-1 pr-1 d-md-flex">
                          <Controller
                            render={() => (
                              <InputText
                                name="name"
                                value={updateObj.name}
                                placeholder="الاسم"
                                className="col-12 ml-md-2 ml-lg-1"
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                                style={{
                                  border: errors.name ? "1px solid red" : "",
                                }}
                              />
                            )}
                            rules={{ required: true }}
                            name="name"
                            control={control}
                          />
                        </div>
                        {errors.name && errors.name.type === "required" && (
                          <span className="errors" style={{ fontFamily: 'cnam-ar' }}>الاسم مطلوب.</span>
                        )}
                        <div
                          className=" mb-1 mt-4 col-12 pr-0"
                          style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}
                        >
                          البريد الإلكتروني *
                        </div>

                        <InputText
                          type="email"
                          name="email"
                          placeholder="رجاءا أدخل بريدك الإلكتروني"
                          className="col-12 mb-3"
                          value={updateObj.email}
                          onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                          }
                          disabled={true}
                        />

                        <div
                          className=" mb-1 mt-4"
                          style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}
                        >
                          رقم الهاتف المحمول *
                        </div>

                        <div
                          className={`d-flex ${errors.mobileCode || errors.mobileNumber
                            ? "mb-2"
                            : "mb-4"
                            } col-11 col-md-12 pr-0`}
                        >
                          <Controller
                            render={() => (
                              <Selector
                                name="mobileCode"
                                value={updateObj.mobileCode}
                                onChange={(e) => handleChange("mobileCode", e)}
                                options={[{ value: "+966", label: "+966" }]}
                                placeholder="+966"
                                className={`col-4 ml-1 pr-0 col-sm-3 ${errors.mobileCode && "border_form_selector"
                                  }`}
                                style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                              />
                            )}
                            rules={{ required: true }}
                            name="mobileCode"
                            control={control}
                          />
                          {errors.mobileCode &&
                            errors.mobileCode.type === "required" && (
                              <span className="errors" style={{ fontFamily: 'cnam-ar' }}>
                                رمز الهاتف المحمول مطلوب.
                              </span>
                            )}
                          <Controller
                            render={() => (
                              <InputNumeric
                                name="mobileNumber"
                                value={updateObj.mobileNumber}
                                placeholder="۰۰ ۰۰۰ ۰۰۰"
                                className="col-9"
                                format="## ### ####"
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                                style={{
                                  border: errors.mobileNumber
                                    ? "1px solid red"
                                    : "",
                                  textAlign: 'right',
                                  direction: 'ltr'
                                }}
                              />
                            )}
                            rules={{
                              required: true,
                              // eslint-disable-next-line no-useless-escape
                              pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
                            }}
                            name="mobileNumber"
                            control={control}
                          />

                        </div>
                        {errors.mobileNumber &&
                          errors.mobileNumber.type === "required" && (
                            <span className="errors" style={{ fontFamily: 'cnam-ar' }}>
                              رقم الهاتف المحمول مطلوب.
                            </span>
                          )}
                        {errors.mobileNumber &&
                          errors.mobileNumber.type === "pattern" && (
                            <span className="errors" style={{ fontFamily: 'cnam-ar' }}>
                              رقم الجوال غير صحيح.
                            </span>
                          )}

                        <div
                          className=" mb-1 mt-3"
                          style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}
                        >
                          رقم هاتف المكتب{" "}
                        </div>

                        <div
                          className={`d-flex ${errors.officeCode || errors.officeNumber
                            ? "mb-2"
                            : "mb-4"
                            } col-11 col-md-12 pr-0`}
                        >
                          <Controller
                            render={() => (
                              <Selector
                                name="officeCode"
                                isClearable
                                value={
                                  updateObj.officeCode &&
                                    updateObj.officeCode.value !== ""
                                    ? updateObj.officeCode
                                    : null
                                }
                                onChange={(e) => handleChange("officeCode", e)}
                                className={`col-4 ml-1 pr-0 col-md-3 ${errors.officeCode && "border_form_selector"
                                  }`}
                                options={[{ value: "+966", label: "+966" }]}
                                placeholder="+966"
                              />
                            )}
                            // <Selector
                            rules={
                              updateObj.officeNumber.length > 0 && {
                                required: true,
                              }
                            }
                            name="officeCode"
                            control={control}
                          />

                          <Controller
                            render={() => (
                              <InputNumeric
                                name="officeNumber"
                                className=" col-9"
                                value={updateObj.officeNumber}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                                placeholder="۰۰ ۰۰۰ ۰۰۰"
                                format="## ### ####"
                                style={{
                                  border: errors.officeNumber
                                    ? "1px solid red"
                                    : "",
                                  textAlign: 'right',
                                  direction: 'ltr'
                                }}
                              />
                            )}
                            rules={
                              // eslint-disable-next-line no-useless-escape
                              watch("officeCode") !== null &&
                                watch("officeCode").length !== 0 &&
                                watch("officeCode").value !== ""
                                ? {
                                  required: true,
                                  // eslint-disable-next-line no-useless-escape
                                  pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
                                }
                                : {
                                  required: false,
                                  // eslint-disable-next-line no-useless-escape
                                  pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
                                }
                              // eslint-disable-next-line no-useless-escape
                            }
                            name="officeNumber"
                            control={control}
                          />
                        </div>
                        {errors.officeCode && (
                          <span className="errors" style={{ fontFamily: 'cnam-ar' }}>كود المكتب مطلوب.</span>
                        )}

                        {errors.officeNumber &&
                          errors.officeNumber.type === "pattern" && (
                            <span className="errors_c" style={{ fontFamily: 'cnam-ar' }}>
                              رقم المكتب غير صالح.
                            </span>
                          )}
                        {errors.officeNumber &&
                          errors.officeNumber.type === "required" && (
                            <span className="errors_c" style={{ fontFamily: 'cnam-ar' }}>
                              رقم المكتب مطلوب.
                            </span>
                          )}


                        {(getSessionInfo('role') === 1) &&
                          <>
                            <div className="col-12 mb-2 mt-4 p-0" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>قسمك: *</div>
                            <div className="col-12 p-0">
                              <Controller
                                render={({ field: { onChange, value } }) => (
                                  <Selector
                                    name="department"
                                    value={updateObj.department}
                                    className={errors.department && "border_form_selector"}
                                    onChange={(e) => { handleChange('department', e); handleOtherInputs(e !== null && e.value === 50, 'department') }}
                                    options={retrievedData.departments}
                                    placeholder="حدد قسمك"
                                    isClearable
                                    style={{ boxShadow: "0px 1px 3px -2px #888888", border: errors.department ? '1px solid red' : '' }}
                                  />
                                )}
                                rules={{ required: true }}
                                name="department"
                                control={control}
                                style={{ boxShadow: "0px 1px 3px -2px #888888", border: errors.department ? '1px solid red' : '' }}
                              />
                              {errors.department && (
                                <span className="errors">مطلوب الإدارة.</span>
                              )}
                              {
                                otherInputOpen.department &&
                                <>
                                  <Controller
                                    render={({ field: { onChange, value } }) => (
                                      <InputText
                                        value={value}
                                        onChange={onChange}
                                        placeholder="الرجاء إدخال إجابة قصيرة"
                                        style={{
                                          border: errors.otherDepartment ? "1px solid red" : "",
                                        }}
                                        className="mt-2"
                                      />
                                    )}
                                    rules={{ required: true }}
                                    name="otherDepartment"
                                    control={control}
                                  />
                                  {errors.otherDepartment && (
                                    <span className="errors">إجابة قصيرة مطلوبة.</span>
                                  )}
                                </>
                              }
                            </div>
                          </>
                        }



                        <div
                          className=" mb-1 mt-4"
                          style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}
                        >
                          دور / المنصب الوظيفي الخاص بك
                        </div>

                        <Selector
                          name="jobRole"
                          value={
                            updateObj.jobRole.value !== null
                              ? updateObj.jobRole
                              : null
                          }
                          // defaultValue={updateObj.jobRole ? updateObj.jobRole : ''}
                          options={[
                            { value: "Team Leader", label: "قائد الفريق" },
                            { value: "Manager", label: "مدير" },
                            { value: "Head Assistant Manager", label: "رئيس مساعد مدير" },
                            { value: "Executive Director", label: "مدير تنفيذي" },
                            { value: "Coordinator", label: "منسق" },
                            { value: "Administrator", label: "مدير" },
                            { value: "Researcher ", label: "الباحث " },
                            { value: "Technical ", label: "اصطلاحي " },
                            { value: "Other", label: "آخر" },
                          ]}
                          onChange={(e) => { handleChange("jobRole", e); handleOtherInputs(e.value === 'Other', 'jobRole') }}
                          placeholder="حدد المسمى الوظيفي"
                          className="mb-4 pr-0 mr-0 text-right"
                        />

                        {
                          otherInputOpen.jobRole &&
                          <div className="mb-4">
                            <Controller
                              render={() => (
                                <InputText
                                  value={updateObj.otherJobRole}
                                  name="otherJobRole"
                                  placeholder="يرجى تحديد"
                                  className="col-12"
                                  onChange={(e) =>
                                    handleChange(e.target.name, e.target.value)
                                  }
                                  style={{
                                    border: errors.otherJobRole ? "1px solid red" : "",
                                  }}
                                />
                              )}
                              rules={{ required: true }}
                              name="otherJobRole"
                              control={control}
                            />
                            {errors.otherJobRole && (
                              <span className="errors">المواصفات مطلوبة.</span>
                            )}
                          </div>
                        }

                        <div className="d-flex mb-3">
                          <Button
                            className="mr-auto ml-3 Btncancel"
                            onClick={() => props.history.goBack()}
                            style={{ fontFamily: 'cnam-ar' }}
                          >
                           إلغاء  
                          </Button>
                          <Button className="btnsave px-4" style={{ fontFamily: 'cnam-ar' }} type="submit">
                           حفظ  
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mt-4 d-flex h-100">
                    {user_id === undefined && getSessionInfo("role") !== 4 && (
                      <Button
                        className="col-12 col-md-5 col-lg-5 col-xl-4 mt-2 mt-md-2 ml-lg-4 justify-content-start"
                        style={{
                          fontWeight: "600",
                          background: "rgb(198 2 36)",
                          border: "none",
                          paddingTop: '0.65rem',
                          paddingBottom: '0.7rem',
                          textAlign: 'center',
                          top: '0.5%',
                          fontFamily: 'cnam-ar'
                        }}
                        onClick={closeforgotModal}
                      >
                        تغيير كلمة المرور
                      </Button>
                    )}
                  </div>
                </form>
              </>
              :

              /////////////////////////////////////////////////////////////////////////////////////////////////////////
              /////////////////////////////////////////////////////////////////////////////////////////////////////////
              /////////////////////////////////////////////////////////////////////////////////////////////////////////
              /////////////////////////////////////////////////////////////////////////////////////////////////////////
              /////////////////////////////////////////////////////////////////////////////////////////////////////////
              <>
                <div
                  className="mt-3 back"
                  style={{ color: "rgb(198 2 36)" }}
                  onClick={() => props.history.goBack()}
                >
                  <ArrowBackIosIcon
                    style={{ fontSize: "13px", marginTop: "-2px" }}
                  />
                  Back
                </div>

                <div className="mt-4 mb-3">
                  <h5
                    className=""
                    style={{ fontFamily: "cnam-bold", fontSize: "1.3rem" }}
                  >
                    Edit Profile
                  </h5>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="row">
                  <div className="d-flex col-12 col-md-6 circlemob_wrapper">
                    <div className="mt-2 mr-3 ">
                      <div>
                        <Avatar
                          className="circlemob"
                          style={{
                            backgroundColor: "rgb(198 2 36)",
                            fontSize: "28px",
                            width: "70px",
                            height: "70px",
                          }}
                        >
                          {avatarName}
                        </Avatar>
                      </div>
                    </div>

                    <div className="flex-fill">
                      <div className="">
                        <div
                          className=" mb-1 mt-2"
                          style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}
                        >
                          Name *
                        </div>
                        <div className="row pl-1 pr-1 d-md-flex">
                          <Controller
                            render={() => (
                              <InputText
                                name="name"
                                value={updateObj.name}
                                placeholder="Name"
                                className="col-12"
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                                style={{
                                  border: errors.name ? "1px solid red" : "",
                                }}
                              />
                            )}
                            rules={{ required: true }}
                            name="name"
                            control={control}
                          />
                        </div>
                        {errors.name && errors.name.type === "required" && (
                          <span className="errors">Name is required.</span>
                        )}
                        <div
                          className=" mb-1 mt-4 col-12 pl-0"
                          style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}
                        >
                          Email *
                        </div>

                        <InputText
                          type="email"
                          name="email"
                          placeholder="Please enter your email"
                          className="col-12 mb-3"
                          value={updateObj.email}
                          onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                          }
                          disabled={true}
                        />

                        <div
                          className=" mb-1 mt-4"
                          style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}
                        >
                          Mobile Number *
                        </div>

                        <div
                          className={`d-flex ${errors.mobileCode || errors.mobileNumber
                            ? "mb-2"
                            : "mb-4"
                            } col-11 col-md-12 pl-0`}
                        >
                          <Controller
                            render={() => (
                              <Selector
                                name="mobileCode"
                                value={updateObj.mobileCode}
                                onChange={(e) => handleChange("mobileCode", e)}
                                options={[{ value: "+966", label: "+966" }]}
                                placeholder="+966"
                                className={`col-4 mr-1 pl-0 col-sm-3 ${errors.mobileCode && "border_form_selector"
                                  }`}
                                style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                              />
                            )}
                            rules={{ required: true }}
                            name="mobileCode"
                            control={control}
                          />
                          {errors.mobileCode &&
                            errors.mobileCode.type === "required" && (
                              <span className="errors">
                                Mobile Code is required.
                              </span>
                            )}
                          <Controller
                            render={() => (
                              <InputNumeric
                                name="mobileNumber"
                                value={updateObj.mobileNumber}
                                placeholder="50 xxx xxxx"
                                className="col-9"
                                format="## ### ####"
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                                style={{
                                  border: errors.mobileNumber
                                    ? "1px solid red"
                                    : "",
                                }}
                              />
                            )}
                            rules={{
                              required: true,
                              // eslint-disable-next-line no-useless-escape
                              pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
                            }}
                            name="mobileNumber"
                            control={control}
                          />

                        </div>
                        {errors.mobileNumber &&
                          errors.mobileNumber.type === "required" && (
                            <span className="errors">
                              Mobile number is required.
                            </span>
                          )}
                        {errors.mobileNumber &&
                          errors.mobileNumber.type === "pattern" && (
                            <span className="errors">
                              Mobile number is invalid.
                            </span>
                          )}

                        <div
                          className=" mb-1 mt-3"
                          style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}
                        >
                          Office Phone Number{" "}
                        </div>

                        <div
                          className={`d-flex ${errors.officeCode || errors.officeNumber
                            ? "mb-2"
                            : "mb-4"
                            } col-11 col-md-12 pl-0`}
                        >
                          <Controller
                            render={() => (
                              <Selector
                                name="officeCode"
                                isClearable
                                value={
                                  updateObj.officeCode &&
                                    updateObj.officeCode.value !== ""
                                    ? updateObj.officeCode
                                    : null
                                }
                                onChange={(e) => handleChange("officeCode", e)}
                                className={`col-4 mr-1 pl-0 col-sm-3 ${errors.officeCode && "border_form_selector"
                                  }`}
                                options={[{ value: "+966", label: "+966" }]}
                                placeholder="+966"
                              />
                            )}
                            // <Selector
                            rules={
                              updateObj.officeNumber.length > 0 && {
                                required: true,
                              }
                            }
                            name="officeCode"
                            control={control}
                          />

                          <Controller
                            render={() => (
                              <InputNumeric
                                name="officeNumber"
                                className="col-9"
                                value={updateObj.officeNumber}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                                placeholder="50 xxx xxxx"
                                format="## ### ####"
                                style={{
                                  border: errors.officeNumber
                                    ? "1px solid red"
                                    : "",
                                }}
                              />
                            )}
                            rules={
                              // eslint-disable-next-line no-useless-escape
                              watch("officeCode") !== null &&
                                watch("officeCode").length !== 0 &&
                                watch("officeCode").value !== ""
                                ? {
                                  required: true,
                                  // eslint-disable-next-line no-useless-escape
                                  pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
                                }
                                : {
                                  required: false,
                                  // eslint-disable-next-line no-useless-escape
                                  pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
                                }
                              // eslint-disable-next-line no-useless-escape
                            }
                            name="officeNumber"
                            control={control}
                          />
                        </div>
                        {errors.officeCode && (
                          <span className="errors">Office code is required.</span>
                        )}

                        {errors.officeNumber &&
                          errors.officeNumber.type === "pattern" && (
                            <span className="errors_c">
                              Office number is invalid.
                            </span>
                          )}
                        {errors.officeNumber &&
                          errors.officeNumber.type === "required" && (
                            <span className="errors_c">
                              Office number is required.
                            </span>
                          )}




                        {getSessionInfo('role') === 1 && <>
                          <div className="col-12 mb-2 mt-4 p-0" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>Your Department: *</div>
                          <div className="col-12 p-0">
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <Selector
                                  name="department"
                                  value={updateObj.department}
                                  className={errors.department && "border_form_selector"}
                                  onChange={(e) => { handleChange('department', e); handleOtherInputs(e !== null && e.value === 50, 'department') }}
                                  options={retrievedData.departments}
                                  placeholder="Select your department"
                                  isClearable
                                  style={{ boxShadow: "0px 1px 3px -2px #888888", border: errors.department ? '1px solid red' : '' }}
                                />
                              )}
                              rules={{ required: true }}
                              name="department"
                              control={control}
                              style={{ boxShadow: "0px 1px 3px -2px #888888", border: errors.department ? '1px solid red' : '' }}
                            />
                            {errors.department && (
                              <span className="errors">The department is required.</span>
                            )}
                            {
                              otherInputOpen.department &&
                              <>
                                <Controller
                                  render={({ field: { onChange, value } }) => (
                                    <InputText
                                      value={value}
                                      onChange={onChange}
                                      placeholder="please enter a short answer"
                                      style={{
                                        border: errors.otherDepartment ? "1px solid red" : "",
                                      }}
                                      className="mt-2"
                                    />
                                  )}
                                  rules={{ required: true }}
                                  name="otherDepartment"
                                  control={control}
                                />
                                {errors.otherDepartment && (
                                  <span className="errors">Short answer is required.</span>
                                )}
                              </>
                            }
                          </div>
                        </>}



                        <div
                          className=" mb-1 mt-4"
                          style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}
                        >
                          Your Job Role/Position
                        </div>

                        <Selector
                          name="jobRole"
                          value={
                            updateObj.jobRole.value !== null
                              ? updateObj.jobRole
                              : null
                          }
                          // defaultValue={updateObj.jobRole ? updateObj.jobRole : ''}
                          options={[
                            { value: "Team Leader", label: "Team Leader" },
                            { value: "Manager", label: "Manager" },
                            { value: "Head Assistant Manager", label: "Head Assistant Manager" },
                            { value: "Executive Director", label: "Executive Director" },
                            { value: "Coordinator", label: "Coordinator" },
                            { value: "Administrator", label: "Administrator" },
                            { value: "Researcher ", label: "Researcher " },
                            { value: "Technical ", label: "Technical " },
                            { value: "Other", label: "Other" },
                          ]}
                          onChange={(e) => { handleChange("jobRole", e); handleOtherInputs(e.value === 'Other', 'jobRole') }}
                          placeholder="Select job role"
                          className="mb-4 pr-0 mr-0"
                        />

                        {
                          otherInputOpen.jobRole &&
                          <div className="mb-4">
                            <Controller
                              render={() => (
                                <InputText
                                  value={updateObj.otherJobRole}
                                  name="otherJobRole"
                                  placeholder="Please specify"
                                  className="col-12"
                                  onChange={(e) =>
                                    handleChange(e.target.name, e.target.value)
                                  }
                                  style={{
                                    border: errors.otherJobRole ? "1px solid red" : "",
                                  }}
                                />
                              )}
                              rules={{ required: true }}
                              name="otherJobRole"
                              control={control}
                            />
                            {errors.otherJobRole && (
                              <span className="errors">Specification is required.</span>
                            )}
                          </div>
                        }

                        <div className="d-flex mb-3">
                          <Button
                            className="ml-auto mr-2 Btncancel"
                            onClick={() => props.history.goBack()}
                          >
                            Cancel
                          </Button>
                          <Button className="btnsave px-4" type="submit">
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mt-4">
                    {user_id === undefined && getSessionInfo("role") !== 4 && (
                      <Button
                        className="col-12 col-md-5 col-lg-5 col-xl-4 mt-2 mt-md-2 ml-lg-4"
                        style={{
                          fontWeight: "600",
                          background: "rgb(198 2 36)",
                          border: "none",
                          paddingTop: '0.65rem',
                          paddingBottom: '0.7rem',
                          textAlign: 'center',
                          top: '0.5%'
                        }}
                        onClick={closeforgotModal}
                      >
                        Change password
                      </Button>
                    )}
                  </div>
                </form>
              </>
            }
          </div>
        </>
      )}
    </>
  );
}










/*   <Selector
                                name="mobileCode"
                                value={updateObj.mobileCode}
                                options={[{ value: "+966", label: "+966" }]}
                                onChange={(e) =>
                                    handleChange('mobileCode', e)
                                  }
                                className="col-4 pl-0 col-sm-3"
                                placeholder="+966"

                            /> */




/*   <InputNumeric
                        name="mobileNumber"
                        value={updateObj.mobileNumber}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                        placeholder="50 xxx xxxx"
                        format="## ### ####"
                        className="col-8 col-sm-9"
                      /> */




/*  <InputText
        type='text'
        name='name'
        placeholder='Please enter your name'
        className="mb-3"
        value={updateObj.name}
        onChange={(e) =>
            handleChange(e.target.name, e.target.value)
          }
    />
      <div className=" mb-1 mt-4" style={{fontFamily: "cnam-bold",fontSize:'0.92rem'}}>Gender</div>

<div className=" mt-1 noP pr-0" style={{position:'relative', top:'-5px'}}>

  <RadioGroup value={updateObj.gender}  className="">
    <div className="d-flex">
    <FormControlLabel
      value="male"
      control={<Radio icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} size="small" style={{ color: "rgb(198 2 36)" }} />}
      label="Male"
    />
    <FormControlLabel
      value="female"
      control={<Radio icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} size="small" style={{ color: "rgb(198 2 36)" }} />}
      label="Female"
    />
    </div>
  </RadioGroup>
</div> */










/*  const admin_edit_request = ( ) => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            name: updateObj.name,
            country_code_1: updateObj.mobileCode.value,
            phone: updateObj.mobileNumber,
            country_code_2: updateObj.officeCode.value,
            office_number: updateObj.officeNumber,
            job: updateObj.jobRole.value,
            id_to_edit: parseInt(user_id)
        }

        props.toggleSpinner(true)
        axios({
            method: "post",
            url: `${WS_LINK}admin_update_user_detail`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                props.toggleSpinner(false)
                setMailModal(true)
            }
            )
            .catch(err => {

                props.toggleSpinner(false)
                toast.error('Something went wrong...', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    })

                if (axios.isCancel(err)) {
                    console.log('request canceled')
                }
                else {
                    console.log("request failed")
                }

            });
    }
 */

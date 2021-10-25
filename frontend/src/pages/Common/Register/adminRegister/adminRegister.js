import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

import { Button } from "reactstrap";
import { toast } from "react-toastify";
import Loader from "react-loader-advanced";

import { WS_LINK } from "../../../../globals";
import { getSessionInfo, setSessionInfo, clearSessionInfo } from "../../../../variable";
import { Helmet } from "react-helmet";

import InputNumeric from "../../../../components/InputNumeric/InputNumeric";
import InputText from "../../../../components/InputText/InputText";
import Selector from "../../../../components/Selector/Selector";
import Simple from "../../../../containers/Simple";
import Spinner from "../../../../components/spinner/Spinner";
import Modal from '../../../../components/Modal/Modal'

import check from '../../../../assets/images_png/check.png'

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import Checkbox from '@material-ui/core/Checkbox';
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import "../../../../App.css";
import '../Register.css'



const jobRoleOptions = [{ value: "Team Leader", label: "Team Leader" },
{ value: "Manager", label: "Manager" },
{ value: "Head Assistant Manager", label: "Head Assistant Manager" },
{ value: "Executive Director", label: "Executive Director" },
{ value: "Coordinator", label: "Coordinator" },
{ value: "Administrator", label: "Administrator" },
{ value: "Researcher ", label: "Researcher " },
{ value: "Technical ", label: "Technical " },
{ value: "Other", label: "Other" },]


const jobRoleOptions_ar = [
  { value: "Team Leader", label: "قائد الفريق" },
  { value: "Manager", label: "مدير" },
  { value: "Head Assistant Manager", label: "رئيس مساعد مدير" },
  { value: "Executive Director", label: "مدير تنفيذي" },
  { value: "Coordinator", label: "منسق" },
  { value: "Administrator", label: "مدير" },
  { value: "Researcher ", label: "الباحث " },
  { value: "Technical ", label: "اصطلاحي " },
  { value: "Other", label: "آخر" },
]



export default function AdminRegister(props) {

  if (getSessionInfo("loggedIn")) {
    props.history.replace("/dashboard");
  }

  let { name, email, token, role } = useParams()

  name = decodeURIComponent(atob(name));
  email = decodeURIComponent(atob(email));
  role = decodeURIComponent(atob(role));


  const [retrievedData, setRetrievedData] = useState({
    departments: []
  })



  const tmpData = useRef('')

  useEffect(() => {

    if (role === 1 || role === '1') {
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
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("request canceled");
          } else {
            console.log("request failed");
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])




  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      mobileCode: [],
      mobileNumber: '',
      officeCode: [],
      officeNumber: '',
      department: '',
      otherDepartment: '',
    }
  });

  // * /////////////////////////////// STATES

  const [passwordVisiblity, setPassWordVisibility] = useState({
    password: "password",
    confirmPassword: "password",
  });

  const [modalState, setModalState] = useState(false)

  const [exist, setExist] = useState({
    username: '',
    phone: ''
  })

  const [loaderState, setLoaderState] = useState(false);

  const [registerObj, setRegisterObj] = useState({
    name: "",
    officeCode: "",
    officeNumber: "",
    jobRole: "",
    newsletter: false
  });


  const [otherInputsOpen, setOtherInputsOpen] = useState({
    jobRole: false
  })

  const checkRoleValue = (isOther, name) => {
    if (isOther && !otherInputsOpen[name]) setOtherInputsOpen({ ...otherInputsOpen, [name]: true })
    else if (!isOther && otherInputsOpen[name]) setOtherInputsOpen({ ...otherInputsOpen, [name]: false })
  }


  // * /////////////////////////////// SET STATES
  const toggleModalState = () => {
    setModalState(!modalState)
  }

  const handleChange = (name, value) => {
    setRegisterObj({ ...registerObj, [name]: value });
  };

  const handlePasswordVisibility = (name) => {
    if (passwordVisiblity[name] === "password")
      setPassWordVisibility({ ...passwordVisiblity, [name]: "text" });
    else if (passwordVisiblity[name] === "text")
      setPassWordVisibility({ ...passwordVisiblity, [name]: "password" });
  };


  const handleCheckbox = (e) => {
    if (e.target.checked)
      setRegisterObj({ ...registerObj, "newsletter": true })
    else setRegisterObj({ ...registerObj, "newsletter": false })

  }



  //////////////////// FUNCTIONS
  const scroll = () => {

    document.getElementById('name').scrollIntoView({ behavior: 'smooth' })

  }


  const onSubmit = (data) => {

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const postedData = {
      username: data.username,
      email: email,
      pass: data.password,
      country_code_1: data.mobileCode.value,
      phone: data.mobileNumber,
      country_code_2: (watch('officeCode') && watch('officeCode').length > 0 && watch('officeNumber') && watch('officeNumber').length > 0) ? data.officeCode.value : '',
      office_number: (watch('officeCode') && watch('officeCode').length > 0 && watch('officeNumber') && watch('officeNumber').length > 0) ? data.officeNumber : '',
      job: otherInputsOpen.jobRole ? data.otherJobRole : registerObj.jobRole !== null ? registerObj.jobRole.value : '',
      gender: data.radio_gender,
      token: token,
      newsletter: registerObj.newsletter,
      // eslint-disable-next-line eqeqeq
      department: role == 1 ? data.department.value : '',
      // eslint-disable-next-line eqeqeq
      department_spec: role == 1 ? otherInputsOpen.department ? data.otherDepartment : '' : ''
    };

    setLoaderState(true);
    axios({
      method: "post",
      url: `${WS_LINK}update_admin_new_user`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        setLoaderState(false);
        if (res.data === 0) {
          toast.error("failed to register", {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
        } else {

          if (res.data[0] === 1 || res.data[1] === 1) {
            setExist({ username: res.data[0], phone: res.data[1] })
          }


          else {
            // if register successful
            tmpData.current = res.data[0][0]
            toggleModalState()
          }

        }
      })
      .catch((err) => {

        setLoaderState(false);

        toast.error(`${err.message}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
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






  const Login = () => { //* ****** function that login the user if registered successfully

    clearSessionInfo() // always clear the session before login
    setSessionInfo({ name: "role", val: tmpData.current.role_id })
    setSessionInfo({ name: "id", val: tmpData.current.user_id })
    setSessionInfo({ name: "loggedIn", val: true })
    setSessionInfo({ name: "token", val: tmpData.current.token })
    setSessionInfo({ name: "name", val: tmpData.current.user_name })

    props.history.push('/dashboard')
    toast.success(
      getSessionInfo('language') === 'english' ? `Welcome ${tmpData.current.user_name}`
        :
        `${tmpData.current.user_name} أهلا `
      , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        style: { textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }
      })
  }




  //*  ///////////////// MODAL BODY 
  const successModal =
    <>
      {getSessionInfo("language") === "english" ? (
        <>
          <div className="row ml-auto">
            <Button className="text-right pr-2" color='link close' onClick={Login}>X</Button>
          </div>

          <div className="col-12 text-center">
            <h6 className="text-center">
              <div className="text-center">
                <div><img src={check} width={75} alt="" /></div>
                <div className="font-weight-bold mt-4 mb-4">Account Successfully Activated</div>
                <div className="text-center">
                  <Button onClick={Login} className="px-5 mb-2" style={{ color: 'black', borderColor: 'rgb(198 2 36)', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: '500' }}>Proceed to Dashboard</Button>
                </div>
              </div>


            </h6>
          </div>
        </>
      )

        : // SUCCCESS MODAL ARABIC

        (
          <>
            <div className="row mr-auto">
              <Button className="text-left pl-2" color='link close' onClick={Login}>X</Button>
            </div>

            <div className="col-12 text-center">
              <h6 className="text-center">
                <div className="text-center">
                  <div><img src={check} width={75} alt="" /></div>
                  <div className=" mt-4 mb-4" style={{ fontFamily: 'cnam-bold-ar' }}>تم تنشيط الحساب بنجاح</div>
                  <div className="text-center">
                    <Button onClick={Login} className="px-5 mb-2" style={{ color: 'black', borderColor: 'rgb(198 2 36)', backgroundColor: 'transparent', fontFamily: 'cnam-ar' }}>انتقل إلى لوحة إدارة المنصة</Button>
                  </div>
                </div>


              </h6>
            </div>
          </>
        )
      }
    </>














  return (
    ((role === 1 || role === '1') && retrievedData.departments.length === 0) ? <></>
      :
      <>
        <Helmet>
          <title>{getSessionInfo('language') === 'arabic' ?
            'سجل  (1) | عن برنامج الشراكة المعرفية'
            :
            'CNAM Register (1) | CNAM KPP'
          }</title>
        </Helmet>
        {getSessionInfo("language") === "english" ? (
          <Loader
            message={
              <span>
                <Spinner />{" "}
              </span>
            }
            show={loaderState}
            backgroundStyle={{ zIndex: "9999", }}
          >
            <Simple
              props={props}
              noBack={true}
              logo={true}
              left={
                <>
                  <Modal
                    name="successmodal"
                    modalState={modalState}
                    changeModalState={toggleModalState}
                    modalBody={successModal}

                  />
                  <div className="col-12 noP" style={{ fontFamily: "cnam-bold", fontSize: '1.8rem' }} id="name" >Welcome to Industry KPP</div>
                  <div className="col-12 h5 mb-4 mt-2 noP" style={{ fontSize: '1.3rem', fontWeight: '600' }}>Create your account</div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-12 mb-2 noP" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>Name *</div>

                    <div className="col-12 noP" >

                      <InputText
                        disabled={true}
                        value={name}

                      />

                    </div>

                    <div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>Gender</div>

                    <div className="col-lg-3 noP pr-0" style={{ position: 'relative', top: '-5px' }}>
                      <Controller
                        render={({ field: { onChange, value } }) => (
                          <RadioGroup value={value} onChange={onChange} className="">
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
                                className="ml-2"
                              />
                            </div>
                          </RadioGroup>
                        )}
                        rules={{ required: true }}

                        name="radio_gender"
                        control={control}
                      />
                      {errors.radio_gender && (
                        <span className="errors">Required.</span>
                      )}
                    </div>


                    <div className="col-12 mb-2 mt-4  noP" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>Email *</div>
                    <div className="col-12 noP">

                      <InputText
                        disabled={true}
                        value={email}
                      />

                    </div>

                    <div className="col-12 mb-2 mt-4  noP" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>Username *</div>
                    <div className="col-12 noP">
                      <Controller
                        render={({ field: { onChange, value } }) => (
                          <InputText
                            value={value || ''}
                            onChange={(e) => { onChange(e); setExist({ ...exist, username: '' }) }}
                            style={{ border: errors.username || exist.username === 1 ? "1px solid red" : "" }}
                            placeholder="Username"
                          />
                        )}
                        rules={{ required: true, minLength: 6, pattern: /^\S*$/ }}
                        name="username"
                        control={control}
                      />
                      {errors.username && errors.username.type === "required" && (
                        <span className="errors">Username is required.</span>
                      )}
                      {errors.username && errors.username.type === "minLength" && (
                        <span className="errors">
                          Username should be more than 6 characters.
                        </span>
                      )}
                      {errors.username && errors.username.type === "pattern" && (
                        <span className="errors">
                          Username should not have space in between.
                        </span>
                      )}
                      {exist.username === 1 && (
                        <span className="errors">Username is already taken</span>
                      )}

                    </div>

                    <div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>Password *</div>




                    <div className="col-12 noP">
                      <div className="">
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value}
                              type={passwordVisiblity.password}
                              onChange={onChange}
                              style={{
                                border: errors.password ? "1px solid red" : "",
                              }}
                              placeholder="***********"
                              className="col-12"
                            />
                          )}
                          rules={{
                            required: true,
                            pattern:
                              /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                          }}
                          name="password"
                          control={control}
                        />
                        <div
                          style={{
                            fontSize: "18px",
                            position: "absolute",
                            right: "15px",
                            top: "0px",
                          }}
                          className="col-1 pt-2 pointer show-password-icon"
                          onClick={() => handlePasswordVisibility("password")}
                        >
                          {passwordVisiblity.password === "password" ? (
                            <VisibilityIcon />
                          ) : (
                            passwordVisiblity.password === "text" && (
                              <VisibilityOffIcon />
                            )
                          )}
                        </div>
                      </div>
                      {!errors.password &&
                        <>
                          <span className=" mb-2">Password must be 8 characters at minimum.</span> <br />
                          <p className=" text-justify">
                            Password must contain at least an UpperCase, a LowerCase, a number and a special character.
                          </p>
                        </>
                      }
                      {errors.password && errors.password.type === "required" && (
                        <span className="errors">Password is required.</span>
                      )}
                      {errors.password && errors.password.type === "pattern" && (
                        <span className="errors">
                          minimum 8 characters (UpperCase, LowerCase, Number and special character)
                        </span>
                      )}
                    </div>



                    <div
                      className="col-12 mb-2 mt-4 noP"
                      style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}
                    >
                      Confirm password *
                    </div>
                    <div className="col-12 noP">
                      <div className="">
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value}
                              type={passwordVisiblity.confirmPassword}
                              onChange={onChange}
                              style={{
                                border: errors.confirmPassword ? "1px solid red" : "",
                              }}
                              placeholder="***********"
                              className="col-12"
                            />
                          )}
                          rules={{
                            required: true,
                            validate: (value) => value === watch("password"),
                            pattern:
                              /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                          }}
                          name="confirmPassword"
                          control={control}
                        />
                        <div
                          style={{
                            fontSize: "18px",
                            position: "absolute",
                            right: "15px",
                            top: "0px",
                          }}
                          className="col-1 pt-2 pointer show-password-icon"
                          onClick={() => handlePasswordVisibility("confirmPassword")}
                        >
                          {passwordVisiblity.confirmPassword === "password" ? (
                            <VisibilityIcon />
                          ) : (
                            passwordVisiblity.confirmPassword === "text" && (
                              <VisibilityOffIcon />
                            )
                          )}
                        </div>
                      </div>
                      {errors.confirmPassword &&
                        errors.confirmPassword.type === "required" && (
                          <span className="errors">
                            Confirm Password is required.
                          </span>
                        )}
                      {errors.confirmPassword &&
                        (errors.confirmPassword.type === "validate" || errors.confirmPassword.type === "pattern") && (
                          <span className="errors">Passwords do not match!</span>
                        )}
                    </div>


                    <div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>Mobile Number *</div>
                    <div className="d-md-flex">
                      <div className="col-lg-3 col-sm-3 mt-1 noP pr-0">
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Selector
                              value={value}
                              className={errors.mobileCode && "border_form_selector"}
                              onChange={onChange}
                              options={[{ value: "+966", label: "+966" }]}
                              placeholder="+966"
                            />
                          )}
                          // <Selector
                          rules={{ required: true }}
                          name="mobileCode"
                          control={control}
                        />
                        {errors.mobileCode && (
                          <span className="errors">Mobile code is required.</span>
                        )}
                      </div>
                      <div className="col-lg-9 col-sm-9 mt-1 noP">
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputNumeric
                              value={value}
                              onChange={(e) => { onChange(e); setExist({ ...exist, phone: '' }) }}
                              placeholder="50 xxx xxxx"
                              format="## ### ####"
                              style={{
                                border: errors.mobileNumber || exist.phone === 1 ? "1px solid red" : "",
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
                        {errors.mobileNumber &&
                          errors.mobileNumber.type === "required" && (
                            <span className="errors">Mobile number is required.</span>
                          )}
                        {errors.mobileNumber &&
                          errors.mobileNumber.type === "pattern" && (
                            <span className="errors">Mobile number is invalid.</span>
                          )}
                        {exist.phone === 1 && (
                          <span className="errors">Mobile number is already taken.</span>
                        )}
                      </div>
                    </div>

                    <div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>
                      Office Phone Number
                    </div>
                    <div className="d-md-flex">
                      <div className="col-lg-3 col-sm-3 mt-1 noP pr-0">
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Selector
                              isClearable
                              value={value}
                              className={errors.officeCode && "border_form_selector"}
                              onChange={onChange}
                              options={[{ value: "+966", label: "+966" }]}
                              placeholder="+966"
                            />
                          )}
                          // <Selector
                          rules={watch('officeNumber') !== '' ? { required: true } : { required: false }}
                          name="officeCode"
                          control={control}
                        />
                        {errors.officeCode && (
                          <span className="errors">Office code is required.</span>
                        )}

                      </div>
                      <div className="col-lg-9 col-sm-9 mt-1 noP">
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputNumeric
                              value={value}
                              onChange={onChange}
                              placeholder="50 xxx xxxx"
                              format="## ### ####"
                              style={{
                                border: errors.officeNumber ? "1px solid red" : "",
                              }}
                            />
                          )}
                          rules={
                            // eslint-disable-next-line no-useless-escape
                            watch('officeCode') !== null && watch('officeCode').length !== 0 ? { required: true, pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/ } : { required: false, pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/ }
                            // eslint-disable-next-line no-useless-escape

                          }
                          name="officeNumber"
                          control={control}
                        />
                        {errors.officeNumber &&
                          errors.officeNumber.type === "pattern" && (
                            <span className="errors">Office number is invalid.</span>
                          )}
                        {errors.officeNumber && errors.officeNumber.type === "required" && (
                          <span className="errors">Office number is required.</span>
                        )}

                      </div>
                    </div>


                    {(role === 1 || role === '1') && <>

                      <div className="col-12 mb-2 mt-4  noP" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>Your Department: *</div>
                      <div className="col-12 noP">
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Selector
                              name="department"
                              value={value}
                              className={errors.department && "border_form_selector"}
                              onChange={(e) => { onChange(e); checkRoleValue(e !== null && e.value === 50, 'department') }}
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
                          otherInputsOpen.department &&
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
                    </>
                    }



                    <div className="col-12 mb-2 mt-4  noP" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>Your Job Role</div>
                    <div className="col-12 noP">

                      <Selector
                        name="jobRole"
                        value={registerObj.jobRole}
                        className="w_shadow"
                        onChange={(e) => { handleChange('jobRole', e); checkRoleValue(e !== null && e.value === 'Other', 'jobRole') }}
                        options={jobRoleOptions}
                        placeholder="Select job role of position"
                        isClearable
                        style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                      />
                      {
                        otherInputsOpen.jobRole &&
                        <>
                          <Controller
                            render={({ field: { onChange, value } }) => (
                              <InputText
                                value={value}
                                onChange={onChange}
                                placeholder="please enter a short answer"
                                style={{
                                  border: errors.otherJobRole ? "1px solid red" : "",
                                }}
                                className="mt-2"
                              />
                            )}
                            rules={{ required: true }}
                            name="otherJobRole"
                            control={control}
                          />
                          {errors.otherJobRole && (
                            <span className="errors">Short answer is required.</span>
                          )}
                        </>
                      }
                      <div className="d-flex mt-4 col-lg-12 p-0" style={{ fontFamily: 'cnam', fontSize: '14px' }}>
                        <div>
                          <Checkbox
                            value={registerObj.newsletter}
                            checked={registerObj.newsletter}
                            onChange={handleCheckbox}
                            className="p-0"

                          />
                        </div>

                        <div className="ml-2" style={{ marginTop: '2px', fontWeight: '500' }}>Would you like to receive the newsletter with the latest developments from cnam innovation?</div>
                      </div>
                    </div>
                    <div className="d-sm-flex col-lg-12 p-0">
                      
                      <div className="mt-4 col-lg-4 noP ">
                        <Button
                          onClick={scroll}
                          type="submit"
                          className="ml-sm-auto d-flex"
                          style={{
                            backgroundColor: "rgb(198 2 36)",
                            border: 'none',
                            fontSize: "0.9rem",
                            padding: '0.7rem 2.4rem',


                          }}
                        >
                          Get Started
                        </Button>
                      </div>
                    </div>
                  </form>
                </>
              }
              right={
                <>
                  <div className="col-12 h5 p-0 mt-2">Sign Up To CNAM {role === 3 ? "Industry" : "Student"} KPP</div>
                  <div className="col-12 p-0 mt-2" style={{ fontSize: '17px', fontWeight: '400' }}>
                    We believe the most innovative Industries will lead the future of any industry. Therefore, we are here to support you in your R&D and growth to the next level.
                  </div>
                </>
              }
            />
          </Loader>
        )

          :
          // * ***************************************************************************************************
          // * **********************************ARABIC**********************************************
          // * ***************************************************************************************************
          // * ***************************************************************************************************
          (
            <Loader
              message={
                <span>
                  <Spinner />{" "}
                </span>
              }
              show={loaderState}
              backgroundStyle={{ zIndex: "9999", }}
            >
              <Simple
                props={props}
                noBack={true}
                logo={true}
                left={
                  <div className='text-right' style={{ fontFamily: 'cnam-ar' }}>
                    <Modal
                      name="successmodal"
                      modalState={modalState}
                      changeModalState={toggleModalState}
                      modalBody={successModal}

                    />
                    <div className="col-12 noP" style={{ fontFamily: "cnam-bold-ar", fontSize: '1.8rem' }} id="name" > مرحبًا بكم في برنامج الشراكة المعرفية</div>
                    <div className="col-12 h5 mb-4 mt-2 noP" style={{ fontSize: '1.3rem', fontFamily: "cnam-bold-ar" }}>أنشئ حسابك</div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="col-12 mb-2 noP" style={{ fontFamily: "cnam-bold-ar", fontSize: '0.92rem' }}>اسم *</div>

                      <div className="col-12 noP" >

                        <InputText
                          disabled={true}
                          value={name}

                        />

                      </div>

                      <div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold-ar", fontSize: '0.92rem' }}>جنس</div>

                      <div className="col-lg-3 noP pl-0" style={{ position: 'relative', top: '-5px' }}>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup value={value} onChange={onChange} className="">
                              <div className="d-flex">
                                <FormControlLabel
                                  value="male"
                                  className="m-0"
                                  control={<Radio icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} size="small" style={{ color: "rgb(198 2 36)" }} />}
                                  label="ذكر"
                                />
                                <FormControlLabel
                                  value="female"
                                  control={<Radio icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} size="small" style={{ color: "rgb(198 2 36)" }} />}
                                  label="أنثى"
                                  className="mr-2"
                                />
                              </div>
                            </RadioGroup>
                          )}
                          rules={{ required: true }}

                          name="radio_gender"
                          control={control}
                        />
                        {errors.radio_gender && (
                          <span className="errors">مطلوب.</span>
                        )}
                      </div>


                      <div className="col-12 mb-2 mt-4  noP" style={{ fontFamily: "cnam-bold-ar", fontSize: '0.92rem' }}>بريد إلكتروني *</div>
                      <div className="col-12 noP">

                        <InputText
                          style={{ fontFamily: 'cnam' }}
                          disabled={true}
                          value={email}
                        />

                      </div>

                      <div className="col-12 mb-2 mt-4  noP" style={{ fontFamily: "cnam-bold-ar", fontSize: '0.92rem' }}>اسم المستخدم *</div>
                      <div className="col-12 noP">
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value || ''}
                              onChange={(e) => { onChange(e); setExist({ ...exist, username: '' }) }}
                              style={{ border: errors.username || exist.username === 1 ? "1px solid red" : "" }}
                              placeholder="اسم المستخدم"
                            />
                          )}
                          rules={{ required: true, minLength: 6, pattern: /^\S*$/ }}
                          name="username"
                          control={control}
                        />
                        {errors.username && errors.username.type === "required" && (
                          <span className="errors">اسم المستخدم مطلوب.</span>
                        )}
                        {errors.username && errors.username.type === "minLength" && (
                          <span className="errors">
                            يجب أن يكون اسم المستخدم أكثر من 6 أحرف.
                          </span>
                        )}
                        {errors.username && errors.username.type === "pattern" && (
                          <span className="errors">
                            يجب ألا يكون اسم المستخدم مساحة بينهما.
                          </span>
                        )}
                        {exist.username === 1 && (
                          <span className="errors">اسم المستخدم مسجل بالفعل</span>
                        )}

                      </div>

                      <div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold-ar", fontSize: '0.92rem' }}>كلمه السر *</div>




                      <div className="col-12 noP">
                        <div className="">
                          <Controller
                            render={({ field: { onChange, value } }) => (
                              <InputText
                                value={value}
                                type={passwordVisiblity.password}
                                onChange={onChange}
                                style={{
                                  border: errors.password ? "1px solid red" : "",
                                }}
                                placeholder="***********"
                                className="col-12"
                              />
                            )}
                            rules={{
                              required: true,
                              pattern:
                                /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                            }}
                            name="password"
                            control={control}
                          />
                          <div
                            style={{
                              fontSize: "18px",
                              position: "absolute",
                              left: "15px",
                              top: "0px",
                            }}
                            className="col-1 pt-2 pointer show-password-icon-ar"
                            onClick={() => handlePasswordVisibility("password")}
                          >
                            {passwordVisiblity.password === "password" ? (
                              <VisibilityIcon />
                            ) : (
                              passwordVisiblity.password === "text" && (
                                <VisibilityOffIcon />
                              )
                            )}
                          </div>
                        </div>
                        {errors.password && errors.password.type === "required" && (
                          <span className="errors">كلمة المرور مطلوبة.</span>
                        )}
                        {errors.password && errors.password.type === "pattern" && (
                          <span className="errors">
                            يجب أن تحتوي كلمة المرورعلى مزيج من الأحرف الصغيرة والكبيرة والارقام والرموز.
                          </span>
                        )}
                      </div>



                      <div
                        className="col-12 mb-2 mt-4 noP"
                        style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}
                      >
                        تأكيد كلمة المرور *
                      </div>
                      <div className="col-12 noP">
                        <div className="">
                          <Controller
                            render={({ field: { onChange, value } }) => (
                              <InputText
                                value={value}
                                type={passwordVisiblity.confirmPassword}
                                onChange={onChange}
                                style={{
                                  border: errors.confirmPassword ? "1px solid red" : "",
                                }}
                                placeholder="***********"
                                className="col-12"
                              />
                            )}
                            rules={{
                              required: true,
                              validate: (value) => value === watch("password"),
                              pattern:
                                /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                            }}
                            name="confirmPassword"
                            control={control}
                          />
                          <div
                            style={{
                              fontSize: "18px",
                              position: "absolute",
                              left: "15px",
                              top: "0px",
                            }}
                            className="col-1 pt-2 pointer show-password-icon-ar"
                            onClick={() => handlePasswordVisibility("confirmPassword")}
                          >
                            {passwordVisiblity.confirmPassword === "password" ? (
                              <VisibilityIcon />
                            ) : (
                              passwordVisiblity.confirmPassword === "text" && (
                                <VisibilityOffIcon />
                              )
                            )}
                          </div>
                        </div>
                        {errors.confirmPassword &&
                          errors.confirmPassword.type === "required" && (
                            <span className="errors">
                              تأكيد كلمة المرور مطلوب.
                            </span>
                          )}
                        {errors.confirmPassword &&
                          (errors.confirmPassword.type === "validate" || errors.confirmPassword.type === "pattern") && (
                            <span className="errors">Passwords do not match!</span>
                          )}
                      </div>


                      <div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold-ar", fontSize: '0.92rem' }}>رقم الهاتف المحمول *</div>
                      <div className="d-md-flex">
                        <div className="col-lg-3 col-sm-3 mt-1 noP pl-0">
                          <Controller
                            render={({ field: { onChange, value } }) => (
                              <Selector
                                value={value}
                                className={errors.mobileCode && "border_form_selector"}
                                onChange={onChange}
                                options={[{ value: "+966", label: "٩٦٦+" }]}
                                placeholder="٩٦٦+"
                              />
                            )}
                            // <Selector
                            rules={{ required: true }}
                            name="mobileCode"
                            control={control}
                          />
                          {errors.mobileCode && (
                            <span className="errors">رمز الجوال مطلوب.</span>
                          )}
                        </div>
                        <div className="col-lg-9 col-sm-9 mt-1 noP">
                          <Controller
                            render={({ field: { onChange, value } }) => (
                              <InputNumeric
                                value={value}
                                onChange={(e) => { onChange(e); setExist({ ...exist, phone: '' }) }}
                                placeholder="۰۰ ۰۰۰ ۰۰۰"
                                format="## ### ####"
                                style={{
                                  border: errors.mobileNumber || exist.phone === 1 ? "1px solid red" : "",
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
                          {errors.mobileNumber &&
                            errors.mobileNumber.type === "required" && (
                              <span className="errors">رقم الهاتف المحمول مطلوب.</span>
                            )}
                          {errors.mobileNumber &&
                            errors.mobileNumber.type === "pattern" && (
                              <span className="errors">رقم الهاتف المحمول غير صالح.</span>
                            )}
                          {exist.phone === 1 && (
                            <span className="errors">تم أخذ رقم الهاتف المحمول بالفعل.</span>
                          )}
                        </div>
                      </div>

                      <div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold-ar", fontSize: '0.92rem' }}>
                        رقم هاتف المكتب
                      </div>
                      <div className="d-md-flex">
                        <div className="col-lg-3 col-sm-3 mt-1 noP pl-0">
                          <Controller
                            render={({ field: { onChange, value } }) => (
                              <Selector
                                isClearable
                                value={value}
                                className={errors.officeCode && "border_form_selector"}
                                onChange={onChange}
                                options={[{ value: "+966", label: "٩٦٦+" }]}
                                placeholder="٩٦٦+"
                              />
                            )}
                            // <Selector
                            rules={watch('officeNumber') !== '' ? { required: true } : { required: false }}
                            name="officeCode"
                            control={control}
                          />
                          {errors.officeCode && (
                            <span className="errors">رمز  المكتب مطلوب.</span>
                          )}

                        </div>
                        <div className="col-lg-9 col-sm-9 mt-1 noP">
                          <Controller
                            render={({ field: { onChange, value } }) => (
                              <InputNumeric
                                value={value}
                                onChange={onChange}
                                placeholder="۰۰ ۰۰۰ ۰۰۰"
                                format="## ### ####"
                                style={{
                                  border: errors.officeNumber ? "1px solid red" : "",
                                  textAlign: 'right',
                                  direction: 'ltr'
                                }}
                              />
                            )}
                            rules={
                              // eslint-disable-next-line no-useless-escape
                              watch('officeCode') !== null && watch('officeCode').length !== 0 ? { required: true, pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/ } : { required: false, pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/ }
                              // eslint-disable-next-line no-useless-escape

                            }
                            name="officeNumber"
                            control={control}
                          />
                          {errors.officeNumber &&
                            errors.officeNumber.type === "pattern" && (
                              <span className="errors">رقم المكتب غير صالح.</span>
                            )}
                          {errors.officeNumber && errors.officeNumber.type === "required" && (
                            <span className="errors">مطلوب رقم المكتب.</span>
                          )}

                        </div>
                      </div>

                      {(role === 1 || role === '1') &&
                        <>
                          <div className="col-12 mb-2 mt-4  noP" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>قسمك: *</div>
                          <div className="col-12 noP">
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <Selector
                                  name="department"
                                  value={value}
                                  className={errors.department && "border_form_selector"}
                                  onChange={(e) => { onChange(e); checkRoleValue(e !== null && e.value === 50, 'department') }}
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
                              otherInputsOpen.department &&
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


                      <div className="col-12 mb-2 mt-4  noP" style={{ fontFamily: "cnam-bold-ar", fontSize: '0.92rem' }}>المسمى الوظيفي الخاص بك</div>
                      <div className="col-12 noP">

                        <Selector
                          name="jobRole"
                          value={registerObj.jobRole}
                          className="w_shadow"
                          onChange={(e) => { handleChange('jobRole', e); checkRoleValue(e !== null && e.value === 'Other', 'jobRole') }}
                          options={jobRoleOptions_ar}
                          placeholder="حدد المسمى الوظيفي للمنصب"
                          isClearable
                          style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                        />
                        {
                          otherInputsOpen.jobRole &&
                          <>
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <InputText
                                  value={value}
                                  onChange={onChange}
                                  placeholder="الرجاء إدخال إجابة قصيرة"
                                  style={{
                                    border: errors.otherJobRole ? "1px solid red" : "",
                                    direction: 'rtl'
                                  }}
                                  className="mt-2"
                                />
                              )}
                              rules={{ required: true }}
                              name="otherJobRole"
                              control={control}
                            />
                            {errors.otherJobRole && (
                              <span className="errors text-right" style={{ fontFamily: 'cnam-ar' }}>مطلوب إجابة قصيرة.</span>
                            )}
                          </>
                        }
                        <div className="d-flex mt-4 col-lg-12 p-0" style={{ fontFamily: 'cnam', fontSize: '14px' }}>
                          <div>
                            <Checkbox
                              value={registerObj.newsletter}
                              checked={registerObj.newsletter}
                              onChange={handleCheckbox}
                              className="p-0"

                            />
                          </div>

                          <div className="ml-2" style={{ marginTop: '2px', fontFamily: 'cnam-light-ar' }}>هل ترغب في تلقّي إشعارات بأحدث التطورات بخصوص البرامج المقدمة من جامعة الملك عبدالله للعلوم والتقنية؟</div>
                        </div>
                      </div>
                      <div className="d-sm-flex col-lg-12 p-0">
                      <div
												className="col-lg-8 mt-4 noP"
												style={{ color: "#848484", fontSize: "13px", fontFamily: "cnam-light-ar" }}
											>
												من خلال تقديم معلوماتك ، فإنك توافق على {" "}
												<Link
													to="/terms_of_service"
													target="_blank"
													style={{ color: "#848484", textDecoration: "underline" }}
												>
													شروط الخدمة
												</Link>{" "}
												و{" "}
												<Link to="/privacy_policy" target="_blank" style={{ color: "#848484", textDecoration: "underline" }}>
													 سياسة الخصوصية 
												</Link>{" "}
												بجامعة الملك عبدالله للعلوم والتقنية .
											</div>
                        <div className="mt-4 col-lg-4 noP ">
                          <Button
                            onClick={scroll}
                            type="submit"
                            className="ml-sm-auto d-flex"
                            style={{
                              backgroundColor: "rgb(198 2 36)",
                              border: 'none',
                              fontSize: "0.9rem",
                              padding: '0.7rem 2.4rem',


                            }}
                          >
                            البدء
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                }
                right={
                  <>
                    <div className="col-12 h5 p-0 mt-2" style={{ fontFamily: 'cnam-bold-ar' }}>
									مرحبًا بكم في برنامج الشراكة المعرفية
                    </div>
                    <div className="col-12 p-0 mt-2" style={{ fontSize: '17px', fontWeight: '400', fontFamily: 'cnam-ar' }}>
                      نعتقد أن الصناعات الأكثر ابتكارا ستقود مستقبل أي صناعة.لذلك، نحن هنا لدعمك في البحث والتطوير والنمو إلى المستوى التالي.
                    </div>
                  </>
                }
              />
            </Loader>
          )
        }
      </>
  );
}

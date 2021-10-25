import React, { useState } from "react";
import axios from 'axios';
import { useForm, Controller } from "react-hook-form";

import Modal from '../Modal/Modal'

import { Button } from 'reactstrap'

import InputText from "../../components/InputText/InputText";

import { WS_LINK } from '../../globals'
import { getSessionInfo } from "../../variable";
import { checkFontFamily, translate } from "../../functions";

import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import check from '../../assets/images_png/check.png'
import headerLogo from '../../assets/images_png/header_logo.png'

export default function ForgotModal({ props, toggleState, state, message, path, email }) {

  const {
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
    }
  });

  const [wrong, setWrong] = useState(false)
  const [success, setSuccess] = useState(false)

  const toggle = () => {
    toggleState()
  }
  const togglesuccess = () => {
    setSuccess(!success)
  }

  const update_password = (data) => {

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const postedData = {
      userid: getSessionInfo('id'),
      token: getSessionInfo('token'),
      oldpass: data.oldpassword,
      newpass: data.password

    };
    props.toggleSpinner(true)
    axios({
      method: "post",
      url: `${WS_LINK}change_password`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {
        props.toggleSpinner(false)

        if (res.data === "wrong password") setWrong(true)
        else {
          // toggle()
          togglesuccess()

          // setSuccessmodal(true)
          // props.history.replace('/')
        }
      }
      )
      .catch(err => {
        props.toggleSpinner(false)
        if (axios.isCancel(err)) {
          console.log('request canceled')
        }
        else {
          console.log("request failed")
        }
      });

  }

  const [passwordVisiblity, setPassWordVisibility] = useState({
    password: "password",
    confirmPassword: "password",
  });
  const handlePasswordVisibility = (name) => {
    if (passwordVisiblity[name] === "password")
      setPassWordVisibility({ ...passwordVisiblity, [name]: "text" });
    else if (passwordVisiblity[name] === "text")
      setPassWordVisibility({ ...passwordVisiblity, [name]: "password" });
  };
  const confirm_check = () => getValues('password') === getValues('confirm_password') ? true : false
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  let modalBoday = <> 
  
  <div className="" style={{ height: '20px' }}>
          <Button className={translate("ml-auto mr-4", "mr-auto ")} color='link close' onClick={toggle}>X</Button>
        </div>

        <div className="col-12 text-center mt-3">
          <h6 className="text-center">
            <div className="text-center">
              <div><img src={headerLogo} width="100%" alt="" /></div>
              <form onSubmit={handleSubmit(update_password)}>
                <div className=" mt-4 mb-4">
                  <div className="mt-3 col-12" style={{ textAlign: translate('left', 'right'), fontFamily: checkFontFamily() }}>{translate('Old password *', 'كلمة السر القديمة *')}</div>
                  <div className={`col-12 mt-3 ${translate('', 'text-right')}`}>
                    <Controller
                      render={({ field: { onChange, value } }) => (
                        <InputText
                          value={value}
                          type="password"
                          onChange={(e) => { onChange(e); setWrong(false) }}
                          style={{ border: errors.oldpassword || wrong === true ? "1px solid red" : "", textAlign: translate('left', 'right') }}
                          placeholder="***********"
                        />
                      )}
                      rules={{ required: true }}
                      name="oldpassword"
                      control={control}
                      style={{ direction: translate('ltr', 'rtl') }}
                    />
                    {errors.oldpassword && errors.oldpassword.type === "required" && (
                      <span className="errors" style={{ fontSize: '14px', textAlign: translate('left', 'right'), fontFamily: checkFontFamily(), direction: translate('ltr', 'rtl')}}>{translate('Password is required.', 'كلمة المرور مطلوبة.')}</span>
                    )}
                    {wrong === true && (
                      <span className="errors" style={{ fontSize: '14px', textAlign: translate('left', 'right'), fontFamily: checkFontFamily(), direction: translate('ltr', 'rtl') }}>{translate("Incorrect old password", "كلمة السر القديمة غير صحيحة")}</span>
                    )}
                  </div>
                  <div className="mt-3 col-12" style={{ textAlign: translate('left', 'right'), fontFamily: checkFontFamily() }}>{translate("New password *", "كلمة السر الجديدة *")}</div>
                  <div className="col-12 mt-3">
                    <Controller
                      render={({ field: { onChange, value } }) => (
                        <InputText
                          value={value}
                          type={passwordVisiblity.password}
                          onChange={onChange}
                          style={{ border: errors.password ? "1px solid red" : "", textAlign: translate('left', 'right') }}
                          placeholder="***********"
                        />
                      )}
                      rules={{ required: true, pattern: /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/ }}
                      name="password"
                      control={control}
                    />

                    <div
                      style={{
                        fontSize: "18px",
                        position: "absolute",
                        right: translate("25px", ''),
                        left: translate('', '10px'),
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
                    {errors.password && errors.password.type === "required" && (
                      <span className="errors" style={{ fontSize: '14px', textAlign: translate('left', 'right'), fontFamily: checkFontFamily(), direction: translate('ltr', 'rtl') }}>{translate('Password is required.', 'كلمة المرور مطلوبة.')}</span>
                    )}
                    {errors.password && errors.password.type === "pattern" && (
                      <span className="errors" style={{ fontSize: '14px', textAlign: translate('left', 'right'), fontFamily: checkFontFamily(), direction: translate('ltr', 'rtl') }}>
                        {translate('minimum 8 characters (UpperCase, LowerCase, Number and special character)', '8 أحرف كحد أدنى (الأحرف العلوية والسفلية والرقم والحرف الخاص)')}
                      </span>
                    )}
                  </div>
                </div>
                <div className=" mt-4 mb-4">
                  <div className="mt-3 col-12" style={{ textAlign: translate('left', 'right'), fontFamily: checkFontFamily() }}>{translate('Confirm New password *', 'تأكيد كلمة المرور الجديدة *')}</div>
                  <div className="col-12 mt-3">
                    <Controller
                      render={({ field: { onChange, value } }) => (
                        <InputText
                          value={value}
                          type={passwordVisiblity.confirmPassword}
                          onChange={onChange}
                          style={{ border: errors.confirm_password ? "1px solid red" : "", textAlign: translate('left', 'right') }}
                          placeholder="***********"
                        />
                      )}
                      rules={{ required: true, pattern: /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/, validate: confirm_check }}
                      name="confirm_password"
                      control={control}
                    />
                    <div
                      style={{
                        fontSize: "18px",
                        position: "absolute",
                        right: translate("25px", ''),
                        left: translate('', '10px'),
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
                    {errors.confirm_password && errors.confirm_password.type === "required" && (
                      <span className="errors" style={{ fontSize: '14px', textAlign: translate('left', 'right'), fontFamily: checkFontFamily(), direction: translate('ltr', 'rtl') }}>{translate('Password is required.', 'كلمة المرور مطلوبة.')}</span>
                    )}
                    {errors.confirm_password && confirm_check && (
                      <span className="errors" style={{ fontSize: '14px', textAlign: translate('left', 'right'), fontFamily: checkFontFamily(), direction: translate('ltr', 'rtl') }}>
                        {translate('Passwords do not match', 'كلمة المرور غير مطابقة')}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="px-4 mt-3"
                  style={{
                    backgroundColor: "rgb(198 2 36)",
                    border: 'none',
                    fontSize: "0.9rem",
                    padding: '0.7rem 2.4rem',
                    fontWeight: '600',
                    float: translate('right', 'left')
                  }}
                >
                  Submit
                </Button>


              </form>
            </div>

          </h6>
        </div>
  
  </>
  
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  let successbody
  if (getSessionInfo('language') === 'arabic') {
    successbody =
      <>
        <div className="row  " style={{ float: 'left' }}>
          <Button className="mr-auto ml-4" color='link close' onClick={() => { togglesuccess() }}>X</Button>
        </div>

        <div className="col-12 text-center">
          <h6 className="text-center">
            <div className="text-center">
              <div><img src={check} alt="" width={75} /></div>
              <div className="bold mt-4 mb-4" style={{ fontFamily: 'cnam-ar' }}>الرقم السري تغير بنجاح</div>
              <div className="text-center">
                <Button onClick={() => { togglesuccess(); toggle() }} style={{ backgroundColor: 'rgb(198 2 36)', border: '1px solid rgb(198 2 36)' }}>حسنا</Button>
              </div>
            </div>
          </h6>
        </div>
      </>
  } else {

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    successbody = (
      <>
        <div className={`d-flex justify-content-end w-100 ${translate('text-right pr-2', 'text-left pl-2')}`}>
          <Button color='link close' onClick={() => { togglesuccess(); }} style={{ width: 'fit-content' }}>X</Button>
        </div>

        <div className="col-12 text-center">
          <h6 className="text-center">
            <div className="text-center">
              <div><img src={check} alt="" width={75} /></div>
              <div className="font-weight-bold mt-4 mb-4">Password successfully changed </div>
              <div className="text-center">
                <Button onClick={() => { togglesuccess(); toggle() }} style={{ backgroundColor: 'rgb(198 2 36)', border: '1px solid rgb(198 2 36)' }}>OK</Button>
              </div>
            </div>
          </h6>
        </div>
      </>
    )
  }


  return (
    <>
      {!success &&
        <Modal
          modalState={state}
          modalBody={modalBoday}
          style={{ width: '450px' }}
        />
      }
      {success &&
        <Modal
          modalState={success}
          modalBody={successbody}
          style={{ width: '450px' }}
        />
      }
    </>
  )
}

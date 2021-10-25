import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';



import {
  getSessionInfo,
  setSessionInfo,
  clearSessionInfo
} from '../../variable';
import { WS_LINK, } from '../../globals'

import Login from '../../pages/Common/login/Login'
import Modal from '../Modal/Modal'

import ActivationModal from '../HeaderModals/ActivationModal'
import ForgotPasswordModalBody from '../HeaderModals/ForgotPasswordModalBody'
import ForgotSuccessModal from '../HeaderModals/ForgotSuccessModal'
import ResetPasswordModal from '../HeaderModals/ResetPasswordModal'
import TokenErrorModal from '../HeaderModals/TokenErrorModal'

import headerLogo from '../../assets/images_png/header_logo.png'


import '../header/Header.css'
import { translate, checkFontFamily } from '../../functions';

export default function Header(props) {

  const location = useLocation();   // we need to use location.pathname

  const pageRef = useRef(null); // needed to close notification on blur




  //*  ******************************************************************************* THE STATES

  const [clicked, setClicked] = useState(false);


  const [LoginOpen, setLoginOpen] = useState(false)

  //* ///// notification mobile
  const [notif_clicked, setNotif_clicked] = useState(false)



  //* ////// ACTIVATION
  const [modalState, setModalState] = useState(false)

  const [info, setInfo] = useState([])

  //* ///// FORGOT PASSWORD EMAIL
  const [passwordState, setPasswordState] = useState(false)
  const [passwordValueState, setPasswordValueState] = useState('')
  const [open_forgot, setOpen_forgot] = useState(false)

  //* //// FORGOT PASSWORD STEP 2
  const [info_pass, setInfo_pass] = useState([])
  const [forgotmodal, setForgotmodal] = useState(false)
  const [successmodal, setSuccessmodal] = useState(false)
  const [errormodal, setErrormodal] = useState(false)


  //*  ******************************************************************************* SET STATES

  const handleClick = () => {
    setClicked(!clicked);
  }


  const toggleforgot = () => {
    setForgotmodal(p => !p)
  }

  const togglesuccess = () => {
    setSuccessmodal(p => !p)
  }

  const toggleerror = () => {
    setErrormodal(p => !p)
  }

  const toggleopenforgot = () => {
    setOpen_forgot(true)
  }

  const toggleModalState = () => {
    setModalState(p => !p)
  }

  const togglePasswordModal = () => {
    setPasswordState(p => !p)
  }

  const changeLoginState = () => {
    setLoginOpen(p => !p)
  }

  //*  ** Notification click outside
  useEffect(() => {

    function handleClickOutside(event) {
      if (pageRef.current && !pageRef.current.contains(event.target)) {
        if (notif_clicked) setNotif_clicked(false)
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pageRef, notif_clicked]);



  // change language
  const changeLanguage = () => {
    if (getSessionInfo('language') === 'english') setSessionInfo({ name: "language", val: 'arabic' })
    else setSessionInfo({ name: "language", val: 'english' })
    props.changeLanguage()
  }



  //*  ******************************************************************************* FUNCTIONS



  const Logout = () => {
    clearSessionInfo()
    window.location.reload(false).then(props.history.replace('/'))
  }




  //*  ******************************************************************************* PAGE CREATION


  useEffect(() => {

    // to activate account  
    check_activation();
    check_activation_admin();
    check_forgot();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);








  //* ///////////// check admin activation Industry token

  const check_activation_admin = () => {
    if (!getSessionInfo("loggedIn") && location.pathname === "/") {
      let url_string = window.location.href;
      let url = new URL(url_string);
      let c = url.searchParams.get("user_activation_token");
      let e = url.searchParams.get("email");

      if (c !== null) {

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        const postedData = {
          token: c,
          email: e

        };
        props.toggleSpinner(true)
        axios({
          method: "post",
          url: `${WS_LINK}check_user_activation_token`,
          data: postedData,
          cancelToken: source.token,
        })
          .then(res => {
            props.toggleSpinner(false)

            if (res.data !== 'not ok')
              props.history.replace('/admin_register/' + btoa(encodeURIComponent(res.data[0].user_name)) + "/" + btoa(encodeURIComponent(res.data[0].user_email)) + "/" + c + "/" + btoa(encodeURIComponent(res.data[0].user_role_role_id)))
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
    }
  }



  //* ******////////CHECK FORGOT PASSWORD TOKEN
  const check_forgot = () => {
    if (!getSessionInfo("loggedIn") && location.pathname === "/") {
      let url_string = window.location.href;
      let url = new URL(url_string);
      let c = url.searchParams.get("reset_token");
      let e = url.searchParams.get("email");

      if (c !== null) {

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        const postedData = {
          token: c,
          email: e

        };
        props.toggleSpinner(true)
        axios({
          method: "post",
          url: `${WS_LINK}check_reset_token`,
          data: postedData,
          cancelToken: source.token,
        })
          .then(res => {
            props.toggleSpinner(false)
            setInfo_pass(res.data)
            setForgotmodal(true)

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
    }
  }




  //*  FUNCTION TO UPDATE PASSWORD
  const update_password = (data) => {

    let url_string = window.location.href;
    let url = new URL(url_string);
    let e = url.searchParams.get("email");
    let t = url.searchParams.get("reset_token");
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const postedData = {
      email: e,
      newpass: data.password,
      token: t

    };
    props.toggleSpinner(true)
    axios({
      method: "post",
      url: `${WS_LINK}update_password`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {
        props.toggleSpinner(false)
        setForgotmodal(false)
        if (res.data !== 'error')
          setSuccessmodal(true)
        else setErrormodal(true)
        // props.history.replace('/')

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




  /// ACTIVATION MODAL CREATION
  const check_activation = () => {
    if (!getSessionInfo("loggedIn") && location.pathname === "/") {
      let url_string = window.location.href;
      let url = new URL(url_string);
      let c = url.searchParams.get("activation_token");

      if (c !== null) {

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        const postedData = {
          token: c,

        };
        props.toggleSpinner(true)
        axios({
          method: "post",
          url: `${WS_LINK}activate_account`,
          data: postedData,
          cancelToken: source.token,
        })
          .then(res => {
            props.toggleSpinner(false)

            if (res.data[0] === 1) { setSessionInfo({ name: "tempUserName", val: res.data[3] }) }

            setInfo(res.data)
            setModalState(true)

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
    }
  }


  //*  ******************************************************************************* MODALS

  // activationModal Body
  const activationModal = <ActivationModal
    toggleModalState={toggleModalState}
    info={info}
    changeLoginState={changeLoginState}
    history={props.history}
  />


  // reset password modal body
  const passwordModalBody = <ResetPasswordModal
    passwordValueState={passwordValueState}
    togglePasswordModal={togglePasswordModal}
    changeLoginState={changeLoginState}
    toggleopenforgot={toggleopenforgot}
  />




  // login modal body
  const ModalBody = <Login
    props={props}
    setPasswordState={(x) => setPasswordValueState(x)}
    changeLoginState={changeLoginState}
    passwordModalState={passwordState}
    togglePasswordModalState={togglePasswordModal}
    header_forgot={open_forgot} />


  //forgot password error
  const errorModalBody =
    <TokenErrorModal
      toggleerror={toggleerror}
    />



  // forgot modal body

  const forgotModalBody = <ForgotPasswordModalBody
    toggleforgot={toggleforgot}
    info_pass={info_pass}
    update_password={update_password}
    history={props.history}
  />

  /// forgot success
  const successModal = <ForgotSuccessModal
    togglesuccess={togglesuccess}
  />







  return (
    <>
      <div className="header-container" ref={pageRef}>

        <nav className={getSessionInfo('language') === 'english' ? 'header-links' : 'header-links-ar'} style={{ fontFamily: getSessionInfo('language') === 'english' ? 'cnam' : 'cnam-ar' }}>

          <label className={getSessionInfo('language') === 'english' ? "navlogo mb-0" : "navlogo-ar mb-0"} style={{ marginLeft: props.adminNavOpen ? '15px' : '40px' }} onClick={() => props.history.push("/")}>
            {(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ?
              <img src={headerLogo} style={{ transition: 'all 500ms', height: props.adminNavOpen ? '30px' : getSessionInfo('role') === 4 ? '45px' : '65px', textShadow: '#fc0 1px 0 10px' }} alt="LOGO" />
              :
              <img src={headerLogo} style={{ transition: 'all 500ms', height: props.adminNavOpen ? '30px' : getSessionInfo('role') === 4 ? '45px' : '65px' }} alt="LOGO" />
            }
          </label>


          <div className={`px-4 d-flex ${translate('', 'flex-reverse')} desktop`}>

            {
              !(getSessionInfo("loggedIn") || getSessionInfo('tempLoggedIn')) ?
                <span className='mx-2 pointer' onClick={changeLoginState} style={{ fontFamily: checkFontFamily() }}>{translate('SIGN IN', 'تسجيل الدخول')}</span>
                :
                <>
                  <span className='mx-2 pointer' onClick={() => props.history.push('/dashboard')} style={{ fontFamily: checkFontFamily() }}>{translate('My Account', 'حسابي')}</span>
                  <span className='mx-2 pointer' onClick={Logout} style={{ fontFamily: checkFontFamily() }}>{translate('Logout', 'تسجيل خروج')}</span>
                </>
            }

            <span className="pointer mx-2" style={{ fontFamily: getSessionInfo('language') === 'english' ? 'cnam-bold-ar' : 'cnam-bold' }} onClick={changeLanguage}>{getSessionInfo('language') === 'english' ? 'العربية' : 'English'}</span>

          </div>

          <div className="mobile">

              <div className="menu-icon" onClick={handleClick} style={{position: 'relative', top: '0'}}>
                <i className={clicked ? "fas" : "fas fa-bars"}>☰</i>
              </div>

              <ul className={clicked ? 'nav-menu active' : 'nav-menu'} onClick={handleClick} style={{ textAlign: getSessionInfo('language') === 'english' ? '' : 'right', paddingRight: getSessionInfo('language') === 'english' ? '' : '30px' }}>
              {
              !(getSessionInfo("loggedIn") || getSessionInfo('tempLoggedIn')) ?
                <li className='mx-2 pointer' onClick={changeLoginState} style={{ fontFamily: checkFontFamily() }}>{translate('SIGN IN', 'تسجيل الدخول')}</li>
                :
                <>
                  <li className='mx-2 pointer' onClick={() => props.history.push('/dashboard')} style={{ fontFamily: checkFontFamily() }}>{translate('My Account', 'حسابي')}</li>
                  <li className='mx-2 pointer' onClick={Logout} style={{ fontFamily: checkFontFamily() }}>{translate('Logout', 'تسجيل خروج')}</li>
                </>
            }

            <li className="pointer mx-2" style={{ fontFamily: getSessionInfo('language') === 'english' ? 'cnam-bold-ar' : 'cnam-bold' }} onClick={changeLanguage}>{getSessionInfo('language') === 'english' ? 'العربية' : 'English'}</li>
              </ul>

          </div>



        </nav>

      </div>

      <Modal
        name="loginModal"
        modalBody={ModalBody}
        modalState={LoginOpen}
      />

      <Modal
        name="Modal"
        modalState={modalState}
        changeModalState={toggleModalState}
        modalBody={activationModal} />

      <Modal
        name="passwordModal"
        modalState={passwordState}
        changeModalState={!passwordState}
        modalBody={passwordModalBody}

      />

      <Modal
        name="forgotModal"
        modalState={forgotmodal}
        changeModalState={!forgotmodal}
        modalBody={!successmodal ? forgotModalBody : successModal}

      />

      <Modal
        name="successmodal"
        modalState={successmodal}
        changeModalState={!successmodal}
        modalBody={successModal}

      />

      <Modal
        name="errormodal"
        modalState={errormodal}
        changeModalState={!errormodal}
        modalBody={errorModalBody}
      />

    </>
  )
}
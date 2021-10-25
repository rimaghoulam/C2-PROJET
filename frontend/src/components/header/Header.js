import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';

import { Button, DropdownToggle, DropdownMenu, DropdownItem, Dropdown } from 'reactstrap';


import { toArabicDigits } from '../../functions'

import {
  getSessionInfo,
  setSessionInfo,
  clearSessionInfo
} from '../../variable';
import { WS_LINK, beforeLoginRoutes } from '../../globals'

import Login from '../../pages/Common/login/Login'
import Modal from '../Modal/Modal'
import Notification from '../NotificationHeader/Notification';

import ActivationModal from '../HeaderModals/ActivationModal'
import ForgotPasswordModalBody from '../HeaderModals/ForgotPasswordModalBody'
import ForgotSuccessModal from '../HeaderModals/ForgotSuccessModal'
import ResetPasswordModal from '../HeaderModals/ResetPasswordModal'
import TokenErrorModal from '../HeaderModals/TokenErrorModal'

import headerLogo from '../../assets/images_png/header_logo.png'
import Logo from '../../assets/images_png/CNAM_logo.png';

import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
// import HelpIcon from '@material-ui/icons/Help';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';

import './Header.css'
import AdminLeftNavMobile from '../AdminLeftNav/AdminLeftNavMobile';

export default function Header(props) {

  const location = useLocation();   // we need to use location.pathname

  const pageRef = useRef(null); // needed to close notification on blur




  //*  ******************************************************************************* THE STATES

  const [notificationObj, setNotificationObj] = useState({
    notifNumber: 0,
    newNotif: [],
    oldNotif: []
  })

  const [LoginOpen, setLoginOpen] = useState(false)

  //* ////// for the mobile user header
  const [clicked, setClicked] = useState(false);

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
    setNotif_clicked(false)
  }


  const handleViewAllNotif = () => {
    props.history.push('/all_notifications')
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



  // when the notification icon is clicked
  const handleNotifClick = () => {

    if (notificationObj.notifNumber > 0) {

      readNewNotifications()

    }
    setNotif_clicked(!notif_clicked)
  }

  // change language
  const changeLanguage = () => {
    if (getSessionInfo('language') === 'english') setSessionInfo({ name: "language", val: 'arabic' })
    else setSessionInfo({ name: "language", val: 'english' })
    props.changeLanguage()
  }



  //*  ******************************************************************************* FUNCTIONS


  const readNewNotifications = () => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const postedData = {
      userid: getSessionInfo('id'),
      token: getSessionInfo('token')
    }
    axios({
      method: "post",
      url: `${WS_LINK}click_notification`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {
        setNotificationObj({ ...notificationObj, notifNumber: 0 })
      }
      )
      .catch(err => {
        if (axios.isCancel(err)) {
          console.log('request canceled')
        }
        else {
          console.log("request failed")
        }
      });
  }


  const Logout = () => {
    setNotificationObj({})
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


  //* ///////////////// get notifications

  const lgdIn = getSessionInfo('loggedIn')

  useEffect(() => {

    if (lgdIn) {
      const cancelToken = axios.CancelToken;
      const source = cancelToken.source();
      const postedData = {
        userid: getSessionInfo('id'),
        token: getSessionInfo('token')
      }
      axios({
        method: "post",
        url: `${WS_LINK}${getSessionInfo('role') === 4 ? 'get_admin_notifications' : 'get_notifications'}`,
        data: postedData,
        cancelToken: source.token,
      })
        .then(res => {
          if (res.data === 'token error') Logout()
          else {
            if (res.data !== 'notification empty') {

              setNotificationObj({
                notifNumber: res.data[0],
                newNotif: res.data[1],
                oldNotif: res.data[2]
              })
            }
            else {
              Logout()
            }
          }
        }
        )
        .catch(err => {
          if (axios.isCancel(err)) {
            console.log('request canceled')
          }
          else {
            console.log("request failed")
          }
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgdIn])








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








  /// FUNCTION TO CHECK NDA
  const check_agree = () => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
    };

    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${WS_LINK}get_agree_guidline`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {

        if (res.data !== "role error" && res.data !== "token error") {


          if (res.data.length === 1) {

            const cancelToken = axios.CancelToken;
            const source = cancelToken.source()

            const postedData = {
              userid: getSessionInfo('id'),
              token: getSessionInfo('token')
            }


            axios({
              method: "post",
              url: `${WS_LINK}check_self_signed_nda`,
              data: postedData,
              cancelToken: source.token,
            })
              .then(res => {

                if (res.data && res.data.length !== 0 && res.data === 'yes')
                  props.history.push('/post_challenge')
                else props.history.push('/nda')

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
          } else props.history.push('/nda')
        }
        else {
          clearSessionInfo()
          window.location.reload(false).then(props.history.replace('/'))
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





  // avatar name for the far right settings
  let avatarName = ''
  if (getSessionInfo("loggedIn")) {
    if (getSessionInfo("name") !== undefined) {
      const name = getSessionInfo("name")
      const names = name.split(" ")
      for (let i = 0; (i < names.length && i < 3); i++) {
        names[i] = names[i].charAt(0).toUpperCase()
        avatarName += names[i]
      }
    }
  }



  // to get the screen width
  var win = window, doc = document, docElem = doc.documentElement, body = doc.getElementsByTagName('body')[0], x = win.innerWidth || docElem.clientWidth || body.clientWidt;

  return (
    <>
      <div className="header-container" ref={pageRef}>
        {(beforeLoginRoutes.includes(location.pathname.toLowerCase()) || location.pathname.toLowerCase().indexOf('/news_details') === 0) ?
          <>
            <div className="remove-on-mobile" style={{ position: 'absolute', zIndex: '1000', right: getSessionInfo('language') === 'english' ? '55px' : '', top: '7px', left: getSessionInfo('language') === 'english' ? '' : '50px', fontSize: '1rem' }} onClick={changeLanguage}>
              <span className="pointer" style={{ fontFamily: getSessionInfo('language') === 'english' ? 'cnam-ar' : 'cnam' }}>{getSessionInfo('language') === 'english' ? 'العربية' : 'English'}</span>
            </div>
            <div style={{ height: '15px' }}></div>
          </>
          :
          <>

            <div className="remove-on-mobile" style={{ position: 'absolute', zIndex: '1000', right: getSessionInfo('language') === 'english' ? '30px' : '', top: '7px', left: getSessionInfo('language') === 'english' ? '' : '20px', fontSize: '1rem' }} onClick={changeLanguage}>
              <span className="pointer" style={{ fontFamily: getSessionInfo('language') === 'english' ? 'cnam-ar' : 'cnam' }}>{getSessionInfo('language') === 'english' ? 'العربية' : 'English'}</span>
            </div>
            <div style={{ height: '15px' }}></div>
          </>
        }
        <nav className={getSessionInfo('language') === 'english' ? 'header-links' : 'header-links-ar'} style={{ fontFamily: getSessionInfo('language') === 'english' ? 'cnam' : 'cnam-ar' }}>

          {(getSessionInfo("loggedIn") || getSessionInfo('tempLoggedIn')) && !(beforeLoginRoutes.includes(location.pathname.toLowerCase()) || location.pathname.toLowerCase().indexOf('/news_details') === 0) ?
            <>
              <label className={getSessionInfo('language') === 'english' ? "navlogo mb-0" : "navlogo-ar mb-0"} style={{ marginLeft: props.adminNavOpen ? '15px' : '40px' }} onClick={() => props.history.push("/")}>
                {(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ?
                  <img src={props.adminNavOpen ? headerLogo : Logo} style={{ transition: 'all 500ms', height: props.adminNavOpen ? '30px' : getSessionInfo('role') === 4 ? '45px' : '65px', textShadow: '#fc0 1px 0 10px' }} alt="LOGO" />
                  :
                  <img src={props.adminNavOpen ? headerLogo : Logo} style={{ transition: 'all 500ms', height: props.adminNavOpen ? '30px' : getSessionInfo('role') === 4 ? '45px' : '65px' }} alt="LOGO" />
                }
              </label>
            </>
            :
            <>
              {/* !! From app.css reomove logo_width_on_mobile */}
              <label className={getSessionInfo('language') === 'english' ? "navlogo pl-1 mb-0 logo_width_on_mobile" : "navlogo-ar mb-0 logo_width_on_mobile"} onClick={() => props.history.push("/")}>
                <img src={headerLogo} className="logo_width_on_mobile_img" style={{ height: '65px', marginRight: getSessionInfo('language') === 'english' ? '' : '20px' }} alt="LOGO" />
              </label>
            </>
          }
          {(beforeLoginRoutes.includes(location.pathname.toLowerCase()) || location.pathname.toLowerCase().indexOf('/news_details') === 0) ?  // IF THE TAB IS ABOUT THE PROGRAM
            <>
              <div className="menu-icon" onClick={handleClick}>
                <i className={clicked ? "fas" : "fas fa-bars"}>☰</i>
              </div>
              <ul className={clicked ? 'nav-menu active' : 'nav-menu'} onClick={handleClick} style={{ textAlign: getSessionInfo('language') === 'english' ? '' : 'right', paddingRight: getSessionInfo('language') === 'english' ? '' : '30px' }}>
                <li className="header-linkshover  first header_shown "
                  style={{ color: window.location === "/industry_kpp" && "rgb(0 0 0)" }}
                >
                  <NavLink style={{ color: 'black', textDecoration: 'none', fontFamily: getSessionInfo('language') === 'english' ? 'cnam' : 'cnam-ar' }} exact to="/industry_kpp" className="nav-null" activeClassName="nav-active" >
                    {getSessionInfo('language') === 'english' ? 'Industry KPP' : <span>برنامج الشراكة المعرفية <span style={{ fontFamily: 'cnam' }}>KPP </span></span>}
                  </NavLink>

                </li>


                <li className="header-linkshover header_shown desktop">
                  <Dropdown id="one" style={{ background: 'white' }} toggle={() => { }}>
                    <DropdownToggle className="p-0" color="" size="sm">
                      <Link to="#" style={{ color: 'black', textDecoration: 'none' }} className="nav-null" activeClassName="nav-active" >
                        {getSessionInfo('language') === 'english' ? 'Media Center' : 'المركز الاعلامي'}
                        <ArrowDropDownIcon /></Link>
                    </DropdownToggle>
                    <DropdownMenu style={{ boxShadow: '0px 0px 6px -3px #888888', textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }}>
                      <DropdownItem className="bg-white mt-1 "><NavLink className="link" style={{ textDecoration: 'none', color: 'black' }} exact to="/news" >
                        {getSessionInfo('language') === 'english' ? 'News' : 'أخبار'}
                        <hr style={{ marginTop: '6px', marginBottom: "6px" }} /></NavLink></DropdownItem>
                      <DropdownItem className="bg-white "><NavLink className="link" style={{ textDecoration: 'none', color: 'black' }} exact to="/events" >
                        {getSessionInfo('language') === 'english' ? 'Events' : 'الأحداث'}
                        <hr style={{ marginTop: '6px', marginBottom: "6px" }} /></NavLink></DropdownItem>
                      <DropdownItem className="bg-white "><NavLink className="link" style={{ textDecoration: 'none', color: 'black' }} exact to="/success_stories" >
                        {getSessionInfo('language') === 'english' ? 'Success stories' : 'قصص نجاح'}
                        <hr style={{ marginTop: '6px', marginBottom: "6px" }} /></NavLink></DropdownItem>
                      <DropdownItem className="bg-white mb-1 "><NavLink className="link" style={{ textDecoration: 'none', color: 'black' }} exact to="/photos" >
                        {getSessionInfo('language') === 'english' ? 'Photos & videos' : 'الصور ومقاطع الفيديو'}
                      </NavLink></DropdownItem>

                    </DropdownMenu>
                  </Dropdown>



                </li>
                <li className="header-linkshover  first header_shown desktop"
                  style={{ color: window.location === "/contact_us" && "rgb(0 0 0)" }}
                ><NavLink style={{ color: 'black', textDecoration: 'none' }} exact to="/contact_us" className="nav-null" activeClassName="nav-active" >
                    {getSessionInfo('language') === 'english' ? 'Contact us' : 'اتصل بنا'}
                  </NavLink></li>
                {/* // * //////////////////////// mobile header home //////////////////*/}
                <li className="mobile header-linkshover  "
                  style={{ color: window.location === "/news" && "rgb(0 0 0)" }}>

                  <NavLink style={{ color: 'black', textDecoration: 'none' }} exact to="/news" className="nav-null" activeClassName="nav-active" >
                    {getSessionInfo('language') === 'english' ? 'News' : 'أخبار'}
                  </NavLink>
                </li>
                <li className="mobile header-linkshover "
                  style={{ color: window.location === "/events" && "rgb(0 0 0)" }}>

                  <NavLink style={{ color: 'black', textDecoration: 'none' }} exact to="/events" className="nav-null" activeClassName="nav-active" >
                    {getSessionInfo('language') === 'english' ? 'Events' : 'الأحداث'}
                  </NavLink>
                </li>
                <li className="mobile header-linkshover "
                  style={{ color: window.location === "/success_stories" && "rgb(0 0 0)" }}>

                  <NavLink style={{ color: 'black', textDecoration: 'none' }} exact to="/success_stories" className="nav-null" activeClassName="nav-active" >
                    {getSessionInfo('language') === 'english' ? 'Success stories' : 'قصص نجاح'}
                  </NavLink>
                </li>
                <li className="mobile header-linkshover  "
                  style={{ color: window.location === "/photos" && "rgb(0 0 0)" }}>

                  <NavLink style={{ color: 'black', textDecoration: 'none' }} exact to="/photos" className="nav-null" activeClassName="nav-active" >
                    {getSessionInfo('language') === 'english' ? 'Photos & videos' : 'الصور ومقاطع الفيديو'}
                  </NavLink>
                </li>
                <li className="mobile header-linkshover"
                  style={{ color: window.location === "/Contact" && "rgb(0 0 0)" }}>

                  <NavLink style={{ color: 'black', textDecoration: 'none' }} exact to="/contact_us" className="nav-null" activeClassName="nav-active" >
                    {getSessionInfo('language') === 'english' ? 'Contact Us' : 'اتصل بنا'}
                  </NavLink>
                </li>
                {/* //* /////////////////////////////////////////////////////////////////////////////////////*/}

                {(getSessionInfo("loggedIn") || getSessionInfo('tempLoggedIn')) ? // if about the program and logged in
                  <>
                    <li className=" header_shown " onClick={() => props.history.push(getSessionInfo("loggedIn") ? '/dashboard' : '/industry_register')}>
                      <Button style={{ background: 'rgb(198 2 36)', padding: '0.75rem 2.2rem', border: 'none', marginTop: '0.5rem' }} >
                        {getSessionInfo('language') === 'english' ? 'My Account' : 'حسابي'}
                      </Button>
                    </li>
                    <li className={getSessionInfo('language') === 'english' ? "nav-item dropdown  language-on-mobile show-on-mobile" : "nav-item dropdown show-on-mobile"} style={{ marginLeft: getSessionInfo('language') === 'english' ? '10px' : '10px', top: '5px' }} onClick={changeLanguage}>
                      <span className="h5 pointer" style={{ fontSize: '1rem', fontFamily: getSessionInfo('language') === 'english' ? 'cnam-ar' : 'cnam' }}>{getSessionInfo('language') === 'english' ? 'العربية' : 'English'}</span>
                    </li>
                  </>

                  : // * ******************** if about the program and logged out
                  <>
                    <li className=" d-inline-block header-linkshover header_shown">
                      <div className="nav-null" activeClassName="" onClick={changeLoginState} style={{ color: 'black', textDecoration: 'none', fontFamily: getSessionInfo('language') === 'english' ? 'cnam' : 'cnam-ar' }} >
                        {getSessionInfo('language') === 'english' ? 'Login' : 'تسجيل الدخول'}
                      </div>
                    </li>

                    <li className=" d-inline-block" onClick={() => props.history.push('/register')}>
                      <Button style={{ background: 'rgb(198 2 36)', padding: '0.7rem 1.8rem', border: 'none', marginTop: '0.7rem', fontFamily: 'cnam-bold !important', marginRight: getSessionInfo('language') === 'english' ? '2rem' : '' }}>
                        {getSessionInfo('language') === 'english' ? 'Get Started' : 'سجل الان'}
                      </Button>
                    </li>
                    <li className={getSessionInfo('language') === 'english' ? "nav-item dropdown  language-on-mobile show-on-mobile" : "nav-item dropdown show-on-mobile"} style={{ marginLeft: getSessionInfo('language') === 'english' ? '10px' : '10px', top: '5px' }} onClick={changeLanguage}>
                      <span className="h5 pointer" style={{ fontSize: '1rem', fontFamily: getSessionInfo('language') === 'english' ? 'cnam-ar' : 'cnam' }}>{getSessionInfo('language') === 'english' ? 'العربية' : 'English'}</span>
                    </li>
                  </>
                }

              </ul>
            </>

            :// * ****************** IF THE TAB ISN'T ABOUT THE PROGRAM
            <>
              <div className="menu-icon" onClick={handleClick}>
                <i className={clicked ? "fas" : "fas fa-bars"}>
                  <Avatar style={{ backgroundColor: 'rgb(198 2 36)', fontSize: "17px", padding: "15" }}>{avatarName}</Avatar>
                </i>
              </div>
              <ul className={clicked ? 'nav-menu active w-100' : 'nav-menu w-100'} onClick={handleClick} style={{ textAlign: getSessionInfo('language') === 'english' ? '' : 'right', paddingRight: getSessionInfo('language') === 'english' ? '' : '30px' }}>
                {
                  getSessionInfo("role") === 4 ? // if the user is not in about the program and is admin
                    <>

                      <span className="ml-2 adminLeftNavIcon desktop">
                        {props.adminNavOpen ?
                          <MenuOpenIcon onClick={() => props.toggleAdminNav()} />
                          :
                          <MenuIcon onClick={() => props.toggleAdminNav()} />
                        }
                      </span>
                      <li className="mobile">
                        <AdminLeftNavMobile style={{ display: 'flex' }} />
                      </li>

                    </>

                    :
                    <>
                      <li className="header-linkshover first header_shown">
                        <NavLink style={{ color: 'black', textDecoration: 'none' }} exact to='/' className="nav-null" activeClassName="nav-active" >{getSessionInfo('language') === 'english' ? 'Home' : 'الصفحة الرئيسية'}</NavLink>
                      </li>
                      <li className="header-linkshover first header_shown"
                        style={{ color: window.location === "/dashboard" && "rgb(0 0 0)" }}

                      >
                        <NavLink style={{ color: 'black', textDecoration: 'none' }} exact to='/dashboard' className="nav-null" activeClassName="nav-active" >{getSessionInfo('language') === 'english' ? 'Dashboard' : 'لوحة إدارة المنصة'}</NavLink>
                      </li>
                    

                      {getSessionInfo("role") === 3 &&
                        <>
                        
                     

                      
                          <li className=" show_profile header_shown mt-2">



                            <Dropdown id="two" toggle={() => { }}>
                              <DropdownToggle caret size="sm" className=" px-3" style={{ backgroundColor: 'rgb(198 2 36)', border: 'none', padding: '0.45rem' }} >
                                <Link style={{ textDecoration: 'none', color: 'white', fontWeight: "600", fontSize: "0.95rem", padding: "0rem 0.77rem", fontFamily: getSessionInfo('language') === 'english' ? 'cnam' : 'cnam-ar' }} to="/industry_assist">{getSessionInfo('language') === 'english' ? 'Post' : 'طلب'}</Link>
                              </DropdownToggle>
                              <DropdownMenu className="ml-0" style={{ width: '50%', textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }} right={getSessionInfo('language') === 'english' ? false : true} >

                                <DropdownItem className="bg-white mb-2"><Link className="link" style={{ textDecoration: 'none', color: 'black', fontSize: '0.90em' }} to="/post_internship" >{getSessionInfo('language') === 'english' ? 'Internships' : ' المواهب'}</Link></DropdownItem>
                              </DropdownMenu>
                            </Dropdown>


                          </li>
                        
                          <li className="show_profile_elements header-linkshover ">
                            <Link style={{ color: 'black' }} to="/post_internship" ><span>{getSessionInfo('language') === 'english' ? 'Post Internship' : 'اطلب تدريب'}</span></Link>
                          </li>
                          <li className="show_profile_elements header-linkshover ">
                            <Link style={{ color: 'black' }} to="/edit_company" ><span>{getSessionInfo('language') === 'english' ? 'Company Profile' : 'ملف المنشأة'}</span></Link>
                          </li>
                        </>
                      }
                      <li className="show_profile_elements header-linkshover ">
                        <Link style={{ color: 'black' }} to="/edit_profile" ><span>{getSessionInfo('language') === 'english' ? 'Edit profile' : 'تعديل الملف الشخصي'}</span></Link>
                      </li>

                      <li className="show_profile_elements header-linkshover ">
                        <Link to="/" style={{ color: 'black' }} onClick={Logout}><span>{getSessionInfo('language') === 'english' ? 'Logout' : 'تسجيل خروج'}</span></Link>
                      </li>


                    </>
                }
              </ul>
              <div className="d-flex">

                <li className="menu-icon-notification pr-2  show_profile m-0" >


                  <Dropdown id="notification" toggle={handleNotifClick}>
                    <DropdownToggle size="sm" style={{ background: 'white', borderColor: 'white', padding: '0' }}>

                      <IconButton color="default" style={{ background: '#f6f6f6' }}>

                        {/* toArabicDigits(notificationObj.notifNumber.toString()) */}
                        {getSessionInfo('language') === 'english' ? (
                          <Badge color="primary" badgeContent={notificationObj.notifNumber !== '' ? notificationObj.notifNumber : 0} >
                            <NotificationsIcon style={{ color: 'black' }} />
                          </Badge>
                        ) :
                          (
                            <Badge color="primary" badgeContent={notificationObj.notifNumber !== '' ? toArabicDigits(notificationObj.notifNumber.toString()) === '۰' ? 0 : toArabicDigits(notificationObj.notifNumber.toString()) : toArabicDigits('0')} >
                              <NotificationsIcon style={{ color: 'black' }} />
                            </Badge>
                          )
                        }
                      </IconButton>

                    </DropdownToggle>
                    <DropdownMenu
                      right={getSessionInfo('language') === 'english' || x < 1300 ? true : false}
                      className={(notif_clicked) ? "show_notification" : ''}>
                      <div className="bg-white d-flex p-2">
                        <div className="mr-2" style={{ fontFamily: 'cnam-bold !important' }}>{getSessionInfo('language') === 'english' ? 'Notifications' : 'إشعارات'}</div>
                        <div onClick={handleViewAllNotif} className="mr-auto pointer" style={{ fontWeight: 400, color: '#6C6C6C', fontSize: '13px' }} >{getSessionInfo('language') === 'english' ? 'View all' : 'أعرض الكل '}</div>
                        <div className="break_line" /></div>

                      {
                        notificationObj.newNotif.length > 0 && notificationObj.newNotif.map((item) => {
                          return <Notification
                            props={item}
                            history={props.history}
                          />
                        }
                        )
                      }
                    </DropdownMenu>
                  </Dropdown>

                </li>

                <li className=" dropdown pr-2 show_profile m-0" style={{ paddingLeft: getSessionInfo('language') === 'arabic' ? '15px' : '' }}>
                  <Dropdown id="one" style={{ background: 'white', marginTop: '0.3rem' }} toggle={() => { }}>
                    <DropdownToggle color="" size="sm" style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <Avatar style={{ backgroundColor: 'rgb(198 2 36)', fontSize: "17px", padding: '15' }}>{avatarName}</Avatar>
                    </DropdownToggle>
                    <DropdownMenu
                      right={getSessionInfo('language') === 'english' ? true : false}
                    >
                      <DropdownItem className={`bg-white mt-2 ${getSessionInfo('language') === 'arabic' && 'text-right'}`}><Link className="link" style={{ textDecoration: 'none', color: 'black' }} to="/edit_profile" ><PersonIcon className={getSessionInfo("language") === 'english' ? "mr-1" : "ml-1"} style={{ color: 'rgb(198 2 36)', }} />{getSessionInfo('language') === 'english' ? 'Edit Profile' : 'تعديل الملف الشخصي'} <hr /></Link></DropdownItem>

                      {getSessionInfo("role") === 3 &&
                        <DropdownItem className={`bg-white ${getSessionInfo('language') === 'arabic' && 'text-right'}`}><Link className="link" style={{ textDecoration: 'none', color: 'black' }} to="/edit_company" ><SettingsIcon className={getSessionInfo("language") === 'english' ? "mr-1" : "ml-1"} style={{ color: 'rgb(198 2 36)' }} />{getSessionInfo('language') === 'english' ? 'Company profile' : 'ملف المنشأة'} <hr /></Link></DropdownItem>
                      }

                      <DropdownItem className={`bg-white mb-2 ${getSessionInfo('language') === 'arabic' && 'text-right'}`}><Link to="/" className="link" style={{ textDecoration: 'none', color: 'black' }} onClick={Logout}><ExitToAppIcon className={getSessionInfo("language") === 'english' ? "mr-1" : "ml-1"} style={{ color: 'rgb(198 2 36)' }} />{getSessionInfo('language') === 'english' ? 'Logout' : 'تسجيل خروج'}</Link></DropdownItem>

                    </DropdownMenu>
                  </Dropdown>
                </li>
              </div>

            </>
          }
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

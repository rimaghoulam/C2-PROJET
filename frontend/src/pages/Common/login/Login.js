import React, { useState } from 'react'
import axios from 'axios';
import { useForm, Controller } from "react-hook-form";

import { setSessionInfo, clearSessionInfo, getSessionInfo } from '../../../variable'
import { WS_LINK } from '../../../globals'

import InputText from '../../../components/InputText/InputText'

import { Button } from 'reactstrap'
import { toast } from 'react-toastify'

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import './Login.css'
import "../../../App.css";

import headerLogo from '../../../assets/images_png/header_logo.png'



export default function Login({ header_forgot, changeLoginState, props, setPasswordState, togglePasswordModalState }) {

    //  * **************************************************************************************************


    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: getSessionInfo('tempUserName') || "",
            password: "",
        },
    });

    const [forgotPasswordState, setForgotPasswordState] = useState(header_forgot)


    const toggleForgotPassWord = () => {
        setForgotPasswordState(p => !p)
    }



    //  * **************************************************************************************************
    //  * **************************************************************************************************





    const onSubmit = (data) => {

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        if (forgotPasswordState) { //**** * IF FORGOT PASSWORD
            const postedData = {
                email: data.username
            }

            props.toggleSpinner(true)

            axios({
                method: "post",
                url: `${WS_LINK}forget_password`,
                data: postedData,
                cancelToken: source.token,
            })
                .then(res => {
                    props.toggleSpinner(false)
                    changeLoginState()
                    togglePasswordModalState()
                    setPasswordState(res.data)
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
        else {
            //**** * IF TRYING TO LOGIN
            const postedData = {
                username: data.username,
                password: data.password,
            }

            props.toggleSpinner(true)

            const cancelToken = axios.CancelToken;
            const source = cancelToken.source()

            axios({
                method: "post",
                url: `${WS_LINK}check_login`,
                data: postedData,
                cancelToken: source.token,
            })
                .then((res) => {

                    const user_data = res.data[0]
                    const industry_data = res.data[1]

                    if (user_data.length === 1) {
                        if (user_data[0].user_active === 1) {
                            if (user_data[0].active === 1) {

                                if (user_data[0].role_id === 3 && industry_data.length === 0) {//* **** if industry but not finished registration
                                    clearSessionInfo()
                                    setSessionInfo({ name: "id", val: user_data[0].user_id })
                                    setSessionInfo({ name: "role", val: user_data[0].role_id })
                                    setSessionInfo({ name: "tempLoggedIn", val: true })
                                    setSessionInfo({ name: "token", val: user_data[0].token })
                                    setSessionInfo({ name: "name", val: user_data[0].user_name })
                                    props.history.push("/industry_register");
                                }
                                else {
                                    clearSessionInfo()
                                    setSessionInfo({ name: "role", val: user_data[0].role_id })
                                    setSessionInfo({ name: "id", val: user_data[0].user_id })
                                    setSessionInfo({ name: "loggedIn", val: true })
                                    setSessionInfo({ name: "token", val: user_data[0].token })
                                    setSessionInfo({ name: "name", val: user_data[0].user_name })
                                    changeLoginState()


                                    props.history.push('/dashboard')
                                    toast(
                                        getSessionInfo('language') === 'english' ? <div><CheckCircleOutlineIcon /> Welcome {user_data[0].user_name}</div>
                                            :
                                            <div><CheckCircleOutlineIcon /> أهلا  {user_data[0].user_name}</div>
                                        , {
                                            position: "top-right",
                                            autoClose: 2000,
                                            hideProgressBar: true,
                                            closeOnClick: true,
                                            pauseOnHover: false,
                                            draggable: false,
                                            progress: undefined,
                                            style: { textAlign: getSessionInfo('language') === 'english' ? '' : 'right', backgroundColor: '#0abb87', color: 'white' }
                                        })
                                }

                            }
                            else {
                                toast.error(
                                    getSessionInfo('language') === 'english' ? `User role not active`
                                        :
                                        `دور المستخدم غير نشط`
                                    , {
                                        position: "top-right",
                                        autoClose: 5000,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: false,
                                        progress: undefined,
                                        style: { textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }
                                    })
                                changeLoginState()
                            }
                        }
                        else {
                            toast.error(getSessionInfo('language') === 'english' ? `User not active, a verfification link has been resent`
                                :
                                `غير نشط المستخدم، وقد تم استياء رابط التحقق`, {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: false,
                                progress: undefined,
                                style: { textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }
                            })
                            changeLoginState()

                        }
                    }
                    else {
                        toast.error(
                            getSessionInfo('language') === 'english' ? "Incorrect username or password... Please try again!"
                                :
                                "اسم المستخدم او كلمة السر خاطئة... حاول مرة اخرى!", {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                            style: { textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }
                        })
                    }
                    props.toggleSpinner(false);
                }
                )
                .catch(err => {
                    props.toggleSpinner(false)
                    toast.error(getSessionInfo('language') === 'english' ? "Incorrect username or password... Please try again!"
                        :
                        "اسم المستخدم او كلمة السر خاطئة... حاول مرة اخرى!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        style: { textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }
                    })

                    if (axios.isCancel(err)) {
                        console.log('request canceled');
                    }
                    else {
                        console.log("request failed")

                    }
                });
        }

    }



    // //* ******************************************************************************************************
    // //* ******************************************************************************************************
    // //* ******************************************************************************************************

    return (

        <div>
            {getSessionInfo('language') === 'english' ? (
                <div className="w-100 ">
                    <div className="mt-4 ">

                        <div className="ml-auto" style={{ fontFamily: 'cnam-bold' }}>
                            <Button color='link close mr-0 mr-md-3' onClick={changeLoginState}>X</Button>
                        </div>


                        <div className="d-flex justify-content-center bigM ">
                            <img className="col-12 col-md-9" src={headerLogo} alt="LOGO" style={{ maxHeight: '80px' }} />
                        </div>


                        <div className="container pad-0" style={{ padding: '0% 10%' }}>
                            <div className="" style={{ fontFamily: 'cnam-bold', fontSize: '1.3rem' }}>
                                {!forgotPasswordState ?
                                    "Login to your account"
                                    : "Forgot password"
                                }
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>


                            {/* //* ************************** USERNAME */}
                            <div className="d-flex justify-content-center">
                                <div className="d-flex inputText justify-content-between w_shadow groupfocusinput shadow-sm" style={{ alignItems: 'center', border: errors.username ? '1px solid red' : '1px solid lightgrey', borderRadius: '.25rem', width: '80%', boxShadow: '0px 0.8px 4px -2px #888888' }}>
                                    <Controller
                                        render={({ field: { onChange, value } }) => (
                                            <InputText
                                                value={value}
                                                onChange={onChange}
                                                placeholder={!forgotPasswordState ? "Username or email" : "Email"}
                                                className='form-control no_shadow'
                                                style={{ border: 'none' }}
                                            />
                                        )}
                                        rules={{ required: true }}
                                        name="username"
                                        control={control}
                                    />

                                    <div style={{ paddingRight: '.75rem' }}> <AccountCircleIcon style={{ color: 'rgb(198 2 36)', fontSize: '15px' }} /></div>
                                </div>
                            </div>
                            {errors.username && (
                                <span className="errors ml-3">Username is Required.</span>
                            )}


                            {/* //* ************************** PASSWORD */}
                            {!forgotPasswordState &&
                                <>
                                    <div className="d-flex justify-content-center">
                                        <div className="d-flex inputText justify-content-between w_shadow groupfocusinput " style={{ alignItems: 'center', border: errors.password ? '1px solid red' : '1px solid lightgrey', borderRadius: '.25rem', width: '80%', boxShadow: '0px 0.8px 4px -2px #888888' }}>
                                            <Controller
                                                render={({ field: { onChange, value } }) => (
                                                    <InputText
                                                        type="password"
                                                        onChange={onChange}
                                                        value={value}
                                                        placeholder="Password"
                                                        className='form-control no_shadow'
                                                        style={{ flex: '1', border: 'none' }}
                                                    />
                                                )}

                                                rules={{ required: true }}
                                                name="password"
                                                control={control}
                                            />

                                            <div style={{ paddingRight: '.75rem' }}> <LockIcon style={{ color: 'rgb(198 2 36)', fontSize: '15px' }} /></div>
                                        </div>
                                    </div>
                                    {!forgotPasswordState && errors.password && (
                                        <span className="errors ml-3">Password is required.</span>
                                    )}
                                </>
                            }




                            {/* //* ************************** Button */}
                            <div className="d-flex mt-3 container pad-0" style={{ padding: '4% 9.5%' }}>
                                <div className="mt-2" onClick={toggleForgotPassWord} style={{ textDecoration: 'underline', color: "#e98300", fontSize: '14px', cursor: 'pointer' }}>
                                    {!forgotPasswordState ?
                                        'Forgot Password'
                                        : 'Log in'
                                    }
                                </div>
                                <Button
                                    name="btn_login"
                                    type="submit"
                                    className="ml-auto"
                                    style={{ background: 'rgb(198 2 36)', padding: '0.5rem 2rem', border: 'none' }}
                                >
                                    {!forgotPasswordState ? 'Login' : 'Send'}
                                </Button>
                            </div>

                        </form>
                        {/* //* ************************** Register */}
                        <div className="d-flex justify-content-center mt-4 mb-3">
                            <div className="d-flex"><div style={{ fontFamily: 'cnam-bold', fontSize: '0.92rem' }}>
                                Don't have an account.
                            </div>
                                <span style={{ textDecoration: 'underline', fontFamily: 'cnam-bold', fontSize: '0.92rem', color: 'rgb(198 2 36)', cursor: 'pointer', marginLeft: '5px' }} onClick={() => props.history.push("/Register")}>
                                    Sign up
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            )

                :
                // * **************************************************************************************
                // * **************************************************************************************
                // * ************************************ ARABIC ******************************************
                // * **************************************************************************************
                // * **************************************************************************************
                (
                    <div className="w-100 text-right" style={{ direction: 'rtl', fontFamily: 'cnam-ar' }}>
                        <div className="mt-4 ">


                            <div className="mr-auto ml-0 ml-sm-5" style={{ fontFamily: 'cnam-bold', float: 'left', }}>
                                <Button color='link close ml-0 ml-md-3' onClick={changeLoginState}>X</Button>
                            </div>
                            <div className="d-flex justify-content-center bigM ">
                                <img className=" col-12 col-md-9" src={headerLogo} alt="LOGO" style={{ maxHeight: '80px' }} />
                            </div>


                            <div className="container pad-0" style={{ padding: '0% 10%' }}>
                                <div className="" style={{ fontFamily: 'cnam-bold-ar', fontSize: '1.3rem' }}>
                                    {!forgotPasswordState ?
                                        "تسجيل الدخول إلى حسابك"
                                        : "هل نسيت كلمة السر"
                                    }
                                </div>
                            </div>



                            <form onSubmit={handleSubmit(onSubmit)}>


                                {/* //* ************************** username */}
                                <div className="d-flex justify-content-center">
                                    <div className="d-flex inputText justify-content-between w_shadow groupfocusinput" style={{ alignItems: 'center', border: errors.username ? '1px solid red' : '1px solid lightgrey', borderRadius: '.25rem', width: '80%', boxShadow: '0px 0.8px 4px -2px #888888' }}>
                                        <Controller
                                            render={({ field: { onChange, value } }) => (
                                                <InputText
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder={!forgotPasswordState ? "اسم المستخدم أو البريد الالكتروني" : "البريد الالكتروني"}
                                                    className='form-control no_shadow'
                                                    style={{ border: 'none' }}
                                                />
                                            )}
                                            rules={{ required: true }}
                                            name="username"
                                            control={control}
                                        />

                                        <div style={{ paddingLeft: '.75rem' }}> <AccountCircleIcon style={{ color: 'rgb(198 2 36)', fontSize: '15px' }} /></div>
                                    </div>
                                </div>
                                {errors.username && (
                                    <span className="errors text-right mr-3" style={{ fontFamilt: 'cnam-ar' }}>اسم المستخدم مطلوب</span>
                                )}

                                {/* //* ************************** password */}
                                {!forgotPasswordState &&
                                    <>
                                        <div className="d-flex justify-content-center">
                                            <div className="d-flex inputText justify-content-between w_shadow groupfocusinput " style={{ alignItems: 'center', border: errors.password ? '1px solid red' : '1px solid lightgrey', borderRadius: '.25rem', width: '80%', boxShadow: '0px 0.8px 4px -2px #888888' }}>
                                                <Controller
                                                    render={({ field: { onChange, value } }) => (
                                                        <InputText
                                                            type="password"
                                                            onChange={onChange}
                                                            value={value}
                                                            placeholder="كلمه السر"
                                                            className='form-control no_shadow'
                                                            style={{ flex: '1', border: 'none' }}
                                                        />
                                                    )}

                                                    rules={{ required: true }}
                                                    name="password"
                                                    control={control}
                                                />

                                                <div style={{ paddingLeft: '.75rem' }}> <LockIcon style={{ color: 'rgb(198 2 36)', fontSize: '15px' }} /></div>
                                            </div>
                                        </div>
                                        {!forgotPasswordState && errors.password && (
                                            <span className="errors mr-3 text-right" style={{ fontFamilt: 'cnam-ar' }}>كلمة المرور مطلوبة.</span>
                                        )}
                                    </>
                                }


                                {/* //* ************************** button */}

                                <div className="d-flex mt-3 container pad-0 justify-content-between" style={{ padding: '4% 9.5%' }}>
                                    <div className="mt-2" onClick={toggleForgotPassWord} style={{ textDecoration: 'underline', color: "#e98300", fontSize: '14px', cursor: 'pointer' }}>
                                        {!forgotPasswordState ?
                                            'هل نسيت كلمة السر'
                                            : 'يسجل دخول'
                                        }
                                    </div>
                                    <Button
                                        name="btn_login"
                                        type="submit"
                                        className="mr-auto"
                                        style={{ background: 'rgb(198 2 36)', padding: '0.5rem 2rem', border: 'none' }}
                                    >
                                        {!forgotPasswordState ? 'تسجيل الدخول' : 'أرسل'}
                                    </Button>

                                </div>


                            </form>



                            <div className="d-flex justify-content-center mt-4 mb-3">
                                <div className="d-flex"><div style={{ fontFamily: 'cnam-bold-ar', fontSize: '0.92rem' }}>ليس لديك حساب.</div><span style={{ textDecoration: 'underline', fontFamily: 'cnam-bold-ar', fontSize: '0.92rem', color: 'rgb(198 2 36)', cursor: 'pointer' }} className="ml-2" onClick={() => props.history.push("/Register")}>تسجيل حساب جديد</span></div>
                            </div>
                        </div>

                    </div>
                )

            }
        </div >
    )
}
import React, { useState } from 'react'

import { useForm, Controller } from "react-hook-form";

import { getSessionInfo } from '../../variable'

import InputText from '../InputText/InputText';

import { Button } from 'reactstrap'

import CancelIcon from '@material-ui/icons/Cancel';
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import headerLogo from '../../assets/images_png/header_logo.png'




// toggleforgot         info_pass        update_password      passwordVisiblity    handlePasswordVisibility
//       history


export default function ForgotPasswordModalBody(props) {

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

    const confirm_check = () => getValues('password') === getValues('confirm_password') ? true : false


    return (
        <>
            {
                getSessionInfo('language') === 'english' ?
                    (
                        <div>

                            <div className="row  ">
                                <Button className="ml-auto mr-4" color='link close' onClick={props.toggleforgot}>X</Button>
                            </div>

                            <div className="col-12 text-center">
                                <h6 className="text-center">

                                    {props.info_pass === 'not ok' ?
                                        <div className="text-center">
                                            <div><CancelIcon className="" style={{ fontSize: "50", color: 'rgb(198 2 36)' }} /></div>
                                            <div className="font-weight-bold mt-4 mb-4">Token is Not Valid </div>

                                        </div>
                                        :
                                        <div className="text-center">
                                            <div><img src={headerLogo} width="100%" alt="" /></div>
                                            <form onSubmit={handleSubmit(props.update_password)}>
                                                <div className=" mt-4 mb-4">
                                                    <div className="mt-3 col-12" style={{ textAlign: 'left' }}>New password *</div>
                                                    <div className="col-12 mt-3">
                                                        <Controller
                                                            render={({ field: { onChange, value } }) => (
                                                                <InputText
                                                                    value={value}
                                                                    type={passwordVisiblity.password}
                                                                    onChange={onChange}
                                                                    style={{ border: errors.password ? "1px solid red" : "" }}
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
                                                                right: "25px",
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
                                                            <span className="errors">Password is required.</span>
                                                        )}
                                                        {errors.password && errors.password.type === "pattern" && (
                                                            <span className="errors" style={{ textAlign: 'left' }}>
                                                                minimum 8 characters (UpperCase, LowerCase, Number and special character)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className=" mt-4 mb-4">
                                                    <div className="mt-3 col-12" style={{ textAlign: 'left' }}>Confirm New password *</div>
                                                    <div className="col-12 mt-3">
                                                        <Controller
                                                            render={({ field: { onChange, value } }) => (
                                                                <InputText
                                                                    value={value}
                                                                    type={passwordVisiblity.confirmPassword}
                                                                    onChange={onChange}
                                                                    style={{ border: errors.confirm_password ? "1px solid red" : "" }}
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
                                                                right: "25px",
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
                                                            <span className="errors">Password is required.</span>
                                                        )}
                                                        {errors.confirm_password && confirm_check && (
                                                            <span className="errors">
                                                                Passwords do not match
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
                                                        float: 'right'
                                                    }}
                                                >
                                                    Submit
                                                </Button>


                                            </form>
                                        </div>
                                    }
                                </h6>
                            </div>
                        </div>
                    )

                    : // ARABIC FORGOT MODAL

                    (
                        <div style={{ fontFamily: 'cnam-ar', textAlign: 'right', direction: 'rtl' }}>

                            <div className="row  ">
                                <Button className="mr-auto ml-4" color='link close' style={{ fontFamily: 'cnam' }} onClick={props.toggleforgot}>X</Button>
                            </div>

                            <div className="col-12 text-center">
                                <h6 className="text-center">

                                    {props.info_pass === 'not ok' ?
                                        <div className="text-center">
                                            <div><CancelIcon className="" style={{ fontSize: "50", color: 'rgb(198 2 36)' }} /></div>
                                            <div className="mt-4 mb-4" style={{ fontFamily: 'cnam-bold-ar' }}>رمز غير صالح</div>

                                        </div>
                                        :
                                        <div className="text-center">
                                            <div><img src={headerLogo} width="100%" alt="" /></div>
                                            <form onSubmit={handleSubmit(props.update_password)}>
                                                <div className=" mt-4 mb-4">
                                                    <div className="mt-3 col-12" style={{ textAlign: 'right' }}>كلمة المرور الجديدة *</div>
                                                    <div className="col-12 mt-3">
                                                        <Controller
                                                            render={({ field: { onChange, value } }) => (
                                                                <InputText
                                                                    value={value}
                                                                    type={passwordVisiblity.password}
                                                                    onChange={onChange}
                                                                    style={{ border: errors.password ? "1px solid red" : "" }}
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
                                                                left: "25px",
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
                                                            <span className="errors">كلمة المرور مطلوبة.</span>
                                                        )}
                                                        {errors.password && errors.password.type === "pattern" && (
                                                            <span className="errors" style={{ textAlign: 'right' }}>
                                                                الحد الأدنى 8 أحرف (أحرف كبيرة، صغيرة، ورقية شخصية خاصة)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className=" mt-4 mb-4">
                                                    <div className="mt-3 col-12" style={{ textAlign: 'right' }}>تأكيد كلمة المرور الجديدة *</div>
                                                    <div className="col-12 mt-3">
                                                        <Controller
                                                            render={({ field: { onChange, value } }) => (
                                                                <InputText
                                                                    value={value}
                                                                    type={passwordVisiblity.confirmPassword}
                                                                    onChange={onChange}
                                                                    style={{ border: errors.confirm_password ? "1px solid red" : "" }}
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
                                                                left: "25px",
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
                                                            <span className="errors">كلمة المرور مطلوبة.</span>
                                                        )}
                                                        {errors.confirm_password && confirm_check && (
                                                            <span className="errors">
                                                                كلمة المرور غير مطابقة
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
                                                        float: 'right'
                                                    }}
                                                >
                                                    Submit
                                                </Button>


                                            </form>
                                        </div>
                                    }
                                </h6>
                            </div>
                        </div>

                    )
            }
        </>
    )
}

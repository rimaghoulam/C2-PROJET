import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router';

import { getSessionInfo, clearSessionInfo } from '../../variable'
import { WS_LINK } from '../../globals'

import { Button } from 'reactstrap'

import RichTextEditor from '../RichTextEditor/RichTextEditor'
import TextArea from '../Text-Area/TextArea'
// import InputText from '../InputText/InputText'
import Modal from '../Modal/Modal'

import { useForm, Controller } from "react-hook-form";

import { toast } from 'react-toastify'

import Clear from '@material-ui/icons/Clear';

import check from '../../assets/images_png/check.png'

import './manageWebsiteCmps.css'




export default function NotificationsDetailsPage(props) {

    let { id } = useParams();
    if (id !== undefined) id = decodeURIComponent(atob(id));


    const {
        control,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            description: '',
            email_subject: '',
            email_template: '',
            notification_message: '',
            notification_id: ''
        },
    });



    const [pageLoaded, setPageLoaded] = useState(false)

    const [modalState, setModalState] = useState(false)


    useEffect(() => {

        props.setPageTitle('Manage Notifications', 'إدارة الإشعارات')

        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            templateid: id
        }

        axios({
            method: "post",
            url: `${WS_LINK}get_notification_template_by_id`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {
                    setValue('description', res.data[0].description)
                    setValue('email_subject', res.data[0].email_subject)
                    setValue('email_template', res.data[0].email_template)
                    setValue('notification_message', res.data[0].notification_message)
                    setValue('notification_id', res.data[0].notification_id)
                    setTimeout(() => {
                        setPageLoaded(true)
                    }, 0);
                }

                props.toggleSpinner(false)
            })
            .catch(err => {
                if (axios.isCancel(err)) {
                    console.log('request canceled')
                }
                else {
                    console.log("request failed")
                }
                props.toggleSpinner(false)
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const onSubmit = (event) => {
        event.preventDefault();
        if(
             watch('notification_message').trim().length === 0 ||
             watch('email_subject').trim().length === 0 ||
            watch('email_template').trim().length === 0
        ) {
            toast.error('All fields are required!', {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            })
            return
        }

        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            notification_id: watch('notification_id'),
            notification_message: watch('notification_message'),
            email_subject: watch('email_subject'),
            email_template: watch('email_template'),
        }

        axios({
            method: "post",
            url: `${WS_LINK}edit_notification_template`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {
                    if (res.data === 'ok') setModalState(true)
                }

                props.toggleSpinner(false)
            })
            .catch(err => {
                if (axios.isCancel(err)) {
                    console.log('request canceled')
                }
                else {
                    console.log("request failed")
                }
                props.toggleSpinner(false)
            });

    }


    const finish = () => {
        props.history.replace('/manage/notifications')
    }



    const modalBody = <div className="col-12">
        <div className="col-12 text-right"> <Clear className="pointer" onClick={finish} /></div>
        <div className="col-12 text-center"> <img src={check} alt="check-icon" height={75} /></div>
        <h5 className="col-12 text-center">Notification Updated Successfully!</h5>
        <div className="col-12 text-center mt-4"> <Button className="px-4 pointer" onClick={finish}>OK</Button></div>
    </div>




    return (
        <div className="cont">
            <Modal
                modalState={modalState}
                modalBody={modalBody}
            />

            {
                pageLoaded &&
                <form className="col-12 mt-3 row mb-5"
                    onSubmit={onSubmit}
                >


                    <h5 className="col-12 h6 mb-0"> Description: </h5>
                    <div className="mt-0 mb-4 col-12 h5">
                        {getValues().description}
                    </div>


                    <h5 className="col-12 h6"> Email Subject: </h5>
                    <div className="mt-1 mb-3 col-12">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <TextArea
                                    className="col-12"
                                    maxRows={5}
                                    minRows={3}
                                    placeholder="Please enter email subject"
                                    style={{ resize: 'none', border: errors.email_subject && '1px solid red' }}
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="email_subject"
                            control={control}
                        />
                        {
                            errors.email_subject && (
                                <span className="errors">Subject Required!</span>
                            )
                        }
                    </div>


                    <h5 className="col-12 h6"> Notification Message : </h5>
                    <div className="mt-1 mb-3 col-12">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <TextArea
                                    className="col-12"
                                    maxRows={5}
                                    minRows={3}
                                    placeholder="Please enter a message"
                                    style={{ resize: 'none', border: errors.notification_message && '1px solid red' }}
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="notification_message"
                            control={control}
                        />
                        {
                            errors.notification_message && (
                                <span className="errors">Message Required!</span>
                            )
                        }
                    </div>

                    <h5 className="col-12 h6"> Email Template : </h5>
                    <div className="mt-1 mb-3 col-12">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    className="col-12 px-0 mt-3"
                                    placeholder="Please enter a template..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.email_template}
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="email_template"
                            control={control}
                        />
                        {
                            errors.email_template && (
                                <span className="errors">Template Required!</span>
                            )
                        }
                    </div>

                    <div className="col-12 text-right mt-2">
                        <Button type="submit" className="px-5" style={{ backgroundColor: 'rgb(198 2 36)', borderColor: 'rgb(198 2 36)' }}>Save</Button>
                    </div>
                </form>
            }
        </div>
    )
}

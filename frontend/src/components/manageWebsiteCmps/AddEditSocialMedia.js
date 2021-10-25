/* eslint-disable eqeqeq */
import React, { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from "react-hook-form";
import { useParams } from 'react-router';
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK, } from '../../globals';
import { translate } from '../../functions';

import InputText from '../InputText/InputText'
import GenericModal from '../PageModals/GenericModal'

import { toast } from 'react-toastify'
import { useDropzone } from "react-dropzone";

import tickImage from '../../assets/images_png/true.png'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import './manageWebsiteCmps.css'

export default function AddEditSocialMedia(props) {

    let { socialId } = useParams()
    if (socialId) socialId = decodeURIComponent(atob(socialId));


    const [modalState, setmodalState] = useState(false)

    const [pageLoaded, setPageLoaded] = useState(false)

    const [miniSpinnerState, setMiniSpinnerState] = useState(false)

    // * ///////////////////////////////////////////// FORM VALIDATION
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            link: '',
            icon: ''
        },
    });



    // * /////////////////////////////////////////////////// if edit
    useEffect(() => {

        props.setPageTitle('Manage Social Media', 'إدارة وسائل التواصل الاجتماعي')

        if (socialId) {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source()


            const postedData = {
                userid: getSessionInfo('id'),
                token: getSessionInfo('token'),
            }
            props.toggleSpinner(true)
            axios({
                method: "post",
                url: `${WS_LINK}get_all_social`,
                data: postedData,
                cancelToken: source.token,
            })
                .then(res => {
                    if (getSessionInfo("role") === 4 && res.data !== "token error") {

                        let v = res.data.filter(item => item.social_id == socialId && item)

                        v = v[0]

                        setValue('icon', v.social_icon)
                        setValue('link', v.social_link)

                        setPageLoaded(true)
                    }
                    else {
                        clearSessionInfo();
                        window.location.reload(false).then(props.history.replace("/"));
                    }
                    props.toggleSpinner(false)

                })
                .catch(err => {
                    props.toggleSpinner(false)
                    if (axios.isCancel(err)) {
                        console.log('request canceled');
                    }
                    else {
                        console.log("request failed")
                    }
                });
        }
        else {
            setPageLoaded(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])






    const onDrop = useCallback(acceptedFiles => {

        let files = acceptedFiles[0];

        if (files !== undefined) {
            let fd = new FormData();
            fd.append("file", files);
            setMiniSpinnerState(true)
            axios({
                method: "post",
                url: `${WS_LINK}upload_manage_image`,
                data: fd,
            }).then((res) => {
                if (res.data !== "error") {
                    setValue('icon', res.data)
                }
                setMiniSpinnerState(false)
            })
                .catch(err => {
                    toast.error('Failed to upload File', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                    })
                    setMiniSpinnerState(false)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })




    const onSubmit = (data) => {
        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            icon: data.icon,
            link: data.link
        }


        if (socialId !== undefined) postedData['id_social'] = socialId

        axios({
            method: "post",
            url: `${WS_LINK}${socialId !== undefined ? 'update_social' : 'add_new_social'}`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {
                    setmodalState(true)
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






    return (
        <div className="cont">

            <GenericModal
                state={modalState}
                toggleState={() => props.history.goBack()}
                icon={<img src={tickImage} alt="icon" style={{ width: '50px', height: '50px' }} />}
                text={socialId ? translate('The request has been updated Successfully!', '!تم تحديث الطلب بنجاح') : translate('The request has been added Successfully!', '!تمت إضافة الطلب بنجاح')}
                buttonClick={() => props.history.goBack()}
                buttonText={translate('Ok', 'نعم')}
            />

            {pageLoaded &&
                <>
                    <div className="col-12 mb-3">
                        <button className="pointer" style={{ backgroundColor: 'transparent', border: 'none', color: '#00ab9e' }} onClick={() => props.history.goBack()}>
                            <ArrowBackIosIcon style={{ fontSize: '0.85rem' }} />Back
                        </button>
                    </div>
                    <form className="col-12 mt-3 row mb-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >


                        <h4 className="col-12 mb-3 mt-2">{socialId !== undefined ? 'Edit' : 'Add'} Social Media:</h4>


                        <div className="col-12">
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <InputText
                                        value={value}
                                        onChange={onChange}
                                        className="col-12"
                                        placeholder="Please enter the url"
                                        style={{ border: errors.link && '1px solid red' }}
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="link"
                                control={control}
                            />
                            {
                                errors.link && (
                                    <span className="errors">The Link is Required!</span>
                                )
                            }

                        </div>





                        <div className="col-12 mt-4">
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <div {...getRootProps({ className: "dropzone mt-3 col-12 pointer", style: { borderColor: errors.icon ? 'red' : 'grey' } })}>

                                        <input {...getInputProps({})} accept="image/*" />
                                        {

                                            isDragActive ?
                                                <p>Drop the files here ...</p>
                                                :
                                                <p style={{ color: errors.icon ? 'red' : 'black' }}>Drag & drop an image here, or click to select a single image</p>
                                        }
                                        {miniSpinnerState &&
                                            <div class="spinner-border spinner-border-sm" role="status">
                                                <span class="sr-only">Loading...</span>
                                            </div>
                                        }
                                        {

                                            value.length > 1 &&
                                            <img src={value.substring(0, 5) === 'data:' ? value : "data:image/*;base64," + value} alt="uploaded-pic" style={{ maxHeight: '300px' }} />
                                        }
                                    </div>
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="icon"
                                control={control}
                            />
                            {
                                errors.icon &&
                                <span className="errors">File is Required!</span>
                            }
                        </div>

                        <button type="submit" className="addButton ml-auto mr-1 mt-5 px-4"> {socialId ? 'Save' : 'Submit'} </button>

                    </form>
                </>
            }
        </div>
    )
}

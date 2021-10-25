import React, { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from "react-hook-form";

import axios from 'axios'
import { useParams } from 'react-router';
import { useDropzone } from "react-dropzone";

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK } from '../../globals';
import { translate } from '../../functions'

import TextArea from '../Text-Area/TextArea';
import GenericModal from '../PageModals/GenericModal'
import RichTextEditor from '../RichTextEditor/RichTextEditor';

import { Button } from 'reactstrap';
import { toast } from 'react-toastify'

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import tickImage from '../../assets/images_png/true.png'

import './manageWebsiteCmps.css'


export default function ManagePageComponents(props) {

    let { pageId, pageName, slug } = useParams()
    pageId = decodeURIComponent(atob(pageId));
    pageName = decodeURIComponent(atob(pageName));
    slug = decodeURIComponent(atob(slug));


    const [pageLoaded, setPageLoaded] = useState(false)

    const [modalState, setModalState] = useState(false)

    const [miniSpinnerState, setMiniSpinnerState] = useState(false)


    // * ///////////////////////////////////////////// FORM VALIDATION
    const {
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            text_en: '',
            text_ar: '',
            type: '',
        },
    });




    useEffect(() => {

        props.setPageTitle('Manage Page', 'إدارة الصفحة')

        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            page_id: pageId,
            slug: slug
        }

        axios({
            method: "post",
            url: `${WS_LINK}get_component_detail`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {

                    let t = res.data[0]

                    setValue('text_ar', t.arabic)
                    setValue('text_en', t.english)
                    setValue('type', t.type)

                    setPageLoaded(true)

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
                    setValue('text_ar', res.data)
                    setValue('text_en', res.data)
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



    const onSubmit = (event) => {
        event.preventDefault();

        if(watch('type').trim().length === 0 || watch('text_en').trim().length === 0 || watch('text_ar').trim().length === 0) {
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


        let postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            page_id: pageId,
            slug: slug,
            english: watch('text_en'),
            arabic: watch('type') === 'video' ? watch('text_en') : watch('text_ar'),
        }

        props.toggleSpinner(true)

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        axios({
            method: "post",
            url: `${WS_LINK}update_page_component`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {
                    setModalState(true)
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
        <div className="cont pl-2 pt-2">

            <GenericModal
                state={modalState}
                toggleState={() => props.history.goBack()}
                icon={<img src={tickImage} alt="icon" style={{ width: '50px', height: '50px' }} />}
                text={translate('The request has been updated Successfully!', '!تم تحديث الطلب بنجاح')}
                buttonClick={() => props.history.goBack()}
                buttonText={translate('Ok', 'نعم')}
            />

            {pageLoaded && <>

                <div className="col-12 mt-3">
                    <span style={{ color: '#00ab9e' }} className="pointer" onClick={() => props.history.goBack()}>
                        <ArrowBackIosIcon style={{ fontSize: '1rem' }} /> Back
                    </span>
                </div>

                <div className="mt-4 col-12 d-flex"><h4 >{pageName} : </h4> <h4 className="ml-2 pt-1" style={{ fontWeight: '500' }}>{slug}</h4></div>




                <form className="col-12 mt-4 mb-5 "
                    onSubmit={onSubmit}
                >
                    {/* // * *************************************************************************** */}
                    {/* // * *************************************************************************** */}


                    {
                        watch('type') === 'text' &&
                        <div className="row pl-0">
                            <div className="col-12 col-lg-6">
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <TextArea
                                            className="col-12 mt-3"
                                            maxRows={5}
                                            minRows={3}
                                            placeholder="Please enter text"
                                            style={{ resize: 'none', border: errors.text_en && '1px solid red' }}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                    rules={{
                                        required: true,
                                    }}
                                    name="text_en"
                                    control={control}
                                />
                                {
                                    errors.text_en && (
                                        <span className="errors">Text Required!</span>
                                    )
                                }
                            </div>

                            <div className="col-12 col-lg-6">
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <TextArea
                                            className="col-12 mt-3"
                                            maxRows={5}
                                            minRows={3}
                                            placeholder="الرجاء إدخال نص "
                                            style={{ direction: 'rtl', resize: 'none', border: errors.text_ar && '1px solid red' }}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                    rules={{
                                        required: true,
                                    }}
                                    name="text_ar"
                                    control={control}
                                />
                                {
                                    errors.text_ar && (
                                        <span className="errors text-right">!النص مطلوب</span>
                                    )
                                }
                            </div>


                            <div className="row mr-3 mt-4">
                                <Button type="submit" className="greenButton px-3 col-12 col-sm-6 col-lg-2 ml-auto"> Save</Button>
                            </div>
                        </div>
                    }

                    {/* // * *************************************************************************** */}
                    {/* // * *************************************************************************** */}

                    {
                        watch('type') === 'text-area' &&
                        <>
                            <div className="row" style={{ height: 'fit-content' }}>
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <RichTextEditor
                                            name="text_en"
                                            className="col-12 col-lg-6 pr-3 mt-3"
                                            placeholder="Please enter a text..."
                                            value={value}
                                            onChange={onChange}
                                            error={errors.text_en}
                                        />
                                    )}
                                    rules={{
                                        required: true,
                                    }}
                                    name="text_en"
                                    control={control}
                                    className="mb-3 mb-md-1 mb-lg-0"
                                />
                                {
                                    errors.text_en && (
                                        <span className="errors">Description Required!</span>
                                    )
                                }
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <RichTextEditor
                                            name="text_ar"
                                            className="col-12 col-lg-6 pl-3 mt-3"
                                            placeholder="الرجاء إدخال نص ..."
                                            value={value}
                                            onChange={onChange}
                                            error={errors.text_ar}
                                            language='ar'
                                        />
                                    )}
                                    rules={{
                                        required: true,
                                    }}
                                    name="text_ar"
                                    control={control}
                                    className="mt-3 mt-md-1 mt-lg-0"
                                />
                                {
                                    errors.text_ar && (
                                        <span className="errors text-right">الوصف مطلوب!</span>
                                    )
                                }

                            </div>
                            <div className="row" style={{ marginTop: '20vh' }}>
                                <Button className="greenButton col-12 col-sm-6 col-lg-2 ml-auto mr-3">Save</Button>
                            </div>
                        </>
                    }
                    {/* // * *************************************************************************** */}
                    {/* // * *************************************************************************** */}

                    {
                        watch('type') === 'image' &&
                        <>
                            <div className="row">
                                <div className="col-12 col-lg-6 mt-3">
                                    <img src={watch('text_en')} alt="uploaded-pic" style={{ width: '100%' }} />
                                </div>
                                <div className="col-12 col-lg-6">


                                    <div {...getRootProps({ className: "dropzone mt-3 mb-3" })} style={{ borderColor: errors.text_en ? 'red' : 'grey', height: '250px' }}>
                                        <input {...getInputProps({})} accept="image/*" />
                                        {
                                            isDragActive ?
                                                <p>Drop the files here ...</p> :
                                                <p>Drag & drop an image here, or click to select a single image</p>
                                        }
                                        {miniSpinnerState &&
                                            <div class="spinner-border spinner-border-sm" role="status">
                                                <span class="sr-only">Loading...</span>
                                            </div>
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className="row mt-3">
                                <Button onClick={onSubmit} className="greenButton ml-auto mr-3 px-3 col-12 col-sm-6 col-lg-2"> Save</Button>
                            </div>
                        </>
                    }

                    {/* // * *************************************************************************** */}
                    {/* // * *************************************************************************** */}


                    {
                        watch('type') === 'video' &&
                        <div className="row pl-0">
                            <div className="col-12 pr-2">
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <TextArea
                                            className="col-12 mt-3"
                                            maxRows={5}
                                            minRows={3}
                                            placeholder="Please enter embedded code"
                                            style={{ resize: 'none', border: errors.text_en && '1px solid red' }}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                    rules={{
                                        required: true,
                                    }}
                                    name="text_en"
                                    control={control}
                                />
                                {
                                    errors.text_en && (
                                        <span className="errors">Text Required!</span>
                                    )
                                }
                            </div>

                            <div className="row mr-3 mt-4">
                                <Button type="submit" className="greenButton px-3 col-12 col-sm-6 col-lg-2 ml-auto"> Save</Button>
                            </div>
                        </div>
                    }

                </form>



            </>}
        </div>
    )
}
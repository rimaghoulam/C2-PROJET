import React, { useState, useCallback, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import { useParams } from 'react-router';
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK, } from '../../globals';

import { useDropzone } from "react-dropzone";
import { toast } from 'react-toastify'

import RichTextEditor from '../RichTextEditor/RichTextEditor';
import InputText from '../InputText/InputText'
import TextArea from '../Text-Area/TextArea'
import GenericModal from '../PageModals/GenericModal'

import './manageWebsiteCmps.css'

import tickImage from '../../assets/images_png/true.png'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { translate } from '../../functions';



export default function AddEditMedia(props) {

    let { mediaType, mediaId } = useParams()

    switch (mediaType) {
        case 'success-stories':
        case 'news':
            break;
        default:
            props.history.replace('/dashboard');
            break;
    }

    if (mediaId) mediaId = decodeURIComponent(atob(mediaId));




    const [modalState, setmodalState] = useState(false)

    const [pageLoaded, setPageLoaded] = useState(false)

    const [miniSpinnerState, setMiniSpinnerState] = useState(false)

    // * ///////////////////////////////////////////// FORM VALIDATION
    const {
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title_ar: '',
            title_en: '',
            subtitle_ar: '',
            subtitle_en: '',
            description_ar: '',
            description_en: '',
            fileName: '',
            fileSend: '',
        },
    });


    // * /////////////////////////////////////////////////// if edit
    useEffect(() => {

        props.setPageTitle('Manage Media', 'إدارة وسائل الإعلام')

        if (mediaId) {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source()

            const postedData = {
                userid: getSessionInfo('id'),
                token: getSessionInfo('token'),
                mediaid: mediaId,
            }

            props.toggleSpinner(true)

            axios({
                method: "post",
                url: `${WS_LINK}get_media_details`,
                data: postedData,
                cancelToken: source.token,
            })
                .then(res => {
                    if (getSessionInfo("role") === 4 && res.data !== "token error") {

                        let item = res.data[0]

                        setValue('title_ar', item.title_a)
                        setValue('title_en', item.title_e)
                        setValue('subtitle_ar', item.text_a)
                        setValue('subtitle_en', item.text_e)
                        setValue('description_ar', item.more_a)
                        setValue('description_en', item.more_e)
                        setValue('fileSend', item.image)
                        setValue('fileName', ' ')


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
                    console.log(err)
                });
        }
        else {
            setPageLoaded(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // * /////////////////////////////////////////////////// FUCNTIONS



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
                    setValue('fileName', files.name)
                    setValue('fileSend', res.data)
                }
                setMiniSpinnerState(false)
            })
                .catch(err => {
                    setMiniSpinnerState(false)
                    toast.error('Failed to upload File', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                    })
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })




    const onSubmit = (event) => {

        event.preventDefault()


        if (watch('title_en').trim().length === 0 ||
            watch('title_ar').trim().length === 0 ||
            watch('subtitle_en').trim().length === 0 ||
            watch('subtitle_ar').trim().length === 0 ||
            watch('description_ar').trim().length === 0 ||
            watch('description_en').trim().length === 0 ||
            watch('fileSend').trim().length === 0) {
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
            slug: mediaType,
            title_english: watch('title_en'),
            title_arabic: watch('title_ar'),
            simple_english: watch('subtitle_en'),
            simple_arabic: watch('subtitle_ar'),
            description_arabic: watch('description_ar'),
            description_english: watch('description_en'),
            image: watch('fileSend'),
        }


        if (mediaId !== undefined) postedData['id_media'] = mediaId

        axios({
            method: "post",
            url: `${WS_LINK}${mediaId !== undefined ? 'update_media' : 'add_new_media'}`,
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
                text={mediaId ? translate('The request has been updated Successfully!', '!تم تحديث الطلب بنجاح') : translate('The request has been added Successfully!', '!تمت إضافة الطلب بنجاح')}
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
                        onSubmit={onSubmit}
                    >


                        <h4 className="col-12 mb-3 mt-2">{mediaId !== undefined ? 'Edit' : 'Add'} {mediaType.split("-").map(item => item + " ")}:</h4>


                        <div className="col-12 col-lg-6">
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <InputText
                                        value={value}
                                        onChange={onChange}
                                        className="col-12"
                                        placeholder="Title"
                                        style={{ border: errors.title_en && '1px solid red' }}
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="title_en"
                                control={control}
                            />
                            {
                                errors.title_en && (
                                    <span className="errors">Title Required!</span>
                                )
                            }
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <TextArea
                                        className="col-12 mt-3"
                                        maxRows={5}
                                        minRows={3}
                                        placeholder="Please enter subtitle"
                                        style={{ resize: 'none', border: errors.subtitle_en && '1px solid red' }}
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="subtitle_en"
                                control={control}
                            />
                            {
                                errors.subtitle_en && (
                                    <span className="errors">Subtitle Required!</span>
                                )
                            }
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <RichTextEditor
                                        name="messageBody"
                                        className="col-12 px-0 mt-3"
                                        placeholder="Please enter a description..."
                                        value={value}
                                        onChange={onChange}
                                        error={errors.description_en}
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="description_en"
                                control={control}
                            />

                            {
                                errors.description_en && (
                                    <span className="errors">Description Required!</span>
                                )
                            }
                        </div>





                        <div className="col-12 col-lg-6">
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <InputText
                                        value={value}
                                        onChange={onChange}
                                        className="col-12"
                                        placeholder="العنوان"
                                        style={{ border: errors.title_ar && '1px solid red', direction: 'rtl' }}
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="title_ar"
                                control={control}
                            />
                            {
                                errors.title_ar && (
                                    <div className="w-100 d-flex justify-content-end">
                                        <span className="errors">!العنوان مطلوب</span>
                                    </div>
                                )
                            }
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <TextArea
                                        className="col-12 mt-3"
                                        maxRows={5}
                                        minRows={3}
                                        placeholder="الرجاء إدخال العنوان الفرعي"
                                        style={{ resize: 'none', border: errors.subtitle_ar && '1px solid red', direction: 'rtl' }}
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="subtitle_ar"
                                control={control}
                            />
                            {
                                errors.subtitle_ar && (
                                    <div className="w-100 d-flex justify-content-end">
                                        <span className="errors">! مطلوب</span>
                                    </div>
                                )
                            }
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <RichTextEditor
                                        name="messageBody"
                                        className="col-12 px-0 mt-3"
                                        placeholder="الرجاء إدخال وصف..."
                                        value={value}
                                        onChange={onChange}
                                        error={errors.description_ar}
                                        language='ar'
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="description_ar"
                                control={control}
                            />

                            {
                                errors.description_ar && (
                                    <div className="w-100 d-flex justify-content-end">
                                        <span className="errors">! مطلوب</span>
                                    </div>
                                )
                            }
                        </div>




                        <div className="col-12">
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <div {...getRootProps({ className: "dropzone mt-3 col-12 pointer", style: { borderColor: errors.fileName ? 'red' : 'grey' } })}>

                                        <input {...getInputProps({})} accept="image/*" />
                                        {

                                            isDragActive ?
                                                <p>Drop the files here ...</p>
                                                :
                                                <p style={{ color: errors.fileName ? 'red' : 'black' }}>Drag & drop an image here, or click to select a single image</p>
                                        }
                                        {miniSpinnerState &&
                                            <div class="spinner-border spinner-border-sm" role="status">
                                                <span class="sr-only">Loading...</span>
                                            </div>
                                        }
                                        {
                                            // src = {watch('fileSend')}

                                            watch('fileSend').length > 1 &&
                                            <img src={watch('fileSend').substring(0, 5) === 'data:' ? watch('fileSend') : "data:image/*;base64," + watch('fileSend')} alt="uploaded-pic" style={{ maxHeight: '300px' }} />
                                        }
                                    </div>
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="fileName"
                                control={control}
                            />
                            {
                                errors.fileName &&
                                <span className="errors">File is Required!</span>
                            }
                        </div>

                        <button type="submit" className="addButton ml-auto mr-1 mt-3 px-4"> {mediaId ? 'Save' : 'Submit'} </button>

                    </form>
                </>
            }
        </div>
    )
}
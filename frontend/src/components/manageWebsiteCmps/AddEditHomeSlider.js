import React, { useState, useCallback, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import { useParams } from 'react-router';
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK, } from '../../globals';

import { useDropzone } from "react-dropzone";
import { toast } from 'react-toastify'

import InputText from '../InputText/InputText'
import TextArea from '../Text-Area/TextArea'
import GenericModal from '../PageModals/GenericModal'

import './manageWebsiteCmps.css'

import tickImage from '../../assets/images_png/true.png'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { translate } from '../../functions';

export default function AddEditHomeSlider(props) {


    let { slideId } = useParams()
    if (slideId) slideId = decodeURIComponent(atob(slideId));



    const [pageLoaded, setPageLoaded] = useState(false)

    const [modalState, setmodalState] = useState(false)

    const [miniSpinnerState, setMiniSpinnerState] = useState(false)

    // * ///////////////////////////////////////////// FORM VALIDATION
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title_ar: '',
            title_en: '',
            subtitle_ar: '',
            subtitle_en: '',
            button_en: '',
            button_ar: '',
            link_ar: '',
            link_en: '',
            image: ''
        },
    });





    useEffect(() => {

        props.setPageTitle('Manage slider', 'إدارة شريط التمرير')

        if (slideId) {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source()

            const postedData = {
                userid: getSessionInfo('id'),
                token: getSessionInfo('token'),
            }

            props.toggleSpinner(true)
            axios({
                method: "post",
                url: `${WS_LINK}get_all_sliders`,
                data: postedData,
                cancelToken: source.token,
            })
                .then(res => {
                    if (getSessionInfo("role") === 4 && res.data !== "token error") {

                        // eslint-disable-next-line eqeqeq
                        let r = res.data.filter(item => item.slider_id == slideId && item)
                        r = r[0]

                        setValue('title_ar', r.slider_title_ar)
                        setValue('title_en', r.slider_title)
                        setValue('subtitle_ar', r.slider_subtitle_ar)
                        setValue('subtitle_en', r.slider_subtitle)
                        setValue('button_ar', r.btn_text_ar)
                        setValue('button_en', r.btn_text)
                        setValue('link_ar', r.btn_link_ar)
                        setValue('link_en', r.btn_link)
                        setValue('image', r.slider_image)

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
                    setValue('image', res.data)
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





    const onSubmit = (data) => {
        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            image: data.image,
            title: data.title_en,
            subtitle: data.subtitle_en,
            btn: data.button_en,
            link: data.link_en,
            title_ar: data.title_ar,
            subtitle_ar: data.subtitle_ar,
            btn_ar: data.button_ar,
            link_ar: data.link_ar
        }

        if (slideId !== undefined) postedData['id_slider'] = slideId

        axios({
            method: "post",
            url: `${WS_LINK}${slideId !== undefined ? 'update_slider' : 'add_new_slider'}`,
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
                text={slideId ? translate('The slide has been updated Successfully!', '!تم تحديث الشريحة بنجاح') : translate('The slide has been added Successfully!', '!تمت إضافة الشريحة بنجاح')}
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


                        <h4 className="col-12 mb-3 mt-2">{slideId !== undefined ? 'Edit' : 'Add'} Slide:</h4>





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
                                    <InputText
                                        value={value}
                                        onChange={onChange}
                                        className="col-12 mt-3"
                                        placeholder="Button Text"
                                        style={{ border: errors.button_en && '1px solid red' }}
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="button_en"
                                control={control}
                            />
                            {
                                errors.button_en && (
                                    <span className="errors">Button Text Required!</span>
                                )
                            }


                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <InputText
                                        value={value}
                                        onChange={onChange}
                                        className="col-12 mt-3"
                                        placeholder="Link of Button"
                                        style={{ border: errors.link_en && '1px solid red' }}
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="link_en"
                                control={control}
                            />
                            {
                                errors.link_en && (
                                    <span className="errors">Link Required!</span>
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
                                    <InputText
                                        value={value}
                                        onChange={onChange}
                                        className="col-12 text-right mt-3"
                                        placeholder="نص زر"
                                        style={{ border: errors.button_ar && '1px solid red' }}
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="button_ar"
                                control={control}
                            />
                            {
                                errors.button_ar && (
                                    <div className="w-100 d-flex justify-content-end">
                                        <span className="errors">!نص زر مطلوب</span>
                                    </div>
                                )
                            }


                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <InputText
                                        value={value}
                                        onChange={onChange}
                                        className="col-12 text-right mt-3"
                                        placeholder="رابط الزر"
                                        style={{ border: errors.link_ar && '1px solid red' }}
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="link_ar"
                                control={control}
                            />
                            {
                                errors.link_ar && (
                                    <div className="w-100 d-flex justify-content-end">
                                        <span className="errors">!الرابط مطلوب</span>
                                    </div>
                                )
                            }

                        </div>







                        <div className="col-12">
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <div {...getRootProps({ className: "dropzone mt-3 col-12 pointer", style: { borderColor: errors.image ? 'red' : 'grey' } })}>

                                        <input {...getInputProps({})} accept="image/*" />
                                        {

                                            isDragActive ?
                                                <p>Drop the files here ...</p>
                                                :
                                                <p style={{ color: errors.image ? 'red' : 'black' }}>{'Drag & drop an image here, or click to select a single image'}</p>
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
                                name="image"
                                control={control}
                            />
                            {
                                errors.image &&
                                <span className="errors">File is Required!</span>
                            }
                        </div>

                        <button type="submit" className="addButton ml-auto mr-1 mt-3 px-4"> {slideId ? 'Save' : 'Submit'} </button>

                    </form>
                </>
            }
        </div>
    )
}

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import { useParams } from 'react-router';
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK, } from '../../globals';
import { translate } from '../../functions';

import InputText from '../InputText/InputText'
import TextArea from '../Text-Area/TextArea'
import GenericModal from '../PageModals/GenericModal'

import tickImage from '../../assets/images_png/true.png'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import './manageWebsiteCmps.css'

export default function AddEditVideos(props) {

    let { mediaId } = useParams()
    if (mediaId) mediaId = decodeURIComponent(atob(mediaId));


    const [modalState, setmodalState] = useState(false)
    const [pageLoaded, setPageLoaded] = useState(false)



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
            video: '',
        },
    });



    // * /////////////////////////////////////////////////// if edit
    useEffect(() => {

        props.setPageTitle('Manage Videos', 'إدارة مقاطع الفيديو')

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
                        setValue('video', item.image)

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




    const onSubmit = (data) => {
        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            slug: 'videos',
            title_english: data.title_en,
            title_arabic: data.title_ar,
            image: data.video,
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
                <>                    <div className="col-12 mb-3">
                    <button className="pointer" style={{ backgroundColor: 'transparent', border: 'none', color: '#00ab9e' }} onClick={() => props.history.goBack()}>
                        <ArrowBackIosIcon style={{ fontSize: '0.85rem' }} />Back
                    </button>
                </div>
                    <form className="col-12 mt-3 row mb-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >



                        <h4 className="col-12 mb-3 mt-2">{mediaId !== undefined ? 'Edit' : 'Add'} Video:</h4>


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

                        </div>




                        <div className="col-12 mt-4">
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <TextArea
                                        className="col-12"
                                        maxRows={5}
                                        minRows={3}
                                        placeholder="Please enter the embeded code!"
                                        style={{ resize: 'none', border: errors.video && '1px solid red' }}
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                                rules={{
                                    required: true,
                                }}
                                name="video"
                                control={control}
                            />
                            {
                                errors.video && (
                                    <span className="errors">Video Url Required!</span>
                                )
                            }
                        </div>

                        <button type="submit" className="addButton ml-auto mr-1 mt-5 px-4"> {mediaId ? 'Save' : 'Submit'} </button>

                    </form>
                </>
            }
        </div>
    )
}

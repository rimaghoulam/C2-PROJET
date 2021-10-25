import React, { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import axios from 'axios'
import { toast } from "react-toastify";

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK } from '../../globals';
import { translate } from '../../functions'

import GenericModal from '../PageModals/GenericModal'
import RichTextEditor from '../RichTextEditor/RichTextEditor';


import { Button } from 'reactstrap'

import tickImage from '../../assets/images_png/true.png'

import "./footer.css"
import "../../App.css"
import './manageWebsiteCmps.css'

export default function Footer(props) {

    const [loaded, setLoaded] = useState(false)

    const [modalState, setModalState] = useState(false)

    const {
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            widget_1_en: '',
            widget_1_ar: '',
            widget_2_en: '',
            widget_2_ar: '',
            widget_3_en: '',
            widget_3_ar: '',
            widget_4_en: '',
            widget_4_ar: '',
            footer_ar_l: '',
            footer_en_l: '',
            footer_ar_r: '',
            footer_en_r: '',
        },
    });




    useEffect(() => {

        props.setPageTitle('Manage Footer', 'إدارة تذييل الصفحة')

        getdata();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getdata = () => {
        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token')
        }

        axios({
            method: "post",
            url: `${WS_LINK}get_footer`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {
                    setValue('footer_ar_l', res.data[0].arabic)
                    setValue('footer_en_l', res.data[0].english)
                    setValue('footer_ar_r', res.data[5].arabic)
                    setValue('footer_en_r', res.data[5].english)
                    setValue('widget_1_ar', res.data[1].arabic)
                    setValue('widget_1_en', res.data[1].english)
                    setValue('widget_2_ar', res.data[2].arabic)
                    setValue('widget_2_en', res.data[2].english)
                    setValue('widget_3_ar', res.data[3].arabic)
                    setValue('widget_3_en', res.data[3].english)
                    setValue('widget_4_ar', res.data[4].arabic)
                    setValue('widget_4_en', res.data[4].english)
                    setLoaded(true)
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




    const onSubmit = event => {

        event.preventDefault()

        if (
            watch('footer_ar_l').length === 0 ||
            watch('footer_en_l').length === 0 ||
            watch('footer_ar_r').length === 0 ||
            watch('footer_en_r').length === 0 ||
            watch('widget_1_en').length === 0 ||
            watch('widget_1_ar').length === 0 ||
            watch('widget_2_en').length === 0 ||
            watch('widget_2_ar').length === 0 ||
            watch('widget_3_en').length === 0 ||
            watch('widget_3_ar').length === 0 ||
            watch('widget_4_en').length === 0 ||
            watch('widget_4_ar').length === 0
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
            footer_ar_l: watch('footer_ar_l'),
            footer_en_l: watch('footer_en_l'),
            footer_ar_r: watch('footer_ar_r'),
            footer_en_r: watch('footer_en_r'),
            footer_en_w1: watch('widget_1_en'),
            footer_ar_w1: watch('widget_1_ar'),
            footer_en_w2: watch('widget_2_en'),
            footer_ar_w2: watch('widget_2_ar'),
            footer_en_w3: watch('widget_3_en'),
            footer_ar_w3: watch('widget_3_ar'),
            footer_en_w4: watch('widget_4_en'),
            footer_ar_w4: watch('widget_4_ar'),
        }


        axios({
            method: "post",
            url: `${WS_LINK}update_footer`,
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





    // const quilColors = ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466',];



    // * ////////////////////////////////////////////////////////////////////////////////////
    return (
        <div className="cont">

            <GenericModal
                state={modalState}
                toggleState={() => setModalState(false)}
                icon={<img src={tickImage} alt="icon" style={{ width: '50px', height: '50px' }} />}
                text={translate('The footer has been updated Successfully!', '!تم تحديث تذييل الصفحة بنجاح')}
                buttonClick={() => setModalState(false)}
                buttonText={translate('Ok', 'نعم')}
            />

            {loaded &&
                <form className="col-12 mt-4 row mb-5"
                    onSubmit={onSubmit}
                >

                    <h4 className="col-12 mt-4">{translate('Footer: ', 'تذييل:')}</h4>

                    <div className="col-12 h5 mt-4">Widget 1: </div>
                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <RichTextEditor
                                        className="col-12 px-0 mt-3"
                                        placeholder="please enter a description..."
                                        value={value}
                                        onChange={onChange}
                                        error={errors.widget_1_en}
                                    />
                                </>
                            )}
                            rules={{
                                required: true,
                            }}
                            name="widget_1_en"
                            control={control}
                        />

                        {
                            errors.widget_1_en && (
                                <span className="errors">description required!</span>
                            )
                        }
                    </div>
                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    className="col-12 px-0 mt-3"
                                    placeholder="الرجاء إدخال وصف..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.widget_1_ar}
                                    language='ar'
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="widget_1_ar"
                            control={control}
                        />

                        {
                            errors.widget_1_ar && (
                                <span className="errors">الوصف مطلوب!</span>
                            )
                        }
                    </div>
                    <div className="col-12 h5 mt-4">Widget 2: </div>
                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    name="messagebody"
                                    className="col-12 px-0 mt-3"
                                    placeholder="please enter a description..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.widget_2_en}
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="widget_2_en"
                            control={control}
                        />

                        {
                            errors.widget_2_en && (
                                <span className="errors">description required!</span>
                            )
                        }
                    </div>
                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    name="messageBody"
                                    className="col-12 px-0 mt-3"
                                    placeholder="الرجاء إدخال وصف..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.widget_2_ar}
                                    language='ar'
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="widget_2_ar"
                            control={control}
                        />
                        {
                            errors.widget_2_ar && (
                                <span className="errors">الوصف مطلوب!</span>
                            )
                        }
                    </div>
                    <div className="col-12 h5 mt-4">Widget 3: </div>
                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    name="messagebody"
                                    className="col-12 px-0 mt-3"
                                    placeholder="please enter a description..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.widget_3_en}
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="widget_3_en"
                            control={control}
                        />

                        {
                            errors.widget_3_en && (
                                <span className="errors">description required!</span>
                            )
                        }
                    </div>
                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    name="messageBody"
                                    className="col-12 px-0 mt-3"
                                    placeholder="الرجاء إدخال وصف..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.widget_3_ar}
                                    language='ar'
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="widget_3_ar"
                            control={control}
                        />
                        {
                            errors.widget_3_ar && (
                                <span className="errors">الوصف مطلوب!</span>
                            )
                        }
                    </div>
                    <div className="col-12 h5 mt-4">Widget 4: </div>
                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    name="messagebody"
                                    className="col-12 px-0 mt-3"
                                    placeholder="please enter a description..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.widget_4_en}
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="widget_4_en"
                            control={control}
                        />

                        {
                            errors.widget_4_en && (
                                <span className="errors">description required!</span>
                            )
                        }
                    </div>
                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    name="messageBody"
                                    className="col-12 px-0 mt-3"
                                    placeholder="الرجاء إدخال وصف..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.widget_4_ar}
                                    language='ar'
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="widget_4_ar"
                            control={control}
                        />
                        {
                            errors.widget_4_ar && (
                                <span className="errors">الوصف مطلوب!</span>
                            )
                        }
                    </div>
                    <div className="col-12 h5 mt-4">Footer right: </div>
                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    className="col-12 px-0 mt-3"
                                    placeholder="الرجاء إدخال وصف..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.footer_en_r}
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="footer_en_r"
                            control={control}
                        />
                        {
                            errors.footer_en_r && (
                                <span className="errors">Title Required!</span>
                            )
                        }
                    </div>


                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    className="col-12 px-0 mt-3"
                                    placeholder="الرجاء إدخال وصف..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.footer_ar_r}
                                    language='ar'
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="footer_ar_r"
                            control={control}
                        />
                        {
                            errors.footer_ar_r && (
                                <span className="errors">!تذييل المطلوبة</span>
                            )
                        }
                    </div>
                    <div className="col-12 h5 mt-4">Footer left: </div>
                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    className="col-12 px-0 mt-3"
                                    placeholder="الرجاء إدخال وصف..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.footer_en_l}
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="footer_en_l"
                            control={control}
                        />
                        {
                            errors.footer_en_l && (
                                <span className="errors">Title Required!</span>
                            )
                        }
                    </div>


                    <div className="col-12 col-lg-6">
                        <Controller
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    className="col-12 px-0 mt-3"
                                    placeholder="الرجاء إدخال وصف..."
                                    value={value}
                                    onChange={onChange}
                                    error={errors.footer_ar_l}
                                    language='ar'
                                />
                            )}
                            rules={{
                                required: true,
                            }}
                            name="footer_ar_l"
                            control={control}
                        />
                        {
                            errors.footer_ar_l && (
                                <span className="errors">!تذييل المطلوبة</span>
                            )
                        }
                    </div>


                    <div className="text-right mr-3 mt-4">
                        <Button className="addButton">Submit</Button>
                    </div>


                </form>
            }
        </div>
    )
}

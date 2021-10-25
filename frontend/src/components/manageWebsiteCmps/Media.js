import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useForm, Controller } from "react-hook-form";
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK, } from '../../globals';
import { formatDate } from '../../functions'

import { Button } from 'reactstrap'
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { useDropzone } from "react-dropzone";
import { toast } from 'react-toastify'

import Table from '../Table/Table'
import InputText from '../InputText/InputText'
import TextArea from '../Text-Area/TextArea'
import RichTextEditor from '../RichTextEditor/RichTextEditor'

import './manageWebsiteCmps.css'

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';

export default function Media(props) {

    ///////////////////////////////////////// STATES
    const [addState, setAddState] = useState(false)

    const [editState, setEditState] = useState(false)

    const [disabled, setDisabled] = useState(false)

    const [tableData, setTableData] = useState({
        cols: [
            { title: "Title En", field: "title_en" },
            { title: "Title Ar", field: "title_ar" },
            { title: "Category", field: "category" },
            { title: "Date", field: "date", defaultSort: 'desc' },
            {
                title: ` `, field: "lastIcons", sorting: false, render: rowData =>
                    <>
                        <div className="row" style={{ color: '#959595' }}>
                            <EditIcon className="pointer ml-1 ml-md-auto" style={{ fontSize: "25px", color: 'rgb(198 2 36)' }} onClick={() => {
                                setValue('title_ar', rowData.lastIcons.title_ar)
                                setValue('title_en', rowData.lastIcons.title_en)
                                setValue('subtitle_ar', rowData.lastIcons.subtitle_ar)
                                setValue('subtitle_en', rowData.lastIcons.subtitle_en)
                                setValue('description_ar', rowData.lastIcons.desc_ar)
                                setValue('description_en', rowData.lastIcons.desc_en)
                                setValue('image', rowData.lastIcons.image)
                                setValue('id', rowData.lastIcons.mediaId)
                                setValue('categories', rowData.lastIcons.slug)
                                FileRef.current = rowData.lastIcons.image
                                setEditState(true)
                            }} />
                            <DeleteOutlineIcon className="pointer mt-1 mt-md-0 ml-1 mr-1 ml-md-3 mr-md-2" style={{ fontSize: "25px", color: 'rgb(198 2 36)' }} onClick={() => deleteMedia(rowData.lastIcons.mediaId)} />
                        </div>
                    </>
            },
        ]
    })



    const RowsRef = useRef({});
    RowsRef.current = tableData.rows;

    const FileRef = useRef('');



    /////////////////////////////////////////////// FORM VALIDATION
    const {
        control,
        handleSubmit,
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
            categories: '',
            file: '',
            id: ''
        },
    });


    const resetValues = () => {
        setValue('title_ar', '')
        setValue('title_en', '')
        setValue('subtitle_ar', '')
        setValue('subtitle_en', '')
        setValue('description_ar', '')
        setValue('description_en', '')
        setValue('image', '')
        setValue('id', '')
        setValue('categories', '')
        FileRef.current = ''
    }

    ///////////////////////////////////////////////////////////// PAGE CREATION

    useEffect(() => {

        getData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const getData = () => {
        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token')
        }

        axios({
            method: "post",
            url: `${WS_LINK}get_all_media`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {
                    const arr = []
                    for (let i = 0; i < res.data.length; i++) {
                        arr.push({
                            title_en: res.data[i].title_e,
                            title_ar: res.data[i].title_a,
                            category: res.data[i].slug,
                            date: formatDate(res.data[i].created_date),
                            lastIcons: {
                                mediaId: res.data[i].media_id,
                                subtitle_ar: res.data[i].text_a,
                                subtitle_en: res.data[i].text_e,
                                title_en: res.data[i].title_e,
                                title_ar: res.data[i].title_a,
                                desc_en: res.data[i].more_e,
                                desc_ar: res.data[i].more_a,
                                image: res.data[i].image,
                                slug: res.data[i].slug
                            }
                        })
                    }
                    setTableData({ ...tableData, rows: arr })
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


    ///////////////////////////////////////////////////////////// DROPOZONE

    const onDrop = useCallback(acceptedFiles => {

        let files = acceptedFiles[0];
        if (files !== undefined) {
            let fd = new FormData();
            fd.append("file", files);

            axios({
                method: "post",
                url: `${WS_LINK}upload_image`,
                data: fd,
            }).then((res) => {
                if (res.data !== "error") {
                    FileRef.current = res.data
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    //////////////////////////////////////////////////////////////// ON SUBMIT

    const onSubmit = (data) => {
        if (editState) { // if editing a value
            props.toggleSpinner(true)
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source()

            const postedData = {
                userid: getSessionInfo('id'),
                token: getSessionInfo('token'),
                id_media: data.id,
                slug: data.categories,
                title_english: data.title_en,
                title_arabic: data.title_ar,
                simple_english: data.subtitle_en,
                simple_arabic: data.subtitle_ar,
                description_arabic: data.description_ar,
                description_english: data.description_en,
                image: FileRef.current,
            }

            axios({
                method: "post",
                url: `${WS_LINK}update_media`,
                data: postedData,
                cancelToken: source.token,
            })
                .then(res => {
                    if (res.data === 'token error') {
                        clearSessionInfo()
                        window.location.reload(false).then(props.history.replace('/'))
                    }
                    else {
                        setEditState(false)
                        resetValues()
                        getData()
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
        else {
            if (addState) { // add state all working
                if (FileRef.current.length > 0) {
                    props.toggleSpinner(true)
                    const cancelToken = axios.CancelToken;
                    const source = cancelToken.source()

                    const postedData = {
                        userid: getSessionInfo('id'),
                        token: getSessionInfo('token'),
                        slug: data.categories,
                        title_english: data.title_en,
                        title_arabic: data.title_ar,
                        simple_english: data.subtitle_en,
                        simple_arabic: data.subtitle_ar,
                        description_arabic: data.description_ar,
                        description_english: data.description_en,
                        image: FileRef.current,
                    }

                    axios({
                        method: "post",
                        url: `${WS_LINK}add_new_media`,
                        data: postedData,
                        cancelToken: source.token,
                    })
                        .then(res => {
                            if (res.data === 'token error') {
                                clearSessionInfo()
                                window.location.reload(false).then(props.history.replace('/'))
                            }
                            else {
                                setAddState(false)
                                resetValues()
                                getData()
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
                else { // add state and no file entered
                    toast.error(
                        "File is required!", {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                    })
                }
            }
        }
    }


    ///////////////////////////////////////////////////// FUCNTIONS



    const deleteMedia = (id) => {

        props.toggleSpinner(true)

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            id_media: id,
        }


        axios({
            method: "post",
            url: `${WS_LINK}delete_media`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {
                    let arr = []
                    for (let i = 0; i < RowsRef.current.length; i++) {
                        if (RowsRef.current[i].lastIcons.mediaId !== id)
                            arr.push(RowsRef.current[i])
                    }
                    setTableData({ ...tableData, rows: arr })
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
            {
                /////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////////////////
                <>

                    {addState || editState ?
                        <form className="col-12 mt-3 row mb-5"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="row col-12 ml-0 ml-md-1 ml-lg-2 mt-3 mb-4">
                                <h4>Media: </h4>
                                <Button size="sm" className="ml-1 ml-md-2 ml-lg-4 addButton" onClick={() => { editState && setEditState(false); addState && setAddState(false); resetValues(); }}>Cancel</Button>
                            </div>
                            <div className="col-12 col-lg-5">
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
                                            style={{ resize: 'none', border: !disabled && errors.subtitle_en && '1px solid red' }}
                                            value={value}
                                            onChange={onChange}
                                            disabled={disabled}
                                        />
                                    )}
                                    rules={{
                                        required: !disabled && true,
                                    }}
                                    name="subtitle_en"
                                    control={control}
                                />
                                {
                                    !disabled && errors.subtitle_en && (
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
                                            readOnly={disabled}
                                            error={!disabled && errors.description_en}
                                        />
                                    )}
                                    rules={{
                                        required: !disabled && true,
                                    }}
                                    name="description_en"
                                    control={control}
                                />

                                {
                                    !disabled && errors.description_en && (
                                        <span className="errors">Description Required!</span>
                                    )
                                }
                            </div>
                            <div className="col-12 col-lg-5 mt-4 mt-md-2 mt-lg-0">
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
                                        <span className="errors">!العنوان مطلوب</span>
                                    )
                                }
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <TextArea
                                            className="col-12 mt-3"
                                            maxRows={5}
                                            minRows={3}
                                            placeholder="الرجاء إدخال العنوان الفرعي"
                                            style={{ resize: 'none', border: !disabled && errors.subtitle_ar && '1px solid red', direction: 'rtl' }}
                                            value={value}
                                            onChange={onChange}
                                            disabled={disabled}
                                        />
                                    )}
                                    rules={{
                                        required: !disabled && true,
                                    }}
                                    name="subtitle_ar"
                                    control={control}
                                />
                                {
                                    !disabled && errors.subtitle_ar && (
                                        <span className="errors">!مطلوب</span>
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
                                            readOnly={disabled}
                                            error={!disabled && errors.description_ar}
                                            language='ar'
                                        />
                                    )}
                                    rules={{
                                        required: !disabled && true,
                                    }}
                                    name="description_ar"
                                    control={control}
                                />

                                {
                                    !disabled && errors.description_ar && (
                                        <span className="errors">!مطلوب</span>
                                    )
                                }
                            </div>
                            <div className="col-12 col-lg-2 mt-4 mt-md-2 mt-lg-0">
                                <h5 className="col-12" style={{ color: errors.categories && 'red' }}>Categories:</h5>
                                {
                                    errors.categories && (
                                        <span className="errors ml-3">Required!</span>
                                    )
                                }
                                <div className="col-12">
                                    <Controller
                                        render={({ field: { onChange, value } }) => (
                                            <RadioGroup value={value} onChange={onChange}>
                                                <FormControlLabel
                                                    value="news"
                                                    control={
                                                        <Radio
                                                            size="small"
                                                            style={{
                                                                fontFamily: "cnam",
                                                                color: "rgb(198 2 36)",
                                                                zoom: 0.9
                                                            }}
                                                        />
                                                    }
                                                    className="col-12"
                                                    label="News"
                                                />
                                                <FormControlLabel
                                                    value="events"
                                                    control={
                                                        <Radio
                                                            size="small"
                                                            style={{
                                                                fontFamily: "cnam",
                                                                color: "rgb(198 2 36)",
                                                            }}
                                                            onClick={() => setDisabled(false)}
                                                        />
                                                    }
                                                    label="Events"
                                                    className="col-12"
                                                />
                                                <FormControlLabel
                                                    value="success"
                                                    control={
                                                        <Radio
                                                            size="small"
                                                            style={{
                                                                fontFamily: "cnam",
                                                                color: "rgb(198 2 36)",
                                                            }}
                                                            onClick={() => setDisabled(false)}
                                                        />
                                                    }
                                                    label="Success Stories"
                                                    className="col-12"
                                                />
                                                <FormControlLabel
                                                    value="photos"
                                                    control={
                                                        <Radio
                                                            size="small"
                                                            style={{
                                                                fontFamily: "cnam",
                                                                color: "rgb(198 2 36)",
                                                            }}
                                                            onClick={() => setDisabled(true)}
                                                        />
                                                    }
                                                    label="Photos"
                                                    className="col-12"
                                                />
                                                <FormControlLabel
                                                    value="videos"
                                                    control={
                                                        <Radio
                                                            size="small"
                                                            style={{
                                                                fontFamily: "cnam",
                                                                color: "rgb(198 2 36)",
                                                            }}
                                                            onClick={() => setDisabled(true)}
                                                        />
                                                    }
                                                    label="Videos"
                                                    className="col-12"
                                                />
                                            </RadioGroup>
                                        )}
                                        rules={{ required: true }}
                                        name="categories"
                                        control={control}
                                    />
                                </div>

                                {watch('categories') === 'videos' ?
                                    <>
                                        <Controller
                                            render={({ field: { onChange, value } }) => (
                                                <TextArea
                                                    className="col-12 mt-3"
                                                    maxRows={10}
                                                    minRows={6}
                                                    placeholder="Please enter the video's url"
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
                                                <span className="errors">Required</span>
                                            )
                                        }
                                    </>
                                    :
                                    <>
                                        <div {...getRootProps({ className: "dropzone mt-3 col-12" })}>
                                            <input {...getInputProps({})} accept="application/pdf" />
                                            {
                                                isDragActive ?
                                                    <p>Drop the files here ...</p> :
                                                    <p>Drag & drop an image here, or click to select a single image</p>
                                            }
                                        </div>
                                        {
                                            FileRef.current.length > 0 ?
                                                <>
                                                    <span>{FileRef.current}</span>
                                                </>
                                                :
                                                <>
                                                    <span>File is required</span>
                                                </>
                                        }
                                    </>
                                }
                            </div>
                            <div className="col-12 justify-content-right text-right mt-3 mt-md-1 mt-lg-0">
                                <Button className="px-3" type="submit">Submit</Button>
                            </div>
                        </form>
                        :
                        // * ///////////////////////////////////////////////////////////////////////////////////////////////////
                        // * ///////////////////////////////////////////////////////////////////////////////////////////////////
                        // * ///////////////////////////////////////////////////////////////////////////////////////////////////
                        // * ///////////////////////////////////////////////////////////////////////////////////////////////////
                        // * ///////////////////////////////////////////////////////////////////////////////////////////////////

                        <>
                            {tableData.rows &&

                                <Table
                                    name='media-table'
                                    title={
                                        <div className="my-3 row ml-1" style={{ width: '50vw' }} >
                                            <h4>Media: </h4>
                                            <Button className="ml-2 ml-md-3 ml-lg-4 addButton" onClick={() => setAddState(true)}>Add</Button>
                                        </div>
                                    }
                                    columns={tableData.cols}
                                    data={RowsRef.current}
                                    options={{
                                        pageSize: 5,
                                        emptyRowsWhenPaging: false,
                                        pageSizeOptions: [5, 10],
                                        paging: true,
                                        search: false,
                                        headerStyle:
                                        {
                                            fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                                            paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap',
                                        }
                                    }}
                                />
                            }
                        </>
                    }
                </>
            }
        </div>
    )
}

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useForm, Controller } from "react-hook-form";
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK, } from '../../globals';
import { formatDate, translate } from '../../functions'

import { Button } from 'reactstrap'
import { useDropzone } from "react-dropzone";
import { toast } from 'react-toastify'

import Table from '../Table/Table'
import InputText from '../InputText/InputText'
import TextArea from '../Text-Area/TextArea'
import GenericModal from '../PageModals/GenericModal'

import './manageWebsiteCmps.css'
import Modal from "../Modal/Modal";

import tickImage from '../../assets/images_png/true.png'
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';

export default function Testimonials(props) {


    // * /////////////////////////// STATES
    const [addState, setAddState] = useState(false)

    const [editState, setEditState] = useState(false)

    const [miniSpinnerState, setMiniSpinnerState] = useState(false)

    const [deleteModalState, setDeleteModalState] = useState({
        open: false,
        id: ''
    })

    const [successModalState, setSuccessModalState] = useState(false)



    const [tableData, setTableData] = useState({
        cols: [
            { title: "Name En", field: "name_en" },
            { title: "Name Ar", field: "name_ar" },
            { title: "Position EN", field: "position_en" },
            { title: "Position Ar", field: "position_ar" },
            { title: "Date", field: "date", defaultSort: 'desc' },
            {
                title: "", field: "lastIcons", sorting: false, render: rowData =>
                    <>
                        <div className="row" style={{ color: '#959595' }}>
                            <EditIcon className="pointer ml-1 ml-md-auto" style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }} onClick={() => {


                                setValue('name_ar', rowData.lastIcons.name_a)
                                setValue('name_en', rowData.lastIcons.name_e)
                                setValue('position_ar', rowData.lastIcons.position_a)
                                setValue('position_en', rowData.lastIcons.position_e)
                                setValue('description_en', rowData.lastIcons.text_e)
                                setValue('description_ar', rowData.lastIcons.text_a)
                                setValue('id', rowData.lastIcons.testimonialId)
                                setValue('fileSend', rowData.lastIcons.image)

                                setEditState(true)
                            }} />
                            <DeleteOutlineIcon className="pointer ml-1 mr-0 mr-md-1" style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }} onClick={() => openDeleteModal(rowData.lastIcons.testimonialId)} />
                        </div>
                    </>
            },
        ]
    })

    const RowsRef = useRef({});
    RowsRef.current = tableData.rows;




    const openDeleteModal = (id) => {
        setDeleteModalState({
            open: true,
            id: id
        })
    }

    const closeDeleteModal = () => {
        setDeleteModalState({
            open: false,
            id: ''
        })
    }

    const closeSuccessModal = () => {
        setEditState(false)
        setAddState(false)
        setSuccessModalState(false)
    }


    //////////////////////// FORM VALIDATION
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name_ar: '',
            name_en: '',
            position_ar: '',
            position_en: '',
            description_ar: '',
            description_en: '',
            id: '',
            fileSend: ''
        },
    });


    const resetValues = () => {
        setValue('name_ar', '')
        setValue('name_en', '')
        setValue('position_ar', '')
        setValue('position_en', '')
        setValue('description_ar', '')
        setValue('description_en', '')
        setValue('image', '')
        setValue('id', '')
        setValue('fileSend', '')
    }

    ////////////////////////////////////////////// PAGE CREATION

    useEffect(() => {

        props.setPageTitle('Manage Testimonials', 'إدارة الشهادات')

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
            url: `${WS_LINK}get_all_testimonials`,
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
                            name_en: res.data[i].name_e,
                            name_ar: res.data[i].name_a,
                            position_en: res.data[i].position_e,
                            position_ar: res.data[i].position_a,
                            date: formatDate(res.data[i].created_date),
                            lastIcons: {
                                testimonialId: res.data[i].testimonial_id,
                                image: res.data[i].image,
                                name_a: res.data[i].name_a,
                                name_e: res.data[i].name_e,
                                position_a: res.data[i].position_a,
                                position_e: res.data[i].position_e,
                                text_a: res.data[i].text_a,
                                text_e: res.data[i].text_e
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



    //////////////////////// DROPOZONE

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
                    setValue('fileSend', res.data)
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

    //////////////////// ON SUBMIT

    const onSubmit = (data) => {
        if (editState) { // if editing a testimonial
            props.toggleSpinner(true)
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source()

            const postedData = {
                userid: getSessionInfo('id'),
                token: getSessionInfo('token'),
                id_testimonial: data.id,
                name_english: data.name_en,
                name_arabic: data.name_ar,
                position_english: data.position_en,
                position_arabic: data.position_ar,
                description_arabic: data.description_ar,
                description_english: data.description_en,
                image: data.fileSend,
            }

            axios({
                method: "post",
                url: `${WS_LINK}update_testimonials`,
                data: postedData,
                cancelToken: source.token,
            })
                .then(res => {
                    if (res.data === 'token error') {
                        clearSessionInfo()
                        window.location.reload(false).then(props.history.replace('/'))
                    }
                    else {
                        setSuccessModalState(true)
                        getData()
                        resetValues()
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
            if (addState) {

                props.toggleSpinner(true)
                const cancelToken = axios.CancelToken;
                const source = cancelToken.source()

                const postedData = {
                    userid: getSessionInfo('id'),
                    token: getSessionInfo('token'),
                    name_english: data.name_en,
                    name_arabic: data.name_ar,
                    position_english: data.position_en,
                    position_arabic: data.position_ar,
                    description_arabic: data.description_ar,
                    description_english: data.description_en,
                    image: data.fileSend
                }

                axios({
                    method: "post",
                    url: `${WS_LINK}add_new_testimonials`,
                    data: postedData,
                    cancelToken: source.token,
                })
                    .then(res => {
                        if (res.data === 'token error') {
                            clearSessionInfo()
                            window.location.reload(false).then(props.history.replace('/'))
                        }
                        else {
                            setSuccessModalState(true)
                            getData()
                            resetValues()
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


    ///////////////////////////////////////////////////// FUCNTIONS



    const deleteTestimonial = (id) => {

        props.toggleSpinner(true)

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            id_testimonial: id,
        }


        axios({
            method: "post",
            url: `${WS_LINK}delete_testimonials`,
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
                        if (RowsRef.current[i].lastIcons.testimonialId !== id)
                            arr.push(RowsRef.current[i])
                    }
                    setTableData({ ...tableData, rows: arr })
                    closeDeleteModal()
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
                state={successModalState}
                toggleState={closeSuccessModal}
                icon={<img src={tickImage} alt="icon" style={{ width: '50px', height: '50px' }} />}
                text={editState ? translate('The request has been updated Successfully!', '!تم تحديث الطلب بنجاح') : translate('The request has been added Successfully!', '!تمت إضافة الطلب بنجاح')}
                buttonClick={closeSuccessModal}
                buttonText={translate('Ok', 'نعم')}
            />

            <Modal
                modalState={deleteModalState.open}
                modalBody={
                    <>
                        <div className="row">

                            <div className={`col-12 ${translate('text-right pr-2', 'text-left pl-2')}`}>
                                <CloseIcon className="pointer" onClick={closeDeleteModal} />
                            </div>

                            <div className="col-12 text-center">
                                <DeleteIcon style={{ fontSize: '45' }} />
                            </div>

                            <p
                                className={`col-12 mt-3 text-center `}
                                style={{ fontWeight: 'bold' }}
                            >
                                {translate('Are you sure you want to delete this testimonial?', 'هل أنت متأكد أنك تريد حذف هذه الوسائط؟')}
                            </p>

                            <button
                                style={{ border: 'none', borderRadius: '5px', backgroundColor: '#00ab9e', padding: '0.35rem 1.5rem', color: 'white', width: 'fit-content' }}
                                className="mx-auto"
                                onClick={() => deleteTestimonial(deleteModalState.id)}
                            >
                                {translate('Yes', 'نعم')}
                            </button>

                        </div>
                    </>}
            />



            {
                // * ///////////////////////////////////////////////////////////////////////////////////////////////////
                // * ///////////////////////////////////////////////////////////////////////////////////////////////////
                // * ///////////////////////////////////////////////////////////////////////////////////////////////////
                <>

                    {addState || editState ?
                        <form className="col-12 mt-3 row mb-5"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="d-flex py-3">
                                <h4>Testimonials: </h4>
                                <Button className="addButton" onClick={() => { editState && setEditState(false); addState && setAddState(false); resetValues(); }}>Cancel</Button>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <InputText
                                            value={value}
                                            onChange={onChange}
                                            className="col-12"
                                            placeholder="Name"
                                            style={{ border: errors.name_en && '1px solid red' }}
                                        />
                                    )}
                                    rules={{
                                        required: true,
                                    }}
                                    name="name_en"
                                    control={control}
                                />
                                {
                                    errors.name_en && (
                                        <span className="errors">Name Required!</span>
                                    )
                                }
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <TextArea
                                            className="col-12 mt-3"
                                            maxRows={5}
                                            minRows={3}
                                            placeholder="Please enter position"
                                            style={{ resize: 'none', border: errors.position_en && '1px solid red' }}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                    rules={{
                                        required: true,
                                    }}
                                    name="position_en"
                                    control={control}
                                />
                                {
                                    errors.position_en && (
                                        <span className="errors">Position Required!</span>
                                    )
                                }
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <TextArea
                                            name="messageBody"
                                            className="col-12 mt-3"
                                            maxRows={7}
                                            minRows={5}
                                            placeholder="Please enter a description..."
                                            value={value}
                                            onChange={onChange}
                                            style={{ resize: 'none', border: errors.description_en && '1px solid red ' }}
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
                            <div className="col-12 col-lg-6 mt-3 mt-md-2 mt-lg-0">
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <InputText
                                            value={value}
                                            onChange={onChange}
                                            className="col-12"
                                            placeholder="الاسم"
                                            style={{ border: errors.name_ar && '1px solid red', direction: 'rtl' }}
                                        />
                                    )}
                                    rules={{
                                        required: true,
                                    }}
                                    name="name_ar"
                                    control={control}
                                />
                                {
                                    errors.name_ar && (
                                        <span className="errors">!الاسم مطلوب</span>
                                    )
                                }
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <TextArea
                                            className="col-12 mt-3"
                                            maxRows={5}
                                            minRows={3}
                                            placeholder="الرجاء إدخال المنصب"
                                            style={{ resize: 'none', border: errors.position_ar && '1px solid red', direction: 'rtl' }}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                    rules={{
                                        required: true,
                                    }}
                                    name="position_ar"
                                    control={control}
                                />
                                {
                                    errors.position_ar && (
                                        <span className="errors">!مطلوب</span>
                                    )
                                }
                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <TextArea
                                            name="messageBody"
                                            className="col-12 mt-3"
                                            maxRows={7}
                                            minRows={5}
                                            placeholder="الرجاء إدخال وصف..."
                                            value={value}
                                            onChange={onChange}
                                            style={{ resize: 'none', border: errors.description_ar && '1px solid red', direction: 'rtl' }}
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
                                        <span className="errors">!مطلوب</span>
                                    )
                                }
                            </div>
                            <div className="col-12">

                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <div {...getRootProps({ className: "dropzone mt-3" })} style={{ height: '85%', borderColor: errors.fileSend ? 'red' : 'grey' }}>
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
                                            {
                                                value.length > 1 &&
                                                <img src={value.substring(0, 5) === 'data:' ? value : "data:image/*;base64," + value} alt="uploaded-pic" style={{ maxHeight: '300px' }} />
                                            }
                                        </div>
                                    )}
                                    rules={{
                                        required: true,
                                    }}
                                    name="fileSend"
                                    control={control}
                                />
                                {
                                    errors.fileSend && (
                                        <span className="errors">The File is Required!</span>
                                    )
                                }

                            </div>
                            <div className="col-12 justify-content-right text-right mt-3">
                                <Button className="addButton px-3 mt-3 mt-md-2 mt-lg-0  " type="submit">Submit</Button>
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
                                    name='testimonial-table'
                                    title={
                                        <div className="d-flex pl-0 ml-0" >
                                            <h4 >Testimonials: </h4>
                                            <Button className="addButton" onClick={() => setAddState(true)}>Add</Button>
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

                                    actions={[
                                    ]}
                                />
                            }
                        </>
                    }
                </>
            }
        </div>
    )
}





















// {/* 
// {/* <h5 className="col-12" style={{ color: errors.categories && 'red' }}>Categories:</h5>
// {
//     errors.categories && (
//         <span className="errors ml-3">Required!</span>
//     )
// }
// <div className="col-12 row"> */}
//                                     <Controller
//                                         render={({ field: { onChange, value } }) => (
//                                             <RadioGroup value={value} onChange={onChange}>
//                                                 <FormControlLabel
//                                                     value="news"
//                                                     control={
//                                                         <Radio
//                                                             size="small"
//                                                             style={{
//                                                                 fontFamily: "cnam",
//                                                                 color: "rgb(198 2 36)",
//                                                                 zoom: 0.9
//                                                             }}
//                                                         />
//                                                     }
//                                                     className="col-12"
//                                                     label="News"
//                                                 />
//                                                 <FormControlLabel
//                                                     value="events"
//                                                     control={
//                                                         <Radio
//                                                             size="small"
//                                                             style={{
//                                                                 fontFamily: "cnam",
//                                                                 color: "rgb(198 2 36)",
//                                                             }}
//                                                         />
//                                                     }
//                                                     label="Events"
//                                                     className="col-12"
//                                                 />
//                                                 <FormControlLabel
//                                                     value="success"
//                                                     control={
//                                                         <Radio
//                                                             size="small"
//                                                             style={{
//                                                                 fontFamily: "cnam",
//                                                                 color: "rgb(198 2 36)",
//                                                             }}
//                                                         />
//                                                     }
//                                                     label="Success Stories"
//                                                     className="col-12"
//                                                 />
//                                                 <FormControlLabel
//                                                     value="photos"
//                                                     control={
//                                                         <Radio
//                                                             size="small"
//                                                             style={{
//                                                                 fontFamily: "cnam",
//                                                                 color: "rgb(198 2 36)",
//                                                             }}
//                                                         />
//                                                     }
//                                                     label="Photos"
//                                                     className="col-12"
//                                                 />
//                                                 <FormControlLabel
//                                                     value="videos"
//                                                     control={
//                                                         <Radio
//                                                             size="small"
//                                                             style={{
//                                                                 fontFamily: "cnam",
//                                                                 color: "rgb(198 2 36)",
//                                                             }}
//                                                         />
//                                                     }
//                                                     label="Videos"
//                                                     className="col-12"
//                                                 />
//                                             </RadioGroup>
//                                         )}
//                                         rules={{ required: true }}
//                                         name="categories"
//                                         control={control}
//                                     />
//                                 </div> */}


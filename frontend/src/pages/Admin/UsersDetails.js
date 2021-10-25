import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Modal from "../../components/Modal/Modal";
import DropdownComponent from '../../components/Dropdown/Dropdown';

import { Button } from "reactstrap";
import { toast } from 'react-toastify'

import SmsIcon from '@material-ui/icons/Sms'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import '../../App.css';
import './userDetail.css'

import { WS_LINK } from '../../globals'
import { formatDate, downloadFile, downloadFileWithExtension } from '../../functions'
import { getSessionInfo, clearSessionInfo } from '../../variable'

import Selector from "../../components/Selector/Selector";
import InputText from '../../components/InputText/InputText';

import internship_icon from '../../assets/images_png/internship_icon.png';
import challenge_icon from '../../assets/images_png/challenge_icon.png';

import pdf from "../../assets/images_svg/pdf.svg";
import csv from "../../assets/images_svg/csv.svg";


export default function UsersDetails(props) {

    let { userId } = useParams();
    userId = decodeURIComponent(atob(userId))

    const [restoreModalState, setRestoreModalState] = useState(false)

    const [restoreEmailModal, setRestoreEmailModal] = useState({
        state: false,
        userId: '',
        email: ''
    })

    function togglecheckModalState() {
        setRestoreModalState(!restoreModalState);
    }

    const checkRestore = (user_id, user_email) => {
        togglecheckModalState();
    };

    const handleRestoreEmail = (state, userId, email) => {
        setRestoreEmailModal({
            state: state,
            userId: userId,
            email: email
        })
    }

    const checkModalBody = (
        <>
            {getSessionInfo("language") === "english" ? (
                <>
                    <div className="row ml-auto">
                        <Button className="text-right pr-2" color="link close" onClick={togglecheckModalState}>
                            X
                        </Button>
                    </div>
                    <div className="row text-center">
                    </div>
                    <div className="col-12 text-center">
                        <h6 className="text-center">Are you sure you want to restore this User password?</h6>
                    </div>
                    <div className="col-12 text-center">
                        <p className="text-center" style={{ overflow: "visible" }}>
                            {/* Be careful, if you click yes the following row will be deleted forever! */}
                        </p>
                    </div>
                    <div className="col-12 text-center">
                        <Button onClick={() => restorePassword(userId, challengeObj.details[0].user_email)}>Yes</Button>
                    </div>
                </>
            ) : (
                // ARABIC modal body

                <div style={{ fontFamily: "cnam-ar", textAlign: "right" }}>
                    <div className="row mr-auto">
                        <Button className="text-left pl-2" color="link close" onClick={togglecheckModalState}>
                            X
                        </Button>
                    </div>
                    <div className="row text-center">
                    </div>
                    <div className="col-12 text-center">
                        <h6 className="text-center">هل أنت متأكد أنك تريد حذف هذا؟</h6>
                    </div>
                    <div className="col-12 text-center">
                        <p className="text-center" style={{ overflow: "visible" }}>
                            !كن حذرا، إذا قمت بالنقر فوق "نعم" سيتم حذف الصف التالي إلى الأبد
                        </p>
                    </div>
                    <div className="col-12 text-center">
                        {/* <Button onClick={() => delete_rows(modalDetails)}>نعم</Button> */}
                    </div>
                </div>
            )}
        </>
    );






    //////////////////////////// states 
    const [challengeObj, setChallengeObj] = useState(
        {
            challenge_details: [],
            internship_details: [],
            details: [],
            comments: [],
        },
    )

    // eslint-disable-next-line no-unused-vars
    const [view_company, setView_company] = useState(false)
    const [loadedPage, setLoadedPage] = useState(false)

    ///////////////////////////////// to get data on page creation
    useEffect(() => {
        props.setPageTitle('Users Details', 'تفاصيل المستخدمين')
        get_request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const get_request = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            adminid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            userid: userId
        }
        props.toggleSpinner(true)
        axios({
            method: "post",
            url: `${WS_LINK}get_user_posted_job`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {

                if (getSessionInfo('role') === 4 && res.data !== "token error") {
                    props.toggleSpinner(false)
                    let chall = res.data[0]
                    let intern = res.data[1]
                    let detail = res.data[2]

                    setChallengeObj({
                        ...challengeObj, 'challenge_details': chall,
                        'internship_details': intern,
                        'details': detail,
                        'comments': res.data[3]
                    })

                    setLoadedPage(true)
                }
                else {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
            })
            .catch(err => {
                props.toggleSpinner(false)
                if (axios.isCancel(err)) {
                    console.log('request canceled')
                }
                else {
                    console.log("request failed")
                }

            });
    }

    /////////////////////////// functions 


    const download_pdf = (id) => {




        const cancelToken = axios.CancelToken
        const source = cancelToken.source()


        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            job: id
        }

        axios({
            method: "post",
            url: `${WS_LINK}generate_job_pdf`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data !== "role error" && res.data !== "token error") {
                    downloadFile(res.data)
                }

                else {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }

            })
            .catch(err => {

                if (axios.isCancel(err)) {
                    console.log('request canceled')
                }
                else {
                    console.log("request failed")
                }
            });
    }


    const exportUserLog = (export_type) => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            cnam_user: userId,
            type_of_export: export_type
        }
        props.toggleSpinner(true)
        axios({
            method: "post",
            url: `${WS_LINK}export_user_log`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {

                if (getSessionInfo('role') === 4 && res.data !== "token error") {
                    props.toggleSpinner(false)
                    downloadFileWithExtension(res.data, `${challengeObj.details[0].user_name} log.${export_type}`, export_type)
                }
                else {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
            })
            .catch(err => {
                props.toggleSpinner(false)
                if (axios.isCancel(err)) {
                    console.log('request canceled')
                }
                else {
                    console.log("request failed")
                }

            });
    }


    //////////////////////// styles
    const btnstyle = {
        background: '#f7de9a',
        border: 'none',
        borderRadius: '3px',
        fontSize: '11px',
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: '9px',
        paddingRight: '9px',
        color: 'black',
        fontWeight: '500',
        cursor: 'default',
        textTransform: 'capitalize',
    }
    const btnstyle2 = {
        background: "#7fd8cc",
        border: 'none',
        borderRadius: '3px',
        fontSize: '11px',
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: '9px',
        paddingRight: '9px',
        color: 'black',
        fontWeight: '500',
        textTransform: 'uppercase',
    }
    const internshipStyle = {
        background: '#fbe6cc',
        borderRadius: '11%',
        width: '40px',
        height: '40px',
        padding: '5px'
    }
    const challengeStyle = {
        background: '#ccf0eb',
        borderRadius: '11%',
        width: '40px',
        height: '40px',
        padding: '5px'
    }

    const textStyle = {
        height: '40%',
        maxWidth: '90%',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: "#7C7C7C",
        fontWeight: '500'
    };

    const space_rows = {
        paddingBottom: '15px',
        height: '270px',
        maxWidth: '100%'


    }




    const restorePassword = (user_id, user_email) => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        const postedData = {
            adminid: getSessionInfo("id"),
            token: getSessionInfo("token"),
            userid: user_id,
            email: user_email
        };

        props.toggleSpinner(true);
        axios({
            method: "post",
            url: `${WS_LINK}restore_password`,
            data: postedData,
            cancelToken: source.token,
        })
            .then((res) => {
                if (res.data === 'sent') {
                    props.toggleSpinner(false);
                    togglecheckModalState();
                } else {
                    console.log('error')
                }
            })
            .catch((err) => {
                props.toggleSpinner(false);
                if (axios.isCancel(err)) {
                    console.log("request canceled");
                } else {
                    console.log("request failed");
                }
            });
    };




    const changeUserEmail = (e) => {
        e.preventDefault()

        if (restoreEmailModal.email.length > 0) {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source();

            const postedData = {
                adminid: getSessionInfo("id"),
                token: getSessionInfo("token"),
                userid: restoreEmailModal.userId,
                email: restoreEmailModal.email
            };

            props.toggleSpinner(true);
            axios({
                method: "post",
                url: `${WS_LINK}change_user_email`,
                data: postedData,
                cancelToken: source.token,
            })
                .then((res) => {

                    if (res.data === 'email already in user') {
                        toast.error('Email Already in Use!'
                            , {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: false,
                                progress: undefined,
                                style: { textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }
                            })
                    }
                    else {
                        handleRestoreEmail(false, restoreEmailModal.userId, restoreEmailModal.email)
                        get_request()
                    }
                    props.toggleSpinner(false);

                })
                .catch((err) => {
                    props.toggleSpinner(false);
                    if (axios.isCancel(err)) {
                        console.log("request canceled");
                    } else {
                        console.log("request failed");
                    }
                });
        }
    }
    const emailModalBody = <form className="row" onSubmit={e => changeUserEmail(e)}>
        <div className="col-12">
            <Button className="text-right pr-1 " color="link close" onClick={() => handleRestoreEmail(false, '', '')}>
                X
            </Button>
        </div>
        <h6 className="mb-4 mt-2 col-12">Are you sure you want to change this User's email ?</h6>
        <div className="col-12 px-1">
            <InputText
                value={restoreEmailModal.email}
                onChange={e => setRestoreEmailModal({ ...restoreEmailModal, email: e.target.value })}
                type="email"
                placeholder="Please enter the new email"
                required={true}
            />
        </div>
        <div className="text-right col-12">
            <Button className="mt-3" style={{ background: 'var(--primary-color)', border: 'var(--primary-color)' }} type="submit">Save</Button>
        </div>
    </form>











    return (

        <>

            <Modal
                name="activatedModal"
                modalState={restoreModalState}
                // changeModalState={toggleCheckRestoreModalState}
                modalBody={checkModalBody}
            />

            <Modal
                modalState={restoreEmailModal.state}
                modalBody={emailModalBody}
            />
            {
                getSessionInfo('language') === 'english' ?
                    (
                        <>
                            {loadedPage &&
                                <div className="container-fluid " style={{ height: 'calc(100vh - 101px)', overflowY: 'scroll' }} >
                                    <div className="row justify-content-center ">

                                        <div className="col-lg-5 ">


                                            <div className="mt-4" style={{ color: 'rgb(198 2 36)', fontSize: '14px', cursor: 'pointer' }} onClick={() => props.history.goBack()}><ArrowBackIosIcon style={{ fontSize: '12px', marginTop: "-2px" }} />Back</div>
                                            <div className="mt-3 h3 font-weight-bold d-flex ">
                                                {challengeObj.details[0].user_name}
                                                {/* <span className="ml-1 p-2 py-1 pointer" style={{height:'fit-content', border: 'none', backgroundColor: 'rgb(198 2 36)', color: 'white', fontSize: '0.85rem', fontWeight: '500', fontFamily: 'cnam', borderRadius: '5px' }}
                                                    onClick={() => exportUserLog()}>
                                                    Export logs
                                                </span> */}

                                                <Selector
                                                    name="download_as"
                                                    className=" col-5 download_as ml-1"
                                                    options={[
                                                        { value: "PDF", label: <div style={{ cursor: 'pointer' }} onClick={() => exportUserLog('pdf')}><img src={pdf} alt="img" style={{ width: '19px' }} /> Export as PDF</div> },
                                                        { value: "CSV", label: <div style={{ cursor: 'pointer' }} onClick={() => exportUserLog('csv')}><img src={csv} alt="img" style={{ width: '19px' }} /> Export as CSV</div> },
                                                    ]}
                                                    placeholder='Export'
                                                    style={{ backgroundColor: 'transparent', color: 'black', marginLeft: '10px' }}
                                                />
                                            </div>



                                            <div className="mt-3 mb-3 h5 font-weight-bold">Internship</div>
                                            {challengeObj.internship_details.length !== 0 ?
                                                Object.values(challengeObj.internship_details).map((item) => {
                                                    return (
                                                        <div key={item.job_id} className="col-lg-12 pl-0 pointer" style={space_rows}>

                                                            <div className="card" style={{ boxShadow: '1px 1px 2px 1px #e0e0e0' }}>
                                                                <div className="card-body" style={{ marginBottom: "-1.2rem" }} >

                                                                    <div className="d-flex" style={{ height: '70%' }} onClick={() => props.history.push(`/internship_details/${btoa(encodeURIComponent(item.internship_job_id))}`)} >
                                                                        <div>
                                                                            <div>
                                                                                <img src={internship_icon} alt="intern" style={internshipStyle} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-fill ml-1" style={{ width: 0 }}>

                                                                            <div className="d-flex">
                                                                                <h6 className="card-title font-weight-bold">{item.internship_job_title}</h6>
                                                                                <div className="ml-auto"><MoreHorizIcon style={{ color: '#e98300' }} /></div>
                                                                            </div>


                                                                            <div style={textStyle}>{item.internship_brief_description}</div>

                                                                            <div className="mt-3"><Button style={(item.job_status === 'PENDING REVIEW') ? btnstyle : btnstyle2}>{item.job_status}</Button></div>

                                                                        </div>
                                                                    </div>
                                                                    <hr />

                                                                    <div className="d-flex">

                                                                        <div className="" style={{ color: '#8E8E8E', fontSize: '14px', zIndex: '200' }} onClick={() => download_pdf(item.job_id)}>  Download PDF  </div>
                                                                        {/* !! TODO */}
                                                                        {/* ({challengeObj.comments[item.job_id] ? challengeObj.comments[item.job_id] : 0}) */}
                                                                        <div className="ml-auto" style={{ color: '#8E8E8E', fontSize: '14px' }}><SmsIcon style={{ color: '#e98300', fontSize: '17px' }} /> 0 comments</div>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </div>
                                                    )
                                                }
                                                )
                                                :
                                                <>
                                                    <div className="col-12 text-align-center pb-3">
                                                        <span>No pending Internship! Stay tuned for more...</span>
                                                    </div>
                                                </>




                                            }


                                        </div>
                                        {/* {console.log(challengeObj)} */}

                                        <div className="col-lg-4 pb-5" >

                                            {challengeObj.details.length !== 0 && (

                                                <div>

                                                    <div className="d-flex flex-row justify-content-between align-items-end">
                                                        <div className=" h5  mb-3 font-weight-bold" style={{ marginTop: '108px' }}>Profile Details</div>
                                                        {/* <button style={{ border: "none", background: "none", color: "#959595" }} onClick={(event) => checkRestore(userId, challengeObj.details[0].user_email )}>
                                                            <p className="hov mb-3" style={{ color: "rgb(198 2 36)" }} >Restore password</p>
                                                        </button> */}

                                                        <DropdownComponent
                                                            title={'Restore'}
                                                            caret={true}
                                                            className={`ml-auto mb-2`}
                                                            dropDownToggleStyle={{ color: 'white', backgroundColor: '#00ab9e', border: '#00ab9e', borderRadius: '5px' }}
                                                            dropDownMenuStyle={{ marginTop: '-35%', marginRight: '35%' }}
                                                            data={[
                                                                { text: 'Password', divider: true, onClick: () => checkRestore(userId, challengeObj.details[0].user_email) },
                                                                { text: 'Email', divider: false, onClick: () => handleRestoreEmail(true, restoreEmailModal.userId.length > 0 ? restoreEmailModal.userId : userId, restoreEmailModal.email.length > 0 ? restoreEmailModal.email : challengeObj.details[0].user_email) },
                                                            ]}
                                                        />



                                                    </div>
                                                    <div className="container" style={{ borderRadius: '5px', background: 'white', padding: '30px', boxShadow: '0px 0px 2px 2px #E9E9E9', paddingBottom: '30px' }} >


                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'Email' : 'Company Email'}</div>
                                                        <div className="h6 font-weight-bold ">{(!restoreEmailModal.state && restoreEmailModal.email.length > 0) ? restoreEmailModal.email : !view_company ? challengeObj.details[0].user_email : challengeObj.details[0].industry_details_company_email}<hr /></div>

                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'Mobile Number' : 'Address Country'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_mobile : challengeObj.details[0].industry_details_company_address_country}<hr /></div>



                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'Office Number' : 'Primary Product'}</div>
                                                        {/* <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_office_number : challengeObj.details[0].industry_details_company_primary_product}<hr /></div> */}
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_office_number.length > 3 ? challengeObj.details[0].user_office_number : "---" : challengeObj.details[0].industry_details_company_primary_product !== null ? challengeObj.details[0].industry_details_company_primary_product : "---"}<hr /></div>


                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'Account Created' : 'Headquarter'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].created_date : challengeObj.details[0].industry_details_headquarter}<hr /></div>


                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'Job Role' : 'Company Type'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_role !== null ? challengeObj.details[0].user_role : "---" : challengeObj.details[0].industry_details_company_type !== null ? challengeObj.details[0].industry_details_company_type : "---"}<hr /></div>

                                                        {!view_company && <>
                                                            <div className="" style={{ fontWeight: '500' }}>Department</div>
                                                            <div className="h6 font-weight-bold">{challengeObj.details[0].user_department && (challengeObj.details[0].user_department.length > 1 ? challengeObj.details[0].user_department : "---")}<hr /></div>
                                                        </>
                                                        }

                                                        <div className="" style={{ fontWeight: '500' }} >{!view_company ? 'Name' : 'Company Name'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_name : challengeObj.details[0].industry_details_company_name}<hr /></div>



                                                        <div className="" style={{ fontWeight: '500' }} >{!view_company ? 'Username' : 'Company Size'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_username : challengeObj.details[0].industry_details_company_number_employee}</div>



                                                        {/*                                         <div className=""><button onClick={() =>  setView_company(!view_company)} style={{ padding: '0', background: 'none', border: 'none', textDecoration: 'underline', fontWeight: '700',color:'rgb(198 2 36)' }}>{!view_company ? 'View Company' : 'View User'}</button></div>
 */}
                                                    </div>
                                                </div>

                                            )
                                            }


                                        </div>





                                    </div>
                                </div>
                            }
                        </>
                    )

                    : // ARABIC

                    (
                        <div className="w-100" style={{ textAlign: 'right', fontFamily: 'cnam-ar' }}>
                            {loadedPage &&
                                <div className="container-fluid " style={{ height: 'calc(100vh - 101px)', overflowY: 'scroll' }} >
                                    <div className="row justify-content-center ">

                                        <div className="col-lg-5 ">


                                            <div className="mt-4" style={{ color: 'rgb(198 2 36)', fontSize: '14px', cursor: 'pointer' }} onClick={() => props.history.goBack()}><ArrowBackIosIcon style={{ fontSize: '12px', marginTop: "-2px", transform: 'rotate(180deg)' }} />عودة</div>
                                            <div className="mt-3 h3 d-flex justify-content-between font-weight-bold">
                                                {challengeObj.details[0].user_name}
                                                <span className="mr-1 p-2 py-1 pointer" style={{ height: 'fit-content', border: 'none', backgroundColor: 'rgb(198 2 36)', color: 'white', fontSize: '0.85rem', fontWeight: '500', fontFamily: 'cnam-ar', borderRadius: '5px' }}
                                                    onClick={() => exportUserLog()}>
                                                    إصدار السجلات
                                                </span>
                                            </div>

                                            <div className="mt-3 mb-3 h5" style={{ fontFamily: 'cnam-ar' }}>التحديات</div>

                                            {challengeObj.challenge_details.length !== 0 ?
                                                Object.values(challengeObj.challenge_details).map((item) => {
                                                    const date = formatDate(item.created_date)
                                                    return (

                                                        <div key={item.job_id}>

                                                            <div className=" pr-0 pointer" style={space_rows} onClick={() => props.history.push(`/challenge_details/${btoa(encodeURIComponent(item.job_id))}`)}>

                                                                <div className="card" style={{ boxShadow: '1px 1px 2px 1px #e0e0e0' }}>
                                                                    <div className="card-body" style={{ marginBottom: "-1.2rem" }}>

                                                                        <div className="d-flex" style={{ height: '70%' }} >
                                                                            <div>
                                                                                <div>
                                                                                    <img src={challenge_icon} alt="intern" style={challengeStyle} />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-fill mr-3" style={{ width: 0 }}>

                                                                                <div className="d-flex">
                                                                                    <h6 className="card-title font-weight-bold">{item.challenge_name}</h6>
                                                                                    <div className="mr-auto"><MoreHorizIcon style={{ color: '#e98300' }} /></div>
                                                                                </div>


                                                                                <div style={textStyle}>{item.challenge_description}</div>

                                                                                <div className="mt-3"><Button style={(item.job_status === 'PENDING REVIEW') ? btnstyle : btnstyle2}>{item.job_status}</Button></div>

                                                                            </div>
                                                                        </div>
                                                                        <hr />

                                                                        <div className="d-flex">
                                                                            <div className="" style={{ color: '#8E8E8E', fontSize: '14px' }}>  قدمت {date}  </div>
                                                                            <div className="mr-auto" style={{ color: '#8E8E8E', fontSize: '14px' }}><SmsIcon style={{ color: '#e98300', fontSize: '17px' }} /> ({challengeObj.comments && challengeObj.comments[item.job_id] ? challengeObj.comments[item.job_id] : 0}) تعليقات</div>
                                                                        </div>

                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                )
                                                :

                                                <>
                                                    <div className="col-12 text-align-center pb-3 pr-0">
                                                        <span>لا توجد تحديات في انتظار!ترقبوا المزيد ...</span>
                                                    </div>
                                                </>

                                            }



                                            <div className="mt-3 mb-3 h5" style={{ fontFamily: 'cnam-ar' }} >التدريب الداخلي</div>
                                            {challengeObj.internship_details.length !== 0 ?
                                                Object.values(challengeObj.internship_details).map((item) => {
                                                    return (
                                                        <div key={item.job_id} className="pr-0 pointer" style={space_rows}>

                                                            <div className="card" style={{ boxShadow: '1px 1px 2px 1px #e0e0e0' }}>
                                                                <div className="card-body" style={{ marginBottom: "-1.2rem" }} >

                                                                    <div className="d-flex" style={{ height: '70%' }} onClick={() => props.history.push(`/internship_details/${btoa(encodeURIComponent(item.internship_job_id))}`)} >
                                                                        <div>
                                                                            <div>
                                                                                <img src={internship_icon} alt="intern" style={internshipStyle} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-fill mr-3" style={{ width: 0 }}>

                                                                            <div className="d-flex">
                                                                                <h6 className="card-title font-weight-bold">{item.internship_job_title}</h6>
                                                                                <div className="mr-auto"><MoreHorizIcon style={{ color: '#e98300' }} /></div>
                                                                            </div>


                                                                            <div style={textStyle}>{item.internship_brief_description}</div>

                                                                            <div className="mt-3"><Button style={(item.job_status === 'PENDING REVIEW') ? btnstyle : btnstyle2}>{item.job_status}</Button></div>

                                                                        </div>
                                                                    </div>
                                                                    <hr />

                                                                    <div className="d-flex">

                                                                        <div className="" style={{ color: '#8E8E8E', fontSize: '14px', zIndex: '200' }} onClick={() => download_pdf(item.job_id)}>  عرض <span style={{ fontFamily: 'cnam' }}>PDF.</span>  </div>
                                                                        {/* !! TODO */}
                                                                        {/* ({challengeObj.comments[item.job_id] ? challengeObj.comments[item.job_id] : 0}) */}
                                                                        <div className="mr-auto" style={{ color: '#8E8E8E', fontSize: '14px' }}><SmsIcon style={{ color: '#e98300', fontSize: '17px' }} /> ({" "}0) تعليق</div>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </div>
                                                    )
                                                }
                                                )
                                                :
                                                <>
                                                    <div className="col-12 text-align-center pb-3">
                                                        <span>لا في انتظار التدريب!ترقبوا المزيد ...</span>
                                                    </div>
                                                </>
                                            }


                                        </div>

                                        <div className="col-lg-4 pb-5" >

                                            {challengeObj.details.length !== 0 && (

                                                <div>


                                                    <div className="d-flex flex-row justify-content-between align-items-end">
                                                        <div className=" h5  mb-3 font-weight-bold" style={{ marginTop: '108px' }}>تفاصيل الملف الشخصي</div>

                                                        <DropdownComponent
                                                            title={'يعيد'}
                                                            caret={true}
                                                            className={`mr-auto mb-2`}
                                                            dropDownToggleStyle={{ color: 'white', backgroundColor: '#00ab9e', border: '#00ab9e', borderRadius: '5px' }}
                                                            dropDownMenuStyle={{ marginTop: '-50%', marginRight: '35%' }}
                                                            data={[
                                                                { text: 'كلمه السر', divider: true, onClick: () => checkRestore(userId, challengeObj.details[0].user_email) },
                                                                { text: 'بريد الالكتروني', divider: false, onClick: () => handleRestoreEmail(true, restoreEmailModal.userId.length > 0 ? restoreEmailModal.userId : userId, restoreEmailModal.email.length > 0 ? restoreEmailModal.email : challengeObj.details[0].user_email) },
                                                            ]}
                                                        />



                                                    </div>



                                                    <div className="container" style={{ borderRadius: '5px', background: 'white', padding: '30px', boxShadow: '0px 0px 2px 2px #E9E9E9', paddingBottom: '30px' }} >


                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'بريد إلكتروني' : 'البريد الإلكتروني المنشأة'}</div>
                                                        <div className="h6 font-weight-bold ">{(!restoreEmailModal.state && restoreEmailModal.email.length > 0) ? restoreEmailModal.email : !view_company ? challengeObj.details[0].user_email : challengeObj.details[0].industry_details_company_email}<hr /></div>

                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'رقم الهاتف المحمول' : 'العنوان البلد'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_mobile : challengeObj.details[0].industry_details_company_address_country}<hr /></div>

                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'رقم المكتب' : 'المنتج الأساسي'}</div>
                                                        {/* <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_office_number : challengeObj.details[0].industry_details_company_primary_product}<hr /></div> */}
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_office_number.length > 2 ? challengeObj.details[0].user_office_number : "---" : challengeObj.details[0].industry_details_company_primary_product !== null ? challengeObj.details[0].industry_details_company_primary_product : "---"}<hr /></div>

                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'تم إنشاء الحساب' : 'المركز الرئيسى'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].created_date : challengeObj.details[0].industry_details_headquarter}<hr /></div>


                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'المسمى الوظيفي' : 'نوع المنشأة'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_role !== null ? challengeObj.details[0].user_role : "---" : challengeObj.details[0].industry_details_company_type !== null ? challengeObj.details[0].industry_details_company_type : "---"}<hr /></div>


                                                        {!view_company && <>
                                                            <div className="" style={{ fontWeight: '500' }}>القسم</div>
                                                            <div className="h6 font-weight-bold">{challengeObj.details[0].user_department.length > 1 ? challengeObj.details[0].user_department : "---"}<hr /></div>
                                                        </>
                                                        }

                                                        <div className="" style={{ fontWeight: '500' }} >{!view_company ? 'الاسم' : 'اسم المنشأة'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_name : challengeObj.details[0].industry_details_company_name}<hr /></div>



                                                        <div className="" style={{ fontWeight: '500' }} >{!view_company ? 'اسم المستخدم' : 'حجم المنشأة'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_username : challengeObj.details[0].industry_details_company_number_employee}</div>



                                                        {/*                                         <div className=""><button onClick={() =>  setView_company(!view_company)} style={{ padding: '0', background: 'none', border: 'none', textDecoration: 'underline', fontWeight: '700',color:'rgb(198 2 36)' }}>{!view_company ? 'View Company' : 'View User'}</button></div>
 */}
                                                    </div>
                                                </div>

                                            )
                                            }


                                        </div>





                                    </div>
                                </div>
                            }
                        </div>
                    )

            }
        </>
    )
}


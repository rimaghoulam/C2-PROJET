// TODO fix cards
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Button } from "reactstrap";

import { WS_LINK } from '../../globals'
import { getSessionInfo, clearSessionInfo } from '../../variable'
import { formatDate, downloadFile, downloadFileWithExtension } from '../../functions'

import internship_icon from '../../assets/images_png/internship_icon.png';
import challenge_icon from '../../assets/images_png/challenge_icon.png';
import Selector from "../../components/Selector/Selector";

import SmsIcon from '@material-ui/icons/Sms'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import pdf from "../../assets/images_svg/pdf.svg";
import csv from "../../assets/images_svg/csv.svg";

import '../../App.css';
import './userDetail.css'


export default function IndustryDetails(props) {


    ////////////////////// get id by param
    let { industryid } = useParams();
    industryid = decodeURIComponent(atob(industryid))



    /////////////////////////////////// states 
    const [challengeObj, setChallengeObj] = useState(
        {
            challenge_details: [],
            internship_details: [],
            details: [],
        })

    // eslint-disable-next-line no-unused-vars
    const [view_company, setView_company] = useState(true)

    const [loadedPage, setLoadedPage] = useState(false)

    ////////////////////// to get data on page creation
    useEffect(() => {
        props.setPageTitle('Industry Details', 'تفاصيل الصناعة')
        get_request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const get_request = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            adminid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            industryid: industryid
        }
        props.toggleSpinner(true)
        axios({
            method: "post",
            url: `${WS_LINK}get_jobs_by_industry_id`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (getSessionInfo('role') === 4 && res.data !== "token error") {
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
                props.toggleSpinner(false)
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



    /////////////////////// functions


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
                    downloadFile(res.data, challengeObj.details[0].industry_details_company_name + ".pdf")
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

    const exportIndustryLog = (export_type) => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            industry_id: industryid,
            type_of_export: export_type
        }
        props.toggleSpinner(true)
        axios({
            method: "post",
            url: `${WS_LINK}export_industry_log`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {

                if (getSessionInfo('role') === 4 && res.data !== "token error") {
                    props.toggleSpinner(false)
                    downloadFileWithExtension(res.data, `${!view_company ? challengeObj.details[0].user_email : challengeObj.details[0].industry_details_company_name}-log.${export_type}`, export_type)
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



    ///////////////////////// STYLES
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
        height: '45%',
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
    return (

        <>
            {
                getSessionInfo('language') === 'english' ?
                    (
                        <>
                            {loadedPage &&
                                <div className="container-fluid " style={{ height: 'calc(100vh - 101px)', overflowY: 'scroll' }} >
                                    <div className="row justify-content-center ">

                                        <div className="col-lg-5 ">


                                            <div className="mt-4" style={{ color: 'rgb(198 2 36)', fontSize: '14px', cursor: 'pointer' }} onClick={() => props.history.goBack()}><ArrowBackIosIcon style={{ fontSize: '12px', marginTop: "-2px" }} />Back</div>
                                            <div className=":t-3 h3 font-weight-bold d-flex justify-content-between">
                                                {/* {challengeObj.details[0].industry_details_company_name} */}
                                            </div>



                                            <div className="mt-3 mb-3 h5 font-weight-bold">Internship</div>
                                            {challengeObj.internship_details.length !== 0 ?
                                                Object.values(challengeObj.internship_details).map((item) => {
                                                    return (
                                                        <div key={item.job_id} className="col-lg-12 pl-0 pointer" style={space_rows}>

                                                            <div className="card" style={{ boxShadow: '1px 1px 2px 1px #e0e0e0' }}>
                                                                <div className="card-body" style={{ marginBottom: "-2.5rem" }} >

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
                                                                        <div className="ml-auto" style={{ color: '#8E8E8E', fontSize: '14px' }}><SmsIcon style={{ color: '#e98300', fontSize: '17px' }} /> ({challengeObj.comments[item.job_id] ? challengeObj.comments[item.job_id] : 0}) comments</div>
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


                                        <div className="col-lg-4 pb-5" >

                                            {challengeObj.details[0].length !== 0 && (

                                                <div>

                                                    <div className=" h5  mb-3 font-weight-bold d-flex align-items-center justify-content-between" style={{ marginTop: '63px' }}>
                                                        Profile Details

                                                        <Selector
                                                            name="download_as"
                                                            className=" col-5 download_as ml-1"
                                                            options={[
                                                                { value: "PDF", label: <div style={{ cursor: 'pointer' }} onClick={() => exportIndustryLog('pdf')}><img src={pdf} alt="img" style={{ width: '19px' }} /> Export as PDF</div> },
                                                                { value: "CSV", label: <div style={{ cursor: 'pointer' }} onClick={() => exportIndustryLog('csv')}><img src={csv} alt="img" style={{ width: '19px' }} /> Export as CSV</div> },
                                                            ]}
                                                            placeholder='Export'
                                                            style={{ backgroundColor: 'transparent', color: 'black', marginLeft: '10px' }}
                                                        />
                                                        {/* <span className="ml-1 p-2 py-1 pointer" style={{height:'fit-content', border: 'none', backgroundColor: 'rgb(198 2 36)', color: 'white', fontSize: '0.85rem', fontWeight: '500', fontFamily: 'cnam', borderRadius: '5px' }}
                                                            onClick={() => exportIndustryLog()}>
                                                            Export logs
                                                        </span>       */}
                                                    </div>

                                                    <div className="container" style={{ borderRadius: '5px', background: 'white', padding: '30px', boxShadow: '0px 0px 2px 2px #E9E9E9', paddingBottom: '30px' }} >


                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'Email' : 'Company Email'}</div>
                                                        <div className="h6 font-weight-bold ">{!view_company ? challengeObj.details[0].user_email : challengeObj.details[0].industry_details_company_email}<hr /></div>

                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'Mobile Number' : 'Address Country'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_mobile : challengeObj.details[0].industry_details_company_address_country}<hr /></div>

                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'Office Number' : 'Primary Product'}</div>
                                                        {/* <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_office_number : challengeObj.details[0].industry_details_company_primary_product}<hr /></div> */}
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_office_number !== null ? challengeObj.details[0].user_office_number : "---" : challengeObj.details[0].industry_details_company_primary_product !== null ? challengeObj.details[0].industry_details_company_primary_product : "---"}<hr /></div>


                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'Account Created' : 'Headquarter'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].created_date : challengeObj.details[0].industry_details_headquarter}<hr /></div>


                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'Job Role' : 'Company Type'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_role !== null ? challengeObj.details[0].user_role : "---" : challengeObj.details[0].industry_details_company_type !== null ? challengeObj.details[0].industry_details_company_type : "---"}<hr /></div>




                                                        <div className="" style={{ fontWeight: '500' }} >{!view_company ? 'Name' : 'Company Name'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_name : challengeObj.details[0].industry_details_company_name}<hr /></div>



                                                        <div className="" style={{ fontWeight: '500' }} >{!view_company ? 'Username' : 'Company Size'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_username : challengeObj.details[0].industry_details_company_number_employee}<hr /></div>



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
                        <div className="w-100" style={{ fontFamily: 'cnam-ar', textAlign: 'right' }}>
                            {loadedPage &&
                                <div className="container-fluid " style={{ height: 'calc(100vh - 101px)', overflowY: 'scroll' }} >
                                    <div className="row justify-content-center ">

                                        <div className="col-lg-5 ">


                                            <div className="mt-4" style={{ color: 'rgb(198 2 36)', fontSize: '14px', cursor: 'pointer' }} onClick={() => props.history.goBack()}><ArrowBackIosIcon style={{ fontSize: '12px', marginTop: "-2px", transform: 'rotate(180deg)' }} />عودة</div>
                                            <div className="mt-3 h3 font-weight-bold">{challengeObj.details[0].user_name}</div>

                                            <div className="mt-3 mb-3 h5" style={{ fontFamily: 'cnam-bold-ar' }}>التحديات</div>

                                            {challengeObj.challenge_details.length !== 0 ?
                                                Object.values(challengeObj.challenge_details).map((item) => {
                                                    const date = formatDate(item.created_date)
                                                    return (

                                                        <div key={item.job_id}>

                                                            <div className="col-lg-12 pr-0 pointer" style={space_rows} onClick={() => props.history.push(`/challenge_details/${btoa(encodeURIComponent(item.job_id))}`)}>

                                                                <div className="card" style={{ boxShadow: '1px 1px 2px 1px #e0e0e0' }}>
                                                                    <div className="card-body" style={{ marginBottom: "-2.5rem" }}>

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
                                                                            <div className="mr-auto" style={{ color: '#8E8E8E', fontSize: '14px' }}><SmsIcon style={{ color: '#e98300', fontSize: '17px' }} /> ({challengeObj.comments[item.job_id] ? challengeObj.comments[item.job_id] : 0}) تعليقات</div>
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
                                                    <div className="col-12 text-align-center pr-0 pb-3">
                                                        <span>لا توجد تحديات في انتظار!ترقبوا المزيد ...</span>
                                                    </div>
                                                </>

                                            }



                                            <div className="mt-3 mb-3 h5" style={{ fontFamily: 'cnam-bold-ar' }}>التدريب الداخلي</div>
                                            {challengeObj.internship_details.length !== 0 ?
                                                Object.values(challengeObj.internship_details).map((item) => {
                                                    return (
                                                        <div key={item.job_id} className="col-lg-12 pr-0 pointer" style={space_rows}>

                                                            <div className="card" style={{ boxShadow: '1px 1px 2px 1px #e0e0e0' }}>
                                                                <div className="card-body" style={{ marginBottom: "-2.5rem" }} >

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

                                                                        <div className="" style={{ color: '#8E8E8E', fontSize: '14px', zIndex: '200' }} onClick={() => download_pdf(item.job_id)}>  عرض <span style={{ fontFamily: 'cnam' }}>PDF.</span> </div>
                                                                        <div className="mr-auto" style={{ color: '#8E8E8E', fontSize: '14px' }}><SmsIcon style={{ color: '#e98300', fontSize: '17px' }} /> ( {" "}{challengeObj.comments[item.job_id] ? challengeObj.comments[item.job_id] : 0}) تعليقات</div>
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

                                            {challengeObj.details[0].length !== 0 && (

                                                <div>

                                                    <div className=" h5 d-flex justify-content-between mb-3" style={{ marginTop: '63px', fontFamily: 'cnam-bold-ar' }}>
                                                        تفاصيل الملف الشخصي
                                                        <span className="mr-1 p-2 py-1 pointer" style={{ height: 'fit-content', border: 'none', backgroundColor: 'rgb(198 2 36)', color: 'white', fontSize: '0.85rem', fontWeight: '500', fontFamily: 'cnam-ar', borderRadius: '5px' }}
                                                            onClick={() => exportIndustryLog()}>
                                                            إصدار السجلات
                                                        </span>
                                                    </div>

                                                    <div className="container" style={{ borderRadius: '5px', background: 'white', padding: '30px', boxShadow: '0px 0px 2px 2px #E9E9E9', paddingBottom: '30px' }} >


                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'بريد إلكتروني' : 'البريد الإلكتروني المنشأة'}</div>
                                                        <div className="h6 font-weight-bold ">{!view_company ? challengeObj.details[0].user_email : challengeObj.details[0].industry_details_company_email}<hr /></div>

                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'رقم الهاتف المحمول' : 'العنوان البلد'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_mobile : challengeObj.details[0].industry_details_company_address_country}<hr /></div>

                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'رقم المكتب' : 'المنتج الأساسي'}</div>
                                                        {/* <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_office_number : challengeObj.details[0].industry_details_company_primary_product}<hr /></div> */}
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_office_number !== null ? challengeObj.details[0].user_office_number : "---" : challengeObj.details[0].industry_details_company_primary_product !== null ? challengeObj.details[0].industry_details_company_primary_product : "---"}<hr /></div>


                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'تم إنشاء الحساب' : 'المركز الرئيسى'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].created_date : challengeObj.details[0].industry_details_headquarter}<hr /></div>


                                                        <div className="" style={{ fontWeight: '500' }}>{!view_company ? 'المسمى الوظيفي' : 'نوع المنشأة'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_role !== null ? challengeObj.details[0].user_role : "---" : challengeObj.details[0].industry_details_company_type !== null ? challengeObj.details[0].industry_details_company_type : "---"}<hr /></div>




                                                        <div className="" style={{ fontWeight: '500' }} >{!view_company ? 'اسم' : 'اسم المنشأة'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_name : challengeObj.details[0].industry_details_company_name}<hr /></div>



                                                        <div className="" style={{ fontWeight: '500' }} >{!view_company ? 'اسم المستخدم' : 'حجم المنشأة'}</div>
                                                        <div className="h6 font-weight-bold">{!view_company ? challengeObj.details[0].user_username : challengeObj.details[0].industry_details_company_number_employee}<hr /></div>



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


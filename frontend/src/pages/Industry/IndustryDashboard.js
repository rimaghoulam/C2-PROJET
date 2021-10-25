import React, { useState, useEffect, useRef } from 'react';
import { Button } from "reactstrap";
import axios from 'axios';

import { WS_LINK, } from '../../globals'
import { getSessionInfo, clearSessionInfo } from '../../variable'
import { translate, checkFontFamily, checkTextAlignment, downloadFile, toArabicDigits } from '../../functions'

import Spinner from "../../components/spinner/Spinner"
import ChallengeInternshipCard from '../../components/ChallengeInternshipCard/ChallengeInternshipCard';
import IndustryDashboardComment from '../../components/IndustryDashboardComment/IndustryDashboardComment';

import Loader from 'react-loader-advanced';


import '../../App.css';
import './industrydashboard.css'


export default function IndustryDashboard(props) {


    const discussionChallengeRelation = useRef({})


    //* //***********************************       states
    const [industrydashboardObj, setindustrydashboardObj] = useState(
        {
            internship_details: [],
            challenges_info: [],
            count_comments: [],
            discussion: [],
        }
    )
    const [loaderState, setLoaderState] = useState(false)
    const [loadedPage, setLoadedPage] = useState(false)


    // * ******************************************************* to get data on page creation
    useEffect(() => {
        props.setPageTitle('Dashboard', 'لوحة إدارة المنصة')
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token')
        }

        setLoaderState(true)
        axios({
            method: "post",
            url: `${WS_LINK}get_industry_dashboard`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {

                if (res.data !== "role error" && res.data !== "token error") {

                    setLoaderState(false)
                    let intern = res.data[0]
                    let challenge = res.data[1]
                    let comments = [res.data[2], res.data[3]]
                    let discussions = [res.data[4], res.data[5]]
                    if (res.data.length >= 1 && intern !== 'e' && challenge !== 'r') {
                        setindustrydashboardObj({
                            ...industrydashboardObj, 'internship_details': intern,
                            'challenges_info': challenge,
                            'count_comments': comments,
                            'discussion': discussions
                        })
                    }
                    setLoadedPage(true)
                }
                else {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
            })
            .catch(err => {
                setLoaderState(false)
                if (axios.isCancel(err)) {
                    console.log('request canceled')
                }
                else {
                    console.log("request failed")
                }

            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // *********************************************** FUNCTIONS


    const download_pdf = (jobid) => {

        const cancelToken = axios.CancelToken
        const source = cancelToken.source()


        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            job: jobid
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


    // * ******************** 


    const check_agree = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        const postedData = {
            userid: getSessionInfo("id"),
            token: getSessionInfo("token"),
        };

        props.toggleSpinner(true);
        axios({
            method: "post",
            url: `${WS_LINK}get_agree_guidline`,
            data: postedData,
            cancelToken: source.token,
        })
            .then((res) => {

                if (res.data !== "role error" && res.data !== "token error") {


                    if (res.data.length === 1) {

                        const cancelToken = axios.CancelToken;
                        const source = cancelToken.source()

                        const postedData = {
                            userid: getSessionInfo('id'),
                            token: getSessionInfo('token')
                        }


                        axios({
                            method: "post",
                            url: `${WS_LINK}check_self_signed_nda`,
                            data: postedData,
                            cancelToken: source.token,
                        })
                            .then(res => {


                                if (res.data && res.data.length !== 0 && res.data === 'yes')

                                    props.history.push('/post_challenge')

                                else props.history.push('/nda')



                            }
                            )
                            .catch(err => {
                                props.toggleSpinner(false)
                                if (axios.isCancel(err)) {
                                    console.log('request canceled')
                                }
                                else {
                                    console.log("request failed")
                                }

                            });
                    } else props.history.push('/nda')
                }
                else {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
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
    }











    return (
        <>
            <Loader message={<span><Spinner /> </span>} show={loaderState} backgroundStyle={{ zIndex: "9999" }}>
                {loadedPage &&
                    <div className="BodyHeight p-0 d-flex flex-wrap justify-content-between" >
                        <div className="col-lg-9 px-4 h-100 custom_scrollbar remove_scroll_mobile scroll-in-body" style={{ background: "#fffdfc" }}>

                          

                        
                            <div className="mt-3 mb-3 d-flex"><div style={{ fontFamily: checkFontFamily(true), fontSize: '1.12rem' }}>{translate('Internships', 'طلبات  تدريب المواهب ')}</div>
                                <div className="" style={{ fontFamily: 'cnam-bold', fontSize: '1.12rem', marginLeft: '5px', marginRight: '5px' }}>
                                    ({translate(industrydashboardObj.internship_details.length, toArabicDigits(industrydashboardObj.internship_details.length.toString()))})
                                </div>
                            </div>
                            <div className="row">
                                {
                                    industrydashboardObj.internship_details.length !== 0 ?

                                        Object.values(industrydashboardObj.internship_details).map(item => {

                                            discussionChallengeRelation.current = { ...discussionChallengeRelation.current, [item.job_id]: item.internship_job_title }

                                            return (
                                                <ChallengeInternshipCard
                                                    key={item.internship_id}
                                                    date={item.created_date}
                                                    history={props.history}
                                                    job_id={item.job_id}
                                                    path={'/internship_details/'}
                                                    job_type={'internship'}
                                                    job_name={item.internship_job_title}
                                                    internship_locations={item.internship_location}
                                                    startDate={item.internship_start_date}
                                                    endDate={item.internship_end_date}
                                                    downloadPDF={download_pdf}
                                                    job_status={item.job_status}
                                                    comment_count={
                                                        (industrydashboardObj.count_comments[0][item.job_id] && industrydashboardObj.count_comments[1][item.job_id]) ?
                                                            industrydashboardObj.count_comments[0][item.job_id] + industrydashboardObj.count_comments[1][item.job_id]
                                                            : (
                                                                industrydashboardObj.count_comments[0][item.job_id] ?
                                                                    industrydashboardObj.count_comments[0][item.job_id]
                                                                    :
                                                                    industrydashboardObj.count_comments[1][item.job_id] ?
                                                                        industrydashboardObj.count_comments[1][item.job_id]

                                                                        : 0)
                                                    }
                                                />)
                                        }
                                        )
                                        :
                                        <>
                                            <div className="col-12  pb-3">
                                                <div>{translate('No pending Internships!', 'لا في انتظار طلبات التدريب الداخلي​!')} </div>
                                                <Button className="mt-2" style={{ fontWeight: '600', background: 'rgb(198 2 36)', padding: '0.6rem 2rem', border: 'none' }} onClick={() => props.history.push('/post_internship')}>{translate('Post Internship', 'طلب التدريب')}</Button>

                                            </div>
                                        </>
                                }
                            </div>
                        </div>

                        {/* //* /////////////////////////////////// Discussion /////////////////////////////////////////////*/}

                        <div className="col-lg-3 px-4 pb-5 industry-dashboard-discussion custom_scrollbar remove_scroll_mobile scroll-in-body" style={{ boxShadow: '0px 0px 5px 0.5px #DEDEDE' }}>

                            <div>
                                <div className={`mt-4 mb-3 ${checkTextAlignment()}`} style={{ fontFamily: checkFontFamily(true), fontSize: "0.9rem" }}>{translate('Discussions', 'مناقشات')}</div>
                                {industrydashboardObj.discussion[0].length !== 0 &&
                                    <>
                                        {
                                            industrydashboardObj.discussion[0].map((element, index) =>

                                                <>

                                                    <p className={`${checkTextAlignment()}`} style={{ fontFamily: checkFontFamily(), fontSize: "0.85rem" }}>{element[0] && discussionChallengeRelation.current[element[0].job_id]}</p>

                                                    {element.map(item =>
                                                        <IndustryDashboardComment
                                                            job_id={item.job_id}
                                                            user_name={item.user_name}
                                                            date={item.created_date}
                                                            message={item.message}
                                                            job_type={'challenge'}
                                                            history={props.history}
                                                            comment_type={item.comment_type}
                                                            file_name={item.file_name || ''}
                                                        />
                                                    )}
                                                </>
                                            )

                                        }
                                    </>
                                }
                                {industrydashboardObj.discussion[1].length !== 0 &&
                                    <>

                                        {industrydashboardObj.discussion[1].map((element, index) =>

                                            <>
                                                <p className={`${checkTextAlignment()}`} style={{ fontFamily: checkFontFamily(), fontSize: "0.85rem" }}>{element[0] && discussionChallengeRelation.current[element[0].job_id]}</p>
                                                {element.map(item =>
                                                    <IndustryDashboardComment
                                                        job_id={item.job_id}
                                                        user_name={item.user_name}
                                                        date={item.created_date}
                                                        message={item.message}
                                                        job_type={'internship'}
                                                        history={props.history}
                                                        comment_type={item.comment_type}
                                                        file_name={item.file_name || ''}
                                                    />
                                                )}
                                            </>
                                        )
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                }
            </Loader >
        </>
    )
}

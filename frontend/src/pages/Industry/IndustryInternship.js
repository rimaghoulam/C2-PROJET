import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Button } from "reactstrap";

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK, } from '../../globals';

import Spinner from "../../components/spinner/Spinner"
import ChallengeInternshipCard from '../../components/ChallengeInternshipCard/ChallengeInternshipCard';

import Loader from 'react-loader-advanced';

import '../../App.css';
import { downloadFile, toArabicDigits } from '../../functions';

export default function IndustryDashboard(props) {

    const [loaderState, setLoaderState] = useState(false)

    const [loadedPage, setLoadedPage] = useState(false)

    const [industryinternshipObj, setindustryinternshipObj] = useState([
        {
            internships: [],
        },
        {
            count_comments: [],
        }

    ])

    // to get data on page creation
    useEffect(() => {
        props.setPageTitle('Internships', 'التدريب الداخلي')
        get_request();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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



    const get_request = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()
        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token')
        }

        setLoaderState(true)
        axios({
            method: "post",
            url: `${WS_LINK}get_industry_internship`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {

                if (res.data !== "role error" && res.data !== "token error") {
                    setLoaderState(false)
                    const internship = res.data[0]
                    const comments = [res.data[1], res.data[2]]
                    if (internship.length >= 1 && internship !== 'error') {
                        setindustryinternshipObj(industryinternshipObj => [
                            { ...industryinternshipObj.internships, 'internships': internship },
                            { ...industryinternshipObj.count_comments, 'count_comments': comments },
                        ])
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

    }






    return (
        <>
            {getSessionInfo("language") === "english" ? (
                <Loader message={<span><Spinner /> </span>} show={loaderState} backgroundStyle={{ zIndex: "9999" }}>
                    {loadedPage &&
                        <div className="container-fluid  px-4 hide_scrollbar " style={{ height: 'calc(100vh - 101px)', overflowY: 'scroll', background: "#fffdfc" }}>


                            <div className="mt-4 mb-3 d-flex"><div style={{ fontFamily: "cnam-bold", fontSize: '1.12rem' }}>Internships</div>
                                <div className="" style={{ fontFamily: "cnam-bold", fontSize: '1.12rem' }}>({industryinternshipObj[0].internships.length})</div>
                            </div>


                            <div className="row">
                                {
                                    industryinternshipObj[0].internships.length === 0 &&
                                    <>
                                        <div className="col-12 pb-3">
                                            <div>No pending Internships!</div>
                                            <Button className="mt-2" style={{ fontWeight: '600', background: 'rgb(198 2 36)', padding: '0.6rem 2rem', border: 'none' }} onClick={() => props.history.push('/post_internship')}>Post Internship</Button>
                                        </div>
                                    </>
                                }


                                {
                                    Object.values(industryinternshipObj[0].internships).map((item) =>


                                        <ChallengeInternshipCard
                                            small={true}
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
                                                (industryinternshipObj[1].count_comments[0][item.job_id] && industryinternshipObj[1].count_comments[1][item.job_id]) ?
                                                    industryinternshipObj[1].count_comments[0][item.job_id] + industryinternshipObj[1].count_comments[1][item.job_id]
                                                    : (
                                                        industryinternshipObj[1].count_comments[0][item.job_id] ?
                                                            industryinternshipObj[1].count_comments[0][item.job_id]

                                                            :
                                                            industryinternshipObj[1].count_comments[1][item.job_id] ?
                                                                industryinternshipObj[1].count_comments[1][item.job_id]

                                                                : 0)
                                            }
                                        />)
                                }


                            </div>
                        </div>

                    }
                </Loader>
            )

                : // --------ARABIC----------
                (
                    <Loader message={<span><Spinner /> </span>} show={loaderState} backgroundStyle={{ zIndex: "9999" }}>
                        {loadedPage &&
                            <div className="container-fluid  px-4 hide_scrollbar " style={{ height: 'calc(100vh - 101px)', overflowY: 'scroll', background: "#fffdfc", textAlign: 'right' }}>


                                <div className="mt-4 mb-3 d-flex"><div style={{ fontFamily: "cnam-bold-ar", fontSize: '1.12rem' }}>طلبات تدريب المواهب</div>
                                    <div className="" style={{ fontFamily: "cnam-bold", fontSize: '1.12rem' }}>({toArabicDigits(industryinternshipObj[0].internships.length.toString())})</div>
                                </div>


                                <div className="row text-right" >
                                    {
                                        industryinternshipObj[0].internships.length === 0 &&
                                        <>
                                            <div className="col-12 pb-3" style={{ fontFamily: 'cnam-ar' }}>
                                                <div>لا يوجد فترات تدريبية معلقة!</div>
                                                <Button className="mt-2" style={{ fontWeight: '600', background: 'rgb(198 2 36)', padding: '0.6rem 2rem', border: 'none' }} onClick={() => props.history.push('/post_internship')}>اطلب فترة تدريب</Button>
                                            </div>
                                        </>
                                    }


                                    {
                                        Object.values(industryinternshipObj[0].internships).map((item) =>

                                            <ChallengeInternshipCard
                                                small={true}
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
                                                    (industryinternshipObj[1].count_comments[0][item.job_id] && industryinternshipObj[1].count_comments[1][item.job_id]) ?
                                                        industryinternshipObj[1].count_comments[0][item.job_id] + industryinternshipObj[1].count_comments[1][item.job_id]
                                                        : (
                                                            industryinternshipObj[1].count_comments[0][item.job_id] ?
                                                                industryinternshipObj[1].count_comments[0][item.job_id]

                                                                :
                                                                industryinternshipObj[1].count_comments[1][item.job_id] ?
                                                                    industryinternshipObj[1].count_comments[1][item.job_id]

                                                                    : 0)
                                                }
                                            />)}
                                </div>
                            </div>

                        }
                    </Loader>
                )
            }
        </>


    )
}


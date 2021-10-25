import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Button } from "reactstrap";

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK, } from '../../globals';

import Spinner from "../../components/spinner/Spinner"
import ChallengeInternshipCard from '../../components/ChallengeInternshipCard/ChallengeInternshipCard';

import Loader from 'react-loader-advanced';

import '../../App.css';
import { checkTextAlignment, translate, toArabicDigits } from '../../functions';


export default function IndustryChallenge(props) {


    const [loaderState, setLoaderState] = useState(false)

    const [loadedPage, setLoadedPage] = useState(false)

    const [industrychallengeObj, setindustrychallengeObj] = useState([
        {
            challenges: [],
        },
        {
            count_comments: [],
        }

    ])

    // to get data on page creation
    useEffect(() => {
        props.setPageTitle('Challenges', 'التحديات')
        get_request();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])





    const check_agree = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        const postedData = {
            userid: getSessionInfo("id"),
            token: getSessionInfo("token"),
        };

        setLoaderState(true);
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
                setLoaderState(false);

                if (axios.isCancel(err)) {
                    console.log("request canceled");
                } else {
                    console.log("request failed");
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
            url: `${WS_LINK}get_industry_challenge`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                console.log(res)

                if (res.data !== "role error" && res.data !== "token error") {

                    setLoaderState(false)
                    const challenge = res.data[0]
                    const comments = [res.data[1], res.data[2]]
                    if (challenge.length >= 1 && challenge !== 'error') {
                        setindustrychallengeObj(industrychallengeObj => [{ ...industrychallengeObj.challenges, 'challenges': challenge }, { ...industrychallengeObj.count_comments, 'count_comments': comments },
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




    const a = industrychallengeObj[0].challenges
    let pending_counter = a.length







    return (
        <>
            <Loader message={<span><Spinner /> </span>} show={loaderState} backgroundStyle={{ zIndex: "9999" }}>
                {loadedPage &&
                    <div className={`container-fluid  px-4 hide_scrollbar ${checkTextAlignment()}`} style={{ height: 'calc(100vh - 101px)', overflowY: 'scroll', background: "#fffdfc" }}>

                        <div className="mt-4 mb-3 d-flex"><div className="" style={{ fontFamily: translate('cnam-bold ', 'cnam-bold-ar'), fontSize: '1.12rem' }}>{translate('Challenges ', ' التحديات المقدمة')}</div>
                            <div className="" style={{ fontFamily: "cnam-bold", fontSize: '1.12rem' }}>
                                ({translate(pending_counter, toArabicDigits(pending_counter.toString()))})
                            </div>
                        </div>


                        <div className="row">
                            {pending_counter === 0 &&
                                <div className="col-12 pb-3">
                                    <div>{translate('No pending Challenges!', 'لا توجد تحديات معلقة!')}</div>
                                    <Button className=" mt-2" style={{ fontWeight: '600', background: 'rgb(198 2 36)', padding: '0.6rem 2rem', border: 'none' }} onClick={check_agree}>{translate('Post Challenge', 'اطلب التحدي')}</Button>
                                </div>
                            }
                            {
                                Object.values(industrychallengeObj[0].challenges).map(item =>
                                    <ChallengeInternshipCard
                                        small={true}
                                        key={item.challenge_id}
                                        date={item.created_date}
                                        history={props.history}
                                        job_id={item.job_id}
                                        path={'/challenge_details/'}
                                        job_type={'challenge'}
                                        job_name={item.challenge_name}
                                        job_description={item.challenge_description}
                                        job_status={item.job_status}
                                        comment_count={
                                            (industrychallengeObj[1].count_comments[0][item.job_id] && industrychallengeObj[1].count_comments[1][item.job_id]) ?
                                                industrychallengeObj[1].count_comments[0][item.job_id] + industrychallengeObj[1].count_comments[1][item.job_id]
                                                : (
                                                    industrychallengeObj[1].count_comments[0][item.job_id] ?
                                                        industrychallengeObj[1].count_comments[0][item.job_id]

                                                        :
                                                        industrychallengeObj[1].count_comments[1][item.job_id] ?
                                                            industrychallengeObj[1].count_comments[1][item.job_id]

                                                            : 0)} />)
                            }
                        </div>
                    </div>
                }
            </Loader>
        </>
    )
}

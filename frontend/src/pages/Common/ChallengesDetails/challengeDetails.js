import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { useParams } from "react-router-dom";
import Loader from "react-loader-advanced";
import axios from "axios";

import { WS_LINK, } from "../../../globals";
import { formatDate, downloadFile, downloadFileWithExtension, toArabicDigits } from '../../../functions'
import { getSessionInfo, clearSessionInfo } from "../../../variable";

import Spinner from "../../../components/spinner/Spinner";

import pdf from "../../../assets/images_svg/pdf.svg";

import "../../../App.css";

import SmsIcon from "@material-ui/icons/Sms";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import EmailIcon from '@material-ui/icons/Email';

export default function ChallengeDetails(props) {


    let { challengeid } = useParams();
    challengeid = decodeURIComponent(atob(challengeid));



    const [challengedetail, setChallengedetail] = useState({
        challenges: [],
        documents: [],
        assigned: [],
    });

    const [count, setCount] = useState();

    const [loaderState, setLoaderState] = useState(false);



    const btnstyle = {
        background: "#f7de9a",
        border: "none",
        borderRadius: "3px",
        fontSize: "12px",
        paddingTop: "4px",
        paddingBottom: "4px",
        paddingLeft: "9px",
        paddingRight: "9px",
        color: "black",
        cursor: "default",
        textTransform: "capitalize",
    };
    const btnstyle2 = {
        background: "#7fd8cc",
        border: "none",
        borderRadius: "3px",
        fontSize: "12px",
        paddingTop: "4px",
        paddingBottom: "4px",
        paddingLeft: "9px",
        paddingRight: "9px",
        color: "black",
        textTransform: "uppercase",
    };



    useEffect(() => {
        props.setPageTitle('Challenge Details', 'تفاصيل التحدي')

        get_comments();
        get_request();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const get_comments = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        const postedData = {
            userid: getSessionInfo("id"),
            token: getSessionInfo("token"),
            jobid: challengeid,
        };
        setLoaderState(true);
        axios({
            method: "post",
            url: `${WS_LINK}get_count_comments_by_jobid`,
            data: postedData,
            cancelToken: source.token,
        })
            .then((res) => {
                if (res.data !== "role error" && res.data !== "token error") {
                    setLoaderState(false);
                    setCount(
                        getSessionInfo("role") === 1
                            ? res.data[1] + res.data[0]
                            : getSessionInfo("role") === 3 && res.data[1]
                    );
                } else {
                    clearSessionInfo();
                    window.location.reload(false).then(props.history.replace("/"));
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
    };


    const get_request = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        const postedData = {
            userid: getSessionInfo("id"),
            token: getSessionInfo("token"),
            jobid: challengeid,
        };
        setLoaderState(true);
        axios({
            method: "post",
            url: `${WS_LINK}get_job_details_byid`,
            data: postedData,
            cancelToken: source.token,
        })
            .then((res) => {

                if (res.data !== "role error" && res.data !== "token error") {
                    setLoaderState(false);
                    const challenge = res.data[0];
                    const documents = res.data[1];
                    const assigned = res.data[2];



                    setChallengedetail({
                        ...challengedetail,
                        challenges: challenge,
                        documents: documents,
                        assigned: assigned,
                    });

                } else {
                    clearSessionInfo();
                    window.location.reload(false).then(props.history.replace("/"));
                }

                // }
            })
            .catch((err) => {
                setLoaderState(false);
                if (axios.isCancel(err)) {
                    console.log("request canceled");
                } else {
                    console.log("request failed");
                }
            });
    };






    const download_pdf = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        const postedData = {
            userid: getSessionInfo("id"),
            token: getSessionInfo("token"),
            job: challengeid
        };

        setLoaderState(true)
        axios({
            method: "post",
            url: `${WS_LINK}generate_job_pdf`,
            data: postedData,
            cancelToken: source.token,
            headers: { "Access-Control-Allow-Origin": "*" },
        })
            .then((res) => {
                if (res.data !== "role error" && res.data !== "token error") {
                    downloadFileWithExtension(res.data, challengedetail.challenges[0].challenge_name + "-details.pdf", "pdf")
                } else {
                    clearSessionInfo();
                    window.location.reload(false).then(props.history.replace("/"));
                }

                setLoaderState(false)
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    console.log("request canceled");
                } else {
                    console.log("request failed");
                }
            });
    };



    let share_content;
    let documents = challengedetail.documents.map((doc) => {
        // return `data:application/pdf;base64,${doc.document_path}`
        return doc.document_name
    })
    if (challengedetail.challenges.length !== 0) {
        share_content = `Challenge Name: %0D%0A${challengedetail.challenges[0].challenge_name}%0D%0A %0D%0ADescription: %0D%0A${challengedetail.challenges[0].challenge_description}%0D%0A %0D%0AChallenge Type: %0D%0A${challengedetail.challenges[0].challenge_type} %0D%0A %0D%0ADid the Industry approach anyone to address this challenge? %0D%0A${challengedetail.challenges[0].challenge_approach_spec}%0D%0A %0D%0AHow long do the have this challenge? %0D%0A${challengedetail.challenges[0].challenge_time}%0D%0A %0D%0AIs the company affected by this challenge? %0D%0A${challengedetail.challenges[0].challenge_comp_affected_spec}%0D%0A %0D%0A Did the Industry anticipate any cost to address this challenge? %0D%0A${challengedetail.challenges[0].challenge_cost_spec}%0D%0A %0D%0ASupporting documents: %0D%0A${documents}%0D%0A %0D%0AIndustry Referral: %0D%0A${challengedetail.challenges[0].challenge_hear}%0D%0A %0D%0AA Download Job pdf: %0D%0Ahttp%3a%2f%2fkpp.cnam.edu.sa%2fdownload_job%2f${challengeid} `;
    }



    return (
        <Loader
            message={
                <span>
                    <Spinner />{" "}
                </span>
            }
            show={loaderState}
            backgroundStyle={{ zIndex: "9999" }}
        >
            {challengedetail.challenges.length !== 0 && (
                <>
                    {getSessionInfo("language") === "english" ? (
                        <>
                            <div
                                className="container-fluid tableScroll"
                                style={{ backgroundColor: "#fffdfc", width: "100vw" }}
                            >
                                <div
                                    className="row justify-content-center"
                                    style={{ height: "calc(100vh - 128px)" }}
                                >
                                    <div
                                        className="custom_scrollbar remove_customscroll_mobile col-lg-6"
                                        style={{ height: "100%", overflowY: "scroll" }}
                                    >
                                        <div
                                            className="mt-4 "
                                            style={{ color: "rgb(198 2 36)", cursor: "pointer" }}
                                            onClick={() => props.history.goBack()}
                                        >
                                            <ArrowBackIosIcon
                                                style={{ fontSize: "11px", marginTop: "-2px" }}
                                            />
                                            Back
                                        </div>
                                        <div
                                            className="mt-3"
                                            style={{ fontSize: "1.5rem", fontFamily: "cnam-bold" }}
                                        >
                                            {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_name}
                                        </div>
                                        <div
                                            className="mt-4"
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                        >
                                            Description
                                        </div>
                                        <div
                                            className=""
                                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                        >
                                            {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_description}
                                        </div>



                                        <hr className="mt-3" />

                                        <div
                                            className=""
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                        >
                                            Challenge Type
                                        </div>
                                        <div
                                            className=""
                                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                        >
                                            {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_type}
                                        </div>

                                        <hr className="mt-3" />

                                        <div
                                            className=""
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                        >
                                            Did the Industry approach anyone to address this
                                            challenge?
                                        </div>
                                        {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_approach ===
                                            "No" ? (
                                            <>
                                                <div
                                                    className=""
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_approach}
                                                </div>

                                                <div
                                                    className=""
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {
                                                        challengedetail.challenges[0] && challengedetail.challenges[0]
                                                            .challenge_approach_spec
                                                    }
                                                </div>

                                                <hr className="mt-3" />
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className=""
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {
                                                        challengedetail.challenges[0] && challengedetail.challenges[0]
                                                            .challenge_approach_spec
                                                    }
                                                </div>

                                                <hr className="mt-3" />
                                            </>
                                        )}
                                        {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_time && (
                                            <>
                                                <div
                                                    className=""
                                                    style={{
                                                        fontSize: "0.95rem",
                                                        fontFamily: "cnam-bold",
                                                    }}
                                                >
                                                    How long do the have this challenge?
                                                </div>
                                                <div
                                                    className=""
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {challengedetail.challenges[0].challenge_time}
                                                </div>

                                                <hr className="mt-3" />
                                            </>
                                        )}
                                        <div
                                            className=""
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                        >
                                            Is the company affected by this challenge?
                                        </div>
                                        {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_comp_affected ===
                                            "No" ? (
                                            <>
                                                <div
                                                    className=""
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {
                                                        challengedetail.challenges[0] && challengedetail.challenges[0]
                                                            .challenge_comp_affected
                                                    }
                                                </div>

                                                <div
                                                    className=""
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {
                                                        challengedetail.challenges[0] && challengedetail.challenges[0]
                                                            .challenge_comp_affected_spec
                                                    }
                                                </div>

                                                <hr className="mt-3" />
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className=""
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {
                                                        challengedetail.challenges[0] && challengedetail.challenges[0]
                                                            .challenge_comp_affected_spec
                                                    }
                                                </div>

                                                <hr className="mt-3" />
                                            </>
                                        )}
                                        <div
                                            className=""
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                        >
                                            Did the Industry anticipate any cost to address this
                                            challenge?
                                        </div>
                                        {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_cost === "No" ? (
                                            <>
                                                <div
                                                    className=""
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_cost}
                                                </div>

                                                <div
                                                    className=""
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_cost_spec}
                                                </div>

                                                <hr className="mt-3" />
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className=""
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_cost_spec}
                                                </div>

                                                <hr className="mt-3" />
                                            </>
                                        )}

                                        <div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>Supporting documents</div>
                                        {challengedetail.documents.length === 0 ? (
                                            <div>No documents attached</div>
                                        ) : (
                                            challengedetail.documents.map((doc) => (
                                                <div className="pointer my-1" style={{ fontWeight: "500" }} onClick={() => downloadFile(doc.document_path, doc.document_name)} key={doc.document_path}>
                                                    <img src={pdf} alt="pdf" style={{ width: "20px" }} />
                                                    {doc.document_name}
                                                </div>
                                            ))
                                        )}

                                        <hr className="mt-4" />

                                        <div
                                            className=""
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                        >
                                            Industry Referral
                                        </div>
                                        <div
                                            className=""
                                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                        >
                                            {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_hear}
                                        </div>

                                    </div>

                                    <div
                                        className="col-lg-4"
                                        style={{ paddingTop: "60px", height: "100%" }}
                                    >
                                        <div
                                            className="container"
                                            style={{
                                                borderRadius: "5px",
                                                background: "white",
                                                padding: "30px",
                                                boxShadow: "0px 0px 2px 2px #E9E9E9",
                                            }}
                                        >
                                            <div
                                                className=""
                                                style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                            >
                                                Submitted by
                                            </div>
                                            <div
                                                className=""
                                                style={{
                                                    fontSize: "0.95rem",
                                                    fontFamily: "cnam-bold",
                                                }}
                                            >
                                                {challengedetail.challenges[0] && (challengedetail.challenges[0].user_name 
                                                    // + " (" + challengedetail.challenges[0].user_department + " )"
                                                    )}
                                                <hr
                                                    style={{
                                                        marginTop: "0.7rem",
                                                        marginBottom: "0.2rem",
                                                    }}
                                                />
                                            </div>

                                            <div
                                                className=""
                                                style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                            >
                                                Company Name
                                            </div>
                                            <div
                                                className=""
                                                style={{
                                                    fontSize: "0.95rem",
                                                    fontFamily: "cnam-bold",
                                                }}
                                            >
                                                {challengedetail.challenges[0] && challengedetail.challenges[0].industry_details_company_name}
                                                <hr
                                                    style={{
                                                        marginTop: "0.7rem",
                                                        marginBottom: "0.2rem",
                                                    }}
                                                />
                                            </div>

                                            <div
                                                className=""
                                                style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                            >
                                                Submitted on
                                            </div>
                                            <div
                                                className=""
                                                style={{
                                                    fontSize: "0.95rem",
                                                    fontFamily: "cnam-bold",
                                                }}
                                            >
                                                {formatDate(challengedetail.challenges[0] && challengedetail.challenges[0].created_date)}
                                                <hr
                                                    style={{
                                                        marginTop: "0.7rem",
                                                        marginBottom: "0.2rem",
                                                    }}
                                                />
                                            </div>

                                            <div className="" style={{ fontWeight: "500" }}>
                                                Assigned to
                                            </div>
                                            <div
                                                className=""
                                                style={{
                                                    fontSize: "0.95rem",
                                                    fontFamily: "cnam-bold",
                                                }}
                                            >
                                                {challengedetail.assigned.length !== 0
                                                    ? challengedetail.assigned[0].user_name + " (" + challengedetail.assigned[0].user_department + " )"
                                                    : "Not Assigned yet"}
                                                <hr
                                                    style={{
                                                        marginTop: "0.7rem",
                                                        marginBottom: "0.2rem",
                                                    }}
                                                />
                                            </div>

                                            <div
                                                className="mb-1"
                                                style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                            >
                                                Status
                                            </div>
                                            <div className="">
                                                <Button
                                                    style={
                                                        challengedetail.challenges[0].job_status ===
                                                            "PENDING REVIEW"
                                                            ? btnstyle
                                                            : btnstyle2
                                                    }
                                                >
                                                    {challengedetail.challenges[0] && challengedetail.challenges[0].job_status}
                                                </Button>
                                                <hr />
                                            </div>

                                            {/* <div className="mb-4 d-flex" style={{ fontWeight: '500' }}><img src={pdf} alt="img" style={{width:'24px'}}/> <div className="ml-3 pointer" onClick={download_pdf}>Download as PDF</div></div> */}

                                            <div className="d-flex pt-3" style={{}}>
                                                <div
                                                    className=""
                                                    style={{ fontWeight: "500", fontSize: "13px", cursor: 'pointer' }}
                                                    onClick={() =>
                                                        props.history.push(
                                                            `/discussion/${btoa(
                                                                encodeURIComponent(challengeid)
                                                            )}`
                                                        )
                                                    }
                                                >
                                                    <SmsIcon
                                                        style={{ color: "#e98300", fontSize: "17px" }}
                                                    />{" "}
                                                    ({count}) Comments
                                                </div>
                                                <div
                                                    className="font-weight-bold comment"
                                                    style={{
                                                        color: "rgb(198 2 36)",
                                                        fontSize: "13px",
                                                        marginLeft: "auto",
                                                    }}
                                                    onClick={() =>
                                                        props.history.push(
                                                            `/discussion/${btoa(
                                                                encodeURIComponent(challengeid)
                                                            )}`
                                                        )
                                                    }
                                                >
                                                    <AddIcon
                                                        style={{ color: "rgb(198 2 36)", fontSize: "12px" }}
                                                    />{" "}
                                                    Add a comment
                                                </div>
                                            </div>
                                        </div>
                                        {/* //! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                                        {/* //! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                                        {/* //! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                                        <div className="d-flex justify-content-around mt-4">
                                            <div style={{ cursor: 'pointer' }} onClick={download_pdf}><img src={pdf} alt="img" style={{ width: '19px' }} /> Download as PDF</div>
                                            <div style={{ borderLeft: '2px solid #efeeee', height: '35px' }}></div>
                                            <div style={{ cursor: 'pointer' }}>
                                                <a href={`mailto:?subject=cnam KPP - ${challengedetail.challenges[0] && challengedetail.challenges[0].challenge_name}&body=${share_content}`} title="Share by Email" style={{ color: "black", textDecoration: "none" }}>
                                                    <EmailIcon style={{ color: "rgb(198 2 36)" }} /> Share by email
                                                </a>
                                            </div>
                                        </div><hr style={{ borderTop: '2px solid #efeeee' }} />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        <>
                            <div
                                className="container-fluid tableScroll"
                                style={{ backgroundColor: "#fffdfc", width: "100vw" }}
                            >
                                <div
                                    className="row justify-content-center"
                                    style={{ height: "calc(100vh - 128px)" }}
                                >
                                    <div
                                        className="custom_scrollbar remove_customscroll_mobile col-lg-6"
                                        style={{ height: "100%", overflowY: "scroll" }}
                                    >
                                        <div
                                            className="mt-4 text-right"
                                            style={{ color: "rgb(198 2 36)", cursor: "pointer", fontFamily: 'cnam-bold-ar' }}
                                            onClick={() => props.history.goBack()}
                                        >
                                            <ArrowBackIosIcon
                                                style={{ fontSize: "11px", marginTop: "-2px", transform: 'rotate(180deg)' }}
                                            />
                                            عودة
                                        </div>
                                        <div
                                            className="mt-3 text-right"
                                            style={{ fontSize: "1.5rem", fontFamily: "cnam-bold-ar" }}
                                        >
                                            {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_name}
                                        </div>
                                        <div
                                            className="mt-4 text-right mb-2"
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                                        >
                                            وصف الطلب 
                                        </div>
                                        <div
                                            className="text-right"
                                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                        >
                                            {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_description}
                                        </div>


                                        <hr />

                                        <div
                                            className="text-right mb-2"
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                                        >
                                            نوع التحدي
                                        </div>
                                        <div
                                            className="text-right"
                                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                        >
                                            {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_type}
                                        </div>

                                        <hr />

                                        <div
                                            className="text-right mb-2"
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                                        >
                                            هل اقتربت الصناعة من أي شخص لمعالجة هذا الأمر
                                            تحدي؟
                                        </div>
                                        {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_approach ===
                                            "No" ? (
                                            <>
                                                <div
                                                    className="text-right"
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_approach}
                                                </div>

                                                <div
                                                    className="text-right"
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {
                                                        challengedetail.challenges[0] && challengedetail.challenges[0]
                                                            .challenge_approach_spec
                                                    }
                                                </div>

                                                <hr />
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className="text-right"
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {
                                                        challengedetail.challenges[0] && challengedetail.challenges[0]
                                                            .challenge_approach_spec
                                                    }
                                                </div>

                                                <hr />
                                            </>
                                        )}
                                        {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_time && (
                                            <>
                                                <div
                                                    className="text-right mb-2"
                                                    style={{
                                                        fontSize: "0.95rem",
                                                        fontFamily: "cnam-bold-ar",
                                                    }}
                                                >
                                                    منذ متى والمنشآة تعاني من هذه المشكلة او التحدي​
                                                </div>
                                                <div
                                                    className="text-right"
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_time}
                                                </div>

                                                <hr />
                                            </>
                                        )}
                                        <div
                                            className="text-right mb-2"
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                                        >
                                            هل تأثرت المنشأة بهذا التحدي؟
                                        </div>
                                        {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_comp_affected ===
                                            "No" ? (
                                            <>
                                                <div
                                                    className="text-right"
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {
                                                        challengedetail.challenges[0] && challengedetail.challenges[0]
                                                            .challenge_comp_affected
                                                    }
                                                </div>

                                                <div
                                                    className="text-right"
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {
                                                        challengedetail.challenges[0] && challengedetail.challenges[0]
                                                            .challenge_comp_affected_spec
                                                    }
                                                </div>

                                                <hr />
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className="text-right"
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {
                                                        challengedetail.challenges[0] && challengedetail.challenges[0]
                                                            .challenge_comp_affected_spec
                                                    }
                                                </div>

                                                <hr />
                                            </>
                                        )}
                                        <div
                                            className="text-right mb-2"
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                                        >
                                            هل توقعت الصناعة أي تكلفة لمعالجة هذا الأمر
                                            تحدي؟
                                        </div>
                                        {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_cost === "No" ? (
                                            <>
                                                <div
                                                    className="text-right"
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {challengedetail.challenges[0].challenge_cost}
                                                </div>

                                                <div
                                                    className="text-right"
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_cost_spec}
                                                </div>

                                                <hr />
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className="text-right"
                                                    style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                                >
                                                    {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_cost_spec}
                                                </div>

                                                <hr />
                                            </>
                                        )}
                                        <div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>المستندات المخصصة لهذا التحدي</div>
                                        {challengedetail.documents.length === 0 ? (
                                            <div>لا توجد وثائق مرفقة</div>
                                        ) : (
                                            challengedetail.documents.map((doc) => (
                                                <div className="pointer my-1" style={{ fontWeight: "500" }} onClick={() => downloadFile(doc.document_path, doc.document_name)} key={doc.document_path}>
                                                    <img src={pdf} alt="pdf" style={{ width: "20px" }} />
                                                    {doc.document_name}
                                                </div>
                                            ))
                                        )}

                                        <div
                                            className="text-right mb-2"
                                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                                        >
                                            إحالة الصناعة
                                        </div>
                                        <div
                                            className="text-right"
                                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                        >
                                            {challengedetail.challenges[0] && challengedetail.challenges[0].challenge_hear}
                                        </div>

                                    </div>

                                    <div
                                        className="col-lg-4"
                                        style={{ paddingTop: "60px", height: "100%" }}
                                    >
                                        <div
                                            className="container"
                                            style={{
                                                borderRadius: "5px",
                                                background: "white",
                                                padding: "30px",
                                                boxShadow: "0px 0px 2px 2px #E9E9E9",
                                            }}
                                        >
                                            <div
                                                className="text-right"
                                                style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: 'cnam-bold-ar' }}
                                            >
                                                مقدم من
                                            </div>
                                            <div
                                                className="text-right"
                                                style={{
                                                    fontSize: "0.95rem",
                                                    fontFamily: "cnam-bold",
                                                }}
                                            >
                                                {challengedetail.challenges[0] && (challengedetail.challenges[0].user_name 
                                                    // + " (" + challengedetail.challenges[0].user_department + " )"
                                                    )}

                                                <hr
                                                    style={{
                                                        marginTop: "0.7rem",
                                                        marginBottom: "0.2rem",
                                                    }}
                                                />
                                            </div>

                                            <div
                                                className="text-right"
                                                style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: 'cnam-bold-ar' }}
                                            >
                                                اسم المنشأة
                                            </div>
                                            <div
                                                className="text-right"
                                                style={{
                                                    fontSize: "0.95rem",
                                                    fontFamily: "cnam-bold",
                                                }}
                                            >
                                                {challengedetail.challenges[0] && challengedetail.challenges[0].industry_details_company_name}
                                                <hr
                                                    style={{
                                                        marginTop: "0.7rem",
                                                        marginBottom: "0.2rem",
                                                    }}
                                                />
                                            </div>

                                            <div
                                                className="text-right"
                                                style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: 'cnam-bold-ar' }}
                                            >
                                                قدمت بتاريخ
                                            </div>
                                            <div
                                                className="text-right"
                                                style={{
                                                    fontSize: "0.95rem",
                                                    fontFamily: "cnam-bold",
                                                }}
                                            >
                                                {formatDate(challengedetail.challenges[0] && challengedetail.challenges[0].created_date)}
                                                <hr
                                                    style={{
                                                        marginTop: "0.7rem",
                                                        marginBottom: "0.2rem",
                                                    }}
                                                />
                                            </div>

                                            <div className="text-right" style={{ color: "#6E6259", fontWeight: "500", fontFamily: 'cnam-bold-ar' }}>
                                            تم استناد التحدي إلى
                                            </div>
                                            <div
                                                className="text-right"
                                                style={{
                                                    fontSize: "0.95rem",
                                                    fontFamily: "cnam-bold",
                                                }}
                                            >
                                                {challengedetail.assigned.length !== 0
                                                    ? challengedetail.assigned[0].user_name + " (" + challengedetail.assigned[0].user_department + " )"
                                                    : "Not Assigned yet"}
                                                <hr
                                                    style={{
                                                        marginTop: "0.7rem",
                                                        marginBottom: "0.2rem",
                                                    }}
                                                />
                                            </div>

                                            <div
                                                className="mb-1 text-right"
                                                style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: 'cnam-bold-ar' }}
                                            >
                                                حالة
                                            </div>
                                            <div className="text-right">
                                                <Button
                                                    style={
                                                        challengedetail.challenges[0].job_status ===
                                                            "PENDING REVIEW"
                                                            ? btnstyle
                                                            : btnstyle2
                                                    }
                                                >
                                                    {challengedetail.challenges[0] && challengedetail.challenges[0].job_status}
                                                </Button>
                                                <hr />
                                            </div>

                                            <div className="d-flex pt-3" style={{}}>
                                                <div
                                                    className=""
                                                    style={{ fontWeight: "500", fontSize: "13px", cursor: 'pointer' }}
                                                    onClick={() =>
                                                        props.history.push(
                                                            `/discussion/${btoa(
                                                                encodeURIComponent(challengeid)
                                                            )}`
                                                        )
                                                    }
                                                >
                                                    <SmsIcon
                                                        style={{ color: "#e98300", fontSize: "17px" }}
                                                    />{" "}
                                                    <span style={{ fontFamily: 'cnam-bold-ar' }}>( {count && toArabicDigits(count.toString())}) تعليقات</span>
                                                </div>
                                                <div
                                                    className="font-weight-bold comment mr-auto"
                                                    style={{
                                                        color: "rgb(198 2 36)",
                                                        fontSize: "13px",
                                                        marginRight: "auto",
                                                        fontFamily: 'cnam-bold-ar'
                                                    }}
                                                    onClick={() =>
                                                        props.history.push(
                                                            `/discussion/${btoa(
                                                                encodeURIComponent(challengeid)
                                                            )}`
                                                        )
                                                    }
                                                >
                                                    <AddIcon
                                                        style={{ color: "rgb(198 2 36)", fontSize: "12px" }}
                                                    />{" "}
                                                    اضف تعليق
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-around mt-4">
                                            <div style={{ cursor: 'pointer' }} onClick={download_pdf}><img src={pdf} alt="img" style={{ width: '19px' }} /> <span style={{ fontFamily: 'cnam-ar' }}>تنزيل كملف</span> PDF</div>
                                            <div style={{ borderLeft: '2px solid #efeeee', height: '35px' }}></div>
                                            <div style={{ cursor: 'pointer', fontFamily: 'cnam-ar' }}>
                                                <a href={`mailto:?subject=cnam KPP - ${challengedetail.challenges[0] && challengedetail.challenges[0].challenge_name}&body=${share_content}`} title="Share by Email" style={{ color: "black", textDecoration: "none" }}>
                                                    <EmailIcon style={{ color: "rgb(198 2 36)", }} />مشاركة عبر البريد الإلكتروني  
                                                </a>
                                            </div>
                                        </div><hr style={{ borderTop: '2px solid #efeeee' }} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </Loader>
    );
}

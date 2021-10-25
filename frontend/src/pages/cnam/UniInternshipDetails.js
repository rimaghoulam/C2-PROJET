import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { WS_LINK, } from "../../globals";
import { formatDate, downloadFile, toArabicDigits } from '../../functions'
import { getSessionInfo, clearSessionInfo } from "../../variable";

import { Button } from "reactstrap";

import SmsIcon from "@material-ui/icons/Sms";
import AddIcon from "@material-ui/icons/Add";
import EmailIcon from "@material-ui/icons/Email";

import "../../App.css";

import pdf from "../../assets/images_svg/pdf.svg";
import InternshipDetailsLeft from "../../components/InputText/InternshipDetailsLeft";


export default function InternshipDetails(props) {

    let { internshipid } = useParams();
    internshipid = decodeURIComponent(atob(internshipid));



    // the states
    const [internshipdetail, setInternshipdetail] = useState({
        internships: [],
    });

    const [count, setCount] = useState();

    const [loaded, setLoaded] = useState(false);



    // data fetching on page creation

    useEffect(() => {
        props.setPageTitle('Internship Details', 'تفاصيل التدريب')
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        const postedData = {
            userid: getSessionInfo("id"),
            token: getSessionInfo("token"),
            jobid: internshipid,
        };
        props.toggleSpinner(true);

        ///////////
        axios({
            method: "post",
            url: `${WS_LINK}get_count_comments_by_jobid`,
            data: postedData,
            cancelToken: source.token,
        })
            .then((res) => {
                if (getSessionInfo("role") === 1 && res.data !== "token error") {
                    props.toggleSpinner(false);

                    const count_comments = res.data;

                    setCount(count_comments[1] + count_comments[0]);
                } else {
                    clearSessionInfo();
                    window.location.reload(false).then(props.history.replace("/"));
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
        ///////////
        axios({
            method: "post",
            url: `${WS_LINK}get_job_details_byid`,
            data: postedData,
            cancelToken: source.token,
        })
            .then((res) => {
                if (getSessionInfo("role") === 1 && res.data !== "token error") {
                    // const intern = res.data[0];
                    setInternshipdetail({ ...res.data[0][0] });
                    setLoaded(true);
                    props.toggleSpinner(false);
                } else {
                    clearSessionInfo();
                    window.location.reload(false).then(props.history.replace("/"));
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);




    /////download pdf
    const download_pdf = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        const postedData = {
            userid: getSessionInfo("id"),
            token: getSessionInfo("token"),
            job: internshipdetail.internship_job_id,
        };

        axios({
            method: "post",
            url: `${WS_LINK}generate_job_pdf`,
            data: postedData,
            cancelToken: source.token,
        })
            .then((res) => {

                if (res.data !== "role error" && res.data !== "token error") {
                    downloadFile(res.data, `${internshipdetail.internship_job_title}-details.pdf`)
                } else {
                    clearSessionInfo();
                    window.location.reload(false).then(props.history.replace("/"));
                }
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
    let degree = "";
    if (Object.keys(internshipdetail).length !== 0) {
        if (internshipdetail.internship_categorie_students === "MS")
            degree = "MS, Majoring in";
        else degree = "PhD, Majoring in";

        share_content =
            "Internship Title: %0D%0A" +
            internshipdetail.internship_job_title +
            "%0D%0A %0D%0A" +
            "Department: %0D%0A" +
            internshipdetail.internship_department +
            "%0D%0A %0D%0A" +
            "Date: %0D%0A" +
            "From " +
            formatDate(internshipdetail.internship_start_date) +
            " Till " +
            formatDate(internshipdetail.internship_end_date) +
            "%0D%0A %0D%0A" +
            "Job Location: %0D%0A" +
            internshipdetail.internship_locations +
            "%0D%0A %0D%0A" +
            "Internship Length: %0D%0A" +
            internshipdetail.internship_length +
            "%0D%0A %0D%0A" +
            "Outline of the research or practical training experience and the roles and responsibilties of the position: %0D%0A" +
            internshipdetail.internship_outline +
            "%0D%0A %0D%0A" +
            "Category of students and major(s) most appropriate for the opportunity at your institution: %0D%0A" +
            degree +
            ": %0D%0A" +
            internshipdetail.student_major +
            "%0D%0A %0D%0A" +
            "Prior work experience or technical skills requirements: %0D%0A" +
            internshipdetail.internship_prior_work_experience +
            "%0D%0A %0D%0A" +
            "Compensation and Salary: %0D%0A" +
            internshipdetail.internship_compensation_salary +
            "%0D%0A %0D%0A" +
            (internshipdetail.contact_details
                ? "Contact Details: %0D%0A" +
                internshipdetail.contact_details +
                "%0D%0A %0D%0A"
                : "%0D%0A") +
            (internshipdetail.internship_link
                ? "Internship Link: %0D%0A" +
                internshipdetail.internship_link +
                "%0D%0A %0D%0A"
                : "%0D%0A") +
            "Please list required documents to be included with student's application such as letter of recommendation from cnam faculty advisor, transcript, statement of purpose , ect.: %0D%0A" +
            internshipdetail.internship_required_document +
            "%0D%0A %0D%0A" +
            "A brief description about your company: %0D%0A" +
            internshipdetail.internship_brief_description +
            "%0D%0A %0D%0A";
    }










    // * ///////////////////// STYLES
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






    return (
        <div className="container-fluid">
            {loaded && (
                <div
                    className="row justify-content-center"
                    style={{ height: "calc(100vh - 128px)" }}
                >
                    {getSessionInfo("language") === "arabic" ? (
                        <>
                            <InternshipDetailsLeft
                                props={internshipdetail}
                                history={props.history}
                            />


                            <div
                                className="col-lg-4 text-right"
                                style={{ paddingTop: "5.5rem", height: "100%" }}
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
                                        style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam-ar", }}
                                    >
                                        مقدم من
                                    </div>
                                    <div
                                        className="text-right"
                                        style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                    >
                                        {internshipdetail.user_name}
                                        <hr />
                                    </div>

                                    <div
                                        className="text-right"
                                        style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam-ar", }}
                                    >
                                        اسم المنشأة
                                    </div>
                                    <div
                                        className="text-right"
                                        style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                    >
                                        {
                                            internshipdetail
                                                .industry_details_company_name
                                        }
                                        <hr />
                                    </div>

                                    <div
                                        className="text-right"
                                        style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam-ar", }}
                                    >
                                       قدمت بتاريخ
                                    </div>
                                    <div
                                        className="text-right"
                                        style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                    >
                                        {formatDate(internshipdetail.created_date)}
                                        <hr />
                                    </div>

                                    <div
                                        className="text-right"
                                        style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam-ar", }}
                                    >
                                        حالة
                                    </div>
                                    <div className="text-right">
                                        <Button
                                            style={
                                                internshipdetail.job_status ===
                                                    "PENDING REVIEW"
                                                    ? btnstyle
                                                    : btnstyle2
                                            }
                                        >
                                            {internshipdetail.job_status}
                                        </Button>
                                        <hr />
                                    </div>

                                    <div className="d-flex p-2">
                                        <div
                                            className="pointer"
                                            style={{ fontWeight: "500", fontSize: "13px", fontFamily: 'cnam-ar' }}
                                            onClick={() =>
                                                props.history.push(
                                                    `/discussion/${btoa(encodeURIComponent(internshipid))}`
                                                )
                                            }
                                        >
                                            <SmsIcon style={{ color: "#e98300", fontSize: "17px" }} />{" "}
                                            ( {count && toArabicDigits(count.toString())}) <span style={{ fontFamily: "cnam-ar" }}>تعليقات</span>
                                        </div>
                                        <div
                                            className="font-weight-bold comment mr-auto"
                                            style={{
                                                color: "rgb(198 2 36)",
                                                fontSize: "13px",
                                                marginRight: "auto",
                                                fontFamily: "cnam-ar",
                                            }}
                                            onClick={() =>
                                                props.history.push(
                                                    `/discussion/${btoa(
                                                        encodeURIComponent(internshipid)
                                                    )}`
                                                )
                                            }
                                        >
                                            <AddIcon style={{ color: "rgb(198 2 36)", fontSize: "12px" }} />{" "}
                                            اضف تعليق
                                        </div>
                                    </div>
                                </div>

                                <div className="container d-flex justify-content-between mt-4">
                                    <div
                                        className=""
                                        onClick={download_pdf}
                                        style={{
                                            cursor: "pointer",
                                            fontFamily: "cnam-ar",
                                        }}
                                    >
                                        <img
                                            src={pdf}
                                            alt="img"
                                            style={{ width: "19px" }}
                                        />{" "}
                                        تنزيل كملف <span style={{ fontFamily: 'cnam' }}>PDF</span>
                                    </div>
                                    <div
                                        style={{ borderLeft: "2px solid #efeeee", height: "35px" }}
                                    ></div>
                                    <div className=" pointer ">
                                        <a
                                            href={`mailto:?subject=CNAM Portal - ${internshipdetail.internship_job_title}&body=${share_content}`}
                                            title="Share by Email"
                                            style={{
                                                color: "black",
                                                textDecoration: "none",
                                                fontFamily: "cnam-ar",
                                            }}
                                        >
                                            <EmailIcon style={{ color: "rgb(198 2 36)" }} /> طلب عن طريق
                                            البريد الإلكتروني
                                        </a>
                                    </div>
                                </div>
                                <hr style={{ borderTop: "2px solid #efeeee" }} />
                            </div>
                        </>
                    ) : (
                        // * /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        // * /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        // * /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        // * /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        // * /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                        <>
                            <InternshipDetailsLeft
                                props={internshipdetail}
                                history={props.history}
                            />

                            <div
                                className="col-lg-4"
                                style={{ paddingTop: "5.5rem", height: "100%" }}
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
                                        style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                    >
                                        {internshipdetail.user_name}
                                        <hr />
                                    </div>

                                    <div
                                        className=""
                                        style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                    >
                                        Company Name
                                    </div>
                                    <div
                                        className=""
                                        style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                    >
                                        {
                                            internshipdetail
                                                .industry_details_company_name
                                        }
                                        <hr />
                                    </div>

                                    <div
                                        className=""
                                        style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                    >
                                        Submitted on
                                    </div>
                                    <div
                                        className=""
                                        style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                                    >
                                        {formatDate(internshipdetail.created_date)}
                                        <hr />
                                    </div>

                                    <div
                                        className=""
                                        style={{ color: "#6E6259", fontSize: "0.95rem" }}
                                    >
                                        Status
                                    </div>
                                    <div className="">
                                        <Button
                                            style={
                                                internshipdetail.job_status ===
                                                    "PENDING REVIEW"
                                                    ? btnstyle
                                                    : btnstyle2
                                            }
                                        >
                                            {internshipdetail.job_status}
                                        </Button>
                                        <hr />
                                    </div>

                                    <div className="d-flex p-2">
                                        <div
                                            className="pointer"
                                            style={{ fontWeight: "500", fontSize: "13px" }}
                                            onClick={() =>
                                                props.history.push(
                                                    `/discussion/${btoa(encodeURIComponent(internshipid))}`
                                                )
                                            }
                                        >
                                            <SmsIcon style={{ color: "#e98300", fontSize: "17px" }} />{" "}
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
                                                        encodeURIComponent(internshipid)
                                                    )}`
                                                )
                                            }
                                        >
                                            <AddIcon style={{ color: "rgb(198 2 36)", fontSize: "12px" }} />{" "}
                                            Add a comment
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center mt-4">
                                    <div onClick={download_pdf} style={{ marginRight: "4rem", cursor: "pointer" }}>
                                        <img
                                            src={pdf}
                                            alt="img"
                                            style={{ width: "19px" }}

                                        />{" "}
                                        Download as PDF
                                    </div>
                                    <div
                                        style={{ borderLeft: "2px solid #efeeee", height: "35px" }}
                                    ></div>
                                    <div className="ml-0 ml-md-4 pointer">
                                        <a
                                            href={`mailto:?subject=CNAM Portal - ${internshipdetail.internship_job_title}&body=${share_content}`}
                                            title="Share by Email"
                                            style={{ color: "black", textDecoration: "none" }}
                                        >
                                            <EmailIcon style={{ color: "rgb(198 2 36)" }} /> Share by email
                                        </a>
                                    </div>
                                </div>
                                <hr style={{ borderTop: "2px solid #efeeee" }} />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

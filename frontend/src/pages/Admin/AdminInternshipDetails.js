import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { getSessionInfo, clearSessionInfo } from "../../variable";
import { WS_LINK, } from "../../globals";
import { formatDate, downloadFileWithExtension, translate } from '../../functions'

import { Button } from "reactstrap";

import Selector from "../../components/Selector/Selector";
import InternshipDetailsLeft from "../../components/InputText/InternshipDetailsLeft";
import GenericModal from "../../components/PageModals/GenericModal"

import SmsIcon from "@material-ui/icons/Sms";
import AddIcon from "@material-ui/icons/Add";
import EmailIcon from '@material-ui/icons/Email';

import "../../App.css";
import "./AdminChallengeDetails.css"

import pdf from "../../assets/images_svg/pdf.svg";
import rtf from "../../assets/images_png/rtf.png";
import excel from "../../assets/images_svg/excel.svg";
import csv from "../../assets/images_svg/csv.svg";
import check from '../../assets/images_png/check.png'

export default function AdminInternshipDetails(props) {
  let { internshipid } = useParams();
  internshipid = decodeURIComponent(atob(internshipid));

  // the states
  const [detailsObj, setDetailsObj] = useState({
    internshipDetails: "",
    assigned: "",
  });
  const [talents, setTalents] = useState("");
  const [changeAssigned, setChangeAssigned] = useState(false);
  const [commentObj, setCommentObj] = useState("");
  const [changedData, setChangedData] = useState("");
  const [pageLoaded, setPageLoaded] = useState(false);
  const [modalState, setmodalState] = useState(false)

  const statusOptions = useRef([{
    value: "PENDING REVIEW",
    label: "PENDING REVIEW"
  },
  //{ value: "PENDING INFO", label: "PENDING INFO" },
  {
    value: "IN PROGRESS",
    label: "IN PROGRESS"
  },
  {
    value: "CLOSED",
    label: "CLOSED"
  },
  {
    value: "STUDENTS ASSIGNED",
    label: "STUDENTS ASSIGNED"
  },
    // {
    //   value: "STUDENTS ASSIGNED",
    //   label: "STUDENTS ASSIGNED"
    // },
  ])

  // the set states functions
  const handleChange = (name, value) => {
    setChangedData({ ...changedData, [name]: value });
  };

  const handleAssigned = () => {
    setChangeAssigned(!changeAssigned);
  };

  // data fetching on creation
  useEffect(() => {
    props.setPageTitle('Internship Details', 'تفاصيل التدريب')
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
      jobid: internshipid,
    };
    props.toggleSpinner(true);
    // to get the challenge details
    axios({
      method: "post",
      url: `${WS_LINK}get_job_details_byid`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (getSessionInfo("role") === 4 && res.data !== "token error") {
          props.toggleSpinner(false);

          const internship = res.data[0][0];

          let status = internship.job_status;
          if (status === "pending") {
            status = "PENDING REVIEW";
          } else {
            status = status.toUpperCase();
          }

          // for (var i = 0; i < 4; i++) {
          //   statusOptions.current[i].isDisabled = true
          //   if (statusOptions.current[i].label.toLowerCase() === status.toLowerCase()) {
          //     break
          //   }
          // }

          setDetailsObj({
            internshipDetails: internship,
            assigned: res.data[2],
          });
          setChangedData({
            status: { value: status, label: status },
            assigned:
              res.data[2].length !== 0
                ? {
                  value: res.data[2][0].user_id,
                  label: res.data[2][0].user_name + " (" + res.data[2][0].user_department + " )",
                }
                : { value: "Not Found", label: "Not Found" },
          });

          setPageLoaded(true);
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

    // to get the comments
    axios({
      method: "post",
      url: `${WS_LINK}get_count_comments_by_jobid`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (getSessionInfo("role") === 4 && res.data !== "token error") {
          const count_comments = res.data;

          setCommentObj(count_comments[0] + count_comments[1]);
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
    // to get the talents
    axios({
      method: "post",
      url: `${WS_LINK}get_cnam_talents`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (getSessionInfo("role") === 4 && res.data !== "token error") {
          let talentTemp = [];
          for (let i = 0; i < res.data.length; i++) {
            talentTemp[i] = {
              value: res.data[i].user_id,
              label: res.data[i].user_name + " (" + res.data[i].user_department + " )",
            };
          }
          setTalents(talentTemp);
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
  };

  // to send the saved data
  const saveChanges = () => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const postedData = {
      adminid: getSessionInfo("id"),
      token: getSessionInfo("token"),
      challengeid: internshipid,
      userid: changedData.assigned.value,
      status: changedData.status.value,
    };
    props.toggleSpinner(true);
    // to get the challenge details
    axios({
      method: "post",
      url: `${WS_LINK}assign_challenge`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (getSessionInfo("role") === 4 && res.data !== "token error") {
          props.toggleSpinner(false);
          setmodalState(true)
          getData();
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
  };



  const download_as = (download_type) => {

    const cancelToken = axios.CancelToken
    const source = cancelToken.source()


    const postedData = {
      userid: getSessionInfo('id'),
      token: getSessionInfo('token'),
      jobid: internshipid,
      jobtype: 'internship',
      toe: download_type,
    }

    axios({
      method: "post",
      url: `${WS_LINK}admin_export_jobs`,
      data: postedData,
      cancelToken: source.token,
      headers: { "Access-Control-Allow-Origin": "*" }
    })
      .then(res => {
        if (res.data !== "role error" && res.data !== "token error") {
          downloadFileWithExtension(res.data, `${detailsObj.internshipDetails.internship_job_title}.${download_type}`, download_type)
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

  let share_content;

  let degree = "";
  if (detailsObj.internshipDetails) {
    if (detailsObj.internshipDetails.internship_categorie_students === "MS")
      degree = "MS, Majoring in";
    else degree = "PhD, Majoring in";

    share_content =
      "Internship Title: %0D%0A" +
      detailsObj.internshipDetails.internship_job_title +
      "%0D%0A %0D%0A" +
      "Department: %0D%0A" +
      detailsObj.internshipDetails.internship_department +
      "%0D%0A %0D%0A" +
      "Date: %0D%0A" +
      "From " +
      formatDate(detailsObj.internshipDetails.internship_start_date) +
      " Till " +
      formatDate(detailsObj.internshipDetails.internship_end_date) +
      "%0D%0A %0D%0A" +
      "Job Location: %0D%0A" +
      detailsObj.internshipDetails.internship_locations +
      "%0D%0A %0D%0A" +
      "Internship Length: %0D%0A" +
      detailsObj.internshipDetails.internship_length +
      "%0D%0A %0D%0A" +
      "Outline of the research or practical training experience and the roles and responsibilties of the position: %0D%0A" +
      detailsObj.internshipDetails.internship_outline +
      "%0D%0A %0D%0A" +
      "Category of students and major(s) most appropriate for the opportunity at your institution: %0D%0A" +
      degree +
      ": %0D%0A" +
      detailsObj.internshipDetails.student_major +
      "%0D%0A %0D%0A" +
      "Prior work experience or technical skills requirements: %0D%0A" +
      detailsObj.internshipDetails.internship_prior_work_experience +
      "%0D%0A %0D%0A" +
      "Compensation and Salary: %0D%0A" +
      detailsObj.internshipDetails.internship_compensation_salary +
      "%0D%0A %0D%0A" +
      (detailsObj.internshipDetails.contact_details
        ? "Contact Details: %0D%0A" +
        detailsObj.internshipDetails.contact_details +
        "%0D%0A %0D%0A"
        : "%0D%0A") +
      (detailsObj.internshipDetails.internship_link
        ? "Internship Link: %0D%0A" +
        detailsObj.internshipDetails.internship_link +
        "%0D%0A %0D%0A"
        : "%0D%0A") +
      "List of required documents: %0D%0A" +
      detailsObj.internshipDetails.internship_required_document +
      "%0D%0A %0D%0A" +
      "A brief description about your company: %0D%0A" +
      detailsObj.internshipDetails.internship_brief_description +
      "%0D%0A %0D%0A";
  }

  return (
    <>
      <GenericModal
        state={modalState}
        toggleState={() => setmodalState(false)}
        icon={<img src={check} width={75} alt="" />}
        text={translate("Changed saved successfully!", "تم تغيير بنجاح!")}
        buttonClick={() => setmodalState(false)}
        buttonText={translate('Ok', 'نعم')}
      />
      {
        getSessionInfo('language') === 'english' ?
          (
            <>
              <div
                className="container-fluid tableScroll"
                style={{ backgroundColor: "#fffdfc", width: "100vw" }}
              >
                {pageLoaded && (
                  <div
                    className="row justify-content-center"
                    style={{ height: "calc(100vh - 128px)" }}
                  >
                    <InternshipDetailsLeft
                      props={detailsObj.internshipDetails}
                      history={props.history}
                      job_id={internshipid}
                    />
                    {/* //* ////////////////////// part two //////////////////////// */}

                    <div
                      className="col-lg-5 hide_scrollbar"
                      style={{ paddingTop: "60px", height: "calc(100vh - 128px)", overflowY: 'auto' }}
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
                        <div className="mb-1" style={{ fontFamily: 'cnam-bold' }}>Submitted by</div>
                        <div className="h6 ">
                          {detailsObj.internshipDetails.user_name}
                          <hr className="my-3" />
                        </div>

                        <div className="mb-1" style={{ fontFamily: 'cnam-bold' }}>Company Name</div>
                        <div className="h6 ">
                          {detailsObj.internshipDetails.industry_details_company_name}
                          <hr className="my-3" />
                        </div>

                        <div className="mb-1" style={{ fontFamily: 'cnam-bold' }}>Submitted on</div>
                        <div className="h6 ">
                          {formatDate(detailsObj.internshipDetails.created_date, true) +
                            "\n"}
                          <hr className="my-3" />
                        </div>

                        <div className="mb-2" style={{ fontFamily: 'cnam-bold' }}>
                          Assigned to
                        </div>

                        <div className="d-flex">
                          {changeAssigned ? (
                            <Selector
                              name="assigned"
                              value={changedData.assigned}
                              className="w_shadow col-8"
                              onChange={(e) => handleChange("assigned", e)}
                              options={talents}
                              placeholder="Select assignee"
                              style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                            />
                          ) : (
                            <div className="h6" style={{ fontFamily: "cnam" }}>
                              {changedData.assigned.label}
                            </div>
                          )}

                          <div
                            className="ml-auto pointer"
                            style={{ color: "rgb(198 2 36)", fontFamily: "cnam" }}
                            onClick={handleAssigned}
                          >
                            {!changeAssigned ? "Change Assignee" : "Cancel"}
                          </div>
                        </div>
                        <hr />

                        <div className="mb-1" style={{ fontWeight: "bold" }}>
                          Status
                        </div>
                        <div className="">
                          <Selector
                            name="status"
                            value={changedData.status}
                            className="w_shadow"
                            onChange={(e) => handleChange("status", e)}
                            options={statusOptions.current}
                            placeholder="Select status"
                            style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                          />

                          <hr />
                        </div>

                        <div style={{ display: "flex", padding: "8px" }}>
                          <div
                            className="pointer"
                            style={{ fontWeight: "500", fontSize: "13px" }}
                            onClick={() =>
                              props.history.push(
                                `/discussion/${btoa(encodeURIComponent(internshipid))}`
                              )
                            }
                          >
                            <SmsIcon style={{ fontSize: "17px", color: "#e98300" }} /> (
                            {commentObj}) Comment{commentObj > 1 ? 's' : ''}
                          </div>
                          <div
                            className=" comment"
                            style={{
                              fontSize: "13px",
                              marginLeft: "auto",
                              color: "rgb(198 2 36)",
                            }}
                            onClick={() =>
                              props.history.push(
                                `/discussion/${btoa(encodeURIComponent(internshipid))}`
                              )
                            }
                          >
                            <AddIcon style={{ fontSize: "12px" }} />
                            Add a comment
                          </div>
                        </div>

                        <div className="d-flex mt-3">
                          <Button
                            className="  "
                            style={{
                              fontWeight: "600",
                              background: "rgb(198 2 36)",
                              padding: "0.7rem 2.2rem",
                              border: "none",
                            }}
                            onClick={saveChanges}
                          >
                            Save
                          </Button>
                        </div>
                      </div>

                      <div className="d-flex justify-content-around mt-4">
                        {/* <div style={{ cursor: 'pointer' }} onClick={() => console.log('aa')}><img src={pdf} alt="img" style={{ width: '19px' }} /> Download as PDF</div> */}
                        <Selector
                          name="download_as"
                          className=" col-5 download_as"
                          options={[
                            { value: "PDF", label: <div style={{ cursor: 'pointer' }} onClick={() => download_as('pdf')}><img src={pdf} alt="img" style={{ width: '19px' }} /> Download PDF</div> },
                            { value: "RTF", label: <div style={{ cursor: 'pointer' }} onClick={() => download_as('rtf')}><img src={rtf} alt="img" style={{ width: '19px' }} /> Download RTF</div> },
                            { value: "EXCEL", label: <div style={{ cursor: 'pointer' }} onClick={() => download_as('xlsx')}><img src={excel} alt="img" style={{ width: '19px' }} /> Download EXCEL</div> },
                            { value: "CSV", label: <div style={{ cursor: 'pointer' }} onClick={() => download_as('csv')}><img src={csv} alt="img" style={{ width: '19px' }} /> Download CSV</div> },
                          ]}
                          placeholder='Download'
                          style={{ backgroundColor: 'transparent', color: 'black', boxShadow: 'none', border: 'none' }}
                        />
                        <div style={{ borderLeft: '2px solid #efeeee', height: '35px' }}></div>
                        <div style={{ cursor: 'pointer' }}>
                          <a href={`mailto:?subject=cnam KPP - ${detailsObj.internshipDetails && detailsObj.internshipDetails.internship_name}&body=${share_content}`} title="Share by Email" style={{ color: "black", textDecoration: "none" }}>
                            <EmailIcon style={{ color: "rgb(198 2 36)" }} /> Share by email
                          </a>
                        </div>
                      </div><hr style={{ borderTop: '2px solid #efeeee' }} />
                    </div>
                  </div>
                )}
              </div>
            </>
          )

          : // --------ARABIC-------

          (
            <div style={{ fontFamily: 'cnam-ar', textAlign: 'right' }}>
              <div
                className="container-fluid tableScroll"
                style={{ backgroundColor: "#fffdfc", width: "100vw" }}
              >
                {pageLoaded && (
                  <div
                    className="row justify-content-center"
                    style={{ height: "calc(100vh - 128px)" }}
                  >
                    <InternshipDetailsLeft
                      props={detailsObj.internshipDetails}
                      history={props.history}
                      job_id={internshipid}
                    />

                    {/* // * ////////////////////// part two //////////////////////// */}

                    <div
                      className="col-lg-5 hide_scrollbar"
                      style={{ paddingTop: "60px", height: "calc(100vh - 128px)", overflowY: 'auto' }}
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
                        <div className="" style={{ fontWeight: "bold" }}>
                          مقدم من
                        </div>
                        <div className="h6" style={{ fontFamily: "cnam-ar" }}>
                          {detailsObj.internshipDetails.user_name}
                          <hr />
                        </div>

                        <div className="" style={{ fontWeight: "bold" }}>
                          اسم المنشأة
                        </div>
                        <div className="h6" style={{ fontFamily: "cnam-ar" }}>
                          {detailsObj.internshipDetails.industry_details_company_name}
                          <hr />
                        </div>

                        <div className="" style={{ fontWeight: "bold" }}>
                        قدمت بتاريخ
                        </div>
                        <div className="h6" style={{ fontFamily: "cnam-ar" }}>
                          {formatDate(detailsObj.internshipDetails.created_date)}
                          <hr />
                        </div>

                        <div className="mb-2" style={{ fontWeight: "bold" }}>
                        تم استناد فترة تدريب إلى
                        </div>

                        <div className="d-flex">
                          {changeAssigned ? (
                            <Selector
                              name="assigned"
                              value={changedData.assigned}
                              className="w_shadow col-8"
                              onChange={(e) => handleChange("assigned", e)}
                              options={talents}
                              placeholder="Select assignee"
                              style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                            />
                          ) : (
                            <div className="h6" style={{ fontFamily: "cnam-ar" }}>
                              {changedData.assigned.label}
                            </div>
                          )}

                          <div
                            className="mr-auto pointer"
                            style={{ color: "rgb(198 2 36)", fontFamily: "cnam-ar" }}
                            onClick={handleAssigned}
                          >
                            {!changeAssigned ? "تغيير المحال إليه" : "يلغي"}
                          </div>
                        </div>
                        <hr />

                        <div className="mb-1" style={{ fontWeight: "bold" }}>
                          حالة
                        </div>
                        <div className="">
                          <Selector
                            name="status"
                            value={changedData.status}
                            className="w_shadow"
                            onChange={(e) => handleChange("status", e)}
                            options={statusOptions.current}
                            placeholder="Select status"
                            style={{ boxShadow: "0px 1px 3px -2px #888888", fontFamily: 'cnam' }}
                          />
                          <hr />
                        </div>

                        <div style={{ display: "flex", padding: "8px" }}>
                          <div
                            style={{ fontWeight: "500", fontSize: "13px" }}
                            onClick={() =>
                              props.history.push(
                                `/discussion/${btoa(encodeURIComponent(internshipid))}`
                              )
                            }
                            className="pointer"
                          >
                            <SmsIcon style={{ fontSize: "17px", color: "#e98300" }} /><span style={{ fontFamily: 'cnam' }}> (
                              {commentObj})</span> تعليقات
                          </div>
                          <div
                            className="comment"
                            style={{
                              fontSize: "13px",
                              marginRight: "auto",
                              color: "rgb(198 2 36)",
                            }}
                            onClick={() =>
                              props.history.push(
                                `/discussion/${btoa(encodeURIComponent(internshipid))}`
                              )
                            }
                          >
                            <AddIcon style={{ fontSize: "12px" }} />
                            اضف تعليق
                          </div>
                        </div>

                        <div className="d-flex mt-3">

                          <Button
                            className="  "
                            style={{
                              fontWeight: "600",
                              background: "rgb(198 2 36)",
                              padding: "0.7rem 2.2rem",
                              border: "none",
                            }}
                            onClick={saveChanges}
                          >
                            حفظ
                          </Button>
                        </div>
                      </div>
                      <div className="d-flex justify-content-around mt-4">
                        <Selector
                          name="download_as"
                          className=" col-5 download_as"

                          options={[
                            { value: "PDF", label: <div style={{ cursor: 'pointer' }} onClick={() => download_as('pdf')}><img src={pdf} alt="img" style={{ width: '19px' }} /> تحميل الملف PDF</div> },
                            { value: "RTF", label: <div style={{ cursor: 'pointer' }} onClick={() => download_as('rtf')}><img src={rtf} alt="img" style={{ width: '19px' }} /> تحميل الملف RTF</div> },
                            { value: "EXCEL", label: <div style={{ cursor: 'pointer' }} onClick={() => download_as('xlsx')}><img src={excel} alt="img" style={{ width: '19px' }} /> تحميل الملف EXCEL</div> },
                            { value: "CSV", label: <div style={{ cursor: 'pointer' }} onClick={() => download_as('csv')}><img src={csv} alt="img" style={{ width: '19px' }} /> تحميل الملف CSV</div> },
                          ]}
                          placeholder='تحميل'
                          style={{ backgroundColor: 'transparent', color: 'black', boxShadow: 'none', border: 'none' }}
                        />
                        <div style={{ borderLeft: '2px solid #efeeee', height: '35px' }}></div>
                        <div style={{ cursor: 'pointer', fontFamily: 'cnam-ar' }}>
                          <a href={`mailto:?subject=cnam KPP - ${detailsObj.internshipDetails && detailsObj.internshipDetails.internship_name}&body=${share_content}`} title="Share by Email" style={{ color: "black", textDecoration: "none" }}>
                            <EmailIcon style={{ color: "rgb(198 2 36)", }} />مشاركة عبر البريد الإلكتروني  
                          </a>
                        </div>
                      </div><hr style={{ borderTop: '2px solid #efeeee' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
      }
    </>

  );
}

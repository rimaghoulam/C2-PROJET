import React, { useState, useEffect } from "react";
import axios from "axios";

import { WS_LINK, } from "../../globals";
import { formatDate } from '../../functions'
import { getSessionInfo, clearSessionInfo } from "../../variable";

import Table from "../../components/Table/Table";

import SmsIcon from "@material-ui/icons/Sms";

import internship_icon from '../../assets/images_png/internship_icon.png';

import "../../App.css";
import './cnamFlow.css'


export default function InternshipTable(props) {

  // the states

  const [internshipObj, setInternshipObj] = useState({ internships: "" });
  const [loaded, setLoaded] = useState(false);
  // const [tablePages, setTablePages] = useState(false)


  // fetch data on page creation

  useEffect(() => {
    props.setPageTitle('Internships', 'التدريب الداخلي')
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
    };

    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${WS_LINK}get_cnam_internship`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (getSessionInfo('role') === 1 && res.data !== "token error") {
          setInternshipObj({ internships: res.data[0], comments: res.data[1] });
          setLoaded(true);
          props.toggleSpinner(false);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);





  // data needed to fill rows
  const ticketName = (intern_title, intern_id) => (
    <div className="d-flex align-items-center ml-2">
      <div className={`${getSessionInfo('language') === 'arabic' && 'ml-2'}`}>
        <img src={internship_icon} alt="intern" className="internshipIcon" />
      </div>
      <div className="ml-3">
        <div className="text-nowrap" style={{ fontSize: '0.9rem' }}>{intern_title}</div>
        <div style={{ color: "#848484", fontSize: '0.9rem' }}>ID: #{intern_id}</div>
      </div>
    </div>
  );

  const Comment = id => (
    <div className="d-flex align-items-center" style={{ color: "#A2A2A2" }}>
      {getSessionInfo('language') === 'arabic' ? (
        <>
          <div>
            <SmsIcon style={{ fontSize: "17px", color: '#e98300' }} />
          </div>
          <div className="ml-1" style={{ fontFamily: 'cnam-ar' }}>
            <div className="text-nowrap">( {internshipObj.comments[id] ? internshipObj.comments[id] : 0}) تعليق</div>
          </div>
        </>
      )
        :
        (

          <>
            <div>
              <SmsIcon style={{ fontSize: "17px", color: '#e98300' }} />
            </div>
            <div className="ml-1">
              <div className="text-nowrap">({internshipObj.comments[id] ? internshipObj.comments[id] : 0}) Comment{internshipObj.comments[id] > 1 ? 's' : ''}</div>
            </div>
          </>
        )
      }
    </div>
  );




  // data needed to fill tables

  let cols = []
  getSessionInfo('language') === 'arabic' ?
    cols = [
      {
        title: " اسم التدريب", field: "ticketName",
        render: rowData => ticketName(rowData.ticketName.internship_job_title, rowData.ticketName.job_id),
        customFilterAndSearch: (term, rowData) => (rowData.ticketName.internship_job_title.toLowerCase()).indexOf(term.toLowerCase()) !== -1 || (rowData.ticketName.job_id.toString()).indexOf(term) !== -1,
        customSort: (a, b) => (a.ticketName.internship_job_title.localeCompare(b.ticketName.internship_job_title)),
      },
      { title: "اسم المؤسسة /المنشأة", field: "submitted" },
      { title: "الموقع", field: "location" },
      { title: "تم استناد فترة تدريب إلى", field: "assigned" },
      { title: "", field: "comments" },
      { title: "تم إنشاؤها على", field: "created", defaultSort: 'desc' },
      {
        title: "الحالة", field: "status",
        render: rowData => <button className={(rowData.status.job_status === 'PENDING REVIEW') ? 'pendingReviewButton' : 'statusButton'}>{rowData.status.job_status}</button>,
        customFilterAndSearch: (term, rowData) => (rowData.status.job_status.toLowerCase()).indexOf(term.toLowerCase()) !== -1,
        customSort: (a, b) => (a.status.job_status.localeCompare(b.status.job_status))
      },
    ]
    :
    cols = [
      {
        title: " INTERNSHIP NAME", field: "ticketName",
        render: rowData => ticketName(rowData.ticketName.internship_job_title, rowData.ticketName.job_id),
        customFilterAndSearch: (term, rowData) => (rowData.ticketName.internship_job_title.toLowerCase()).indexOf(term.toLowerCase()) !== -1 || (rowData.ticketName.job_id.toString()).indexOf(term) !== -1,
        customSort: (a, b) => (a.ticketName.internship_job_title.localeCompare(b.ticketName.internship_job_title)),
      },
      { title: "NAME OF INSTITUTION/COMPANY", field: "submitted" },
      { title: "LOCATION", field: "location" },
      { title: "ASSIGNED TO", field: "assigned" },
      { title: "", field: "comments" },
      { title: "CREATED ON", field: "created", defaultSort: 'desc' },
      {
        title: "STATUS", field: "status",
        render: rowData => <button className={(rowData.status.job_status === 'PENDING REVIEW') ? 'pendingReviewButton' : 'statusButton'}>{rowData.status.job_status}</button>,
        customFilterAndSearch: (term, rowData) => (rowData.status.job_status.toLowerCase()).indexOf(term.toLowerCase()) !== -1,
        customSort: (a, b) => (a.status.job_status.localeCompare(b.status.job_status))
      },
    ]



  let rows = [];
  if (internshipObj.internships !== undefined) {
    if (internshipObj.internships.length > 0) {
      rows = Object.values(internshipObj.internships).map((item) => ({
        key: item.internship_job_id,
        ticketName: { internship_job_title: item.internship_job_title, job_id: item.job_id },
        created: formatDate(item.created_date),
        submitted: item.internship_institution_name,
        location: item.internship_location,
        assigned: getSessionInfo("name"),
        comments: Comment(item.job_id),
        status: { job_status: item.job_status },
      }));
    }
  }






  return (
    <div className="main  hide_scrollbar" style={{ height: 'calc(100vh - 101px)', overflowY: 'scroll', background: "#fffdfc" }}>
      <div className={`${getSessionInfo('language') === 'arabic' && 'table-arabic'}`}>
        {loaded && (
          <Table
            name="Internship-table"
            title={
              <div
                className=" text-nowrap ml-1 ml-md-0"
                style={{ fontFamily: "cnam-bold", fontSize: '1.15rem' }}
              >
                {getSessionInfo('language') === 'arabic' ?
                  `(${rows.length}) طلبات التدريب الداخلي `
                  :
                  `Internships (${rows.length})`
                }
              </div>
            }
            columns={cols}
            data={rows}
            rowClick={(event, rowData) => {
              props.history.push(
                `/internship_details/${btoa(encodeURIComponent(rowData.key))}`
              );
            }}
            options={{
              pageSize: 5,
              emptyRowsWhenPaging: false,
              pageSizeOptions: [5, 10],
              paging: true,
              headerStyle: {
                fontSize: "12px",
                backgroundColor: "#F7F7F7",
                color: "#B3B3B3",
                paddingTop: "3px",
                paddingBottom: "3px",
                whiteSpace: "nowrap",
              },
              rowStyle: {
                fontSize: '0.9rem',
              }
            }}
          />
        )}
      </div>
    </div>
  );
}





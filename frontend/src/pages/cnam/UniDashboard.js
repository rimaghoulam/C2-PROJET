import React, { useState, useEffect } from "react";
import axios from "axios";

import Table from "../../components/Table/Table"

import SmsIcon from "@material-ui/icons/Sms";

import { WS_LINK, } from "../../globals";
import { formatDate, toArabicDigits } from '../../functions'
import { getSessionInfo, clearSessionInfo } from "../../variable";

import internship_icon from '../../assets/images_png/internship_icon.png';
import challenge_icon from '../../assets/images_png/challenge_icon.png';

import "../../App.css";
import './cnamFlow.css'

export default function DashboardTable(props) {



  // * ///////// THE STATES
  const [unidashboardObj, setUnidashboardObj] = useState([
    {
      challenges: "",
      internships: "",
    },
  ]);

  const [loaded, setLoaded] = useState(false);

  const [tablePages, setTablePages] = useState({
    challenges: false,
    internships: false
  })




  // fetch data on page creation
  useEffect(() => {
    props.setPageTitle('Dashboard', 'لوحة إدارة المنصة')
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
    };

    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${WS_LINK}get_cnam_dashboard`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {

        if (getSessionInfo('role') === 1 && res.data !== "token error") {
          const internships = res.data[1];
          const challenges = res.data[0];
          setUnidashboardObj({
            challenges: challenges,
            internships: internships,
            comments: res.data[2]
          });
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




  // data to fill rows

  
  const internName = (intern_title, intern_id) => (
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

  const Comment = job_id => (
    <div className="d-flex align-items-center" style={{ color: "#A2A2A2" }}>
      {getSessionInfo('language') === 'arabic' ? (
        <>
          <div>
            <SmsIcon style={{ fontSize: "17px", color: '#e98300' }} />
          </div>
          <div className="ml-1" style={{ fontFamily: 'cnam-ar' }}>
            <div className="text-nowrap">( {unidashboardObj.comments[job_id] ? toArabicDigits(unidashboardObj.comments[job_id].toString()) : toArabicDigits('0')}) تعليق</div>
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
              <div className="text-nowrap">({unidashboardObj.comments[job_id] ? unidashboardObj.comments[job_id] : 0}) Comment{unidashboardObj.comments[job_id] > 1 ? 's' : ''}</div>
            </div>
          </>
        )
      }
    </div>
  );




  //data to fill the table
  let cols = []
  let internshipCols = []
  if (getSessionInfo('language') === 'arabic') {
  
    internshipCols = [
      {
        title: "اسم التدريب", field: "ticketName",
        render: rowData => rowData.ticketName.type === "challenge" ? internName(rowData.ticketName.challenge_name, rowData.ticketName.job_id) : internName(rowData.ticketName.challenge_name, rowData.ticketName.job_id),
        customFilterAndSearch: (term, rowData) => (rowData.ticketName.challenge_name.toLowerCase()).indexOf(term.toLowerCase()) !== -1,
        customSort: (a, b) => (a.ticketName.challenge_name.localeCompare(b.ticketName.challenge_name)),
      },
      { title: "مقدم بواسطة", field: "submitted" },
      { title: "اسم المؤسسة /المنشأة", field: "submitted" },
      { title: "الموقع", field: "location" },
      { title: "تم استناد فترة تدريب إلى", field: "assigned" },
      {
        title: "", field: "comments",
        customSort: (a, b) => (a.comments.props.children.props.children[1].props.children.props.children[1] - b.comments.props.children.props.children[1].props.children.props.children[1])
      },
      { title: "تم إنشاؤها على", field: "created", defaultSort: 'desc' },
      {
        title: "الحالة", field: "status",
        render: rowData => <button className={(rowData.status.job_status === 'PENDING REVIEW') ? 'pendingReviewButton' : 'statusButton'}>{rowData.status.job_status}</button>,
        customFilterAndSearch: (term, rowData) => (rowData.status.job_status.toLowerCase()).indexOf(term.toLowerCase()) !== -1 || (rowData.ticketName.job_id.toString()).indexOf(term) !== -1,
        customSort: (a, b) => (a.status.job_status.localeCompare(b.status.job_status))
      }
    ]
  } else {
    
    internshipCols = [
      {
        title: " INTERNSHIP NAME",
        field: "ticketName",
        render: rowData => rowData.ticketName.type === "challenge" ? internName(rowData.ticketName.challenge_name, rowData.ticketName.job_id) : internName(rowData.ticketName.challenge_name, rowData.ticketName.job_id),
        customFilterAndSearch: (term, rowData) => { return (rowData.ticketName.challenge_name.toLowerCase()).indexOf(term.toLowerCase()) !== -1 || (rowData.ticketName.job_id.toString()).indexOf(term) !== -1 },
        customSort: (a, b) => (a.ticketName.challenge_name.localeCompare(b.ticketName.challenge_name)),
      },
      { title: "NAME OF INSTITUTION/COMPANY", field: "submitted" },
      { title: "LOCATION", field: "location" },
      { title: "ASSIGNED TO", field: "assigned" },
      {
        title: "", field: "comments",
        customSort: (a, b) => (a.comments.props.children.props.children[1].props.children.props.children[1] - b.comments.props.children.props.children[1].props.children.props.children[1])
      },
      { title: "CREATED ON", field: "created", defaultSort: 'desc' },
      {
        title: "STATUS", field: "status",
        render: rowData => <button className={(rowData.status.job_status === 'PENDING REVIEW') ? 'pendingReviewButton' : 'statusButton'}>{rowData.status.job_status}</button>,
        customFilterAndSearch: (term, rowData) => (rowData.status.job_status.toLowerCase()).indexOf(term.toLowerCase()) !== -1,
        customSort: (a, b) => (a.status.job_status.localeCompare(b.status.job_status))
      }
    ]
  }


  let rows2 = [];
  if (unidashboardObj.internships !== undefined) {
    if (unidashboardObj.internships.length > 0) {
      rows2 = Object.values(unidashboardObj.internships).map((item) => ({
        key: item.internship_job_id,
        ticketName: { type: 'internship', challenge_name: item.internship_job_title, job_id: item.job_id },
        created: formatDate(item.created_date),
        submitted: item.internship_institution_name,
        location: item.internship_location,
        assigned: getSessionInfo("name"),
        comments: Comment(item.job_id),
        status: { job_status: item.job_status },
      }));
    }
  }


  // to check table pagination
  if (unidashboardObj.internships !== undefined) {
    
    if (!tablePages.internships && unidashboardObj.internships.length > 5) {
      setTablePages({ ...tablePages, 'internships': true })
    }
    if (tablePages.internships && unidashboardObj.internships.length < 5) {
      setTablePages({ ...tablePages, 'internships': false })
    }
  }



  return (
    <div className="main" style={{ height: 'calc(100vh - 101px)', overflowY: 'auto', background: "#fffdfc" }}>
      <div className={`${getSessionInfo('language') === 'arabic' && 'table-arabic'}`}>
        {loaded && (
          <>
         

            <Table
              name="dashboard-table-2"
              title={
                <div
                  className="text-nowrap ml-1 ml-md-0"
                  style={{ fontFamily: "cnam-bold", fontSize: '1.15rem' }}
                >
                  {getSessionInfo('language') === 'arabic' ?
                    `طلبات التدريب الداخلي (${toArabicDigits(rows2.length.toString())})`
                    : `Internships (${rows2.length})`}
                </div>
              }
              rowClick={(event, rowData) => {
                props.history.push(
                  `/internship_details/${btoa(encodeURIComponent(rowData.key))}`
                );
              }}
              columns={internshipCols}
              data={rows2}
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
          </>
        )}
      </div>
    </div>

  );
}



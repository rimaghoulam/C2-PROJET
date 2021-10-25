import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router';

import Table from "../../components/Table/Table";
import ExportModal from "../../components/PageModals/exportCompanyModal";

import { WS_LINK } from "../../globals";
import { getSessionInfo, clearSessionInfo } from "../../variable";
import { formatDate, downloadFileWithExtension } from '../../functions'

import SmsIcon from "@material-ui/icons/Sms";

import "../../App.css";
import '../../components/Table/Table.css';

import challenge_icon from '../../assets/images_png/challenge_icon.png';
import pdf from '../../assets/images_svg/pdf.svg';
import csv from '../../assets/images_svg/csv.svg';

// import moment from 'moment'

export default function AdminChallenges(props) {

  const [exportModalState, setExportModalState] = useState(false);

  const toggleExportModalState = () => {
    setExportModalState(!exportModalState);
  };

  let { status } = useParams();
  if (status !== undefined) status = decodeURIComponent(atob(status));


  //STATES

  const [counters, setCounters] = useState({
    challenge: 0,
    internship: 0,
  });
  const [loaded, setLoaded] = useState(false)

  const [rows, setRows] = useState({
    rows1: [],
    rows2: []
  })
  const [selectedRows, setSelectedRows] = useState({
    table1: [],
    table2: []
  })
  // PAGE CREATION

  useEffect(() => {
    props.setPageTitle('Challenges', 'التحديات')
    get_request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const get_request = () => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
    };
    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${WS_LINK}get_admin_dashboard`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (res.data !== "role error" && res.data !== "token error") {
          props.toggleSpinner(false);
          let intern = res.data[0]
          let challenge
          if (status !== undefined) {
            challenge = res.data[1].filter(item => item.job_status === status && item)
          }
          else {
            challenge = res.data[1]
          }
          let comments = res.data[2];


          if (res.data.length >= 1 && intern !== "e" && challenge !== "r") {
            setCounters({
              challenge: challenge.length,
            });




            const rows1 = Object.values(challenge).map(
              (elem) => ({
                key: elem.challenge_job_id,
                Name: { icon: ticketName(elem.challenge_name, elem.challenge_job_id), name: elem.challenge_name, email: elem.challenge_job_id },
                submitted: elem.industry_details_company_name,
                location: (elem.industry_details_headquarter && elem.industry_details_company_address_line1) ? `${elem.industry_details_headquarter}, ${elem.industry_details_company_address_line1}` : '',
                assigned: elem.id_assign_challenge !== null ? elem.user_name : "---",
                department: elem.user_department !== null ? elem.user_department : "---",
                comments: Comment(comments[elem.job_id] ? comments[elem.job_id] : 0),
                status: (
                  <button style={(elem.job_status === 'PENDING REVIEW') ? btnstyle : btnstyle2}>
                    {elem.job_status !== undefined &&
                      elem.job_status[0].toUpperCase() +
                      elem.job_status.substring(1)}{" "}
                  </button>

                ),
                created:
                  elem.created_at && formatDate(elem.created_at, true),
              })
            );

            setRows({ rows1: rows1 })

            setLoaded(true)
          }
        } else {
          clearSessionInfo();
          window.location.reload(false).then(props.history.replace("/"));
        }
      })

      .catch((err) => {
        props.toggleSpinner(false);
        // if (axios.isCancel(err)) {
        //   console.log("request canceled");
        // } else {
        //   console.log("request failed");
        // }
        console.log(err)
      });
  };

  // EXPORT TABLE AS CSV & PDF
  const exportTable = (data, jobType, exportType) => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    let jobs = []
    for (let i = 0; i < data.length; i++) {
      jobs[i] = data[i].key
    }

    const postedData = {
      userid: getSessionInfo('id'),
      token: getSessionInfo('token'),
      toe: exportType,
      toj: jobType,
      jobs_id: jobs
    }

    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${WS_LINK}export_jobs`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (getSessionInfo("role") === 4 && res.data !== "token error") {
          props.toggleSpinner(false)
          downloadFileWithExtension(res.data, `challenge-internship.${exportType}`, exportType);
          // downloadFile(res.data, 'challenge-internship.pdf')
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
  }


  // STYLES
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
    fontWeight: '550',
    cursor: 'default',
    textTransform: 'capitalize',
    fontFamily: 'cnam'
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
    fontWeight: '550',
    textTransform: 'uppercase',
    fontFamily: 'cnam'
  }
  const challengeStyle = {
    background: '#ccf0eb',
    borderRadius: '11%',
    width: '40px',
    height: '40px',
    padding: '5px'
  }


  // JSX
  const ticketName = (challenge_title, challenge_id) =>
    <div className="d-flex" id={challenge_title}>
      <div>
        <img src={challenge_icon} alt="intern" style={challengeStyle} />
      </div>
    </div>


  const Comment = (number) => (

    <div className="d-flex align-items-center" style={{ color: "#A2A2A2" }}>
      {getSessionInfo('language') === 'arabic' ?
        (
          <>
            <div>
              <SmsIcon style={{ fontSize: "17px", color: '#e98300' }} />
            </div>
            <div className="mr-1">
              <div className="text-nowrap" style={{ fontFamily: 'cnam-ar' }}>
                ( {number} ) تعليق
              </div>
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
              <div className="text-nowrap">
                ( {number} ) Comment{number > 1 ? 's' : ''}
              </div>
            </div>
          </>
        )
      }
    </div>
  );



  // TABLE DATA
  const cols = [
    // { title: getSessionInfo('language') === 'english' ? " NAME" : "اسم", field: "icon", cellStyle: { width: "5%", left: '15px' }, sorting: false },
    {
      key: "Name",
      title: getSessionInfo("language") === "english" ? " NAME" : "اسم",
      field: "Name",
      cellStyle: { whiteSpace: "pre-line" },
      render: (rowData) => (
        <div className="d-flex flex-row justify-content-start align-items-center">
          {rowData.Name.icon}
          <div className="pl-2">
            {rowData.Name.name} <br />
            <span style={{ color: "grey" }}>#ID:{rowData.Name.email}</span>
          </div>
        </div>
      ),
      customFilterAndSearch: (term, rowData) => rowData.Name.name.indexOf(term) !== -1,
      customSort: (a, b) => a.Name.name.localeCompare(b.Name.name),
    },

    { title: getSessionInfo('language') === 'english' ? "COMPANY NAME" : "مقدم من", field: "submitted" },
    { title: getSessionInfo('language') === 'english' ? "COMPANY LOCATION" : "الموقع", field: "location" },
    { title: getSessionInfo('language') === 'english' ? "ASSIGNED TO" : "تم استناد التحدي إلى", field: "assigned" },
    { title: getSessionInfo('language') === 'english' ? "DEPARTMENT" : "القسم", field: "department" },
    { title: "", field: "comments", customSort: (a, b) => a.comments.props.children.props.children[1].props.children.props.children[1] - b.comments.props.children.props.children[1].props.children.props.children[1] },
    {
      title: getSessionInfo('language') === 'english' ? "STATUS" : "الحالة",
      field: "status",
      // customFilterAndSearch: (term, rowData) => (rowData.status.job_status).indexOf(term) !== -1,
      customSort: (a, b) => a.status.props.children[0].localeCompare(b.status.props.children[0])
    }, {
      title: getSessionInfo('language') === 'english' ? "CREATED ON" : "تم إنشاؤها",
      field: "created",
      type: "date",
      defaultSort: 'desc'
    },
  ];



  return (
    <>
      <ExportModal type="challenge" toggleState={toggleExportModalState} state={exportModalState} />
      {getSessionInfo('language') === 'english' ?
        (
          <div className="w-100" style={{ height: 'calc(100vh - 118px)', overflowY: 'auto' }}>
            <div>
              {
                loaded && (
                  <div className="selectorTable">
                    <Table

                      name="Admin-Challenge-Table"
                      onSelection={
                        (a) => {
                          let b = []
                          for (let i = 0; i < a.length; i++) b.push(a[i].tableData.id)
                          setSelectedRows({ ...selectedRows, 'table1': b })
                        }
                      }
                      rowClick={(event, rowData) => {
                        if (selectedRows.table1.length > 0) {
                          let rs = rows.rows1;
                          const index = rs.indexOf(rowData);
                          rs[index].tableData.checked = !rs[index].tableData.checked;
                          setRows({ ...rows, 'rows1': rs });
                          let tb = selectedRows.table1
                          if (tb.includes(rowData.tableData.id)) {
                            let i = tb.indexOf(rowData.tableData.id);
                            tb.splice(i, 1);
                          }
                          else {
                            tb.push(rowData.tableData.id)
                          }
                          setSelectedRows({ ...selectedRows, 'table1': tb })
                        }
                        else {
                          props.history.push(`/challenge_details/${btoa(encodeURIComponent(rowData.key))}`)
                        }
                      }}
                      title={

                        <div className=" text-nowrap ml-1 ml-md-0" style={{ fontFamily: "cnam-bold", fontSize: "1.15rem" }}>
                          <div className="d-flex flex-row">
                            <div
                              className="font-weight-bold text-nowrap row ml-1 ml-md-0"
                              // style={{ fontSize: "17px", width: "70vw" }}
                              style={{ fontFamily: "cnam-bold", fontSize: '1.15rem', }}
                            >
                              <div className=" mb-2 mb-md-0">
                                {status !== undefined ? status + ' CHALLENGES' : " Challenges Requests"} ({counters.challenge})
                              </div>
                            </div>
                            <div className="d-flex justify-content-end mr-2">
                              <span
                                className="ml-1 p-2 py-1 pointer"
                                style={{
                                  height: "fit-content",
                                  border: "none",
                                  backgroundColor: "rgb(198 2 36)",
                                  color: "white",
                                  fontSize: "0.85rem",
                                  fontWeight: "500",
                                  fontFamily: "cnam",
                                  borderRadius: "5px",
                                }}
                                onClick={() => setExportModalState(true)}
                              >
                                Export logs
                              </span>
                            </div>
                          </div>
                        </div>
                      }
                      columns={cols}
                      data={rows.rows1}
                      options={{
                        pageSize: 10,
                        emptyRowsWhenPaging: false,
                        // rowStyle:{ fontSize:'1rem'},
                        pageSizeOptions: [10, 15, 20],
                        // exportButton: true,
                        selection: true,
                        rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '', fontSize: '0.9rem' }),
                        paging: true,
                        headerStyle: {
                          fontSize: "12px",
                          backgroundColor: "#F7F7F7",
                          color: "#B3B3B3",
                          paddingTop: "3px",
                          paddingBottom: "3px",
                          whiteSpace: "nowrap",
                        },

                      }}

                      actions={[
                        {
                          tooltip: 'Download as CSV',
                          icon: () => <button style={{ background: 'none', borderRadius: "4px", border: '1px solid lightgrey' }}><img src={csv} alt="" style={{ width: '20px' }} /><span style={{ fontSize: "13px", fontWeight: 'bold' }}> Download as CSV</span></button>,
                          onClick: (evt, data) => exportTable(data, 'challenge', 'csv')
                        },
                        {
                          tooltip: 'Download as PDF',
                          icon: () => <button style={{ background: 'none', borderRadius: "4px", border: '1px solid lightgrey' }}><img src={pdf} alt="" style={{ width: '20px' }} /><span style={{ fontSize: "13px", fontWeight: 'bold' }}> Download as PDF</span></button>,
                          onClick: (evt, data) => exportTable(data, 'challenge', 'pdf')
                        }
                      ]}
                    />
                  </div>
                )
              }
            </div>
          </div>
        )

        : // ---------ARABIC-----------

        (
          <div className="w-100" style={{ height: 'calc(100vh - 106px)', overflowY: 'auto' }}>
            <div className="text-right " >
              {
                loaded && (
                  <div className="selectorTable tableReachChild table-arabic">
                    <Table
                      name="Admin-Challenge-Table"
                      onSelection={
                        (a) => {
                          let b = []
                          for (let i = 0; i < a.length; i++) b.push(a[i].tableData.id)
                          setSelectedRows({ ...selectedRows, 'table1': b })
                        }
                      }
                      rowClick={(event, rowData) => {
                        if (selectedRows.table1.length > 0) {
                          let rs = rows.rows1;
                          const index = rs.indexOf(rowData);
                          rs[index].tableData.checked = !rs[index].tableData.checked;
                          setRows({ ...rows, 'rows1': rs });
                          let tb = selectedRows.table1
                          if (tb.includes(rowData.tableData.id)) {
                            let i = tb.indexOf(rowData.tableData.id);
                            tb.splice(i, 1);
                          }
                          else {
                            tb.push(rowData.tableData.id)
                          }
                          setSelectedRows({ ...selectedRows, 'table1': tb })
                        }
                        else {
                          props.history.push(`/challenge_details/${btoa(encodeURIComponent(rowData.key))}`)
                        }
                      }}
                      title={
                        <div
                          className="d-flex flex-row"
                          style={{ fontFamily: "cnam-bold-ar", fontSize: '1.15rem', width: "70vw" }}
                        >
                          <div className="mb-2 mb-md-0">
                            {status !== undefined ? status + ' التحديات' : " طلبات التحديات"} (&nbsp; {counters.challenge})
                          </div>

                          <span
                            className="mr-1 p-2 py-1 pointer"
                            style={{
                              height: "fit-content",
                              border: "none",
                              backgroundColor: "rgb(198 2 36)",
                              color: "white",
                              fontSize: "0.85rem",
                              fontWeight: "500",
                              borderRadius: "5px",
                            }}
                            onClick={() => setExportModalState(true)}
                          >
                            تصدير سجلات
                          </span>
                        </div>
                      }
                      columns={cols}
                      data={rows.rows1}
                      options={{
                        pageSize: 10,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [10, 15, 20],
                        selection: true,
                        rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '', fontSize: '0.9rem' }),
                        paging: true,
                        headerStyle: {
                          fontSize: "12px",
                          backgroundColor: "#F7F7F7",
                          color: "#B3B3B3",
                          paddingTop: "3px",
                          paddingBottom: "3px",
                          whiteSpace: "nowrap",
                          fontFamily: 'cnam-ar',
                          textAlign: 'right'
                        },

                      }}

                      actions={[
                        {
                          tooltip: 'تحميل csv.',
                          icon: () => <button style={{ background: 'none', borderRadius: "4px", border: '1px solid lightgrey', fontFamily: 'cnam-bold-ar' }}><img src={csv} alt="" style={{ width: '20px' }} /><span style={{ fontSize: "13px" }}> تحميل <span style={{ fontFamily: 'cnam' }}>csv</span>.</span></button>,
                          onClick: (evt, data) => exportTable(data, 'challenge', 'csv')
                        },
                        {
                          tooltip: 'تحميل As PDF.',
                          icon: () => <button style={{ background: 'none', borderRadius: "4px", border: '1px solid lightgrey', fontFamily: 'cnam-bold-ar' }}><img src={pdf} alt="" style={{ width: '20px' }} /><span style={{ fontSize: "13px" }}> تحميل <span style={{ fontFamily: 'cnam' }}>PDF</span>.</span></button>,
                          onClick: (evt, data) => exportTable(data, 'challenge', 'pdf')
                        }
                      ]}
                    />
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </>
  );
}

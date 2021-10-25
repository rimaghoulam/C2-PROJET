import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import { WS_LINK, } from "../../globals";
import { formatDate } from '../../functions'
import { getSessionInfo, clearSessionInfo } from "../../variable";

import InputText from "../../components/InputText/InputText";
import Table from "../../components/Table/Table"
import FilterModal from '../../components/PageModals/adminEmailFilterModal'

import { toast } from 'react-toastify'

import Logo from "../../assets/images_png/header_logo.png";
import challenge_icon from "../../assets/images_png/challenge_icon.png"

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";

import "../Common/login/Login.css";
import "../../App.css";

export default function AdminEmailFiltering(props) {



  /////////// STATES

  const [loggedIn, setLoggedIn] = useState(false) // to show either input sor table


  const [tableData, setTableData] = useState({ // data to fill table with
    cols: [
      {
        title: "Job Name", field: "job",
        render: rowData => (<>
          <div className="d-flex" >
            <div>
              <img src={challenge_icon} alt="intern" style={challengeStyle} />
            </div>
            <span className="pt-2 ml-1">{rowData.job.jobName}</span>
          </div>
        </>),
        customFilterAndSearch: (term, rowData) => (rowData.job.jobName).indexOf(term) !== -1
      },
      { title: "Original Message", field: "message" },
      { title: "Reply Message", field: "reply" },
      { title: "Sender Email", field: "sender" },
      { title: "Date", field: "date", defaultSort: 'desc' },
      {
        title: "Actions", field: "actions", render: rowData => <Button color="success"
          onClick={() => {
            handleModalData(rowData.actions.jobTitle, rowData.actions.originalMessage, rowData.actions.replyFrom, rowData.actions.replyDate, rowData.actions.replyMessage, rowData.actions.jobId, rowData.actions.senderId, rowData.actions.replyId, rowData.actions.rowId, rowData.actions.emailNumber)
            handleModalState()
          }}
        > Approve message </Button>
      },
    ],
    rows: []
  })


  const [modalState, setModalState] = useState(false) // modal open or closed

  const [modalData, setModalData] = useState({ // values to show in modal
    jobTitle: '',
    originalMessage: '',
    replyFrom: '',
    replyDate: '',
    replyMessage: '',
    jobId: '',
    senderId: '',
    replyId: '',
    rowId: '',
    emailNumber: ''
  })


  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })






  ////////////// SET STATE

  const handleModalState = () => {
    setModalState(!modalState)
  }


  const handleModalData = (jobTitle, originalMessage, replyFrom, replyDate, replyMessage, jobId, senderId, replyId, rowId, emailNumber) => {
    setModalData({
      jobTitle: jobTitle,
      originalMessage: originalMessage,
      replyFrom: replyFrom,
      replyDate: replyDate,
      replyMessage: replyMessage,
      jobId: jobId,
      senderId: senderId,
      replyId: replyId,
      rowId: rowId,
      emailNumber: emailNumber
    })
  }

  useEffect(() => {
    props.setPageTitle('Email Filtering', 'تصفية البريد الإلكتروني')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleDeleteRow = rowId => {

    let newRows = []
    for (let i = 0; i < tableData.rows.length; i++) {
      if (tableData.rows[i].job.rowId !== rowId) newRows.push(tableData.rows[i])
    }

    setTableData({ ...tableData, rows: newRows })
    setModalData({
      jobTitle: '',
      originalMessage: '',
      replyFrom: '',
      replyDate: '',
      replyMessage: '',
      jobId: '',
      senderId: '',
      replyId: '',
      rowId: ''
    })
  }

  /////////////////// FORM AUTHENTICATION

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });




  ///////////// LOGIN FUNCTION TO FILTER 

  const onSubmit = (data) => {

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const postedData = {
      email: data.email,
      pass: data.password,
    };
    setCredentials({ email: data.email, password: data.password })

    props.toggleSpinner(true);

    axios({
      method: "post",
      url: `${WS_LINK}emails_filtering`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {

        switch (res.data) {
          case 'token error': //
            clearSessionInfo()
            window.location.reload(false).then(props.history.replace('/'))
            break
          case 'not ok': //
            toast.error('Not Ok', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              // style: { textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }
            })
            break
          case 'no reply found': //
          case 'no emails found': //
            setLoggedIn(true)
            break
          default: //
            try {
              const rows = []
              for (let i = 0; i < res.data.length; i++) {
                rows.push({
                  job: { jobName: res.data[i][6], rowId: i },
                  message: res.data[i][0].length > 150 ? res.data[i][0].substring(0, 147) + ' ...' : res.data[i][0],
                  reply: res.data[i][1].length > 150 ? res.data[i][1].substring(0, 147) + ' ...' : res.data[i][1],
                  sender: res.data[i][4],
                  date: formatDate(res.data[i][7]),
                  actions: { jobTitle: res.data[i][6], originalMessage: res.data[i][0], replyFrom: res.data[i][4], replyDate: formatDate(res.data[i][7]), replyMessage: res.data[i][1], jobId: res.data[i][5], senderId: res.data[i][3], replyId: res.data[i][2], rowId: i, emailNumber: res.data[i][8] }
                })
              }
              setTableData({
                ...tableData,
                rows: rows
              })
              setLoggedIn(true)
            }
            catch (e) {
              console.log(e)
              props.history.replace('/')
            }
            break
        }
        props.toggleSpinner(false)
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


  //////////////////// Styles
  const challengeStyle = {
    background: '#ccf0eb',
    borderRadius: '11%',
    width: '40px',
    height: '40px',
    padding: '5px'
  }





  // * /////////////////////////////////////////////////////////////////

  return (
    <div className="w-100" style={{ direction: 'ltr' }}>
      {modalState &&
        <FilterModal
          modalState={modalState}
          handleModalState={handleModalState}
          jobTitle={modalData.jobTitle}
          originalMessage={modalData.originalMessage}
          replyFrom={modalData.replyFrom}
          replyDate={modalData.replyDate}
          replyMessage={modalData.replyMessage}
          jobId={modalData.jobId}
          senderId={modalData.senderId}
          replyId={modalData.replyId}
          rowId={modalData.rowId}
          emailNumber={modalData.emailNumber}
          toggleSpinner={props.toggleSpinner}
          deleteRow={handleDeleteRow}
          email={credentials.email}
          password={credentials.password}
        />
      }

      {/* /////////////////////////////////////////////////////// */}
      {!loggedIn ? <>
        <div className="row justify-content-center hide_scrollbar">
          <div className="col-12 col-md-8 col-lg-7 px-5 px-md-2 px-lg-0" style={{ marginTop: '7rem' }}>
            <div className=" col-12 text-center" >
              <img className="logoSmall col-11 col-md-8 col-lg-6 " src={Logo} alt="LOGO" style={{ maxHeight: '100px' }} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="d-flex justify-content-center" style={{ maxHeight: '80px' }}>
                <div
                  className="d-flex inputText justify-content-between w_shadow groupfocusinput"
                  style={{
                    alignItems: "center",
                    border: errors.email ? "1px solid red" : "1px solid #ced4da",
                    borderRadius: ".25rem",
                    width: "80%",
                    boxShadow: "0px 0.8px 4px -2px #888888",
                  }}
                >
                  <Controller
                    render={({ field: { onChange, value } }) => (
                      <>
                        <InputText
                          value={value || ""}
                          onChange={onChange}
                          placeholder="Email"
                          className="form-control no_shadow"
                          style={{ flex: "1", border: "none" }}
                        />
                        <div style={{ paddingRight: ".75rem" }}>
                          {" "}
                          <AccountCircleIcon
                            style={{ color: "rgb(198 2 36)", fontSize: "15px" }}
                          />
                        </div>
                      </>
                    )}
                    rules={{
                      required: true,
                      pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    }}
                    name="email"
                    control={control}
                  />
                </div>
              </div>
              <div className="d-flex">
                {errors.email && errors.email.type === "required" && (
                  <span className="errors ml-5 pl-4">Email is required.</span>
                )}
                {errors.email && errors.email.type === "pattern" && (
                  <span className="errors ml-5 pl-4">Email is not valid.</span>
                )}
              </div>

              <div className="d-flex justify-content-center" style={{ maxHeight: '80px' }}>
                <div
                  className="d-flex inputText justify-content-between w_shadow groupfocusinput"
                  style={{
                    alignItems: "center",
                    border: errors.password
                      ? "1px solid red"
                      : "1px solid #ced4da",
                    borderRadius: ".25rem",
                    width: "80%",
                    boxShadow: "0px 1px 5px -2px #888888",
                  }}
                >
                  <Controller
                    render={({ field: { onChange, value } }) => (
                      <>
                        <InputText
                          value={value}
                          type="password"
                          onChange={onChange}
                          placeholder="Password"
                          className="form-control no_shadow"
                          style={{ flex: "1", border: "none" }}
                        />
                        <div style={{ paddingRight: ".75rem" }}>
                          {" "}
                          <LockIcon
                            style={{ color: "rgb(198 2 36)", fontSize: "15px" }}
                          />{" "}
                        </div>
                      </>
                    )}
                    rules={{
                      required: true,
                    }}
                    name="password"
                    control={control}
                  />
                </div>
              </div>
              <div className="d-flex">
                {errors.password && errors.password.type === "required" && (
                  <span className="errors ml-5 pl-4">Password is required.</span>
                )}
              </div>

              <div
                className="d-flex mt-3 container pad-0"
                style={{ padding: "4% 9.5%" }}
              >
                <div
                  className="mt-2"
                  style={{
                    textDecoration: "underline",
                    color: "#e98300",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                ></div>
                <Button
                  // onClick={forgot_pass}
                  type="submit"
                  name="btn_login"
                  value="btn_login"
                  className="ml-auto"
                  style={{
                    background: "rgb(198 2 36)",
                    padding: "0.5rem 2rem",
                    border: "none",
                  }}
                >
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      </>
        :
        // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        <>
          <div className="col-12">
            <Table
              name="dashboard-table-1"
              title={
                <div
                  className=" text-nowrap ml-3 ml-md-0"
                  style={{ fontFamily: "cnam-bold", fontSize: '1.15rem' }}
                >
                  Email Filtering
                </div>
              }
              columns={tableData.cols}
              data={tableData.rows}

              options={{
                pageSize: 5,
                emptyRowsWhenPaging: false,
                pageSizeOptions: [5, 10, 15, 20],
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
                  direction: getSessionInfo('language') === 'arabic' && 'rtl'
                }
              }}
            />
          </div>
        </>
      }
    </div>
  );
}








  //       useEffect(() => {
  //   const Data = [["Original Message","Reply To Original Message\r\nMaroun Karam\r\nWeb Developer\r\n\r\nLebanon\r\nKaslik Chahwan Building. 1stfloor\r\n(M) +961 76 407 670\r\nwww.greynab.com |maroun.karam@greynab.com \r\n\r\nUntitled222Untitled12hubspot-1\r\nCONFIDENTIALITY NOTICE:The contents of this email message and any attachmen=\r\nts are intended solely for the addressee(s)and may contain confidential and=\r\n\/or privileged information and may be legally protected fromdisclosure. If =\r\nyou are not the intended recipient of this message or their agent, or if th=\r\nis messagehas been addressed to you in error, please immediately alert the =\r\nsender by reply email and thendelete this message and any attachments. If y=\r\nou are not the intended recipient, you are herebynotified that any use, dis=\r\nsemination, copying, or storage of this message or its attachments isstrict=\r\nly prohibited.\r\n\r\n\r\n"," 533",424,"maroun.karam@greynab.com","368"," challenge 1 ","Fri, 16 Jul 2021 10:35:36 +0300",8],["Original Message","Reply Roookoz\r\nMaroun Karam\r\nWeb Developer\r\n\r\nLebanon\r\nKaslik Chahwan Building. 1stfloor\r\n(M) +961 76 407 670\r\nwww.greynab.com |maroun.karam@greynab.com \r\n\r\nUntitled222Untitled12hubspot-1\r\nCONFIDENTIALITY NOTICE:The contents of this email message and any attachmen=\r\nts are intended solely for the addressee(s)and may contain confidential and=\r\n\/or privileged information and may be legally protected fromdisclosure. If =\r\nyou are not the intended recipient of this message or their agent, or if th=\r\nis messagehas been addressed to you in error, please immediately alert the =\r\nsender by reply email and thendelete this message and any attachments. If y=\r\nou are not the intended recipient, you are herebynotified that any use, dis=\r\nsemination, copying, or storage of this message or its attachments isstrict=\r\nly prohibited.\r\n\r\n\r\n"," 533",424,"maroun.karam@greynab.com","368"," challenge 1 ","Fri, 16 Jul 2021 13:36:53 +0300",9]]
  //   const rows = []
  //   for (let i = 0; i < Data.length; i++) {
  //     rows.push({
  //       job: { jobName: Data[i][6] , rowId: i},
  //       message: Data[i][0].length > 150 ? Data[i][0].substring(0, 147) + ' ...' : Data[i][0],
  //       reply: Data[i][1].length > 150 ? Data[i][1].substring(0, 147) + ' ...' : Data[i][1],
  //       sender: Data[i][4],
  //       date: formatDate(Data[i][7]),
  //       actions: { jobTitle: Data[i][6], originalMessage: Data[i][0], replyFrom: Data[i][4], replyDate: formatDate(Data[i][7]), replyMessage: Data[i][1] , jobId: Data[i][5], senderId: Data[i][3], replyId: Data[i][2], rowId: i}
  //     })
  //   }
  //   setTableData({
  //     ...tableData,
  //     rows: rows
  //   })
  //   setLoggedIn(true)
  // }, [])





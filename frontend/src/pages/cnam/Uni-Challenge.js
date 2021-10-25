import React, { useState, useEffect } from "react";
import axios from "axios";

import { getSessionInfo, clearSessionInfo } from "../../variable";
import { WS_LINK, } from "../../globals";
import { formatDate, toArabicDigits } from '../../functions'

import Table from "../../components/Table/Table";
import SmsIcon from "@material-ui/icons/Sms";

import challenge_icon from '../../assets/images_png/challenge_icon.png';

import "../../App.css";
import './cnamFlow.css'

export default function ChallengesTable(props) {



  ////////////// THE STATES

  const [challengeObj, setChallengeObj] = useState({ challenges: "" });

  const [loaded, setLoaded] = useState(false);

  const [tablePages, setTablePages] = useState(false)



  // to fetch data on page creation
  useEffect(() => {
    props.setPageTitle('Challenges', 'التحديات')
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
    };

    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${WS_LINK}get_cnam_challenge`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (getSessionInfo('role') === 1 && res.data !== "token error") {
          setChallengeObj({ challenges: res.data[0], comments: res.data[1] });
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





  // data used to fill rows

  const ticketName = (intern_title, intern_id) =>
    <div className="d-flex align-items-center ml-2">
      <div className={`${getSessionInfo('language') === 'arabic' && 'ml-2'}`}>
        <img src={challenge_icon} alt="intern" className="challengeIcon" />
      </div>
      <div className="ml-3">
        <div className="text-nowrap" style={{ fontSize: '0.9rem' }}>{intern_title}</div>
        <div style={{ color: "#848484", fontSize: '0.9rem' }}>ID: #{intern_id}</div>
      </div>
    </div>


  const Comment = (id) =>
    <div className="d-flex align-items-center" style={{ color: '#A2A2A2' }}>
      {getSessionInfo('language') === 'arabic' ? (
        <>
          <div><SmsIcon style={{ fontSize: "17px", color: '#e98300' }} /></div>
          <div className="ml-1" style={{ fontFamily: 'cnam-ar' }}>
            <div className="text-nowrap">( {challengeObj.comments[id] ? toArabicDigits(challengeObj.comments[id].toString()) : toArabicDigits('0')}) تعليق</div>
          </div>
        </>
      )
        :
        (
          <>
            <div><SmsIcon style={{ fontSize: "17px", color: '#e98300' }} /></div>
            <div className="ml-1">
              <div className="text-nowrap">({challengeObj.comments[id] ? challengeObj.comments[id] : 0}) Comment{challengeObj.comments[id] > 1 ? 's' : ''}</div>
            </div>
          </>
        )
      }
    </div>




  // data used to fill tables
  let cols = []
  getSessionInfo('language') === 'arabic' ?
    cols = [
      {
        title: " اسم التحدي", field: "ticketName",
        render: rowData => ticketName(rowData.ticketName.challenge_name, rowData.ticketName.job_id),
        customFilterAndSearch: (term, rowData) => (rowData.ticketName.challenge_name.toLowerCase()).indexOf(term.toLowerCase()) !== -1 || (rowData.ticketName.job_id.toString()).indexOf(term) !== -1,
        customSort: (a, b) => (a.ticketName.challenge_name.localeCompare(b.ticketName.challenge_name)),
      },
      { title: "تم استناد التحدي إلى", field: "assigned" },
      {
        title: "", field: "comments",
        customSort: (a, b) => (a.comments.props.children.props.children[1].props.children.props.children[1] - b.comments.props.children.props.children[1].props.children.props.children[1])
      },
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
        title: " CHALLENGE NAME",
        field: "ticketName",
        render: rowData => ticketName(rowData.ticketName.challenge_name, rowData.ticketName.job_id),
        customFilterAndSearch: (term, rowData) => (rowData.ticketName.challenge_name.toLowerCase()).indexOf(term.toLowerCase()) !== -1 || (rowData.ticketName.job_id.toString()).indexOf(term) !== -1,
        customSort: (a, b) => (a.ticketName.challenge_name.localeCompare(b.ticketName.challenge_name)),
      },
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

  let rows = [];
  if (challengeObj.challenges !== undefined) {
    if (challengeObj.challenges.length > 0) {
      rows = Object.values(challengeObj.challenges).map((item) => ({
        key: item.job_id,
        ticketName: { challenge_name: item.challenge_name, job_id: item.job_id },
        created: formatDate(item.created_date),
        assigned: getSessionInfo("name"),
        comments: Comment(item.job_id),
        status: { job_status: item.job_status }
      }));
    }
  }



  // to check for pagination or no
  if (challengeObj.challenges !== undefined) {
    if (!tablePages && challengeObj.challenges.length > 5) {
      setTablePages(true)
    }
    if (tablePages && challengeObj.challenges.length < 5) {
      setTablePages(false)
    }
  }





  return (
    <div className="main  hide_scrollbar" style={{ height: 'calc(100vh - 101px)', overflowY: 'scroll', background: "#fffdfc" }}>
      <div className={`${getSessionInfo('language') === 'arabic' && 'table-arabic'}`}>
        {loaded && (
          <Table
            name="Challenge-table"
            title={
              <div
                className=" text-nowrap ml-1 ml-md-0"
                style={{ fontFamily: "cnam-bold", fontSize: '1.15rem' }}
              >
                {getSessionInfo('language') === 'arabic' ?
                  `(${rows.length}) التحديات المقدمة `
                  :
                  `Challenges (${rows.length})`
                }
              </div>
            }
            columns={cols}
            data={rows}
            rowClick={(event, rowData) => {
              props.history.push(
                `/challenge_details/${btoa(encodeURIComponent(rowData.key))}`
              );
            }}
            options={{
              pageSize: 5,
              emptyRowsWhenPaging: false,
              pageSizeOptions: [5, 10],
              paging: true,
              //paging: tablePages,
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



import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { WS_LINK, } from "../../globals";
import { formatDate, downloadFile, toArabicDigits } from '../../functions'
import {
  getSessionInfo,
  clearSessionInfo,
} from "../../variable";

import { Button } from "reactstrap";
import { toast } from "react-toastify";

import TextArea from "../../components/Text-Area/TextArea";
import Comment from "../../components/Comment/Comment";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Clear from "@material-ui/icons/Clear";

import pdf from "../../assets/images_svg/pdf.svg";

import "./cnamFlow.css";


export default function UniDiscussion(props) {

  let { discId } = useParams();

  discId = decodeURIComponent(atob(discId));

  //* //////////////////////////////////////////////////// THE STATES

  const [loaded, setLoaded] = useState(false);

  const [challengedetail, setChallengedetail] = useState({
    details: [],
    documents: [],
    assigned: [],
  });

  const [privateDiscussion, setPrivateDiscussion] = useState("no");

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [retrievedMessages, setRetrievedMessages] = useState([]);

  const [commentSpinner, setcommentSpinner] = useState(false)

  const [discussionObj, setDiscussionObj] = useState({
    comment: '',
    file: {
      fileName: '',
      fileSend: '',
      event: ''
    },
  })


  //* //////////////////////////////////////////////////// SET STATE FUNCTIONS


  const handlePrivateChange = (val) => {
    if (val.target.checked) setPrivateDiscussion("yes");
    else setPrivateDiscussion("no");
  };


  const handleChange = (e) => {
    setDiscussionObj({ ...discussionObj, [e.target.name]: e.target.value })
  }


  //* //////////////////////////////////////////////////// FETCH ON PAGE CREATIONS

  useEffect(() => {
    props.setPageTitle('Discussion', 'المناقشات')
    getDiscussionDetails()
    getDiscussionMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // request to fetch challenge/internship data
  const getDiscussionDetails = () => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
      jobid: discId,
    };

    props.toggleSpinner(true);

    axios({
      method: "post",
      url: `${WS_LINK}get_job_details_byid`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (res.data !== "role error" && res.data !== "token error") {
          setChallengedetail({ details: res.data[0], documents: res.data[1], assigned: res.data[2] });
          setLoaded(true);
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


  // to get the comments for this discussion
  const getDiscussionMessages = () => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
      jobid: discId,
      private: "yes",
    };
    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${WS_LINK}get_job_discussion`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        setRetrievedMessages(res.data);


        props.toggleSpinner(false);
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



  //  ******************************************************* FUNCTIONS NEEDED

  const handleOnFileChange = (e) => {
    if (e.target.files.length > 0) {
      let images = e.target.files[0];
      let fd = new FormData();
      fd.append("file", images);
      setcommentSpinner(true);
      axios({
        method: "post",
        url: `${WS_LINK}upload_manage_image`,
        data: fd,
      })
        .then((res) => {
          if (res.data !== "error") {
            setDiscussionObj({
              ...discussionObj,
              'file': {
                fileSend: res.data,
                fileName: e.target.files[0].name,
                event: e
              },
            });
          }
          setcommentSpinner(false);
        })
        .catch((err) => {
          setcommentSpinner(false);
          if (axios.isCancel(err)) {
            console.log("request canceled");
          } else {
            console.log("request failed");
          }
        });
    }
  };


  const uploadFile = (e, comment_id) => {

    if (e.target.files.length > 0) {

      setButtonDisabled(true);

      let images = e.target.files[0];
      let fd = new FormData();
      fd.append("file", images);
      fd.append("fileName", images.name)
      fd.append("commentid", comment_id);
      fd.append("userid", getSessionInfo("id"));
      fd.append("token", getSessionInfo("token"));
      fd.append("jobid", discId);
      fd.append("isprivate", privateDiscussion);

      axios({
        method: "post",
        url: `${WS_LINK}post_discussion_attachment`,
        data: fd,
      }).then((res) => {
        let tempArr = retrievedMessages;
        tempArr.push(res.data[0]);
        setRetrievedMessages(tempArr);
        setButtonDisabled(false);
      });
    }
  };

  const postComment = (message, file, reply) => {

    if (file.length) {
      if (message.length) { // if message and file
        const postedData = {
          userid: getSessionInfo("id"),
          token: getSessionInfo("token"),
          msg: message,
          jobid: discId,
          reply: reply,
          isprivate: privateDiscussion,
        };

        const fileData = discussionObj.file.event
        makeComment(postedData, fileData)
      }
      else { // if file only
        uploadFile(discussionObj.file.event, 0)

        setDiscussionObj({
          'comment': '',
          'file': {
            'fileName': '',
            'fileSend': '',
            'event': ''
          },
        });
      }
    }
    else {
      if (message.length) { // if message only

        const postedData = {
          userid: getSessionInfo("id"),
          token: getSessionInfo("token"),
          msg: message,
          jobid: discId,
          reply: reply,
          isprivate: privateDiscussion,
        };

        const fileData = false

        makeComment(postedData, fileData)

      }
      else { // nothing entered

        toast.error('Message can\'t be empty', {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        })
      }
    }

  }

  const makeComment = (postedData, withFile) => {

    setButtonDisabled(true);

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    axios({
      method: "post",
      url: `${WS_LINK}post_comment`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {


        setDiscussionObj({
          'comment': '',
          'file': {
            'fileName': '',
            'fileSend': '',
            'event': ''
          },
        });



        let tempArr = retrievedMessages;
        tempArr.push(res.data[0]);
        setRetrievedMessages(tempArr);

        if (res.data[0].reply === 0 && retrievedMessages.length > 1) {
          document
            .getElementById("lastDiscussion")
            .scrollIntoView({ behavior: "smooth" });
        }

        document.getElementById("discussionPost").value = "";



        let commentid = tempArr[tempArr.length - 1].comment_id;
        let postCommentNotifMSG = res.data[0].message

        setButtonDisabled(false);



        //* ///////////// post comment notification
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        const postedData2 = {
          userid: getSessionInfo("id"),
          token: getSessionInfo("token"),
          msg: postCommentNotifMSG,
          message_id: commentid,
          jobid: discId,
          reply: postedData.reply,
          isprivate: privateDiscussion,
        };
        axios({
          method: "post",
          url: `${WS_LINK}post_comment_notifications`,
          data: postedData2,
          cancelToken: source.token,
        })
          .then((res) => {

          })
          .catch((err) => console.log(err));



        if (withFile) uploadFile(withFile, res.data[0].comment_id)
      })
      .catch((err) => {
        console.log(err)
        if (axios.isCancel(err)) {
          console.log("request canceled");
        } else {
          console.log("request failed");
        }
        setButtonDisabled(false);
      });
  }

  const clearFile = () => {
    setDiscussionObj({
      ...discussionObj, 'file': {
        'fileName': '',
        'fileSend': ''
      }
    })
  }


  // * ***********************************************************************************************************************************
  // * ********************************************** DISCUSSION MESSAGES ****************************************************************
  // * ***********************************************************************************************************************************

  const result = {};
  if (retrievedMessages.length) {
    for (let i = 0; i < retrievedMessages.length; i++) {
      // for (let i = retrievedMessages.length - 1; i > -1; i--) {

      if (!retrievedMessages[i].reply) {
        if (result[retrievedMessages[i].comment_id]) {
          result[retrievedMessages[i].comment_id].unshift(<Comment
            id={i === retrievedMessages.length - 1 && 'lastDiscussion'}
            comment_id={retrievedMessages[i].comment_id}
            user_name={retrievedMessages[i].user_name}
            message={retrievedMessages[i].message}
            isPrivate={retrievedMessages[i].is_private === 'yes' && true}
            date={retrievedMessages[i].created_date}
            isReply={false}
            buttonDisabled={buttonDisabled}
            uploadFile={uploadFile}
            postComment={postComment}
            comment_type={retrievedMessages[i].comment_type}
            file_name={retrievedMessages[i].file_name}
          />);
        }
        else {
          result[retrievedMessages[i].comment_id] = [<Comment
            id={i === retrievedMessages.length - 1 && 'lastDiscussion'}
            comment_id={retrievedMessages[i].comment_id}
            user_name={retrievedMessages[i].user_name}
            message={retrievedMessages[i].message}
            isPrivate={retrievedMessages[i].is_private === 'yes' && true}
            date={retrievedMessages[i].created_date}
            isReply={false}
            buttonDisabled={buttonDisabled}
            uploadFile={uploadFile}
            postComment={postComment}
            comment_type={retrievedMessages[i].comment_type}
            file_name={retrievedMessages[i].file_name}
          />];
        }
      }
      else {
        if (result[retrievedMessages[i].reply]) {
          result[retrievedMessages[i].reply].push(<Comment
            id={i === retrievedMessages.length - 1 && 'lastDiscussion'}
            comment_id={retrievedMessages[i].comment_id}
            user_name={retrievedMessages[i].user_name}
            message={retrievedMessages[i].message}
            isPrivate={retrievedMessages[i].is_private === 'yes' && true}
            date={retrievedMessages[i].created_date}
            isReply={true}
            comment_type={retrievedMessages[i].comment_type}
            file_name={retrievedMessages[i].file_name}
          />);
        }
        else {
          result[retrievedMessages[i].reply] = [<Comment
            id={i === retrievedMessages.length - 1 && 'lastDiscussion'}
            comment_id={retrievedMessages[i].comment_id}
            user_name={retrievedMessages[i].user_name}
            message={retrievedMessages[i].message}
            isPrivate={retrievedMessages[i].is_private === 'yes' && true}
            date={retrievedMessages[i].created_date}
            isReply={true}
            comment_type={retrievedMessages[i].comment_type}
            file_name={retrievedMessages[i].file_name}
          />];
        }
      }
    }
  }









  //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* //////////////////////////////////////////////////////ARABIC///////////////////////////////////////////////////////////
  //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      {loaded && (
        <>
          {getSessionInfo('language') === 'arabic' ?
            <>
              <div className="row BodyHeight w-100 discussionPage">
                <div className="col-lg-4 px-5 scroll-in-body custom_scrollbar">
                  <div
                    className="mt-4 back text-right"
                    style={{ color: "rgb(198 2 36)", fontFamily: 'cnam-bold-ar' }}
                    onClick={() => props.history.goBack()}
                  >
                    <ArrowBackIosIcon
                      style={{ fontSize: "10px", marginTop: "-2px", transform: 'rotate(180deg)' }}
                    />
                    عودة
                  </div>
                  <div className="mt-3 h4 font-weight-bold text-right">
                    {challengedetail.details[0].job_type === "challenge"
                      ? challengedetail.details[0].challenge_name
                      : challengedetail.details[0].internship_job_title}
                  </div>

                  <div className="mt-3 mb-1 text-right" style={{ fontWeight: "500" }}>
                    {challengedetail.details[0].job_type === "challenge"
                      ? (
                        <div className="d-flex flex-column justify-content-between">
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                          >
                            وصف التحدي
                          </div>
                          <div
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].challenge_description}
                          </div>
                          <hr />
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                          >
                            مقدم من
                          </div>
                          <div
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].user_name}
                          </div>
                          <br />
                          <hr />
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                          >
                            اسم المنشأة
                          </div>
                          <div
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].industry_details_company_name}
                          </div>
                        </div>
                      )
                      : (
                        <div className="d-flex flex-column justify-content-between">
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                          >
                            وصف التدريب الداخلي
                          </div>
                          <div
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].internship_brief_description}
                          </div>
                          <hr />
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                          >
                            مقدم من
                          </div>
                          <div
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].user_name}
                          </div>
                          <hr />
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}
                          >
                            اسم المنشأة
                          </div>
                          <div
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].industry_details_company_name}
                          </div>
                        </div>
                      )
                    }
                    <hr />
                  </div>

                  <p style={{ fontFamily: 'cnam-bold-ar' }} className="mb-0 text-right">قدمت بتاريخ </p>
                  <div
                    className="mb-3 text-right"
                    style={{ color: "#8E8E8E", fontWeight: "500", }}
                  >{formatDate(challengedetail.details[0].created_date)}
                  </div>
                  <hr />
                  <p style={{ fontFamily: 'cnam-bold-ar' }} className="text-right mb-0">تم استناد التحدي إلى </p>
                  {challengedetail.assigned.length !== 0 ? (
                    <>
                      <div
                        className="mb-3 text-right"
                        style={{ color: "#8E8E8E", fontWeight: "500" }}
                      >
                        {challengedetail.assigned[0].user_name}
                      </div>
                    </>
                  ) : (
                    <div
                      className="mb-3 text-right"
                      style={{ color: "#8E8E8E", fontWeight: "500" }}
                    >
                      Not assigned yet
                    </div>
                  )}
                  <hr />

                  {challengedetail.details[0].job_type === "challenge" && challengedetail.documents.length > 0 && (
                    <>
                      <div className="h6 font-weight-bold mb-3 text-right">
                      المستندات المخصصة لهذا التحدي 
                      </div>

                      {
                        challengedetail.documents.map((doc, index) =>
                          <div
                            className="mb-2 pointer text-right my-1"
                            style={{ fontWeight: "500" }}
                            onClick={() => downloadFile(doc.document_path, doc.document_name)}
                            key={doc.document_path}
                          >
                            <img
                              src={pdf}
                              alt="pdf"
                              style={{ width: "20px", marginBottom: "5px" }}
                              className="mr-2"
                            />
                            {doc.document_name}
                          </div>
                        )
                      }

                      <hr />{" "}
                    </>
                  )}
                </div>

                <div
                  className="col-lg-8 px-4"
                  style={{
                    display: "flex",
                    height: "auto",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    backgroundColor: "white",
                    boxShadow: "-4px 0px 10px 1px #DEDEDE",
                  }}
                >
                  <div id="Discussions" className="d-flex flex-column">
                    <div className="d-flex">
                      <div className="h6 mt-4 font-weight-bold" style={{ fontFamily: 'cnam-bold-ar' }} >
                        <span style={{ fontFamily: 'cnam-ar' }}>مناقشات</span> - ( {retrievedMessages && toArabicDigits(retrievedMessages.length.toString())} <span style={{ fontFamily: 'cnam-ar' }}>تعليقات</span> )
                      </div>
                    </div>

                    <div
                      className="mt-3 custom_scrollbar remove_customscroll_mobile"
                      style={{
                        overflowY: "auto",
                        height: "calc(100vh - 30.3em)",
                      }}
                    >
                      {Object.keys(result).map(id => result[id])}
                    </div>
                  </div>
                  <div
                    style={{
                      boxShadow: "rgb(0 0 0 / 50%) 0px -6px 6px -7px",
                    }}
                  >
                    <div className="d-flex align-items-center mt-3 mr-1">
                      <input
                        type="checkbox"
                        defaultChecked={
                          privateDiscussion === "yes" && privateDiscussion
                        }
                        onChange={(val) => handlePrivateChange(val)}
                        style={{ zoom: "1.2" }}
                      />
                      <span style={{ fontFamily: 'cnam-ar' }} className="mr-2">إرسال رسالة خاصة</span>
                      <span className="mr-auto ml-2 pointer"><div className="mr-3 pointer" style={{ fontWeight: "500" }}>
                        <input
                          type="file"
                          id={`file-post`}
                          // accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleOnFileChange(e)
                          }
                        />
                        <label
                          htmlFor={`file-post`}
                          className="pointer"
                          style={{ fontFamily: 'cnam-ar' }}
                        >
                          <AttachFileIcon />
                          {commentSpinner ? (
                            <div className="spinner-border spinner-border-sm text-muted ml-3"></div>
                          )
                            :
                            !(discussionObj.file && discussionObj.file.fileName !== '') && 'يربط'
                          }

                        </label>
                        {!commentSpinner && discussionObj.file && discussionObj.file.fileName.length > 0 &&
                          <>
                            <span onClick={() => downloadFile(discussionObj.file.fileSend, discussionObj.file.fileName)} className='pointer'>{discussionObj.file.fileName.length > 50 ? discussionObj.file.fileName.substring(0, 45) + ' ...' : discussionObj.file.fileName}</span>
                            <Clear className="pointer" onClick={clearFile} />
                          </>
                        }
                      </div>
                      </span>
                    </div>

                    <TextArea
                      id="discussionPost"
                      name="comment"
                      value={discussionObj.value}
                      placeholder="اكتب مشاركة ..."
                      className="container mt-3"
                      minRows={4}
                      maxRows={5}
                      onChange={handleChange}
                      style={{
                        resize: "none",
                        padding: "15px",
                        border: "1px solid lightgrey",
                        borderRadius: "5px",
                        boxShadow: "-1px 1px 1px 0px #e0e0e0",
                        maxWidth: "100%",
                      }}
                    />
                    <div className="d-flex">
                      <Button
                        disabled={buttonDisabled}
                        id={0}
                        className="pt-2 px-3 mt-3 mr-auto"
                        onClick={e => postComment(discussionObj.comment, discussionObj.file.fileSend, 0)}
                        style={{
                          fontWeight: "600",
                          background: "none",
                          padding: "0.7rem 2.4rem",
                          border: "none",
                          color: "rgb(198 2 36)",
                          fontFamily: 'cnam-bold-ar'
                        }}
                      >
                        إرسال
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
            :


            //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //* ///////////////////////////////////////////////////////ENGLISH/////////////////////////////////////////////////////////
            //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            <>
              <div className="row BodyHeight w-100 discussionPage">
                <div className="col-lg-4 px-5 scroll-in-body custom_scrollbar">
                  <div
                    className="mt-4 back"
                    style={{ color: "rgb(198 2 36)" }}
                    onClick={() => props.history.goBack()}
                  >
                    <ArrowBackIosIcon
                      style={{ fontSize: "10px", marginTop: "-2px" }}
                    />
                    Back
                  </div>

                  <div className="mt-3 h4 font-weight-bold ">
                    {challengedetail.details[0].job_type === "challenge"
                      ? challengedetail.details[0].challenge_name
                      : challengedetail.details[0].internship_job_title}
                  </div>

                  <div className="mt-3 mb-2" style={{ fontWeight: "500" }}>

                    {challengedetail.details[0].job_type === "challenge"

                      ? // challenge 
                      (
                        <div className="d-flex flex-column justify-content-between">
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                          >
                            Challenge Description
                          </div>
                          <div
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].challenge_description}
                          </div>
                          <hr />
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                          >
                            Submitted By
                          </div>
                          <div
                            className=""
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].user_name}
                          </div>
                          <hr />
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                          >
                            Company Name
                          </div>
                          <div
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].industry_details_company_name}
                          </div>
                        </div>
                      )
                      :
                      // internship
                      (
                        <div className="d-flex flex-column justify-content-between">
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                          >
                            Internship Description
                          </div>
                          <div
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].internship_brief_description}
                          </div>
                          <hr />
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                          >
                            Submitted By
                          </div>
                          <div
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].user_name}
                          </div>
                          <hr />
                          <div
                            style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}
                          >
                            Company Name
                          </div>
                          <div
                            className=""
                            style={{ color: "#6E6259", fontSize: "0.95rem" }}
                          >
                            {challengedetail.details[0].industry_details_company_name}
                          </div>
                        </div>
                      )
                    }
                    <hr />
                  </div>

                  <p style={{ fontWeight: 'bold' }} className="mb-0">Submitted</p>

                  <div
                    style={{ color: "#8E8E8E", fontWeight: "500" }}
                  >
                    {formatDate(challengedetail.details[0].created_date)}
                  </div>
                  <hr />

                  <p style={{ fontWeight: 'bold' }} className="mb-0"> Assigned to</p>
                  {challengedetail.assigned.length !== 0 ? (
                    <>

                      <div
                        style={{ color: "#8E8E8E", fontWeight: "500" }}
                      >
                        {challengedetail.assigned[0].user_name}
                      </div>
                    </>
                  ) : (
                    <div
                      className="mb-3"
                      style={{ color: "#8E8E8E", fontWeight: "500" }}
                    >
                      Not assigned yet
                    </div>
                  )}
                  <hr />

                  {challengedetail.details[0].job_type === "challenge" && challengedetail.documents.length > 0 && (
                    <>
                      <div className="h6 font-weight-bold mb-3">
                        Supporting documents
                      </div>

                      {
                        challengedetail.documents.map((doc, index) =>
                          <div
                            className="mb-2 pointer"
                            style={{ fontWeight: "500" }}
                            onClick={() => downloadFile(doc.document_path, doc.document_name)}
                            key={doc.document_path}
                          >
                            <img
                              src={pdf}
                              alt="pdf"
                              style={{ width: "20px", marginBottom: "5px" }}
                              className="mr-2"
                            />
                            {doc.document_name}
                          </div>
                        )
                      }

                      <hr />{" "}
                    </>
                  )}
                </div>

                <div
                  className="col-lg-8 px-4"
                  style={{
                    display: "flex",
                    height: "auto",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    backgroundColor: "white",
                    boxShadow: "-4px 0px 10px 1px #DEDEDE",
                  }}
                >
                  <div id="Discussions" className="d-flex flex-column">
                    <div className="d-flex">
                      <div className="h6 mt-4 font-weight-bold">
                        Discussions - (
                        {retrievedMessages && retrievedMessages.length} comment{retrievedMessages.length > 1 ? 's' : ''})
                      </div>
                    </div>

                    <div
                      className="mt-3 custom_scrollbar remove_customscroll_mobile"
                      style={{
                        overflowY: "auto",
                        height: "calc(100vh - 30.3em)",
                      }}
                    >


                      {Object.keys(result).map(id => result[id])}

                    </div>
                  </div>
                  <div
                    style={{
                      boxShadow: "rgb(0 0 0 / 50%) 0px -6px 6px -7px"
                    }}
                  >
                    <div className="row w-100 mt-3">
                      <span className="col-12 col-lg-6 ml-1 ml-lg-0">
                        <input
                          type="checkbox"
                          defaultChecked={
                            privateDiscussion === "yes" && privateDiscussion
                          }
                          onChange={(val) => handlePrivateChange(val)}
                          style={{ zoom: "1.2" }}
                          className="mt-1"
                        />
                        <span className="ml-1" style={{ marginTop: '2px' }}>send a Private message</span>
                      </span>


                      <span className="col-12 col-lg-6 pointer text-left text-lg-right"><div className=" pointer" style={{ fontWeight: "500" }}>
                        <input
                          type="file"
                          id={`file-post`}
                          // accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleOnFileChange(e)
                          }
                        />
                        <label
                          htmlFor={`file-post`}
                          className="pointer"
                          style={{ fontFamily: 'cnam' }}
                        >
                          <AttachFileIcon />
                          {commentSpinner ? (
                            <div className="spinner-border spinner-border-sm text-muted ml-3"></div>
                          )
                            :
                            !(discussionObj.file && discussionObj.file.fileName !== '') && 'Attach'
                          }

                        </label>
                        {!commentSpinner && discussionObj.file && discussionObj.file.fileName.length > 0 &&
                          <>
                            <span onClick={() => downloadFile(discussionObj.file.fileSend, discussionObj.file.fileName)} className='pointer'>{discussionObj.file.fileName.length > 50 ? discussionObj.file.fileName.substring(0, 45) + ' ...' : discussionObj.file.fileName}</span>
                            <Clear className="pointer" onClick={clearFile} />
                          </>
                        }
                      </div>
                      </span>
                    </div>
                    <TextArea
                      id="discussionPost"
                      name="comment"
                      value={discussionObj.value}
                      placeholder="Write a post..."
                      className="container mt-3"
                      minRows={4}
                      maxRows={5}
                      onChange={handleChange}
                      style={{
                        resize: "none",
                        padding: "15px",
                        border: "1px solid lightgrey",
                        borderRadius: "5px",
                        boxShadow: "-1px 1px 1px 0px #e0e0e0",
                        maxWidth: "100%",
                      }}
                    />
                    <div className="d-flex">
                      <Button
                        disabled={buttonDisabled}
                        id={0}
                        className="pt-2 px-3 mt-3 ml-auto"
                        onClick={e => postComment(discussionObj.comment, discussionObj.file.fileSend, 0)}
                        style={{
                          fontWeight: "600",
                          background: "none",
                          padding: "0.7rem 2.4rem",
                          border: "none",
                          color: "rgb(198 2 36)",
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>}

        </>
      )}
    </>
  );
}
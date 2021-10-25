/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
// import Echo from "laravel-echo";

import { WS_LINK, } from "../../globals";
import { downloadFile } from '../../functions'
import {
  getSessionInfo,
  // setSessionInfo,
  clearSessionInfo,
} from "../../variable";


import AttachFileIcon from "@material-ui/icons/AttachFile";
import Clear from "@material-ui/icons/Clear";

import TextArea from "../../components/Text-Area/TextArea";
import Comment from "../../components/Comment/Comment";

import { toast } from "react-toastify";

import internship_icon from "../../assets/images_png/internship_icon.png";
import challenge_icon from '../../assets/images_png/challenge_icon.png';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import "./admin-Challenge-discussions.css";
import "./AdminDiscussionTable.css";

export default function AdminDiscussion(props) {



  const internshipStyle = {
    background: "#fbe6cc",
    borderRadius: "11%",
    width: "40px",
    height: "40px",
    padding: "5px",
  };
  const challengeStyle = {
    background: "#ccf0eb",
    borderRadius: "11%",
    width: "40px",
    height: "40px",
    padding: "5px",
  };

  let { company_id, type } = useParams();
  company_id = decodeURIComponent(atob(company_id));

  // * *********************************************************** THE STATES
  const [tempid, setTempid] = useState();

  const [discussionObj, setDiscussionObj] = useState({
    comment: '',
    file: {
      fileName: '',
      fileSend: '',
      event: ''
    },
  })

  const [loaded, setLoaded] = useState(false);

  const [commentSpinner, setcommentSpinner] = useState(false);

  const [hidden, setHidden] = useState(true);

  const [privateDiscussion, setPrivateDiscussion] = useState("no");

  const [prevDivClicked, setPrevDivClicked] = useState("");

  const [jobdetail, setJobdetail] = useState({
    challenges: [],
    internships: [],
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [retrievedMessages, setRetrievedMessages] = useState([]);

  // **********************************************  SET STATE FUNCTIONS
  const handleChange = (e) => {
    setDiscussionObj({ ...discussionObj, [e.target.name]: e.target.value })
  }
  const changeClassColor = (id) => {
    if (prevDivClicked !== "")
      document.getElementById(prevDivClicked).classList.remove("green");
    setPrevDivClicked(id);
  };

  const handlePrivateChange = (val) => {
    if (val.target.checked) setPrivateDiscussion("yes");
    else setPrivateDiscussion("no");
  };

  // * ***********************************  FETCH ON PAGE CREATIONS

  useEffect(() => {
    props.setPageTitle('Industry Discussion', 'Industry Discussion')
    get_request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //* ************* get discussion by id
  const get_discussion = (id) => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const postedData2 = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
      jobid: id,
      private: "yes",
    };
    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${WS_LINK}get_job_discussion`,
      data: postedData2,
      cancelToken: source.token,
    })
      .then((res) => {
        props.toggleSpinner(false);
        setHidden(false);
        setRetrievedMessages(res.data);
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

  //get all jobs
  // request to fetch challenge/internship data
  const get_request = () => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
      type_of_id: type,
      entity_id: company_id,
    };
    props.toggleSpinner(true);
    axios({
      method: "post",
      url: `${WS_LINK}get_jobs_by_admin`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (res.data !== "role error" && res.data !== "token error") {
          props.toggleSpinner(false);

          setJobdetail({ internships: res.data[0], challenges: res.data[1] });
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

  // * ************************* FUNCTIONS NEEDED


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
      fd.append("jobid", tempid);
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
          jobid: tempid,
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
          jobid: tempid,
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

        let tempArr = retrievedMessages;
        tempArr.push(res.data[0]);
        setRetrievedMessages(tempArr);

        setDiscussionObj({
          'comment': '',
          'file': {
            'fileName': '',
            'fileSend': '',
            'event': ''
          },
        });
        if (res.data[0].reply === 0 && retrievedMessages.length > 1)
          document
            .getElementById("lastDiscussion")
            .scrollIntoView({ behavior: "smooth" });

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
          jobid: tempid,
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









  return (
    <>
      {
        getSessionInfo('language') === 'english' ?
          (
            <>
              <div className="row BodyHeight w-100">
                <div className="col-lg-4 pr-0 mr-0 scroll-in-body custom_scrollbar">

                  <div
                    style={{
                      borderRadius: "5px",
                    }}
                  >
                    <div className="mt-4">
                      <div className=" mb-2 back ml-1" style={{ color: 'rgb(198 2 36)' }} onClick={() => props.history.goBack()}><ArrowBackIosIcon style={{ fontSize: '13px', marginTop: "-2px" }} />Back</div>
                      {loaded &&
                        jobdetail.challenges.length === 0 &&
                        jobdetail.internships.length === 0 ? (
                        <div>
                          <div style={{ textAlign: "center" }}>
                            {" "}
                            This User doesn't have Challenges or Internships
                          </div>
                        </div>
                      ) : (
                        jobdetail.challenges.map((item) => {
                          return (
                            <>
                              <div
                                className="pointer py-3 w-100"
                                id={item.job_id}
                                onClick={(e) => {
                                  changeClassColor(e.currentTarget.id);
                                  get_discussion(item.job_id);
                                  setTempid(item.job_id);
                                  e.currentTarget.classList.add("green");
                                }}
                              >
                                <div className="d-flex align-items-center ml-2 ">
                                  <img
                                    src={challenge_icon}
                                    alt="intern"
                                    style={challengeStyle}
                                  />

                                  <div
                                    className="text-nowrap ml-1"
                                    style={{ fontSize: "1rem" }}
                                  >
                                    {item.challenge_name}
                                  </div>
                                </div>
                              </div>
                              <hr />
                            </>
                          );
                        })
                      )}
                    </div>

                    <div className="">
                      {jobdetail.internships.map((item) => {
                        return (
                          <>
                            <div
                              className="py-3 pointer w-100"
                              id={item.job_id}
                              onClick={(e) => {
                                changeClassColor(e.currentTarget.id);
                                e.currentTarget.classList.add("green");
                                get_discussion(item.job_id);
                                setTempid(item.job_id);
                              }}
                            >
                              <div className="d-flex align-items-center ml-2">
                                <div>
                                  <img
                                    src={internship_icon}
                                    alt="intern"
                                    style={internshipStyle}
                                  />
                                </div>
                                <div className="ml-1">
                                  <div
                                    className="text-nowrap"
                                    style={{ fontSize: "1rem" }}
                                  >
                                    {item.internship_job_title}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr />
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-8 px-4"
                  style={{
                    display: "flex",
                    justifyContent: "",
                    flexDirection: "column",
                    boxShadow: "-4px 0px 10px 1px #DEDEDE",
                  }}
                >
                  {!hidden ? (
                    <>
                      <div id="Discussions" className="d-flex flex-column">
                        <div className="d-flex">
                          <div className="h6 mt-4 font-weight-bold">
                            Discussions - (
                            {retrievedMessages && retrievedMessages.length}{" "}
                            comment{retrievedMessages.length > 1 ? 's' : ''})
                          </div>
                        </div>

                        <div
                          className="mt-4 "
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
                        <div className="d-flex flex-sm-row flex-column justify-content-between mb-2 w-100 mt-2">
                          <div className="d-flex align-items-center ml-1">
                            <input
                              type="checkbox"
                              defaultChecked={
                                privateDiscussion === "yes" && privateDiscussion
                              }
                              onChange={(val) => handlePrivateChange(val)}
                              style={{ zoom: "1.2" }}
                              className=""
                            />
                            <span className="" style={{ marginLeft: '7px' }}>send a Private message</span>
                          </div>


                          <div className="mr-2 pointer mt-sm-0 mt-1"><div className="ml-1 pointer" style={{ fontWeight: "500" }}>
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
                              className="pointer mb-0"
                              style={{ fontFamily: 'cnam' }}
                            >
                              <AttachFileIcon />
                              {commentSpinner ? (
                                <div className="spinner-border spinner-border-sm text-muted ml-1"></div>
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
                          </div>
                        </div>
                        <TextArea
                          id="discussionPost"
                          name="comment"
                          value={discussionObj.value}
                          placeholder="Write a post..."
                          className="container"
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
                    </>
                  ) : (
                    <>
                      <div className="ml-2 mr-2 row">
                        <div className="col-12 h6 mt-4 mb-3 font-weight-bold">
                          Discussions
                        </div>
                        <div classname="col-12 mt-5 mb-4">
                          Please select a challenge or internship to discuss.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )

          :

          // * **************************************************************************
          // ARABIC

          (
            <div style={{ fontFamily: 'cnam-ar', textAlign: 'right' }} className="w-100">
              {
                <div className="row BodyHeight">
                  <div className="col-lg-4 px-4 scroll-in-body custom_scrollbar">

                    <div
                      style={{
                        borderRadius: "5px"
                      }}
                    >
                      <div className="mt-4">
                        <div className=" mb-2 back text-right mr-2" style={{ color: 'rgb(198 2 36)', fontFamily: 'cnam-ar' }} onClick={() => props.history.goBack()}><ArrowBackIosIcon className="ml-1" style={{ fontSize: '13px', marginTop: "-2px", transform: 'rotate(180deg)' }} />إرجع</div>
                        {loaded &&
                          jobdetail.challenges.length === 0 &&
                          jobdetail.internships.length === 0 ? (
                          <div>
                            <div style={{ textAlign: "center" }}>
                              {" "}
                              هذا المستخدم ليس لديه تحديات أو تدريب
                            </div>
                          </div>
                        ) : (
                          jobdetail.challenges.map((item) => {
                            return (
                              <>
                                <div
                                  className="pointer py-3 w-100"
                                  id={item.job_id}
                                  onClick={(e) => {
                                    changeClassColor(e.currentTarget.id);
                                    get_discussion(item.job_id);
                                    setTempid(item.job_id);
                                    e.currentTarget.classList.add("green");
                                  }}
                                >
                                  <div className="d-flex align-items-center mr-2 ">
                                    <img
                                      src={challenge_icon}
                                      alt="intern"
                                      style={challengeStyle}
                                    />

                                    <div
                                      className="text-nowrap mr-1"
                                      style={{ fontSize: "1rem" }}
                                    >
                                      {item.challenge_name}
                                    </div>
                                  </div>
                                </div>
                                <hr />
                              </>
                            );
                          })
                        )}
                      </div>

                      <div>
                        {jobdetail.internships.map((item) => {
                          return (
                            <>
                              <div
                                className="py-3 pointer w-100"
                                id={item.job_id}
                                onClick={(e) => {
                                  changeClassColor(e.currentTarget.id);
                                  e.currentTarget.classList.add("green");
                                  get_discussion(item.job_id);
                                  setTempid(item.job_id);
                                }}
                              >
                                <div className="d-flex align-items-center mr-2">
                                  <div>
                                    <img
                                      src={internship_icon}
                                      alt="intern"
                                      style={internshipStyle}
                                    />
                                  </div>
                                  <div className="mr-1">
                                    <div
                                      className="text-nowrap"
                                      style={{ fontSize: "1rem" }}
                                    >
                                      {item.internship_job_title}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr />
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-lg-8 px-4"
                    style={{
                      display: "flex",
                      justifyContent: "",
                      flexDirection: "column",
                      backgroundColor: "white",
                      boxShadow: "-4px 0px 10px 1px #DEDEDE",
                    }}
                  >
                    {!hidden ? (
                      <>
                        <div id="Discussions" className="d-flex flex-column">
                          <div className="d-flex">
                            <div className="h6 mt-4" style={{ fontFamily: 'cnam-bold-ar' }}>
                              مناقشات - (
                              {" "}{retrievedMessages && retrievedMessages.length}{" "}
                              تعليقات)
                            </div>
                          </div>

                          <div
                            className="mt-4 "
                            style={{
                              overflowY: "auto",
                              height:
                                "calc(100vh - 30.3em)",
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
                            <span className="mr-auto ml-2 pointer"><div className="ml-1 pointer" style={{ fontWeight: "500" }}>
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
                                  <div className="spinner-border spinner-border-sm text-muted ml-1"></div>
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
                      </>
                    ) : (
                      <>
                        <div className="mr-2 ml-2 row">
                          <div className="col-12 h6 mt-4 mb-3 pr-0" style={{ fontFamily: 'cnam-bold-ar' }}>
                            مناقشات
                          </div>
                          <div classname="col-12 mt-5 mb-4">
                            يرجى اختيار تحد أو تدريب مناقشة.
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                //  )
              }
            </div>
          )
      }
    </>
  );
}

// challengedetail[0].challenges[0].job_type && console.log(challengedetail[0].challenges[0].job_type)

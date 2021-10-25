import React, {useState} from "react";
import axios from "axios";
// import { useForm, Controller } from "react-hook-form";

import { WS_LINK } from "../../globals";
import { getSessionInfo, clearSessionInfo } from "../../variable";

import TextArea from "../Text-Area/TextArea";
import Modal from "../../components/Modal/Modal";

import InputText from "../InputText/InputText";

import { Button } from 'reactstrap'
import { toast } from 'react-toastify'

import ClearIcon from '@material-ui/icons/Clear';

export default function AdminEmailFilterModal(props) {

  const [message, setMessage] = useState(props.replyMessage)

  const handleMessage = (value) => {
    setMessage(value)
  }



  const onSubmit = () => {

    // // console.log(props.rowId)
    // props.deleteRow(props.rowId)
    // props.handleModalState()

    if(message.length > 0) {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const postedData = {
      adminid: getSessionInfo('id'),
      token: getSessionInfo('token'),
      job: props.jobId,
      reply: props.replyId,
      user: props.senderId,
      date: props.replyDate,
      msg: message,
      email: props.email,
      password: props.password,
      email_number: props.emailNumber
    };

    props.toggleSpinner(true)
    axios({
      method: "post",
      url: `${WS_LINK}re_post_comment`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (res.data === 'token error') {
          clearSessionInfo()
          window.location.reload(false).then(props.history.replace('/'))
        }
        // eslint-disable-next-line eqeqeq
        if (res.data == 'success') {
          props.deleteRow(props.rowId)
        }
        props.handleModalState()
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
    }
    else{
      toast.error('Message can\'t be empty', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      })
    }
  }


  const modalBody = (
    <div className="row px-4 py-3">

      <div className="row col-12 mb-4 h4 font-weight-bold">
        <div onClick={props.handleModalState} className="ml-auto  d-flex flex-row justify-content-end pointer mb-3" style={{ fontSize: '18px' }}><ClearIcon /></div>
        {props.jobTitle ? props.jobTitle : "ERROR"}
      </div>

      <div className="row col-12 mb-4">
        <div className="col-12 h5 font-weight-bold pl-0">Original Message:</div>
        <InputText
          disabled={true}
          value={props.originalMessage ? props.originalMessage : "ERROR"}
          className="col-12"
        />
      </div>

      <div className="row col-12 mb-1">
        <div className="col-12 h5 pl-0 font-weight-bold">Reply:</div>
        <div className="font-weight-bold col-3 p-3">From:</div>
        <InputText
          disabled={true}
          value={props.replyFrom ? props.replyFrom : "ERROR"}
          className="col-9"
        />
        <div className="font-weight-bold col-3 p-3">Date:</div>
        <InputText
          disabled={true}
          value={props.replyDate ? props.replyDate : "ERROR"}
          className="col-9"
        />
      </div>


      <div className="row col-12 mb-3">
          <div className="font-weight-bold h5 col-12 p-1">Message:</div>
              <TextArea
                style={{
                  resize: "none",
                  padding: "15px",
                  border: "1px solid lightgrey",
                  borderRadius: "5px",
                  boxShadow: "-1px 1px 1px 0px #e0e0e0",
                }}
                placeholder="Write a message..."
                minRows={3}
                maxRows={6}
                value={message}
                onChange={(e) => handleMessage(e.target.value)}
                className="col-12"
                defaultValue={props.replyMessage}
              />
          <Button
            className="mt-3 px-2 ml-auto"
            style={{ float: 'right' }} 
            onClick={onSubmit}
            >
            Submit
          </Button>
      </div>

    </div>
  );

  return (
    <Modal
      name="Modal"
      modalState={props.modalState}
      modalBody={modalBody}
    />
  );
}

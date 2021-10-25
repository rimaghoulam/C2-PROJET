import React from 'react';
import Modal from "../Modal/Modal";
import { Button } from "reactstrap";

import { getSessionInfo } from "../../variable";
// import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

// import check from '../../check.png'
import check from "../../assets/images_png/check.png";

export default function CheckMail({
  props,
  toggleState,
  state,
  message,
  path,
}) {
  const toggle = () => {
    props.history.replace(path ? path : "/");
    toggleState();
  };

  const modalBoday = (
    <>
      <div id="check" className="row ml-auto">
        <Button className={getSessionInfo('language') === 'english' ? "text-right pr-2" : 'text-left pl-2'} color="link close" onClick={toggle}>
          X
        </Button>
      </div>
      <div className="d-flex justify-content-center mb-4">
        {/* <CheckCircleOutlineIcon className="col-12 ml-auto mb-3 mt-2" style={{fontSize: "50",color:'rgb(198 2 36)'}}/> */}
        <img className="" src={check} alt="img" width={75} />
      </div>

      <div className="col-12 text-center">
        <div className="text-center mb-4" style={{ fontSize: "18px", fontFamily: getSessionInfo("language") === "arabic" ? 'cnam-ar' : '' }}>
          {message ? (
            message
          ) : (
            <>
              {getSessionInfo("language") === "arabic"
                ? "تحقق من بريدك الالكتروني"
                : "Check Your Email"}
            </>
          )}
        </div>
      </div>
      <div className="col-12 text-center">
        <div
          className="text-center mb-4"
          style={{ overflow: "visible", color: "#6F6F6F", fontSize: "14px", fontFamily: getSessionInfo("language") === "arabic" ? 'cnam-ar' : '' }}
        >
          {!message && (
            <>
              {getSessionInfo("language") === "arabic" ? (
                <>
                  .شكرا لك على التسجيل في منصتنا<br></br>
                  .تم إرسال بريد إلكتروني إلى عنوان بريدك الإلكتروني<br></br>
                  .يرجى التحقق من حسابك للمتابعة
                </>
              ) : (
                <>
                  Thank your for registering on our platform.<br></br>
                  An email has been sent to your email address.<br></br>
                  Please verify your account to continue.
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="col-12 text-center">
        <Button
          onClick={toggle}
          className="px-5 mb-2"
          style={{
            color: "rgb(198 2 36)",
            borderColor: "rgb(198 2 36)",
            backgroundColor: "transparent",
            fontSize: "0.9rem",
            fontWeight: "500",
            fontFamily: getSessionInfo("language") === "arabic" ? 'cnam-ar' : ''
          }}
        >
          {getSessionInfo("language") === "english" ? "OK" : "نعم"}
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Modal
        modalState={state}
        modalBody={modalBoday}
        style={{ width: "450px" }}
      />
    </>
  );
}

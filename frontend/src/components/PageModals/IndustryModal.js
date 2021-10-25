import React from 'react';
import Modal from "../Modal/Modal";
import { Button } from "reactstrap";

// import { removeSessionInfo } from "../../variable";

// import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
// import check from '../../check.png'
import check from "../../assets/images_png/check.png";
import { getSessionInfo } from "../../variable";
import { translate } from "../../functions";

export default function IndustryModal({ props, toggleState, state, message, path, removeSession }) {

  const modalBoday = (
    <>
      <div id="check" className="row ml-auto">
        <Button className={`${translate('text-right pr-2', 'text-left pl-2')}`} color="link close" onClick={() => props.history.replace('/dashboard')}>
          X
        </Button>
      </div>
      <div className="d-flex justify-content-center mb-4">
        {/* <CheckCircleOutlineIcon className="col-12 ml-auto mb-3 mt-2" style={{fontSize: "50",color:'rgb(198 2 36)'}}/> */}
        <img className="" src={check} alt="img" width={75} />
      </div>

      <div className="col-12 text-center"></div>
      <div className="col-12 text-center">
        <p className="text-center mb-4" style={{ overflow: "visible", fontFamily: getSessionInfo("language") === "arabic" ? 'cnam-ar' : 'cnam' }}>
          {!message && (
            <>
              {getSessionInfo("language") === "arabic" ? (
                <>
                  .شكرا لك على التسجيل في منصتنا<br></br>
                </>
              ) : (
                <>
                  Thank your for registering on our platform.<br></br>
                </>
              )}
            </>
          )}
        </p>
      </div>
      <div className="col-12 text-center">
        <Button
          onClick={() => props.history.replace('/dashboard')}
          className="px-5 mb-2"
          style={{
            color: "rgb(198 2 36)",
            borderColor: "rgb(198 2 36)",
            backgroundColor: "transparent",
            fontSize: "0.9rem",
            fontWeight: "500",
            fontFamily: getSessionInfo("language") === "arabic" ? 'cnam-ar' : 'cnam'
          }}
        >
          {getSessionInfo("language") === "english" ? "OK" : "حسنا"}
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Modal modalState={state} modalBody={modalBoday} />
    </>
  );
}

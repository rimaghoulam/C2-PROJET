import React from 'react';
import Modal from '../Modal/Modal'
import { Button } from 'reactstrap'

import { getSessionInfo } from '../../variable'
// import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
// import check from '../../check.png'
import check from '../../assets/images_png/check.png'


export default function ChallengeModal({ props, toggleState, state, message, path }) {



    const toggle = () => {
        props.history.replace(path ? path : "/dashboard")
        toggleState()
    }


    let modalBoday
    if (getSessionInfo('language') === 'arabic') {
        modalBoday =
            <>
                <div id="check" className="row EditProfileModals">
                    <Button className={`${getSessionInfo('language') === 'arabic' ? 'text-left pl-2' : 'text-right pr-2'}`} color='link close' onClick={toggle}>X</Button>
                </div>
                <div className="d-flex justify-content-center " style={{ maxHeight:'75px' }}>
                    {/* <CheckCircleOutlineIcon className="col-12 ml-auto mb-3 mt-2" style={{fontSize: "50",color:'rgb(198 2 36)'}}/> */}
                    <img className="" src={check} alt="img" width={75} height={75} />

                </div>
                <div className="col-12 text-center">
                    <div className="text-center mb-3" style={{ fontSize: '18px', fontFamily: 'cnam-bold-ar' }}>
                        {message ? message :
                            <>تم إرسال التحدي بنجاح</>}</div>
                </div>
                <div className="col-12 text-center">
                    <p className="text-center" style={{ overflow: 'visible', fontFamily: 'cnam-ar' }}>
                        {!message &&
                            <>
                                .شكرا لك! قد تم تسجيل طلبك بنجاح <br></br>
                                سيتصل بك فريق كاوست للشركات <br></br>
                                .الصغيرة والمتوسطة قريبًا جدًا
                            </>
                        }
                    </p>
                </div>
                <div className="col-12 text-center">
                    <Button onClick={toggle} className="px-5 mb-2" style={{ color: 'rgb(198 2 36)', borderColor: 'rgb(198 2 36)', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: '500', fontFamily: 'cnam-ar' }}>نعم</Button>
                </div>
            </>
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    else {
        modalBoday =
            <>
                <div id="check" className="row ml-auto EditProfileModals">
                    <Button className={`${getSessionInfo('language') === 'arabic' ? 'text-left pl-2' : 'text-right pr-2'}`} color='link close' onClick={toggle}>X</Button>
                </div>
                <div className="d-flex justify-content-center" style={{ maxHeight:'75px' }}>

                    <img className="" src={check} alt="img" width={75} height={75} />

                </div>
                <div className="col-12 text-center">
                    <div className="text-center mb-3" style={{ fontSize: '18px', fontFamily: 'cnam-bold' }}>
                        {message ? message :
                            <>Challenge successfully submitted</>}</div>
                </div>
                <div className="col-12 text-center">
                    <p className="text-center" style={{ overflow: 'visible' }}>
                        {!message &&
                            <>
                                Thank you! Your request has been <br></br>
                                successfully submitted. CNAM Industry team<br></br>
                                will contact you very soon.
                            </>
                        }
                    </p>
                </div>
                <div className="col-12 text-center">
                    <Button onClick={toggle} className="px-5 mb-2" style={{ color: 'rgb(198 2 36)', borderColor: 'rgb(198 2 36)', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: '500' }}>OK</Button>
                </div>
            </>
    }


    return (
        <>
            <Modal
                modalState={state}
                modalBody={modalBoday}
                style={{ width: '450px' }}
            />
        </>
    )
}

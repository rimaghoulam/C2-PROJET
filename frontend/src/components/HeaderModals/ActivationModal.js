import React from 'react'

import { setSessionInfo, clearSessionInfo, getSessionInfo } from '../../variable'

import { Button } from 'reactstrap'

import CancelIcon from '@material-ui/icons/Cancel';

import check from '../../assets/images_png/check.png'


// toggleModalState       info       changeLoginState     history   

export default function ActivationModal(props) {
    const sendRequest = () => {
        clearSessionInfo()
        setSessionInfo({ name: "id", val: props.info[4][0][0].user_id })
        setSessionInfo({ name: "tempLoggedIn", val: true })
        setSessionInfo({ name: "token", val: props.info[4][0][0].token })
        setSessionInfo({ name: "name", val: props.info[4][0][0].user_name })
        props.history.replace('/industry_register');
    }
    return (
        <>
            {
                getSessionInfo('language') === 'english' ?
                    (
                        <>
                            <div className="row ml-auto">
                                <Button className="ml-auto pr-1 text-right" color='link close' onClick={props.toggleModalState}>X</Button>
                            </div>

                            <div className="col-12 text-center">
                                <h6 className="text-center">
                                    {props.info[0] === 0 ?
                                        <div className="text-center">
                                            <div><CancelIcon className="" style={{ fontSize: "50", color: 'rgb(198 2 36)' }} /></div>
                                            <div className="font-weight-bold mt-4 mb-4">{props.info[1]}</div>
                                            <div className="text-center">
                                                <Button className="px-5 mb-2" style={{ color: 'black', borderColor: 'rgb(198 2 36)', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: '500' }} onClick={() => { props.history.push('/contact_us'); props.toggleModalState() }}>Contact Us</Button>
                                            </div>
                                        </div>

                                        : <div className="text-center">
                                            <div><img src={check} width={75} alt="" /></div>
                                            <div className="font-weight-bold mt-4 mb-4">{props.info[1]}</div>
                                            <div className="text-center">
                                                <Button onClick={() => { sendRequest(); props.changeLoginState(); props.toggleModalState() }} className="px-5 mb-2" style={{ color: 'black', borderColor: 'rgb(198 2 36)', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: '500' }}>Proceed</Button>
                                            </div>
                                        </div>

                                    }
                                </h6>
                            </div>
                        </>
                    )

                    : // ARABIC

                    (
                        <div style={{ textAlign: 'right' }}>
                            <div className="row mr-auto">
                                <Button className="mr-auto pl-1 text-left" color='link close' onClick={props.toggleModalState}>X</Button>
                            </div>

                            <div className="col-12 text-center">
                                <h6 className="text-center">
                                    {props.info[0] === 0 ?
                                        <div className="text-center">
                                            <div><CancelIcon className="" style={{ fontSize: "50", color: 'rgb(198 2 36)' }} /></div>
                                            <div className="mt-4 mb-4" style={{ fontFamily: 'cnam-bold-ar' }}>{props.info[2]}</div>
                                            <div className="text-center">
                                                <Button className="px-5 mb-2" style={{ color: 'black', borderColor: 'rgb(198 2 36)', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: '500', fontFamily: 'cnam-ar' }} onClick={() => { props.history.push('/contact_us'); props.toggleModalState() }}>اتصل بنا</Button>
                                            </div>
                                        </div>

                                        : <div className="text-center">
                                            <div><img src={check} width={75} alt="" /></div>
                                            <div className="mt-4 mb-4" style={{ fontFamily: 'cnam-bold-ar' }}>{props.info[2]}</div>
                                            <div className="text-center">
                                                <Button onClick={() => { sendRequest(); props.changeLoginState(); props.toggleModalState() }} className="px-5 mb-2" style={{ color: 'black', borderColor: 'rgb(198 2 36)', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: '500', fontFamily: 'cnam-ar' }}>تقدم</Button>
                                            </div>
                                        </div>

                                    }
                                </h6>
                            </div>
                        </div>
                    )
            }

        </>
    )
}

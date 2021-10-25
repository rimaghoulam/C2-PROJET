import React from 'react'

import { getSessionInfo } from '../../variable'

import { Button } from 'reactstrap'

import check from '../../assets/images_png/check.png'

// togglesuccess         

export default function ForgotSuccessModal(props) {
    return (
        <>
            <div className="row  ">
                <Button className="ml-auto mr-4" color='link close' onClick={props.togglesuccess}>X</Button>
            </div>

            <div className="col-12 text-center">
                <h6 className="text-center">
                    <div className="text-center">
                        <div><img src={check} alt="" width={75} /></div>
                        {
                            getSessionInfo('language') === 'english' ?
                                (
                                    <div className="font-weight-bold mt-4 mb-4">Password successfully changed </div>
                                )
                                :
                                (
                                    <div className="mt-4 mb-4" style={{ fontFamily: 'cnam-bold-ar' }}>الرقم السري تغير بنجاح</div>
                                )
                        }
                        <div className="text-center">
                        </div>
                    </div>
                </h6>
            </div>
        </>

    )
}

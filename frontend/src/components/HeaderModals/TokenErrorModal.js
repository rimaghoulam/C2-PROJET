import React from 'react'

import { getSessionInfo } from '../../variable'

import { Button } from 'reactstrap'

import CancelIcon from '@material-ui/icons/Cancel';


// toggleerror

export default function TokenErrorModal(props) {
    return (
        <>
            <div className="row  ">
                <Button className="ml-auto mr-4" color='link close' onClick={props.toggleerror}>X</Button>
            </div>

            <div className="col-12 text-center">
                <h6 className="text-center">

                    <div className="text-center">
                        <div><CancelIcon className="" style={{ fontSize: "50", color: 'rgb(198 2 36)' }} /></div>
                        {getSessionInfo('language') === 'english' ?
                            (
                                <div className="font-weight-bold mt-4 mb-4">Token is Not Valid </div>
                            )
                            :
                            (
                                <div className="mt-4 mb-4" style={{ fontFamily: 'cnam-bold-ar' }}>رمز غير صالح</div>
                            )
                        }

                    </div>
                </h6>
            </div>
        </>
    )
}

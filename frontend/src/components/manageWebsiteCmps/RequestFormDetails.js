import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router';
import axios from 'axios'

import { getSessionInfo } from '../../variable';
import { WS_LINK, } from '../../globals';
import { formatDate } from '../../functions'

import ReplyForm from '../ReplyForm/ReplyForm';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

export default function RequestFormDetails(props) {
    let { requestId } = useParams();
    if (requestId !== undefined) requestId = decodeURIComponent(atob(requestId));
    else props.history.replace('/manage/request_forms')

    const [formDetails, setFormDetails] = useState('')

    useEffect(() => {

        props.setPageTitle('Request Form Details', 'طلب تفاصيل النموذج')

        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            form_id: requestId
        }

        axios({
            method: "post",
            // url: `${WS_LINK}view_contact_form`,
            url: `${WS_LINK}view_request_form`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                setFormDetails(res.data[0])
                props.toggleSpinner(false)
            })
            .catch(err => {
                if (axios.isCancel(err)) {
                    console.log('request canceled')
                }
                else {
                    console.log("request failed")
                }
                props.toggleSpinner(false)
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div className="cont">
            {formDetails !== '' &&
                <>
                    <div className="col-12 row">
                        <button className="pointer p-0 mt-3 ml-1 d-flex align-items-center" style={{ backgroundColor: 'transparent', border: 'none', color: '#00ab9e' }} onClick={() => props.history.goBack()}>
                            <ArrowBackIosIcon style={{ fontSize: '0.85rem' }} />Back
                        </button>
                        <div className="col-12 h3 mt-3" style={{ fontFamily: 'cnam-bold' }}> Request Form Details: </div>

                        <div className="col-12 col-lg-2 my-2 my-lg-3 h6" style={{ fontFamily: 'cnam-bold' }}>Title:</div>
                        <div className="col-12 col-lg-10 my-1 my-lg-3">{formDetails.request_title}</div>

                        <div className="col-12 col-lg-2 my-2 my-lg-3 h6" style={{ fontFamily: 'cnam-bold' }}>Name:</div>
                        <div className="col-12 col-lg-10 my-1 my-lg-3">{formDetails.request_user_name}</div>

                        <div className="col-12 col-lg-2 my-2 my-lg-3 h6" style={{ fontFamily: 'cnam-bold' }}>Email:</div>
                        <div className="col-12 col-lg-10 my-1 my-lg-3">{formDetails.request_user_email}</div>

                        <div className="col-12 col-lg-2 my-2 my-lg-3 h6" style={{ fontFamily: 'cnam-bold' }}>Phone:</div>
                        <div className="col-12 col-lg-10 my-1 my-lg-3">{formDetails.request_user_phone}</div>

                        <div className="col-12 col-lg-2 my-2 my-lg-3 h6" style={{ fontFamily: 'cnam-bold' }}>Created date:</div>
                        <div className="col-12 col-lg-10 my-1 my-lg-3">{formatDate(formDetails.created_date, true)}</div>

                        <div className="col-12 col-lg-2 my-2 my-lg-3 h6" style={{ fontFamily: 'cnam-bold' }}>Preffered Time:</div>
                        <div className="col-12 col-lg-10 my-1 my-lg-3">{formDetails.request_meeting_time ? formatDate(formDetails.request_meeting_time, true) : 'Not specified'}</div>

                        <ReplyForm emailTo={formDetails.request_user_email} />
                    </div>
                </>
            }
        </div>
    )
}

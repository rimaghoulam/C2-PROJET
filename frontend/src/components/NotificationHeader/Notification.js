import React from 'react'

import { getSessionInfo } from '../../variable'
import { formatDate } from '../../functions';

import challenge_icon from '../../assets/images_png/challenge_icon.png';
import internship_icon from '../../assets/images_png/internship_icon.png';
import welcome_icon from '../../assets/images_svg/welcome.svg'


// redirect

export default function Notification({ props, history, isLeft }) {

    // * ////////////////// THE STYLES
    const challengeStyle = {
        background: '#ccf0eb',
        borderRadius: '11%',
        width: '35px',
        height: '35px',
        padding: '5px'
    }


    // while mapping put props = item 

    let idName = ''
    getSessionInfo('role') === 4 ? idName = 'admin_notification_job_id' : idName = 'notification_job_id'

    return (
        <div className="notifications d-flex mt-3 pr-2 pointer" style={{ fontFamily: 'cnam' }} onClick={() => history.push(
            props.action_type === 'challenge_details' ? `/challenge_details/${btoa(encodeURIComponent(props[idName]))}` :
                props.action_type === 'internship_details' ? `/internship_details/${btoa(encodeURIComponent(props[idName]))}` :
                    props.action_type === 'discussions' ? `/discussion/${btoa(encodeURIComponent(props[idName]))}` :
                        props.action_type === 'profile' ? `/edit_company` :
                            '/all_notifications'
        )
        }>

            <div className="ml-1 mt-1">
                <img src={
                    (props.admin_notification_msg || props.notification_msg) &&
                        getSessionInfo('role') === 4 ?
                        props.admin_notification_msg.includes('Welcome') ? welcome_icon : props.admin_notification_msg.includes('challenge') ? challenge_icon : internship_icon
                        :
                        props.notification_msg.includes('Welcome') ? welcome_icon : props.notification_msg.includes('challenge') ? challenge_icon : internship_icon


                } alt="" style={challengeStyle} />
            </div>


            <div className={`ml-2 ${getSessionInfo('language') === 'arabic' && !isLeft && 'text-right'}`} style={{ width: '100%' }} >
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{getSessionInfo('role') !== 4 ? props.notification_msg : props.admin_notification_msg}</div>
                <div style={{ color: 'gray', fontSize: '12px' }}>{getSessionInfo('role') !== 4 ? formatDate(props.notification_date, true) : formatDate(props.admin_notification_date, true)}</div>

                <hr />

            </div>
        </div>
    )
}

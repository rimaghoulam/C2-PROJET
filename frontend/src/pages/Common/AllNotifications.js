import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK } from '../../globals';

import Notification from '../../components/NotificationHeader/Notification';

export default function AllNotifications(props) {


    const [notificationsObj, setNotificationObj] = useState({
        'notifNumber': 0,
        'newNotif': [],
        'oldNotif': [],
        'pageLoaded': false
    })



    useEffect(() => {
        props.setPageTitle('All Notifications', 'كل الإخطارات')

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        const postedData2 = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token')
        }
        props.toggleSpinner(true)
        axios({
            method: "post",
            url: `${WS_LINK}${getSessionInfo('role') === 4 ? 'get_admin_notifications' : 'get_notifications'}`,
            data: postedData2,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {
                    if (res.data !== 'notification empty') {

                        setNotificationObj({
                            'notifNumber': res.data[0],
                            'newNotif': res.data[1],
                            'oldNotif': res.data[2],
                            'pageLoaded': true
                        })
                    }
                }
                props.toggleSpinner(false)
            }
            )
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
        <div className="BodyHeight justify-content-center d-flex w-100">
            {notificationsObj.pageLoaded &&
                <div className="col-8 py-3 scroll-in-body custom_scrollbar remove_scroll_mobile" style={{ direction: getSessionInfo('language') === 'arabic' ? 'rtl' : 'ltr' }}>

                    {notificationsObj.oldNotif.map(item =>
                        <Notification
                            text_align='text-left'
                            isLeft='true'
                            props={item}
                            history={props.history}
                        />)}
                </div>
            }
        </div>
    )
}

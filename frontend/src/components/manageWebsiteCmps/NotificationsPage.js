import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable'
import { WS_LINK } from '../../globals'

import Table from '../Table/Table'

import './manageWebsiteCmps.css'

export default function NotificationsPage(props) {

    const [tableData, setTableData] = useState({
        cols: [{ title: 'DESCRIPTION', field: 'description' }]
    })



    useEffect(() => {

        props.setPageTitle('Manage Notifications', 'إدارة الإشعارات')

        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token')
        }

        axios({
            method: "post",
            url: `${WS_LINK}get_all_notification_template`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {
                    setTableData({
                        ...tableData, rows: res.data.map(notif => {
                            return ({
                                key: notif.notification_id,
                                description: notif.description
                            })
                        })
                    })
                }

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
            {tableData.rows &&
                <Table
                    name='notifications-table'
                    title={`Notifications`}
                    columns={tableData.cols}
                    data={tableData.rows}
                    options={{
                        pageSize: 15,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [15, 20, 30, 40],
                        paging: true,
                        search: true,
                        headerStyle:
                        {
                            fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                            paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap',
                        }
                    }}
                    rowClick={(event, rowData) => { props.history.push(`/manage/notifications_details/${btoa(encodeURIComponent(rowData.key))}`) }}
                />
            }
        </div>
    )
}

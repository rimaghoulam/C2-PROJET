import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK } from '../../globals';

import Table from '../Table/Table'

import EditIcon from '@material-ui/icons/Edit';

import './manageWebsiteCmps.css'


export default function ManageAllPages(props) {

    // ///////////////////////////////////////////////////////////////////////


    const [tableData, setTableData] = useState({
        cols: [
            { title: "Page", field: "page_e" },
            { title: "الصفحة", field: "page_a" },
            {
                title: "", field: "actions", sorting: 'false', render: rowData =>
                    <div className="row">
                        <EditIcon className="pointer ml-auto mr-3" style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }} onClick={() => props.history.push("/manage/pages/" + btoa(encodeURIComponent(rowData.actions)) + "/" + btoa(encodeURIComponent(rowData.page_e)))} />
                    </div>
            },
        ]
    })




    ///////////////////////////////////////////////////////////// PAGE CREATION

    useEffect(() => {

        props.setPageTitle('Manage All Pages', 'إدارة جميع الصفحات')

        getData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const getData = () => {
        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token')
        }

        axios({
            method: "post",
            url: `${WS_LINK}get_all_pages`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {
                    const arr = []
                    for (let i = 0; i < res.data.length; i++) {
                        arr.push({
                            page_e: res.data[i].page_e,
                            page_a: res.data[i].page_a,
                            actions: res.data[i].page_id,
                        })
                    }
                    setTableData({ ...tableData, rows: arr })
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
    }






    // /////////////////////////////////////////////////////////////////////////////////////////////



    return (
        <div className="cont">
            {tableData.rows &&
                <Table
                    name='media-table'
                    title={
                        <div className="my-3 row ml-0 p-0" style={{ width: '50vw' }} >
                            <h4>Pages ({tableData.rows.length}) : </h4>
                        </div>
                    }
                    columns={tableData.cols}
                    data={tableData.rows}
                    options={{
                        pageSize: 10,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [10, 15],
                        paging: true,
                        search: false,
                        headerStyle:
                        {
                            fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                            paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap',
                        }
                    }}
                />
            }
        </div>
    )
}

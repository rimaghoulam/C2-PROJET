import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK, } from '../../globals';
import { formatDate, downloadFileWithExtension } from '../../functions'

import Table from '../Table/Table'
import AdminContactForm from '../AdminContactForm/AdminContactForm';

import './manageWebsiteCmps.css'

import pdf from '../../assets/images_svg/pdf.svg';
import csv from '../../assets/images_svg/csv.svg';

export default function RequestForm(props) {



    const [tableData, setTableData] = useState({
        cols: [
            { title: "Title", field: "title" },
            { title: "Email", field: "email" },
            { title: "Name", field: "name" },
            { title: "Phone", field: "phone" },
            { title: "Date", field: "date", defaultSort: 'desc' },
            // {
            //     title: "", field: "lastIcons", render: rowData =>
            //         <>
            //             <div className="row" style={{ color: '#959595' }}>
            //                 <EditIcon className="pointer ml-auto mr-3" style={{ fontSize: "25px", color: 'rgb(198 2 36)' }}/>
            //             </div>
            //         </>
            // },
        ]
    })

    const RowsRef = useRef({});
    RowsRef.current = tableData.rows;


    ////////////////////////////////////////////// PAGE CREATION

    useEffect(() => {

        props.setPageTitle('Manage Request Form', 'إدارة نموذج الطلب')

        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token')
        }

        // export_requests

        axios({
            method: "post",
            url: `${WS_LINK}get_request_forms`,
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
                            title: res.data[i].request_title,
                            email: res.data[i].request_user_email,
                            name: res.data[i].request_user_name,
                            phone: res.data[i].request_user_phone,
                            date: formatDate(res.data[i].created_date),
                            hidden: { requestId: res.data[i].id_request }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const exportTable = (data, users_id, exportType, isCompany) => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        let contacts = [];
        for (let i = 0; i < data.length; i++) {
            contacts[i] = data[i].hidden.requestId;
        }

        var postedData;

        postedData = {
            userid: getSessionInfo("id"),
            token: getSessionInfo("token"),
            toe: exportType,
            contact_id: contacts,
        };

        props.toggleSpinner(true);
        axios({
            method: "post",
            url: `${WS_LINK}export_requests`,
            data: postedData,
            cancelToken: source.token,
        })
            .then((res) => {
                if (getSessionInfo("role") === 4 && res.data !== "token error") {
                    props.toggleSpinner(false);
                    downloadFileWithExtension(res.data, `requests forms.${exportType}`, exportType);
                } else {
                    clearSessionInfo();
                    window.location.reload(false).then(props.history.replace("/"));
                }
            })

            .catch((err) => {
                props.toggleSpinner(false);
                if (axios.isCancel(err)) {
                    console.log("request canceled");
                } else {
                    console.log("request failed");
                }
            });
    };



    return (
        <div className="cont">
            {tableData.rows &&
                <>

                    <Table
                        name='media-table'
                        title={<h4>Request Forms:</h4>}
                        columns={tableData.cols}
                        data={RowsRef.current}
                        rowClick={(event, rowData) =>
                            props.history.push(`/manage/request_forms/${btoa(encodeURIComponent(rowData.hidden.requestId))}`)
                        }
                        options={{
                            pageSize: 5,
                            emptyRowsWhenPaging: false,
                            pageSizeOptions: [5, 10],
                            selection: true,
                            sorting: true,
                            paging: true,
                            headerStyle:
                            {
                                fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                                paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap',
                            }
                        }}
                        actions={[
                            {
                                tooltip: 'Download as CSV',
                                icon: () => <button style={{ background: 'none', borderRadius: "4px", border: '1px solid lightgrey' }}><img src={csv} alt="" style={{ width: '20px' }} /><span style={{ fontSize: "13px", fontWeight: 'bold' }}> Download as CSV</span></button>,
                                onClick: (evt, data) => exportTable(data, 'contactform', 'csv')
                            },
                            {
                                tooltip: 'Download as PDF',
                                icon: () => <button style={{ background: 'none', borderRadius: "4px", border: '1px solid lightgrey' }}><img src={pdf} alt="" style={{ width: '20px' }} /><span style={{ fontSize: "13px", fontWeight: 'bold' }}> Download as PDF</span></button>,
                                onClick: (evt, data) => exportTable(data, 'contactform', 'pdf')
                            }
                        ]}
                    />
                </>
            }
            <AdminContactForm />
        </div>
    )
}
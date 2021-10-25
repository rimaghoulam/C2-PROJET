import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router';

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK } from '../../globals';

import Table from '../Table/Table'

import SwitchComponent from '../Switch/Switch'

import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import './manageWebsiteCmps.css'


const getPageUrl = (pageId) => {

    let websiteUrl = "https://kpp.cnam.edu.sa/"

    switch (pageId){
        case "1":
            return websiteUrl + "home"
        default:
            return websiteUrl
    }
}  






export default function ManagePage(props) {



    let { pageId, pageName } = useParams();
    if (pageId !== undefined) pageId = decodeURIComponent(atob(pageId));
    if (pageName !== undefined) pageName = decodeURIComponent(atob(pageName));
    else props.history.replace('/manage/pages')


    // * /////////////////////////////////////////// states

    const [tableData, setTableData] = useState({
        cols: [
            { title: "Slug", field: "slug" },
            {
                title: "Arabic Content", field: "ar", render: rowData =>
                    rowData.actions.type === 'image' ?
                        <img src={rowData.ar} alt="img" style={{ maxHeight: '120px' }} />
                        :
                        rowData.ar
            },
            {
                title: "English Content", field: "en", render: rowData =>
                    rowData.actions.type === 'image' ?
                        <img src={rowData.en} alt="uploaded-pic" style={{ maxHeight: '120px' }} />
                        :
                        rowData.en
            },
            {
                title: "", field: "actions", sorting: false, render: rowData =>
                    <div className="d-flex justify-content-end">
                        {rowData.actions.edit &&
                            <EditIcon className="pointer mr-1"
                                style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }}
                                onClick={rowData.actions.edit} />
                        }
                        <SwitchComponent
                            id={rowData.actions.id}
                            checked={rowData.actions.checked}
                            onChange={rowData.actions.handleCheck}
                        />
                    </div>
            },
        ]
    })






    // * /////////////////////////////////////////////////////////// PAGE CREATION

    useEffect(() => {

        props.setPageTitle('Manage Page', 'إدارة الصفحة')

        getPageData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const getPageData = () => {
        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            page_id: pageId,
        }

        axios({
            method: "post",
            url: `${WS_LINK}admin_get_page_component`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {

                    let rows = []

                    for (let i = 0; i < res.data[0].length; i++) {
                        rows.push({
                            slug: res.data[0][i].slug,
                            ar: res.data[0][i].type === 'image' ? res.data[0][i].arabic : res.data[0][i].arabic.length > 120 ? res.data[0][i].arabic.substring(0, 117) + ' ...' : res.data[0][i].arabic,
                            en: res.data[0][i].type === 'image' ? res.data[0][i].english : res.data[0][i].english.length > 120 ? res.data[0][i].english.substring(0, 117) + ' ...' : res.data[0][i].english,
                            actions: {
                                id: `switch-${i + 1}`,
                                type: res.data[0][i].type,
                                edit: res.data[0][i].slug === 'request-meeting' || res.data[0][i].slug === 'slider' || res.data[0][i].slug === 'counter-row'  ? false : () => props.history.push(`/manage/edit_page_component/${btoa(encodeURIComponent(pageId))}/${btoa(encodeURIComponent(pageName))}/${btoa(encodeURIComponent(res.data[0][i].slug))}`),
                                checked: res.data[0][i].status,
                                handleCheck: () =>
                                    (res.data[0][i].slug === 'counter-row' && pageName === 'Home Page') ?
                                        handleNumbersSwitchChange()
                                        :
                                        handleSwitchCheck(res.data[0][i].page_components_id, res.data[0][i].status === 0 ? 1 : 0, `switch-${i + 1}`)
                            },
                        })
                    }

                    if (pageName === 'Home Page') {
                        let t = rows.filter(item => item.slug === 'slide-1-video')[0]
                        let tmparr = []
                        for (let i = 0; i < rows.length; i++) {
                            if (rows[i].slug === 'slide-1-video') continue
                            if (i > 0 && rows[i - 1].slug === 'slide-1-image') {
                                tmparr.push(t)
                                continue
                            }
                            if (rows[i].slug === 'slider') {
                                tmparr.unshift(rows[i])
                                continue
                            }
                            tmparr.push(rows[i])
                        }
                        rows = tmparr
                    }


                    setTableData({ ...tableData, rows: rows })

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


                console.log(err)
            });
    }



    // * //////////////////////////////////////////////////////////////// FUNCTIONS

    const handleNumbersSwitchChange = () => {

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        let value = document.getElementById('numbersSwitch').checked ? 'off' : 'on'

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            value: value
        }

        props.toggleSpinner(true)

        axios({
            method: "post",
            url: `${WS_LINK}update_summary_value`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (getSessionInfo("role") === 4 && res.data !== "token error") {
                    getPageData()
                }
                else {
                    clearSessionInfo();
                    window.location.reload(false).then(props.history.replace("/"));
                }
            })
            .catch(err => {
                props.toggleSpinner(false)
                if (axios.isCancel(err)) {
                    console.log('request canceled');
                }
                else {
                    console.log("request failed")
                }
            });

    }



    const handleSwitchCheck = (rowId, status, switchId) => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            row_id: rowId,
            status: status,
        }

        props.toggleSpinner(true)

        axios({
            method: "post",
            url: `${WS_LINK}change_row_status`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (getSessionInfo("role") === 4 && res.data !== "token error") {
                    getPageData()
                }
                else {
                    clearSessionInfo();
                    window.location.reload(false).then(props.history.replace("/"));
                }
            })
            .catch(err => {
                props.toggleSpinner(false)
                if (axios.isCancel(err)) {
                    console.log('request canceled');
                }
                else {
                    console.log("request failed")
                }
            });
    }








    return (
        <div className="cont pr-2 pr-md-0">

            {tableData['rows'] &&

                <>
                    <div className="col-12 mt-3">
                        <span style={{ color: '#00ab9e' }} className="pointer" onClick={() => props.history.goBack()}>
                            <ArrowBackIosIcon style={{ fontSize: '1rem' }} /> Back
                        </span>
                    </div>

                    <Table
                        name='media-table'
                        title={
                            <div className="my-3 d-flex flex-wrap" style={{ width: '50vw' }} >
                                <h4>{pageName} ({tableData.rows.length}) :</h4>
                                <span className="mx-3 my-2"> <a href={getPageUrl(pageId)} target="_blank" rel="noreferrer">{getPageUrl(pageId)}</a></span>
                            </div>
                        }
                        columns={tableData.cols}
                        data={tableData.rows}
                        options={{
                            // pageSize: 10,
                            emptyRowsWhenPaging: false,
                            // pageSizeOptions: [5, 10, 15],
                            paging: false,
                            search: false,
                            headerStyle:
                            {
                                fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                                paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap',
                            }
                        }}
                    />

                </>
            }
        </div>
    )
}

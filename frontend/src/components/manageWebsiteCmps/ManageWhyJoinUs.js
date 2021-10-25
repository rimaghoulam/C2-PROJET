import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable';
import { WS_LINK, } from '../../globals';
import { translate } from '../../functions'

import { whyJoinUsColumns } from './ManageGlobals'

import GenericModal from '../PageModals/GenericModal'
import Table from '../Table/Table'

import DeleteIcon from '@material-ui/icons/Delete';

import './manageWebsiteCmps.css'

export default function ManageWhyJoinUs(props) {


    const [pageData, setPageData] = useState({
        rows: [],
        pageLoaded: false
    })

    const [deleteModalState, setDeleteModalState] = useState({
        open: false,
        id: ''
    })


    const closeDeleteModal = () => {
        setDeleteModalState({
            open: false,
            id: ''
        })
    }

    const openDeleteModal = (id) => {
        setDeleteModalState({
            open: true,
            id: id
        })
    }




    useEffect(() => {

        props.setPageTitle('Manage Why join us', 'إدارة لماذا تنضم إلينا')

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
        }

        props.toggleSpinner(true)
        axios({
            method: "post",
            url: `${WS_LINK}get_join_icons`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (getSessionInfo("role") === 4 && res.data !== "token error") {

                    const t = res.data.map(item => ({
                        id: item.icon_id,
                        text_e: item.text_english.length > 150 ? item.text_english.substring(0, 145) + " ..." : item.text_english,
                        text_a: item.text_arabic.length > 150 ? item.text_arabic.substring(0, 145) + " ..." : item.text_arabic,
                        image: item.icon,
                        lastIcons: {
                            edit: () => props.history.push('/manage/edit/why_join_us/' + btoa(encodeURIComponent(item.icon_id))),
                            delete: () => openDeleteModal(item.icon_id)
                        }
                    }))

                    setPageData({
                        ...pageData,
                        rows: t,
                        pageLoaded: true,
                    })
                }
                else {
                    clearSessionInfo();
                    window.location.reload(false).then(props.history.replace("/"));
                }
                props.toggleSpinner(false)

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])





    const deleteIcon = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            icon_id: deleteModalState.id,
        }

        props.toggleSpinner(true)
        axios({
            method: "post",
            url: `${WS_LINK}delete_join_icons`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (getSessionInfo("role") === 4 && res.data !== "token error") {

                    let t = pageData.rows.filter(item => item.id !== deleteModalState.id && item)

                    setPageData({ ...pageData, rows: t })

                    closeDeleteModal()

                }
                else {
                    clearSessionInfo();
                    window.location.reload(false).then(props.history.replace("/"));
                }
                props.toggleSpinner(false)

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
        <div className="cont">


            <GenericModal
                state={deleteModalState.open}
                toggleState={closeDeleteModal}
                icon={<DeleteIcon style={{ fontSize: '45' }} />}
                text={translate('Are you sure you want to delete this icon?', 'هل أنت متأكد أنك تريد حذف هذ الرمز؟')}
                buttonClick={deleteIcon}
                buttonText={translate('Ok', 'نعم')}
            />

            {pageData.pageLoaded &&
                <Table
                    name='why-join-us-table'
                    title={<div className="d-flex">
                        <h4 >Why join us ({pageData.rows.length}):</h4>
                        <button className="addButton" onClick={() => props.history.push('/manage/add/why_join_us')}> Add </button>
                    </div>}
                    columns={whyJoinUsColumns}
                    data={pageData.rows}
                    options={{
                        pageSize: 5,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [5, 10],
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

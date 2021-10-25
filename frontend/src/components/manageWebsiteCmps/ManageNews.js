import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { WS_LINK } from '../../globals'
import { getSessionInfo, clearSessionInfo } from '../../variable'
import { formatDate } from '../../functions'

import { ManageWebsiteColumns } from './ManageGlobals'

import Table from '../Table/Table'
import DeleteMediaModal from './DeleteMediaModal'

import './manageWebsiteCmps.css'

export default function ManageNews(props) {


    const [pageData, setPageData] = useState({
        rows: [],
        pageLoaded: false
    })

    const [deleteModalState, setDeleteModalState] = useState({
        open: false,
        id: ''
    })





    useEffect(() => {

        props.setPageTitle('Manage News', 'إدارة الأخبار')

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()


        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
        }

        props.toggleSpinner(true)

        axios({
            method: "post",
            url: `${WS_LINK}get_news`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (getSessionInfo("role") === 4 && res.data !== "token error") {
                    const t = res.data.map(item => ({
                        image: item.image,
                        title_en: item.title_e,
                        mediaId: item.media_id,
                        title_ar: item.title_a,
                        text_en: item.text_e,
                        text_ar: item.text_a,
                        date: formatDate(item.created_date),
                        lastIcons: {
                            edit: () => props.history.push('/manage/edit/news/' + btoa(encodeURIComponent(item.media_id))),
                            delete: () => setDeleteModalState({ open: true, id: item.media_id })
                        }
                    }))

                    setPageData({
                        ...pageData,
                        pageLoaded: true,
                        rows: t
                    })

                    props.toggleSpinner(false)

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const removeMedia = (mediaId) => {
        const r = pageData.rows.filter(item => item.mediaId !== mediaId && item)
        setPageData({ ...pageData, rows: r })
    }

    return (
        <div className="cont">
            <DeleteMediaModal
                mediaId={deleteModalState.id}
                toggleSpinner={props.toggleSpinner}
                history={props.history}
                removeMedia={removeMedia}
                state={deleteModalState.open}
                toggleState={() => setDeleteModalState({ open: false, id: '' })}
            />
            {pageData.pageLoaded &&
                <Table
                    name='media-table'
                    title={<div className="d-flex"><h4 >News ({pageData.rows.length}):</h4><button className="addButton" onClick={() => props.history.push('/manage/add/news')}> Add </button></div>}
                    columns={ManageWebsiteColumns}
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

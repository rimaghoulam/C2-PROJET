import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { WS_LINK } from '../../globals'
import { getSessionInfo, clearSessionInfo } from '../../variable'
import { translate } from '../../functions'

import { socialMediaColumns } from './ManageGlobals'

import GenericModal from '../PageModals/GenericModal'
import Table from '../Table/Table'

import DeleteIcon from '@material-ui/icons/Delete';

import './manageWebsiteCmps.css'

export default function ManageSocialMedia(props) {



    const [pageData, setPageData] = useState({
        rows: [],
        pageLoaded: false
    })

    const [modalState, setModalState] = useState({
        open: false,
        id: ''
    })

    const openModal = (id) => {
        setModalState({
            open: true,
            id: id
        })
    }

    const closeModal = () => {
        setModalState({
            open: false,
            id: ''
        })
    }




    useEffect(() => {

        props.setPageTitle('Manage Social Media', 'إدارة وسائل التواصل الاجتماعي')

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()


        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
        }
        props.toggleSpinner(true)
        axios({
            method: "post",
            url: `${WS_LINK}get_all_social`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (getSessionInfo("role") === 4 && res.data !== "token error") {

                    const t = res.data.map(item => ({
                        socialId: item.social_id,
                        link: item.social_link,
                        icon: item.social_icon,
                        lastIcons: {
                            edit: () => props.history.push('/manage/edit/social_media/' + btoa(encodeURIComponent(item.social_id))),
                            delete: () => openModal(item.social_id)
                        }
                    }))

                    setPageData({
                        ...pageData,
                        pageLoaded: true,
                        rows: t
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



    const deleteSocial = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()


        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            id_social: modalState.id
        }
        props.toggleSpinner(true)
        axios({
            method: "post",
            url: `${WS_LINK}delete_social`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (getSessionInfo("role") === 4 && res.data !== "token error") {

                    // eslint-disable-next-line eqeqeq
                    const r = pageData.rows.filter(item => item.socialId != modalState.id && item)

                    setPageData({ ...pageData, rows: r })

                    closeModal()

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
                state={modalState.open}
                toggleState={closeModal}
                icon={<DeleteIcon style={{ fontSize: '45' }} />}
                text={translate('Are you sure you want to delete this social media?', 'هل أنت متأكد أنك تريد حذف هذه الوسائط الاجتماعية؟')}
                buttonClick={deleteSocial}
                buttonText={translate('Ok', 'نعم')}
            />

            {pageData.pageLoaded &&
                <Table
                    name='media-table'
                    title={<div className="d-flex">
                        <h4>Social Media ({pageData.rows.length}):</h4>
                        <button className="addButton" onClick={() => props.history.push('/manage/add/social_media')}> Add </button>
                    </div>}
                    columns={socialMediaColumns}
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

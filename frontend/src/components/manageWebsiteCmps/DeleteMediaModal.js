import React from 'react';
import axios from 'axios'

import { WS_LINK } from '../../globals'
import { getSessionInfo, clearSessionInfo } from '../../variable'
import { translate } from '../../functions';

import Modal from "../Modal/Modal";

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

// mediaId      toggleSpinner      history     removeMedia(mediaId)        state        toggleState
export default function DeleteMediaModal(props) {


    const deleteMedia = () => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            id_media: props.mediaId
        }

        props.toggleSpinner(true)


        axios({
            method: "post",
            url: `${WS_LINK}delete_media`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (getSessionInfo("role") === 4 && res.data !== "token error") {

                    props.removeMedia(props.mediaId)
                    props.toggleState()

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
        <Modal
            modalState={props.state}
            modalBody={
                <>
                    <div className="row">

                        <div className={`col-12 ${translate('text-right pr-2', 'text-left pl-2')}`}>
                            <CloseIcon className="pointer" onClick={props.toggleState} />
                        </div>

                        <div className="col-12 text-center">
                            <DeleteIcon style={{ fontSize: '45' }} />
                        </div>

                        <p
                            className={`col-12 mt-3 text-center `}
                            style={{ fontWeight: 'bold' }}
                        >
                            {translate('Are you sure you want to delete this media?', 'هل أنت متأكد أنك تريد حذف هذه الوسائط؟')}
                        </p>

                        <button
                            style={{ border: 'none', borderRadius: '5px', backgroundColor: '#00ab9e', padding: '0.35rem 1.5rem', color: 'white', width: 'fit-content' }}
                            className="mx-auto"
                            onClick={deleteMedia}
                        >
                            {translate('Yes', 'نعم')}
                        </button>

                    </div>
                </>}
        />
    )
}

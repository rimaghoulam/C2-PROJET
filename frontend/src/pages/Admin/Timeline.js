import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router';
import axios from 'axios'

import { WS_LINK } from '../../globals';
import { getSessionInfo, clearSessionInfo } from '../../variable';
import { formatDate, translate } from '../../functions';

import Comment from '../../components/Comment/Comment';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

export default function Timeline(props) {

    let { job_id } = useParams();
    if (job_id !== undefined) job_id = decodeURIComponent(atob(job_id));


    const [state, setState] = useState('')

    const [status, setStatus] = useState({
        cur: '',
        prev: ''
    })

    const comments = useRef('')


    const changeStatus = (newStatus) => {
        if (newStatus !== status.cur) {

            if (status.cur !== '') document.getElementById(status.cur).classList.remove('statusCardActive');
            document.getElementById(newStatus).classList.add('statusCardActive');

            comments.current = state.comments.filter(item => item.job_status === newStatus && item)

            setStatus(prevStatus => ({
                cur: newStatus,
                prev: prevStatus.cur
            }))
        }
    }


    useEffect(() => {
        props.setPageTitle('Timeline', 'timeline')
        props.toggleSpinner(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()

        const postedData = {
            userid: getSessionInfo('id'),
            token: getSessionInfo('token'),
            jobid: job_id,
        }

        axios({
            method: "post",
            url: `${WS_LINK}view_timeline`,
            data: postedData,
            cancelToken: source.token,
        })
            .then(res => {
                if (getSessionInfo('role') !== 4 || res.data === 'token error') {
                    clearSessionInfo()
                    window.location.reload(false).then(props.history.replace('/'))
                }
                else {
                    setState({
                        statuses: res.data[0],
                        comments: res.data[1],
                        pageLoaded: true,
                    })
                    props.toggleSpinner(false)
                }
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

    const result = {};
    if (comments.current.length) {
        for (let i = 0; i < comments.current.length; i++) {
            // for (let i = comments.current.length - 1; i > -1; i--) {

            if (!comments.current[i].reply) {
                if (result[comments.current[i].comment_id]) {
                    result[comments.current[i].comment_id].unshift(
                        <Comment
                            key={comments.current[i].comment_id}
                            id={i === comments.current.length - 1 && 'lastDiscussion'}
                            comment_id={comments.current[i].comment_id}
                            user_name={comments.current[i].user_name}
                            message={comments.current[i].message}
                            isPrivate={comments.current[i].is_private === 'yes' && true}
                            date={comments.current[i].created_date}
                            isReply={false}
                            isTimeline={true}
                            comment_type={comments.current[i].comment_type}
                            file_name={comments.current[i].file_name}
                        />);
                }
                else {
                    result[comments.current[i].comment_id] = [<Comment
                        key={comments.current[i].comment_id}
                        id={i === comments.current.length - 1 && 'lastDiscussion'}
                        comment_id={comments.current[i].comment_id}
                        user_name={comments.current[i].user_name}
                        message={comments.current[i].message}
                        isPrivate={comments.current[i].is_private === 'yes' && true}
                        date={comments.current[i].created_date}
                        isReply={false}
                        isTimeline={true}
                        comment_type={comments.current[i].comment_type}
                        file_name={comments.current[i].file_name}
                    />];
                }
            }
            else {
                if (result[comments.current[i].reply]) {
                    result[comments.current[i].reply].push(<Comment
                        key={comments.current[i].comment_id}
                        id={i === comments.current.length - 1 && 'lastDiscussion'}
                        comment_id={comments.current[i].comment_id}
                        user_name={comments.current[i].user_name}
                        message={comments.current[i].message}
                        isPrivate={comments.current[i].is_private === 'yes' && true}
                        date={comments.current[i].created_date}
                        isReply={true}
                        isTimeline={true}
                        comment_type={comments.current[i].comment_type}
                        file_name={comments.current[i].file_name}
                    />);
                }
                else {
                    result[comments.current[i].reply] = [<Comment
                        key={comments.current[i].comment_id}
                        id={i === comments.current.length - 1 && 'lastDiscussion'}
                        comment_id={comments.current[i].comment_id}
                        user_name={comments.current[i].user_name}
                        message={comments.current[i].message}
                        isPrivate={comments.current[i].is_private === 'yes' && true}
                        date={comments.current[i].created_date}
                        isReply={true}
                        isTimeline={true}
                        comment_type={comments.current[i].comment_type}
                        file_name={comments.current[i].file_name}
                    />];
                }
            }
        }
    }

    return (
        <div className="w-100 row BodyHeight ml-0 mr-0">
            {state.pageLoaded &&
                <>
                    <div className="col-12 col-lg-4 scroll-in-body p-3" style={{ backgroundColor: '#eeeeee' }}>


                        <button
                            className="pointer my-2"
                            style={{ border: 'none', backgroundColor: 'transparent', color: '#00ab9e' }}
                            onClick={() => props.history.goBack()}
                        >
                            <ArrowBackIosIcon style={{ fontSize: '0.85rem' }} />Back
                        </button>


                        {state.statuses && state.statuses.map(status =>
                            <div key={status.status_log_id}
                                id={status.status}
                                className="mx-3 px-3 py-3 my-2 shadow-lg pointer statusCard"
                                onClick={() => changeStatus(status.status)}
                            >
                                <h6><b>{status.status}</b></h6>
                                <p style={{ fontWeight: '500', fontSize: '0.8rem' }} className="mb-0">Saved on {formatDate(status.date, true)}</p>
                            </div>
                        )}

                    </div>
                    <div className="col-12 col-lg-8 shadow-lg p-3">

                        {status.cur === '' ?
                            <>
                                <h5 className={`mt-3 px-3 ${translate('text-left', 'text-right')}`}>{translate('Please pick a Status!', '!يرجى اختيار الحالة')}</h5>
                            </>
                            :
                            <>
                                <h5 className={`mt-3 px-3 ${translate('text-left', 'text-right')} mb-4`}> {translate('Discussions', 'مناقشات')} - ({comments.current.length}) </h5>
                                <div className="scroll-in-body">
                                    {Object.keys(result).map(id => result[id])}
                                </div>
                            </>
                        }

                    </div>
                </>
            }
        </div >
    )
}

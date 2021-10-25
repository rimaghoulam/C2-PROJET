import React, { useState } from 'react'

import { getSessionInfo } from '../../variable'
import { checkTextAlignment, checkFontFamily, formatDate, downloadCommentFile, makeAvatarName, translate } from '../../functions';

import TextArea from '../Text-Area/TextArea';

import Avatar from "@material-ui/core/Avatar";
import { Button } from "reactstrap";

import ReplyIcon from "@material-ui/icons/Reply";
import AttachFileIcon from "@material-ui/icons/AttachFile";

import pdf from '../../assets/images_svg/pdf.svg';

import classes from './Comment.module.css'

export default function Comment(props) {

    const [message, setMessage] = useState('')

    const [replyOpen, setReplyOpen] = useState(false)

    const [miniSpinner, setMiniSpinner] = useState(false);


    const toggleReplyState = () => {
        setReplyOpen(prevState => !prevState)
    }

    const toggleSpinnerState = () => {
        setMiniSpinner(prevState => !prevState)
    }

    const uploadFile = (e) => {
        toggleSpinnerState()
        props.uploadFile(e, props.comment_id)
        toggleSpinnerState()
    }

    const handleChange = (e) => {
        setMessage(e.target.value)
    }




    return (
        <div
            className={`${props.isReply && (getSessionInfo('language') === 'arabic' ? 'mr-3' : 'pl-3')} `}
            key={props.comment_id}
            id={props.id ? props.id : props.comment_id}
            style={{
                backgroundColor: props.isPrivate && '#d8dddc',
                borderRadius: '5px',
                borderTopLeftRadius: props.isReply ? '0' : '5px',
                borderTopRightRadius: props.isReply ? '0' : '5px',
                position: 'relative',
                top: props.isPrivate && props.isReply ? '-6px' : '0'
            }}
        >
            {props.isReply}
            <div
                className={`d-flex ${props.isPrivate ? 'py-3' : 'py-1'} px-2 ${checkTextAlignment()}`}
            // style={{ backgroundColor:props.isPrivate && '#d8dddc', borderRadius:'5px' }}
            >
                <Avatar
                    className="mt-2"
                    style={{
                        backgroundColor: props.user_name === getSessionInfo("name") ? "#b6bf00" : "#eaab00",
                        fontSize: "17px",
                    }}
                >
                    {makeAvatarName(props.user_name)}
                </Avatar>
                <div className="ml-1 mr-1">
                    {props.comment_type === 'media' ?
                        <Button
                            style={{
                                background: "#f5f1ee",
                                color: "black",
                                border: "none",
                                fontSize: "0.8rem",
                                padding: "0.55rem 0.95rem",
                            }}
                            onClick={() => downloadCommentFile(props.message, props.file_name)}
                        >
                            <img src={pdf} alt="pdf" style={{ width: "20px" }} />{" "}
                            {props.file_name}
                        </Button>
                        :
                        <p
                            className="mb-1"
                            style={{ fontWeight: "500", whiteSpace: "pre-line" }}
                        >
                            {/* {getSessionInfo('language') === 'english' && props.message} */}
                            {props.message}
                            {props.isPrivate && !props.isReply &&
                                <>

                                    <span
                                        className={`${translate('ml-1', 'mr-1')}`}
                                        style={{
                                            backgroundColor: "rgb(198, 2, 36)",
                                            borderRadius: "5px",
                                            color: 'white',
                                            padding: '1px 7px',
                                        }}
                                    >
                                        {translate('private message', 'رسالة خاصة')}
                                    </span>
                                </>
                            }

                        </p>
                    }
                    <p
                        className="mb-0 mt-1"
                        style={{
                            color: "#8E8E8E",
                            fontWeight: "500",
                            fontSize: "13px",
                        }}
                    >
                        <span style={{ fontFamily: checkFontFamily() }}>{`${getSessionInfo('language') === 'arabic' ? ' مقدم' : 'Submitted '} `}</span>{formatDate(props.date)}
                    </p>

                    {
                        !props.isTimeline && !props.isReply &&
                        <>
                            <button
                                className={classes.button}
                                style={{ fontWeight: "500", fontFamily: checkFontFamily(), paddingLeft: getSessionInfo('language') === 'arabic' ? '' : '0', paddingRight: getSessionInfo('language') === 'arabic' ? '0' : '', }}
                                onClick={toggleReplyState}
                            >
                                <ReplyIcon style={{ fontSize: "13px" }} />
                                {getSessionInfo('language') === 'arabic' ? ' رد ' : 'Reply'}
                            </button>
                            <input
                                type="file"
                                id={`file - ${props.comment_id} `}
                                // accept="image/*"
                                style={{ display: "none" }}
                                onChange={uploadFile}
                            />
                            <label
                                htmlFor={`file - ${props.comment_id} `}
                                className="pointer"
                                style={{ fontFamily: checkFontFamily() }}
                            >
                                <AttachFileIcon style={{ fontSize: "13px" }} /> {getSessionInfo('language') === 'arabic' ? 'يربط' : 'Attach'}
                            </label>
                            {miniSpinner && (
                                <div className="spinner-border spinner-border-sm text-muted ml-3"></div>
                            )}
                        </>
                    }

                </div>

            </div>
            {
                replyOpen &&
                <div className={`${getSessionInfo('language') === 'arabic' ? "mr-3" : "ml-3"} `}>
                    <TextArea
                        placeholder={getSessionInfo('language') === 'arabic' ? 'اكتب رد ...' : 'Write a reply...'}
                        className=" mt-1"
                        minRows={1}
                        maxRows={2}
                        value={message}
                        onChange={(e) =>
                            handleChange(e)
                        }
                        style={{
                            resize: "none",
                            padding: "15px",
                            border: "1px solid lightgrey",
                            borderRadius: "5px",
                            boxShadow: "-1px 1px 1px 0px #e0e0e0",
                            width: "100%",
                        }}
                    />

                    <button
                        disabled={props.buttonDisabled}
                        className={`d-flex pt-2 px-3 mt-2 ${getSessionInfo('language') === 'arabic' ? 'mr-auto' : 'ml-auto'} `}
                        onClick={() => {
                            props.postComment(message, false, props.comment_id)
                            toggleReplyState()
                            setMessage('')
                        }}
                        style={{
                            fontWeight: "600",
                            background: "none",
                            padding: "0.7rem 2.4rem",
                            border: "none",
                            color: "rgb(198 2 36)",
                            fontFamily: checkFontFamily()
                        }}
                    >
                        {getSessionInfo('language') === 'arabic' ? 'إرسال' : 'Submit'}
                    </button>
                </div>
            }
            {<hr style={{ color: '#999999' }} />}
        </div >
    )
}

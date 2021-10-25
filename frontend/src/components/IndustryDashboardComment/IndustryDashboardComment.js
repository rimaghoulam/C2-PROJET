import React from 'react'

import { Button } from 'reactstrap'

import { makeAvatarName, formatDate, translate, checkFontFamily, checkTextAlignment, downloadCommentFile } from '../../functions';

import pdf from '../../assets/images_svg/pdf.svg';

import Avatar from "@material-ui/core/Avatar";
import ReplyIcon from '@material-ui/icons/Reply';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';


// user_name     date    message   job_type    job_id    history
export default function IndustryDashboardComment(props) {

    return (
        <>
            <div className="d-flex mt-4">
                <div>
                    <div>
                        <Avatar style={{ backgroundColor: '#b6bf00', fontSize: "16px" }}>{makeAvatarName(props.user_name)}</Avatar>
                    </div>
                </div>
                <div className={`ml-1 ${checkTextAlignment() === 'text-right' && 'ml-0'}`}>
                    <div className={`mb-1 ${checkTextAlignment()}`} style={{ fontSize: '12px' }}>{props.job_name}</div>
                    <div className={`mb-2 ${checkTextAlignment()} ${checkTextAlignment() === 'text-right' && 'mr-1'}`} style={{ fontFamily: checkFontFamily(), fontSize: '11px', color: "#6F6F6F" }}> {translate('Submitted by', "تم الرد من خلال")} {props.user_name}<p> {translate('On', "في")} {formatDate(props.date)}</p> </div>
                    <div className={`mb-1 ${checkTextAlignment()} ${checkTextAlignment() === 'text-right' && 'mr-1'}`} style={{ fontSize: '12px' }}>{props.comment_type === 'text' ? props.message : <Button
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
                    </Button>}</div>

                    <div className={`d-flex mt-2 mb-3 ${checkTextAlignment() === 'text-right' && 'mr-1'}`}>

                        <div className="pointer" style={{ fontSize: '12px', color: "#6E6259", fontFamily: checkFontFamily() }}
                            onClick={() => props.history.push('/discussion/' + btoa(encodeURIComponent(props.job_id)))}><ReplyIcon style={{ fontSize: '12px', color: '#6E6259' }}
                            />
                            &nbsp; {translate('Reply', 'الرد')} &nbsp;
                        </div>
                        <div className="ml-2 pointer" style={{ fontFamily: checkFontFamily(), fontWeight: '500', fontSize: '12px', color: "#6E6259" }}
                            onClick={() =>
                                props.history.push((props.job_type === 'internship' ? '/internship_details/' : '/challenge_details/') + btoa(encodeURIComponent(props.job_id)))}><FiberManualRecordIcon style={{ fontSize: '4px', color: "#6E6259" }}
                            />
                            &nbsp; {props.job_type === 'internship' ? translate('View Internship', 'عرض التدريب') : translate('View Challenge', 'عرض التحدي')}
                        </div>

                    </div>

                </div>
            </div>
            <div className="break_line" />
        </>
    )
}

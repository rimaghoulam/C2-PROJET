import React from 'react'

import { formatDate, checkFontFamily, checkTextAlignment, translate, toArabicDigits } from '../../functions'
import { getSessionInfo } from '../../variable'

import classes from './Card.module.css'

import internship_icon from '../../assets/images_png/internship_icon.png';
import challenge_icon from '../../assets/images_png/challenge_icon.png';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SmsIcon from '@material-ui/icons/Sms';

// key     date    history    job_id    path    job_type(chall/intern)  job_name   job_status   comment_count     small

// challenge:    job_description

// internship: internship_locations    startDate   endDate   downloadPDF
export default function ChallengeInternshipCard(props) {

    // discussionChallengeRelation.current = { ...discussionChallengeRelation.current, [item.job_id]: item.challenge_name }

    return (

        <div key={props.key}
            className={`${props.small ? 'col-lg-4' : 'col-lg-6'} mb-3 h-100`}
        >

            <div className="card h-100" style={{ boxShadow: '1px 1px 2px 1px #e0e0e0' }}>
                <div className="card-body h-100" style={{ marginBottom: "-1.2rem" }}>

                    <div className="d-flex pointer" style={{ height: '70%' }} onClick={() => props.history.push({
                        pathname: props.path + btoa(encodeURIComponent(props.job_id)),
                    })}>
                        <div>
                            <div>
                                <img src={props.job_type === 'challenge' ? challenge_icon : internship_icon} alt="job icon" className={classes.challengeIcon} />
                            </div>
                        </div>
                        <div className={`flex-fill ${translate('ml-1', 'mr-1')}`} style={{ width: 0, height: '150px' }}>

                            <div className="d-flex">
                                <div className="card-title" style={{ fontFamily: checkFontFamily(true), fontSize: '1rem' }}>{props.job_name}</div>
                                <div className={`${getSessionInfo('language') === 'arabic' ? 'mr-auto ml-1' : 'ml-auto mr-1'}`}><MoreHorizIcon style={{ color: '#e98300' }} /></div>
                            </div>

                            {props.job_type === 'challenge' ?
                                <div className={`${classes.description} ${checkTextAlignment()} `}>{props.job_description}</div>
                                :
                                <>
                                    {props.date && <div className={`card-text ${checkTextAlignment()}`} style={{ color: "#7C7C7C", fontSize: '0.9rem' }}> <span style={{ fontFamily: checkFontFamily() }}>{translate("Submitted", "مقدمة بتاريخ ")} </span>{formatDate(props.date)}</div>}
                                    {props.startDate && <div className={`card-text ${checkTextAlignment()}`} style={{ color: "#7C7C7C", fontSize: '0.9rem' }}><span style={{ fontFamily: checkFontFamily() }}>{translate("From", "من عند")}</span> {formatDate(props.startDate)} <span style={{ fontFamily: checkFontFamily() }}>{translate("till", "حتى")}</span> {formatDate(props.endDate)}</div>}
                                    {props.internship_locations && <div className={`card-text ${checkTextAlignment()}`} style={{ color: "#7C7C7C", fontSize: '0.9rem' }}><span style={{ fontFamily: checkFontFamily() }}>{translate("Location:", "موقع:")}</span> {props.internship_locations}</div>}
                                </>
                            }
                            <div className={`mt-3 ${checkTextAlignment()}`}><button className={classes.jobStatusButton}> {props.job_status}</button></div>

                        </div>
                    </div>
                    <div className="break_line mt-4 mt-lg-5" />

                    <div className="d-sm-flex justify-content-between just mb-3">
                        {props.job_type === 'challenge' ?
                            <div className={`pr-lg-0 mr-lg-0 ${checkTextAlignment()}`} style={{ color: '#8E8E8E', fontSize: '0.9rem' }}> {translate("Submitted", "مقدمة بتاريخ ")} {formatDate(props.date)} </div>
                            :
                            <button className={`${classes.pdfButton}  ${checkTextAlignment()}`} style={{ fontSize: '0.9rem', fontFamily: checkFontFamily() }} onClick={() => props.downloadPDF(props.job_id, props.job_name + "-kpp.pdf")}>{translate('Download PDF', "عرض PDF")}</button>
                        }

                        <div className={`${translate('ml-0 ml-lg-auto', 'mr-0 mr-lg-auto')}`} style={{ color: '#8E8E8E', fontSize: '0.9rem' }}>
                            <SmsIcon style={{ color: '#e98300', fontSize: '17px' }} />
                            ({translate(props.comment_count, toArabicDigits(props.comment_count.toString()))})<span style={{ fontFamily: checkFontFamily() }} className={`${translate('pr-1', 'pl-1')}`}> {translate(`comment${props.comment_count > 1 ? 's' : ''}`, 'تعليقات')}</span> </div>
                    </div>

                </div>
            </div>



        </div>

    )
}

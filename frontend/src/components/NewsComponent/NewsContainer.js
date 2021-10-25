import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { Link } from 'react-router-dom'

import { getSessionInfo } from "../../variable";

import '../../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewsContainer.css';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


export default function News(props) {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // TO be refactored

    function toArabicDigits(number) {
        var id = ['۰', '۱', '۲', '۳', '٤', '۵', '٦', '۷', '۸', '۹'];
        return number.replace(/[0-9]/g, function (w) {
            return id[+w]
        });
    }

    var mydate = new Date(props.date);
    var month = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"][mydate.getMonth()];
    var dateStr = month + ' ' + mydate.getDate() + ', ' + mydate.getFullYear();

    var monthAR = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"][mydate.getMonth()];
    var year = mydate.getFullYear().toString();
    var day = mydate.getDate().toString();

    var dateStrAR = toArabicDigits(day) + ' ' + monthAR + ',  ' + toArabicDigits(year);

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    return (
        <div className={`col-lg-5`} >

            {getSessionInfo('language') === 'arabic' ?
                <>
                    {
                        props.image !=='' ? 
                        <img src={props.image} alt="img" style={{ width: '100%', background: '#eaeaea' }} className={`text-right ${props.class}`}  />
                        :
                        <Skeleton height={300} />
                    }
                    <div className="mt-3 text-right " style={{ color: '#5A5A5A', fontSize: '16px', width: '100%', fontFamily: 'cnam-ar' }}>{dateStrAR}</div>
                    {
                        props.location && 
                            <div className="mt-0 text-right" style={{ color: '#5A5A5A', fontSize: '14px', width: '100%', fontFamily:'cnam-ar'}}>موقع: {props.location}</div>
                    }
                    <div className="mt-0 text-right" style={{ fontFamily: 'cnam-bold-ar', fontSize: '22px', width: '100%' }}>{props.title}</div>
                    <div className="mt-0  text-right" style={{ color: '#5A5A5A', fontSize: '16px', width: '100%', fontFamily: 'cnam-ar' }}>{props.body}</div>
                    <div className="mt-0 mb-5 text-right">
                        <Link style={{ color: 'rgb(198, 2, 36)', fontFamily: 'cnam-ar' }} className="link text-right" to={`/news_details/${btoa(encodeURIComponent(props.id))}`}>قراءة المزيد<ArrowBackIcon className="Arrow-ar" style={{ fontSize: "16px" }} /></Link>
                    </div>
                </>

                : <>
                    {
                        props.image !=='' ? 
                        <img src={props.image} alt="img" style={{ width: '100%', background: '#eaeaea' }} className={`text-right ${props.class}`}  />
                        :
                        <Skeleton height={300} />
                    }
                    <div className="mt-3" style={{ color: '#5A5A5A', fontSize: '14px', width: '100%', }}>{dateStr}</div>
                    {
                        props.location && 
                            <div className="mt-0" style={{ color: '#5A5A5A', fontSize: '14px', width: '100%', }}>Location: {props.location}</div>
                    }
                    <div className="mt-1" style={{ fontFamily: 'cnam-bold', fontSize: '22px', width: '100%', }}>{props.title}</div>
                    <div className="mt-1 " style={{ color: '#5A5A5A', fontSize: '16px', lineHeight: '140%', width: '100%' }}>{props.body}</div>
                    <div className="mt-1 mb-5">
                        <Link style={{ color: 'rgb(198, 2, 36)' }} className="link " to={`/news_details/${btoa(encodeURIComponent(props.id))}`}>Read more<ArrowForwardIcon style={{ fontSize: "16px" }} /></Link>
                    </div>
                </>
            }

        </div>
    )
}

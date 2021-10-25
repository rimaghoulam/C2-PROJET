import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { WS_LINK } from '../../globals'
import { getSessionInfo } from '../../variable';

import '../../App.css'


export default function Terms(props) {


    const [pageData, setPageData] = useState([])


    useEffect(() => {
        props.setPageTitle('Terms of Service', 'شروط الخدمة')
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        const postedData = {
            page_id: 9,
        };

        props.toggleSpinner(true);

        axios({
            method: "post",
            url: `${WS_LINK}get_page_component`,
            data: postedData,
            cancelToken: source.token,
        })
            .then((res) => {
                setPageData({ ...res.data });
                props.toggleSpinner(false);
            })
            .catch((err) => {
                props.toggleSpinner(false);
                if (axios.isCancel(err)) {
                    console.log("request canceled");
                } else {
                    console.log("request failed");
                }
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        pageData.length === 0 ?
            <></>
            :
            <>
                {getSessionInfo("language") === "english" ?
                    (
                        <>
                            <div className="pagesHeaderTitle" style={{ backgroundColor: "#4CC9B7", padding: "30px", paddingLeft: "10%", fontFamily: 'cnam' }}>
                                <div className="row justify-content-start px-3 px-lg-0">
                                    <div className="text-white col-lg-5" style={{ fontSize: "28px", fontFamily: "cnam-bold" }}>
                                        Terms Of Use
                                    </div>
                                    <div className="col-lg-5"></div>
                                </div>
                            </div>
                            <div className="pagesHeaderTitle col-lg-11" style={{ paddingLeft: "10%", fontFamily: 'cnam' }}>
                                <div className="row justify-content-start bg-white hide_scrollbar px-3 px-lg-0 homePageBigContainer mt-5" style={{}}>
                                    <div dangerouslySetInnerHTML={{ __html: pageData.components[0].english }} />
                                </div>
                            </div>

                        </>
                    )

                    : //------------ARABIC-------------

                    (
                        <>
                            <div className="pagesHeaderTitle-ar" style={{ backgroundColor: "#4CC9B7", padding: "30px", paddingRight: "10%", fontFamily: 'cnam-ar' }}>
                                <div className="row justify-content-start px-3 px-lg-0">
                                    <div className="text-white col-lg-5" style={{ fontSize: "28px", fontFamily: "cnam-bold-ar" }}>
                                        شروط الاستخدام
                                    </div>
                                    <div className="col-lg-5"></div>
                                </div>
                            </div>
                            <div className="pagesHeaderTitle-ar col-lg-11" style={{ paddingRight: "10%", fontFamily: 'cnam-ar' }}>
                                <div className="row justify-content-start bg-white hide_scrollbar px-3 px-lg-0 homePageBigContainer mt-5" style={{}}>
                                    <div dangerouslySetInnerHTML={{ __html: pageData.components[0].arabic }} />
                                </div>
                            </div>
                        </>
                    )
                }
            </>
    )
}
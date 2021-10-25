import React,{ useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios";

import { WS_LINK, } from "../../globals";
import { downloadFile} from '../../functions'

export default function DownloadJobId(props) {
    
    /* eslint-disable no-unused-vars */
    const [loaderState, setLoaderState] = useState(false);

    let { jobid } = useParams();

    useEffect(() => {

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        const postedData = {
            jobid: jobid,
        };

        setLoaderState(true);
        axios({
            method: "post",
            url: `${WS_LINK}download_job_pdf `,
            data: postedData,
            cancelToken: source.token,
        })
            .then((res) => {
                if(res.data !== 'no type') downloadFile(res.data, `job-${jobid}.pdf`)
                props.history.push('/')
            })
            .catch((err) => {
                setLoaderState(false);
                if (axios.isCancel(err)) {
                    console.log("request canceled");
                } else {
                    console.log("request failed");
                }
            });

        setLoaderState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            
        </div>
    )
}

import React from 'react';
import { getSessionInfo } from '../variable';

import Clear from '@material-ui/icons/Clear';

import CNAM_logo from '../assets/images_png/CNAM_logo.png';

import "./Simple.css";
import "../App.css";

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

export default function Simple({ props, left, right, logo, noBack }) {
    return (
        <div style={{direction : (getSessionInfo('language') === 'arabic') && 'rtl'}}>

            <div className="col-lg-12">

                <div className="row for_reverse">

                    <div className="col-12 col-lg-7 simple-Left " >
                        {(!noBack || getSessionInfo('language') === 'arabic')&&
                            getSessionInfo('language') === 'arabic' ? 
                            <div className=" mb-2 back text-right" style={{ color: 'rgb(198 2 36)', fontFamily:'cnam-ar'}} onClick={() => props.history.goBack()}><ArrowBackIosIcon className="ml-1" style={{ fontSize: '13px',marginTop:"-2px", transform:'rotate(180deg)' }} />إرجع</div>
                            :
                            <div className=" mb-2 back" style={{ color: 'rgb(198 2 36)'}} onClick={() => props.history.goBack()}><ArrowBackIosIcon style={{ fontSize: '13px',marginTop:"-2px" }} />Back</div>
                        }
                        <div className="p-0 " style={{overflowY:'visible'}}>
                            {left}
                        </div>
                    </div>
                    {right &&
                        <div className="col-12 col-lg-5 d-flex flex-column simple-Right remove_customscroll_mobile" >
                            {getSessionInfo('language') === 'english' && 
                            <div className="d-flex" >
                                <div className="ml-auto"><Clear fontSize="large" className="pointer" onClick={() => props.history.goBack()} /></div>
                            </div>
                            }
                            <div className="d-flex flex-fill align-items-center justify">
                                <div className="row width75 " style={{textAlign : getSessionInfo('language') === 'arabic' && 'right'}}>
                                    {logo &&
                                        <div className="mb-3 ">
                                            <img  src={CNAM_logo} width={90} alt="LOGO" style={{ filter: 'brightness(0) invert(1)' }} />
                                        </div>
                                    }
                                    {right}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
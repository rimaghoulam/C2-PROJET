import React, { useState } from 'react';
import axios from 'axios';
import Loader from "react-loader-advanced";
import { Helmet } from "react-helmet";

import { WS_LINK } from '../../../../globals'
import { getSessionInfo, clearSessionInfo } from "../../../../variable"

import Simple from '../../../../containers/Simple'
import Spinner from "../../../../components/spinner/Spinner";

import '../../../../App.css'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

export default function IndustryAssist(props) {

  if (getSessionInfo("role") !== 3 && !getSessionInfo("loggedIn")) props.history.replace("/")





  const [loaderState, setLoaderState] = useState(false);






  const check_agree = () => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
    };

    setLoaderState(true);
    axios({
      method: "post",
      url: `${WS_LINK}get_agree_guidline`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {

        if (res.data !== "role error" && res.data !== "token error") {


          if (res.data.length === 1) {

            const cancelToken = axios.CancelToken;
            const source = cancelToken.source()

            const postedData = {
              userid: getSessionInfo('id'),
              token: getSessionInfo('token')
            }


            axios({
              method: "post",
              url: `${WS_LINK}check_self_signed_nda`,
              data: postedData,
              cancelToken: source.token,
            })
              .then(res => {

                // console.log(res.data)
                if (res.data && res.data.length !== 0 && res.data === 'yes')

                  props.history.push('/post_challenge')

                else props.history.push('/nda')



              }
              )
              .catch(err => {
                props.toggleSpinner(false)
                if (axios.isCancel(err)) {
                  console.log('request canceled')
                }
                else {
                  console.log("request failed")
                }

              });
          } else props.history.push('/nda')
        }
        else {
          clearSessionInfo()
          window.location.reload(false).then(props.history.replace('/'))
        }
      })
      .catch((err) => {
        setLoaderState(false);

        if (axios.isCancel(err)) {
          console.log("request canceled");
        } else {
          console.log("request failed");
        }
      });
  }










  return (
    <>
      <Helmet>
        <title>{getSessionInfo('language') === 'arabic' ?
          'الصناعة تساعد |عن برنامج الشراكة المعرفية.'
          :
          'Industry Assist | CNAM PORTAL'
        }</title>
      </Helmet>
      {getSessionInfo("language") === "english" ? (
        <Loader
          message={
            <span>
              <Spinner />{" "}
            </span>
          }
          show={loaderState}
          backgroundStyle={{ zIndex: "9999", }}
        >
          <Simple
            props={props}

            logo={true}
            left={
              <div className="container p-0">
                <div className="col-lg-12 preRegister ">

                  <div className="row text-left">
                    <div className="d-flex w-100">
                      <div className="mb-4 px-0 mx-0 mt-2" style={{ fontFamily: "cnam-bold", fontSize: '1.5rem' }}>How can we assist you?</div>
                      <span className="mt-3 pointer ml-auto" style={{ fontSize: '13px', color: '#eb972c', fontWeight: 'bold' }} onClick={() => props.history.goBack()}>Skip for now</span>
                    </div>
                    <div className="col-lg-12 bg-white p-3 white_card" style={{ boxShadow: "0px 0px 2px #888888", borderRadius: 4, }}>
                      <div style={{ fontSize: '15px', fontWeight: "500" }}>We are facing challenges with our projects and we are looking for consultation from the CNAM university team.</div>
                      <div className=" mt-3 " style={{ fontSize: '16px', fontWeight: '600', cursor: 'pointer' }} ><div style={{ textDecoration: 'none', color: 'rgb(198 2 36)' }} onClick={check_agree}>Post a challenge <ArrowForwardIosIcon style={{ fontSize: '16px' }} /></div></div>


                    </div>

                    <div className="col-lg-12 mt-4 bg-white p-3 white_card" style={{ boxShadow: "0px 0px 2px #888888", borderRadius: 4, }}>
                      <div style={{ fontSize: '15px', fontWeight: "500" }}>We are looking for interns and we would like you to recommend PhD/Masters students from CNAM university.</div>
                      <div className=" mt-3" style={{ fontSize: '16px', fontWeight: '600', cursor: 'pointer' }} ><div style={{ textDecoration: 'none', color: 'rgb(198 2 36)' }} onClick={() => props.history.push('/post_internship')}>Post an internship <ArrowForwardIosIcon style={{ fontSize: '16px' }} /></div></div>
                    </div>

                  </div>



                </div>
              </div>

            }
            right={
              <>
                <div>
                  <div className="mb-2" style={{ fontFamily: 'cnam-bold', fontSize: '18px' }}>Welcome to CNAM Industry KPP</div>
                  <div style={{ fontSize: '15px', width: '88%' }}>This space will be used to explain the benefits registration the company or Industry information. </div>
                </div>
              </>
            }
          />
        </Loader>
      )

        : //-------ARABIC--------

        (
          <Loader
            message={
              <span>
                <Spinner />{" "}
              </span>
            }
            show={loaderState}
            backgroundStyle={{ zIndex: "9999", }}
          >
            <Simple
              props={props}

              logo={true}
              left={
                <div className="container p-0 text-right" style={{ fontFamily: 'cnam-ar' }}>
                  <div className="col-lg-12 preRegister text-right">

                    <div className="row text-right">
                      <div className="d-flex w-100">
                        <div className="mb-4 px-0 mx-0 mt-2" style={{ fontFamily: "cnam-bold-ar", fontSize: '1.5rem' }}>كيف يمكننا مساعدتك؟</div>
                        <span className="mt-3 pointer mr-auto" style={{ fontSize: '13px', color: '#eb972c', fontWeight: 'bold' }} onClick={() => props.history.goBack()}>تخطي في الوقت الراهن</span>
                      </div>
                      <div className="col-lg-12 bg-white p-3 white_card" style={{ boxShadow: "0px 0px 2px #888888", borderRadius: 4, }}>
                        <div style={{ fontSize: '15px', fontWeight: "500" }}>نحن نواجه تحديات في مشاريعنا ونبحث عن استشارة من فريق جامعة كاوست.</div>
                        <div className=" mt-3 " style={{ fontSize: '16px', fontWeight: '600', cursor: 'pointer' }} ><div style={{ textDecoration: 'none', color: 'rgb(198 2 36)' }} onClick={check_agree}>اطلب التحدي <ArrowBackIosIcon style={{ fontSize: '16px' }} /></div></div>


                      </div>

                      <div className="col-lg-12 mt-4 bg-white p-3 white_card" style={{ boxShadow: "0px 0px 2px #888888", borderRadius: 4, }}>
                        <div style={{ fontSize: '15px', fontWeight: "500" }}>نحن نبحث عن متدربين ونود منكم تزكية طلاب الدكتوراه / الماجستير من جامعة كاوست.</div>
                        <div className=" mt-3" style={{ fontSize: '16px', fontWeight: '600', cursor: 'pointer' }} ><div style={{ textDecoration: 'none', color: 'rgb(198 2 36)' }} onClick={() => props.history.push('/post_internship')}>اطلب فترة تدريب <ArrowBackIosIcon style={{ fontSize: '16px' }} /></div></div>
                      </div>

                    </div>



                  </div>
                </div>

              }
              right={
                <>
                  <div>
                    <div className="mb-2" style={{ fontFamily: 'cnam-bold-ar', fontSize: '18px' }}>مرحبًا بكم في <span style={{ fontFamily: 'cnam' }}>CNAM Industry KPP</span></div>
                    <div style={{ fontSize: '15px', width: '88%', fontFamily: 'cnam-ar' }}>سيتم استخدام هذه المساحة لشرح فوائد تسجيل المنشأة أو معلومات الشركات الصغيرة والمتوسطة.</div>
                  </div>
                </>
              }
            />
          </Loader>
        )
      }
    </>
  )
}

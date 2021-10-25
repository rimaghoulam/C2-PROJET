import React, { useEffect, useState } from 'react'
// import { useForm, Controller } from "react-hook-form";
import axios from "axios";

// import Loader from 'react-loader-advanced';
// import { toast } from 'react-toastify'
// import Spinner from "../../components/spinner/Spinner";
// import DatePicker from '../../components/Date-Picker/PickerDate'
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import { Button } from 'reactstrap';

import { getSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";

import Footer from '../../components/footer/Footer'
// import InputText from '../../components/InputText/InputText';

import '../../App.css'
import './IndustryKpp.css';
import 'bootstrap/dist/css/bootstrap.min.css';






export default function AboutTheProgram(props) {


  // const [loaderState, setLoaderState] = useState(false)
  const [PAGEDATA, setPageData] = useState({})



  useEffect(() => {
    props.setPageTitle('Eligibility', 'الاهليه')
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source()

    const postedData = {
      page_id: 2
    }

    props.toggleSpinner(true)

    axios({
      method: "post",
      url: `${WS_LINK}get_page_component`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {
        setPageData({ ...res.data })
        props.toggleSpinner(false)
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  // const {
  //   control,
  //   setValue,
  //   handleSubmit,
  //   formState: { errors },
  //   // watch,
  // } = useForm({
  //   defaultValues: {
  //     title: "",
  //     fullName: "",
  //     email: "",
  //     phone: "",
  //     time: "",
  //   },
  // });

  // const onSubmit = (data) => {
  //   document
  //     .getElementById("requestMeeting")
  //     .scrollIntoView({ behavior: "smooth", block: 'center' });



  //   const cancelToken = axios.CancelToken;
  //   const source = cancelToken.source();

  //   const postedData = {
  //     title: data.title,
  //     name: data.fullName,
  //     email: data.email,
  //     phone: data.phone,
  //     time: data.time.value,
  //   };

  //   setLoaderState(true);

  //   axios({
  //     method: "post",
  //     url: `${WS_LINK}request_meeting`,
  //     data: postedData,
  //     cancelToken: source.token,
  //   })
  //     .then((res) => {
  //       setValue('title', '')
  //       setValue('fullName', '')
  //       setValue('email', '')
  //       setValue('phone', '')
  //       setValue('time', '')
  //       errors.title = false
  //       errors.fullName = false
  //       errors.email = false
  //       errors.phone = false
  //       errors.time = false
  //       // eslint-disable-next-line no-lone-blocks
  //       {
  //         getSessionInfo('language') === 'english' ?
  //           (
  //             toast.success(
  //               'Meeting requested successfully!', {
  //               position: "top-right",
  //               autoClose: 2000,
  //               hideProgressBar: true,
  //               closeOnClick: true,
  //               pauseOnHover: false,
  //               draggable: false,
  //               progress: undefined,
  //             })
  //           )
  //           :
  //           (
  //             toast.success(
  //               'تم طلب الإجتماع بنجاح !', {
  //               position: "top-left",
  //               textAlign: 'right',
  //               autoClose: 2000,
  //               hideProgressBar: true,
  //               closeOnClick: true,
  //               pauseOnHover: false,
  //               draggable: false,
  //               progress: undefined,
  //             })
  //           )
  //       }
  //       setLoaderState(false);
  //     })
  //     .catch((err) => {
  //       setLoaderState(false);

  //       if (axios.isCancel(err)) {
  //         console.log("request canceled");
  //       } else {
  //         console.log("request failed");
  //       }
  //     });
  // };



  return (
    <div>
      {PAGEDATA.components &&
        <>
          {getSessionInfo("language") === "english" ? (
            <div className="bg-white hide_scrollbar largeScreen px-3 px-lg-0 homePageBigContainer" style={{}}>

              <div className=" pad-0 aboutMargin " style={{ backgroundColor: '#4CC9B7', margin: '0px -30px' }}>
                <div className=" marb-5">

                  <div className="mb-4">
                    <div className="row">
                      <div className="col-5 meeting">
                        <div className="container mt-5 mb-3 p-0 text-nowrap text-white industry_title industry " style={{ fontSize: "28px", fontFamily: "cnam-bold" }} >Eligibility</div>
                      </div>

                    </div>
                  </div>


                </div>
              </div>



              <div className="guideline_info pad-0" style={{ marginTop: '', marginBottom: '3rem' }}>

                <div className="row justify-content-center" >

                  <div className="col-lg-10 guideline_info" >
                    <div className=" mt-0 " style={{ fontSize: "28px", fontFamily: "cnam-bold" }}>{PAGEDATA.components[6].english && PAGEDATA.components[6].english}</div>

                    <div className=" mt-4 mb-4" style={{ color: '#616161', lineHeight: '150%', fontSize: '18px', fontFamily: "cnam-bold" }}>{PAGEDATA.components[5].english && PAGEDATA.components[5].english}</div>

                    <div dangerouslySetInnerHTML={{ __html: PAGEDATA.components[7].english && PAGEDATA.components[7].english }} style={{ overflowX: 'auto' }} className="eligibility-table" />

                  </div>

                </div>

              </div>
              <Footer data={PAGEDATA.footer} socials={PAGEDATA.social} />
            </div>

          )

            :

            // ----------ARABIC------------

            (
              <div className="bg-white hide_scrollbar largeScreen px-3 px-lg-0 homePageBigContainer" style={{ textAlign: 'right', overflowX: 'hidden' }}>


                <div className=" pad-0 aboutMargin " style={{ backgroundColor: '#4CC9B7', margin: '0px -30px' }}>
                  <div className=" marb-5">

                    <div className="mb-4">
                      <div className="row">
                        <div className="col-5 meeting">
                          <div className="container mt-5 mb-3 p-0 text-nowrap text-white industry_title-ar industry-ar " style={{ fontSize: "28px", fontFamily: "cnam-bold-ar" }} >جدارة</div>
                        </div>

                      </div>
                    </div>


                  </div>
                </div>


                <div className="guideline_info pad-0" style={{ marginBottom: '3rem' }}>

                  <div className="row justify-content-center" >

                    <div className="col-lg-10 guideline_info" >

                      <div className=" mt-0 " style={{ fontSize: "28px", fontFamily: "cnam-bold-ar" }}>{PAGEDATA.components[6].arabic && PAGEDATA.components[6].arabic}</div>

                      <div className=" mt-4 mb-4" style={{ color: '#616161', lineHeight: '150%', fontSize: '18px', fontFamily: "cnam-bold-ar" }}>{PAGEDATA.components[5].arabic && PAGEDATA.components[5].arabic}</div>

                      {/* /////////////////////////////////////////////////////////////////// */}

                      <span dangerouslySetInnerHTML={{ __html: PAGEDATA.components[7].arabic && PAGEDATA.components[7].arabic }} style={{ overflowX: 'auto' }} className="eligibility-table-ar" />


                    </div>

                    <div className="col-lg-0">
                    </div>

                  </div>

                </div>


                <Footer data={PAGEDATA.footer} socials={PAGEDATA.social} />
              </div>
            )
          }
        </>
      }
    </div>
  )
}
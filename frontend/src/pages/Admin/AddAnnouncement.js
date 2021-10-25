import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet";

import { WS_LINK } from "../../globals";
import { getSessionInfo, clearSessionInfo } from "../../variable";

import InputText from "../../components/InputText/InputText";
import Selector from "../../components/Selector/Selector";
import Simple from "../../containers/Simple";
import Spinner from "../../components/spinner/Spinner";
import Modal from '../../components/Modal/Modal'
import Loader from "react-loader-advanced";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";

import { Button } from "reactstrap";

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';

import "../../App.css";
import "../Common/Register/Register.css";

export default function AddAnnouncement(props) {
  if (!getSessionInfo("loggedIn") && getSessionInfo("role") !== 4) {
    props.history.replace("/dashboard");
  }

  // STATES

  const [retrievedList, setRetrievedList] = useState("");
  const [loaderState, setLoaderState] = useState(false);

  const [modalState, setModalState] = useState(false)


  const changeModalState = () => {
    setModalState(!modalState)
  }

  // FORM VALIDATION
  const {
    control,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      subject: "",
      list: "",
      messageBody: "",
    },
  });

  // PAGE CREATION
  useEffect(() => {

    // props.setPageTitle('Add Announcement', 'إضافة إعلان')

    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
    };

    setLoaderState(true);

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    axios({
      method: "post",
      url: `${WS_LINK}get_mailchimp_lists`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        setLoaderState(false);
        if (getSessionInfo('role') !== 4 || res.data === "token error") {
          clearSessionInfo()
          window.location.reload(false).then(props.history.replace('/'))
        }
        else {
          let options = [];
          for (let i = 0; i < res.data.length; i++) {
            options[i] = {
              value: res.data[i].id,
              label: `${res.data[i].name.charAt(0).toUpperCase() +
                res.data[i].name.slice(1)
                } (${res.data[i].stats.member_count})`,
            };
          }
          setRetrievedList(options);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* const submit = (data) => {
  if(!error) setError(true)
  else onSubmit(data)
} */



  // CREATE ANNOUNCEMENT

  const onSubmit = (data) => {
    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
      camp_name: data.name,
      list: data.list.value,
      subject: data.subject,
      message: data.messageBody,
    };

    setLoaderState(true)

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source()
    axios({
      method: "post",
      url: `${WS_LINK}send_newsletter`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {
        setLoaderState(false)
        if (res.data === 'success')
          setModalState(true)
        // for(let i=0; i< res.data.length; i++){
        //   options[i] = {value: res.data[i].id, label: `${res.data[i].name} (${res.data[i].stats.member_count})` }
        // }
        // setRetrievedList(options)
      })
      .catch(err => {
        setLoaderState(false)
        if (axios.isCancel(err)) {
          console.log('request canceled');
        }
        else {
          console.log("request failed")

        }
      })
  };


  const modalBody =
    <div>
      <div className="row">
        <div className="ml-auto mr-4"><CloseIcon onClick={() => props.history.goBack()} /></div>
      </div>
      <div style={{ color: 'rgb(198 2 36)' }} className="row">
        <div style={{ margin: 'auto' }}><CheckCircleOutlineIcon style={{ height: '7vh', width: '7vh' }} /></div>
      </div>
      <div className="row mt-3 mb-3">
        {
          getSessionInfo('language') === 'english' ?
            (
              <div style={{ margin: 'auto', fontSize: '1rem' }}>
                Your announcement has been sent successfully!
              </div>
            )

            :

            (
              <div style={{ margin: 'auto', fontSize: '1.2rem', fontFamily: 'cnam-ar' }}>
                تم إرسال إعلانك بنجاح!
              </div>
            )
        }
      </div>
      <div className="row">
        {
          getSessionInfo('language') === 'english' ?
            (
              <Button className="px-3" style={{
                margin: 'auto',
                color: "rgb(198 2 36)",
                borderColor: "rgb(198 2 36)",
                backgroundColor: "transparent",
                fontSize: "0.9rem",
                fontWeight: "500",
                fontFamily: getSessionInfo("language") === "arabic" ? 'cnam-ar' : ''
              }} onClick={() => props.history.goBack()}>OK</Button>
            )

            :

            (
              <Button className="px-3" style={{ margin: 'auto', fontFamily: 'cnam-ar' }} color='primary' onClick={() => props.history.goBack()}>نعم</Button>
            )
        }
      </div>
    </div>

  ////////////subject

  return (
    <>
      {getSessionInfo("language") === "english" ?
        (
          <Loader
            message={
              <span>
                <Spinner />{" "}
              </span>
            }
            show={loaderState}
            backgroundStyle={{ zIndex: "9999" }}
          >
            <Helmet>
              <title>{getSessionInfo('language') === 'arabic' ?
                'إضافة إعلان |.عن برنامج الشراكة المعرفية.'
                :
                'Add Announcement | cnam KPP'
              }
              </title>
            </Helmet>
            <Modal
              modalState={modalState}
              changeModalState={changeModalState}
              modalBody={modalBody}
            />
            <Simple
              props={props}
              noBack={true}
              logo={true}
              left={
                <>
                  <div
                    className="col-12 noP"
                    style={{ fontFamily: "cnam-bold", fontSize: "1.8rem" }}
                    id="name"
                  >
                    Send Announcement
                  </div>
                  <div
                    className="col-12 h5 mb-4 mt-2 noP"
                    style={{ fontSize: "1.3rem", fontWeight: "600" }}
                  ></div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div
                      className="col-12 mb-2 noP"
                      style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}
                    >
                      Name *
                    </div>

                    <div className="col-12 noP">
                      <Controller
                        render={({ field: { onChange, value } }) => (
                          <InputText
                            placeholder="Name"
                            value={value}
                            onChange={onChange}
                            style={{ border: errors.name ? "1px solid red" : "" }}
                          />
                        )}
                        defaultValue=""
                        rules={{ required: true, minLength: 4 }}
                        name="name"
                        control={control}
                      />
                      {errors.name && errors.name.type === "required" && (
                        <span className="errors">Name is required.</span>
                      )}
                    </div>

                    <div
                      className="col-12 mt-3 mb-2 noP"
                      style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}
                    >
                      Subject *
                    </div>

                    <div className="col-12 noP">
                      <Controller
                        render={({ field: { onChange, value } }) => (
                          <InputText
                            placeholder="Subject"
                            value={value}
                            onChange={onChange}
                            style={{ border: errors.subject ? "1px solid red" : "" }}
                          />
                        )}
                        defaultValue=""
                        rules={{ required: true }}
                        name="subject"
                        control={control}
                      />
                      {errors.subject && errors.subject.type === "required" && (
                        <span className="errors">Subject is required.</span>
                      )}
                    </div>

                    <div
                      className="col-12 mb-2 mt-3  noP"
                      style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}
                    >
                      List*
                    </div>
                    <div className="col-12 noP">
                      <Controller
                        render={({ field: { onChange, value } }) => (
                          <Selector
                            name="list"
                            value={value}
                            className="w_shadow"
                            onChange={onChange}
                            options={retrievedList}
                            placeholder="Choose List"
                            style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                          />
                        )}
                        rules={{ required: true }}
                        name="list"
                        control={control}
                      />
                      {errors.subject && errors.subject.type === "required" && (
                        <span className="errors">List is required.</span>
                      )}
                    </div>

                    <div
                      className="col-12 mb-2 mt-3  noP"
                      style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}
                    >
                      Message Body
                    </div>
                    <div className="col-12 noP" style={{ height: '50vh' }}>
                      <Controller
                        render={({ field: { onChange, value } }) => (
                          <RichTextEditor
                            name="messageBody"
                            value={value}
                            onChange={(content, delta, source, editor) =>
                              onChange(content, "messageBody")}
                            placeholder="Please enter a message"
                            error={errors.messageBody}
                          />
                        )}
                        rules={{ required: true }}
                        name="messageBody"
                        control={control}
                      />
                      {errors.messageBody && (
                        <span className="errors">Message body is required.</span>
                      )}
                    </div>

                    <div className="col-lg-12 p-0" >
                      <div className="ml-auto col-lg-4 noP mt-5">
                        <Button
                          type="submit"
                          className="mt-5"
                          style={{
                            backgroundColor: "rgb(198 2 36)",
                            border: "none",
                            fontSize: "0.9rem",
                            padding: "0.7rem 2.4rem",
                            fontFamily: "cnam-bold",
                          }}
                        >
                          Send Now
                        </Button>
                      </div>
                    </div>
                  </form>
                </>
              }
              right={
                <>
                  <div
                    className="col-12  p-0 mt-2"
                    style={{ fontFamily: "cnam-bold", fontSize: "18px" }}
                  >
                    Create & make a change!
                  </div>
                  <div className="col-12 p-0 mt-2" style={{ fontSize: "15px" }}>
                    Website announcements are the pop-ups, website banners and every other type of message positioning hosted on the company website intended to catch the attention of the new and returning customers with important company news.
                  </div>
                </>
              }
            />
          </Loader>
        )


        : // ARABIC


        (
          <Loader
            message={
              <span>
                <Spinner />{" "}
              </span>
            }
            show={loaderState}
            backgroundStyle={{ zIndex: "9999" }}
          >
            <Modal
              modalState={modalState}
              changeModalState={changeModalState}
              modalBody={modalBody}
            />
            <Simple
              props={props}
              noBack={true}
              logo={true}
              left={
                <div className="text-right" style={{ fontFamily: 'cnam-ar' }}>
                  <div
                    className="col-12 noP"
                    style={{ fontFamily: "cnam-bold-ar", fontSize: "1.8rem" }}
                    id="name"
                  >
                    إرسال الإعلان
                  </div>
                  <div
                    className="col-12 h5 mb-4 mt-2 noP"
                    style={{ fontSize: "1.3rem", fontWeight: "600" }}
                  ></div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div
                      className="col-12 mb-2 noP"
                      style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}
                    >
                      اسم *
                    </div>

                    <div className="col-12 noP pr-2">
                      <Controller
                        render={({ field: { onChange, value } }) => (
                          <InputText
                            placeholder="اسم"
                            value={value}
                            onChange={onChange}
                            style={{ border: errors.name ? "1px solid red" : "" }}
                          />
                        )}
                        defaultValue=""
                        rules={{ required: true, minLength: 4 }}
                        name="name"
                        control={control}
                      />
                      {errors.name && errors.name.type === "required" && (
                        <span className="errors">مطلوب اسم.</span>
                      )}
                    </div>

                    <div
                      className="col-12 mt-3 mb-2 noP "
                      style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}
                    >
                      موضوع *
                    </div>

                    <div className="col-12 noP pr-2">
                      <Controller
                        render={({ field: { onChange, value } }) => (
                          <InputText
                            placeholder="موضوع"
                            value={value}
                            onChange={onChange}
                            style={{ border: errors.subject ? "1px solid red" : "" }}
                          />
                        )}
                        defaultValue=""
                        rules={{ required: true }}
                        name="subject"
                        control={control}
                      />
                      {errors.subject && errors.subject.type === "required" && (
                        <span className="errors">الموضوع مطلوب.</span>
                      )}
                    </div>

                    <div
                      className="col-12 mb-2 mt-3  noP"
                      style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}
                    >
                      قائمة*
                    </div>
                    <div className="col-12 noP pr-2">
                      <Controller
                        render={({ field: { onChange, value } }) => (
                          <Selector
                            name="list"
                            value={value}
                            className="w_shadow"
                            onChange={onChange}
                            options={retrievedList}
                            placeholder="اختر قائمة"
                            style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                          />
                        )}
                        rules={{ required: true }}
                        name="list"
                        control={control}
                      />
                      {errors.subject && errors.subject.type === "required" && (
                        <span className="errors">القائمة مطلوبة.</span>
                      )}
                    </div>

                    <div
                      className="col-12 mb-2 mt-3  noP"
                      style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}
                    >
                      محتوى الرسالة
                    </div>
                    <div className="col-12 noP pr-2" style={{ height: '50vh', direction: 'ltr' }}>
                      <Controller
                        render={({ field: { onChange, value } }) => (
                          <RichTextEditor
                            style={{ direction: 'ltr', textAlign: 'left' }}

                            name="messageBody"
                            value={value}
                            onChange={(content, delta, source, editor) =>
                              onChange(content, "messageBody")}
                            placeholder='من فضلك أدخل رسالة'
                            error={errors.messageBody}
                          />
                        )}
                        rules={{ required: true }}
                        name="messageBody"
                        control={control}
                        language='ar'
                      />
                      {errors.messageBody && (
                        <span className="errors" style={{ direction: 'rtl' }}> الرسالة مطلوبة.</span>
                      )}
                    </div>

                    <div className="col-lg-12 p-0" >
                      <div className="ml-auto col-lg-4 noP mt-5">
                        <Button
                          type="submit"
                          className="mt-5" Your announcement has been
                          style={{
                            backgroundColor: "rgb(198 2 36)",
                            border: "none",
                            fontSize: "0.9rem",
                            padding: "0.7rem 2.4rem",
                            fontFamily: "cnam-bold-ar",
                          }}
                        >
                          ارسل الان
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              }
              right={
                <>
                  <div
                    className="col-12  p-0 mt-2"
                    style={{ fontFamily: "cnam-bold-ar", fontSize: "18px" }}
                  >
                    إنشاء وإجراء تغيير!
                  </div>
                  <div className="col-12 p-0 mt-2" style={{ fontSize: "15px", fontFamily: 'cnam-ar' }}>
                    إعلانات الموقع هي المنبثقة، لافتات مواقع الويب وكل نوع آخر من وضع الرسائل المستضاف على موقع المنشأة المقصود للقبض على انتباه العملاء الجديدة والعودة مع أخبار المنشأة الهامة. </div>
                </>
              }
            />
          </Loader>
        )
      }

    </>
  );
}

// <div className="col-12 mb-2 mt-3  noP" style={{ fontFamily: "cnam-bold", fontSize: '0.92rem' }}>Language</div>
//              <div className="col-12 noP">
//
//                <Selector
//                 name="language"
//                  value={addObj.language}
//                  className="w_shadow"
//                  onChange={(e) => handleChange('language', e)}
//                  options={[
//                   { value: "test", label: "test" },
// { value: "test2", label: "test2" },
// ]}
// placeholder="Select Language"
// style={{ boxShadow: "0px 1px 3px -2px #888888" }}
// />
// </div>
//<Selector
// name="template"
// value={addObj.template}
// className="w_shadow"
// onChange={(e) => handleChange('template', e)}
// options={[
//   { value: "test", label: "test" },
//   { value: "test2", label: "test2" },
// ]}
// placeholder="Select Template"
//              style={{ boxShadow: "0px 1px 3px -2px #888888" }}
//                />

// <div className="col-lg-8 mt-4 noP" style={{ color: '#848484', fontSize: '13px' }}>
// By submitting you information, you agree to cnam{" "}
//<Link to="/" style={{ color: "#848484", textDecoration: "underline" }}>Terms of Service</Link> and{" "}
//<Link to="/" style={{ color: "#848484", textDecoration: "underline" }} >Privacy Policy</Link>. You can opt out anytime.
//</div>



                //  <Controller
                  // render={({ field: { onChange, value } }) => (
                  //   <ReactQuill
                  //     id="txtDescription"
                  //     // ref={(el) => {
                  //     //   quillObj = el;
                  //     // }}
                  //     value={value}
                  //     modules={{
                  //       toolbar: {
                  //         container: [
                  //           [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  //           ["bold", "italic", "underline"],
                  //           [{ list: "ordered" }, { list: "bullet" }],
                  //           [{ align: [] }],
                  //           ["link", "image"],
                  //           ["clean"],
                  //           [{ color: [] }],
                  //         ],
                  //         // handlers: {
                  //         //   image: imageHandler
                  //         // }
                  //       },
                  //       table: true,
                  //     }}
                  //     placeholder="Add a message body for your announcemnet"
                  //     onChange={(content, delta, source, editor) =>
                  //       console.log(content, delta, source, editor)
                  //     }
                  //   />
                  // )}
                  // rules={{ required: true }}
                  // name="list"
                  // control={control}
                // /> 
                //  {errors.subject && errors.subject.type === "required" && (
                  // <span className="errors">List is required.</span>
                // )} 
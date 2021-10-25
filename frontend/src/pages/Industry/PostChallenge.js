import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "react-loader-advanced";
import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet";

import { WS_LINK } from "../../globals";
import { downloadFile } from '../../functions'
import { getSessionInfo, clearSessionInfo } from "../../variable";


import InputText from "../../components/InputText/InputText";
import ChallengeModal from "../../components/PageModals/ChallengeModal";
import Selector from "../../components/Selector/Selector";
import TextareaAutosize from "../../components/Text-Area/TextArea";
import Spinner from "../../components/spinner/Spinner";

import Upload from "../../assets/images_svg/upload_icons.svg";

import '../Common/Register/Register.css'
import "../../App.css";
import "../../containers/Simple.css";
import "./PostChallenge.css";


import Clear from "@material-ui/icons/Clear";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

export default function PostAChallenge(props) {


  if (getSessionInfo("role") !== 3) {
    props.history.replace("/")
  }



  const Errors = useRef()
  Errors.current = {
    r1: false,
    r2: false,
    r3: false
  }

  const {
    // setValue,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: { radio1: 'No', radio2: 'No', radio3: 'No', challenge_description: '' } });

  const [mailModal, setMailModal] = useState(false);
  const closeModal = () => {
    setMailModal(!mailModal);
  };

  const [miniSpinner, setMiniSpinner] = useState(false);

  const [loaderState, setLoaderState] = useState(false);

  const [firstSubmit, setFirstSubmit] = useState(false)

  const [otherInputOpen, setOtherInputOpen] = useState({
    challengeType: false,
    hearAboutUs: false
  })


  // const [radioErrors, setRadioErrors] = useState({
  //   radio1: false,
  //   radio2: false,
  //   radio3: false,
  // })


  const hear_about_us = [
    { value: "Social media", label: <span style={{ fontFamily: 'cnam' }}>Social media</span> },
    { value: "cnam website", label: <span style={{ fontFamily: 'cnam' }}>cnam website</span> },
    { value: "Friend", label: <span style={{ fontFamily: 'cnam' }}>Friend</span> },
    { value: "Government agencies", label: <span style={{ fontFamily: 'cnam' }}>Government agencies</span> },
    { value: "Monshaat", label: <span style={{ fontFamily: 'cnam' }}>Monshaat</span> },
    { value: "Modon", label: <span style={{ fontFamily: 'cnam' }}>Modon</span> },
    { value: "Jeddah chamber", label: <span style={{ fontFamily: 'cnam' }}>Jeddah chamber</span> },
    { value: "Other", label: <span style={{ fontFamily: 'cnam' }}>Other</span> },
  ];

  const hear_about_us_ar = [
    { value: "Social media", label: <span style={{ fontFamily: 'cnam-ar' }}>منصات التواصل الاجتماعي</span> },
    { value: "cnam website", label: <span style={{ fontFamily: 'cnam-ar' }}>موقع الجامعة</span> },
    { value: "Friend", label: <span style={{ fontFamily: 'cnam-ar' }}>صديق</span> },
    { value: "Government agencies", label: <span style={{ fontFamily: 'cnam-ar' }}>جهات حكومية​</span> },
    { value: "Monshaat", label: <span style={{ fontFamily: 'cnam-ar' }}>هيئة منشآت​</span> },
    { value: "Modon", label: <span style={{ fontFamily: 'cnam-ar' }}>هيئة مدن​</span> },
    { value: "Jeddah chamber", label: <span style={{ fontFamily: 'cnam-ar' }}>غرفة جدة</span> },
    { value: "Other", label: <span style={{ fontFamily: 'cnam-ar' }}>آخر</span> },
  ];

  const challenge_types = [
    { value: "Energy", label: <span style={{ fontFamily: 'cnam' }}>Energy</span> },
    { value: "Material Science", label: <span style={{ fontFamily: 'cnam' }}>Material Science</span> },
    { value: "Computer Science", label: <span style={{ fontFamily: 'cnam' }}>Computer Science</span> },
    { value: "Super/High Computing", label: <span style={{ fontFamily: 'cnam' }}>Super/High Computing</span> },
    { value: "Engineering", label: <span style={{ fontFamily: 'cnam' }}>Engineering</span> },
    { value: "Clean Combustion", label: <span style={{ fontFamily: 'cnam' }}>Clean Combustion</span> },
    { value: "Marine Science", label: <span style={{ fontFamily: 'cnam' }}>Marine Science</span> },
    { value: "Visualization", label: <span style={{ fontFamily: 'cnam' }}>Visualization</span> },
    { value: "Water Desalination", label: <span style={{ fontFamily: 'cnam' }}>Water Desalination</span> },
    { value: "Bioscience", label: <span style={{ fontFamily: 'cnam' }}>Bioscience</span> },
    { value: "Nanotechnology", label: <span style={{ fontFamily: 'cnam' }}>Nanotechnology</span> },
    { value: "Artificial Intelligence", label: <span style={{ fontFamily: 'cnam' }}>Artificial Intelligence</span> },
    { value: "Membranes", label: <span style={{ fontFamily: 'cnam' }}>Membranes</span> },
    { value: "Agricultural", label: <span style={{ fontFamily: 'cnam' }}>Agricultural</span> },
    { value: "Communication", label: <span style={{ fontFamily: 'cnam' }}>Communication</span> },
    { value: "Manufacturing", label: <span style={{ fontFamily: 'cnam' }}>Manufacturing</span> },
    { value: "3D Printing", label: <span style={{ fontFamily: 'cnam' }}>3D Printing</span> },
    { value: "3D design", label: <span style={{ fontFamily: 'cnam' }}>3D design</span> },
    { value: "Modeling & Simulation", label: <span style={{ fontFamily: 'cnam' }}>Modeling & Simulation</span> },
    { value: "Machining", label: <span style={{ fontFamily: 'cnam' }}>Machining</span> },
    { value: "Prototyping", label: <span style={{ fontFamily: 'cnam' }}>Prototyping</span> },
    { value: "Sensing", label: <span style={{ fontFamily: 'cnam' }}>Sensing</span> },
    { value: "Actuation", label: <span style={{ fontFamily: 'cnam' }}>Actuation</span> },
    { value: "Other", label: <span style={{ fontFamily: 'cnam' }}>Other</span> },
  ];

  const challenge_types_ar = [
    { value: "Energy", label: <span style={{ fontFamily: 'cnam-ar' }}>طاقة</span> },
    { value: "Material Science", label: <span style={{ fontFamily: 'cnam-ar' }}>علم المواد</span> },
    { value: "Computer Science", label: <span style={{ fontFamily: 'cnam-ar' }}>علوم الكمبيوتر</span> },
    { value: "Super/High Computing", label: <span style={{ fontFamily: 'cnam-ar' }}>حوسبة سوبر / عالية</span> },
    { value: "Engineering", label: <span style={{ fontFamily: 'cnam-ar' }}>هندسة</span> },
    { value: "Clean Combustion", label: <span style={{ fontFamily: 'cnam-ar' }}>احتراق نظيف</span> },
    { value: "Marine Science", label: <span style={{ fontFamily: 'cnam-ar' }}>العلوم البحرية</span> },
    { value: "Visualization", label: <span style={{ fontFamily: 'cnam-ar' }}>التصور</span> },
    { value: "Water Desalination", label: <span style={{ fontFamily: 'cnam-ar' }}>تحلية المياه</span> },
    { value: "Bioscience", label: <span style={{ fontFamily: 'cnam-ar' }}>البيولوجية</span> },
    { value: "Nanotechnology", label: <span style={{ fontFamily: 'cnam-ar' }}>التكنولوجيا النانوية</span> },
    { value: "Artificial Intelligence", label: <span style={{ fontFamily: 'cnam-ar' }}>الذكاء الاصطناعي</span> },
    { value: "Membranes", label: <span style={{ fontFamily: 'cnam-ar' }}>الأغشية</span> },
    { value: "Agricultural", label: <span style={{ fontFamily: 'cnam-ar' }}>زراعي</span> },
    { value: "Communication", label: <span style={{ fontFamily: 'cnam-ar' }}>تواصل</span> },
    { value: "Manufacturing", label: <span style={{ fontFamily: 'cnam-ar' }}>تصنيع</span> },
    { value: "3D Printing", label: <span style={{ fontFamily: 'cnam-ar' }}>الطباعة ثلاثية الأبعاد</span> },
    { value: "3D design", label: <span style={{ fontFamily: 'cnam-ar' }}>تصميم ثلاثي الأبعاد</span> },
    { value: "Modeling & Simulation", label: <span style={{ fontFamily: 'cnam-ar' }}>النمذجة والمحاكاة</span> },
    { value: "Machining", label: <span style={{ fontFamily: 'cnam-ar' }}>بالقطع</span> },
    { value: "Prototyping", label: <span style={{ fontFamily: 'cnam-ar' }}>النماذج الأولية</span> },
    { value: "Sensing", label: <span style={{ fontFamily: 'cnam-ar' }}>الاستشعار</span> },
    { value: "Actuation", label: <span style={{ fontFamily: 'cnam-ar' }}> يشتغل</span> },
    { value: "Other", label: <span style={{ fontFamily: 'cnam-ar' }}>آخر</span> },
  ];
  const [descriptionObj, setDescriptionObj] = useState({
    challenge_name: "",
    challenge_type: "",
    challenge_description: "",
    approach_specify: "",
    affected_specify: "",
    challenge_date: "",
    anticipate: "",
    reference: "",
    inputs: {},
    files: [],
  });



  const handleChange = (name, value) => {
    setDescriptionObj({ ...descriptionObj, [name]: value });
  };

  const handleOtherSelected = (isOther, name) => {
    if (isOther && !otherInputOpen[name]) setOtherInputOpen({ ...otherInputOpen, [name]: true })
    else if (!isOther && otherInputOpen[name]) setOtherInputOpen({ ...otherInputOpen, [name]: false })
  }




  const handleOnFileChange = (e) => {
    if (e.target.files.length > 0) {
      let images = e.target.files[0];
      let fd = new FormData();
      fd.append("file", images);


      setMiniSpinner(true);
      axios({
        method: "post",
        url: `${WS_LINK}upload_image`,
        data: fd,
      }).then((res) => {
        if (res.data !== "error") {

          let tmpFiles = descriptionObj.files
          tmpFiles.push({
            fileName: e.target.files[0].name,
            fileSend: res.data,
          })

          setDescriptionObj(p => ({
            ...p,
            "files": tmpFiles
          }));
        }
        else {
          toast.error("failed to upload file", {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
        }
        setMiniSpinner(false);
      })
        .catch(
          err => {
            console.log(err)
            toast.error("failed to upload file", {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });
            setMiniSpinner(false);
          }
        )
    }
  };




  const removeFile = (index) => {


    setDescriptionObj(p => ({
      ...p,
      "files": p.files.filter((item, i) => i !== index && item)
    }))

  }


  const onSubmit = (data) => {



    if (!Errors.current.r1 && !Errors.current.r2 && !Errors.current.r3) {


      const cancelToken = axios.CancelToken;
      const source = cancelToken.source();

      const postedData = {
        userid: getSessionInfo("id"),
        challengeName: data.challenge_name,
        challengeType: otherInputOpen.challengeType ? data.otherChallengeType : data.challenge_type.value,
        challengeDescription: data.challenge_description,
        approach: data.radio1,
        approachChallSpecification: watch('approach_specify') !== ' ' && data.radio1 === "Yes" ? data.approach_specify : '',
        challengeTime: descriptionObj.challenge_date,
        companyAffected: data.radio2,
        companyAffectedSpecification: watch('affected_specify') !== ' ' && data.radio2 === "Yes" ? data.affected_specify : '',
        cost: data.radio3,
        costSpecification: watch('anticipate') !== ' ' && data.radio3 === "Yes" ? data.anticipate : '',
        hear: otherInputOpen.hearAboutUs ? data.otherHearAboutUs : data.reference.value,
        token: getSessionInfo("token"),
        files: descriptionObj.files.map(item => item.fileSend),
        fileNames: descriptionObj.files.map(item => item.fileName),
      };


      setLoaderState(true);
      axios({
        method: "post",
        url: `${WS_LINK}post_challenge`,
        data: postedData,
        // headers: { "content-type": "application/json" },
        cancelToken: source.token,
      })
        .then((res) => {

          if (res.data !== "role error" && res.data !== "token error") {

            setLoaderState(false);
            if (res.data.length === 0) {
              //if  fails
              toast.error("failed to register", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
              });
            } else {
              if (res.data.length === 1) {
                // if challenge already exists
                toast.error(res.data[0], {
                  position: "top-right",
                  autoClose: 2500,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  progress: undefined,
                });
              } else {
                setMailModal(true);
              }
            }
          }
          else {
            clearSessionInfo()
            window.location.reload(false).then(props.history.replace('/'))
          }
        })
        .catch((err) => {
          //    props.toggleSpinner(false)
          setLoaderState(false);
          toast.error("Couldn't post challenge!", {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
          if (axios.isCancel(err)) {
            console.log("request canceled");
          } else {
            console.log("request failed");
          }
        });
    }

  };

  const scroll = () => {

    document.getElementById('name').scrollIntoView({ behavior: 'smooth' })

  }
  const spec_val = () => {
    if (watch('radio1') === "Yes" || watch('radio2') === "Yes" || watch('radio3') === "Yes")
      return true
    else return false
  }





  //* *************************************************************
  //* *************************************************************
  //* *************************************************************

  // to fix the error of radio
  if (firstSubmit) {

    if (watch('radio1') === 'No' && errors.approach_specify) {
      delete errors['approach_specify']
      Errors.current = { ...Errors.current, r1: false }
    }
    if (watch('radio2') === 'No' && errors.affected_specify) {
      delete errors['affected_specify']
      Errors.current = { ...Errors.current, r2: false }
    }
    if (watch('radio3') !== 'Yes' && errors.anticipate) {
      delete errors['anticipate']
      Errors.current = { ...Errors.current, r3: false }
    }


    if ((watch('radio1') === 'Yes' && watch('approach_specify') && watch('approach_specify').length < 1) ||
      (watch('radio1') === 'Yes' && !watch('approach_specify'))) {
      errors['approach_specify'] = true
      Errors.current = { ...Errors.current, r1: true }
    }
    if ((watch('radio2') === 'Yes' && watch('affected_specify') && watch('affected_specify').length < 1) ||
      (watch('radio2') === 'Yes' && !watch('affected_specify'))) {
      errors['affected_specify'] = true
      Errors.current = { ...Errors.current, r2: true }
    }
    if ((watch('radio3') === 'Yes' && watch('anticipate') && watch('anticipate').length < 1) ||
      (watch('radio3') === 'Yes' && !watch('anticipate'))) {
      errors['anticipate'] = true
      Errors.current = { ...Errors.current, r3: true }
    }
  }





  return (
		<>
			<Helmet>
				<title>{getSessionInfo("language") === "arabic" ? "عن برنامج الشراكة المعرفية | آخر التحدي" : "Post Challenge | CNAM Portal"}</title>
			</Helmet>
			{getSessionInfo("language") === "english" ? (
				<Loader
					message={
						<span>
							<Spinner />{" "}
						</span>
					}
					show={loaderState}
					backgroundStyle={{ zIndex: "9999" }}
				>
					<div className="">
						<div className="col-12">
							<div className="row for_reverse">
								<div className="col-12 col-lg-7 simple-Left">
									<div className=" mb-2 back" style={{ color: "rgb(198 2 36)" }} onClick={() => props.history.goBack()}>
										<ArrowBackIosIcon style={{ fontSize: "13px", marginTop: "-2px" }} />
										Back
									</div>

									<div className="row ">
										<ChallengeModal props={props} state={mailModal} toggleState={closeModal} />
										<div className="col-12" style={{ fontFamily: "cnam-bold", fontSize: "1.8rem" }} id="name">
											Post your challenge
										</div>
										<div className="col-12 h5 mt-2 mb-4">Our team will review it and get back to you within x hours.</div>
										<form style={{ paddingLeft: 0 }} onSubmit={handleSubmit(onSubmit)}>
											<div className="col-12 mb-1" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Challenge Name *
											</div>

											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															value={value}
															onChange={onChange}
															style={{
																border: errors.challenge_name ? "1px solid red" : "",
																fontSize: "14px",
															}}
														/>
													)}
													rules={{ required: true }}
													name="challenge_name"
													control={control}
													placeholder="Challenge Name"
												/>
												{errors.challenge_name && errors.challenge_name.type === "required" && (
													<span className="errors">Challenge Name is required.</span>
												)}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Challenge Type *
											</div>
											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => (
														<Selector
															className={errors.challenge_type && "border_form_selector"}
															options={challenge_types}
															placeholder="Select the challenge type"
															onChange={(e) => {
																onChange(e);
																handleOtherSelected(e.value === "Other", "challengeType");
															}}
															value={value}
														/>
													)}
													rules={{ required: true }}
													name="challenge_type"
													control={control}
												/>
												{errors.challenge_type && <span className="errors">Challenge Type is required.</span>}
												{otherInputOpen.challengeType && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{
																		border: errors.otherChallengeType ? "1px solid red" : "",
																		fontSize: "14px",
																	}}
																	placeholder="please specify"
																	className="mt-2"
																/>
															)}
															rules={{ required: true }}
															name="otherChallengeType"
															control={control}
														/>
														{errors.otherChallengeType && (
															<span className="errors">Challenge type specification is required.</span>
														)}
													</>
												)}
											</div>

											<div className="col-12 d-flex mt-4 mb-1 align-items-end">
												<div className="" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
													Describe Your Challenge *
												</div>
												<div className="ml-auto text-truncate " style={{ color: "#808080", fontSize: "13px" }}>
													{watch("challenge_description").length} of 500 characters
												</div>
											</div>
											<div className="col-12 ">
												<Controller
													render={({ field: { onChange, value } }) => (
														<TextareaAutosize
															style={{
																border: errors.challenge_description ? "1px solid red" : "",
																resize: "none",
																fontSize: "14px",
															}}
															className={`col-12 pt-3  ${watch("challenge_description").length === 500 && "max_char"}`}
															value={value}
															onChange={onChange}
															minRows={10}
															maxLength={500}
															placeholder="Please describe the challenge you are facing at your company"
														/>
													)}
													rules={{ required: true }}
													name="challenge_description"
													control={control}
												/>
												{errors.challenge_description && errors.challenge_description.type === "required" && (
													<span className="errors">Challenge description is required.</span>
												)}
											</div>
											<div className="col-12 mb-2 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Did you approach anyone to address this challenge?*
											</div>
											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => (
														<RadioGroup
															value={value ? value : "No"}
															onChange={(e) => {
																onChange(e.target.value, e.target.name);
															}}
														>
															<FormControlLabel
																style={{ marginBottom: 0 }}
																value="No"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label="No we didn't"
															/>
															<FormControlLabel
																value="Yes"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label="Yes"
															/>
														</RadioGroup>
													)}
													rules={{ required: watch("radio1") === "Yes" && true }}
													name="radio1"
													control={control}
												/>
												{errors.radio1 && <span className="errors">Required.</span>}
											</div>
											<div className="col-12">
												{watch("radio1") === "Yes" && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	style={{
																		border: errors.approach_specify ? "1px solid red" : "",
																		resize: "none",
																		fontSize: "14px",
																	}}
																	value={value}
																	onChange={onChange}
																	placeholder="Please specify"
																/>
															)}
															rules={{ validate: spec_val() }}
															name="approach_specify"
															control={control}
														/>
														{errors.approach_specify && <span className="errors">Specify the approach is required.</span>}
													</>
												)}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												How long do you have this challenge?
											</div>
											<div className="col-12 mt-1">
												<InputText
													style={{
														resize: "none",
														fontSize: "14px",
													}}
													value={descriptionObj.challenge_date}
													onChange={(e) => handleChange(e.target.name, e.target.value)}
													name="challenge_date"
													placeholder="Challenge date"
												/>
											</div>

											<div className="col-12 mb-2 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Is the company affected by this challenge? *
											</div>
											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => (
														<RadioGroup value={value ? value : "No"} onChange={onChange}>
															<FormControlLabel
																style={{ marginBottom: 0 }}
																value="No"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label="No"
															/>
															<FormControlLabel
																value="Yes"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label="Yes"
															/>
														</RadioGroup>
													)}
													rules={{ required: watch("radio2") === "Yes" && true }}
													name="radio2"
													control={control}
												/>
												{errors.radio2 && <span className="errors">Required.</span>}
											</div>
											<div className="col-12">
												{watch("radio2") === "Yes" && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<TextareaAutosize
																	style={{
																		border: errors.affected_specify ? "1px solid red" : "",
																		resize: "none",
																		fontSize: "14px",
																	}}
																	className="col-12 py-2"
																	value={value}
																	onChange={onChange}
																	minRows={7}
																	placeholder="Please specify how?"
																/>
															)}
															rules={{ validate: spec_val() }}
															name="affected_specify"
															control={control}
														/>
														{errors.affected_specify && (
															<span className="errors">Specify how the company is affected is required.</span>
														)}
													</>
												)}
											</div>

											<div className="col-12 mb-2 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Did you anticipate any cost to address this challenge? *
											</div>
											<div className="col-12  mt-1">
												<Controller
													render={({ field: { onChange, value } }) => (
														<RadioGroup value={value ? value : "No"} onChange={onChange}>
															<FormControlLabel
																style={{ marginBottom: 0 }}
																value="No"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label="No we didn't"
															/>
															<FormControlLabel
																value="Yes"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label="Yes"
															/>
														</RadioGroup>
													)}
													rules={{ required: watch("radio3") === "Yes" && true }}
													name="radio3"
													control={control}
												/>
												{errors.radio2 && <span className="errors">Required.</span>}
											</div>
											<div className="col-12  mt-1">
												{watch("radio3") === "Yes" && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	style={{
																		border: errors.anticipate ? "1px solid red" : "",
																		resize: "none",
																		fontSize: "14px",
																	}}
																	value={value}
																	onChange={onChange}
																	placeholder="Please specify"
																/>
															)}
															rules={{ validate: spec_val() }}
															name="anticipate"
															control={control}
														/>
														{errors.anticipate && (
															<span className="errors">Specify how you anticipated the cost is required.</span>
														)}
													</>
												)}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Attach supporting documents
											</div>
											<div className="d-flex mb-4 mt-2" style={{ flexWrap: "wrap" }}>
												<label
													style={{ textDecoration: "none", marginLeft: 15 }}
													htmlFor="exampleCustomFileBrowser"
													className="pointer"
												>
													<img src={Upload} width={13} alt="up-ic" />{" "}
													<span style={{ color: "#6C6C6C" }}>Upload PDF document</span>
													{miniSpinner && <div className="spinner-border spinner-border-sm text-muted ml-3"></div>}
												</label>
												<input
													type="file"
													style={{ display: "none" }}
													id="exampleCustomFileBrowser"
													name="files"
													onChange={handleOnFileChange}
													className="col-6 p-0"
													accept="application/pdf"
												/>

												{descriptionObj.files.length > 0 && (
													<div className="col-12">
														{descriptionObj.files.map((item, index) => (
															<div className="col-12 pl-0 my-1" key={item.fileSend + index}>
																<Clear className="mr-2 pointer" onClick={() => removeFile(index)} />
																<span onClick={() => downloadFile(item.fileSend, item.fileName)}>
																	{" "}
																	{item.fileName}{" "}
																</span>
															</div>
														))}
													</div>
												)}
											</div>

											<div className="col-12 mb-1 mt-4 " style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												How did you hear about us? *
											</div>
											<div className="col-12  mt-1 mb-4">
												<Controller
													render={({ field: { onChange, value } }) => (
														<Selector
															className={` ${errors.reference && "border_form_selector"}`}
															options={hear_about_us}
															placeholder="Select option"
															onChange={(e) => {
																onChange(e);
																handleOtherSelected(e.value === "Other", "hearAboutUs");
															}}
															value={value}
														/>
													)}
													rules={{ required: true }}
													name="reference"
													control={control}
												/>
												{errors.reference && <span className="errors">Reference is required.</span>}{" "}
												{otherInputOpen.hearAboutUs && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{
																		border: errors.otherHearAboutUs ? "1px solid red" : "",
																		fontSize: "14px",
																	}}
																	placeholder="please specify"
																	className="mt-2"
																/>
															)}
															rules={{ required: true }}
															name="otherHearAboutUs"
															control={control}
														/>
														{errors.otherHearAboutUs && <span className="errors">Specification is required.</span>}
													</>
												)}
											</div>
											<hr />

											<div className="d-sm-flex col-lg-12 p-0">
												<div className="col-lg-7 mt-4" style={{ color: "#848484", fontSize: "13px" }}>
													
												</div>
												<div className="mt-4 col-lg-5">
													<Button
														className="ml-sm-auto d-flex"
														disabled={miniSpinner}
														style={{
															fontFamily: "cnam-bold",
															background: "rgb(198 2 36)",
															padding: "0.7rem 1.5rem",
															border: "none",
														}}
														type="submit"
														onClick={() => {
															scroll();
															if (!firstSubmit) setFirstSubmit(true);
														}}
													>
														Submit Challenge
													</Button>
												</div>
											</div>
										</form>
									</div>
								</div>

								<div
									className="col-lg-5 d-flex flex-column padd p-0"
									style={{
										color: "white",
										backgroundColor: "rgb(198 2 36)",
										overflowY: "auto",
										height: "100vh",
									}}
								>
									<div className="d-flex mt-0 mt-md-3 mt-lg-5 mr-5">
										<div className="ml-auto">
											<Clear fontSize="large" className="pointer" onClick={() => props.history.goBack()} />
										</div>
									</div>

									<div className="d-flex flex-fill align-items-center justify-content-center pt-5 mt-0 mt-md-2">
										<div className="row " style={{ width: "90%" }}>
											<div className="container-fluid ">
												<div className="row justify-content-center">
													<div className="col-lg-12 ">
														<div
															className="challenge_guide"
															style={{ marginLeft: "1rem", fontFamily: "cnam-bold", fontSize: "20px" }}
														>
															Guidelines
														</div>
														<ul className="dash">
															<li className="mb-3">
																Your request will be evaluated based on resources and capabilities avaialble at CNAM.
															</li>
															<li className="mb-3">
																Post your challenge does not create any legal binding or any type of commitment.
															</li>
															<li className="mb-3">
																Industry must represent their business and work together with CNAM in your
																challenges/request.
															</li>
															<li className="mb-3">
																Make sure your challenge name, type, description are accurate and precise.
															</li>
															<li className="mb-3">
																Identifies your challenges/request with uploading more documents related to your
																request.
															</li>
															<li className="mb-3">
																CNAM may suspend or cancel the request/challenge from the Industry for any of the
																following reasons:
																<ul className="mb-3 dash">
																	<li className="mb-3">Failure to submit documents requested by CNAM.</li>
																	<li className="mb-3">Non-compliance with the NDA agreement.</li>
																	<li className="mb-3">Lack of cooperation with CNAM.</li>
																	<li className="mb-3">Providing wrong or forged data/information to CNAM.</li>
																</ul>
															</li>
															<li className="mb-3">
																In the event of a conflict between the Arabic text and the English text, the
																applicable and approved text is the English text.
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Loader>
			) : (
				//----------ARABIC------------

				<Loader
					message={
						<span>
							<Spinner />{" "}
						</span>
					}
					show={loaderState}
					backgroundStyle={{ zIndex: "9999" }}
				>
					<div className="" style={{ direction: "rtl", textAlign: "right", fontFamily: "cnam-ar" }}>
						<div className="col-12">
							<div className="row for_reverse">
								<div className="col-12 col-lg-7 simple-Left">
									<div className=" mb-2 back" style={{ color: "rgb(198 2 36)" }} onClick={() => props.history.goBack()}>
										<ArrowBackIosIcon style={{ fontSize: "13px", marginTop: "-2px", transform: "rotate(180deg)" }} />
										عودة
									</div>

									<div className="row ">
										<ChallengeModal props={props} state={mailModal} toggleState={closeModal} />
										<div className="col-12" style={{ fontFamily: "cnam-bold-ar", fontSize: "1.8rem" }} id="name">
											طلب التحدي الخاص بك
										</div>
										<div className="col-12 h5 mt-2 mb-4" style={{ fontFamily: "cnam-ar" }}>
											سيقوم فريقنا بمراجعة طلبك وسيتم التواصل معك في أقرب وقت ممكن​
										</div>
										<form style={{ paddingRight: 0 }} onSubmit={handleSubmit(onSubmit)}>
											<div className="col-12 mb-1" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												اسم التحدي *
											</div>

											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															value={value}
															onChange={onChange}
															placeholder="اسم التحدي"
															style={{
																border: errors.challenge_name ? "1px solid red" : "",
																fontSize: "14px",
															}}
														/>
													)}
													rules={{ required: true }}
													name="challenge_name"
													control={control}
												/>
												{errors.challenge_name && errors.challenge_name.type === "required" && (
													<span className="errors">مطلوب اسم التحدي.</span>
												)}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												نوع التحدي *
											</div>
											<div className="col-12" style={{ fontFamily: "cnam-ar" }}>
												<Controller
													render={({ field: { onChange, value } }) => (
														<Selector
															className={errors.challenge_type && "border_form_selector"}
															options={challenge_types_ar}
															placeholder="حدد نوع التحدي"
															onChange={(e) => {
																onChange(e);
																handleOtherSelected(e.value === "Other", "challengeType");
															}}
															value={value}
														/>
													)}
													rules={{ required: true }}
													name="challenge_type"
													control={control}
												/>
												{errors.challenge_type && <span className="errors">نوع التحدي مطلوب.</span>}
												{otherInputOpen.challengeType && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{
																		border: errors.otherChallengeType ? "1px solid red" : "",
																		fontSize: "14px",
																	}}
																	placeholder="يرجى تحديد"
																	className="mt-2"
																/>
															)}
															rules={{ required: true }}
															name="otherChallengeType"
															control={control}
														/>
														{errors.otherChallengeType && <span className="errors">مطلوب مواصفات نوع التحدي.</span>}
													</>
												)}
											</div>

											<div className="col-12 d-flex mt-4 mb-1 align-items-end">
												<div className="" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
													صف التحدي الخاص بك *
												</div>
												<div
													className="mr-auto text-truncate "
													style={{ color: "#808080", fontSize: "13px", textAlign: "left", direction: "ltr" }}
												>
													<span style={{ fontFamily: "cnam" }}>
														{watch("challenge_description").length} of 500 characters
													</span>
												</div>
											</div>
											<div className="col-12 ">
												<Controller
													render={({ field: { onChange, value } }) => (
														<TextareaAutosize
															style={{
																border: errors.challenge_description ? "1px solid red" : "",
																resize: "none",
																fontSize: "14px",
															}}
															className={`col-12 pt-3  ${watch("challenge_description").length === 500 && "max_char"}`}
															value={value}
															onChange={onChange}
															minRows={10}
															maxLength={500}
															placeholder="يرجى وصف التحدي الذي تواجهه في شركتك"
														/>
													)}
													rules={{ required: true }}
													name="challenge_description"
													control={control}
												/>
												{errors.challenge_description && errors.challenge_description.type === "required" && (
													<span className="errors">وصف التحدي مطلوب.</span>
												)}
											</div>

											<div className="col-12 mb-2 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												هل تم الاستعانة بأي جهة لحل المشكلة او التحدي؟​*
											</div>
											<div className="col-12" style={{ fontFamily: "cnam-ar" }}>
												<Controller
													render={({ field: { onChange, value } }) => (
														<RadioGroup
															value={value ? value : "No"}
															style={{ fontFamily: "cnam-ar" }}
															onChange={onChange}
														>
															<FormControlLabel
																style={{ marginBottom: 0, fontFamily: "cnam-ar", margiRight: "0" }}
																className="choice_selection"
																value="No"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label={<span style={{ fontFamliy: "cnam-ar" }}>لا لم نفعل ذلك</span>}
															/>
															<FormControlLabel
																value="Yes"
																className="choice_selection"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label="نعم"
															/>
														</RadioGroup>
													)}
													rules={{ required: watch("radio1") === "Yes" && true }}
													name="radio1"
													control={control}
												/>
												{errors.radio1 && <span className="errors">مطلوب.</span>}
											</div>
											<div className="col-12">
												{watch("radio1") === "Yes" && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	style={{
																		border: errors.approach_specify ? "1px solid red" : "",
																		resize: "none",
																		fontSize: "14px",
																	}}
																	value={value}
																	onChange={onChange}
																	placeholder="رجاء حدد"
																/>
															)}
															rules={{ validate: spec_val() }}
															name="approach_specify"
															control={control}
														/>
														{errors.approach_specify && <span className="errors">حدد النهج مطلوب.</span>}
													</>
												)}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												منذ متى والمنشآة تعاني من هذه المشكلة او التحدي​؟
											</div>
											<div className="col-12 mt-1">
												<InputText
													style={{
														resize: "none",
														fontSize: "14px",
													}}
													value={descriptionObj.challenge_date}
													onChange={(e) => handleChange(e.target.name, e.target.value)}
													name="challenge_date"
													placeholder="تاريخ التحدي"
												/>
											</div>

											<div className="col-12 mb-2 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												هل هناك اثر واضح على المنشأة بسبب هذا التحدي؟*
											</div>
											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => (
														<RadioGroup value={value ? value : "No"} onChange={onChange}>
															<FormControlLabel
																style={{ marginBottom: 0 }}
																value="No"
																className="choice_selection"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label="لا"
															/>
															<FormControlLabel
																value="Yes"
																className="choice_selection"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label="نعم"
															/>
														</RadioGroup>
													)}
													rules={{ required: watch("radio2") === "Yes" ? true : false }}
													name="radio2"
													control={control}
												/>
												{errors.radio2 && <span className="errors">مطلوب.</span>}
											</div>
											<div className="col-12">
												{watch("radio2") === "Yes" && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<TextareaAutosize
																	style={{
																		border: errors.affected_specify ? "1px solid red" : "",
																		resize: "none",
																		fontSize: "14px",
																	}}
																	className="col-12 py-2"
																	value={value}
																	onChange={onChange}
																	minRows={7}
																	placeholder="يرجى تحديد كيف؟"
																/>
															)}
															rules={{ validate: spec_val() }}
															name="affected_specify"
															control={control}
														/>
														{errors.affected_specify && <span className="errors">حدد كيفية تأثر المنشأة مطلوب.</span>}
													</>
												)}
											</div>

											<div className="col-12 mb-2 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												هل تتوقع أي تكلفة تقديرية لمواجهة هذا التحدي؟ ​*
											</div>
											<div className="col-12  mt-1">
												<Controller
													render={({ field: { onChange, value } }) => (
														<RadioGroup value={value ? value : "No"} onChange={onChange}>
															<FormControlLabel
																style={{ marginBottom: 0 }}
																className="choice_selection"
																value="No"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label="لا"
															/>
															<FormControlLabel
																value="Yes"
																className="choice_selection"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{ color: "rgb(198 2 36)" }}
																	/>
																}
																label="نعم"
															/>
														</RadioGroup>
													)}
													rules={{ required: watch("radio3") === "Yes" ? true : false }}
													name="radio3"
													control={control}
												/>
												{errors.radio2 && <span className="errors">مطلوب.</span>}
											</div>
											<div className="col-12  mt-1">
												{watch("radio3") === "Yes" && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	style={{
																		border: errors.anticipate ? "1px solid red" : "",
																		resize: "none",
																		fontSize: "14px",
																	}}
																	value={value}
																	onChange={onChange}
																	placeholder="رجاء حدد"
																/>
															)}
															rules={{ validate: spec_val() }}
															name="anticipate"
															control={control}
														/>
														{errors.anticipate && <span className="errors">حدد كيف توقعت التكلفة مطلوبة.</span>}
													</>
												)}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												إرفاق المستندات الداعمة
											</div>
											<div className="d-flex mb-4 mt-2" style={{ flexWrap: "wrap" }}>
												<label
													style={{ textDecoration: "none", marginRight: 15 }}
													htmlFor="exampleCustomFileBrowser"
													className="pointer"
												>
													<span style={{ color: "#6C6C6C" }}>
														تحميل وثيقة <span style={{ fontFamily: "cnam" }}>PDF </span>
													</span>
													<img src={Upload} width={13} alt="up-ic" />{" "}
													{miniSpinner && <div className="spinner-border spinner-border-sm text-muted ml-3"></div>}
												</label>
												<input
													type="file"
													style={{ display: "none" }}
													id="exampleCustomFileBrowser"
													name="files"
													onChange={handleOnFileChange}
													className="col-6 p-0"
													accept="application/pdf"
												/>

												{descriptionObj.files.length > 0 && (
													<div className="col-12">
														{descriptionObj.files.map((item, index) => (
															<div className="col-12 pl-0 my-1" key={item.fileSend + index}>
																<Clear className="mr-2 pointer" onClick={() => removeFile(index)} />
																<span
																	onClick={() => downloadFile(item.fileSend, item.fileName)}
																	style={{ fontFamily: "cnam" }}
																>
																	{" "}
																	{item.fileName}{" "}
																</span>
															</div>
														))}
													</div>
												)}
											</div>

											<div className="col-12 mb-1 mt-4 mb-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												كيف سمعتم عنا *
											</div>
											<div className="col-12  mt-1 ">
												<Controller
													render={({ field: { onChange, value } }) => (
														<Selector
															className={` ${errors.reference && "border_form_selector"}`}
															options={hear_about_us_ar}
															placeholder="حدد الخيار"
															onChange={(e) => {
																onChange(e);
																handleOtherSelected(e.value === "Other", "hearAboutUs");
															}}
															value={value}
														/>
													)}
													rules={{ required: true }}
													name="reference"
													control={control}
												/>
												{errors.reference && <span className="errors">المرجع مطلوب.</span>}{" "}
												{otherInputOpen.hearAboutUs && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{
																		border: errors.otherHearAboutUs ? "1px solid red" : "",
																		fontSize: "14px",
																	}}
																	placeholder="يرجى تحديد"
																	className="mt-2"
																/>
															)}
															rules={{ required: true }}
															name="otherHearAboutUs"
															control={control}
														/>
														{errors.otherHearAboutUs && <span className="errors">المواصفات مطلوبة.</span>}
													</>
												)}
											</div>
											<hr />

											<div className="d-sm-flex col-lg-12 p-0">
												<div className="col-lg-7 mt-4" style={{ color: "#848484", fontSize: "13px" }}>
													{" "}
													من خلال تقديم معلوماتك ، فإنك توافق على{" "}
													
														شروط الخدمة
												{" "}
													و{" "}
													
														سياسة الخصوصية
												
													بجامعة الملك عبدالله للعلوم والتقنية.
												</div>
												<div className="mt-4 col-lg-5">
													<Button
														className="ml-sm-auto d-flex"
														disabled={miniSpinner}
														style={{
															fontFamily: "cnam-bold-ar",
															background: "rgb(198 2 36)",
															padding: "0.7rem 1.5rem",
															border: "none",
														}}
														type="submit"
														onClick={() => {
															scroll();
															setFirstSubmit(true);
														}}
													>
														إرسال التحدي
													</Button>
												</div>
											</div>
										</form>
									</div>
								</div>

								<div
									className="col-lg-5 d-flex flex-column padd p-0"
									style={{
										color: "white",
										backgroundColor: "rgb(198 2 36)",
										overflowY: "auto",
										height: "100vh",
									}}
								>
									<div className="d-flex mt-0 mt-md-3 mt-lg-5 mr-5">
										<div className="mr-auto ml-3">
											<Clear fontSize="large" className="pointer" onClick={() => props.history.goBack()} />
										</div>
									</div>

									<div className="d-flex flex-fill align-items-center justify-content-center pt-5 mt-0 mt-md-2">
										<div className="row " style={{ width: "90%" }}>
											<div className="container-fluid ">
												<div className="row justify-content-center">
													<div className="col-lg-12 ">
														<div
															className="challenge_guide mb-2"
															style={{ marginRight: "1.3rem", fontFamily: "cnam-bold-ar", fontSize: "20px" }}
														>
															القواعد الارشادية
														</div>
														<ul className="dash">
															<li className="mb-3">
																سيتم تقييم طلبك بناء على الموارد والقدرات المتاحة في جامعة الملك عبدالله.
															</li>
															<li className="mb-3">
																تقديم الطلب الخاص بك لا يخلق أي التزام قانوني أو أي نوع من الالتزام
															</li>
															<li className="mb-3">
																يجب أن تمثل المنشأة أعمالها وتعمل معا مع جامعة الملك عبدالله في التحديات / طلبك.
															</li>
															<li className="mb-3">تأكد من تعبئة جميع الحقول المطلوبة للاكمال عملية تقديم طلبك</li>
															<li className="mb-3">
تزويدنا بمعلومات اضافية كتميل مزيد من المستندات ذات العلاقة بالطلب يساهم في تحديد الطلب والتحدي
															</li>
															<li className="mb-3">
يحق لجامعة الملك عبدالله بتعليق او الغاء الطلبظ التحدي لأي سبب من اللاسباب التالية :
																<ul className="mb-3 dash">
																	<li className="mb-3">عدم تقديم المستندات المطلوبة من قبل جامعة الملك عبدالله.</li>
																	<li className="mb-3">عدم الامتثال لاتفاق NDA.</li>
																	<li className="mb-3">عدم التعاون مع جامعة الملك عبدالله.</li>
																	<li className="mb-3">
																		تقديم بيانات / معلومات خاطئة أو مزورة إلى جامعة الملك عبدالله.
																	</li>
																</ul>
															</li>
															<li className="mb-3">
في حال وجود تعارض بين النص العربي والنص الانجليزي، فإن النص المعمول به والمعتمد هو النص الانجليزي
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Loader>
			)}
		</>
  );
}





// console.log(errors)
      // setLoaderState(true)
      // const postedData = {
      //   userid: getSessionInfo("id"),
      //   challengeName: data.challenge_name,
      //   challengeType: data.challenge_type.value,
      //   challengeDescription: data.challenge_description,
      //   approach: data.radio1,
      //   approachChallSpecification: watch('approach_specify') !== ' ' && data.radio1 === "Yes" ? data.approach_specify : '',
      //   challengeTime: descriptionObj.challenge_date,
      //   companyAffected: data.radio2,
      //   companyAffectedSpecification: watch('affected_specify') !== ' ' && data.radio2 === "Yes" ? data.affected_specify : '',
      //   cost: data.radio3,
      //   costSpecification: watch('anticipate') !== ' ' && data.radio3 === "Yes" ? data.anticipate : '',
      //   hear: data.reference.value,
      //   token: getSessionInfo("token"),
      //   files: descriptio.files.fileSend,
      // };


      // // console.log(postedData)


      // setTimeout(() => {
      //   setLoaderState(false)
      // }, 1000);










          // let errors = false

    // if ( (watch('radio2') === 'Yes' && ( (watch('affected_specify') && watch('affected_specify').length < 1))) 
    // || (watch('radio2') === 'Yes' && !watch('affected_specify') )  ){
    //   setRadioErrors({ ...radioErrors, radio2: true })
    //   errors = true
    // }

    // if ( (watch('radio1') === 'Yes' && ((watch('approach_specify') && watch('approach_specify').length < 1))) 
    // || (watch('radio1') === 'Yes' && !watch('approach_specify') )  ){
    //   setRadioErrors({ ...radioErrors, radio1: true })
    //   errors = true
    // }

    // if ( (watch('radio3') === 'Yes' && ((watch('anticipate') && watch('anticipate').length < 1))) 
    // || (watch('radio3') === 'Yes' && !watch('anticipate') )  ){
    //   setRadioErrors({ ...radioErrors, radio3: true })
    //   errors = true
    // }

    // if (errors) return

    // || errors.approach_specify || errors.anticipate 
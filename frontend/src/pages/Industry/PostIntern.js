import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet";

import { Button } from "reactstrap";
import Loader from "react-loader-advanced";

import InputText from "../../components/InputText/InputText";
import Selector from "../../components/Selector/Selector";
import DatePicker from "../../components/Date-Picker/PickerDate";
import TextareaAutosize from "../../components/Text-Area/TextArea";
import InternshipModal from "../../components/PageModals/InternshipModal";
import Spinner from "../../components/spinner/Spinner";

import { getSessionInfo, clearSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";

import { toast } from "react-toastify";

import Calendar from "../../assets/images_svg/calendar.svg";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import Clear from "@material-ui/icons/Clear";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import "../Common/Register/Register.css";
import "./PostIntern.css";
import "../../App.css";
import "../../containers/Simple.css";

export default function PostAnIntership(props) {
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({ defaultValues: { category_student_radio: "MS", positionOutline: "", experience: "", compensationSalary: "" } });

	// if (getSessionInfo("role") !== 3) {
	// 	props.history.replace("/");
	// }

	const [mailModal, setMailModal] = useState(false);
	const closeModal = () => {
		setMailModal(!mailModal);
	};

	const [postInternObj, setpostInternObj] = useState({
		link: "",
		contact_details: "",
		intern_length: "",
		internship_length: "",
		name_institution: "",
		location_institution: "",
		jobTitle: "",
		department: "",
		startDate: "",
		finishDate: "",
		location: "",
		positionOutline: "",
		categoryStudent: "",
		category_student_text: "",
		experience: "",
		compensationSalary: "",
		listDocuments: "",
		description: "",
	});

	const handleChange = (name, value) => {
		setpostInternObj({ ...postInternObj, [name]: value });
	};

	const [loaderState, setLoaderState] = useState(false);

	const onSubmit = (data) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		var internship_length
		if (postInternObj.intern_length.value === 'Other') internship_length = data.internship_length
		else internship_length = postInternObj.intern_length.value

		var category_student_text
		if (postInternObj.categoryStudent.value === 'Other') category_student_text = data.category_student_text
		else category_student_text = postInternObj.categoryStudent.value

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),

			jobTitle: data.jobTitle,
			department: data.department,
			startdate: data.startDate,
			enddate: data.finishDate,
			location: data.location.value,
			positionOutline: data.positionOutline,
			institution_name: data.name_institution,
			institution_location: data.location_institution,

			experience: data.experience,
			compensationSalary: data.compensationSalary,
			listDocuments: data.listDocuments,
			companyDesc: data.description,
			categoryStudent: data.category_student_radio,
			length: internship_length,
			major: category_student_text,
			contact: postInternObj.contact_details,
			link: postInternObj.link,
		};

		setLoaderState(true);
		axios({
			method: "post",
			url: `${WS_LINK}post_internship`,
			data: postedData,
			// headers: { "content-type": "application/json" },
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data !== "role error" && res.data !== "token error") {
					setLoaderState(false);
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
				} else {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				}
			})
			.catch((err) => {
				setLoaderState(false);
				toast.error("Couldn't post internship!", {
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
	};

	const scroll = () => {
		document.getElementById("name").scrollIntoView({ behavior: "smooth" });
	};
	//{console.log(getValues('finishDate'))}
	return (
		<>
			<Helmet>
				<title>{getSessionInfo('language') === 'arabic' ?
					'عن برنامج الشراكة المعرفية | بعد التدريب'
					:
					'Post Internship |CNAM KPP'
				}
				</title>
			</Helmet>
			{getSessionInfo("language") === "english" ? (
				<Loader
					message={
						<span>
							<Spinner />{" "}
						</span>
					}
					show={loaderState}
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
										<InternshipModal props={props} state={mailModal} toggleState={closeModal} />

										<div className="col-12" style={{ fontFamily: "cnam-bold", fontSize: "1.8rem" }} id="name">
											Post an internship
										</div>
										<div className="col-12 h5 mb-4 mt-2">Our team will review it and get back to you.</div>
										<form style={{ paddingLeft: 0 }} onSubmit={handleSubmit(onSubmit)}>
											<div className="col-12 mb-1" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Job Title *
											</div>

											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => <InputText placeholder="Job Title" value={value} onChange={onChange} style={{ border: errors.jobTitle ? "1px solid red" : "", fontSize: "14px" }} />}
													//className="form-control"
													rules={{
														required: true,
													}}
													name="jobTitle"
													control={control}
												/>
												{errors.jobTitle && errors.jobTitle.type === "required" && <span className="errors">Job Title is required.</span>}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Name of institution *
											</div>

											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => <InputText placeholder="Name of institution " value={value} onChange={onChange} style={{ border: errors.name_institution ? "1px solid red" : "", fontSize: "14px" }} />}
													//className="form-control"
													rules={{
														required: true,
													}}
													name="name_institution"
													control={control}
												/>
												{errors.name_institution && errors.name_institution.type === "required" && <span className="errors">Name of institution is required.</span>}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Location of institution *
											</div>

											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => <InputText placeholder="Location Of Institution" value={value} onChange={onChange} style={{ border: errors.location_institution ? "1px solid red" : "", fontSize: "14px" }} />}
													//className="form-control"
													rules={{
														required: true,
													}}
													name="location_institution"
													control={control}
												/>
												{errors.location_institution && errors.location_institution.type === "required" && <span className="errors">Location of Institution is required.</span>}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Department *
											</div>

											<div className="col-12">
												<Controller render={({ field: { onChange, value } }) => <InputText placeholder="Department" value={value} onChange={onChange} style={{ border: errors.department ? "1px solid red" : "", fontSize: "14px" }} />} rules={{ required: true }} name="department" control={control} />
												{errors.department && errors.department.type === "required" && <span className="errors">Department is required.</span>}
											</div>
											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Internship Length{" "}
											</div>
											<div className="col-12 mt-1 postIntern">
												<Selector
													id="length"
													name="intern_length"
													options={[
														{ value: "One Month", label: "One Month" },
														{ value: "Three Months", label: "Three Month" },
														{ value: "Six Month", label: "Six Month" },
														{ value: "Nine Month", label: "Nine Month" },
														{ value: "Other", label: "Other" },
													]}
													placeholder="Select internship length"
													onChange={(e) => handleChange("intern_length", e)}
													value={postInternObj.intern_length}
													style={{ zIndex: "1 !important" }}
												/>
											</div>
											{postInternObj.intern_length.value === "Other" && (
												<div className="col-12 mt-1">
													<Controller render={({ field: { onChange, value } }) => <InputText placeholder="Internship length" value={value} onChange={onChange} style={{ border: errors.internship_length ? "1px solid red" : "", fontSize: "14px" }} />} rules={{ required: true }} name="internship_length" control={control} />
													{errors.internship_length && errors.internship_length.type === "required" && <span className="errors">Internship length is required.</span>}
												</div>
											)}
											<div className="col-lg-6 col-12 mb-1 mt-4 text-nowrap d-inline-block px-0" style={{ fontSize: "0.92rem" }}>
												<div className="col-12" style={{ fontFamily: "cnam-bold" }}>
													Expected Start Date *{" "}
												</div>
												<div className="col-12 d-inline-block">
													<img src={Calendar} width={15} style={{ position: "absolute", zIndex: "1", marginLeft: "16px", marginTop: "15px" }} alt="calendar" />

													<Controller
														render={({ field: { onChange, value } }) => (
															<DatePicker
																className={`pointer col-12 form-control pl-3 datepick ${errors.startDate && "border_form"}`}
																placeholder={"DD MM YYYY"}
																value={value}
																selected={value}
																onChange={onChange}
																minDate={new Date()}
															// style={{ border: errors.department ? "1px solid red" : "" }}
															/>
														)}
														rules={{ required: true }}
														name="startDate"
														control={control}
													/>
													{errors.startDate && errors.startDate.type === "required" && (
														<span className="errors" style={{ color: "red" }}>
															Date is required.
														</span>
													)}
													{/* <DatePicker
                                        name="startDate"
                                        value={postInternObj.startDate}
                                       
                                        handleChange={handleChange}
                                        
                                        
                                    /> */}
												</div>
											</div>
											<div className="col-lg-6 col-12 mb-1 mt-4 text-nowrap d-inline-block px-0 " style={{ fontSize: "0.92rem" }}>
												<div className="col-12" style={{ fontFamily: "cnam-bold" }}>
													Expected Finish Date *
												</div>
												<div className="col-12 d-inline-block">
													<img src={Calendar} width={15} style={{ position: "absolute", zIndex: "1", marginLeft: "16px", marginTop: "15px" }} alt="calendar" />

													<Controller
														render={({ field: { onChange, value } }) => (
															<DatePicker
																className={`pointer col-12 form-control pl-3 datepick ${errors.finishDate && "border_form"}`}
																style={{ color: "white" }}
																placeholder={"DD MM YYYY"}
																selected={watch("startDate") < watch("finishDate") ? value : null}
																value={value}
																onChange={onChange}
																minDate={watch("startDate")}
															// style={{ border: errors.department ? "1px solid red" : "" }}
															/>
														)}
														rules={{ required: true }}
														name="finishDate"
														control={control}
													/>
													{/*  <DatePicker
                                        name="finishDate"
                                        selected={startdate <= finishdate ? postInternObj.finishDate : null}
                                        value={postInternObj.finishDate}
                                        onChange={(e) => handleChange('finishDate',e)}
                                        className="pointer col-12 form-control"
                                        placeholder={"        " + "DD MM YYYY"}
                                        minDate={getValues('startDate')}
                                    //disabled={postInternObj.startDate.length === 0 ? true : false
                                    /> */}
													{errors.startDate && errors.startDate.type === "required" && (
														<span className="errors" style={{ color: "red" }}>
															Date is required.
														</span>
													)}
												</div>
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Job Location *{" "}
											</div>
											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <Selector className={errors.location && "border_form_selector"} options={[{ value: "Lebanon", label: "Lebanon" }]} placeholder="Select country" onChange={onChange} value={value} />} rules={{ required: true }} name="location" control={control} />
												{errors.location && <span className="errors">Location is required.</span>}
											</div>

											<div className="col-12 mt-4 mb-1">
												<div className="col-12 pl-0" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
													Outline of the research or practical training experience and the roles and responsibilities of the position *
													<span className="text-right text-truncate" style={{ float: "right", color: "#808080", fontSize: "13px" }}>
														{watch("positionOutline").length} of 500 characters
													</span>
												</div>
											</div>

											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <TextareaAutosize style={{ border: errors.positionOutline ? "1px solid red" : "", resize: "none", fontSize: "14px" }} className={`col-12 pt-3 ${watch("positionOutline").length === 500 && "max_char"}`} value={value} onChange={onChange} minRows={10} maxRows={10} maxLength={500} placeholder="Outline of the research or practical training experience and the roles and responsibilities of the position" />} rules={{ required: true, minLength: 4 }} name="positionOutline" control={control} />
												{errors.positionOutline && errors.positionOutline.type === "required" && <span className="errors">This field is required.</span>}
											</div>

											<div className="col-12 d-flex mt-4 mb-1 align-items-end">
												<div className="col-12  pl-0" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
													Category of students and major(s) most appropriate for the opportunity at your institution *
												</div>
											</div>

											<div className="col-12 mt-1">
												<Controller
													render={({ field: { onChange, value } }) => (
														<RadioGroup value={value ? value : "MS"} onChange={onChange}>
															<FormControlLabel style={{ marginBottom: 0 }} value="MS" control={<Radio icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} size="small" style={{ color: "rgb(198 2 36)" }} />} label="MS, Majoring in" />
															<FormControlLabel value="PhD" control={<Radio icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} size="small" style={{ color: "rgb(198 2 36)" }} />} label="PhD, Majoring in" />
														</RadioGroup>
													)}
													rules={{ required: true }}
													defaultValue=""
													name="category_student_radio"
													control={control}
												/>

												<Controller
													render={(props) => (
														<Selector
															className={` ${errors.categoryStudent && "border_form_selector"} mt-2`}
															options={[
																{ value: "Computer Science", label: "Computer Science" },
																{ value: "Buisness Management", label: "Buisness Management" },
																{ value: "Actuarial Mathematics", label: "Actuarial Mathematics" },
																{ value: "Chemistry", label: "Chemistry" },
																{ value: "Other", label: "Other" },
															]}
															placeholder="Select Major"
															onChange={(value) => { props.field.onChange(value); handleChange("categoryStudent", value); }}
															value={props.value}
														/>
													)}
													rules={{ required: true }}
													name="categoryStudent"
													control={control}
												/>
												{errors.categoryStudent && <span className="errors">Please select your major</span>}
											</div>
											{postInternObj.categoryStudent.value === "Other" && (
												<div className="col-12 mt-1">
													<Controller render={({ field: { onChange, value } }) => <InputText placeholder="Major" value={value} onChange={onChange} style={{ border: errors.category_student_text ? "1px solid red" : "", fontSize: "14px" }} />} rules={{ required: true }} name="category_student_text" control={control} />
													{errors.category_student_text && errors.category_student_text.type === "required" && <span className="errors">Major is required.</span>}
												</div>
											)}

											<div className="col-12 mt-4 mb-1">
												<div className="p-0" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
													Prior work experience or technical skills requirements *
													<span className="text-right text-truncate" style={{ float: "right", color: "#808080", fontSize: "13px" }}>
														{watch("experience").length} of 500 characters
													</span>
												</div>
											</div>

											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <TextareaAutosize style={{ border: errors.experience ? "1px solid red" : "", resize: "none", fontSize: "14px" }} className={`col-12 pt-3 txtArea ${watch("experience").length === 500 && "max_char"}`} value={value} onChange={onChange} minRows={10} maxRows={10} maxLength={500} placeholder="Prior work experience or technical skills requirements" />} rules={{ required: true }} name="experience" control={control} />
												{errors.experience && errors.experience.type === "required" && <span className="errors">This field is required.</span>}
											</div>

											<div className="col-12 mt-4 mb-1">
												<div className="p-0" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
													Compensation & Salary *
													<span className="text-right text-truncate" style={{ float: "right", color: "#808080", fontSize: "13px" }}>
														{watch("compensationSalary").length} of 500 characters
													</span>
												</div>
											</div>

											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <TextareaAutosize style={{ border: errors.compensationSalary ? "1px solid red" : "", resize: "none", fontSize: "14px" }} className={`col-12 pt-3 txtArea ${watch("compensationSalary").length === 500 && "max_char"}`} value={value} onChange={onChange} minRows={10} maxRows={10} maxLength={500} placeholder="Please describe the competencies" />} rules={{ required: true }} name="compensationSalary" control={control} />
												{errors.compensationSalary && errors.compensationSalary.type === "required" && <span className="errors">This field is required.</span>}
											</div>
											<div className="col-12 mt-4 mb-1">
												<div className="col-12 p-0" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
													Contact details of the person in your institution managing the administrative details like internship submissions, visa request documentation and accomodation issues.
													<span className="text-right text-truncate" style={{ float: "right", color: "#808080", fontSize: "13px" }}>
														{postInternObj.contact_details.length} of 500 characters
													</span>
												</div>
											</div>
											<div className="col-12 mt-1">
												<TextareaAutosize style={{ resize: "none", fontSize: "14px" }} className={`col-12 pt-3 txtArea ${postInternObj.contact_details.length === 500 && "max_char"}`} name="contact_details" value={postInternObj.contact_details} onChange={(e) => handleChange(e.target.name, e.target.value)} minRows={10} maxRows={10} maxLength={500} placeholder="Contact details of the person in your institution managing the administrative details like internship submissions, visa request documentation and accomodation issues." />
											</div>
											<div className="col-12 d-flex mt-4 mb-1 align-items-end">
												<div className="p-0" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
													Link used to submit internship application.
												</div>
											</div>
											<div className="col-12 mt-1">
												<InputText name="link" value={postInternObj.link} placeholder="http://" className="col-12 mb-2" onChange={(e) => handleChange(e.target.name, e.target.value)} />
											</div>
											<div className="col-12 mb-2 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												Please list required documents to be included with student's application such as letter of recommendation from CNAM faculty advisor, transcript, statement of purpose, etc.: *
											</div>
											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <TextareaAutosize style={{ border: errors.listDocuments ? "1px solid red" : "", resize: "none", fontSize: "14px" }} className="col-12 pt-3 txtArea" value={value} onChange={onChange} minRows={10} maxRows={10} maxLength={500} placeholder="Please list required documents to be included with student's application such as letter of recommendation from CNAM faculty advisor, transcript, statement of purpose, etc.:" />} rules={{ required: true }} name="listDocuments" control={control} />
												{errors.listDocuments && errors.listDocuments.type === "required" && <span className="errors">This field is required.</span>}
											</div>

											<div className="col-12 mb-2 mt-4" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
												A brief description about your company *
											</div>
											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <TextareaAutosize style={{ border: errors.description ? "1px solid red" : "", resize: "none", fontSize: "14px" }} className="col-12 pt-3 txtArea" value={value} onChange={onChange} minRows={10} maxRows={10} maxLength={500} placeholder="A brief description about your company" />} rules={{ required: true }} name="description" control={control} />
												{errors.description && errors.description.type === "required" && <span className="errors">This field is required.</span>}
											</div>

											<div className="d-sm-flex col-lg-12 p-0">
												<div className="col-lg-7 mt-4" style={{ color: "#848484", fontSize: "13px" }}>
													{" "}
													
												</div>
												<div className="mt-4 col-lg-5">
													<Button className="ml-sm-auto d-flex" type="submit" onClick={scroll} style={{ background: "rgb(198 2 36)", padding: "0.7rem 1.5rem", border: "none", fontFamily: "cnam-bold" }}>
														Submit Internship
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

									<div className="d-flex flex-fill align-items-center justify-content-center">
										<div className="row " style={{ width: "75%" }}>
											<div className="container-fluid ">
												<div className="row justify-content-center">
													<div className="">
														<div className=" mb-3 p-0" style={{ textAlign: "justify", fontFamily: "cnam-bold", fontSize: "20px" }}>
															Guidelines
														</div>
														<ul style={{ padding: "0", fontSize: "13px" }}>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
																Minimum duration is 8 full-time weeks required to receiveCNAM credits.
															</li>
															<li className="mb-2" style={{ maxWidth: "95%" }}>
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
																MS major internship opportunity allow during a summer time only.
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
																PhD major internship opportunity allow during a calendar year will depend upon the inconvenience of Industry.
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
															   CNAM has the full right to cancel the request with or without any explanation or notification.
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
																Submitting the internship request does not create any elegal binding or any type of commitment
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
																Industry is obligated to notify CNAM about any changes to the Industry data and contact numbers.
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
																In the event of a conflict between the Arabic text and the English text, the applicable and approved text is the English text.
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
																CNAM may suspend or cancel the request/challenge from the Industry for any of the following reasons:
																<ul style={{ listStyleType: "disc", marginLeft: "-15px" }}>
																	<li className="mb-2 mt-2">Failure to submit documents requested by CNAM.</li>
																	<li className="mb-2">Non-compliance with the NDA agreement</li>
																	<li className="mb-2">lack of cooperation with CNAM</li>
																	<li className="mb-2">Providing wrong or forged data/information to CNAM</li>
																</ul>
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
				//--------ARABIC-----------

				<Loader
					message={
						<span>
							<Spinner />{" "}
						</span>
					}
					show={loaderState}
				>
					<div className="" style={{ direction: "rtl", textAlign: "right", fontFamily: "cnam-ar" }}>
						<div className="col-12" style={{ fontFammily: "cnam-ar" }}>
							<div className="row for_reverse">
								<div className="col-12 col-lg-7 simple-Left">
									<div className=" mb-2 back" style={{ color: "rgb(198 2 36)" }} onClick={() => props.history.goBack()}>
										<ArrowBackIosIcon style={{ fontSize: "13px", marginTop: "-2px", transform: "rotate(180deg)" }} />
										عودة
									</div>

									<div className="row ">
										<InternshipModal props={props} state={mailModal} toggleState={closeModal} />

										<div className="col-12" style={{ fontFamily: "cnam-bold-ar", fontSize: "1.8rem" }} id="name">
										فرصة الحصول على مواهب الجامعة للتدريب
										</div>
										<div className="col-12 h5 mb-4 mt-2">سيقوم فريقنا بمراجعة طلبك وسيتم التواصل معك في أقرب وقت ممكن​</div>
										<form style={{ paddingRight: 0 }} onSubmit={handleSubmit(onSubmit)}>
											<div className="col-12 mb-1" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												المسمى الوظيفي *
											</div>

											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => <InputText placeholder="المسمى الوظيفي" value={value} onChange={onChange} style={{ border: errors.jobTitle ? "1px solid red" : "", fontSize: "14px" }} />}
													//className="form-control"
													rules={{
														required: true,
													}}
													name="jobTitle"
													control={control}
												/>
												{errors.jobTitle && errors.jobTitle.type === "required" && <span className="errors">مطلوب المسمى الوظيفي.</span>}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												اسم المنشآة *
											</div>

											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => <InputText placeholder="اسم المنشآة" value={value} onChange={onChange} style={{ border: errors.name_institution ? "1px solid red" : "", fontSize: "14px" }} />}
													//className="form-control"
													rules={{
														required: true,
													}}
													name="name_institution"
													control={control}
												/>
												{errors.name_institution && errors.name_institution.type === "required" && <span className="errors">مطلوب اسم المؤسسة.</span>}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												موقع المنشآة *
											</div>

											<div className="col-12">
												<Controller
													render={({ field: { onChange, value } }) => <InputText placeholder="موقع المنشآة" value={value} onChange={onChange} style={{ border: errors.location_institution ? "1px solid red" : "", fontSize: "14px" }} />}
													//className="form-control"
													rules={{
														required: true,
													}}
													name="location_institution"
													control={control}
												/>
												{errors.location_institution && errors.location_institution.type === "required" && <span className="errors">مطلوب موقع المنشآة.</span>}
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												قسم *
											</div>

											<div className="col-12">
												<Controller render={({ field: { onChange, value } }) => <InputText placeholder="قسم" value={value} onChange={onChange} style={{ border: errors.department ? "1px solid red" : "", fontSize: "14px" }} />} rules={{ required: true }} name="department" control={control} />
												{errors.department && errors.department.type === "required" && <span className="errors">مطلوب قسم.</span>}
											</div>
											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												فترة التدريب{" "}
											</div>
											<div className="col-12 mt-1 postIntern">
												<Selector
													id="length"
													name="intern_length"
													options={[
														{ value: "One Month", label: "شهر واحد" },
														{ value: "Three Months", label: "ثلاثة اشهر" },
														{ value: "Six Month", label: "ستة أشهر" },
														{ value: "Nine Month", label: "تسعة أشهر" },
														{ value: "Other", label: "آخر" },
													]}
													placeholder="حدد فترة التدريب"
													onChange={(e) => handleChange("intern_length", e)}
													value={postInternObj.intern_length}
													style={{ zIndex: "1 !important" }}
												/>
											</div>
											{postInternObj.intern_length.value === "Other" && (
												<div className="col-12 mt-1">
													<Controller render={({ field: { onChange, value } }) => <InputText placeholder="فترة التدريب" value={value} onChange={onChange} style={{ border: errors.internship_length ? "1px solid red" : "", fontSize: "14px" }} />} rules={{ required: true }} name="internship_length" control={control} />
													{errors.internship_length && errors.internship_length.type === "required" && <span className="errors">فترة التدريب الداخلي مطلوب.</span>}
												</div>
											)}

											<div className="col-lg-6 col-12 mb-1 mt-4 text-nowrap d-inline-block px-0" style={{ fontSize: "0.92rem" }}>
												<div className="col-12" style={{ fontFamily: "cnam-bold-ar" }}>
													تاريخ البدء المتوقع *
												</div>
												<div className="col-12 d-inline-block">
													<img src={Calendar} width={15} style={{ position: "absolute", left: "25px", zIndex: "1", marginTop: "15px" }} alt="calendar" />

													<Controller
														render={({ field: { onChange, value } }) => (
															<DatePicker
																className={`pointer col-12 form-control pl-3 datepick ${errors.startDate && "border_form"}`}
																placeholder={"DD MM YYYY"}
																value={value}
																selected={value}
																onChange={onChange}
																minDate={new Date()}
															// style={{ border: errors.department ? "1px solid red" : "" }}
															/>
														)}
														rules={{ required: true }}
														name="startDate"
														control={control}
													/>
													{errors.startDate && errors.startDate.type === "required" && <span className="errors" style={{ color: "red" }}>التاريخ مطلوب.</span>}
													{/* <DatePicker
                                        name="startDate"
                                        value={postInternObj.startDate}
                                       
                                        handleChange={handleChange}
                                        
                                        
                                    /> */}
												</div>
											</div>
											<div className="col-lg-6 col-12 mb-1 mt-4 text-nowrap d-inline-block px-0 " style={{ fontSize: "0.92rem" }}>
												<div className="col-12" style={{ fontFamily: "cnam-bold-ar" }}>
													تاريخ الانتهاء المتوقع *
												</div>
												<div className="col-12 d-inline-block">
													<img src={Calendar} width={15} style={{ position: "absolute", zIndex: "1", left: "25px", marginTop: "15px" }} alt="calendar" />

													<Controller
														render={({ field: { onChange, value } }) => (
															<DatePicker
																className={`pointer col-12 form-control pl-3 datepick ${errors.finishDate && "border_form"}`}
																style={{ color: "white" }}
																placeholder={"DD MM YYYY"}
																selected={watch("startDate") < watch("finishDate") ? value : null}
																value={value}
																onChange={onChange}
																minDate={watch("startDate")}
															// style={{ border: errors.department ? "1px solid red" : "" }}
															/>
														)}
														rules={{ required: true }}
														name="finishDate"
														control={control}
													/>
													{/*  <DatePicker
                                        name="finishDate"
                                        selected={startdate <= finishdate ? postInternObj.finishDate : null}
                                        value={postInternObj.finishDate}
                                        onChange={(e) => handleChange('finishDate',e)}
                                        className="pointer col-12 form-control"
                                        placeholder={"        " + "DD MM YYYY"}
                                        minDate={getValues('startDate')}
                                    //disabled={postInternObj.startDate.length === 0 ? true : false
                                    /> */}
													{errors.startDate && errors.startDate.type === "required" && <span className="errors" style={{ color: "red" }}>التاريخ مطلوب.</span>}
												</div>
											</div>

											<div className="col-12 mb-1 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												مكان العمل *
											</div>
											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <Selector className={errors.location && "border_form_selector"} options={[{ value: "Lebanon", label: <span style={{ fontFamily: "cnam-ar" }}>لبنان</span> }]} placeholder="حدد الدولة" onChange={onChange} value={value} />} rules={{ required: true }} name="location" control={control} />
												{errors.location && <span className="errors">الموقع مطلوب.</span>}
											</div>

											<div className="col-12 mt-4 mb-1">
												<div className="col-12 pr-0" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
													الخطوط العريضة للبحث أو تجربة التدريب العملية و أدوار ومسؤوليات المنصب *
													<span className="text-right text-truncate" style={{ float: "left", color: "#808080", fontSize: "13px", direction: "ltr", fontFamily: "cnam" }}>
														{watch("positionOutline").length} of 500 characters
													</span>
												</div>
											</div>

											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <TextareaAutosize style={{ border: errors.positionOutline ? "1px solid red" : "", resize: "none", fontSize: "14px" }} className={`col-12 pt-3 ${watch("positionOutline").length === 500 && "max_char"}`} value={value} onChange={onChange} minRows={10} maxRows={10} maxLength={500} placeholder="الخطوط العريضة للتجربة البحثية أو التدريب العملي وأدوار ومسؤوليات المنصب" />} rules={{ required: true, minLength: 4 }} name="positionOutline" control={control} />
												{errors.positionOutline && errors.positionOutline.type === "required" && <span className="errors">هذه الخانة مطلوبه.</span>}
											</div>

											<div className="col-12 d-flex mt-4 mb-1 align-items-end">
												<div className="col-12  pl-0" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												فئة الطلاب والأطراف الرئيسية الأكثر ملاءمة للحصول على فرصة التدريب *
												</div>
											</div>

											<div className="col-12 mt-1">
												<Controller
													render={({ field: { onChange, value } }) => (
														<RadioGroup value={value ? value : "MS"} onChange={onChange}>
															<FormControlLabel style={{ marginBottom: 0 }} value="MS" control={<Radio icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} size="small" style={{ color: "rgb(198 2 36)" }} />} label="تخصص ماجستير في" />
															<FormControlLabel value="PhD" control={<Radio icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} size="small" style={{ color: "rgb(198 2 36)" }} />} label="تخصص دكتواره في" />
														</RadioGroup>
													)}
													rules={{ required: true }}
													defaultValue=""
													name="category_student_radio"
													control={control}
												/>

												<Controller
													render={(props) => (
														<Selector
															className={` ${errors.categoryStudent && "border_form_selector"} mt-2`}
															options={[
																{ value: "Computer Science", label: "علوم الكمبيوتر" },
																{ value: "Buisness Management", label: "ادارة اعمال" },
																{ value: "Actuarial Mathematics", label: "الرياضيات الاكتوارية" },
																{ value: "Chemistry", label: "كيمياء" },
																{ value: "Other", label: "آخر" },
															]}
															placeholder="حدد التخصص"
															onChange={(value) => { props.field.onChange(value); handleChange("categoryStudent", value); }}
															value={props.value}
														/>
													)}
													rules={{ required: true }}
													name="categoryStudent"
													control={control}
												/>
												{errors.categoryStudent && <span className="errors">يرجى اختيار التخصص الخاص بك</span>}
											</div>

											{postInternObj.categoryStudent.value === "Other" && (
												<div className="col-12 mt-1">
													<Controller render={({ field: { onChange, value } }) => <InputText placeholder="رئيسي" value={value} onChange={onChange} style={{ border: errors.category_student_text ? "1px solid red" : "", fontSize: "14px" }} />} rules={{ required: true }} name="category_student_text" control={control} />
													{errors.category_student_text && errors.category_student_text.type === "required" && <span className="errors">مطلوب كبير.</span>}
												</div>
											)}

											<div className="col-12 mt-4 mb-1">
												<div className="p-0" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
													خبرة العمل السابقة أو متطلبات المهارات الفنية *
													<span className="text-right text-truncate" style={{ float: "left", color: "#808080", fontSize: "13px", direction: "ltr", fontFamily: "cnam" }}>
														{watch("experience").length} of 500 characters
													</span>
												</div>
											</div>

											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <TextareaAutosize style={{ border: errors.experience ? "1px solid red" : "", resize: "none", fontSize: "14px" }} className={`col-12 pt-3 txtArea ${watch("experience").length === 500 && "max_char"}`} value={value} onChange={onChange} minRows={10} maxRows={10} maxLength={500} placeholder="خبرة العمل السابقة أو متطلبات المهارات الفنية" />} rules={{ required: true }} name="experience" control={control} />
												{errors.experience && errors.experience.type === "required" && <span className="errors">هذه الخانة مطلوبه.</span>}
											</div>

											<div className="col-12 mt-4 mb-1">
												<div className="p-0" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
													التعويض والراتب *
													<span className="text-right text-truncate" style={{ float: "left", color: "#808080", fontSize: "13px", direction: "ltr", fontFamily: "cnam" }}>
														{watch("compensationSalary").length} of 500 characters
													</span>
												</div>
											</div>

											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <TextareaAutosize style={{ border: errors.compensationSalary ? "1px solid red" : "", resize: "none", fontSize: "14px" }} className={`col-12 pt-3 txtArea ${watch("compensationSalary").length === 500 && "max_char"}`} value={value} onChange={onChange} minRows={10} maxRows={10} maxLength={500} placeholder="يرجى وصف الكفاءات" />} rules={{ required: true }} name="compensationSalary" control={control} />
												{errors.compensationSalary && errors.compensationSalary.type === "required" && <span className="errors">هذه الخانة مطلوبه.</span>}
											</div>
											<div className="col-12 mt-4 mb-1">
												<div className="col-12 p-0" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												تفاصيل التواصل الخاصة بالشخص الاداري المسؤول عن تقاريرالتدريب الداخلي والوثائق الآخرى في المنشأة 
													<span className="text-right text-truncate" style={{ float: "left", color: "#808080", fontSize: "13px", direction: "ltr", fontFamily: "cnam" }}>
														{postInternObj.contact_details.length} of 500 characters
													</span>
												</div>
											</div>
											<div className="col-12 mt-1">
												<TextareaAutosize style={{ resize: "none", fontSize: "14px" }} className={`col-12 pt-3 txtArea ${postInternObj.contact_details.length === 500 && "max_char"}`} name="contact_details" value={postInternObj.contact_details} onChange={(e) => handleChange(e.target.name, e.target.value)} minRows={10} maxRows={10} maxLength={500} placeholder="تفاصيل الاتصال بالشخص في مؤسستك تدير التفاصيل الإدارية مثل تقارير التدريب الداخلي، وثائق طلب التأشيرة وقضايا الإقامة." />
											</div>
											<div className="col-12 d-flex mt-4 mb-1 align-items-end">
												<div className="p-0" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
													رابط يستخدم لتقديم طلب التدريب الداخلي.
												</div>
											</div>
											<div className="col-12 mt-1" style={{ direction: "ltr", fontFamily: "cnam" }}>
												<InputText name="link" value={postInternObj.link} placeholder="الموقع الالكتروني " className="col-12 mb-2 text-right" onChange={(e) => handleChange(e.target.name, e.target.value)} style={{ direction: 'rtl' }} />
											</div>
											<div className="col-12 mb-2 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												{" "}
												يرجى ذكر قائمة المستندات المطلوبة من الطالب التي يضمن بها فرصة التدريب، مثلا توصية من أعضاء هئية التدريس بكاوست، السجل الاكاديمي....​ : *
											</div>
											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <TextareaAutosize style={{ border: errors.listDocuments ? "1px solid red" : "", resize: "none", fontSize: "14px" }} className="col-12 pt-3 txtArea" value={value} onChange={onChange} minRows={10} maxRows={10} maxLength={500} placeholder="يرجى ذكر قائمة المستندات المطلوبة المراد تضمينها مع تطبيق الطالب مثل خطاب التوصية من مستشار أعضاء هيئة التدريس في جامعة الملك عبدالله، نص، بيان الغرض، إلخ.:" />} rules={{ required: true }} name="listDocuments" control={control} />
												{errors.listDocuments && errors.listDocuments.type === "required" && <span className="errors">هذه الخانة مطلوبه.</span>}
											</div>

											<div className="col-12 mb-2 mt-4" style={{ fontFamily: "cnam-bold-ar", fontSize: "0.92rem" }}>
												وصف موجز حول شركتك *
											</div>
											<div className="col-12 mt-1">
												<Controller render={({ field: { onChange, value } }) => <TextareaAutosize style={{ border: errors.description ? "1px solid red" : "", resize: "none", fontSize: "14px" }} className="col-12 pt-3 txtArea" value={value} onChange={onChange} minRows={10} maxRows={10} maxLength={500} placeholder="وصف موجز عن شركتك" />} rules={{ required: true }} name="description" control={control} />
												{errors.description && errors.description.type === "required" && <span className="errors">هذه الخانة مطلوبه.</span>}
											</div>

											<div className="d-sm-flex col-lg-12 p-0">
												<div className="col-lg-7 mt-4" style={{ color: "#848484", fontSize: "13px" }}>
													{" "}
													
												</div>
												<div className="mt-4 col-lg-5">
													<Button className="ml-sm-auto d-flex" type="submit" onClick={scroll} style={{ background: "rgb(198 2 36)", padding: "0.7rem 1.5rem", border: "none", fontFamily: "cnam-bold-ar" }}>
														تقديم التدريب
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

									<div className="d-flex flex-fill align-items-center justify-content-center">
										<div className="row " style={{ width: "75%" }}>
											<div className="container-fluid ">
												<div className="row justify-content-center">
													<div className="">
														<div className=" mb-3 p-0" style={{ textAlign: "justify", fontFamily: "cnam-bold-ar", fontSize: "20px" }}>
															القواعد الارشادية
														</div>
														<ul style={{ padding: "0", fontSize: "13px" }}>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
الحد الأدنى لمدة المطلوب للحصول على مواهب جامعة الملك عبدالله للتدريب هو 8 أسابيع بدوام كامل.
															</li>
														
															<li className="mb-3" style={{ maxWidth: "95%" }}>
يسمح بفرصة  الحصول على مواهب كاوست لطلاب الماجستير خلال فترة الصيف فقط.
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
يسمح بفرصة  الحصول على مواهب كاوست لطلاب الدكتوراه طوال فترة السنة التقويمية.
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
تمتلك جامعة الملك عبدالله الحق الكامل في إلغاء الطلب مع أو بدون أي تفسير أو إخطار.
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
لا يُنشئ تقديم طلب الحصول على مواهب كاوست للتدريب أي التزام قانوني أو أي نوع من الالتزام
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
تلتزم المنشأة بإخطار جامعة الملك عبدالله بأي تغييرات تطرأ على بيانات المنشأة أو أرقام الاتصال.

															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
في حالة وجود تعارض بين النص العربي والنص الإنجليزي ، فإن النص المعمول به والمعتمد هو النص الإنجليزي.
															</li>
															<li className="mb-3" style={{ maxWidth: "95%" }}>
يحق لجامعة الملك عبدالله تعليق أو إلغاء الطلب لأي من الأسباب التالية:
																<ul style={{ listStyleType: "disc", marginRight: "-15px" }}>
																	<li className="mb-2 mt-2">عدم تقديم المستندات المطلوبة من جامعة الملك عبدالله.</li>
																	<li className="mb-2">عدم الامتثال لاتفاقية  عدم الافصاح NDA</li>
																	<li className="mb-2">عدم التعاون مع جامعة الملك عبدالله</li>
																	<li className="mb-2">تقديم بيانات / معلومات خاطئة أو مزورة لجامعة الملك عبدالله</li>
																</ul>
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

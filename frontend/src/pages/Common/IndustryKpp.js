import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import Loader from "react-loader-advanced";
import { toast } from "react-toastify";
import Spinner from "../../components/spinner/Spinner";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button } from "reactstrap";

import { getSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";
import { translate, checkFontFamily, formatDate } from '../../functions'

import Footer from "../../components/footer/Footer";
import InputText from "../../components/InputText/InputText";

import "../../App.css";
import "./IndustryKpp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import InputNumeric from "../../components/InputNumeric/InputNumeric";

export default function AboutTheProgram(props) {

	const [loaderState, setLoaderState] = useState(false);
	const [PAGEDATA, setPageData] = useState({});

	useEffect(() => {

		props.setPageTitle('Industry KPP', 'برنامج الشراكة المعرفية')

		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			page_id: 2,
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


	const {
		control,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: "",
			fullName: "",
			email: "",
			phone: "",
			time: "",
		},
	});

	const onSubmit = (data) => {
		document.getElementById("requestMeeting").scrollIntoView({ behavior: "smooth", block: "center" });

		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			title: data.title,
			name: data.fullName,
			email: data.email,
			phone: data.phone,
			time: formatDate(data.time, true),
		};

		setLoaderState(true);

		axios({
			method: "post",
			url: `${WS_LINK}request_meeting`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				setValue("title", "");
				setValue("fullName", "");
				setValue("email", "");
				setValue("phone", "");
				setValue("time", "");
				errors.title = false;
				errors.fullName = false;
				errors.email = false;
				errors.phone = false;
				errors.time = false;

				getSessionInfo("language") === "english"
					? toast.success("Meeting requested successfully!", {
						position: "top-right",
						autoClose: 2000,
						hideProgressBar: true,
						closeOnClick: true,
						pauseOnHover: false,
						draggable: false,
						progress: undefined,
					})
					: toast.success("تم طلب الإجتماع بنجاح !", {
						position: "top-left",
						textAlign: "right",
						autoClose: 2000,
						hideProgressBar: true,
						closeOnClick: true,
						pauseOnHover: false,
						draggable: false,
						progress: undefined,
					});

				setLoaderState(false);
			})
			.catch((err) => {
				setLoaderState(false);

				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});
	};




	const language = getSessionInfo('language')




	return (
		<div style={{ fontFamily: checkFontFamily() }}>
			{PAGEDATA.components &&
				<>

					{/* //* *************************************************************************** */}
					<div className={translate('pagesHeaderTitle', 'pagesHeaderTitle-ar')} style={{ backgroundColor: "#4CC9B7", padding: "30px", paddingLeft: getSessionInfo('language') === 'english' && "10%", paddingRight: getSessionInfo('language') === 'arabic' && "9%" }}>
						<div className="row justify-content-start px-4 px-md-5 px-lg-0">
							<div className={`text-white col-lg-5 ${translate('', 'p-0')}`} style={{ fontSize: "28px", fontFamily: checkFontFamily(true) }}>
								{translate('Industry KPP', ' برنامج الشراكة المعرفية')}
							</div>
						</div>
					</div>

					{/* //* *************************************************************************** */}
					{/* //* *************************************************************************** */}

					<div className="bg-white hide_scrollbar px-3 px-lg-0 homePageBigContainer" style={{}}>
						<div className="about_title mb-4 pad-0">
							<div className="row justify-content-start">
								<div className="col-5 meeting">
									<div className="container mt-4 p-0 text-nowrap" style={{ fontSize: "28px", fontFamily: checkFontFamily(true), marginRight: getSessionInfo('language') === 'arabic' && "22%" }}>
										{PAGEDATA.components[0].status === 1 && PAGEDATA.components[0][language]}
									</div>
								</div>
							</div>
						</div>
						{/* //* *************************************************************************** */}
						{/* //* *************************************************************************** */}
						<div className="about_info pad-0">
							<div className="row justify-content-center">
								<div className="col-lg-5">
									<div style={{ fontSize: "18px", maxWidth: "100%", color: "#5A5A5A" }}>
										{PAGEDATA.components[1].status === 1 && PAGEDATA.components[1][language]}
									</div>
									{PAGEDATA.components[3].status === 1 && PAGEDATA.components[4].status === 1 &&
										<a href={PAGEDATA.components[4][language]}>
											<Button className="mt-4 mb-5" style={{ fontWeight: "600", background: "rgb(198 2 36)", padding: "0.7rem 1rem", border: "none" }}>
												{PAGEDATA.components[3][language]}
											</Button>
										</a>
									}
								</div>

								<div className="col-lg-5">
									<img src={(PAGEDATA.components[2].status === 1 && PAGEDATA.components[2].english)} alt="" className="container p-0" style={{ width: "100%" }} />
								</div>
							</div>
						</div>
						{/* //* *************************************************************************** */}
						{/* //* *************************************************************************** */}
						<div className="guideline_info pad-0" style={{ marginTop: "2rem" }}>
							<div className="row justify-content-center">
								<div className="col-lg-10 guideline_info">
									<div className=" mt-4 p-0 mb-3 text-nowrap" style={{ fontSize: "28px", fontFamily: checkFontFamily(true) }}>
										{PAGEDATA.components[5].status === 1 && PAGEDATA.components[5][language]}
									</div>

									<div style={{ fontSize: "18px", padding: "0" }} dangerouslySetInnerHTML={{ __html: PAGEDATA.components[6].status === 1 && PAGEDATA.components[6][language] }} className="col-12 toSelectFromAPI" />

									<div className=" mt-5 " style={{ fontSize: "28px", fontFamily: checkFontFamily(true) }}>
										{PAGEDATA.components[7].status === 1 && PAGEDATA.components[7][language]}
									</div>

									<div className=" mt-4 mb-4" style={{ color: "#616161", fontSize: "18px", fontFamily: "cnam-bold" }}>
										{PAGEDATA.components[8].status === 1 && PAGEDATA.components[8][language]}
									</div>

									<div dangerouslySetInnerHTML={{ __html: PAGEDATA.components[9].status && PAGEDATA.components[9][language] }} style={{ overflowX: "auto" }} className="eligibility-table" />
								</div>
							</div>
						</div>
						{/* //* *************************************************************************** */}
						{/* //* *************************************************************************** */}
						{PAGEDATA.components[10].status === 1 &&
							<div>
								<div className="pad-0 guideline_info" style={{ marginTop: "3rem" }}>
									<div className="rowbig  justify-content-start">
										<div className="col-5 meeting "
											data-aos="zoom-out"
											data-aos-duration="50"
										>
											<div
												className={`p-0 text-nowrap ml-lg-0 meeting_request_title_home`}
												style={{ fontSize: "28px", fontFamily: checkFontFamily(true), marginRight: getSessionInfo('language') === 'arabic' && "22%" }}
											>
												{translate('Request a meeting', 'طلب اجتماع')}
											</div>
										</div>
									</div>
								</div>
								<form onSubmit={handleSubmit(onSubmit)}
									id="requestMeeting"
									className="mb-4 guideline_info">
									<div className="pad-0">
										<div className="row justify-content-center">
											<div className="col-lg-5 ">
												<div className={translate('pr-25', 'pr-0')}>
													<Controller
														render={({ field: { onChange, value } }) => (
															<InputText
																id="title"
																placeholder={translate('Title', 'عنوان')}
																value={value}
																onChange={onChange}
																style={{
																	boxShadow: "none",
																	borderColor: "#CBCBCB",
																	border: errors.title ? "1px solid red" : "",
																}}
																className=" mt-4 rad requestingMeetingInputs"
															/>
														)}
														defaultValue=""
														rules={{ required: true, minLength: 4 }}
														name="title"
														control={control}
													/>
													{errors.title && errors.title.type === "required" && (
														<span className="errors">{translate('Title is required.', 'مطلوب العنوان.')}</span>
													)}
												</div>
												<div className={translate('pr-25', 'pr-0')}>
													<Controller
														render={({ field: { onChange, value } }) => (
															<InputText
																id="fullname"
																placeholder={translate("Full Name", "الاسم بالكامل")}
																value={value}
																onChange={onChange}
																style={{
																	boxShadow: "none",
																	borderColor: "#CBCBCB",
																	border: errors.fullName ? "1px solid red" : "",
																}}
																className=" mt-4 rad requestingMeetingInputs"
															/>
														)}
														defaultValue=""
														rules={{ required: true, minLength: 4 }}
														name="fullName"
														control={control}
													/>
													{errors.fullName && errors.fullName.type === "required" && (
														<span className="errors">{translate('Full Name is required.', 'الإسم الكامل ضروري.')}</span>
													)}
												</div>
												<div className={translate('pr-25', 'pr-0')}>
													<Controller
														render={({ field: { onChange, value } }) => (
															<InputText
																id="email"
																placeholder={translate("Email Address", "عنوان البريد الإلكتروني")}
																value={value}
																onChange={onChange}
																style={{
																	boxShadow: "none",
																	borderColor: "#CBCBCB",
																	border: errors.email ? "1px solid red" : "",
																}}
																className=" mt-4 rad requestingMeetingInputs"
															/>
														)}
														defaultValue=""
														rules={{ required: true, minLength: 4 }}
														name="email"
														control={control}
													/>
													{errors.email && errors.email.type === "required" && (
														<span className="errors">{translate('Email is required.', 'البريد الالكتروني مطلوب.')}</span>
													)}
												</div>
											</div>

											<div className="col-lg-5 ">
												<div className="pl-25">
													<Controller
														render={({ field: { onChange, value } }) => (
															<InputNumeric
																id="phone"
																placeholder={translate("Phone Number", "رقم الهاتف")}
																value={value}
																onChange={onChange}
																type='phone'
																style={{
																	boxShadow: "none",
																	borderColor: "#CBCBCB",
																	border: errors.phone ? "1px solid red" : "",
																	textAlign: translate('left', 'right'),
																	direction: 'ltr'
																}}
																className=" mt-4 rad requestingMeetingInputs "
															/>
														)}
														defaultValue=""
														// eslint-disable-next-line no-useless-escape
														rules={{ required: true, minLength: 4, pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/, }}
														name="phone"
														control={control}
													/>
													{errors.phone && errors.phone.type === "required" && (
														<span className="errors">{translate('Phone Number is required.', 'مطلوب رقم الهاتف.')}</span>
													)}
												</div>
												<div className="pl-25">
													<Controller render={({ field: { onChange, value } }) => <DatePicker className={`pointer col-12 shadow-none form-control mt-4 ${errors.time && "border_form"}`} onChange={onChange} placeholderText={translate('Preffered date and time to call you', 'التاريخ والوقت المفضل للاتصال بك')} value={value} selected={value} showTimeSelect dateFormat="MMMM d, yyyy h:mm aa" />} rules={{ required: true }} name="time" control={control} />
													{errors.time && <span style={{ color: "red" }}>{translate('Date and time are required.', 'التاريخ والوقت مطلوبة.')}</span>}
												</div>

												<div className={`d-flex mt-4 ${translate('pl-25', 'pr-25')}`}>
													<Button
														className=" "
														type="submit"
														style={{
															background: "rgb(198 2 36)",
															padding: "0.7rem 1.8rem",
															border: "none",
															fontSize: "14px",
															fontFamily: checkFontFamily(true),
														}}
													>
														{translate('Request Meeting', 'طلب الاجتماع')}
													</Button>
													<Loader message={<span><Spinner small={true} notFixed={true} /> </span>} show={loaderState} backgroundStyle={{ zIndex: "555" }} className="ml-3">
													</Loader>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
						}
						{/* //* *************************************************************************** */}
						{/* //* *************************************************************************** */}
						<Footer data={PAGEDATA.footer} socials={PAGEDATA.social} />
					</div>
				</>
			}

		</div >
	);
}

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import Loader from "react-loader-advanced";
import { toast } from "react-toastify";
import Spinner from "../../components/spinner/Spinner";
// import DatePicker from '../../components/Date-Picker/PickerDate'
// import DatePicker from "react-datepicker";
import TextArea from "../../components/Text-Area/TextArea";

import { Button } from "reactstrap";

import { getSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";

import Footer from "../../components/footer/Footer";
import InputText from "../../components/InputText/InputText";
import InputNumeric from "../../components/InputNumeric/InputNumeric";

import "../../App.css";
import "./IndustryKpp.css";
import "./contact.css";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ContactUs(props) {

	const [loaderState, setLoaderState] = useState(false);

	const [PAGEDATA, setPageData] = useState({})

	const {
		control,
		setValue,
		handleSubmit,
		formState: { errors },
		// watch,
	} = useForm({
		defaultValues: {
			title: "",
			fullName: "",
			email: "",
			phone: "",
			message: "",
		},
	});



	useEffect(() => {
		props.setPageTitle('Contact Us', 'اتصل بنا')
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source()

		const postedData = {
			page_id: 7
		}

		props.toggleSpinner(true)

		axios({
			method: "post",
			url: `${WS_LINK}get_page_component`,
			data: postedData,
			cancelToken: source.token,
		})
			.then(res => {

				setPageData([res.data.components[0], res.data.footer, res.data.social])
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





	const onSubmit = (data) => {
		document.getElementById("requestMeeting").scrollIntoView({ behavior: "smooth", block: "center" });

		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			subject: data.title,
			name: data.fullName,
			email: data.email,
			phone: data.phone,
			message: data.message,
		};

		setLoaderState(true);

		axios({
			method: "post",
			url: `${WS_LINK}contact_us_submit`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				setValue("title", "");
				setValue("fullName", "");
				setValue("email", "");
				setValue("phone", "");
				setValue("message", "");
				errors.title = false;
				errors.fullName = false;
				errors.email = false;
				errors.phone = false;
				errors.message = false;
				// eslint-disable-next-line no-lone-blocks
				{
					getSessionInfo("language") === "english"
						? toast.success("Contacted successfully!", {
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
				}
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
	console.log('render')

	return (
		<div>
			{Object.keys(PAGEDATA).length > 0 &&
				<>
					{getSessionInfo("language") === "english" ? (
						<>
							<div className="pagesHeaderTitle" style={{ backgroundColor: "#4CC9B7", padding: "30px", paddingLeft: "10%", fontFamily: 'cnam' }}>
								<div className="row justify-content-start px-4 px-md-5 px-lg-0">
									<div className="text-white col-lg-5" style={{ fontSize: "28px", fontFamily: "cnam-bold" }}>
										Contact us
									</div>
									<div className="col-lg-5"></div>
								</div>
							</div>
							<div className="bg-white hide_scrollbar px-2 px-lg-0 homePageBigContainer" style={{}}>
								<div className="py-3 mb-5 px-3 px-md-5 px-lg-0">
									<div className="d-flex mt-3 flex-sm-row flex-column justify-content-between contact-container" style={{ padding: "30px 10% 30px 10%" }}>
										<div className="col p-0" style={{ fontSize: "1.1em" }}>

											{PAGEDATA[0].status === 1 &&
												<div dangerouslySetInnerHTML={{ __html: PAGEDATA[0].english && PAGEDATA[0].english }} />
											}

											<div className="d-flex">
												{PAGEDATA[2].map((item, index) => item.active === 1 &&
													<a href={item.social_link} key={item.social_id} className={index !== 0 && 'ml-1'}>
														<img src={item.social_icon} alt={`icon`} style={{ maxHeight: '20px', maxWidth: '20px' }} />
													</a>
												)}
											</div>

										</div>
										<div className="col p-0 mt-sm-0 mt-4">
											<h5 style={{ fontFamily: "cnam-bold" }}>Fill the form below</h5>
											<form onSubmit={handleSubmit(onSubmit)} id="requestMeeting" className="ml-0 pl-0">
												<div className="pad-0">
													<div className="row justify-content-center">
														<div className="col-lg-6 ">

															<div className="">
																<Controller
																	render={({ field: { onChange, value } }) => (
																		<InputText
																			id="fullname"
																			placeholder="Full Name"
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
																{errors.fullName && errors.fullName.type === "required" && <span className="errors">Full Name is required.</span>}
															</div>
															<div className="">
																<Controller
																	render={({ field: { onChange, value } }) => (
																		<InputText
																			id="title"
																			placeholder="Subject"
																			value={value}
																			onChange={onChange}
																			style={{
																				boxShadow: "none",
																				borderColor: "#CBCBCB",
																				border: errors.title ? "1px solid red" : "",
																			}}
																			className=" mt-sm-4 mt-1 rad requestingMeetingInputs"
																		/>
																	)}
																	defaultValue=""
																	rules={{ required: true, minLength: 4 }}
																	name="title"
																	control={control}
																/>
																{errors.title && errors.title.type === "required" && <span className="errors">Subject is required.</span>}
															</div>
														</div>

														<div className="col-lg-6 p-0">

															<div className="col-12">
																<Controller
																	render={({ field: { onChange, value } }) => (
																		<InputText
																			id="email"
																			placeholder="Email Address"
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
																{errors.email && errors.email.type === "required" && <span className="errors">Email is required.</span>}
															</div>
															<div className="col-12">
																<Controller
																	render={({ field: { onChange, value } }) => (
																		<InputNumeric
																			id="phone"
																			placeholder="Phone Number"
																			value={value}
																			onChange={onChange}
																			type="phone"
																			style={{
																				boxShadow: "none",
																				borderColor: "#CBCBCB",
																				border: errors.phone ? "1px solid red" : "",
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
																{errors.phone && errors.phone.type === "required" && <span className="errors">Phone Number is required.</span>}
															</div>

														</div>
													</div>
													<div className="">
														<Controller
															render={({ field: { onChange, value } }) => (

																<TextArea
																	placeholder="Write a reply..."
																	className=" mt-4"
																	minRows={5}
																	maxRows={10}
																	value={value}
																	onChange={onChange}
																	style={{
																		resize: "none",
																		padding: "15px",
																		border: errors.message ? '1px solid red' : "1px solid lightgrey",
																		borderRadius: "5px",
																		boxShadow: "-1px 1px 1px 0px #e0e0e0",
																		width: "100%",
																	}}
																/>
															)}
															defaultValue=""
															rules={{ required: true, minLength: 4 }}
															name="message"
															control={control}
														/>
														{errors.message && errors.message.type === "required" && <span className="errors">Message is required.</span>}
													</div>

													<div className="d-flex mt-4 ">
														<Button
															// onClick={handleSubmit}
															className=" "
															type="submit"
															style={{
																background: "rgb(198 2 36)",
																padding: "0.7rem 1.8rem",
																border: "none",
																fontSize: "14px",
																fontFamily: "cnam-bold",
															}}
														>
															Contact us
														</Button>
														<Loader
															message={
																<span>
																	<Spinner small={true} notFixed={true} />{" "}
																</span>
															}
															show={loaderState}
															backgroundStyle={{ zIndex: "555" }}
															className="ml-3"
														></Loader>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>

								<Footer data={PAGEDATA[1]} socials={PAGEDATA[2]} class="largeFooterOverride" />
							</div>
						</>
					) : (
						// ----------ARABIC------------

						<>
							<div className="row justify-content-center pagesHeaderTitle-ar" style={{ backgroundColor: "#4CC9B7", padding: "30px", paddingRight: "8%", fontFamily: 'cnam-ar' }}>
								<div className="row justify-content-start">
									<div className="text-white col-lg-5 px-3 px-lg-0" style={{ fontSize: "28px", fontFamily: "cnam-bold-ar" }}>
										اتصل بنا
									</div>
									<div className="col-lg-5"></div>
								</div>
							</div>

							<div className="bg-white hide_scrollbar  px-3 px-lg-0 homePageBigContainer" style={{ textAlign: "right", overflowX: "hidden", fontFamily: "cnam-ar" }}>
								<div className="py-3 mb-5 px-3 px-md-4 px-lg-0">
									<div className="d-flex mt-3 flex-sm-row flex-column justify-content-between contact-container" style={{ padding: "30px 8% 30px 8%" }}>
										<div className="col p-0" style={{ fontSize: "1.1em" }}>
											{/* <h5 style={{ fontFamily: "cnam-bold-ar" }}>بيانات المتصل</h5>
											<p className="mb-2" style={{ marginTop: "10px", color: "grey" }}>
												جدة، سترت كيك نيكولاس
											</p>
											<p className="p-0" style={{ fontWeight: '600', fontFamily: "cnam", direction: "ltr" }}>
												<span>
													+932456767 <br />
												</span>
												<span>cnam@email.com</span>
											</p>
											<div>
												<h5 style={{ fontFamily: "cnam-bold-ar" }}>تابعنا</h5>
												<div>

													<span class="dot ml-1"></span>
													<span class="dot ml-1"></span>
													<span class="dot ml-1"></span>
												</div>
											</div> */}
											{PAGEDATA[0].status === 1 &&
												<div dangerouslySetInnerHTML={{ __html: PAGEDATA[0].arabic && PAGEDATA[0].arabic }} />
											}

											<div className="d-flex">
												{PAGEDATA[2].map((item, index) => item.active === 1 &&
													<a href={item.social_link} key={item.social_id} className={index !== 0 && 'mr-1'}>
														<img src={item.social_icon} alt={`icon`} style={{ maxHeight: '20px', maxWidth: '20px' }} />
													</a>
												)}
											</div>
										</div>
										<div className="col p-0 mt-sm-0 mt-4 " style={{ fontFamily: "cnam-ar" }}>
											<h5 style={{ fontFamily: "cnam-bold-ar" }}>املأ النموذج أدناه</h5>
											<form onSubmit={handleSubmit(onSubmit)} id="requestMeeting" className="mr-0 pr-0">
												<div className="pad-0">
													<div className="row justify-content-center">
														<div className="col-lg-6 ">

															<div className="">
																<Controller
																	render={({ field: { onChange, value } }) => (
																		<InputText
																			id="fullname"
																			placeholder="الاسم بالكامل"
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
																{errors.fullName && errors.fullName.type === "required" && <span className="errors">الإسم الكامل ضروري.</span>}
															</div>
															<div className="">
																<Controller
																	render={({ field: { onChange, value } }) => (
																		<InputText
																			id="title"
																			placeholder="موضوع"
																			value={value}
																			onChange={onChange}
																			style={{
																				boxShadow: "none",
																				borderColor: "#CBCBCB",
																				border: errors.title ? "1px solid red" : "",
																			}}
																			className=" mt-sm-4 mt-1 rad requestingMeetingInputs"
																		/>
																	)}
																	defaultValue=""
																	rules={{ required: true, minLength: 4 }}
																	name="title"
																	control={control}
																/>
																{errors.title && errors.title.type === "required" && <span className="errors">مطلوب العنوان.</span>}
															</div>
														</div>

														<div className="col-lg-6">

															<div className="col-12 px-0">
																<Controller
																	render={({ field: { onChange, value } }) => (
																		<InputText
																			id="email"
																			placeholder="عنوان البريد الإلكتروني"
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
																{errors.email && errors.email.type === "required" && <span className="errors">البريد الالكتروني مطلوب.</span>}
															</div>
															<div className="col-12 px-0">
																<Controller
																	render={({ field: { onChange, value } }) => (
																		<InputNumeric
																			id="phone"
																			placeholder="رقم الهاتف"
																			value={value}
																			onChange={onChange}
																			style={{
																				boxShadow: "none",
																				borderColor: "#CBCBCB",
																				border: errors.phone ? "1px solid red" : "",
																				textAlign: 'right',
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
																{errors.phone && errors.phone.type === "required" && <span className="errors">مطلوب رقم الهاتف.</span>}
															</div>

														</div>
													</div>

													<div className="">
														<Controller
															render={({ field: { onChange, value } }) => (

																<TextArea
																	placeholder="اكتب رد ..."
																	className=" mt-4"
																	minRows={5}
																	maxRows={10}
																	value={value}
																	onChange={onChange}
																	style={{
																		resize: "none",
																		padding: "15px",
																		border: errors.message ? '1px solid red' : "1px solid lightgrey",
																		borderRadius: "5px",
																		boxShadow: "-1px 1px 1px 0px #e0e0e0",
																		width: "100%",
																	}}
																/>
															)}
															defaultValue=""
															rules={{ required: true, minLength: 4 }}
															name="message"
															control={control}
														/>
														{errors.message && errors.message.type === "required" && <span className="errors">الرسالة مطلوبة.</span>}
													</div>

													<div className="d-flex mt-4 ">
														<Button
															// onClick={handleSubmit}
															className=" "
															type="submit"
															style={{
																background: "rgb(198 2 36)",
																padding: "0.7rem 1.8rem",
																border: "none",
																fontSize: "14px",
																fontFamily: "cnam-bold-ar",
															}}
														>
															طلب الاجتماع
														</Button>
														<Loader
															message={
																<span>
																	<Spinner small={true} notFixed={true} />{" "}
																</span>
															}
															show={loaderState}
															backgroundStyle={{ zIndex: "555" }}
															className="ml-3"
														></Loader>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>
								<Footer data={PAGEDATA[1]} socials={PAGEDATA[2]} class="largeFooterOverride" footer3class="pr-3" />
							</div>
						</>
					)}
				</>
			}
		</div>
	);
}






/* <h5 style={{ fontFamily: "cnam-bold" }}>Contact details</h5>
											<p className="mb-2" style={{ marginTop: "10px", color: "grey" }}>
												Jeddah, strt cheick
											</p>
											<p className="p-0" style={{ fontWeight: '600' }}>
												<span>
													+932456767 <br />
												</span>
												<span>cnam@email.com</span>
											</p>
											<div>
												<h5 className="mt-4" style={{ fontFamily: "cnam-bold" }}>Follow Us</h5>
												<div>
													<span class="dot mr-1"></span>
													<span class="dot mr-1"></span>
													<span class="dot mr-1"></span>
												</div>
											</div> */






// eslint-disable-next-line no-lone-blocks
{
	/* <form onSubmit={handleSubmit(onSubmit)} id="requestMeeting">
	<div className="pad-0">
		<div className="row justify-content-center">
			<div className="col-lg-5 ">
				<div className="pr-25">
					<Controller
						render={({ field: { onChange, value } }) => (
							<InputText
								id="title"
								placeholder="Title"
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
					{errors.title && errors.title.type === "required" && <span className="errors">Title is required.</span>}
				</div>
				<div className="pr-25">
					<Controller
						render={({ field: { onChange, value } }) => (
							<InputText
								id="fullname"
								placeholder="Full Name"
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
					{errors.fullName && errors.fullName.type === "required" && <span className="errors">Full Name is required.</span>}
				</div>
			</div>

			<div className="col-lg-5 ">
				<div className="pl-25">
					<Controller
						render={({ field: { onChange, value } }) => (
							<InputText
								id="phone"
								placeholder="Phone Number"
								value={value}
								onChange={onChange}
								type="number"
								style={{
									boxShadow: "none",
									borderColor: "#CBCBCB",
									border: errors.phone ? "1px solid red" : "",
								}}
								className=" mt-4 rad requestingMeetingInputs "
							/>
						)}
						defaultValue=""
						rules={{ required: true, minLength: 4 }}
						name="phone"
						control={control}
					/>
					{errors.phone && errors.phone.type === "required" && <span className="errors">Phone Number is required.</span>}
				</div>

				<div className="pl-25">
					<Controller
						render={({ field: { onChange, value } }) => (
							<InputText
								id="email"
								placeholder="Email Address"
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
					{errors.email && errors.email.type === "required" && <span className="errors">Email is required.</span>}
				</div>
				
				<div className="d-flex mt-4 pl-25">
					<Button
						// onClick={handleSubmit}
						className=" "
						type="submit"
						style={{
							background: "rgb(198 2 36)",
							padding: "0.7rem 1.8rem",
							border: "none",
							fontSize: "14px",
							fontFamily: "cnam-bold",
						}}
					>
						Request Meeting
					</Button>
					<Loader
						message={
							<span>
								<Spinner small={true} notFixed={true} />{" "}
							</span>
						}
						show={loaderState}
						backgroundStyle={{ zIndex: "555" }}
						className="ml-3"
					></Loader>
				</div>
			</div>
		</div>
	</div>
</form> */
}

import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet";

import { Button } from "reactstrap";
import Loader from "react-loader-advanced";
import { useDropzone } from "react-dropzone";

import InputText from "../../components/InputText/InputText";
import Selector from "../../components/Selector/Selector";
import Simple from "../../containers/Simple";
import DatePicker from "../../components/Date-Picker/PickerDate";
import Spinner from "../../components/spinner/Spinner";

import { WS_LINK } from "../../globals";
import { downloadFile, formatDate } from "../../functions";
import { getSessionInfo, clearSessionInfo } from "../../variable";

import upload from "../../assets/images_svg/upload.svg";

import Clear from "@material-ui/icons/Clear";

import "./UploadNDA.css";
import "../../App.css";

export default function UploadNDA(props) {
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			c_name: "",
			c_owner: "",
			c_headquarters: "",
			c_jobtitle: "",
			c_country: "",
			c_address1: "",
			c_email: "",
			c_name_ar: "",
			c_owner_ar: "",
			c_headquarters_ar: "",
			c_jobtitle_ar: "",
			c_country_ar: "",
			c_address1_ar: "",
			c_email_ar: "",
		},
	});

	//////////////// STATES
	const [loaderState, setLoaderState] = useState(true);
	const [openfile, setOpenfile] = useState(false);
	const [miniSpinner, setMiniSpinner] = useState(false);
	const [fileError, setFileError] = useState(false);

	const [sendFiles, setSendFiles] = useState({
		fileName: "",
		fileSend: "",
	});

	const [info, setInfo] = useState({
		address2: "",
	});

	//////////////////////////////////// SET STATES

	const handleChange = (name, value) => {
		setInfo({ ...info, [name]: value });
	};

	const removeFile = () => {
		setSendFiles({
			fileName: "",
			fileSend: "",
		});
	};

	const onDrop = useCallback((acceptedFiles) => {
		let files = acceptedFiles[0];
		if (files !== undefined) {
			let fd = new FormData();
			fd.append("file", files);

			setMiniSpinner(true);
			axios({
				method: "post",
				url: `${WS_LINK}upload_nda`,
				data: fd,
			}).then((res) => {
				if (res.data !== "error") {
					setSendFiles({
						fileName: files,
						fileSend: res.data,
					});
				}
				setMiniSpinner(false);
				setFileError(false);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	////////////////////////// DROPZONE
	const {
		// acceptedFiles,
		getRootProps,
		getInputProps,
		// fileRejections
	} = useDropzone({ accept: ".pdf", onDrop });

	useEffect(() => {
		check_nda();
	}, []);

	const check_nda = () => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
		};

		setLoaderState(true);
		axios({
			method: "post",
			url: `${WS_LINK}check_self_signed_nda`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				setLoaderState(false);
				if (res.data && res.data.length !== 0 && res.data === "pending") setOpenfile(true);
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

	const onSubmit = (data) => {
		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			// nda_date: data.c_date.getDate() + '/' + (parseInt(data.c_date.getMonth()) + 1).toString() + '/' + data.c_date.getFullYear(),
			nda_date: formatDate(data.c_date),
			company_name: data.c_name,
			company_owner: data.c_owner,
			company_head: data.c_headquarters,
			job_title: data.c_jobtitle,
			country: data.c_country.value,
			a1: data.c_address1,
			a2: info.address2,
			email: data.c_email,
			nda_date_ar: data.c_date_ar.getDate() + "/" + (parseInt(data.c_date_ar.getMonth()) + 1).toString() + "/" + data.c_date_ar.getFullYear(),
			company_name_ar: data.c_name_ar,
			company_owner_ar: data.c_owner_ar,
			company_head_ar: data.c_headquarters_ar,
			job_title_ar: data.c_jobtitle_ar,
			country_ar: data.c_country_ar.value,
			a1_ar: data.c_address1_ar,
			a2_ar: info.address2_ar,
			email_ar: data.c_email_ar,
		};
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		// console.log( data.c_country.value + data.c_address1 && (" ," + data.c_address1) + data.c_address2 && (" ," + data.c_address2))
		setLoaderState(true);
		axios({
			method: "post",
			url: `${WS_LINK}generate_nda_pdf`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data !== "role error" && res.data !== "token error") {
					setLoaderState(false);
					const url_to_open =
						"http://localhost:3000/nda_template/" +
						btoa(
							encodeURIComponent(
								JSON.stringify({
									date:
										data.c_date.getDate() +
										"/" +
										(parseInt(data.c_date.getMonth()) + 1).toString() +
										"/" +
										data.c_date.getFullYear(),
									company_name: data.c_name,
									headquarter: data.c_headquarters,
									title: data.c_jobtitle,
									address: data.c_country.value + ", " + data.c_address1 + (info.address2 && ", " + info.address2),
									name: data.c_owner,
									email: data.c_email,
									date_ar:
										data.c_date_ar.getDate() +
										"/" +
										(parseInt(data.c_date_ar.getMonth()) + 1).toString() +
										"/" +
										data.c_date_ar.getFullYear(),
									company_name_ar: data.c_name_ar,
									headquarter_ar: data.c_headquarters_ar,
									title_ar: data.c_jobtitle,
									address_ar: data.c_country_ar.value + ", " + data.c_address1_ar + (info.address2_ar && ", " + info.address2_ar),
									name_ar: data.c_owner_ar,
									email_ar: data.c_email_ar,
								})
							)
						);
					window.open(url_to_open, "_blank");
					// downloadFileWithExtension(res.data, 'NDA.docx', 'docx')
					setOpenfile(true);

					// //downloadFile(res.data, 'nda.pdf')
					// //props.history.push('/NDA
				} else {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
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
	};

	const scroll = () => {
		document.getElementById("name").scrollIntoView({ behavior: "smooth" });
	};

	const check_file = () => {
		if (sendFiles.fileName) {
			const cancelToken = axios.CancelToken;
			const source = cancelToken.source();
			const postedData = {
				userid: getSessionInfo("id"),
				token: getSessionInfo("token"),
				tick: 0,
				nda_path: sendFiles.fileSend,
				fileName: sendFiles.fileName,
			};

			setLoaderState(true);
			axios({
				method: "post",
				url: `${WS_LINK}agree_guidline`,
				data: postedData,
				cancelToken: source.token,
			})
				.then((res) => {
					if (res.data !== "role error" && res.data !== "token error") {
						setLoaderState(true);
						props.history.replace("/post_challenge");
					} else {
						clearSessionInfo();
						window.location.reload(false).then(props.history.replace("/"));
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
		} else setFileError(true);
	};

	const company_address = [{ value: "Saudi Arabia", label: "Saudi Arabia" }];
	const company_address_ar = [{ value: "Saudi Arabia", label: "المملكة العربية السعودية" }];

	return (
		<>
			<Loader
				message={
					<span>
						<Spinner />{" "}
					</span>
				}
				show={loaderState}
			>
				<Helmet>
					<title>{getSessionInfo("language") === "arabic" ? "عن برنامج الشراكة المعرفية | تحميل NDA" : "Upload NDA | CNAM Portal"}</title>
				</Helmet>
				{!loaderState && (
					<>
						{getSessionInfo("language") === "english" ? (
							<Simple
								props={props}
								logo={true}
								left={
									<div className="">
										<div className="col-12 h3 mt-3" style={{ fontWeight: "bold" }} id="name">
											Sign the NDA
										</div>

										<form onSubmit={handleSubmit(onSubmit)} className="w-100">
											{openfile !== true && (
												<>
													<div className="col-12 mt-4 bold_700">Date *</div>

													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<DatePicker
																	dateFormat="dd/MM/yyyy"
																	className={`pointer col-12 form-control ${errors.c_date && "border_form"}`}
																	placeholder={"DD-MM-YYYY"}
																	value={value}
																	selected={value}
																	onChange={onChange}
																	// style={{ border: errors.department ? "1px solid red" : "" }}
																/>
															)}
															rules={{ required: true }}
															name="c_date"
															control={control}
														/>
														{errors.c_date && <span style={{ color: "red" }}>Date is required.</span>}
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Company Name *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{ border: errors.c_name ? "1px solid red" : "" }}
																	placeholder="Company Name"
																/>
															)}
															//className="form-control"
															rules={{
																required: true,
															}}
															name="c_name"
															control={control}
														/>
														{errors.c_name && errors.c_name.type === "required" && (
															<span className="errors">Company Name is required.</span>
														)}
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Company Headquarters *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{ border: errors.c_headquarters ? "1px solid red" : "" }}
																	placeholder="Company Headquarters"
																/>
															)}
															rules={{ required: true }}
															name="c_headquarters"
															control={control}
														/>
														{errors.c_headquarters && errors.c_headquarters.type === "required" && (
															<span className="errors">Company Headquarters is required.</span>
														)}
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Job Title *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{ border: errors.c_jobtitle ? "1px solid red" : "" }}
																	placeholder="Job Title"
																/>
															)}
															rules={{ required: true }}
															name="c_jobtitle"
															control={control}
														/>
														{errors.c_jobtitle && errors.c_jobtitle.type === "required" && (
															<span className="errors">Job Title is required.</span>
														)}
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Company Address *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<Selector
																	value={value}
																	onChange={onChange}
																	options={company_address}
																	placeholder="Country"
																	className={`col-12 mb-2 p-0  w_shadow ${
																		errors.c_country && "border_form_selector"
																	}`}
																	style={{ boxShadow: "0px 1px 3px -2px #888888" }}
																/>
															)}
															rules={{ required: true }}
															name="c_country"
															control={control}
														/>
														{errors.c_country && <span className="errors_c d-block">Country is required.</span>}

														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	placeholder="Address Line 1"
																	className="col-12 mb-2 "
																	onChange={onChange}
																	style={{
																		border: errors.c_address1 ? "1px solid red" : "",
																	}}
																/>
															)}
															rules={{ required: true }}
															name="c_address1"
															control={control}
														/>
														{errors.c_address1 && errors.c_address1.type === "required" && (
															<span className="errors_c d-block">Company Address is required.</span>
														)}

														<InputText
															type="text"
															name="address2"
															value={info.address2}
															onChange={(e) => handleChange(e.target.name, e.target.value)}
															placeholder="Address Line 2"
															className="col-12 mb-2"
														/>
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Decision Maker Name *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{ border: errors.c_owner ? "1px solid red" : "" }}
																	placeholder="Decision Maker Name"
																/>
															)}
															//className="form-control"
															rules={{
																required: true,
															}}
															name="c_owner"
															control={control}
														/>
														{errors.c_owner && errors.c_owner.type === "required" && (
															<span className="errors">Decision Maker Name is required.</span>
														)}
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Decision maker Email *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{ border: errors.c_email ? "1px solid red" : "" }}
																	placeholder="name@email.com"
																/>
															)}
															//className="form-control"
															rules={{
																required: true,
																pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
															}}
															name="c_email"
															control={control}
														/>
														{errors.c_email && errors.c_email.type === "required" && (
															<span className="errors">Email is required.</span>
														)}
														{errors.c_email && errors.c_email.type === "pattern" && (
															<span className="errors">Email is not valid.</span>
														)}
													</div>
													<div style={{ fontFamily: "cnam-ar", textAlign: "right", direction: "rtl" }}>
														<div className="col-12 h4 mt-4" style={{ fontWeight: "bold" }} id="name">
															اتفاقية عدم الإفصاح
														</div>
														<div className="col-12 mb-2 mt-4 bold_700">تاريخ *</div>

														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<DatePicker
																		dateFormat="dd/MM/yyyy"
																		className={`pointer col-12 form-control ${errors.c_date_ar && "border_form"}`}
																		placeholder={"DD-MM-YYYY"}
																		value={value}
																		selected={value}
																		onChange={onChange}
																		// style={{ border: errors.department ? "1px solid red" : "" }}
																	/>
																)}
																rules={{ required: true }}
																name="c_date_ar"
																control={control}
															/>
															{errors.c_date_ar && <span style={{ color: "red" }}>التاريخ مطلوب.</span>}
														</div>

														<div className="col-12 mb-2 mt-4 bold_700">اسم المنشأة *</div>
														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<InputText
																		value={value}
																		onChange={onChange}
																		style={{ border: errors.c_name_ar ? "1px solid red" : "" }}
																		placeholder="اسم المنشأة"
																	/>
																)}
																//className="form-control"
																rules={{
																	required: true,
																}}
																name="c_name_ar"
																control={control}
															/>
															{errors.c_name_ar && errors.c_name_ar.type === "required" && (
																<span className="errors">اسم المنشأة مطلوب.</span>
															)}
														</div>

														<div className="col-12 mb-2 mt-4 bold_700">المقر الرئيسي للشركة *</div>
														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<InputText
																		value={value}
																		onChange={onChange}
																		style={{ border: errors.c_headquarters_ar ? "1px solid red" : "" }}
																		placeholder="المقر الرئيسي للشركة"
																	/>
																)}
																rules={{ required: true }}
																name="c_headquarters_ar"
																control={control}
															/>
															{errors.c_headquarters_ar && errors.c_headquarters_ar.type === "required" && (
																<span className="errors">اسم المستخدم مطلوب.</span>
															)}
														</div>

														<div className="col-12 mb-2 mt-4 bold_700">المسمى الوظيفي *</div>
														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<InputText
																		value={value}
																		onChange={onChange}
																		style={{ border: errors.c_jobtitle_ar ? "1px solid red" : "" }}
																		placeholder="المسمى الوظيفي"
																	/>
																)}
																rules={{ required: true }}
																name="c_jobtitle_ar"
																control={control}
															/>
															{errors.c_jobtitle_ar && errors.c_jobtitle_ar.type === "required" && (
																<span className="errors">المسمى الوظيفي مطلوب.</span>
															)}
														</div>

														<div className="col-12 mb-2 mt-4 bold_700">عنوان المنشأة *</div>
														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<Selector
																		value={value}
																		onChange={onChange}
																		options={company_address_ar}
																		placeholder="دولة"
																		className={`col-12 mb-2 p-0  w_shadow ${
																			errors.c_country_ar && "border_form_selector"
																		}`}
																		style={{ boxShadow: "0px 1px 3px -2px #888888" }}
																	/>
																)}
																rules={{ required: true }}
																name="c_country_ar"
																control={control}
															/>
															{errors.c_country_ar && <span className="errors_c d-block">الدولة مطلوبة.</span>}

															<Controller
																render={({ field: { onChange, value } }) => (
																	<InputText
																		value={value}
																		placeholder="العنوان الأول"
																		className="col-12 mb-2 "
																		onChange={onChange}
																		style={{
																			border: errors.c_address1_ar ? "1px solid red" : "",
																		}}
																	/>
																)}
																rules={{ required: true }}
																name="c_address1_ar"
																control={control}
															/>
															{errors.c_address1_ar && errors.c_address1_ar.type === "required" && (
																<span className="errors_c d-block">عنوان المنشأة مطلوب.</span>
															)}

															<InputText
																type="text"
																name="address2_ar"
																value={info.address2_ar}
																onChange={(e) => handleChange(e.target.name, e.target.value)}
																placeholder="العنوان الثاني"
																className="col-12 mb-2"
															/>
														</div>

														<div className="col-12 mb-2 mt-4 bold_700">اسم المفوض بالتوقيع *</div>
														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<InputText
																		value={value}
																		onChange={onChange}
																		style={{ border: errors.c_owner_ar ? "1px solid red" : "" }}
																		placeholder="اسم المفوض بالتوقيع"
																	/>
																)}
																//className="form-control"
																rules={{
																	required: true,
																}}
																name="c_owner_ar"
																control={control}
															/>
															{errors.c_owner_ar && errors.c_owner_ar.type === "required" && (
																<span className="errors">مالك المنشأة مطلوب.</span>
															)}
														</div>

														{/* <div className="col-12 mb-2 mt-4 bold_700">  البريد الإلكترون لصانع القرار *</div>
                          <div className="col-12">
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <InputText
                                  value={value}
                                  onChange={onChange}
                                  style={{ border: errors.c_email_ar ? "1px solid red" : "" }}
                                  placeholder="name@email.com"
                                />
                              )}
                              //className="form-control"
                              rules={{
                                required: true,
                                pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                              }}
                              name="c_email_ar"
                              control={control}
                            />
                            {errors.c_email_ar && errors.c_email_ar.type === "required" && (
                              <span className="errors">البريد الالكتروني مطلوب.</span>
                            )}
                            {errors.c_email_ar && errors.c_email_ar.type === "pattern" && (
                              <span className="errors">البريد الإلكتروني غير صالح.</span>
                            )}
                          </div> */}
													</div>
												</>
											)}
											{openfile && (
												<div className="mt-4 col-12">
													<div {...getRootProps({ className: "dropzone", id: sendFiles.fileName && "green" })}>
														<input {...getInputProps()} accept="application/pdf" />

														<div className="p-4 text-center">
															{sendFiles.fileName.length === 0 ? (
																<>
																	<img src={upload} alt="" style={{ width: "24px" }} />
																	<span className="ml-2 mt-1" style={{ fontWeight: "bold", color: "black" }}>
																		Upload the signed version of this
																		<Link style={{ color: "rgb(198 2 36)" }}> NDA document</Link>
																	</span>
																</>
															) : (
																<div>
																	<Clear className="mr-2 pointer" onClick={removeFile} />
																	<span
																		style={{ color: "rgb(198 2 36)" }}
																		onClick={() => downloadFile(sendFiles.fileSend, sendFiles.fileName)}
																	>
																		{sendFiles.fileName.path}
																	</span>
																</div>
															)}
															{miniSpinner && <div className="spinner-border spinner-border-sm text-muted ml-3"></div>}
														</div>
													</div>
													{fileError && <span className="errors">Please upload the NDA file.</span>}
												</div>
											)}

											<div className="col-12 mt-4 mb-4">
												{!openfile ? (
													<Button
														disabled={miniSpinner}
														style={{
															backgroundColor: "rgb(198 2 36)",
															border: "none",
															padding: "0.7rem 2rem",
															fontWeight: "600",
														}}
														className=" float-right"
														type="submit"
														onClick={scroll}
													>
														Continue
													</Button>
												) : (
													<div className="d-md-flex">
														<Button
															onClick={() => {
																setOpenfile(false);
																reset();
																setInfo({ address2: "" });
															}}
															className="col-12 col-md-4"
															style={{
																backgroundColor: "transparent",
																fontSize: "0.9rem",
																padding: "0.65rem",
																borderColor: "rgb(198 2 36)",
																fontWeight: "600",
																color: "rgb(198 2 36)",
															}}
														>
															Generate New
														</Button>
														<Button
															disabled={miniSpinner}
															style={{
																backgroundColor: "rgb(198 2 36)",
																border: "none",
																padding: "0.65rem",
																fontWeight: "600",
																fontSize: "0.9rem",
															}}
															className="col-12 col-md-4 button-margin mt-mt-0 ml-0 ml-md-3"
															onClick={check_file}
														>
															Continue
														</Button>
													</div>
												)}
											</div>
										</form>
									</div>
								}
								right={
									<>
										<div className="col-12 h5" style={{ fontFamily: "cnam-bold" }}>
											Sign Up To CNAM PORTAL
										</div>
										
									</>
								}
							/>
						) : (
							//--------ARABIC-----------

							<Simple
								props={props}
								logo={true}
								left={
									<div className="">
										<div className="col-12 h3 mt-3" style={{ fontWeight: "bold", fontFamily: "cnam-ar" }} id="name">
											توقيع إتفاقية عدم الإفصاح
										</div>

										<form onSubmit={handleSubmit(onSubmit)} className="w-100">
											{openfile !== true && (
												<>
													<div className="col-12 mt-4 bold_700">Date *</div>

													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<DatePicker
																	dateFormat="dd/MM/yyyy"
																	className={`pointer col-12 form-control ${errors.c_date && "border_form"}`}
																	placeholder={"DD-MM-YYYY"}
																	value={value}
																	selected={value}
																	onChange={onChange}
																	// style={{ border: errors.department ? "1px solid red" : "" }}
																/>
															)}
															rules={{ required: true }}
															name="c_date"
															control={control}
														/>
														{errors.c_date && <span style={{ color: "red" }}>Date is required.</span>}
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Company Name *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{ border: errors.c_name ? "1px solid red" : "" }}
																	placeholder="Company Name"
																/>
															)}
															//className="form-control"
															rules={{
																required: true,
															}}
															name="c_name"
															control={control}
														/>
														{errors.c_name && errors.c_name.type === "required" && (
															<span className="errors">Company Name is required.</span>
														)}
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Company Headquarters *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{ border: errors.c_headquarters ? "1px solid red" : "" }}
																	placeholder="Company Headquarters"
																/>
															)}
															rules={{ required: true }}
															name="c_headquarters"
															control={control}
														/>
														{errors.c_headquarters && errors.c_headquarters.type === "required" && (
															<span className="errors">Company Headquarters is required.</span>
														)}
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Job Title *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{ border: errors.c_jobtitle ? "1px solid red" : "" }}
																	placeholder="Job Title"
																/>
															)}
															rules={{ required: true }}
															name="c_jobtitle"
															control={control}
														/>
														{errors.c_jobtitle && errors.c_jobtitle.type === "required" && (
															<span className="errors">Job Title is required.</span>
														)}
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Company Address *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<Selector
																	value={value}
																	onChange={onChange}
																	options={company_address}
																	placeholder="Country"
																	className={`col-12 mb-2 p-0  w_shadow ${
																		errors.c_country && "border_form_selector"
																	}`}
																	style={{ boxShadow: "0px 1px 3px -2px #888888" }}
																/>
															)}
															rules={{ required: true }}
															name="c_country"
															control={control}
														/>
														{errors.c_country && <span className="errors_c d-block">Country is required.</span>}

														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	placeholder="Address Line 1"
																	className="col-12 mb-2 "
																	onChange={onChange}
																	style={{
																		border: errors.c_address1 ? "1px solid red" : "",
																	}}
																/>
															)}
															rules={{ required: true }}
															name="c_address1"
															control={control}
														/>
														{errors.c_address1 && errors.c_address1.type === "required" && (
															<span className="errors_c d-block">Company Address is required.</span>
														)}

														<InputText
															type="text"
															name="address2"
															value={info.address2}
															onChange={(e) => handleChange(e.target.name, e.target.value)}
															placeholder="Address Line 2"
															className="col-12 mb-2"
														/>
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Decision Maker Name *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{ border: errors.c_owner ? "1px solid red" : "" }}
																	placeholder="Decision Maker Name"
																/>
															)}
															//className="form-control"
															rules={{
																required: true,
															}}
															name="c_owner"
															control={control}
														/>
														{errors.c_owner && errors.c_owner.type === "required" && (
															<span className="errors">Decision Maker Name is required.</span>
														)}
													</div>

													<div className="col-12 mb-2 mt-4 bold_700">Email *</div>
													<div className="col-12">
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	value={value}
																	onChange={onChange}
																	style={{ border: errors.c_email ? "1px solid red" : "" }}
																	placeholder="name@email.com"
																/>
															)}
															//className="form-control"
															rules={{
																required: true,
																pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
															}}
															name="c_email"
															control={control}
														/>
														{errors.c_email && errors.c_email.type === "required" && (
															<span className="errors">Email is required.</span>
														)}
														{errors.c_email && errors.c_email.type === "pattern" && (
															<span className="errors">Email is not valid.</span>
														)}
													</div>
													<div style={{ fontFamily: "cnam-ar", textAlign: "right", direction: "rtl" }}>
														<div className="col-12 h4 mt-4" style={{ fontWeight: "bold" }} id="name">
															اتفاقية عدم الإفصاح
														</div>
														<div className="col-12 mb-2 mt-4 bold_700">تاريخ *</div>

														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<DatePicker
																		dateFormat="dd/MM/yyyy"
																		className={`pointer col-12 form-control ${errors.c_date_ar && "border_form"}`}
																		placeholder={"DD-MM-YYYY"}
																		value={value}
																		selected={value}
																		onChange={onChange}
																		// style={{ border: errors.department ? "1px solid red" : "" }}
																	/>
																)}
																rules={{ required: true }}
																name="c_date_ar"
																control={control}
															/>
															{errors.c_date_ar && <span style={{ color: "red" }}>التاريخ مطلوب.</span>}
														</div>

														<div className="col-12 mb-2 mt-4 bold_700">اسم المنشأة *</div>
														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<InputText
																		value={value}
																		onChange={onChange}
																		style={{ border: errors.c_name_ar ? "1px solid red" : "" }}
																		placeholder="اسم المنشأة"
																	/>
																)}
																//className="form-control"
																rules={{
																	required: true,
																}}
																name="c_name_ar"
																control={control}
															/>
															{errors.c_name_ar && errors.c_name_ar.type === "required" && (
																<span className="errors">اسم المنشأة مطلوب.</span>
															)}
														</div>

														<div className="col-12 mb-2 mt-4 bold_700">اسم المفوض بالتوقيع *</div>
														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<InputText
																		value={value}
																		onChange={onChange}
																		style={{ border: errors.c_owner_ar ? "1px solid red" : "" }}
																		placeholder="اسم المفوض بالتوقيع"
																	/>
																)}
																//className="form-control"
																rules={{
																	required: true,
																}}
																name="c_owner_ar"
																control={control}
															/>
															{errors.c_owner_ar && errors.c_owner_ar.type === "required" && (
																<span className="errors">مالك المنشأة مطلوب.</span>
															)}
														</div>

														<div className="col-12 mb-2 mt-4 bold_700">المقر الرئيسي للشركة *</div>
														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<InputText
																		value={value}
																		onChange={onChange}
																		style={{ border: errors.c_headquarters_ar ? "1px solid red" : "" }}
																		placeholder="المقر الرئيسي للشركة"
																	/>
																)}
																rules={{ required: true }}
																name="c_headquarters_ar"
																control={control}
															/>
															{errors.c_headquarters_ar && errors.c_headquarters_ar.type === "required" && (
																<span className="errors">اسم المستخدم مطلوب.</span>
															)}
														</div>

														<div className="col-12 mb-2 mt-4 bold_700">المسمى الوظيفي *</div>
														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<InputText
																		value={value}
																		onChange={onChange}
																		style={{ border: errors.c_jobtitle_ar ? "1px solid red" : "" }}
																		placeholder="المسمى الوظيفي"
																	/>
																)}
																rules={{ required: true }}
																name="c_jobtitle_ar"
																control={control}
															/>
															{errors.c_jobtitle_ar && errors.c_jobtitle_ar.type === "required" && (
																<span className="errors">المسمى الوظيفي مطلوب.</span>
															)}
														</div>

														<div className="col-12 mb-2 mt-4 bold_700">عنوان المنشأة *</div>
														<div className="col-12">
															<Controller
																render={({ field: { onChange, value } }) => (
																	<Selector
																		value={value}
																		onChange={onChange}
																		options={company_address_ar}
																		placeholder="دولة"
																		className={`col-12 mb-2 p-0  w_shadow ${
																			errors.c_country_ar && "border_form_selector"
																		}`}
																		style={{ boxShadow: "0px 1px 3px -2px #888888" }}
																	/>
																)}
																rules={{ required: true }}
																name="c_country_ar"
																control={control}
															/>
															{errors.c_country_ar && <span className="errors_c d-block">الدولة مطلوبة.</span>}

															<Controller
																render={({ field: { onChange, value } }) => (
																	<InputText
																		value={value}
																		placeholder="العنوان الأول"
																		className="col-12 mb-2 "
																		onChange={onChange}
																		style={{
																			border: errors.c_address1_ar ? "1px solid red" : "",
																		}}
																	/>
																)}
																rules={{ required: true }}
																name="c_address1_ar"
																control={control}
															/>
															{errors.c_address1_ar && errors.c_address1_ar.type === "required" && (
																<span className="errors_c d-block">عنوان المنشأة مطلوب.</span>
															)}

															<InputText
																type="text"
																name="address2_ar"
																value={info.address2_ar}
																onChange={(e) => handleChange(e.target.name, e.target.value)}
																placeholder="العنوان الثاني"
																className="col-12 mb-2"
															/>
														</div>

														{/* <div className="col-12 mb-2 mt-4 bold_700">البريد الإلكتروني *</div>
                            <div className="col-12">
                              <Controller
                                render={({ field: { onChange, value } }) => (
                                  <InputText
                                    value={value}
                                    onChange={onChange}
                                    style={{ border: errors.c_email_ar ? "1px solid red" : "" }}
                                    placeholder="name@email.com"
                                  />
                                )}
                                //className="form-control"
                                rules={{
                                  required: true,
                                  pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                }}
                                name="c_email_ar"
                                control={control}
                              />
                              {errors.c_email_ar && errors.c_email_ar.type === "required" && (
                                <span className="errors">البريد الالكتروني مطلوب.</span>
                              )}
                              {errors.c_email_ar && errors.c_email_ar.type === "pattern" && (
                                <span className="errors">البريد الإلكتروني غير صالح.</span>
                              )}
                            </div> */}
													</div>
												</>
											)}
											{openfile && (
												<div className="mt-4 col-12" style={{ fontFamily: "cnam-ar" }}>
													<div {...getRootProps({ className: "dropzone", id: sendFiles.fileName && "green" })}>
														<input {...getInputProps()} accept="application/pdf" />

														<div className="p-4 text-center">
															{sendFiles.fileName.length === 0 ? (
																<>
																	<span className="ml-2 mt-1" style={{ fontWeight: "bold", color: "black" }}>
																		قم بتحميل النسخة الموقعة من   
																		<Link style={{ color: "rgb(198 2 36)" }}> وثيقة NDA</Link>
																	</span>
																	<img src={upload} alt="" style={{ width: "24px" }} />
																</>
															) : (
																<div>
																	<Clear className="mr-2 pointer" onClick={removeFile} />
																	<span
																		style={{ color: "rgb(198 2 36)" }}
																		onClick={() => downloadFile(sendFiles.fileSend, sendFiles.fileName)}
																	>
																		{sendFiles.fileName.path}
																	</span>
																</div>
															)}
															{miniSpinner && <div className="spinner-border spinner-border-sm text-muted ml-3"></div>}
														</div>
													</div>
													{fileError && <span className="errors">يرجى تحميل ملف NDA.</span>}
												</div>
											)}

											<div className="col-12 mt-4 mb-4" style={{ fontFamily: "cnam-ar" }}>
												{!openfile ? (
													<Button
														disabled={miniSpinner}
														style={{
															backgroundColor: "rgb(198 2 36)",
															border: "none",
															padding: "0.7rem 2rem",
															fontWeight: "600",
														}}
														className=" float-right"
														type="submit"
														onClick={scroll}
													>
														أكمل
													</Button>
												) : (
													<div className="d-md-flex">
														<Button
															onClick={() => {
																setOpenfile(false);
																reset();
																setInfo({ address2: "" });
															}}
															className="col-12 col-md-4"
															style={{
																backgroundColor: "transparent",
																fontSize: "0.9rem",
																padding: "0.65rem",
																borderColor: "rgb(198 2 36)",
																fontWeight: "600",
																color: "rgb(198 2 36)",
															}}
														>
															إنشاء جديد
														</Button>
														<Button
															disabled={miniSpinner}
															style={{
																backgroundColor: "rgb(198 2 36)",
																border: "none",
																padding: "0.65rem",
																fontWeight: "600",
																fontSize: "0.9rem",
															}}
															className="col-12 col-md-4 button-margin mt-mt-0 mr-0 mr-md-3"
															onClick={check_file}
														>
															أكمل
														</Button>
													</div>
												)}
											</div>
										</form>
									</div>
								}
								right={
									<>
										<div className="col-12 h5" style={{ fontFamily: "cnam-bold-ar" }}>
											{" "}
											سجل في جامعة الملك عبدالله للعلوم والتقنية
										</div>
										<div className="col-12" style={{ fontFamily: "cnam-ar" }}>
											نعتقد أن الصناعات الأكثر ابتكارًا ستقود مستقبل أي صناعة صناعة. لذلك ، نحن هنا لدعمك في البحث والتطوير و
											إلى المستوى التالي.
										</div>
									</>
								}
							/>
						)}
					</>
				)}
			</Loader>
		</>
	);
}
/* const check_nda = () => {
  const cancelToken = axios.CancelToken;
  const source = cancelToken.source()

  const postedData = {
      userid: getSessionInfo('id'),
      token: getSessionInfo('token')
  }

  setLoaderState(true)
  axios({
      method: "post",
      url: `${WS_LINK}check_self_signed_nda`,
      data: postedData,
      cancelToken: source.token,
  })
      .then(res => {


          if (res.data && res.data.length !== 0) {
              props.history.push('/post_challenge')
          }

          setLoaderState(false)

      }
      )
      .catch(err => {
          setLoaderState(false)
          if (axios.isCancel(err)) {
              console.log('request canceled')
          }
          else {
              console.log("request failed")
          }

      });

} */

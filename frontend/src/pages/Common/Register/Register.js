import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet";

import { toast } from "react-toastify";
import Loader from "react-loader-advanced";
import { Button } from "reactstrap";

import InputNumeric from "../../../components/InputNumeric/InputNumeric";
import InputText from "../../../components/InputText/InputText";
import Selector from "../../../components/Selector/Selector";
import Simple from "../../../containers/Simple";
import CheckMail from "../../../components/PageModals/CheckMail";
import Spinner from "../../../components/spinner/Spinner";

import { WS_LINK } from "../../../globals";
import { setSessionInfo, getSessionInfo } from "../../../variable";

import "../../../App.css";
import "./Register.css";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import Checkbox from "@material-ui/core/Checkbox";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

export default function Register(props) {
	if (getSessionInfo("loggedIn")) {
		props.history.replace("/dashboard");
	}

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
			mobileCode: [],
			mobileNumber: "",
			officeCode: [],
			officeNumber: "",
			jobRole: "",
			newsletter: 0,
			otherJobRole: ''
		},
	});

	//* ///////////////////  // STATES

	const [passwordVisiblity, setPassWordVisibility] = useState({
		password: "password",
		confirmPassword: "password",
	});

	const [exist, setExist] = useState({
		email: "",
		username: "",
		phone: "",
	});

	const [mailModal, setMailModal] = useState(false);

	const [loaderState, setLoaderState] = useState(false);

	const [otherFieldOpen, setOtherFieldOpen] = useState(false)


	//* /////////////////////////////////// SET STATE

	const closeModal = () => {
		setMailModal(!mailModal);
	};

	const handlePasswordVisibility = (name) => {
		if (passwordVisiblity[name] === "password") setPassWordVisibility({ ...passwordVisiblity, [name]: "text" });
		else if (passwordVisiblity[name] === "text") setPassWordVisibility({ ...passwordVisiblity, [name]: "password" });
	};

	//* //////////////////// FUNCTIONS

	const scroll = () => {
		document.getElementById("name").scrollIntoView({ behavior: "smooth" });
	};

	const onSubmit = (data) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();
		const postedData = {
			name: data.name,
			username: data.username,
			email: data.email,
			pass: data.password,
			country_code_1: data.mobileCode.value,
			phone: data.mobileNumber,
			country_code_2: watch("officeCode") !== null && watch("officeCode").length !== 0 ? data.officeCode.value : "",
			office_number: data.officeNumber,
			job: otherFieldOpen ? data.otherJobRole : data.jobRole !== null ? data.jobRole.value : "",
			gender: data.radio_gender,
			newsletter: data.newsletter,
		};


		setLoaderState(true);
		axios({
			method: "post",
			url: `${WS_LINK}register_user`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				setLoaderState(false);
				if (res.data.length === 0) {
					//if register fails
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
					if (res.data[0] === 1 || res.data[1] === 1 || res.data[2] === 1) {
						// if user already exists
						setExist({
							email: res.data[0],
							username: res.data[1],
							phone: res.data[2],
						});
					} else {
						// if register successful

						setSessionInfo({ name: "industryTempId", val: res.data[0] });
						setSessionInfo({ name: "industryTempName", val: res.data[1] });
						// setPath("/");
						setMailModal(true);
					}
				}
			})
			.catch((err) => {
				setLoaderState(false);

				toast.error(`${err.message}`, {
					position: "top-right",
					autoClose: 2000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: false,
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

	const checkRoleValue = () => {
		if (watch('jobRole') !== null && watch('jobRole').value === 'Other' && !otherFieldOpen) {
			setOtherFieldOpen(true)
		}
		else {
			if (otherFieldOpen)
				setOtherFieldOpen(false)
		}
	}

	const checkExist = (val) => {
		if (exist[val] === 1) {
			exist[val] = "";
			setExist({ ...exist });
		}
	};


	return (
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
					'سجل الصناعة (1) | عن برنامج الشراكة المعرفية'
					:
					'Industry Register (1) | cnam KPP'
				}
				</title>
			</Helmet>
			<Simple
				props={props}
				noBack={true}
				logo={true}
				left={
					<>
						<CheckMail props={props} state={mailModal} toggleState={closeModal} path='/' />
						{getSessionInfo("language") === "english" ? (
							<>
								<div className="col-12 noP" style={{ fontFamily: "cnam-bold", fontSize: "1.8rem" }} id="name">
									Welcome to CNAM Portal
								</div>
								<div className="col-12 h5 mb-4 mt-2 noP" style={{ fontSize: "1.3rem", fontWeight: "600" }}>
									Create your account as Company
								</div>
								<form onSubmit={handleSubmit(onSubmit)}>
									<div className="col-12 mb-2 noP" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
										Name*
									</div>

									<div className="col-12 noP">
										<Controller
											render={({ field: { onChange, value } }) => (
												<InputText
													placeholder="Full Name"
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
										{errors.name && errors.name.type === "required" && <span className="errors">Name is required.</span>}
										{errors.name && errors.name.type === "minLength" && (
											<span className="errors">Name should be more than 4 characters.</span>
										)}
									</div>

									<div className="col-12 mt-4 noP" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
										Gender*
									</div>

									<div className="col-lg-3 noP pr-0 ml-2 ml-md-0" style={{ position: "relative", top: "-5px" }}>
										<Controller
											render={({ field: { onChange, value } }) => (
												<RadioGroup value={value} onChange={onChange} className="">
													<div className="d-flex">
														<FormControlLabel
															value="male"
															control={
																<Radio
																	icon={<RadioButtonUncheckedIcon />}
																	checkedIcon={<CheckCircleIcon />}
																	size="small"
																	style={{
																		fontFamily: "cnam",
																		zoom: 0.9,
																		color: "rgb(198 2 36)",
																	}}
																/>
															}
															label="Male"
														/>
														<FormControlLabel
															value="female"
															control={
																<Radio
																	icon={<RadioButtonUncheckedIcon />}
																	checkedIcon={<CheckCircleIcon />}
																	size="small"
																	style={{
																		fontFamily: "cnam",
																		zoom: 0.9,
																		color: "rgb(198 2 36)",
																	}}
																/>
															}
															label="Female"
															className="ml-2"
														/>
													</div>
												</RadioGroup>
											)}
											rules={{ required: true }}
											name="radio_gender"
											control={control}
										/>
										{errors.radio_gender && <span className="errors">Required.</span>}
									</div>

									<div className="col-12 mb-2 mt-3  noP" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
										Email*
									</div>
									<div className="col-12 noP">
										<Controller
											render={({ field: { onChange, value } }) => (
												<InputText
													value={value || ""}
													onChange={(e) => {
														onChange(e);
														checkExist("email");
														// setExist({ ...exist, email: "" });
													}}
													style={{
														border: errors.email || exist.email === 1 ? "1px solid red" : "",
													}}
													placeholder="name@email.com"
												/>
											)}
											//className="form-control"
											rules={{
												required: true,
												pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
											}}
											name="email"
											control={control}
										/>
										{errors.email && errors.email.type === "required" && <span className="errors">Email is required.</span>}
										{errors.email && errors.email.type === "pattern" && <span className="errors">Email is not valid.</span>}
										{exist.email === 1 && <span className="errors">Email is already taken.</span>}
									</div>

									<div className="col-12 mb-2 mt-4  noP" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
										Username *
									</div>
									<div className="col-12 noP">
										<Controller
											render={({ field: { onChange, value } }) => (
												<InputText
													value={value || ""}
													onChange={(e) => {
														onChange(e);
														checkExist("username");
														// setExist({ ...exist, username: "" });
													}}
													style={{
														border: errors.username || exist.username === 1 ? "1px solid red" : "",
													}}
													placeholder="Username"
												/>
											)}
											rules={{ required: true, minLength: 6, pattern: /^\S*$/ }}
											name="username"
											control={control}
										/>
										{errors.username && errors.username.type === "required" && (
											<span className="errors">Username is required.</span>
										)}
										{errors.username && errors.username.type === "minLength" && (
											<span className="errors">Username should be more than 6 characters.</span>
										)}
										{errors.username && errors.username.type === "pattern" && (
											<span className="errors">Username should not have space in between.</span>
										)}
										{exist.username === 1 && <span className="errors">Username is already taken</span>}
									</div>

									<div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
										Password *
									</div>
									<div className="col-12 noP">
										<div className="">
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														value={value}
														type={passwordVisiblity.password}
														onChange={onChange}
														style={{
															border: errors.password ? "1px solid red" : "",
														}}
														placeholder="***********"
														className="col-12"
													/>
												)}
												rules={{
													required: true,
													pattern:
														/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
												}}
												name="password"
												control={control}
											/>
											<div
												style={{
													fontSize: "18px",
													position: "absolute",
													right: "15px",
													top: "0px",
												}}
												className="col-1 pt-2 pointer show-password-icon"
												onClick={() => handlePasswordVisibility("password")}
											>
												{passwordVisiblity.password === "password" ? (
													<VisibilityIcon />
												) : (
													passwordVisiblity.password === "text" && <VisibilityOffIcon />
												)}
											</div>
										</div>

										{errors.password && errors.password.type === "required" && (
											<span className="errors">Password is required.</span>
										)}
										{errors.password && errors.password.type === "pattern" && (
											<span className="errors">minimum 8 characters (UpperCase, LowerCase, Number and special character)</span>
										)}
										{errors.confirmPassword === undefined && (
											<>
												<span className=" mb-2">Password must be 8 characters at minimum.</span> <br />
												<p className=" text-justify">
													Password must contain at least an UpperCase, a LowerCase, a number and a special character.
												</p>
											</>
										)}
									</div>

									<div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
										Confirm password *
									</div>
									<div className="col-12 noP">
										<div className="">
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														value={value}
														type={passwordVisiblity.confirmPassword}
														onChange={onChange}
														style={{
															border: errors.confirmPassword ? "1px solid red" : "",
														}}
														placeholder="***********"
														className="col-12"
													/>
												)}
												rules={{
													required: true,
													validate: (value) => value === watch("password"),
													pattern:
														/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
												}}
												name="confirmPassword"
												control={control}
											/>
											<div
												style={{
													fontSize: "18px",
													position: "absolute",
													right: "15px",
													top: "0px",
												}}
												className="col-1 pt-2 pointer show-password-icon"
												onClick={() => handlePasswordVisibility("confirmPassword")}
											>
												{passwordVisiblity.confirmPassword === "password" ? (
													<VisibilityIcon />
												) : (
													passwordVisiblity.confirmPassword === "text" && <VisibilityOffIcon />
												)}
											</div>
										</div>
										{errors.confirmPassword && errors.confirmPassword.type === "required" && (
											<span className="errors">Confirm Password is required.</span>
										)}
										{errors.confirmPassword &&
											(errors.confirmPassword.type === "validate" || errors.confirmPassword.type === "pattern") && (
												<span className="errors">Passwords do not match!</span>
											)}
									</div>

									<div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
										Mobile Number *
									</div>
									<div className="d-md-flex">
										<div className="col-lg-3 col-sm-3 mt-1 noP pr-0">
											<Controller
												render={({ field: { onChange, value } }) => (
													<Selector
														value={value}
														className={errors.mobileCode && "border_form_selector"}
														onChange={onChange}
														options={[{ value: "+961", label: "+961" }]}
														placeholder="+961"
													/>
												)}
												// <Selector
												rules={{ required: true }}
												name="mobileCode"
												control={control}
											/>
											{errors.mobileCode && <span className="errors">Mobile code is required.</span>}
										</div>
										<div className="col-lg-9 col-sm-9 mt-1 noP">
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputNumeric
														value={value}
														onChange={(e) => {
															onChange(e);
															checkExist("phone");
															// setExist({ ...exist, phone: "" });
														}}
														placeholder="50 xxx xxxx"
														format="## ### ####"
														style={{
															border: errors.mobileNumber || exist.phone === 1 ? "1px solid red" : "",
														}}
													/>
												)}
												rules={{
													required: true,
													// eslint-disable-next-line no-useless-escape
													pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
												}}
												name="mobileNumber"
												control={control}
											/>
											{errors.mobileNumber && errors.mobileNumber.type === "required" && (
												<span className="errors">Mobile number is required.</span>
											)}
											{errors.mobileNumber && errors.mobileNumber.type === "pattern" && (
												<span className="errors">Mobile number is invalid.</span>
											)}
											{exist.phone === 1 && <span className="errors">Mobile number is already taken.</span>}
										</div>
									</div>

									<div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
										Office Phone Number
									</div>
									<div className="d-md-flex">
										<div className="col-lg-3 col-sm-3 mt-1 noP pr-0">
											<Controller
												render={({ field: { onChange, value } }) => (
													<Selector
														isClearable
														value={value}
														className={errors.officeCode && "border_form_selector"}
														onChange={onChange}
														options={[{ value: "+961", label: "+961" }]}
														placeholder="+961"
													/>
												)}
												// <Selector
												rules={watch("officeNumber") !== "" ? { required: true } : { required: false }}
												name="officeCode"
												control={control}
											/>
											{errors.officeCode && <span className="errors">Office code is required.</span>}
										</div>
										<div className="col-lg-9 col-sm-9 mt-1 noP">
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputNumeric
														value={value}
														onChange={onChange}
														placeholder="50 xxx xxxx"
														format="## ### ####"
														style={{
															border: errors.officeNumber ? "1px solid red" : "",
														}}
													/>
												)}
												rules={
													// eslint-disable-next-line no-useless-escape
													watch("officeCode") !== null && watch("officeCode").length !== 0
														? {
															required: true,
															// eslint-disable-next-line no-useless-escape
															pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
														}
														: {
															required: false,
															// eslint-disable-next-line no-useless-escape
															pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
														}
													// eslint-disable-next-line no-useless-escape
												}
												name="officeNumber"
												control={control}
											/>
											{errors.officeNumber && errors.officeNumber.type === "pattern" && (
												<span className="errors">Office number is invalid.</span>
											)}
											{errors.officeNumber && errors.officeNumber.type === "required" && (
												<span className="errors">Office number is required.</span>
											)}
										</div>
									</div>

									<div className="col-12 mb-2 mt-3  noP" style={{ fontFamily: "cnam-bold", fontSize: "0.92rem" }}>
										Your Job Role/Position
									</div>
									<div className="col-12 noP">
										<Controller
											render={({ field: { onChange, value } }) => (
												<Selector
													name="jobRole"
													value={value}
													className="w_shadow"
													onChange={e => { onChange(e); checkRoleValue() }}
													options={[
														{ value: "Team Leader", label: "Team Leader" },
														{ value: "Manager", label: "Manager" },
														{ value: "Head Assistant Manager", label: "Head Assistant Manager" },
														{ value: "Executive Director", label: "Executive Director" },
														{ value: "Coordinator", label: "Coordinator" },
														{ value: "Administrator", label: "Administrator" },
														{ value: "Researcher ", label: "Researcher " },
														{ value: "Technical ", label: "Technical " },
														{ value: "Other", label: "Other" },
													]}
													placeholder="Select job role of position"
													isClearable
													style={{ boxShadow: "0px 1px 3px -2px #888888" }}
												/>
											)}
											name="jobRole"
											control={control}
										/>
										{
											otherFieldOpen &&
											<>
												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															value={value}
															onChange={onChange}
															placeholder="please enter a short answer"
															style={{
																border: errors.otherJobRole ? "1px solid red" : "",
															}}
															className="mt-2"
														/>
													)}
													rules={{ required: true }}
													name="otherJobRole"
													control={control}
												/>
												{errors.otherJobRole && (
													<span className="errors">Short answer is required.</span>
												)}
											</>
										}


										<div className="d-flex mt-4 col-lg-12 p-0" style={{ fontFamily: "cnam", fontSize: "14px" }}>
											{/* <div><input type="checkbox" value={registerObj.newsletter} checked={registerObj.newsletter} onChange={handleCheckbox} /></div> */}
											<div>
												<Controller
													render={({ field: { onChange, value } }) => (
														<Checkbox value={value} checked={value} onChange={onChange} className="p-0" />
													)}
													name="newsletter"
													control={control}
												/>
											</div>
											<div className="" style={{ marginLeft: "7px", marginTop: "2px", fontWeight: "500" }}>
												Would you like to receive the newsletter with the latest CNAM Portal News ?
											</div>
										</div>
									</div>
									<div className="d-sm-flex col-lg-12 p-0">
										<div className="col-lg-8 mt-4 noP" style={{ color: "#848484", fontSize: "13px" }}>
									
										</div>
										<div className="mt-4 col-lg-4 noP ">
											<Button
												onClick={scroll}
												type="submit"
												className="ml-sm-auto d-flex"
												style={{
													backgroundColor: "rgb(198 2 36)",
													border: "none",
													fontSize: "0.9rem",
													padding: "0.7rem 2.4rem",
													fontFamily: "cnam-bold",
												}}
											>
												Get Started
											</Button>
										</div>
									</div>
								</form>
							</>
						) : (
							// * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
							// * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
							// * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
							// * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
							// -------ARABIC--------
							<>
								<>
									<div
										className="col-12 noP"
										style={{ fontSize: "1.8rem", textAlign: "right", fontFamily: "cnam-bold-ar" }}
										id="name"
									>
										مرحبًا بكم في برنامج الشراكة المعرفية
									</div>
									<div className="col-12 h5 mb-4 mt-2 noP" style={{ textAlign: "right", fontFamily: "cnam-ar" }}>
										أنشئ حسابك
									</div>
									<form onSubmit={handleSubmit(onSubmit)} style={{ fontFamily: "cnam-ar" }}>
										<div className="col-12 mb-2 noP" style={{ fontFamily: "cnam-bold-ar", textAlign: "right" }}>
											الاسم*
										</div>

										<div className="col-12 noP">
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														placeholder="الاسم بالكامل"
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
											{errors.name && errors.name.type === "required" && <span className="errors">الاسم مطلوب.</span>}
											{errors.name && errors.name.type === "minLength" && (
												<span className="errors">يجب أن يكون الاسم أكثر من 4 أحرف.</span>
											)}
										</div>

										<div className="col-12 mt-4 pr-0 pr-lg-1" style={{ fontFamily: "cnam-bold-ar", textAlign: "right" }}>
											الجنس*
										</div>

										<div className="col-lg-3 noP pr-0 mr-0" style={{ position: "relative", top: "-5px" }}>
											<Controller
												render={({ field: { onChange, value } }) => (
													<RadioGroup value={value} onChange={onChange} className="">
														<div className="d-flex">
															<FormControlLabel
																value="male"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{
																			fontFamily: "cnam",
																			color: "rgb(198 2 36)",
																			zoom: 0.9,
																		}}
																	/>
																}
																label={<span style={{ fontFamily: 'cnam-ar' }}>ذكر</span>}
															/>
															<FormControlLabel
																value="female"
																control={
																	<Radio
																		icon={<RadioButtonUncheckedIcon />}
																		checkedIcon={<CheckCircleIcon />}
																		size="small"
																		style={{
																			fontFamily: "cnam",
																			color: "rgb(198 2 36)",
																		}}
																	/>
																}
																label={<span style={{ fontFamily: 'cnam-ar' }}>أنثى</span>}
																className="ml-2"
															/>
														</div>
													</RadioGroup>
												)}
												rules={{ required: true }}
												name="radio_gender"
												control={control}
											/>
											{errors.radio_gender && <span className="errors pr-3">مطلوب.</span>}
										</div>

										<div className="col-12 mb-2 mt-3  noP" style={{ fontFamily: "cnam-bold-ar", textAlign: "right" }}>
											البريد الإلكتروني*
										</div>
										<div className="col-12 noP" style={{ fontFamily: "cnam" }}>
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														value={value || ""}
														onChange={(e) => {
															onChange(e);
															checkExist("email");
															// setExist({ ...exist, email: "" });
														}}
														style={{
															border: errors.email || exist.email === 1 ? "1px solid red" : "",
														}}
														placeholder="البريد الإلكتروني"
													/>
												)}
												//className="form-control"
												rules={{
													required: true,
													pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
												}}
												name="email"
												control={control}
											/>
											{errors.email && errors.email.type === "required" && (
												<span className="errors" style={{ fontFamily: "cnam-ar" }}>
													البريد الالكتروني مطلوب.
												</span>
											)}
											{errors.email && errors.email.type === "pattern" && (
												<span className="errors" style={{ fontFamily: "cnam-ar" }}>
													البريد الإلكتروني غير صالح.
												</span>
											)}
											{exist.email === 1 && (
												<span className="errors" style={{ fontFamily: "cnam-ar" }}>
													البريدالإلكتروني مسجل بالفعل
												</span>
											)}
										</div>

										<div className="col-12 mb-2 mt-4  noP" style={{ fontFamily: "cnam-bold-ar", textAlign: "right" }}>
											اسم المستخدم *
										</div>
										<div className="col-12 noP">
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														value={value || ""}
														onChange={(e) => {
															onChange(e);
															checkExist("username");
															// setExist({ ...exist, username: "" });
														}}
														style={{
															border: errors.username || exist.username === 1 ? "1px solid red" : "",
														}}
														placeholder="اسم المستخدم"
													/>
												)}
												rules={{ required: true, minLength: 6, pattern: /^\S*$/ }}
												name="username"
												control={control}
											/>
											{errors.username && errors.username.type === "required" && (
												<span className="errors">اسم المستخدم مطلوب.</span>
											)}
											{errors.username && errors.username.type === "minLength" && (
												<span className="errors">يجب أن يكون اسم المستخدم أكثر من 6 أحرف.</span>
											)}
											{errors.username && errors.username.type === "pattern" && (
												<span className="errors">اسم المستخدم يجب ألا يكون هناك مسافة بينهما.</span>
											)}
											{exist.username === 1 && <span className="errors">اسم المستخدم مسجل بالفعل</span>}
										</div>

										<div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold-ar", textAlign: "right" }}>
											كلمه السر *
										</div>
										<div className="col-12 noP">
											<div className="">
												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															value={value}
															type={passwordVisiblity.password}
															onChange={onChange}
															style={{
																border: errors.password ? "1px solid red" : "",
															}}
															placeholder="***********"
															className="col-12"
														/>
													)}
													rules={{
														required: true,
														pattern:
															/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
													}}
													name="password"
													control={control}
												/>
												<div
													style={{
														fontSize: "18px",
														position: "absolute",
														left: "15px",
														top: "0px",
													}}
													className="col-1 pt-2 pointer show-password-icon-ar"
													onClick={() => handlePasswordVisibility("password")}
												>
													{passwordVisiblity.password === "password" ? (
														<VisibilityIcon />
													) : (
														passwordVisiblity.password === "text" && <VisibilityOffIcon />
													)}
												</div>
											</div>

											{errors.password && errors.password.type === "required" && (
												<span className="errors">كلمة المرور مطلوبة.</span>
											)}
											{errors.password && errors.password.type === "pattern" && (
												<span className="errors">8 أحرف على الأقل (الأحرف العلوية والحالة السفلية والرقم و حرف خاص)</span>
											)}
											{errors.confirmPassword === undefined && (
												<div className="text-right mt-2 " style={{ fontSize: "1rem" }}>
													<span className="pl-1 mb-2 text-right">يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.</span> <br />
													<p className="pl-1 text-right">
													يجب أن تحتوي كلمة المرورعلى مزيج من الأحرف الصغيرة والكبيرة والارقام والرموز.
													</p>
												</div>
											)}
										</div>

										<div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold-ar", textAlign: "right" }}>
											تأكيد كلمة المرور *
										</div>
										<div className="col-12 noP">
											<div className="">
												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															value={value}
															type={passwordVisiblity.confirmPassword}
															onChange={onChange}
															style={{
																border: errors.confirmPassword ? "1px solid red" : "",
															}}
															placeholder="***********"
															className="col-12"
														/>
													)}
													rules={{
														required: true,
														validate: (value) => value === watch("password"),
														pattern:
															/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
													}}
													name="confirmPassword"
													control={control}
												/>

												
												<div
													style={{
														fontSize: "18px",
														position: "absolute",
														left: "15px",
														top: "0px",
													}}
													className="col-1 pt-2 pointer show-password-icon-ar"
													onClick={() => handlePasswordVisibility("confirmPassword")}
												>
													{passwordVisiblity.confirmPassword === "password" ? (
														<VisibilityIcon />
													) : (
														passwordVisiblity.confirmPassword === "text" && <VisibilityOffIcon />
													)}
												</div>
											</div>
											{errors.confirmPassword && errors.confirmPassword.type === "required" && (
												<span className="errors">تأكيد كلمة المرور مطلوب.</span>
											)}
											{errors.confirmPassword &&
												(errors.confirmPassword.type === "validate" || errors.confirmPassword.type === "pattern") && (
													<span className="errors">كلمة المرور غير مطابقة!</span>
												)}
										</div>

										<div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold-ar", textAlign: "right" }}>
											رقم الهاتف المحمول *
										</div>
										<div className="d-md-flex">
											<div className="col-lg-3 col-sm-3 mt-1 noP pr-1">
												<Controller
													render={({ field: { onChange, value } }) => (
														<Selector
															value={value}
															className={errors.mobileCode && "border_form_selector"}
															onChange={onChange}
															options={[{ value: "+961", label: "+961" }]}
															placeholder="+961"
														/>
													)}
													// <Selector
													rules={{ required: true }}
													name="mobileCode"
													control={control}
												/>
												{errors.mobileCode && <span className="errors text-right">كود الهاتف المحمول مطلوب.</span>}
											</div>
											<div className="col-lg-9 col-sm-9 mt-1 noP">
												<Controller
													render={({ field: { onChange, value } }) => (
														<InputNumeric
															value={value}
															onChange={(e) => {
																onChange(e);
																checkExist("phone");
																// setExist({ ...exist, phone: "" });
															}}
															placeholder="۰۰ ۰۰۰ ۰۰۰"
															format="## ### ####"
															style={{
																border: errors.mobileNumber || exist.phone === 1 ? "1px solid red" : "",
																textAlign: 'right',
																direction: 'ltr'
															}}
														/>
													)}
													rules={{
														required: true,
														// eslint-disable-next-line no-useless-escape
														pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
													}}
													name="mobileNumber"
													control={control}
												/>
												{errors.mobileNumber && errors.mobileNumber.type === "required" && (
													<span className="errors">رقم الهاتف المحمول مطلوب.</span>
												)}
												{errors.mobileNumber && errors.mobileNumber.type === "pattern" && (
													<span className="errors">رقم الجوال غير صحيح.</span>
												)}
												{exist.phone === 1 && <span className="errors">رقم الهاتف المحمول مأخوذ بالفعل.</span>}
											</div>
										</div>

										<div className="col-12 mb-2 mt-4 noP" style={{ fontFamily: "cnam-bold-ar", textAlign: "right" }}>
											رقم هاتف المكتب
										</div>
										<div className="d-md-flex">
											<div className="col-lg-3 col-sm-3 mt-1 noP pr-1">
												<Controller
													render={({ field: { onChange, value } }) => (
														<Selector
															isClearable
															value={value}
															className={errors.officeCode && "border_form_selector"}
															onChange={onChange}
															options={[{ value: "+961", label: "+961" }]}
															placeholder="+961"
														/>
													)}
													// <Selector
													rules={watch("officeNumber") !== "" ? { required: true } : { required: false }}
													name="officeCode"
													control={control}
												/>
												{errors.officeCode && <span className="errors">كود المكتب مطلوب.</span>}
											</div>
											<div className="col-lg-9 col-sm-9 mt-1 noP">
												<Controller
													render={({ field: { onChange, value } }) => (
														<InputNumeric
															value={value}
															onChange={onChange}
															placeholder="۰۰ ۰۰۰ ۰۰۰"
															format="## ### ####"
															style={{
																border: errors.officeNumber ? "1px solid red" : "",
																textAlign: 'right',
																direction: 'ltr'
															}}
														/>
													)}
													rules={
														// eslint-disable-next-line no-useless-escape
														watch("officeCode") !== null && watch("officeCode").length !== 0
															? {
																required: true,
																// eslint-disable-next-line no-useless-escape
																pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
															}
															: {
																required: false,
																// eslint-disable-next-line no-useless-escape
																pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
															}
														// eslint-disable-next-line no-useless-escape
													}
													name="officeNumber"
													control={control}
												/>
												{errors.officeNumber && errors.officeNumber.type === "pattern" && (
													<span className="errors">رقم المكتب غير صالح.</span>
												)}
												{errors.officeNumber && errors.officeNumber.type === "required" && (
													<span className="errors">رقم المكتب مطلوب.</span>
												)}
											</div>
										</div>

										<div className="col-12 mb-2 mt-3  noP" style={{ fontFamily: "cnam-bold-ar", textAlign: "right" }}>
											المسمى الوظيفي الخاص بك
										</div>
										<div className="col-12 noP">
											<Controller
												render={({ field: { onChange, value } }) => (
													<Selector
														name="jobRole"
														value={value}
														className="w_shadow text-right"
														onChange={e => { onChange(e); checkRoleValue() }}
														options={[
															{ value: "Team Leader", label: "قائد الفريق" },
															{ value: "Manager", label: "مدير" },
															{ value: "Head Assistant Manager", label: "رئيس مساعد مدير" },
															{ value: "Executive Director", label: "مدير تنفيذي" },
															{ value: "Coordinator", label: "منسق" },
															{ value: "Administrator", label: "مدير" },
															{ value: "Researcher ", label: "الباحث " },
															{ value: "Technical ", label: "اصطلاحي " },
															{ value: "Other", label: "آخر" },
														]}
														placeholder="حدد المسمى الوظيفي للمنصب"
														isClearable
														style={{ boxShadow: "0px 1px 3px -2px #888888" }}
													/>
												)}
												name="jobRole"
												control={control}
											/>

											{
												otherFieldOpen &&
												<>
													<Controller
														render={({ field: { onChange, value } }) => (
															<InputText
																value={value}
																onChange={onChange}
																placeholder="الرجاء إدخال إجابة قصيرة"
																style={{
																	border: errors.otherJobRole ? "1px solid red" : "",
																	direction: 'rtl'
																}}
																className="mt-2"
															/>
														)}
														rules={{ required: true }}
														name="otherJobRole"
														control={control}
													/>
													{errors.otherJobRole && (
														<span className="errors text-right" style={{ fontFamily: 'cnam-ar' }}>مطلوب إجابة قصيرة.</span>
													)}
												</>
											}

											<div className="d-flex mt-4 col-lg-12 p-0" style={{ fontFamily: "cnam", fontSize: "14px" }}>
												{/* <div><input type="checkbox" value={registerObj.newsletter} checked={registerObj.newsletter} onChange={handleCheckbox} /></div> */}
												<div>
													<Controller
														render={({ field: { onChange, value } }) => (
															<Checkbox
																value={value}
																checked={value}
																onChange={onChange}
																className="p-0"
															/>
														)}
														name='newsletter'
														control={control}
													/>
												</div>
												<div
													className="mr-2"
													style={{
														marginTop: "2px",
														fontWeight: "500",
														textAlign: "right",
														fontSize: "1rem",
														fontFamily: "cnam-ar",
													}}
												>
													هل ترغب في تلقّي إشعارات بأحدث التطورات ؟
												</div>
											</div>
										</div>
										<div
											className="d-sm-flex col-lg-12 p-0 justify-content-between get-started-ar"
											style={{ textAlign: "right", paddingLeft: "15px" }}
										>
											<div
												className="col-lg-8 mt-4 noP"
												style={{ color: "#848484", fontSize: "13px", fontFamily: "cnam-light-ar" }}
											>
											
											</div>
											<div className="mt-4 col-lg-4 noP">
												<Button
													onClick={scroll}
													type="submit"
													className="mr-sm-auto d-flex"
													style={{
														backgroundColor: "rgb(198 2 36)",
														border: "none",
														fontSize: "1rem",
														padding: "0.7rem 2.4rem",
														fontFamily: "cnam-bold-ar",
													}}
												>
													البدء
												</Button>
											</div>
										</div>
									</form>
								</>
							</>
						)}
					</>
				}
				right={
					<>
						<div
							className="col-12  p-0 mt-2"
							style={{ fontFamily: getSessionInfo("language") === "english" ? "cnam-bold" : "cnam-bold-ar", fontSize: "18px" }}
						>
							{getSessionInfo("language") === "english" ? (
								"Sign Up To CNAM Portal Program"
							) : (
								<span>
									مرحبًا بكم في برنامج الشراكة المعرفية
								</span>
							)}
						</div>
					
					</>
				}
			/>


		</Loader>
	);
}

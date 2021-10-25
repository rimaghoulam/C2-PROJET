import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";

import { getSessionInfo, clearSessionInfo } from "../../variable";
import { socialMediaOptions, WS_LINK } from "../../globals";
import { downloadFile } from "../../functions";

import InputText from "../../components/InputText/InputText";
import SuccessModal from "../../components/PageModals/CheckMail";
import Selector from "../../components/Selector/Selector";
import InputNumeric from '../../components/InputNumeric/InputNumeric'

import { Button } from "reactstrap";
import { toast } from "react-toastify";
import Select, { components } from "react-select";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Upload from "../../assets/images_svg/upload_icons.svg";

import DeleteIcon from "@material-ui/icons/Delete";
import Clear from "@material-ui/icons/Clear";

import "../../App.css";
import "../Common/Register/IndustryRegister/IndustryRegister.css";

export default function EditCompany(props) {
	let { user_id } = useParams();
	if (user_id !== undefined) user_id = decodeURIComponent(atob(user_id));

	const [pageLoaded, setPageLoaded] = useState(false);

	const [otherInputOpen, setOtherInputOpen] = useState({
		companyType: false,
		industryType: false,
		headquarter: false,
	});

	const [retrievedData, setRetrievedData] = useState({
		headquarter: [],
		industryType: [],
		companyType: [],
		numberEmployees: [],
		mainCustomers: [],
	});

	const [socialErrors, setSocialsErrors] = useState({
		media: [],
		link: [],
	});

	const [mailModal, setMailModal] = useState(false);

	const [miniSpinner, setMiniSpinner] = useState(false);

	const toggleModalState = () => {
		setMailModal((p) => !p);
	};

	const handleOtherOpen = (isOther, name) => {
		if (isOther && !otherInputOpen[name]) setOtherInputOpen({ ...otherInputOpen, [name]: true });
		else if (!isOther && otherInputOpen[name]) setOtherInputOpen({ ...otherInputOpen, [name]: false });
	};

	//  ! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	const handleAddSocial = () => {
		let bool = true;
		let a = socialErrors.link;
		let b = socialErrors.media;

		for (let i = 0; i < watch("socials").length; i++) {
			if (watch("socials")[i].media.length < 1) {
				b[i] = true;
				bool = false;
			}
			if (watch("socials")[i].link.length < 1) {
				a[i] = true;
				bool = false;
			}
		}

		if (bool) {
			let t = watch("socials");
			t.push({
				media: "",
				link: "",
			});
			setValue("socials", t);
			a.push(false);
			b.push(false);
		}
		setSocialsErrors({ media: b, link: a });
	};

	const handleDeleteSocial = (index) => {
		let t = watch("socials").filter((a, b) => b !== index && a);
		setValue("socials", t);

		let a = socialErrors.link.filter((i, ii) => ii !== index);
		let b = socialErrors.media.filter((i, ii) => ii !== index);
		a[index] = false;
		setSocialsErrors({ media: b, link: a });
	};

	const handleChangeSocialSelector = (value, index) => {
		let t = watch("socials");
		t[index].media = value.value;
		setValue("socials", t);
		if (socialErrors.media[index] === true) {
			let a = socialErrors.media;
			a[index] = false;
			setSocialsErrors({ ...socialErrors, media: a });
		}
	};

	const handleChangeSocialInput = (event, index) => {
		let t = watch("socials");
		t[index].link = event.target.value;
		setValue("socials", t);
		if (event.target.value > 0) {
			if (socialErrors.link[index] === true) {
				let a = socialErrors.link;
				a[index] = false;
				setSocialsErrors({ ...socialErrors, link: a });
			}
		}
	};

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: "",
			email: "",
			phoneCode: '',
			phoneNumber: "",
			country: "",
			headquarter: "",
			address1: "",
			address2: "",
			age: "",
			industryType: [],
			otherIndustryType: "",
			companyType: [],
			otherCompanyType: "",
			numberEmployees: "",
			product: "",
			customers: [],
			website: "",
			files: [],
			socials: [],
		},
	});

	const scroll = () => {
		document.getElementById("top").scrollIntoView({ behavior: "smooth" });
	};

	const handleOnFileChange = (e) => {
		if (e.target.files.length > 0) {
			let fd = new FormData();

			let images = e.target.files[0];
			fd.append("file", images);

			setMiniSpinner(true);

			axios({
				method: "post",
				url: `${WS_LINK}upload_image`,
				data: fd,
			})
				.then((res) => {
					if (res.data !== "error") {
						let f = watch("files");
						f.push({
							fileSend: res.data,
							fileName: e.target.files[0].name,
						});

						setValue("files", f);
						setMiniSpinner(false);
					}
				})
				.catch((err) => {
					setMiniSpinner(false);
					if (axios.isCancel(err)) {
						console.log("request canceled");
					} else {
						console.log("request failed");
					}
				});
		}
	};

	const handleRemoveFile = (file) => {
		setValue(
			"files",
			watch("files").filter((item) => item !== file)
		);
	};

	const checkBoxChecked = (id) => {
		// eslint-disable-next-line eqeqeq
		return watch("customers").filter((item) => item == id).length > 0;
	};

	const handleCheckBoxChange = (event) => {
		if (event.target.checked) {
			let c = watch("customers");
			c.push(parseInt(event.target.value));
			setValue("customers", c);
		} else {
			setValue(
				"customers",
				watch("customers").filter((x) => x !== parseInt(event.target.value))
			);
		}
	};

	useEffect(() => {

		props.setPageTitle('Edit Company', 'تحرير ملف المنشأة')

		let tmpIndustryTypes = [];
		let tmpCustomers = [];

		props.toggleSpinner(true);

		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		axios({
			method: "get",
			url: `${WS_LINK}fill_data`,
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data !== "token error") {
					// * fetching the static Data

					setRetrievedData({
						headquarter: res.data[4],
						industryType: res.data[1],
						companyType: res.data[3],
						numberEmployees: res.data[2],
						mainCustomers: res.data[0],
					});

					tmpIndustryTypes = res.data[1];
					tmpCustomers = res.data[0];

					// * fetching the StaticData

					const postedData = {
						userid: getSessionInfo("id"),
						token: getSessionInfo("token"),
					};

					const adminEditing = user_id !== undefined && getSessionInfo("id") !== user_id && getSessionInfo("role") === 4;

					if (adminEditing) postedData["user"] = user_id;

					axios({
						method: "post",
						url: adminEditing ? `${WS_LINK}get_admin_company_detail` : `${WS_LINK}get_company_detail`,
						data: postedData,
						cancelToken: source.token,
					})
						.then((res) => {
							if (res.data !== "role error" && res.data !== "token error") {
								if (res.data.length !== 0) {
									const DATA = res.data[0][0];

									const industryTypes = DATA.industry_details_industry_type.split(",").map((item, index) => {
										if (index !== DATA.industry_details_industry_type.split(",").length - 1) {
											// eslint-disable-next-line eqeqeq
											const t = tmpIndustryTypes.filter((elem) => elem.id_industry_type == item)[0];
											// console.log(t)
											return {
												label: getSessionInfo('language') === 'english' ? t.name_industry_type : t.name_industry_type_arabic,
												value: getSessionInfo('language') === 'english' ? t.name_industry_type : t.name_industry_type_arabic,
												id: t.id_industry_type,
											};
										} else {
											return "";
										}
									});
									industryTypes.pop();

									const customers = DATA.industry_details_company_main_customer.split(",").map((item, index) => {
										if (index !== DATA.industry_details_company_main_customer.split(",").length - 1) {
											// eslint-disable-next-line eqeqeq
											return tmpCustomers.filter((elem) => elem.id_main_customer == item)[0].id_main_customer;
										} else {
											return "";
										}
									});
									customers.pop();

									setValue("name", DATA.industry_details_company_name);
									setValue("email", DATA.industry_details_company_email);
									let phoneNbr = DATA.industry_detail_company_phone.split('-')
									setValue("phoneCode", { value: phoneNbr[0], label: phoneNbr[0] });
									setValue("phoneNumber", phoneNbr[1]);
									setValue("country", {
										value: DATA.industry_details_company_address_country,
										label: DATA.industry_details_company_address_country,
									});
									setValue("headquarter", {
										value: DATA.industry_details_headquarter,
										label: getSessionInfo("language") === "english" ? DATA.heaquarter_english : DATA.heaquarter_arabic,
									});
									setValue("address1", DATA.industry_details_company_address_line1);
									setValue("address2", DATA.industry_details_company_address_line2);
									setValue("age", DATA.industry_details_company_age);
									setValue("industryType", industryTypes);
									setValue("otherIndustryType", DATA.industry_details_industry_type_spec);
									setValue("companyType", {
										value: DATA.industry_details_company_type,
										label: getSessionInfo("language") === "english" ? DATA.type_english : DATA.type_arabic,
									});
									setValue("otherCompanyType", DATA.industry_details_company_type_spec);
									setValue("numberEmployees", {
										value: DATA.industry_details_company_number_employee,
										label: getSessionInfo("language") === "english" ? DATA.size_english : DATA.size_arabic,
									});
									setValue("product", DATA.industry_details_company_primary_product);
									setValue("customers", customers);
									setValue("website", DATA.industry_details_company_website);

									setValue(
										"files",
										res.data[2].map((item) => ({
											fileName: item.profile_name,
											fileSend: item.profile_path,
										}))
									);

									setValue(
										"socials",
										res.data[1].map((item) => ({
											media: item.industry_social_type,
											link: item.industry_social_link,
										}))
									);

									let a = [];
									for (let i = 0; i < res.data[1].length; i++) {
										a.push(false);
									}

									setSocialsErrors({ media: a, link: a });

									setOtherInputOpen({
										companyType:
											DATA.industry_details_company_type_spec !== null && DATA.industry_details_company_type_spec.length > 1,
										industryType:
											DATA.industry_details_industry_type_spec !== null && DATA.industry_details_industry_type_spec.length > 1,
									});
								} else {
									toast.error("something went wrong...", {
										position: "top-right",
										autoClose: 5000,
										hideProgressBar: true,
										closeOnClick: true,
										pauseOnHover: true,
										draggable: false,
										progress: undefined,
									});
								}
								setPageLoaded(true);
								props.toggleSpinner(false);
							} else {
								clearSessionInfo();
								window.location.reload(false).then(props.history.replace("/"));
							}
						})
						.catch((err) => {
							console.log(err);
							props.toggleSpinner(false);
						});
				} else {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				}
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
				props.toggleSpinner(false);
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const SaveChanges = (data) => {
		scroll();

		const itypes = [];
		for (let i = 0; i < data.industryType.length; i++) {
			itypes[i] = data.industryType[i].id;
		}

		////// social and link validation
		let temp_link = [];
		let temp_social = [];
		for (let i = 0; i < data.socials.length; i++) {
			if (data.socials[i].link.length !== 0 || data.socials[i].media.length !== 0) {
				temp_link[i] = data.socials[i].link;
				temp_social[i] = data.socials[i].media;
			}
		}
		temp_link = temp_link.filter(function (el) {
			return el != null;
		});
		temp_social = temp_social.filter(function (el) {
			return el != null;
		});

		let postedData = {
			token: getSessionInfo("token"),
			headquarter: data.headquarter.value,
			headquarter_spec: otherInputOpen.headquarter ? data.otherHeadquarter : '',
			cName: data.name,
			cEmail: data.email,
			company_phone: data.phoneCode.value + '-' + data.phoneNumber,
			cAddress: data.country.value,
			address1: data.address1,
			address2: data.address2,
			iType: itypes,
			iType_spec: otherInputOpen.industryType ? data.otherIndustryType : "",
			cType: data.companyType.value,
			cType_spec: otherInputOpen.companyType ? data.otherCompanyType : "",
			employees: data.numberEmployees.value,
			product: data.product,
			customer: data.customers,
			website: data.website,
			file: data.files.map((item) => item.fileSend),
			fileName: data.files.map((item) => item.fileName),
			social: temp_social,
			link: temp_link,
			age: data.age,
		};
		if (getSessionInfo("id") !== user_id && user_id !== undefined && getSessionInfo("role") === 4) {
			postedData = { ...postedData, adminid: getSessionInfo("id"), userid: user_id };
		} else {
			postedData = { ...postedData, userid: getSessionInfo("id") };
		}

		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();
		props.toggleSpinner(true);
		axios({
			method: "post",
			url:
				getSessionInfo("id") !== user_id && user_id !== undefined && getSessionInfo("role") === 4
					? `${WS_LINK}admin_update_company`
					: `${WS_LINK}update_company_detail`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				props.toggleSpinner(false);
				setMailModal(true);
			})
			.catch((err) => {
				props.toggleSpinner(false);
				toast.error("something went wrong...", {
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

	const Option = (props) => {
		return (
			<div>
				<components.Option {...props}>
					{console.log(props.isSelected)}
					<input type="checkbox" defaultChecked={props.isSelected} style={{ verticalAlign: "middle" }} />{" "}
					<label className="d-inline-block" style={{ width: "80%", verticalAlign: "text-top" }}>
						{props.value}{" "}
					</label>
				</components.Option>
			</div>
		);
	};
	const MultiValue = (props) => {
		return (
			<components.MultiValue {...props}>
				<span width="90%">{props.data.label}</span>
			</components.MultiValue>
		);
	};

	const company_address = [{ value: "Saudi Arabia", label: "Saudi Arabia" }];
	const company_address_ar = [{ value: "Saudi Arabia", label: " المملكة العربية السعودية" }];

	const company_head = retrievedData.headquarter.map((item) => ({
		value: item.option_id,
		label: getSessionInfo("language") === "arabic" ? item.option_value_a : item.option_value_e,
	}));

	const industry_options = retrievedData.industryType.map((elem) => ({
		label: elem.name_industry_type,
		value: elem.name_industry_type,
		id: elem.id_industry_type,
	}));

	const industry_options_ar = retrievedData.industryType.map((elem) => ({
		label: elem.name_industry_type_arabic,
		value: elem.name_industry_type_arabic,
		id: elem.id_industry_type,
	}));

	const company_type = retrievedData.companyType.map((item) => ({
		value: item.option_id,
		label: item.option_value_e,
	}));

	const company_type_ar = retrievedData.companyType.map((item) => ({
		value: item.option_id,
		label: item.option_value_a,
	}));

	const number_of_employees = retrievedData.numberEmployees.map((item) => ({
		value: item.option_id,
		label: getSessionInfo("language") === "arabic" ? item.option_value_a : item.option_value_e,
	}));

	// * *****************************************************************************

	return (
		<div>
			{getSessionInfo("language") === "english" ? (
				<div style={{ width: "100vw" }}>
					{pageLoaded && (
						<div className="p-0 hide_scrollbar" style={{ height: "calc(100vh - 101px)", overflowY: "scroll" }}>
							<SuccessModal
								props={props}
								state={mailModal}
								toggleState={toggleModalState}
								message="Company profile updated successfully!"
								path={getSessionInfo("role") === 4 ? "/cnam_users" : "/dashboard"}
							/>

							<div className="col-lg-9 col-xl-6 d-flex flex-sm-row flex-column editCompanyContainer">
								<form encType="multipart/form-data" onSubmit={handleSubmit(SaveChanges)}>
									<div className="flex-fill ">
										<div className="">
											<div className="mt-4 mb-4" id="top">
												<h5 className="font-weight-bold">Edit Company Profile</h5>
											</div>

											<div className="mb-2 font-weight-bold">Company Name *</div>
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														name="name"
														value={value}
														placeholder="Company Name"
														className="col-12 form-control-comp"
														onChange={onChange}
														style={{ border: errors.name ? "1px solid red" : "" }}
													/>
												)}
												rules={{ required: true }}
												name="name"
												control={control}
											/>
											{errors.name && errors.name.type === "required" && (
												<span className="errors">Company Name is required.</span>
											)}

											<div className="mb-2 mt-4 font-weight-bold">Company Email *</div>
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														name="email"
														value={value}
														onChange={onChange}
														style={{
															border: errors.email ? "1px solid red" : "",
														}}
														placeholder="name@email.com"
														className="col-12 form-control-comp"
													/>
												)}
												rules={{
													required: true,
													pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
												}}
												name="email"
												control={control}
											/>
											{errors.email && errors.email.type === "required" && <span className="errors">Email is required.</span>}
											{errors.email && errors.email.type === "pattern" && <span className="errors">Email is not valid.</span>}

											<div className="mb-2 mt-4 font-weight-bold">Company Phone Number *</div>
											<div className="d-md-flex px-0">
												<div className="col-lg-3 col-sm-3 mt-1 pl-0 pr-1">
													<Controller
														render={({ field: { onChange, value } }) => (
															<Selector
																value={value}
																className={errors.phoneCode && "border_form_selector"}
																onChange={onChange}
																options={[{ value: "+966", label: "+966" }]}
																placeholder="+966"
															/>
														)}
														// <Selector
														rules={{ required: true }}
														name="phoneCode"
														control={control}
													/>
													{errors.phoneCode && <span className="errors text-right">Mobile code is required.</span>}
												</div>
												<div className="col-lg-9 col-sm-9 mt-1 pr-0 mr-0">
													<Controller
														render={({ field: { onChange, value } }) => (
															<InputNumeric
																value={value}
																onChange={(e) => {
																	onChange(e);
																}}
																placeholder="50 xxx xxxx"
																format="## ### ####"
																style={{
																	border: errors.phoneNumber ? "1px solid red" : "",
																}}
															/>
														)}
														rules={{
															required: true,
															// eslint-disable-next-line no-useless-escape
															pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
														}}
														name="phoneNumber"
														control={control}
													/>
													{errors.phoneNumber && errors.phoneNumber.type === "required" && (
														<span className="errors">Mobile number is required.</span>
													)}
													{errors.phoneNumber && errors.phoneNumber.type === "pattern" && (
														<span className="errors">Mobile number is invalid.</span>
													)}
												</div>
											</div>

											<div className=" mb-2 mt-4 font-weight-bold">Company Address *</div>
											<Controller
												render={({ field: { onChange, value } }) => (
													<Selector
														name="country"
														options={company_address}
														value={value}
														onChange={onChange}
														placeholder="Country"
													/>
												)}
												rules={{
													required: true,
												}}
												name="country"
												control={control}
											/>

											<Controller
												render={({ field: { onChange, value } }) => (
													<Selector
														name="headquarter"
														value={value}
														options={company_head}
														// eslint-disable-next-line eqeqeq
														onChange={e => { onChange(e); handleOtherOpen(e.value == 30, 'headquarter') }}
														placeholder="Company Headquarter"
														className="mt-3 col-12 mb-2 p-0  w_shadow"
													/>
												)}
												rules={{
													required: true,
												}}
												name="headquarter"
												control={control}
											/>

											{
												otherInputOpen.headquarter &&
												<>
													<Controller
														render={({ field: { onChange, value } }) => (
															<InputText
																type="text"
																value={value}
																onChange={onChange}
																placeholder="please specify"
																className="col-12 mb-2"
																style={{ border: errors.otherHeadquarter ? '1px solid red' : '' }}
															/>
														)}
														rules={{ required: true }}
														name="otherHeadquarter"
														control={control}
													/>
													{
														errors.otherHeadquarter && (
															<span className="errors_c">Specification is required.</span>
														)
													}
												</>
											}

											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														name="address1"
														placeholder="Address Line 1"
														className="col-12 mb-2 mt-3 form-control-comp "
														value={value}
														onChange={onChange}
														style={{
															border: errors.address1 ? "1px solid red" : "",
														}}
													/>
												)}
												rules={{ required: true }}
												name="address1"
												control={control}
											/>
											{errors.address1 && errors.address1.type === "required" && (
												<span className="errors_c">Company Address is required.</span>
											)}

											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														name="address2"
														placeholder="Address Line 2"
														className="col-12 mb-2 mt-3 form-control-comp "
														value={value}
														onChange={onChange}
														style={{
															border: errors.address2 ? "1px solid red" : "",
														}}
													/>
												)}
												rules={{ required: false }}
												name="address2"
												control={control}
											/>

											<div className=" mb-2 mt-4 font-weight-bold">Age of The Company *</div>
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														name="age"
														value={value}
														onChange={onChange}
														style={{
															border: errors.age ? "1px solid red" : "",
														}}
														placeholder="Enter the Age of The Company"
														className="col-12 form-control-comp"
													/>
												)}
												rules={{
													required: true,
												}}
												name="age"
												control={control}
											/>
											{errors.age && errors.age.type === "required" && (
												<span className="errors">Please specify your company age.</span>
											)}

											<div className=" mb-2 mt-4 font-weight-bold">Industry Type *</div>
											<Controller
												render={({ field: { onChange, value } }) => (
													<Select
														name="industry"
														id="industry"
														isMulti
														hideSelectedOptions={false}
														backspaceRemovesValue={false}
														components={{ Option, MultiValue }}
														value={value}
														onChange={(e) => {
															onChange(e);
															handleOtherOpen(
																e.filter((item) => item.value === "Other Industry" && true).length > 0,
																"industryType"
															);
														}}
														options={industry_options}
														placeholder="Select the industry type"
														className={`col-12 mb-2 p-0 w_shadow basic-multi-select ${errors.industry && "border_form_selector"
															}`}
														style={{ boxShadow: "0px 1px 3px -2px #888888" }}
													/>
												)}
												rules={{ required: true }}
												name="industryType"
												control={control}
											/>
											{errors.industryType && <span className="errors_c">Industry is required.</span>}
											{otherInputOpen.industryType && (
												<>
													<Controller
														render={({ field: { onChange, value } }) => (
															<InputText
																type="text"
																value={value}
																onChange={onChange}
																placeholder="please specify"
																className="col-12"
																style={{ border: errors.otherIndustryType ? "1px solid red" : "" }}
															/>
														)}
														rules={{ required: true }}
														name="otherIndustryType"
														control={control}
													/>
													{errors.otherIndustryType && <span className="errors_c">Specification is required.</span>}
												</>
											)}

											<div className="mb-2 mt-4 font-weight-bold">Company Type * </div>

											<Controller
												render={({ field: { onChange, value } }) => (
													<Selector
														name="type"
														options={company_type}
														value={value}
														onChange={(e) => {
															onChange(e);
															handleOtherOpen(e.value === 37, "companyType");
														}}
														placeholder="Select the company type"
													/>
												)}
												rules={{
													required: true,
												}}
												name="companyType"
												control={control}
											/>
											{otherInputOpen.companyType && (
												<>
													<Controller
														render={({ field: { onChange, value } }) => (
															<InputText
																type="text"
																value={value}
																onChange={onChange}
																placeholder="please specify"
																className="col-12 mt-2"
																style={{ border: errors.otherCompanyType ? "1px solid red" : "" }}
															/>
														)}
														rules={{ required: true }}
														name="otherCompanyType"
														control={control}
													/>
													{errors.otherCompanyType && <span className="errors_c">Specification is required.</span>}
												</>
											)}

											<div className="mb-2 mt-4 font-weight-bold">Number of Employees * </div>

											<Controller
												render={({ field: { onChange, value } }) => (
													<Selector
														name="numberEmployees"
														options={number_of_employees}
														value={value}
														onChange={onChange}
														placeholder="Select the number of employees"
														className="text-nowrap"
													/>
												)}
												rules={{
													required: false,
												}}
												name="numberEmployees"
												control={control}
											/>

											<div className="mb-2 mt-4 font-weight-bold">Primary Product or Service *</div>
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														name="productService"
														placeholder="e.g: Artificial Intelligence"
														className="col-12 mb-2 form-control-comp"
														value={value}
														onChange={onChange}
														style={{
															border: errors.product ? "1px solid red" : "",
														}}
													/>
												)}
												rules={{ required: true }}
												name="product"
												control={control}
											/>
											{errors.product && errors.product.type === "required" && (
												<span className="errors_c">Field is required.</span>
											)}

											<div className=" mb-2 mt-4 font-weight-bold">Main customers *</div>
											<FormGroup row style={{ zoom: 1.1 }}>
												{retrievedData.mainCustomers.map((item, i) => {
													return (
														<>
															<FormControlLabel
																className="col-6 mx-0 p-0"
																control={
																	<input
																		className={watch("customers").length === 0 && "error_check"}
																		type="checkbox"
																		style={{ zoom: 1.2 }}
																		value={item.id_main_customer}
																		defaultChecked={checkBoxChecked(item.id_main_customer)}
																		name="customers"
																		color="default"
																		onChange={handleCheckBoxChange}
																	/>
																}
																label={<span className="checkbox">{item.name_customer}</span>}
															/>
														</>
													);
												})}
											</FormGroup>

											<div className="mb-2 mt-4 font-weight-bold">Company Website</div>

											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														name="website"
														type="text"
														value={value}
														onChange={onChange}
														placeholder="http://companyname.com"
														className="form-control-comp"
													/>
												)}
												rules={{ required: false }}
												name="website"
												control={control}
											/>

											<div className="mb-2 mt-4 font-weight-bold">Company Profile</div>
											<div className="d-flex mb-4 mt-2" style={{ flexWrap: "wrap" }}>
												<label className="pointer" style={{ textDecoration: "none" }} htmlFor="exampleCustomFileBrowser">
													<img src={Upload} width={13} alt="up-ic" />{" "}
													<span style={{ color: "#6C6C6C" }}>Upload PDF document </span>
												</label>
												<input
													type="file"
													style={{ display: "none" }}
													id="exampleCustomFileBrowser"
													name="file"
													onChange={handleOnFileChange}
													className="col-6 p-0"
													accept="application/pdf"
													disabled={miniSpinner}
												/>

												{watch("files").length > 0 &&
													watch("files").map((file, index) => {
														return (
															<div className="col-12 pl-0 my-1" key={file.fileSend + index}>
																<Clear className="mr-0 pointer" onClick={() => handleRemoveFile(file)} />
																<span className="pointer" onClick={() => downloadFile(file.fileSend, file.fileName)}>
																	{" "}
																	{file.fileName}{" "}
																</span>
															</div>
														);
													})}

												{miniSpinner && <div className="spinner-border spinner-border-sm text-muted ml-3"></div>}
											</div>
										</div>

										<div className="col-12 p-0 bold_700  mb-1">Company Social Media Accounts</div>

										{/* // ! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}

										{watch("socials").map((item, index) => (
											<>
												<Selector
													value={item.media === "" ? item.media : { label: item.media, value: item.media }}
													options={socialMediaOptions}
													onChange={(val) => handleChangeSocialSelector(val, index)}
													placeholder="Select social"
													className={
														getSessionInfo("language") === "english"
															? `mb-2 pr-0 w_shadow d-inline-block selector_comp ${socialErrors.media[index] && "social-error-border"
															}`
															: ` mb-2 pr-0 w_shadow d-inline-block selector_comp-ar ${socialErrors.media[index] && "social-error-border"
															}`
													}
													style={{ boxShadow: "0px 1px 3px -2px #888888" }}
												/>

												<InputText
													type="text"
													value={item.link}
													onChange={(val) => handleChangeSocialInput(val, index)}
													placeholder="@company Name"
													className={
														getSessionInfo("language") === "english"
															? `d-inline-block social_comp ${socialErrors.link[index] && "social-error-border"}`
															: `d-inline-block social_comp-ar ${socialErrors.link[index] && "social-error-border"}`
													}
												/>

												{watch("socials").length > 0 && (
													<>
														<DeleteIcon
															className="col-0 mx-2 px-0 pointer d-inline-block"
															style={{ fontSize: "18px" }}
															onClick={() => handleDeleteSocial(index)}
														/>
													</>
												)}
											</>
										))}

										<Button
											name="accountNumbers"
											className="addSocialButton p-0"
											style={{ fontSize: "14px", color: "rgb(198 2 36)", background: "none", border: "none" }}
											type="button"
											onClick={handleAddSocial}
										>
											+ Add Another Account
										</Button>

										<div className="d-flex mb-1 mt-2">
											<Button className="ml-auto mr-1 Btncancel" onClick={() => props.history.goBack()}>
												Cancel
											</Button>
											<Button disabled={miniSpinner} className="btnsave" type="submit">
												Save
											</Button>
										</div>
									</div>
								</form>
							</div>
						</div>
					)}
				</div>
			) : (
				<>
					<div style={{ width: "100vw" }}>
						{pageLoaded && (
							<div className="p-0 hide_scrollbar" style={{ height: "calc(100vh - 101px)", overflowY: "scroll" }}>
								<SuccessModal
									props={props}
									state={mailModal}
									toggleState={toggleModalState}
									message="تحديث ملف تعريف المنشأة بنجاح!"
									path={getSessionInfo("role") === 4 ? "/cnam_users" : "/dashboard"}
								/>

								<div
									className="col-lg-9 col-xl-6 d-flex flex-sm-row flex-column editCompanyContainer-ar"
									style={{ fontFamily: "cnam-ar" }}
								>
									<form encType="multipart/form-data" onSubmit={handleSubmit(SaveChanges)}>
										<div className="flex-fill ">
											<div className="">
												<div className="mt-4 mb-4" id="top">
													<h5 className="font-weight-bold">تحرير ملف المنشأة</h5>
												</div>

												<div className="mb-2 font-weight-bold">اسم المنشأة *</div>
												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															name="name"
															value={value}
															placeholder="اسم المنشأة"
															className="col-12 form-control-comp"
															onChange={onChange}
															style={{ border: errors.name ? "1px solid red" : "" }}
														/>
													)}
													rules={{ required: true }}
													name="name"
													control={control}
												/>
												{errors.name && errors.name.type === "required" && <span className="errors">اسم المنشأة مطلوب.</span>}

												<div className="mb-2 mt-4 font-weight-bold">البريد الإلكتروني المنشأة *</div>
												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															name="email"
															value={value}
															onChange={onChange}
															style={{
																border: errors.email ? "1px solid red" : "",
															}}
															placeholder="الاسم @ email.com."
															className="col-12 form-control-comp"
														/>
													)}
													rules={{
														required: true,
														pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
													}}
													name="email"
													control={control}
												/>
												{errors.email && errors.email.type === "required" && (
													<span className="errors">البريد الالكتروني مطلوب.</span>
												)}
												{errors.email && errors.email.type === "pattern" && (
													<span className="errors">البريد الإلكتروني غير صالح.</span>
												)}

												<div className="mb-2 mt-4 font-weight-bold">رقم هاتف المنشأة *</div>
												<div className="d-md-flex px-0">
													<div className="col-lg-3 col-sm-3 mt-1 pl-1 pr-0">
														<Controller
															render={({ field: { onChange, value } }) => (
																<Selector
																	value={value}
																	className={errors.phoneCode && "border_form_selector"}
																	onChange={onChange}
																	options={[{ value: "+966", label: "٩٦٦+" }]}
																	placeholder="٩٦٦+"
																/>
															)}
															// <Selector
															rules={{ required: true }}
															name="phoneCode"
															control={control}
														/>
														{errors.phoneCode && <span className="errors text-right">كود الهاتف المحمول مطلوب.</span>}
													</div>
													<div className="col-lg-9 col-sm-9 mt-1 pl-0">
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputNumeric
																	value={value}
																	onChange={(e) => {
																		onChange(e);
																	}}
																	placeholder="۰۰ ۰۰۰ ۰۰۰"
																	format="## ### ####"
																	style={{
																		border: errors.phoneNumber ? "1px solid red" : "",
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
															name="phoneNumber"
															control={control}
														/>
														{errors.phoneNumber && errors.phoneNumber.type === "required" && (
															<span className="errors">رقم الهاتف المحمول مطلوب.</span>
														)}
														{errors.phoneNumber && errors.phoneNumber.type === "pattern" && (
															<span className="errors">رقم الجوال غير صحيح.</span>
														)}
													</div>
												</div>

												<div className=" mb-2 mt-4 font-weight-bold">عنوان المنشأة*</div>
												<Controller
													render={({ field: { onChange, value } }) => (
														<Selector
															name="country"
															options={company_address_ar}
															value={value}
															onChange={onChange}
															placeholder="دولة"
														/>
													)}
													rules={{
														required: true,
													}}
													name="country"
													control={control}
												/>

												<Controller
													render={({ field: { onChange, value } }) => (
														<Selector
															name="headquarter"
															value={value}
															options={company_head}
															// eslint-disable-next-line eqeqeq
															onChange={e => { onChange(e); handleOtherOpen(e.value == 30, 'headquarter'); }}
															placeholder="مقر المنشأة"
															className="mt-3 col-12 mb-2 p-0  w_shadow"
														/>
													)}
													rules={{
														required: true,
													}}
													name="headquarter"
													control={control}
												/>

												{
													otherInputOpen.headquarter &&
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	type="text"
																	value={value}
																	onChange={onChange}
																	placeholder="يرجى تحديد"
																	className="col-12 mb-2"
																	style={{ border: errors.otherHeadquarter ? '1px solid red' : '' }}
																/>
															)}
															rules={{ required: true }}
															name="otherHeadquarter"
															control={control}
														/>
														{
															errors.otherHeadquarter && (
																<span className="errors_c">المواصفات مطلوبة.</span>
															)
														}
													</>
												}

												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															name="address1"
															placeholder="العنوان السطر 1"
															className="col-12 mb-2 mt-3 form-control-comp "
															value={value}
															onChange={onChange}
															style={{
																border: errors.address1 ? "1px solid red" : "",
															}}
														/>
													)}
													rules={{ required: true }}
													name="address1"
													control={control}
												/>
												{errors.address1 && errors.address1.type === "required" && (
													<span className="errors_c">عنوان المنشأة مطلوب.</span>
												)}

												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															name="address2"
															placeholder="سطر العنوان 2"
															className="col-12 mb-2 mt-3 form-control-comp "
															value={value}
															onChange={onChange}
															style={{
																border: errors.address2 ? "1px solid red" : "",
															}}
														/>
													)}
													rules={{ required: false }}
													name="address2"
													control={control}
												/>

												<div className=" mb-2 mt-4 font-weight-bold">عصر المنشأة*</div>
												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															name="age"
															value={value}
															onChange={onChange}
															style={{
																border: errors.age ? "1px solid red" : "",
															}}
															placeholder="أدخل عمر المنشأة"
															className="col-12 form-control-comp"
														/>
													)}
													rules={{
														required: true,
													}}
													name="age"
													control={control}
												/>
												{errors.age && errors.age.type === "required" && <span className="errors">يرجى تحديد سن شركتك.</span>}

												<div className=" mb-2 mt-4 font-weight-bold">نوع الصناعة *</div>
												<Controller
													render={({ field: { onChange, value } }) => (
														<Select
															name="industry"
															id="industry"
															isMulti
															hideSelectedOptions={false}
															backspaceRemovesValue={false}
															components={{ Option, MultiValue }}
															value={value}
															onChange={(e) => {
																onChange(e);
																handleOtherOpen(
																	e.filter((item) => item.value === "Other Industry" && true).length > 0,
																	"industryType"
																);
															}}
															options={industry_options_ar}
															placeholder="حدد نوع الصناعة"
															className={`col-12 mb-2 p-0 w_shadow basic-multi-select ${errors.industry && "border_form_selector"
																}`}
															style={{ boxShadow: "0px 1px 3px -2px #888888" }}
														/>
													)}
													rules={{ required: true }}
													name="industryType"
													control={control}
												/>
												{errors.industryType && <span className="errors_c">مطلوب الصناعة.</span>}
												{otherInputOpen.industryType && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	type="text"
																	value={value}
																	onChange={onChange}
																	placeholder="رجاء حدد"
																	className="col-12"
																	style={{ border: errors.otherIndustryType ? "1px solid red" : "" }}
																/>
															)}
															rules={{ required: true }}
															name="otherIndustryType"
															control={control}
														/>
														{errors.otherIndustryType && <span className="errors_c">المواصفات مطلوبة.</span>}
													</>
												)}

												<div className="mb-2 mt-4 font-weight-bold">نوع المنشأة * </div>

												<Controller
													render={({ field: { onChange, value } }) => (
														<Selector
															name="type"
															options={company_type_ar}
															value={value}
															onChange={(e) => {
																onChange(e);
																handleOtherOpen(e.value === 37, "companyType");
															}}
															placeholder="حدد نوع المنشأة"
														/>
													)}
													rules={{
														required: true,
													}}
													name="companyType"
													control={control}
												/>
												{otherInputOpen.companyType && (
													<>
														<Controller
															render={({ field: { onChange, value } }) => (
																<InputText
																	type="text"
																	value={value}
																	onChange={onChange}
																	placeholder="رجاء حدد"
																	className="col-12 mt-2"
																	style={{ border: errors.otherCompanyType ? "1px solid red" : "" }}
																/>
															)}
															rules={{ required: true }}
															name="otherCompanyType"
															control={control}
														/>
														{errors.otherCompanyType && <span className="errors_c">المواصفات مطلوبة.</span>}
													</>
												)}

												<div className="mb-2 mt-4 font-weight-bold">عدد الموظفين * </div>

												<Controller
													render={({ field: { onChange, value } }) => (
														<Selector
															name="numberEmployees"
															options={number_of_employees}
															value={value}
															onChange={onChange}
															placeholder="حدد عدد الموظفين"
															className="text-nowrap"
														/>
													)}
													rules={{
														required: false,
													}}
													name="numberEmployees"
													control={control}
												/>

												<div className="mb-2 mt-4 font-weight-bold">المنتج الأولية أو الخدمة *</div>
												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															name="productService"
															placeholder="E.G: الذكاء الاصطناعي"
															className="col-12 mb-2 form-control-comp"
															value={value}
															onChange={onChange}
															style={{
																border: errors.product ? "1px solid red" : "",
															}}
														/>
													)}
													rules={{ required: true }}
													name="product"
													control={control}
												/>
												{errors.product && errors.product.type === "required" && (
													<span className="errors_c">الحقل مطلوب.</span>
												)}

												<div className=" mb-2 mt-4 font-weight-bold">الزبائن الرئيسيون *</div>
												<FormGroup row style={{ zoom: 1.1 }}>
													{retrievedData.mainCustomers.map((item, i) => {
														return (
															<>
																<FormControlLabel
																	className="col-6 mx-0 p-0"
																	control={
																		<input
																			className={watch("customers").length === 0 && "error_check"}
																			type="checkbox"
																			style={{ zoom: 1.2 }}
																			value={item.id_main_customer}
																			defaultChecked={checkBoxChecked(item.id_main_customer)}
																			name="customers"
																			color="default"
																			onChange={handleCheckBoxChange}
																		/>
																	}
																	label={<span className="checkbox mr-1" style={{ fontFamily: 'cnam-ar', fontSize: '14px' }}>{item.name_customer_arabic}</span>}
																/>
															</>
														);
													})}
												</FormGroup>

												<div className="mb-2 mt-4 font-weight-bold">موقع المنشأة</div>

												<Controller
													render={({ field: { onChange, value } }) => (
														<InputText
															style={{ fontFamily: 'cnam' }}
															name="website"
															type="text"
															value={value}
															onChange={onChange}
															placeholder="http://companyname.com"
															className="form-control-comp"
														/>
													)}
													rules={{ required: false }}
													name="website"
													control={control}
												/>

												<div className="mb-2 mt-4 font-weight-bold">ملف المنشأة</div>
												<div className="d-flex mb-4 mt-2" style={{ flexWrap: "wrap" }}>
													<label className="pointer" style={{ textDecoration: "none" }} htmlFor="exampleCustomFileBrowser">
														<img src={Upload} width={13} alt="up-ic" />{" "}
														<span style={{ color: "#6C6C6C" }}>تحميل وثيقة PDF </span>
													</label>
													<input
														type="file"
														style={{ display: "none" }}
														id="exampleCustomFileBrowser"
														name="file"
														onChange={handleOnFileChange}
														className="col-6 p-0"
														accept="application/pdf"
														disabled={miniSpinner}
													/>

													{watch("files").length > 0 &&
														watch("files").map((file, index) => {
															return (
																<div className="col-12 pl-0 my-1" key={file.fileSend + index}>
																	<Clear className="mr-0 pointer" onClick={() => handleRemoveFile(file)} />
																	<span
																		className="pointer"
																		onClick={() => downloadFile(file.fileSend, file.fileName)}
																	>
																		{" "}
																		{file.fileName}{" "}
																	</span>
																</div>
															);
														})}

													{miniSpinner && <div className="spinner-border spinner-border-sm text-muted ml-3"></div>}
												</div>
											</div>

											<div className="col-12 p-0 bold_700  mb-1">حسابات وسائل الإعلام الاجتماعية للشركة</div>

											{/* // ! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}

											{watch("socials").map((item, index) => (
												<>
													<Selector
														value={item.media === "" ? item.media : { label: item.media, value: item.media }}
														options={socialMediaOptions}
														onChange={(val) => handleChangeSocialSelector(val, index)}
														placeholder="Select social"
														className={
															getSessionInfo("language") === "english"
																? `mb-2 pr-0 w_shadow d-inline-block selector_comp ${socialErrors.media[index] && "social-error-border"
																}`
																: ` mb-2 pr-0 w_shadow d-inline-block selector_comp-ar ${socialErrors.media[index] && "social-error-border"
																}`
														}
														style={{ boxShadow: "0px 1px 3px -2px #888888" }}
													/>

													<InputText
														type="text"
														value={item.link}
														onChange={(val) => handleChangeSocialInput(val, index)}
														placeholder="@company Name"
														className={
															getSessionInfo("language") === "english"
																? `d-inline-block social_comp ${socialErrors.link[index] && "social-error-border"}`
																: `d-inline-block social_comp-ar ${socialErrors.link[index] && "social-error-border"}`
														}
													/>

													{watch("socials").length > 0 && (
														<>
															<DeleteIcon
																className="col-0 mx-2 px-0 pointer d-inline-block"
																style={{ fontSize: "18px" }}
																onClick={() => handleDeleteSocial(index)}
															/>
														</>
													)}
												</>
											))}

											<Button
												name="accountNumbers"
												className="addSocialButton p-0"
												style={{ fontSize: "14px", color: "rgb(198 2 36)", background: "none", border: "none" }}
												type="button"
												onClick={handleAddSocial}
											>
												+ إضافة حساب آخر
											</Button>

											<div className="d-flex mb-1 mt-2">
												<Button className="mr-auto ml-1 Btncancel" onClick={() => props.history.goBack()}>
												الغاء 	
												</Button>
												<Button disabled={miniSpinner} className="btnsave" type="submit">
												حفظ
												</Button>
											</div>
										</div>
									</form>
								</div>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}

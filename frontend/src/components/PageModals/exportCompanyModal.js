import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

import Select from "react-select";
import { Button } from "reactstrap";
import DatePicker from "react-datepicker";

import Modal from "../Modal/Modal";

import { downloadFileWithExtension,  } from "../../functions";

import { WS_LINK } from "../../globals";
import { getSessionInfo } from "../../variable";

import "react-datepicker/dist/react-datepicker.css";
import "./exportCompanyModal.css";

const challenge_types = [
	{ value: "Energy", label: <span style={{ fontFamily: "cnam" }}>Energy</span> },
	{ value: "Material Science", label: <span style={{ fontFamily: "cnam" }}>Material Science</span> },
	{ value: "Computer Science", label: <span style={{ fontFamily: "cnam" }}>Computer Science</span> },
	{ value: "Super/High Computing", label: <span style={{ fontFamily: "cnam" }}>Super/High Computing</span> },
	{ value: "Engineering", label: <span style={{ fontFamily: "cnam" }}>Engineering</span> },
	{ value: "Clean Combustion", label: <span style={{ fontFamily: "cnam" }}>Clean Combustion</span> },
	{ value: "Marine Science", label: <span style={{ fontFamily: "cnam" }}>Marine Science</span> },
	{ value: "Visualization", label: <span style={{ fontFamily: "cnam" }}>Visualization</span> },
	{ value: "Water Desalination", label: <span style={{ fontFamily: "cnam" }}>Water Desalination</span> },
	{ value: "Bioscience", label: <span style={{ fontFamily: "cnam" }}>Bioscience</span> },
	{ value: "Nanotechnology", label: <span style={{ fontFamily: "cnam" }}>Nanotechnology</span> },
	{ value: "Artificial Intelligence", label: <span style={{ fontFamily: "cnam" }}>Artificial Intelligence</span> },
	{ value: "Membranes", label: <span style={{ fontFamily: "cnam" }}>Membranes</span> },
	{ value: "Agricultural", label: <span style={{ fontFamily: "cnam" }}>Agricultural</span> },
	{ value: "Communication", label: <span style={{ fontFamily: "cnam" }}>Communication</span> },
	{ value: "Manufacturing", label: <span style={{ fontFamily: "cnam" }}>Manufacturing</span> },
	{ value: "3D Printing", label: <span style={{ fontFamily: "cnam" }}>3D Printing</span> },
	{ value: "3D design", label: <span style={{ fontFamily: "cnam" }}>3D design</span> },
	{ value: "Modeling & Simulation", label: <span style={{ fontFamily: "cnam" }}>Modeling & Simulation</span> },
	{ value: "Machining", label: <span style={{ fontFamily: "cnam" }}>Machining</span> },
	{ value: "Prototyping", label: <span style={{ fontFamily: "cnam" }}>Prototyping</span> },
	{ value: "Sensing", label: <span style={{ fontFamily: "cnam" }}>Sensing</span> },
	{ value: "Actuation", label: <span style={{ fontFamily: "cnam" }}>Actuation</span> },
	// { value: "Other", label: <span style={{ fontFamily: "cnam" }}>Other</span> },
];

const hear_about_us = [
	{ value: "Social media", label: <span style={{ fontFamily: "cnam" }}>Social media</span> },
	{ value: "cnam website", label: <span style={{ fontFamily: "cnam" }}>cnam website</span> },
	{ value: "Friend", label: <span style={{ fontFamily: "cnam" }}>Friend</span> },
	{ value: "Government agencies", label: <span style={{ fontFamily: "cnam" }}>Government agencies</span> },
	{ value: "Monshaat", label: <span style={{ fontFamily: "cnam" }}>Monshaat</span> },
	{ value: "Modon", label: <span style={{ fontFamily: "cnam" }}>Modon</span> },
	{ value: "Jeddah chamber", label: <span style={{ fontFamily: "cnam" }}>Jeddah chamber</span> },
	// { value: "Other", label: <span style={{ fontFamily: "cnam" }}>Other</span> },
];

// const company_type_options = [
// 	{
// 		value: "Private Limited Company (Ltd.)",
// 		label: <span style={{ fontFamily: "cnam" }}>Private Limited Company (Ltd.)</span>,
// 	},
// 	{
// 		value: "Joint-Stock Corporation (JRC)",
// 		label: <span style={{ fontFamily: "cnam" }}>Joint-Stock Corporation (JRC)</span>,
// 	},
// 	{
// 		value: "Private Limited Liability Company",
// 		label: <span style={{ fontFamily: "cnam" }}>Private Limited Liability Company</span>,
// 	},
// 	{ value: "General Partnership", label: <span style={{ fontFamily: "cnam" }}>General Partnership</span> },
// 	{ value: "One Owner/Person Company", label: <span style={{ fontFamily: "cnam" }}>One Owner/Person Company</span> },
// 	{
// 		value: "Establishment (Sole Proprietorship)",
// 		label: <span style={{ fontFamily: "cnam" }}>Establishment (Sole Proprietorship)</span>,
// 	},
// 	// { value: "Other Type", label: <span style={{ fontFamily: "cnam" }}>Other Type</span> },
// ];

const company_size_options = [
	{ value: "1 to 5", label: getSessionInfo("language") === "english" ? "1 to 5" : "1 إلى 5." },
	{ value: "6 to 50", label: getSessionInfo("language") === "english" ? "6 to 50" : "6 إلى 50." },
	{ value: "51 to 250", label: getSessionInfo("language") === "english" ? "51 to 250" : "51 إلى 250." },
	{ value: "More than 250", label: getSessionInfo("language") === "english" ? "More than 250" : "أكثر من 250." },
];

// var roles_options = [
// 	{ value: "Team Leader", label: "Team Leader" },
// 	{ value: "Manager", label: "Manager" },
// 	{ value: "Head Assistant Manager", label: "Head Assistant Manager" },
// 	{ value: "Executive Director", label: "Executive Director" },
// 	{ value: "Coordinator", label: "Coordinator" },
// 	{ value: "Administrator", label: "Administrator" },
// 	{ value: "Researcher ", label: "Researcher " },
// 	{ value: "Technical ", label: "Technical " },
// 	{ value: "Other", label: "Other" },
// ];

var status_options = [
	{ value: "active", label: getSessionInfo("language") === "english" ? "active" : "نشيط" },
	{ value: "inactive", label: getSessionInfo("language") === "english" ? "inactive" : "غير نشط" },
];

export default function ExportModal({ props, toggleState, state, type }) {

	// State for all options in the dropdown
	const [optionsObj, setoptionsObj] = useState({
		industry_type: [],
		customers: [],
		departments: [],
		company_type: [],
	});

	// Mapping the values inside optionsObj, first render they will be empty will re-render after filldata is called
	// We use filter and map to filter out values of type 'Other'
	const industry_options = optionsObj.industry_type
		.filter((elem) => {
			return elem.option_value_e !== "Other";
		})
		.map((elem) => {
			return {
				value: elem.id_industry_type,
				label: elem.name_industry_type,
				id: elem.id_industry_type,
			};
		});

	const customer_options = optionsObj.customers
		.filter((elem) => {
			return elem.option_value_e !== "Other";
		})
		.map((elem) => {
			return {
				value: elem.id_main_customer,
				label: elem.name_customer,
				id: elem.id_main_customer,
			};
		});

			const company_type_options = optionsObj.company_type
		.filter((elem) => {
			return elem.option_value_e !== "Other";
		})
		.map((elem) => {
			return {
				value: elem.option_id,
				label: elem.option_value_e,
				id: elem.option_id,
			};
		});


	const user_departments = optionsObj.departments
		.filter((elem) => {
			return elem.option_value_e !== "Other";
		})
		.map((elem) => {
			return {
				value: elem.option_id,
				label: elem.option_value_e,
				id: elem.option_id,
			};
		});

	let fields = [];
	// **
	// Type of the custom export(challenge, internship, industry, user)
	// Fields: 
	// 	- input_name: name of the input for the dropdown
	// 	- text/text_ar: title before the dropdown
	// 	- optins: dropdown options
	//	- placeholder/placeholder_ar
	// **
	switch (type) {
		case "challenge":
			fields = [
				{
					input_name: "challenge_types",
					text: "Challenges Types",
					text_ar: "أنواع التحديات",
					options: challenge_types,
					placeholder: "Select Challenge type",
					placeholder_ar: "حدد تحدي النوع",
				},
				{
					input_name: "hear_about_us",
					text: "How did you hear about us",
					text_ar: "كيف سمعتم عنا ",
					options: hear_about_us,
					placeholder: "How did you  hear about us",
					placeholder_ar: "كيف سمعتم عنا ",
				},
			];
			break;
		case "internship":
			fields = [
				{
					input_name: "internship_length",
					text: "Internship Length",
					text_ar: "فترة التدريب",
					options: [
						{ value: "One Month", label: "One Month" },
						{ value: "Three Months", label: "Three Month" },
						{ value: "Six Month", label: "Six Month" },
						{ value: "Nine Month", label: "Nine Month" },
						// { value: "Other", label: "Other" },
					],

					placeholder: "Select internship length",
					placeholder_ar: "حدد فترة التدريب",
				},
				{
					input_name: "major",
					text: "Major",
					text_ar: "رئيسي",
					options: [
						{ value: "Computer Science", label: "Computer Science" },
						{ value: "Buisness Management", label: "Buisness Management" },
						{ value: "Actuarial Mathematics", label: "Actuarial Mathematics" },
						{ value: "Chemistry", label: "Chemistry" },
						// { value: "Other", label: "Other" },
					],

					placeholder: "Select Major",
					placeholder_ar: "حدد الرئيسي",
				},
			];
			break;
		case "industry":
			fields = [
				{
					input_name: "industry_types",
					text: "Industry Types",
					text_ar: "أنواع الصناعة",
					options: industry_options,
					placeholder: "Select industry type",
					placeholder_ar: "حدد نوع الصناعة",
				},
				{
					input_name: "main_customers",
					text: "Main Customer",
					text_ar: "زبون أساسي",
					options: customer_options,
					placeholder: "Select Main customers",
					placeholder_ar: "حدد العملاء الرئيسيين",
				},
				{
					input_name: "company_type",
					text: "Company Type",
					text_ar: "نوع المنشأة",
					options: company_type_options,
					placeholder: "Select Company type",
					placeholder_ar: "حدد نوع المنشأة",
				},
				{
					input_name: "company_size",
					text: "Company Size",
					text_ar: "حجم المنشأة",
					options: company_size_options,
					placeholder: "Select Company size",
					placeholder_ar: "حدد حجم المنشأة",
				},
			];
			break;
		case "user":
			fields = [
				{
					input_name: "department",
					text: "Department",
					text_ar: "قسم",
					options: user_departments,
					placeholder: "Select Departments",
					placeholder_ar: "اختر الإدارات",
				},
				{
					input_name: "status",
					text: "User status",
					text_ar: "حالة المستخدم",
					options: status_options,
					placeholder: "Select user status",
					placeholder_ar: "حدد حالة المستخدم",
				},
			];
			break;
		default:
			break;
	}

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			from_date: "",
			to_date: "",
			industry_types: [],
			company_size: [],
			main_customers: [],
			company_type: [],
			challenge_types: [],
			hear_about_us: [],
			internship_length: [],
			major: [],
			department: [],
			status: [],
		},
	});

	useEffect(() => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		axios({
			method: "get",
			url: `${WS_LINK}fill_data`,
			cancelToken: source.token,
		})
			.then((res) => {
				setoptionsObj({
					customers: res.data[0],
					industry_type: res.data[1],
					company_type: res.data[3],
					departments: res.data[5],
				});
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});
	}, []);

	const toggle = () => {
		toggleState();
	};

	const onSubmit = (data) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();
		var postedData, api_name;
		var from_date = "",
			to_date = "";
		if (data.from_date) {
			from_date = data.from_date.getFullYear() + "-" + ("0" + (data.from_date.getMonth() + 1)).slice(-2) + "-" + data.from_date.getDate();
		}
		if (data.to_date) {
			to_date = data.to_date.getFullYear() + "-" + (parseInt(data.to_date.getMonth()) + 1).toString() + "-" + data.to_date.getDate();
		}
		switch (type) {
			case "challenge":
				var challenge_types = data.challenge_types.map((e) => {
					return e.value;
				});
				var hear_about_us = data.hear_about_us.map((e) => {
					return e.value;
				});

				api_name = "export_custom_challenges";
				postedData = {
					userid: getSessionInfo("id"),
					token: getSessionInfo("token"),
					from_date: from_date,
					to_date: to_date,
					challenge_type: challenge_types,
					hear: hear_about_us,
				};
				break;
			case "internship":
				var internship_length = data.internship_length.map((e) => {
					return e.value;
				});
				var major = data.major.map((e) => {
					return e.value;
				});

				api_name = "export_custom_internships";
				postedData = {
					userid: getSessionInfo("id"),
					token: getSessionInfo("token"),
					from_date: from_date,
					to_date: to_date,
					internship_length: internship_length,
					major: major,
				};
				break;
			case "industry":
				var industry_type = data.industry_types.map((e) => {
					return e.value;
				});
				var company_size = data.company_size.map((e) => {
					return e.value;
				});
				var main_customers = data.main_customers.map((e) => {
					return e.value;
				});
				var company_type = data.company_type.map((e) => {
					return e.value;
				});

				api_name = "export_custom_industry";
				postedData = {
					userid: getSessionInfo("id"),
					token: getSessionInfo("token"),
					from_date: from_date,
					to_date: to_date,
					industry_type: industry_type,
					company_size: company_size,
					main_customers: main_customers,
					company_type: company_type,
				};
				break;
			case "user":
				var department = data.department.map((e) => {
					return e.value;
				});
				var status = data.status.map((e) => {
					return e.value;
				});

				api_name = "export_custom_users";
				postedData = {
					userid: getSessionInfo("id"),
					token: getSessionInfo("token"),
					from_date: from_date,
					to_date: to_date,
					department: department,
					status: status,
				};
				break;
			default:
				break;
		}

		axios({
			method: "post",
			url: `${WS_LINK}${api_name}`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				downloadFileWithExtension(res.data, `${type}-report.pdf`, "pdf");
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});
	};
	var modalBody;

	modalBody =
		getSessionInfo("language") === "english" ? (
			<>
				<div className="py-4 px-2">
					<div className="modalHeader">
						<Button className="ml-auto mr-4" color="link close" onClick={() => toggle()}>
							X
						</Button>
						<h5 className="" style={{ fontFamily: "cnam-bold" }}>
							Create a new report
						</h5>
					</div>
					<div className="modalBody">
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="row mb-1">
								<div className="col">
									<div className="mb-2" style={{ fontFamily: "cnam-bold" }}>
										From date
									</div>
									<Controller
										render={({ field: { onChange, value } }) => (
											<DatePicker
												className={`pointer col-12 shadow-none form-control ${errors.time && "border_form"}`}
												onChange={onChange}
												placeholderText="From date"
												value={value}
												selected={value}
												dateFormat="MMMM d, yyyy"
											/>
										)}
										rules={{ required: false }}
										name="from_date"
										control={control}
									/>
								</div>
								<div className="col">
									<div className="mb-2" style={{ fontFamily: "cnam-bold" }}>
										To date
									</div>
									<Controller
										render={({ field: { onChange, value } }) => (
											<DatePicker
												className={`pointer col-12 shadow-none form-control ${errors.time && "border_form"}`}
												onChange={onChange}
												placeholderText="To date"
												value={value}
												selected={value}
												dateFormat="MMMM d, yyy"
											/>
										)}
										rules={{ required: false }}
										name="to_date"
										control={control}
									/>
								</div>
							</div>
							<div className="row">
								{fields.map((item) => {
									return (
										<div className="col-6">
											<div className="my-2" style={{ fontFamily: "cnam-bold" }}>
												{item.text}
											</div>
											<Controller
												render={({ field: { onChange, value } }) => (
													<Select
														id={item.input_name}
														isMulti
														hideSelectedOptions={false}
														backspaceRemovesValue={false}
														value={value}
														onChange={onChange}
														options={item.options}
														placeholder={item.placeholder}
														className={`col-12 mb-2 p-0 w_shadow basic-multi-select ${
															errors.industry && "border_form_selector"
														}`}
														style={{ boxShadow: "0px 1px 3px -2px #888888" }}
													/>
												)}
												rules={{ required: false }}
												name={item.input_name}
												control={control}
											/>
										</div>
									);
								})}
							</div>
							<div className="d-flex">
								<Button onClick="" style={{ backgroundColor: "#00ab9e", border: "none" }} className="mt-4 ml-auto">
									Generate
								</Button>
							</div>
						</form>
					</div>
				</div>
			</>
		) : (
			<>
				<div className="py-4 px-2" style={{ direction: "rtl", fontFamily: "cnam-ar", textAlign: "right" }}>
					<div className="modalHeader d-flex flex-row">
						<h5 className="" style={{ fontFamily: "cnam-bold-ar" }}>
							إنشاء تقرير جديد
						</h5>
						<Button className="mr-auto ml-4" color="link close" onClick={() => toggle()}>
							X
						</Button>
					</div>
					<div className="modalBody">
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="row mb-1">
								<div className="col">
									<div className="mb-2" style={{ fontFamily: "cnam-bold-ar" }}>
										من التاريخ
									</div>
									<Controller
										render={({ field: { onChange, value } }) => (
											<DatePicker
												className={`pointer col-12 shadow-none form-control ${errors.time && "border_form"}`}
												onChange={onChange}
												placeholderText="From date"
												value={value}
												selected={value}
												dateFormat="MMMM d, yyyy"
											/>
										)}
										rules={{ required: false }}
										name="from_date"
										control={control}
									/>
								</div>
								<div className="col">
									<div className="mb-2" style={{ fontFamily: "cnam-bold-ar" }}>
										حتى الآن
									</div>
									<Controller
										render={({ field: { onChange, value } }) => (
											<DatePicker
												className={`pointer col-12 shadow-none form-control ${errors.time && "border_form"}`}
												onChange={onChange}
												placeholderText="To date"
												value={value}
												selected={value}
												dateFormat="MMMM d, yyy"
											/>
										)}
										rules={{ required: false }}
										name="to_date"
										control={control}
									/>
								</div>
							</div>
							<div className="row" style={{ fontFamily: "cnam-ar" }}>
								{fields.map((item) => {
									return (
										<div className="col-6">
											<div className="mb-2" style={{ fontFamily: "cnam-bold-ar" }}>
												{item.text_ar}
											</div>
											<Controller
												render={({ field: { onChange, value } }) => (
													<Select
														id={item.input_name}
														isMulti
														hideSelectedOptions={false}
														backspaceRemovesValue={false}
														value={value}
														onChange={onChange}
														options={item.options}
														placeholder={item.placeholder_ar}
														className={`col-12 mb-2 p-0 w_shadow basic-multi-select ${
															errors.industry && "border_form_selector"
														}`}
														style={{ boxShadow: "0px 1px 3px -2px #888888" }}
													/>
												)}
												rules={{ required: false }}
												name={item.input_name}
												control={control}
											/>
										</div>
									);
								})}
							</div>

							<div className="d-flex">
								<Button onClick="" style={{ backgroundColor: "#00ab9e", border: "none" }} className="mt-4 mr-auto">
									ولد
								</Button>
							</div>
						</form>
					</div>
				</div>
			</>
		);
	return (
		<>
			<Modal modalState={state} modalBody={modalBody} style={{ maxWidth: "800px" }} />
		</>
	);
}

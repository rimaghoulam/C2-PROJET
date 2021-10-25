// TODO adjust active company users in arabic like english
import React from 'react'
import { Button, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown } from "reactstrap";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router";

import { WS_LINK } from "../../globals";
import { formatDate, downloadFileWithExtension, translate } from "../../functions";
import { getSessionInfo, clearSessionInfo } from "../../variable";

import "react-datepicker/dist/react-datepicker.css";

import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import ExportModal from "../../components/PageModals/exportCompanyModal";

import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import "../../App.css";
import "./AdminCompanyUsers.css";

import pdf from "../../assets/images_svg/pdf.svg";
import csv from "../../assets/images_svg/csv.svg";

// styles
const iconsStyle = {
	background: "#ccf0eb",
	borderRadius: "13%",
	display: "flex",
	fontSize: "18px",
	alignItems: "center",
	justifyContent: "center",
	width: "2.6rem",
	height: "2.6rem",
};


const all_users_columns = [
	{
		title: getSessionInfo("language") === "english" ? "NAME" : "اسم", field: "name", render: rowData => (
			<div className="d-flex">
				<div className={`d-flex align-items-center ${getSessionInfo("language") === "english" ? "ml-0" : "ml-2"}`}>
					<div className="" style={iconsStyle}>
						{rowData.name.name.charAt(0).toUpperCase()}
					</div>
				</div>
				<div className={translate('ml-1', 'mr-1')}>
					<p className="mb-0">{rowData.name.name}</p>
					<p className="mb-0" style={{ fontSize: '0.75rem', color: 'grey' }}>#ID: {rowData.name.id}</p>
				</div>
			</div>
		),
		customFilterAndSearch: (term, rowData) => (rowData.name.name.toLowerCase()).indexOf(term.toLowerCase()) !== -1 || (rowData.name.id).indexOf(term) !== -1
	},
	{ title: getSessionInfo("language") === "english" ? "USERNAME" : "اسم االمستخدم", field: "username" },
	{ title: getSessionInfo("language") === "english" ? "EMAIL" : "البريد الإلكتروني", field: "email" },
	{ title: getSessionInfo("language") === "english" ? "COMAPNY NAME" : "COMAPNY NAME", field: "company", defaultSort: 'desc' },
]


export default function AdminCompaniesTable(props) {
	let { status } = useParams();
	if (status !== undefined) status = decodeURIComponent(atob(status));


	// the states

	const numberOfUsers = useRef({})
	const allIndustryUsers = useRef([])

	const [modalState, setModalState] = useState(false);
	const [checkModalState, setcheckModalState] = useState(false);
	const [activatedModalState, setActivatedModalState] = useState(false);
	const [deactivatedModalState, setdeactivatedModalState] = useState(false);
	const [exportModalState, setExportModalState] = useState(false);

	const [modalDetails, setModalDetails] = useState({
		del: "",
	});
	const [userObj, setUserObj] = useState({
		industry_details: "",
	});
	const [inactiveindustryObj, setInactiveindustryObj] = useState({
		industry_details: "",
	});

	const [activeindustryObj, setActiveindustryObj] = useState({
		industry_details: "",
	});
	const [loaded, setLoaded] = useState(false);

	const toggleModalState = () => {
		setModalState(!modalState);
	};
	const togglecheckModalState = () => {
		setcheckModalState(!checkModalState);
	};
	const toggleActivatedModalState = () => {
		setActivatedModalState(!activatedModalState);
	};
	const toggledeactivatedModalState = () => {
		setdeactivatedModalState(!deactivatedModalState);
	};
	const toggleExportModalState = () => {
		setExportModalState(!exportModalState);
	};

	const checkDelete = (info) => {
		setModalDetails({ info: info });
		togglecheckModalState();
	};

	// fill page on creation
	useEffect(() => {
		props.setPageTitle('Industry Users', 'مستخدمي الصناعة')
		get_request();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const get_request = () => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			adminid: getSessionInfo("id"),
			token: getSessionInfo("token"),
		};
		props.toggleSpinner(true);

		axios({
			method: "post",
			url: `${WS_LINK}get_all_industry`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data !== "role error" && res.data !== "token error") {
					numberOfUsers.current = res.data[3]
					allIndustryUsers.current = res.data[4]
					setUserObj({ industry_details: res.data[0] }); // completed companies
					setActiveindustryObj({ industry_details: res.data[2] }); // inactive users (step one and verification done)
					setInactiveindustryObj({ industry_details: res.data[1] }); // inactive users (only first step done)
					setActivatedModalState(false);
					setdeactivatedModalState(false);
					setLoaded(true);
				} else {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				}

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
	};

	// function to delete a user
	const delete_rows = (info) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			id_to_delete: info.info,
		};

		setModalState(false);
		props.toggleSpinner(true);
		axios({
			method: "post",
			url: `${WS_LINK}deactivate_user`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 4 && res.data !== "token error") {
					setModalState(false);
					setcheckModalState(false);
					setdeactivatedModalState(true);
					setModalDetails({
						del: "",
					});
					// get_request();
					setTimeout(() => {
						props.toggleSpinner(false);
					}, 1000);
				} else {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				}
			})
			.catch((err) => {
				props.toggleSpinner(false);
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});
	};

	const exportTable = (data, users_id, exportType, isCompany) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		let users = [];
		for (let i = 0; i < data.length; i++) {
			users[i] = data[i].key;
		}

		var postedData;

		postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			toe: exportType,
			industries_id: users,
		};

		props.toggleSpinner(true);
		axios({
			method: "post",
			url: `${WS_LINK}export_industry`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 4 && res.data !== "token error") {
					props.toggleSpinner(false);
					downloadFileWithExtension(res.data, `industry-users.${exportType}`, exportType);
				} else {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				}
			})

			.catch((err) => {
				props.toggleSpinner(false);
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});
	};


	const exportIndustryUsers = (data, exportType) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();


		var postedData;

		postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			toe: exportType,
			users_id: data.map(item => item.key),
		};

		props.toggleSpinner(true);
		axios({
			method: "post",
			url: `${WS_LINK}export_all_industry_users`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 4 && res.data !== "token error") {
					props.toggleSpinner(false);
					downloadFileWithExtension(res.data, `all-industry-users.${exportType}`, exportType);
				} else {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				}
			})

			.catch((err) => {
				props.toggleSpinner(false);
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});
	}



	const checkModalBody = (
		<>
			{getSessionInfo("language") === "english" ? (
				<>
					<div className="row ml-auto">
						<Button className="text-right pr-2" color="link close" onClick={togglecheckModalState}>
							X
						</Button>
					</div>
					<div className="row text-center">
						<DeleteOutlineIcon className="col-12 mx-auto mb-3 mt-2" style={{ fontSize: "55" }} />
					</div>
					<div className="col-12 text-center">
						<h6 className="text-center">Are you sure you want to delete this?</h6>
					</div>
					<div className="col-12 text-center">
						<p className="text-center" style={{ overflow: "visible" }}>
							Be careful, if you click yes the following row will be deleted forever!
						</p>
					</div>
					<div className="col-12 text-center">
						<Button onClick={() => delete_rows(modalDetails)}>Yes</Button>
					</div>
				</>
			) : (
				// ARABIC modal body

				<div style={{ fontFamily: "cnam-ar", textAlign: "right" }}>
					<div className="row mr-auto">
						<Button className="text-left pl-2" color="link close" onClick={toggleModalState}>
							X
						</Button>
					</div>
					<div className="row text-center">
						<DeleteOutlineIcon className="col-12 mx-auto mb-3 mt-2" style={{ fontSize: "55" }} />
					</div>
					<div className="col-12 text-center">
						<h6 className="text-center">هل أنت متأكد أنك تريد حذف هذا؟</h6>
					</div>
					<div className="col-12 text-center">
						<p className="text-center" style={{ overflow: "visible" }}>
							!كن حذرا، إذا قمت بالنقر فوق "نعم" سيتم حذف الصف التالي إلى الأبد
						</p>
					</div>
					<div className="col-12 text-center">
						<Button onClick={() => delete_rows(modalDetails)}>نعم</Button>
					</div>
				</div>
			)}
		</>
	);

	const deactiavtedModalBody = (
		<>
			{/* <div className="row ml-auto">
				<Button className="ml-auto mr-4" color="link close" onClick={toggleModalState}>
					X
				</Button>
			</div> */}
			<div className="col-12 text-center">
				<p className="text-center" style={{ overflow: "visible", fontFamily: translate("cnam", "cnam-ar") }}>
					{translate("User Deleted", "تم حذف المستخدم")}
				</p>
			</div>
			<div className="col-12 text-center" style={{ fontFamily: translate("cnam", "cnam-ar") }}>
				<Button onClick={() => get_request()}>{translate("Ok", "نعم")}</Button>
			</div>
		</>
	);

	const actiavtedModalBody = (
		<>
			{/* <div className="row ml-auto">
				<Button className="ml-auto mr-4" color="link close" onClick={toggleModalState}>
					X
				</Button>
			</div> */}
			<div className="col-12 text-center">
				<p className="text-center" style={{ overflow: "visible" }}>
					User activated
				</p>
			</div>
			<div className="col-12 text-center">
				<Button onClick={() => get_request()}>Ok</Button>
			</div>
		</>
	);

	// FUNCTION TO FORMAT DATE

	const modalBody = (
		<>
			<div className="row ml-auto">
				<Button className="ml-auto mr-4" color="link close" onClick={toggleModalState}>
					X
				</Button>
			</div>
			<div className="row text-center">
				<DeleteOutlineIcon className="col-12 ml-auto mb-3 mt-2" style={{ fontSize: "50" }} />
			</div>
			<div className="col-12 text-center">
				<h6 className="text-center">Are you sure you want to delete this?</h6>
			</div>
			<div className="col-12 text-center">
				<p className="text-center" style={{ overflow: "visible" }}>
					Be careful, if you click yes the following row will be deleted forever!
				</p>
			</div>
			<div className="col-12 text-center">
				<Button onClick={() => delete_rows(modalDetails)}>Yes</Button>
			</div>
		</>
	);

	const activateUser = (industry_id) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			industryid: industry_id,
		};

		props.toggleSpinner(true);
		axios({
			method: "post",
			url: `${WS_LINK}activate_industry`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data !== "role error" && res.data !== "token error") {
					toggleActivatedModalState();
					props.toggleSpinner(false);
				} else {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				}
			})
			.catch((err) => {
				props.toggleSpinner(false);
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});
	};



	const activateUserBtn = (industry_id) => (
		<>
			<div className="d-flex flex-row justify-content-between">
				<Button
					onClick={() => activateUser(industry_id)}
					className="d-block o"
					style={{
						fontWeight: "600",
						background: "rgb(198 2 36)",
						padding: "0.6rem 2rem",
						border: "none",
						fontFamily: translate("cnam", "cnam-ar"),
					}}
				>
					{getSessionInfo("language") === "english" ? "Activate" : "تفعيل"}
				</Button>
				<button style={{ border: "none", background: "none", color: "#959595" }} onClick={(event) => checkDelete(industry_id)}>
					<DeleteOutlineIcon className="hov" style={{ fontSize: "25px", color: "rgb(198 2 36)" }} />
				</button>
			</div>
		</>
	);

	const deactivateUserBtn = (industry_id) => (
		<>
			<div className="d-flex" style={{ color: "#959595" }}>
				<p>Company Registration is missing</p>
				<div className={`${getSessionInfo("language") === "arabic" ? "mr-auto" : "ml-auto"}`}>
					<button style={{ border: "none", background: "none", color: "#959595" }} onClick={(event) => checkDelete(industry_id)}>
						<DeleteOutlineIcon className="hov" style={{ fontSize: "25px", color: "rgb(198 2 36)" }} />
					</button>
				</div>
			</div>
		</>
	);

	const LastIcons = (user_id, company, industry_id) => (
		<>
			<div className="d-flex" style={{ color: "#959595" }}>
				{/*       <div className=""><button style={{ border: 'none', background: 'none',color:'rgb(198 2 36)'  }} onClick={(e) =>{e.stopPropagation(); props.history.push('/discussion/' + btoa(encodeURIComponent(industry_id)))}} >View Discussions</button></div>
      <div className="ml-4"><button style={{ border: 'none', background: 'none',color:'rgb(198 2 36)'  }} onClick={(e) =>{e.stopPropagation(); props.history.push('/documents/' + btoa(encodeURIComponent(industry_id)))}}>View Documents</button></div>
      <div className="ml-4"><button style={{ border: 'none', background: 'none',color:'rgb(198 2 36)'  }} onClick={(e) =>{e.stopPropagation(); props.history.push('/company_users/' + btoa(encodeURIComponent(industry_id)))}}>View Users</button></div>
 */}
				<UncontrolledDropdown
					className={getSessionInfo("language") === "english" ? "ml-auto" : "mr-auto ml-2"}
					id={user_id}
					onClick={(e) => e.stopPropagation()}
				>
					<DropdownToggle className="drop-button" style={{ background: "transparent" }}>
						<EditIcon className="pb-2" style={{ fontSize: "23px", color: "rgb(198 2 36)" }} />
					</DropdownToggle>
					<DropdownMenu
						right={getSessionInfo("language") === "english" ? true : false}
						style={{ textAlign: getSessionInfo("language") === "arabic" ? "right" : "" }}
					>
						{getSessionInfo("language") === "english" ? (
							<div>
								<DropdownItem>
									<button
										style={{ border: "none", background: "none", color: "rgb(198 2 36)" }}
										onClick={(e) => {
											e.stopPropagation();
											props.history.push("/discussion/company/" + btoa(encodeURIComponent(industry_id)));
										}}
									>
										View Discussions
									</button>
								</DropdownItem>
								<hr />
								<DropdownItem>
									<button
										style={{ border: "none", background: "none", color: "rgb(198 2 36)" }}
										onClick={(e) => {
											e.stopPropagation();
											props.history.push("/documents/industry/" + btoa(encodeURIComponent(industry_id)));
										}}
									>
										View Documents
									</button>
								</DropdownItem>
								<hr />
								<DropdownItem>
									<button
										style={{ border: "none", background: "none", color: "rgb(198 2 36)" }}
										onClick={(e) => {
											e.stopPropagation();
											props.history.push("/company_users/" + btoa(encodeURIComponent(industry_id)));
										}}
									>
										View Users
									</button>
								</DropdownItem>
							</div>
						) : (
							<div>
								<DropdownItem>
									<button
										style={{ border: "none", background: "none", color: "rgb(198 2 36)", fontFamily: "cnam-ar", textAling: "right" }}
										onClick={(e) => {
											e.stopPropagation();
											props.history.push("/discussion/company/" + btoa(encodeURIComponent(industry_id)));
										}}
									>
										عرض المناقشات
									</button>
								</DropdownItem>
								<hr />
								<DropdownItem>
									<button
										style={{ border: "none", background: "none", color: "rgb(198 2 36)", fontFamily: "cnam-ar", textAling: "right" }}
										onClick={(e) => {
											e.stopPropagation();
											props.history.push("/documents/industry/" + btoa(encodeURIComponent(industry_id)));
										}}
									>
										عرض المستندات
									</button>
								</DropdownItem>
								<hr />
								<DropdownItem>
									<button
										style={{ border: "none", background: "none", color: "rgb(198 2 36)", fontFamily: "cnam-ar", textAling: "right" }}
										onClick={(e) => {
											e.stopPropagation();
											props.history.push("/company_users/" + btoa(encodeURIComponent(industry_id)));
										}}
									>
										عرض المستخدمين
									</button>
								</DropdownItem>
							</div>
						)}
					</DropdownMenu>
				</UncontrolledDropdown>
				{/*       <div><button style={{ border: 'none', background: 'none', color: '#959595' }} onClick={(event) => checkDelete(event, user_id)}><DeleteOutlineIcon className="hov" style={{ fontSize: "25px",color:'rgb(198 2 36)' }} /></button></div>
				 */}{" "}
			</div>
		</>
	);

	// delete document modal

	const jobTitle = (name, email) => (
		<div className={`d-flex align-items-center ${getSessionInfo("language") === "english" ? "ml-0" : "ml-2"}`}>
			<div className="" style={iconsStyle}>
				{name.charAt(0).toUpperCase()}
			</div>
		</div>
	);

	// the columns
	const cols = [
		// { key: 'icon', title: getSessionInfo('language') === 'english' ? ' NAME' : 'اسم', field: 'icon', cellStyle: { width: "5%", right: '5px' }, sorting: false },
		{
			key: "Name",
			title: getSessionInfo("language") === "english" ? " NAME" : "اسم",
			field: "Name",
			cellStyle: { whiteSpace: "pre-line", paddingLeft: 0 },
			render: (rowData) => (
				<div className="d-flex flex-row justify-content-start align-items-center">
					{rowData.Name.icon}
					<div className="pl-1">
						{rowData.Name.name} <br />
						<span style={{ color: "#6C6C6C" }}>{rowData.Name.email}</span>
					</div>
				</div>
			),
			customFilterAndSearch: (term, rowData) =>
				rowData.Name.name.toLowerCase().indexOf(term) !== -1 || rowData.Name.name.toLowerCase().indexOf(term) !== -1,
			customSort: (a, b) => a.Name.name.localeCompare(b.Name.name),
		},
		{ key: "industry_type", title: getSessionInfo("language") === "english" ? "INDUSTRY TYPE" : "نوع الصناعة", field: "industry_type" },
		{ key: "phone", title: getSessionInfo("language") === "english" ? "PHONE NUMBER" : "رقم الهاتف", field: "phone" },
		{ key: "headquarter", title: getSessionInfo("language") === "english" ? "HEADQUARTER" : "المركز الرئيسى", field: "headquarter" },
		{ key: "users", title: getSessionInfo("language") === "english" ? "NUMBER OF USERS" : "NUMBER OF USERS", field: "users" },
		{ key: "createdOn", title: getSessionInfo("language") === "english" ? "CREATED ON" : "تم إنشاؤها ", field: "createdOn", defaultSort: "desc" },
		{ key: "status", title: getSessionInfo("language") === "english" ? "" : "", field: "status", sorting: false },
	];

	const company_users_cols = [
		// { key: 'ficon', title: getSessionInfo('language') === 'english' ? " NAME" : "اسم", field: 'ficon', cellStyle: { width: "5%", left: '5px' }, sorting: false },
		{
			key: "Name",
			title: getSessionInfo("language") === "english" ? <span className="ml-2">NAME</span> : <span className="mr-2">اسم</span>,
			field: "Name",
			cellStyle: { whiteSpace: "pre-line", paddingLeft: 0 },
			render: (rowData) => (
				<div className="d-flex flex-row justify-content-start ml-2 align-items-center">
					{rowData.Name.icon}
					<div className="pl-1">
						{rowData.Name.name} <br />
						<span style={{ color: "#6C6C6C" }}>{rowData.Name.email}</span>
					</div>
				</div>
			),
			customFilterAndSearch: (term, rowData) =>
				rowData.Name.name.toLowerCase().indexOf(term) !== -1 || rowData.Name.name.toLowerCase().indexOf(term) !== -1,
			customSort: (a, b) => a.Name.name.localeCompare(b.Name.name),
		},
		{ key: "mobile", title: getSessionInfo("language") === "english" ? "MOBILE" : "التليفون المحمول", field: "mobile" },
		{
			key: "status",
			title: getSessionInfo("language") === "english" ? "STATUS" : "الحالة",
			field: "status",
			cellStyle: { textTransform: "capitalize" },
			render: (rowData) =>
				getSessionInfo("language") === "english" ? (
					<span style={{ color: rowData.status === "inactive" ? "red" : "green" }}>{rowData.status}</span>
				) : (
					<span style={{ fontFamily: "cnam-ar", color: rowData.status === "غير نشط" ? "red" : "green" }}>{rowData.status}</span>
				),
		},
		{ key: "createdOn", title: getSessionInfo("language") === "english" ? "CREATED ON" : "تم إنشاؤها ", field: "createdOn", defaultSort: "desc" },
		{ key: "icon", title: "", field: "icon", sorting: false },
	];

	const rows1 = [];

	if (typeof userObj.industry_details !== "undefined") {
		for (let i = 0; i < userObj.industry_details.length; i++) {
			let item = userObj.industry_details[i];
			rows1.push({
				key: item.industry_details_id,
				// icon: jobTitle(item.industry_details_company_name, item.industry_details_company_email),
				Name: {
					icon: jobTitle(item.industry_details_company_name, item.industry_details_company_email),
					name: item.industry_details_company_name,
					email: item.industry_details_company_email,
				},
				industry_type: item.industry_details_industry_type,
				phone: item.industry_detail_company_phone,
				createdOn: formatDate(item.created_at, true),
				headquarter: item.industry_details_headquarter,
				users: numberOfUsers.current[item.industry_details_id] || 0,
				status: LastIcons(item.user_id, true, item.industry_details_id),
			});
		}
	}

	const company_users_rows = [];

	for (let i = 0; i < activeindustryObj.industry_details.length; i++) {
		let item = activeindustryObj.industry_details[i];
		company_users_rows.push({
			key: item.user_id,
			// ficon: jobTitle(item.user_name, item.user_email),
			Name: { icon: jobTitle(item.user_name, item.user_email), name: item.user_name, email: item.user_username },
			mobile: item.user_mobile,
			createdOn: formatDate(item.created_date, true),
			status: getSessionInfo("language") === "arabic" ? "نشط" : "active",
			icon: deactivateUserBtn(item.user_id),
		});
	}

	// const inactive_companies_rows = [];

	for (let i = 0; i < inactiveindustryObj.industry_details.length; i++) {
		let item = inactiveindustryObj.industry_details[i];
		company_users_rows.push({
			key: item.user_id,
			// ficon: jobTitle(item.user_name, item.user_email),
			Name: { icon: jobTitle(item.user_name, item.user_email), name: item.user_name, email: item.user_username },
			mobile: item.user_mobile,
			createdOn: formatDate(item.created_date, true),
			status: getSessionInfo("language") === "arabic" ? "غير نشط" : "inactive",
			icon: activateUserBtn(item.user_id),
		});
	}



	const all_users_rows = allIndustryUsers.current.map(item => ({
		key: item.user_id,
		name: { name: item.user_name, id: item.user_id },
		username: item.user_username,
		email: item.user_email,
		company: item.industry_details_company_name
	}))


	return (
		<div className="BodyHeight w-100">
			<div className="scroll-in-body custom_scrollbar remove_scroll_mobile">
				<Modal name="deleteModal" modalState={modalState} changeModalState={toggleModalState} modalBody={modalBody} />
				<Modal
					name="activatedModal"
					modalState={activatedModalState}
					changeModalState={toggleActivatedModalState}
					modalBody={actiavtedModalBody}
				/>
				<Modal
					name="deactivatedModal"
					modalState={deactivatedModalState}
					changeModalState={toggledeactivatedModalState}
					modalBody={deactiavtedModalBody}
				/>
				<Modal name="checkModal" modalState={checkModalState} changeModalState={togglecheckModalState} modalBody={checkModalBody} />
				{/* <Modal name="exportModal" modalState={exportModalState} changeModalState={toggleExportModalState} modalBody={exportModalBody} /> */}
				<ExportModal type="industry" toggleState={toggleExportModalState} state={exportModalState} />
				{getSessionInfo("language") === "english" ? (
					<>
						{loaded && (
							<div className="tableWithEdit selectorTable w-100">
								{status === undefined && (
									<Table
										name="industry-users"
										key="industry-users"
										title={
											<div className=" text-nowrap ml-1 ml-md-0" style={{ fontFamily: "cnam-bold", fontSize: "1.15rem" }}>
												<div className="d-flex flex-row">
													<div>Companies</div>
													<div className="d-flex justify-content-end mr-2">
														<span
															className="ml-1 p-2 py-1 pointer"
															style={{
																height: "fit-content",
																border: "none",
																backgroundColor: "rgb(198 2 36)",
																color: "white",
																fontSize: "0.85rem",
																fontWeight: "500",
																fontFamily: "cnam",
																borderRadius: "5px",
															}}
															onClick={() => setExportModalState(true)}
														>
															Export logs
														</span>
													</div>
												</div>
											</div>
										}
										columns={cols}
										data={rows1}
										options={{
											pageSize: 10,
											emptyRowsWhenPaging: false,
											pageSizeOptions: [10, 15, 20],
											paging: true,
											sorting: true,
											selection: true,
											headerStyle: {
												fontSize: "12px",
												backgroundColor: "#F7F7F7",
												color: "#B3B3B3",
												paddingTop: "3px",
												paddingBottom: "3px",
												whiteSpace: "nowrap",
											},
											rowStyle: {
												fontSize: "0.9rem",
											},
										}}
										rowClick={(event, rowData) => {
											props.history.push(`/industry_details/${btoa(encodeURIComponent(rowData.key))}`);
										}}
										actions={[
											{
												tooltip: "Download as CSV",
												icon: () => (
													<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
														<img src={csv} alt="" style={{ width: "20px" }} />
														<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as CSV</span>
													</button>
												),
												onClick: (evt, data) => exportTable(data, "challenge", "csv", true),
											},
											{
												tooltip: "Download as PDF",
												icon: () => (
													<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
														<img src={pdf} alt="" style={{ width: "20px" }} />
														<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as PDF</span>
													</button>
												),
												onClick: (evt, data) => exportTable(data, "challenge", "pdf", true),
											},
										]}
									/>
								)}
								{(status === "active" || status === undefined) && (
									<Table
										name="inactive-industry-users"
										key="inactive-users"
										title={
											<div className=" text-nowrap ml-1 ml-md-0" style={{ fontFamily: "cnam-bold", fontSize: "1.15rem" }}>
												Inactive Industry Accounts ({company_users_rows.length})
											</div>
										}
										columns={company_users_cols}
										data={company_users_rows}
										options={{
											pageSize: 10,
											emptyRowsWhenPaging: false,
											pageSizeOptions: [10, 15, 20],
											paging: true,
											headerStyle: {
												fontSize: "12px",
												backgroundColor: "#F7F7F7",
												color: "#B3B3B3",
												paddingTop: "3px",
												paddingBottom: "3px",
												whiteSpace: "nowrap",
											},
											rowStyle: {
												fontSize: "0.9rem",
											},
										}}
									/>
								)}
								<Table
									name="all-industry-users"
									key="all-users"
									title={
										<div className=" text-nowrap ml-1 ml-md-0" style={{ fontFamily: "cnam-bold", fontSize: "1.15rem" }}>
											All Industry Accounts ({all_users_rows.length})
										</div>
									}
									columns={all_users_columns}
									data={all_users_rows}
									options={{
										pageSize: 10,
										emptyRowsWhenPaging: false,
										pageSizeOptions: [10, 15, 20],
										selection: true,
										paging: true,
										headerStyle: {
											fontSize: "12px",
											backgroundColor: "#F7F7F7",
											color: "#B3B3B3",
											paddingTop: "3px",
											paddingBottom: "3px",
											whiteSpace: "nowrap",
										},
										rowStyle: {
											fontSize: "0.9rem",
										},
									}}
									actions={[
										{
											tooltip: "Download as CSV",
											icon: () => (
												<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
													<img src={csv} alt="" style={{ width: "20px" }} />
													<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as CSV</span>
												</button>
											),
											onClick: (evt, data) => exportIndustryUsers(data, "csv"),
										},
										{
											tooltip: "Download as PDF",
											icon: () => (
												<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
													<img src={pdf} alt="" style={{ width: "20px" }} />
													<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as PDF</span>
												</button>
											),
											onClick: (evt, data) => exportIndustryUsers(data, "pdf"),
										},
									]}
								/>
							</div>
						)}
					</>
				) : (
					// --------------- ARABIC ----------------
					<div>
						<Modal name="deleteModal" modalState={modalState} changeModalState={toggleModalState} modalBody={modalBody} />

						{loaded && (
							<div className="tableWithEdit table-arabic selectorTable w-100">
								{status === undefined && (
									<Table
										name="industry-users"
										key="industry-users"
										title={
											<div className=" d-flex flex-row" style={{ fontFamily: "cnam-bold-ar", fontSize: "1.15rem" }}>
												<p>شركات</p>

												<span
													className="mr-1 p-2 py-1 pointer"
													style={{
														height: "fit-content",
														border: "none",
														backgroundColor: "rgb(198 2 36)",
														color: "white",
														fontSize: "0.85rem",
														fontWeight: "500",
														borderRadius: "5px",
													}}
													onClick={() => setExportModalState(true)}
												>
													تصدير سجلات
												</span>
											</div>
										}
										columns={cols}
										data={rows1}
										options={{
											pageSize: 10,
											emptyRowsWhenPaging: false,
											pageSizeOptions: [10, 15, 20],
											paging: true,
											selection: true,
											headerStyle: {
												fontSize: "12px",
												backgroundColor: "#F7F7F7",
												color: "#B3B3B3",
												paddingTop: "3px",
												paddingBottom: "3px",
												whiteSpace: "nowrap",
												fontFamily: "cnam-ar",
											},
											rowStyle: {
												fontSize: "0.9rem",
												textAlign: "right",
											},
										}}
										rowClick={(event, rowData) => {
											props.history.push(`/industry_details/${btoa(encodeURIComponent(rowData.key))}`);
										}}
										actions={[
											{
												tooltip: "تحميل csv.",
												icon: () => (
													<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
														<img src={csv} alt="" style={{ width: "20px" }} />
														<span style={{ fontSize: "13px", fontWeight: "bold", fontFamily: "cnam-ar" }}>
															{" "}
															تحميل <span style={{ fontFamily: "cnam" }}>CSV</span>.
														</span>
													</button>
												),
												onClick: (evt, data) => exportTable(data, "challenge", "csv", true),
											},
											{
												tooltip: "تحميل PDF.",
												icon: () => (
													<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
														<img src={pdf} alt="" style={{ width: "20px" }} />
														<span style={{ fontSize: "13px", fontWeight: "bold", fontFamily: "cnam-ar" }}>
															تحميل <span style={{ fontFamily: "cnam" }}>PDF</span>
														</span>
													</button>
												),
												onClick: (evt, data) => exportTable(data, "challenge", "pdf", true),
											},
										]}
									/>
								)}
								{(status === "active" || status === undefined) && (
									<Table
										name="inactive-industry-users"
										key="inactive-users"
										title={
											<div className=" text-nowrap" style={{ fontFamily: "cnam-bold-ar", fontSize: "1.15rem" }}>
												مستخدمي المنشأة
											</div>
										}
										columns={company_users_cols}
										data={company_users_rows}
										options={{
											pageSize: 10,
											emptyRowsWhenPaging: false,
											pageSizeOptions: [10, 15, 20],
											selection: true,
											paging: true,
											headerStyle: {
												fontSize: "12px",
												backgroundColor: "#F7F7F7",
												color: "#B3B3B3",
												paddingTop: "3px",
												paddingBottom: "3px",
												whiteSpace: "nowrap",
												fontFamily: "cnam-ar",
											},
											rowStyle: {
												fontSize: "0.9rem",
											},
										}}
										actions={[
											{
												tooltip: "تحميل csv.",
												icon: () => (
													<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
														<img src={csv} alt="" style={{ width: "20px" }} />
														<span style={{ fontSize: "13px", fontWeight: "bold", fontFamily: "cnam-ar" }}>
															{" "}
															تحميل <span style={{ fontFamily: "cnam" }}>CSV</span>.
														</span>
													</button>
												),
												onClick: (evt, data) => exportTable(data, "challenge", "csv", false),
											},
											{
												tooltip: "تحميل PDF.",
												icon: () => (
													<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
														<img src={pdf} alt="" style={{ width: "20px" }} />
														<span style={{ fontSize: "13px", fontWeight: "bold", fontFamily: "cnam-ar" }}>
															تحميل <span style={{ fontFamily: "cnam" }}>PDF</span>
														</span>
													</button>
												),
												onClick: (evt, data) => exportTable(data, "challenge", "pdf", false),
											},
										]}
									/>
								)}
								<Table
									name="all-industry-users"
									key="all-users"
									title={
										<div className=" text-nowrap ml-1 ml-md-0" style={{ fontFamily: "cnam-bold", fontSize: "1.15rem" }}>
											جميع حسابات الصناعة ({all_users_rows.length})
										</div>
									}
									columns={all_users_columns}
									data={all_users_rows}
									options={{
										pageSize: 10,
										emptyRowsWhenPaging: false,
										pageSizeOptions: [10, 15, 20],
										selection: true,
										paging: true,
										headerStyle: {
											fontSize: "12px",
											backgroundColor: "#F7F7F7",
											color: "#B3B3B3",
											paddingTop: "3px",
											paddingBottom: "3px",
											whiteSpace: "nowrap",
										},
										rowStyle: {
											fontSize: "0.9rem",
										},
									}}
									actions={[
										{
											tooltip: "Download as CSV",
											icon: () => (
												<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
													<img src={csv} alt="" style={{ width: "20px" }} />
													<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as CSV</span>
												</button>
											),
											onClick: (evt, data) => exportIndustryUsers(data, "csv"),
										},
										{
											tooltip: "Download as PDF",
											icon: () => (
												<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
													<img src={pdf} alt="" style={{ width: "20px" }} />
													<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as PDF</span>
												</button>
											),
											onClick: (evt, data) => exportIndustryUsers(data, "pdf"),
										},
									]}
								/>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}





	// const deactivateUser = (industry_id) => {
	// 	const cancelToken = axios.CancelToken;
	// 	const source = cancelToken.source();

	// 	const postedData = {
	// 		userid: getSessionInfo("id"),
	// 		token: getSessionInfo("token"),
	// 		id_to_delete: industry_id,
	// 	};

	// 	props.toggleSpinner(true);
	// 	axios({
	// 		method: "post",
	// 		url: `${WS_LINK}deactivate_user1`,
	// 		data: postedData,
	// 		cancelToken: source.token,
	// 	})
	// 		.then((res) => {
	// 			console.log(res.data)
	// 			if (res.data !== "role error" && res.data !== "token error") {
	// 				toggledeactivatedModalState();
	// 				props.toggleSpinner(false);
	// 			} else {
	// 				clearSessionInfo();
	// 				window.location.reload(false).then(props.history.replace("/"));
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			props.toggleSpinner(false);
	// 			if (axios.isCancel(err)) {
	// 				console.log("request canceled");
	// 			} else {
	// 				console.log("request failed");
	// 			}
	// 		});
	// };

// const checkDelete = (event, del) => {
//   event.stopPropagation()
//   setModalDetails({
//     del: del,
//   })
//   setModalState(true)
// }

// const active_companies_cols = [
// 	// { key: 'ficon', title: getSessionInfo('language') === 'english' ? " NAME" : "اسم", field: 'ficon', cellStyle: { width: "5%", left: '5px' }, sorting: false },
// 	{
// 		key: "Name",
// 		title: getSessionInfo("language") === "english" ? " NAME" : "اسم",
// 		field: "Name",
// 		cellStyle: { whiteSpace: "pre-line", paddingLeft: 0 },
// 		render: (rowData) => (
// 			<div className="d-flex flex-row justify-content-start align-items-center">
// 				{rowData.Name.icon}
// 				<div className="pl-1">
// 					{rowData.Name.name} <br />
// 					<span style={{ color: "#6C6C6C" }}>{rowData.Name.email}</span>
// 				</div>
// 			</div>
// 		),
// 		customFilterAndSearch: (term, rowData) => rowData.Name.name.toLowerCase().indexOf(term) !== -1 || rowData.Name.name.toLowerCase().indexOf(term) !== -1,
// 		customSort: (a, b) => a.Name.name.localeCompare(b.Name.name),
// 	},
// 	{ key: "mobile", title: getSessionInfo("language") === "english" ? "MOBILE" : "التليفون المحمول", field: "mobile" },
// 	{ key: "createdOn", title: getSessionInfo("language") === "english" ? "CREATED ON" : "تم إنشاؤها ", field: "createdOn", defaultSort: "desc" },
// ];

/* {(status === 'inactive' || status === undefined) &&
								<Table
									name="inactive-industry-users"
									key="inactive-users"
									title={
										<div className=" text-nowrap ml-1 ml-md-0" style={{ fontFamily: "cnam-bold", fontSize: "1.15rem" }}>
											Inactive company users
										</div>
									}
									columns={inactive_companies_cols}
									data={inactive_companies_rows}
									options={{
										pageSize: 5,
										emptyRowsWhenPaging: false,
										pageSizeOptions: [5, 10],
										paging: true,
										selection: true,
										headerStyle: {
											fontSize: "12px",
											backgroundColor: "#F7F7F7",
											color: "#B3B3B3",
											paddingTop: "3px",
											paddingBottom: "3px",
											whiteSpace: "nowrap",
										},
										rowStyle: {
											fontSize: "0.9rem",
										},
									}}
									actions={[
										{
											tooltip: "Download as CSV",
											icon: () => (
												<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
													<img src={csv} alt="" style={{ width: "20px" }} />
													<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as CSV</span>
												</button>
											),
											onClick: (evt, data) => exportTable(data, "challenge", "csv", false),
										},
										{
											tooltip: "Download as PDF",
											icon: () => (
												<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
													<img src={pdf} alt="" style={{ width: "20px" }} />
													<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as PDF</span>
												</button>
											),
											onClick: (evt, data) => exportTable(data, "challenge", "pdf", false),
										},
									]}
								/>
							} */

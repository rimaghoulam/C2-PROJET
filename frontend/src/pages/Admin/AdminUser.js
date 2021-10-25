import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { useParams } from 'react-router';

import { WS_LINK } from "../../globals";
import { formatDate, downloadFileWithExtension } from "../../functions";
import { getSessionInfo, clearSessionInfo } from "../../variable";

import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import InputText from "../../components/InputText/InputText";

import ExportModal from "../../components/PageModals/exportCompanyModal";

import { Button } from "reactstrap";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { MTableBodyRow } from "material-table";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import check from "../../assets/images_png/check.png";
import headerLogo from "../../assets/images_png/header_logo.png";

import pdf from "../../assets/images_svg/pdf.svg";
import csv from "../../assets/images_svg/csv.svg";

import "../../App.css";
import "./AdminUser.css";
import "../../components/Table/Table.css";

export default function AdminUsers(props) {



	let { status } = useParams();
	if (status !== undefined) status = decodeURIComponent(atob(status));

	const [exportModalState, setExportModalState] = useState(false);

	const toggleExportModalState = () => {
		setExportModalState(!exportModalState);
	};




	// styles
	const iconsStyle = {
		background: "#ccf0eb",
		borderRadius: "13%",
		display: "flex",
		fontSize: "18px",
		alignItems: "center",
		justifyContent: "center",
		width: "2.3rem",
		height: "2.3rem",
	};

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: "",
			password: "",
		},
	});

	// the states
	const [exist, setExist] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [errorDeleteModal, setErrorDeleteModal] = useState(false);
	const [addModal, setAddModal] = useState(false);
	const [successModal, setSuccessModal] = useState(false);
	const [modalDetails, setModalDetails] = useState({
		del: "",
	});
	const [userObj, setUserObj] = useState({
		cnam_details: "",
		industry_details: "",
	});
	const [loaded, setLoaded] = useState(false);

	//set states
	const toggleErrorDeleteModal = () => {
		setErrorDeleteModal(!errorDeleteModal);
	};

	const toggledelete = () => {
		setDeleteModal(!deleteModal);
	};
	const toggleadd = () => {
		setAddModal(!addModal);
	};
	const togglesuccess = () => {
		setSuccessModal(!successModal);
	};

	const checkDelete = (event, del) => {
		event.stopPropagation();
		setModalDetails({
			del: del,
		});
		setDeleteModal(true);
	};

	// fill page on creation
	useEffect(() => {

		props.setPageTitle('cnam Users', 'مجلد المستخدمين')
		get_request();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/////////// function add user
	const add_user = (data) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			adminid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			industryid: 0,
			name: data.name,
			email: data.email,
		};
		props.toggleSpinner(true);

		axios({
			method: "post",
			url: `${WS_LINK}admin_add_new_user`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data !== "role error" && res.data !== "token error") {
					if (res.data === "user email already existe") setExist(true);
					else {
						toggleadd();
						togglesuccess();
						reset();
					}
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

	const exportTable = (data, users_id, exportType) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		let users = [];
		for (let i = 0; i < data.length; i++) {
			users[i] = data[i].key;
		}

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			toe: exportType,
			users_id: users,
		};

		props.toggleSpinner(true);
		axios({
			method: "post",
			url: `${WS_LINK}export_user`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 4 && res.data !== "token error") {
					props.toggleSpinner(false);
					downloadFileWithExtension(res.data, `cnam-users.${exportType}`, exportType);
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

	const get_request = () => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
		};
		props.toggleSpinner(true);

		axios({
			method: "post",
			url: `${WS_LINK}get_all_users`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 4 && res.data !== "token error") {
					let industry = res.data[1];
					let cnam

					switch (status) {
						case 'active':
							cnam = res.data[0].filter(item => item.user_active === 1 && item)
							break
						case 'inactive':
							cnam = res.data[0].filter(item => item.user_active === 3 && item)
							break
						default:
							cnam = res.data[0]
							break
					}



					setUserObj({ ...userObj, industry_details: industry, cnam_details: cnam });
					props.toggleSpinner(false);
					setLoaded(true);
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

	// function to delete a user
	const delete_rows = (info) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			id_to_delete: info.del,
		};

		setDeleteModal(false);
		props.toggleSpinner(true);
		axios({
			method: "post",
			url: `${WS_LINK}deactivate_user`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 4 && res.data !== "token error") {
					if (res.data === "no") {
						toggleErrorDeleteModal();
						props.toggleSpinner(false);
					} else {
						get_request();
						setDeleteModal(false);
						setModalDetails({
							del: "",
						});
						setTimeout(() => {
							props.toggleSpinner(false);
						}, 1000);
					}
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

	// ///////////////////////////////////////////// MODALS

	// could not delete user

	const errorDeleteModalBody = (
		<>
			{getSessionInfo("language") === "arabic" ? (
				<div className="col-12 text-center">
					<DeleteForeverIcon style={{ fontSize: "35px" }} className="my-2" />
					<p style={{ fontFamily: "cnam-ar" }}>تم تعيين هذا المستخدم للتحديات النشطة أو التدريب الداخلي</p>
					<p style={{ fontFamily: "cnam-ar" }}>!يرجى تغيير المحال قبل الحذف</p>
					<Button className="px-4" onClick={toggleErrorDeleteModal} style={{ fontFamily: "cnam-ar" }}>
						حسنا
					</Button>
				</div>
			) : (
				<div className="col-12 text-center">
					<DeleteForeverIcon style={{ fontSize: "35px" }} className="my-2" />
					<p>This user is assigned to active challenges or internships</p>
					<p>Please change the assignee before deleting!</p>
					<Button className="px-4" onClick={toggleErrorDeleteModal}>
						OK
					</Button>
				</div>
			)}
		</>
	);

	// add user modal
	const modalBody = (
		<>
			{getSessionInfo("language") === "english" ? (
				<>
					<div className="row ml-auto">
						<Button
							className="ml-auto mr-4"
							style={{ width: '50px' }}
							color="link close"
							onClick={() => {
								toggleadd();
								reset();
								setExist(false);
							}}
						>
							X
						</Button>
					</div>
					<div className="col-12 text-center">
						<h6 className="text-center">
							<div className="text-center">
								<div>
									<img src={headerLogo} width="100%" alt="" />
								</div>
								<form onSubmit={handleSubmit(add_user)}>
									<div className=" mt-4 mb-4">
										<div className="mt-3 col-12" style={{ textAlign: "left" }}>
											Name *
										</div>
										<div className="col-12 mt-3">
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														value={value}
														onChange={(e) => {
															onChange(e);
														}}
														style={{ border: errors.name ? "1px solid red" : "" }}
														placeholder="Name"
													/>
												)}
												rules={{ required: true }}
												name="name"
												control={control}
											/>
											{errors.name && errors.name.type === "required" && <span className="errors">Name is required.</span>}
										</div>
										<div className="mt-3 col-12" style={{ textAlign: "left" }}>
											Email*
										</div>
										<div className="col-12 mt-3">
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														value={value}
														onChange={(e) => {
															onChange(e);
															setExist(false);
														}}
														style={{ border: errors.email || exist ? "1px solid red" : "" }}
														placeholder="Email"
													/>
												)}
												rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
												name="email"
												control={control}
											/>
											{errors.email && errors.email.type === "required" && <span className="errors">Email is required.</span>}
											{errors.email && errors.email.type === "pattern" && <span className="errors">Email is not valid</span>}
											{exist && <span className="errors">Email is already taken</span>}
										</div>
									</div>
									<Button
										type="submit"
										className="px-4 mt-3"
										style={{
											backgroundColor: "rgb(198 2 36)",
											border: "none",
											fontSize: "0.9rem",
											padding: "0.7rem 2.4rem",
											fontWeight: "600",
											float: "right",
										}}
									>
										Submit
									</Button>
								</form>
							</div>
						</h6>
					</div>
				</>
			) : (
				// ARABIC MOADL BODY

				<>
					<div className="row mr-auto">
						<Button
							className="mr-auto ml-4"
							style={{ width: '50px' }}
							color="link close"
							onClick={() => {
								toggleadd();
								reset();
								setExist(false);
							}}
						>
							X
						</Button>
					</div>
					<div className="col-12 text-center text-right" style={{ fontFamily: "cnam-ar" }}>
						<h6 className="text-center">
							<div className="text-center">
								<div>
									<img src={headerLogo} width="100%" alt="" />
								</div>
								<form onSubmit={handleSubmit(add_user)}>
									<div className=" mt-4 mb-4">
										<div className="mt-3 col-12" style={{ textAlign: "right" }}>
											اسم *
										</div>
										<div className="col-12 mt-3 text-right" style={{ direction: "rtl" }}>
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														value={value}
														onChange={(e) => {
															onChange(e);
														}}
														style={{ border: errors.name ? "1px solid red" : "" }}
														placeholder="اسم"
													/>
												)}
												rules={{ required: true }}
												name="name"
												control={control}
											/>
											{errors.name && errors.name.type === "required" && <span className="errors">مطلوب اسم.</span>}
										</div>
										<div className="mt-3 col-12" style={{ textAlign: "right" }}>
											بريد إلكتروني*
										</div>
										<div className="col-12 mt-3 text-right" style={{ direction: "rtl" }}>
											<Controller
												render={({ field: { onChange, value } }) => (
													<InputText
														value={value}
														onChange={(e) => {
															onChange(e);
															setExist(false);
														}}
														style={{ border: errors.email || exist ? "1px solid red" : "", direction: "ltr", textAlign: "right" }}
														placeholder="بريد إلكتروني"
													/>
												)}
												rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
												name="email"
												control={control}
											/>
											{errors.email && errors.email.type === "required" && <span className="errors text-right">البريد الالكتروني مطلوب.</span>}
											{errors.email && errors.email.type === "pattern" && <span className="errors text-right">البريد الإلكتروني غير صالح</span>}
											{exist && <span className="errors">تم إستلام البريد الإلكتروني</span>}
										</div>
									</div>
									<Button
										type="submit"
										className="px-4 mt-3"
										style={{
											backgroundColor: "rgb(198 2 36)",
											border: "none",
											fontSize: "0.9rem",
											padding: "0.7rem 2.4rem",
											fontWeight: "600",
											float: "left",
										}}
									>
										إرسال
									</Button>
								</form>
							</div>
						</h6>
					</div>
				</>
			)}
		</>
	);

	// delete document modal
	const modaldelete = (
		<>
			{getSessionInfo("language") === "english" ? (
				<>
					<div className="row ml-auto">
						<Button style={{ width: '50px' }} className="ml-auto mr-4" color="link close" onClick={toggledelete}>
							X
						</Button>
					</div>
					<div className="row justify-content-center text-center">
						<DeleteOutlineIcon className="col-12 text-center mb-3 mt-2" style={{ fontSize: "50" }} />
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
				// ARABIC DELETE MODAL

				<>
					<div className="row mr-auto">
						<Button style={{ width: '50px' }} className="mr-auto ml-4" color="link close" onClick={toggledelete}>
							X
						</Button>
					</div>
					<div className="row text-center">
						<DeleteOutlineIcon className="col-12 mr-auto mb-3 mt-2" style={{ fontSize: "50" }} />
					</div>
					<div className="col-12 text-center" style={{ fontFamily: "cnam-ar" }}>
						<h6 className="text-center">هل أنت متأكد أنك تريد حذف هذا؟</h6>
					</div>
					<div className="col-12 text-center" style={{ fontFamily: "cnam-ar" }}>
						<p className="text-center" style={{ overflow: "visible" }}>
							كن حذرا، إذا قمت بالنقر فوق "نعم" سيتم حذف الصف التالي إلى الأبد!
						</p>
					</div>
					<div className="col-12 text-center">
						<Button onClick={() => delete_rows(modalDetails)}>نعم</Button>
					</div>
				</>
			)}
		</>
	);

	const modalsuccess = (
		<>
			{getSessionInfo("language") === "english" ? (
				<>
					<div className="row  ">
						<Button
							className="ml-auto mr-3"
							style={{ width: '10px' }}
							color="link close"
							onClick={() => {
								togglesuccess();
								get_request();
							}}
						>
							X
						</Button>
					</div>

					<div className="col-12 text-center">
						<h6 className="text-center">
							<div className="text-center">
								{/* <div><CheckCircleOutlineIcon className="" style={{ fontSize: "50", color: 'rgb(198 2 36)' }} /></div> */}
								<div>
									<img className="" src={check} alt="img" width={75} />
								</div>
								<div className="font-weight-bold mt-4 mb-4">Email sent </div>
								<div className="text-center"></div>
							</div>
						</h6>
					</div>
				</>
			) : (
				// ARABIC SUCCESS MODAL

				<>
					<div className="row  ">
						<Button
							className="mr-auto ml-3"
							style={{ width: '50px' }}
							color="link close"
							onClick={() => {
								togglesuccess();
								get_request();
							}}
						>
							X
						</Button>
					</div>

					<div className="col-12 text-center">
						<h6 className="text-center">
							<div className="text-center">
								{/* <div><CheckCircleOutlineIcon className="" style={{ fontSize: "50", color: 'rgb(198 2 36)' }} /></div> */}
								<div>
									<img className="" src={check} alt="img" width={75} />
								</div>
								<div className="mt-4 mb-4" style={{ fontFamily: "cnam-bold-ar" }}>
									أرسل البريد الإلكتروني
								</div>
								<div className="text-center"></div>
							</div>
						</h6>
					</div>
				</>
			)}
		</>
	);

	// const LastIcons = (del, company, industry_id) =>
	// <>
	//   <div className="d-flex" style={{ color: '#959595' }}>
	//   <div className=""><button style={{ border: 'none', background: 'none',color:'rgb(198 2 36)'  }} onClick={(e) =>{e.stopPropagation(); props.history.push('/discussion/' + btoa(encodeURIComponent(industry_id)))}} >View Discussions</button></div>
	//   <div className="ml-4"><button style={{ border: 'none', background: 'none',color:'rgb(198 2 36)'  }} onClick={(e) =>{e.stopPropagation(); props.history.push('/documents/' + btoa(encodeURIComponent(industry_id)))}}>View Documents</button></div>

	//     <div className="ml-auto"><button style={{ border: 'none', background: 'none', color: '#959595' }} onClick={(event) => checkDelete(event, del)}><DeleteOutlineIcon className="hov" style={{ fontSize: "25px",color:'rgb(198 2 36)' }} /></button></div>

	//   </div>
	// </>

	const LastIcons2 = (del, company) => (
		<>
			<div className="d-flex" style={{ color: "#959595" }}>
				<div className={`${getSessionInfo("language") === "arabic" ? "mr-auto" : "ml-auto"}`}>
					<button style={{ border: "none", background: "none", color: "#959595" }} onClick={(event) => checkDelete(event, del)}>
						<DeleteOutlineIcon className="hov" style={{ fontSize: "25px", color: "rgb(198 2 36)" }} />
					</button>
				</div>
			</div>
		</>
	);

	const jobTitle = (name, email) => (
		<div className="d-flex">
			<div className={getSessionInfo('language') === 'english' ? '' : 'ml-1'} style={iconsStyle}>
				{name.charAt(0).toUpperCase()}
			</div>
			{/*  <div className="ml-3">
        <div className="text-nowrap" style={{ fontSize:'0.9rem' }}>{name}</div>
        <div style={{ color: "#848484",fontSize:'0.9rem' }}>{email}</div>
      </div> */}
		</div>
	);

	// the columns

	const cols1 = [
		// { key: 'ficon', title: getSessionInfo('language') === 'english' ? " NAME" : "اسم", field: 'ficon', cellStyle: { width: "5%", left: '5px' }, sorting: false },
		{
			key: "Name",
			title: getSessionInfo("language") === "english" ? " NAME" : "اسم",
			field: "Name",
			cellStyle: { whiteSpace: "pre-line" },
			render: (rowData) => (
				<div className="d-flex flex-row justify-content-start align-items-center">
					{rowData.Name.icon}
					<div className="pl-1">
						{rowData.Name.name} <br />
						<span style={{ color: "#6C6C6C" }}>{rowData.Name.email}</span>
					</div>
				</div>
			),
			customFilterAndSearch: (term, rowData) => rowData.Name.name.toLowerCase().indexOf(term) !== -1 || rowData.Name.name.toLowerCase().indexOf(term) !== -1,
			customSort: (a, b) => a.Name.name.localeCompare(b.Name.name),
		},
		{ key: "mobile", title: getSessionInfo("language") === "english" ? "MOBILE" : "التليفون المحمول", field: "mobile" },
		{ key: "role", title: getSessionInfo("language") === "english" ? "ROLE" : "وظيفة", field: "role" },
		{ key: "department", title: getSessionInfo("language") === "english" ? "DEPARTMENT" : "القسم", field: "department" },
		{
			key: "status",
			title: getSessionInfo("language") === "english" ? "STATUS" : "الحالة",
			field: "status",
			cellStyle: { textTransform: "capitalize" },
			render: (rowData) => <span style={{ color: rowData.status === "inactive" ? "red" : "black" }}>{rowData.status}</span>,
			customFilterAndSearch: (term, rowData) => rowData.status.toLowerCase().indexOf(term) !== -1,
		},
		{ key: "createdOn", title: getSessionInfo("language") === "english" ? "CREATED ON" : "تم إنشاؤها ", field: "createdOn", defaultSort: "desc" },
		{ key: "icon", title: "", field: "icon", sorting: false },
	];

	/* const cols = [
	{ key: 'icon', field: 'icon',title:'',cellStyle:{width:"5%", position:'sticky', left:'20px'}},
	{ key: 'Name',title: 'NAME', field: 'Name', cellStyle:{whiteSpace:'pre-line'},
	render: rowData => <div >{rowData.Name.props.children[0]}<br/> <span style={{color:'#6C6C6C'}}>{rowData.Name.props.children[1].props.children}</span></div>,
	customFilterAndSearch: (term, rowData) => (rowData.Name.props.children[0].toLowerCase()).indexOf(term) !== -1 || (rowData.Name.props.children[1].props.children).indexOf(term) !== -1
  
	},
	{ key: 'mobile',title: 'MOBILE', field: 'mobile', },
	{ key: 'createdOn',title: 'CREATED ON', field: 'createdOn', },
	{ key: 'role',title: 'ROLE', field: 'role', },
	{ key: 'Company',title: 'COMPANY', field: 'Company', },
	{ key: 'status',title: '', field: 'status', },
    
  ] */

	const rows2 = [];
	if (typeof userObj.cnam_details !== "undefined") {
		for (let i = 0; i < userObj.cnam_details.length; i++) {
			let item = userObj.cnam_details[i];
			rows2.push({
				key: item.user_id,
				roleid: item.user_role_role_id,
				// ficon: jobTitle(item.user_name, item.user_email),
				Name: { icon: jobTitle(item.user_name, item.user_email), name: item.user_name, email: item.user_email },
				mobile: item.user_mobile,
				createdOn: formatDate(item.created_date, true),
				role: item.user_role,
				department: item.user_department,
				status: item.user_active === 3 ? "inactive" : "active",
				icon: item.user_active === 3 ? LastIcons2(item.user_id, false) : '',
			});
		}
	}
	// console.log(rows2[0].Name.props.children[1].props.children[0].props.children)

	/*  const rows1 = []
 
   if (typeof userObj.industry_details !== 'undefined') {
	 for (let i = 0; i < userObj.industry_details.length; i++) {
	   let item = userObj.industry_details[i]
	   rows1.push(
		 {
		   key: item.user_id,
		   roleid: item.user_role_role_id,
		   icon: jobTitle(item.user_name),
		   Name: <div>{item.user_name}<span style={{color:'grey'}}>{item.user_email}</span></div>,
		   mobile: item.user_mobile,
		   createdOn: formatDate(item.created_at),
		   role: item.user_role,
		   Company: item.industry_details_company_name,
		   status: item.user_active === 1 && LastIcons(item.user_id, true,item.industry_details_id)
		 }
	   )
	 }
   } */

	return (
		<>
			{getSessionInfo("language") === "english" ? (
				<>
					<div className="" style={{ width: '100%', height: "calc(100vh - 118px)", overflowY: "auto" }}>
						<div>
							{errorDeleteModal && <Modal name="errorDeleteModal" modalState={errorDeleteModal} changeModalState={toggleErrorDeleteModal} modalBody={errorDeleteModalBody} />}

							{deleteModal && <Modal name="deleteModal" modalState={deleteModal} changeModalState={toggledelete} modalBody={modaldelete} />}
							{addModal && <Modal name="addModal" modalState={addModal} changeModalState={toggleadd} modalBody={modalBody} />}
							{successModal && <Modal id="success" name="successModal" modalState={successModal} changeModalState={togglesuccess} modalBody={modalsuccess} />}
							<ExportModal type="user" toggleState={toggleExportModalState} state={exportModalState} />

							{/* const MyTable = props => {   return <MaterialTable     components={{       Row: rowProps => <MTableBodyRow {...rowProps} onMouseEnter={eventHandler} />     }}     ... more material table props   />; } */}

							{loaded && (
								<div className="selectorTable">
									<Table
										name="cnam-user"
										key="cnam-users"
										title={
											<div className=" text-nowrap ml-1 ml-md-0" style={{ fontFamily: "cnam-bold", fontSize: "1.15rem" }}>
												<div className="d-flex flex-row">
													<div>cnam Users</div>
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
										columns={cols1}
										components={{
											Row: (rowProps) => (
												<MTableBodyRow
													{...rowProps}
													onMouseEnter={(e) => {
														if (e.target.parentElement.getElementsByTagName("td")[4] && e.target.parentElement.getElementsByTagName("td")[4].innerText === "Inactive") e.target.parentElement.style.cursor = "default";
													}}
												/>
											),
										}}
										data={rows2}
										options={{
											pageSize: 10,
											emptyRowsWhenPaging: false,
											pageSizeOptions: [10, 15, 20],

											selection: true,
											// rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '' }),
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
												cursor: "default !important",
											},
										}}
										rowClick={(event, rowData) => {
											if (rowData.status !== "inactive") props.history.push(`/user_details/${btoa(encodeURIComponent(rowData.key))}`);
										}}
										actions={[
											{
												tooltip: "",
												position: "toolbar",
												icon: () => (
													<div>
														<Button className="d-block o" style={{ fontWeight: "600", background: "rgb(198 2 36)", padding: "0.6rem 2rem", border: "none" }}>
															+ Add Users
														</Button>
													</div>
												),
												onClick: () => toggleadd(),
											},
											{
												tooltip: "Download as CSV",
												icon: () => (
													<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
														<img src={csv} alt="" style={{ width: "20px" }} />
														<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as CSV</span>
													</button>
												),
												onClick: (evt, data) => exportTable(data, "challenge", "csv"),
											},
											{
												tooltip: "Download as PDF",
												icon: () => (
													<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
														<img src={pdf} alt="" style={{ width: "20px" }} />
														<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as PDF</span>
													</button>
												),
												onClick: (evt, data) => exportTable(data, "challenge", "pdf"),
											},
										]}
									/>
								</div>
							)}

							{/*   loaded &&
            
                  <Table
                    name='industry-users'
                    key='industry-users'
                    title={<div className="font-weight-bold text-nowrap" style={{ fontSize: '17px' }}>Industry Users</div>}
                    columns={cols}
                    data={rows1}
                    options={{
                      pageSize: 5,
                      emptyRowsWhenPaging: false,
                      pageSizeOptions: [5, 10],
            
                      // selection: true,
                      // rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '' }),
                      paging: true,
                      headerStyle:
                      {
                        fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                        paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap'
                      },
                     // rowStyle: {
                     //   fontSize: '0.9rem',
                     // }
                    }}
            
                    rowClick={(event, rowData) => {
                      props.history.push(`/user_details/${btoa(encodeURIComponent(rowData.key))}/${btoa(encodeURIComponent(rowData.roleid))}`)
                    }}
            
                  /> */}
						</div>
					</div>
				</>
			) : (
				//---------ARABIC---------

				<>
					<div className="text-right w-100" style={{ height: "calc(100vh - 118px)", overflowY: "auto" }}>
						<div className="text-right w-100">
							{errorDeleteModal && <Modal name="errorDeleteModal" modalState={errorDeleteModal} changeModalState={toggleErrorDeleteModal} modalBody={errorDeleteModalBody} />}

							{deleteModal && <Modal name="deleteModal" modalState={deleteModal} changeModalState={toggledelete} modalBody={modaldelete} />}
							{addModal && <Modal name="addModal" modalState={addModal} changeModalState={toggleadd} modalBody={modalBody} />}
							{successModal && <Modal id="success" name="successModal" modalState={successModal} changeModalState={togglesuccess} modalBody={modalsuccess} />}

							{/* const MyTable = props => {   return <MaterialTable     components={{       Row: rowProps => <MTableBodyRow {...rowProps} onMouseEnter={eventHandler} />     }}     ... more material table props   />; } */}

							{loaded && (
								<div className="table-arabic w-100">
									<Table
										name="cnam-user"
										key="cnam-users"
										title={
											<div
												className="text-nowrap row "
												// style={{ fontSize: "17px", width: "70vw" }}
												style={{ fontFamily: "cnam-bold-ar", fontSize: "1.15rem", width: "70vw" }}
											>
												<div className="mr-3 mb-2 mb-md-0">المستخدمين</div>
											</div>
										}
										columns={cols1}
										components={{
											Row: (rowProps) => (
												<MTableBodyRow
													{...rowProps}
													onMouseEnter={(e) => {
														if (e.target.parentElement.getElementsByTagName("td")[4] && e.target.parentElement.getElementsByTagName("td")[4].innerText === "Inactive") e.target.parentElement.style.cursor = "default";
													}}
												/>
											),
										}}
										data={rows2}
										options={{
											pageSize: 10,
											emptyRowsWhenPaging: false,
											pageSizeOptions: [10, 15, 20],

											selection: true,
											// rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '' }),
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
												cursor: "default !important",
											},
										}}
										rowClick={(event, rowData) => {
											if (rowData.status !== "inactive") props.history.push(`/user_details/${btoa(encodeURIComponent(rowData.key))}`);
										}}
										actions={[
											{
												tooltip: "",
												position: "toolbar",
												icon: () => (
													<div>
														<Button className="d-block o" style={{ background: "rgb(198 2 36)", padding: "0.6rem 2rem", border: "none", fontFamily: "cnam-ar" }}>
															+ إضافة المستخدمين
														</Button>
													</div>
												),
												onClick: () => toggleadd(),
											},
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
												onClick: (evt, data) => exportTable(data, "challenge", "csv"),
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
												onClick: (evt, data) => exportTable(data, "challenge", "pdf"),
											},
										]}
									/>
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}

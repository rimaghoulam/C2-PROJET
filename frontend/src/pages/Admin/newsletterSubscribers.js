import React, { useState, useEffect } from "react";
import axios from "axios";

import { getSessionInfo, clearSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";
import { formatDate, downloadFileWithExtension } from "../../functions";

// C:\Users\es\Desktop\cnam\cnam-portal\src\components\Table\Table.js
import Table from "../../components/Table/Table";


import pdf from "../../assets/images_svg/pdf.svg";
import csv from "../../assets/images_svg/csv.svg";

export default function NewsLetterSubscriber(props) {
	const [userObj, setUserObj] = useState({
		user_details: "",
	});

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

	////////////////////////////////////////////// PAGE CREATION

	useEffect(() => {
		props.setPageTitle('Subscribers', 'مشتركين')
		props.toggleSpinner(true);
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
		};

		// get_contact_forms
		// export_requests

		axios({
			method: "post",
			url: `${WS_LINK}get_all_users`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data === "token error") {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				} else {
					// const users = res.data[0].filter(item => item.user_active === 3 && item)
					let subscribed_users = res.data.map((user) => {
						return user.filter((subbed_user) => {
							return subbed_user.newsletter === 1;
						});
					});
					subscribed_users = subscribed_users[0].concat(subscribed_users[1])
					setUserObj({ ...userObj, user_details: subscribed_users });
				}
				props.toggleSpinner(false);
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

	const cols = [
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
			customFilterAndSearch: (term, rowData) =>
				rowData.Name.name.toLowerCase().indexOf(term) !== -1 || rowData.Name.name.toLowerCase().indexOf(term) !== -1,
			customSort: (a, b) => a.Name.name.localeCompare(b.Name.name),
		},
		{ key: "mobile", title: getSessionInfo("language") === "english" ? "MOBILE" : "التليفون المحمول", field: "mobile" },
		{ key: "role", title: getSessionInfo("language") === "english" ? "ROLE" : "وظيفة", field: "role" },
		// {
		// 	key: "status",
		// 	title: getSessionInfo("language") === "english" ? "STATUS" : "الحالة",
		// 	field: "status",
		// 	cellStyle: { textTransform: "capitalize" },
		// 	render: (rowData) => <span style={{ color: rowData.status === "inactive" ? "red" : "black" }}>{rowData.status}</span>,
		// 	customFilterAndSearch: (term, rowData) => rowData.status.toLowerCase().indexOf(term) !== -1,
		// },
		{ key: "createdOn", title: getSessionInfo("language") === "english" ? "CREATED ON" : "تم إنشاؤها ", field: "createdOn", defaultSort: "desc" },
		{ key: "icon", title: "", field: "icon", sorting: false },
	];

	const jobTitle = (name, email) => (
		<div className="d-flex">
			<div className={getSessionInfo("language") === "english" ? "" : "ml-1"} style={iconsStyle}>
				{name.charAt(0).toUpperCase()}
			</div>
		</div>
	);

	const rows = [];
	if (typeof userObj.user_details !== "undefined") {
		for (let i = 0; i < userObj.user_details.length; i++) {
			let item = userObj.user_details[i];
			rows.push({
				key: item.user_id,
				roleid: item.user_role_role_id,
				// ficon: jobTitle(item.user_name, item.user_email),
				Name: { icon: jobTitle(item.user_name, item.user_email), name: item.user_name, email: item.user_email },
				mobile: item.user_mobile,
				createdOn: formatDate(item.created_date, true),
				role: item.user_role,
				// status: item.user_active === 3 ? "inactive" : "active",
			});
		}
	}

	return (
		<div className="cont w-100" style={{ height: 'calc(100vh - 118px)', overflowY: 'auto' }}>
			<Table
				name="media-table"
				title={<h4>Subscribed users</h4>}
				columns={cols}
				data={rows}
				rowClick={(event, rowData) => {
					if (rowData.status !== "inactive") props.history.push(`/user_details/${btoa(encodeURIComponent(rowData.key))}`);
				}}
				options={{
					pageSize: 20,
					emptyRowsWhenPaging: false,
					pageSizeOptions: [20, 25, 35],
					selection: true,
					sorting: true,
					paging: true,
					headerStyle: {
						fontSize: "12px",
						backgroundColor: "#F7F7F7",
						color: "#B3B3B3",
						paddingTop: "3px",
						paddingBottom: "3px",
						whiteSpace: "nowrap",
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
	);
}

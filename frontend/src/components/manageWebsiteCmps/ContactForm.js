import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import "react-datepicker/dist/react-datepicker.css";

import { getSessionInfo, clearSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";
import { formatDate, downloadFileWithExtension } from "../../functions";

import Table from "../Table/Table";
import AdminContactForm from "../AdminContactForm/AdminContactForm";

import "./manageWebsiteCmps.css";

import pdf from "../../assets/images_svg/pdf.svg";
import csv from "../../assets/images_svg/csv.svg";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export default function ContactForm(props) {

	const [tableData, setTableData] = useState({
		cols: [
			{ title: "Name", field: "name" },
			{ title: "Email", field: "email" },
			{ title: "Phone", field: "phone" },
			{ title: "Subject", field: "subject" },
			{ title: "Date", field: "date", defaultSort: "desc" },
		],
	});

	const RowsRef = useRef({});
	RowsRef.current = tableData.rows;

	////////////////////////////////////////////// PAGE CREATION

	useEffect(() => {

		props.setPageTitle('Contact Form', 'نموذج الاتصال')

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
			url: `${WS_LINK}get_contact_forms`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data === "token error") {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				} else {
					const arr = [];
					for (let i = 0; i < res.data.length; i++) {
						arr.push({
							name: res.data[i].contact_name,
							phone: res.data[i].contact_phone,
							email: res.data[i].contact_email,
							subject: res.data[i].contact_subject,
							date: formatDate(res.data[i].created_date),
							hidden: { requestId: res.data[i].contact_id },
						});
					}
					setTableData({ ...tableData, rows: arr });
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

	const exportTable = (data, users_id, exportType, isCompany) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		let contacts = [];
		for (let i = 0; i < data.length; i++) {
			contacts[i] = data[i].hidden.requestId;
		}

		var postedData;

		postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			toe: exportType,
			contact_id: contacts,
		};

		props.toggleSpinner(true);
		axios({
			method: "post",
			url: `${WS_LINK}export_contact`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 4 && res.data !== "token error") {
					props.toggleSpinner(false);
					downloadFileWithExtension(res.data, `contact forms.${exportType}`, exportType);
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

	return (
		<div className="cont">
			{tableData.rows && (
				<>
					<button
						className="pointer mt-3 ml-2"
						style={{ backgroundColor: "transparent", border: "none", color: "#00ab9e" }}
						onClick={() => props.history.goBack()}
					>
						<ArrowBackIosIcon style={{ fontSize: "0.85rem" }} />
						Back
					</button>
					<Table
						name="media-table"
						title={<h4>Contact Forms:</h4>}
						columns={tableData.cols}
						data={RowsRef.current}
						rowClick={(event, rowData) =>
							props.history.push(`/manage/contact_forms/${btoa(encodeURIComponent(rowData.hidden.requestId))}`)
						}
						options={{
							pageSize: 5,
							emptyRowsWhenPaging: false,
							pageSizeOptions: [5, 10],
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
								onClick: (evt, data) => exportTable(data, "contactform", "csv"),
							},
							{
								tooltip: "Download as PDF",
								icon: () => (
									<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
										<img src={pdf} alt="" style={{ width: "20px" }} />
										<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as PDF</span>
									</button>
								),
								onClick: (evt, data) => exportTable(data, "contactform", "pdf"),
							},
						]}
					/>
				</>
			)}

			<AdminContactForm />
		</div>
	);
}

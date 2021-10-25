import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { getSessionInfo, clearSessionInfo } from "../../variable";
import { formatDate, downloadFile, downloadFileWithExtension, translate } from "../../functions";
import { WS_LINK } from "../../globals";

import Selector from "../../components/Selector/Selector";
import GenericModal from "../../components/PageModals/GenericModal"

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SmsIcon from "@material-ui/icons/Sms";
import AddIcon from "@material-ui/icons/Add";
import EmailIcon from "@material-ui/icons/Email";

import "../../App.css";
import "./AdminChallengeDetails.css";

import pdf from "../../assets/images_svg/pdf.svg";
import rtf from "../../assets/images_png/rtf.png";
import excel from "../../assets/images_svg/excel.svg";
import csv from "../../assets/images_svg/csv.svg";
import check from '../../assets/images_png/check.png'

import { Button } from "reactstrap";

export default function AdminChallengeDetails(props) {
	let { challengeid } = useParams();
	challengeid = decodeURIComponent(atob(challengeid));

	// * ************************* the states
	const [detailsObj, setDetailsObj] = useState({
		challengeDetails: "",
		documents: [],
		assigned: "",
	});
	const [talents, setTalents] = useState("");

	const [changeAssigned, setChangeAssigned] = useState(false);
	const [commentObj, setCommentObj] = useState("");
	const [changedData, setChangedData] = useState("");
	const [pageLoaded, setPageLoaded] = useState(false);
	const [modalState, setmodalState] = useState(false)

	const statusOptions = useRef([
		{
			value: "PENDING REVIEW",
			label: "PENDING REVIEW",
		},
		{ value: "PENDING INFO", label: "PENDING INFO" },
		{
			value: "IN PROGRESS",
			label: "IN PROGRESS",
		},
		{
			value: "CLOSED",
			label: "CLOSED",
		},
		{
			value: "COMPLETED",
			label: "COMPLETED",
		},
		// {
		// 	value: "STUDENTS ASSIGNED",
		// 	label: "STUDENTS ASSIGNED",
		// },
	]);

	// * *********************  the set states functions
	const handleChange = (name, value) => {
		setChangedData({ ...changedData, [name]: value });
	};

	const handleAssigned = () => {
		setChangeAssigned(!changeAssigned);
	};

	// data fetching on creation
	useEffect(() => {
		props.setPageTitle('Challenge Details', 'تفاصيل التحدي')
		getData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getData = () => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			jobid: challengeid,
		};
		props.toggleSpinner(true);
		// to get the challenge details
		axios({
			method: "post",
			url: `${WS_LINK}get_job_details_byid`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 4 && res.data !== "token error") {
					props.toggleSpinner(false);
					const challenge = res.data[0][0];

					let status = challenge.job_status;
					if (status === "pending") {
						status = "PENDING REVIEW";
					} else {
						status = status.toUpperCase();
					}

					// for (var i = 0; i < 4; i++) {
					// 	statusOptions.current[i].isDisabled = true;
					// 	if (statusOptions.current[i].label.toLowerCase() === status.toLowerCase()) {
					// 		break;
					// 	}
					// }

					setDetailsObj({
						challengeDetails: challenge,
						documents: res.data[1],
						assigned: res.data[2][0],
					});

					setChangedData({
						status: { value: status, label: status },
						assigned: res.data[2][0]
							? {
								value: res.data[2][0].user_id,
								label: res.data[2][0].user_name + " (" + res.data[2][0].user_department + " )",
							}
							: { value: "Not Found", label: "Not Found" },
					});
					setPageLoaded(true);
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

		// to get the comments
		axios({
			method: "post",
			url: `${WS_LINK}get_count_comments_by_jobid`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 4 && res.data !== "token error") {
					const count_comments = res.data;
					setCommentObj(count_comments[0] + count_comments[1]);
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
			});
		// to get the talents
		axios({
			method: "post",
			url: `${WS_LINK}get_cnam_talents`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 4 && res.data !== "token error") {
					let talentTemp = [];

					for (let i = 0; i < res.data.length; i++) {
						talentTemp[i] = {
							value: res.data[i].user_id,
							label: res.data[i].user_name + " (" + res.data[i].user_department + " )",
						};
					}
					setTalents(talentTemp);
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

	const download_as = (download_type) => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			jobid: challengeid,
			jobtype: "challenge",
			toe: download_type,
		};

		axios({
			method: "post",
			url: `${WS_LINK}admin_export_jobs`,
			data: postedData,
			cancelToken: source.token,
			headers: { "Access-Control-Allow-Origin": "*" },
		})
			.then((res) => {
				if (res.data !== "role error" && res.data !== "token error") {
					downloadFileWithExtension(res.data, `${detailsObj.challengeDetails.challenge_name}.${download_type}`, download_type);
					// const downloadLink = document.createElement("a");
					// downloadLink.href = linkSource;
					// downloadLink.download = fileName || 'cnamkpp-file.pdf';
					// downloadLink.click();
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
			});
	};

	// to send the saved data
	const saveChanges = () => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			adminid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			challengeid: challengeid,
			userid: changedData.assigned.value,
			status: changedData.status.value,
		};
		props.toggleSpinner(true);
		// to get the challenge details
		axios({
			method: "post",
			url: `${WS_LINK}assign_challenge`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 4 && res.data !== "token error") {
					props.toggleSpinner(false);
					setmodalState(true)
					getData();
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


	let share_content;
	let documents = detailsObj.documents.map((doc) => {
		// return `data:application/pdf;base64,${doc.document_path}`
		return doc.document_name
	})
	if (detailsObj.challengeDetails) {
		share_content = `Challenge Name: %0D%0A${detailsObj.challengeDetails.challenge_name}%0D%0A %0D%0ADescription: %0D%0A${detailsObj.challengeDetails.challenge_description}%0D%0A %0D%0AChallenge Type: %0D%0A${detailsObj.challengeDetails.challenge_type} %0D%0A %0D%0ADid the Industry approach anyone to address this challenge? %0D%0A${detailsObj.challengeDetails.challenge_approach}%0D%0A %0D%0AHow long do the have this challenge? %0D%0A${detailsObj.challengeDetails.challenge_time}%0D%0A %0D%0AIs the company affected by this challenge? %0D%0A${detailsObj.challengeDetails.challenge_comp_affected}%0D%0A %0D%0A Did the Industry anticipate any cost to address this challenge? %0D%0A${detailsObj.challengeDetails.challenge_cost}%0D%0A %0D%0ASupporting documents: %0D%0A${documents}%0D%0A %0D%0AIndustry Referral: %0D%0A${detailsObj.challengeDetails.challenge_hear}%0D%0A %0D%0AA Download Job pdf: %0D%0Ahttp%3a%2f%2fkpp.cnam.edu.sa%2fdownload_job%2f${challengeid} `;
	}

	return (
		<>

			<GenericModal
				state={modalState}
				toggleState={() => setmodalState(false)}
				icon={<img src={check} width={75} alt="" />}
				text={translate("Changed saved successfully!", "تم تغيير بنجاح!")}
				buttonClick={() => setmodalState(false)}
				buttonText={translate('Ok', 'نعم')}
			/>
			{getSessionInfo("language") === "english" ? (
				<div className="row BodyHeight w-100 mr-0 ml-lg-3 ml-1" style={{ backgroundColor: "#fffdfc" }}>
					{pageLoaded && (
						<>
							<div className="scroll-in-body custom_scrollbar remove_customscroll_mobile col-lg-6 px-lg-5 mb-3 pl-lg-3">
								<div className="mt-4 back w-100" style={{ color: "rgb(198 2 36)" }} onClick={() => props.history.goBack()}>
									<ArrowBackIosIcon style={{ fontSize: "13px", marginTop: "-2px" }} />
									Back
								</div>
								<div className="mt-3">
									<span className="h3" style={{ fontFamily: "cnam-bold" }}>
										{detailsObj.challengeDetails.challenge_name}
									</span>
									<button className="ml-sm-1 p-2 pointer" style={{ border: "none", backgroundColor: "rgb(198 2 36)", color: "white", fontSize: "0.85rem", fontWeight: "500", fontFamily: "cnam", borderRadius: "5px" }} onClick={() => props.history.push(`/timeline/${btoa(encodeURIComponent(challengeid))}`)}>
										Check Timeline
									</button>
								</div>
								<div className="mt-2" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
									Description
								</div>
								<div style={{ fontWeight: "500" }}>{detailsObj.challengeDetails.challenge_description}</div>
								<hr className="my-3" />
								<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>Challenge Type</div>
								<div style={{ fontWeight: "500" }}>{detailsObj.challengeDetails.challenge_type}</div>
								<hr className="my-3" />
								<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>Did the Industry approach anyone to address this challenge?</div>
								{detailsObj.challengeDetails.challenge_approach === "No" ? (
									<>
										<div style={{ fontWeight: "500" }}>{detailsObj.challengeDetails.challenge_approach}</div>
										<div style={{ fontWeight: "500" }}>{detailsObj.challengeDetails.challenge_approach_spec}</div>
										<hr className="my-3" />
									</>
								) : (
									<>
										<div style={{ fontWeight: "500" }}>{detailsObj.challengeDetails.challenge_approach_spec}</div>
										<hr className="my-3" />
									</>
								)}
								{detailsObj.challengeDetails.challenge_time && (
									<>
										<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>How long do they have this challenge?</div>
										<div style={{ color: "#6E6259", fontSize: "0.95rem" }}>{detailsObj.challengeDetails.challenge_time}</div>
										<hr className="my-3" />
									</>
								)}
								<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>Is the company affected by this challenge?</div>
								{detailsObj.challengeDetails.challenge_comp_affected === "No" ? (
									<>
										<div style={{ fontWeight: "500" }}>{detailsObj.challengeDetails.challenge_comp_affected}</div>
										<div style={{ fontWeight: "500" }}>{detailsObj.challengeDetails.challenge_comp_affected_spec}</div>
										<hr className="my-3" />
									</>
								) : (
									<>
										<div style={{ fontWeight: "500" }}>{detailsObj.challengeDetails.challenge_comp_affected_spec}</div>
										<hr className="my-3" />
									</>
								)}
								<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>Did the Industry anticipate any cost to address this challenge?</div>
								{detailsObj.challengeDetails.challenge_cost === "No" ? (
									<>
										<div style={{ color: "#6E6259", fontSize: "0.95rem" }}>{detailsObj.challengeDetails.challenge_cost}</div>
										<div style={{ color: "#6E6259", fontSize: "0.95rem" }}>{detailsObj.challengeDetails.challenge_cost_spec}</div>
										<hr className="mt-4" />
									</>
								) : (
									<>
										<div style={{ color: "#6E6259", fontSize: "0.95rem" }}>{detailsObj.challengeDetails.challenge_cost_spec}</div>
										<hr className="my-3" />
									</>
								)}
								<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>Supporting documents</div>
								{detailsObj.documents.length === 0 ? (
									<div>No documents attached</div>
								) : (
									detailsObj.documents.map((doc) => (
										<div className="pointer my-1" style={{ fontWeight: "500" }} onClick={() => downloadFile(doc.document_path, doc.document_name)} key={doc.document_path}>
											<img src={pdf} alt="pdf" style={{ width: "20px" }} />
											{doc.document_name}
										</div>
									))
								)}

								<hr className="mt-4" />
								<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>Industry Referral</div>
								<div style={{ fontWeight: "500", marginBottom: '10px' }}>{detailsObj.challengeDetails.challenge_hear}</div>
							</div>

							{/* //* ////////////////////// part two //////////////////////// */}

							<div className="col-lg-5 scroll-in-body hide_scrollbar pt-xl-5 pt-lg-4 pt-3 mt-3">
								<div
									style={{
										borderRadius: "5px",
										background: "white",
										padding: "30px",
										boxShadow: "0px 0px 2px 2px #E9E9E9",
									}}
								>
									<div className="mb-1" style={{ fontFamily: "cnam-bold" }}>
										Submitted by
									</div>
									<div className="h6 ">
										{detailsObj.challengeDetails.user_name}
										<hr className="my-3" />
									</div>

									<div className="mb-1" style={{ fontFamily: "cnam-bold" }}>
										Company Name
									</div>
									<div className="h6 ">
										{detailsObj.challengeDetails.industry_details_company_name}
										<hr className="my-3" />
									</div>

									<div className="mb-1" style={{ fontFamily: "cnam-bold" }}>
										Submitted on
									</div>
									<div className="h6 ">
										{formatDate(detailsObj.challengeDetails.created_date, true) + "\n"}
										<hr className="my-3" />
									</div>

									<div className="mb-2" style={{ fontFamily: "cnam-bold" }}>
										Assigned to
									</div>

									<div className="d-flex">
										{changeAssigned ? (
											<Selector name="assigned" value={changedData.assigned} className="w_shadow col-8" onChange={(e) => handleChange("assigned", e)} options={talents} placeholder={detailsObj.challengeDetails.user_name} style={{ boxShadow: "0px 1px 3px -2px #888888" }} />
										) : (
											//<div className="h6 font-weight-bold">{changedData.assigned.label }</div>
											<div className="h6">{typeof detailsObj.assigned !== "undefined" ? detailsObj.assigned.user_name + " (" + detailsObj.assigned.user_department + " )" : "NOT FOUND"}</div>
										)}

										<div className="ml-auto font-weight-bold pointer" style={{ color: "rgb(198 2 36)" }} onClick={handleAssigned}>
											{!changeAssigned ? "Change Assignee" : "Cancel"}
										</div>
									</div>
									<hr className="my-3" />

									<div className="mb-2" style={{ fontWeight: "bold" }}>
										Status
									</div>
									<div>
										<Selector name="status" value={changedData.status} className="w_shadow" onChange={(e) => handleChange("status", e)} options={statusOptions.current} placeholder="Select status" style={{ boxShadow: "0px 1px 3px -2px #888888" }} />
										<hr className="my-3" />
									</div>

									<div style={{ display: "flex", padding: "8px" }}>
										<div style={{ fontWeight: "500", fontSize: "13px" }} onClick={() => props.history.push(`/discussion/${btoa(encodeURIComponent(challengeid))}`)} className="pointer">
											<SmsIcon style={{ fontSize: "17px", color: "#e98300" }} /> ({commentObj}) Comments
										</div>
										<div
											className="font-weight-bold comment"
											style={{
												fontSize: "13px",
												marginLeft: "auto",
												color: "rgb(198 2 36)",
											}}
											onClick={() => props.history.push(`/discussion/${btoa(encodeURIComponent(challengeid))}`)}
										>
											<AddIcon style={{ fontSize: "12px" }} />
											Add a comment
										</div>
									</div>

									<div className="d-flex mt-3">
										<Button
											style={{
												fontWeight: "600",
												background: "rgb(198 2 36)",
												padding: "0.7rem 2.2rem",
												border: "none",
											}}
											onClick={saveChanges}
										>
											Save
										</Button>
									</div>
								</div>

								<div className="d-flex justify-content-around mt-4">
									<Selector
										name="download_as"
										className=" col-5 download_as"
										// ! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
										// ! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
										options={[
											{
												value: "PDF",
												label: (
													<div style={{ cursor: "pointer" }} onClick={() => download_as("pdf")}>
														<img src={pdf} alt="img" style={{ width: "19px" }} /> Download PDF
													</div>
												),
											},
											{
												value: "RTF",
												label: (
													<div style={{ cursor: "pointer" }} onClick={() => download_as("rtf")}>
														<img src={rtf} alt="img" style={{ width: "19px" }} /> Download RTF
													</div>
												),
											},
											{
												value: "EXCEL",
												label: (
													<div style={{ cursor: "pointer" }} onClick={() => download_as("xlsx")}>
														<img src={excel} alt="img" style={{ width: "19px" }} /> Download EXCEL
													</div>
												),
											},
											{
												value: "CSV",
												label: (
													<div style={{ cursor: "pointer" }} onClick={() => download_as("csv")}>
														<img src={csv} alt="img" style={{ width: "19px" }} /> Download CSV
													</div>
												),
											},
										]}
										placeholder="Download"
										style={{ backgroundColor: "transparent", color: "black", boxShadow: "none", border: "none" }}
									/>
									<div style={{ borderLeft: "2px solid #efeeee", height: "35px" }}></div>
									<div style={{ cursor: "pointer" }}>
										<a href={`mailto:?subject=cnam KPP - ${detailsObj.challengeDetails && detailsObj.challengeDetails.challenge_name}&body=${share_content}`} title="Share by Email" style={{ color: "black", textDecoration: "none" }}>
											<EmailIcon style={{ color: "rgb(198 2 36)" }} /> Share by email
										</a>
									</div>
								</div>
								<hr style={{ borderTop: "2px solid #efeeee" }} />
							</div>
						</>
					)}
				</div>
			) : (
				//   * * ********************************************************************************************************************
				// *************************************************** ARABIC *********************************************************
				// ********************************************************************************************************************

				<div className="w-100">
					<div className="row BodyHeight w-100 mr-3 ml-0 text-right" style={{ backgroundColor: "#fffdfc", fontFamily: "cnam-ar" }}>
						{pageLoaded && (
							<>
								<div className="scroll-in-body custom_scrollbar remove_customscroll_mobile col-lg-6 px-lg-5 mb-5 mb-md-0">
									<div className="mt-4 back" style={{ color: "rgb(198 2 36)" }} onClick={() => props.history.goBack()}>
										<ArrowBackIosIcon style={{ fontSize: "13px", marginTop: "-2px", transform: "rotate(180deg)" }} />
										عودة
									</div>
									<div className="mt-3">
										<span className="h3" style={{ fontFamily: "cnam-bold" }}>
											{detailsObj.challengeDetails.challenge_name}
										</span>
										<button className="mr-1 p-2 pointer" style={{ border: "none", backgroundColor: "rgb(198 2 36)", color: "white", fontSize: "0.85rem", fontWeight: "500", fontFamily: "cnam-ar", borderRadius: "5px" }} onClick={() => props.history.push(`/timeline/${btoa(encodeURIComponent(challengeid))}`)}>
											تحقق الجدول الزمني
										</button>
									</div>
									<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }} className="mt-3">
										وصف الطلب 
									</div>
									<div style={{ fontWeight: "500", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_description}</div>
									<hr className="mt-4" />

									<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>نوع التحدي</div>
									<div style={{ fontWeight: "500", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_type}</div>
									<hr className="mt-4" />

									<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>هل تقترب الصناعة أي شخص لمعالجة هذا التحدي؟</div>
									{detailsObj.challengeDetails.challenge_approach === "No" ? (
										<>
											<div style={{ fontWeight: "500", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_approach}</div>
											<div style={{ fontWeight: "500", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_approach_spec}</div>
											<hr className="mt-4" />
										</>
									) : (
										<>
											<div style={{ fontWeight: "500", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_approach_spec}</div>
											<hr className="mt-4" />
										</>
									)}
									{detailsObj.challengeDetails.challenge_time && (
										<>
											<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>كم من الوقت لديهم هذا التحدي؟</div>
											<div style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_time}</div>
											<hr className="mt-4" />
										</>
									)}

									<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>هل هناك اثر واضح على المنشأة بسبب هذا التحدي؟</div>
									{detailsObj.challengeDetails.challenge_comp_affected === "No" ? (
										<>
											<div style={{ fontWeight: "500", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_comp_affected}</div>
											<div style={{ fontWeight: "500", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_comp_affected_spec}</div>
											<hr className="mt-4" />
										</>
									) : (
										<>
											<div style={{ fontWeight: "500", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_comp_affected_spec}</div>
											<hr className="mt-4" />
										</>
									)}

									<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>هل توقع الصناعة أي تكلفة لمعالجة هذا التحدي؟</div>
									{detailsObj.challengeDetails.challenge_cost === "No" ? (
										<>
											<div style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_cost}</div>
											<div style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_cost_spec}</div>
											<hr className="mt-4" />
										</>
									) : (
										<>
											<div style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_cost_spec}</div>
											<hr className="mt-4" />
										</>
									)}

									<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>المستندات المخصصة لهذا التحدي</div>
									{detailsObj.documents.length === 0 ? (
										<div>لا توجد وثائق مرفقة</div>
									) : (
										detailsObj.documents.map((doc) => (
											<div className="pointer my-1" style={{ fontWeight: "500" }} onClick={() => downloadFile(doc.document_path, doc.document_name)} key={doc.document_path}>
												<img src={pdf} alt="pdf" style={{ width: "20px" }} />
												{doc.document_name}
											</div>
										))
									)}

									<hr className="mt-4" />

									<div style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>نحن إحالة.</div>
									<div style={{ fontWeight: "500", fontFamily: "cnam" }}>{detailsObj.challengeDetails.challenge_hear}</div>
								</div>

								{/* // * ////////////////////// part two //////////////////////// */}

								<div className="col-lg-5 scroll-in-body hide_scrollbar pt-xl-5 pt-lg-4 pt-3">
									<div
										className="container"
										style={{
											borderRadius: "5px",
											background: "white",
											padding: "30px",
											boxShadow: "0px 0px 2px 2px #E9E9E9",
										}}
									>
										<div style={{ fontWeight: "bold", fontFamily: "cnam-ar" }}>مقدم من</div>
										<div className="h6  ">
											{detailsObj.challengeDetails.user_name}
											<hr className="mt-4" />
										</div>

										<div style={{ fontWeight: "bold", fontFamily: "cnam-ar" }}>اسم المنشأة</div>
										<div className="h6 ">
											{detailsObj.challengeDetails.industry_details_company_name}
											<hr className="mt-4" />
										</div>

										<div style={{ fontWeight: "bold", fontFamily: "cnam-ar" }}>قدمت بتاريخ</div>
										<div className="h6 ">
											{formatDate(detailsObj.challengeDetails.created_date, true) + "\n"}
											<hr className="mt-4" />
										</div>

										<div className="mb-2" style={{ fontWeight: "bold", fontFamily: "cnam-ar" }}>
										تم استناد التحدي إلى
										</div>

										<div className="d-flex">
											{changeAssigned ? <Selector name="assigned" value={changedData.assigned} className="w_shadow col-8" onChange={(e) => handleChange("assigned", e)} options={talents} placeholder={detailsObj.challengeDetails.user_name} style={{ boxShadow: "0px 1px 3px -2px #888888" }} /> : <div className="h6 ">{typeof detailsObj.assigned !== "undefined" ? detailsObj.assigned.user_name + + " (" + detailsObj.assigned.user_department + " )" : "غير موجود"}</div>}

											<div className="mr-auto  pointer" style={{ color: "rgb(198 2 36)" }} onClick={handleAssigned}>
												{!changeAssigned ? "تغيير المحال إليه" : "يلغي"}
											</div>
										</div>
										<hr className="mt-4" />

										<div className="mb-1" style={{ fontWeight: "bold", fontFamily: "cnam-ar" }}>
											حالة
										</div>
										<div>
											<Selector name="status" value={changedData.status} className="w_shadow" onChange={(e) => handleChange("status", e)} options={statusOptions.current} placeholder="Select status" style={{ boxShadow: "0px 1px 3px -2px #888888", fontFamily: "cnam" }} />
											<hr className="mt-4" />
										</div>

										<div style={{ display: "flex", padding: "8px" }}>
											<div style={{ fontWeight: "500", fontSize: "13px" }} onClick={() => props.history.push(`/discussion/${btoa(encodeURIComponent(challengeid))}`)} className="pointer">
												<SmsIcon style={{ fontSize: "17px", color: "#e98300" }} />
												<span style={{ fontFamily: "cnam" }}> ({commentObj} )</span> تعليقات
											</div>
											<div
												className="comment"
												style={{
													fontSize: "13px",
													marginRight: "auto",
													color: "rgb(198 2 36)",
												}}
												onClick={() => props.history.push(`/discussion/${btoa(encodeURIComponent(challengeid))}`)}
											>
												<AddIcon style={{ fontSize: "12px", fontFamily: "cnam-ar" }} />
												اضف تعليق
											</div>
										</div>

										<div className="d-flex mt-3">
											<Button
												className="  "
												style={{
													fontWeight: "600",
													background: "rgb(198 2 36)",
													padding: "0.7rem 2.2rem",
													border: "none",
												}}
												onClick={saveChanges}
											>
												حفظ
											</Button>
										</div>
									</div>

									<div className="d-flex justify-content-around mt-4">
										<Selector
											name="download_as"
											className=" col-5 download_as"
											// ! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
											// ! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
											options={[
												{
													value: "PDF",
													label: (
														<div style={{ cursor: "pointer" }} onClick={() => download_as("pdf")}>
															<img src={pdf} alt="img" style={{ width: "19px" }} /> تحميل الملف PDF
														</div>
													),
												},
												{
													value: "RTF",
													label: (
														<div style={{ cursor: "pointer" }} onClick={() => download_as("rtf")}>
															<img src={rtf} alt="img" style={{ width: "19px" }} /> تحميل الملف RTF
														</div>
													),
												},
												{
													value: "EXCEL",
													label: (
														<div style={{ cursor: "pointer" }} onClick={() => download_as("xlsx")}>
															<img src={excel} alt="img" style={{ width: "19px" }} /> تحميل الملف EXCEL
														</div>
													),
												},
												{
													value: "CSV",
													label: (
														<div style={{ cursor: "pointer" }} onClick={() => download_as("csv")}>
															<img src={csv} alt="img" style={{ width: "19px" }} /> تحميل الملف CSV
														</div>
													),
												},
											]}
											placeholder="تحميل"
											style={{ backgroundColor: "transparent", color: "black", boxShadow: "none", border: "none" }}
										/>
										<div style={{ borderLeft: "2px solid #efeeee", height: "35px" }}></div>
										<div style={{ cursor: "pointer", fontFamily: "cnam-ar" }}>

											<a href={`mailto:?subject=cnam KPP - ${detailsObj.challengeDetails && detailsObj.challengeDetails.challenge_name}&body=${share_content}`} title="Share by Email" style={{ color: "black", textDecoration: "none" }}>
												<EmailIcon style={{ color: "rgb(198 2 36)" }} />مشاركة عبر البريد الإلكتروني  
											</a>
										</div>
									</div>
									<hr style={{ borderTop: "2px solid #efeeee" }} />
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
}

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

import { getSessionInfo, clearSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";
import { formatDate, downloadFile, downloadFileWithExtension, toArabicDigits } from "../../functions";

import { Button } from "reactstrap";
import Loader from "react-loader-advanced";

import "../../App.css";

import Spinner from "../../components/spinner/Spinner";

import pdf from "../../assets/images_svg/pdf.svg";

import SmsIcon from "@material-ui/icons/Sms";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import EmailIcon from "@material-ui/icons/Email";

export default function IndustryInternDetails(props) {
	let { internshipid } = useParams();
	internshipid = decodeURIComponent(atob(internshipid));

	const [loaderState, setLoaderState] = useState(false);
	const [internshipdetail, setInternshipdetail] = useState({
		internships: [],
		assign: [],
	});
	const [count, setCount] = useState();

	useEffect(() => {
		props.setPageTitle('Internship Details', 'تفاصيل التدريب')
		get_request();
		get_comments();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const get_comments = () => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			jobid: internshipid,
		};
		setLoaderState(true);
		axios({
			method: "post",
			url: `${WS_LINK}get_count_comments_by_jobid`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (getSessionInfo("role") === 3 && res.data !== "token error") {
					setLoaderState(false);
					const count_comments = res.data;

					setCount(count_comments[1]);
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

	const get_request = () => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			jobid: internshipid,
		};
		setLoaderState(true);
		axios({
			method: "post",
			url: `${WS_LINK}get_job_details_byid`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data !== "role error" && res.data !== "token error") {
					// console.log(res.data)
					setLoaderState(false);
					const intern = res.data[0];
					const assign = res.data[2];

					setInternshipdetail({ internships: intern, assigned: assign });
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

	const download_pdf = () => {
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			job: internshipdetail.internships[0].internship_job_id,
		};

		setLoaderState(true)
		axios({
			method: "post",
			url: `${WS_LINK}generate_job_pdf`,
			data: postedData,
			cancelToken: source.token,
			headers: { "Access-Control-Allow-Origin": "*" },
		})
			.then((res) => {
				if (res.data !== "role error" && res.data !== "token error") {
					downloadFileWithExtension(res.data, internshipdetail.internships[0].internship_job_title + "-details.pdf", "pdf")
				} else {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				}

				setLoaderState(false)
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});
	};

	let share_content;
	let degree = "";
	if (internshipdetail.internships.length !== 0) {
		if (internshipdetail.internships[0].internship_categorie_students === "MS") degree = "MS, Majoring in";
		else degree = "PhD, Majoring in";

		share_content = `Internship Title: %0D%0A${internshipdetail.internships[0].internship_job_title}%0D%0A %0D%0ADepartment: %0D%0A${internshipdetail.internships[0].internship_department}%0D%0A %0D%0ADate: %0D%0AFrom ${formatDate(internshipdetail.internships[0].internship_start_date)} Till ${formatDate(internshipdetail.internships[0].internship_end_date)}%0D%0A %0D%0AJob Location: %0D%0A${internshipdetail.internships[0].internship_locations}%0D%0A %0D%0AInternship Length: %0D%0A${internshipdetail.internships[0].internship_length}%0D%0A %0D%0AOutline of the research or practical training experience and the roles and responsibilties of the position: %0D%0A${internshipdetail.internships[0].internship_outline}%0D%0A %0D%0ACategory of students and major(s) most appropriate for the opportunity at your institution: %0D%0A${degree}: %0D%0A${internshipdetail.internships[0].student_major}%0D%0A %0D%0APrior work experience or technical skills requirements: %0D%0A${internshipdetail.internships[0].internship_prior_work_experience}%0D%0A %0D%0ACompensation and Salary: %0D%0A${internshipdetail.internships[0].internship_compensation_salary}%0D%0A %0D%0A${internshipdetail.internships[0].contact_details ? "Contact Details: %0D%0A" + internshipdetail.internships[0].contact_details + "%0D%0A %0D%0A" : "%0D%0A"}${internshipdetail.internships[0].internship_link ? "Internship Link: %0D%0A" + internshipdetail.internships[0].internship_link + "%0D%0A %0D%0A" : "%0D%0A"}Please list required documents to be included with student's application such as letter of recommendation from cnam faculty advisor, transcript, statement of purpose , ect.: %0D%0A${internshipdetail.internships[0].internship_required_document}%0D%0A %0D%0AA brief description about your company: %0D%0A${internshipdetail.internships[0].internship_brief_description}%0D%0A %0D%0AA Download Job pdf: %0D%0Ahttp%3a%2f%2fkpp.cnam.edu.sa%2fdownload_job%2f${internshipdetail.internships[0].job_user_id} `;
	}

	///////////////////////////////////////// THE STYLES
	const btnstyle = {
		background: "#f7de9a",
		border: "none",
		borderRadius: "3px",
		fontSize: "12px",
		paddingTop: "4px",
		paddingBottom: "4px",
		paddingLeft: "9px",
		paddingRight: "9px",
		color: "black",
		cursor: "default",
		textTransform: "capitalize",
		fontWeight: "550",
	};
	const btnstyle2 = {
		background: "#7fd8cc",
		border: "none",
		borderRadius: "3px",
		fontSize: "12px",
		paddingTop: "4px",
		paddingBottom: "4px",
		paddingLeft: "9px",
		paddingRight: "9px",
		color: "black",
		textTransform: "uppercase",
		fontWeight: "550",
	};

	return (
		<>
			{getSessionInfo("language") === "english" ? (
				<Loader
					message={
						<span>
							<Spinner />{" "}
						</span>
					}
					show={loaderState}
					backgroundStyle={{ zIndex: "9999" }}
				>
					{internshipdetail.internships.length !== 0 && (
						<div className="container-fluid remove_customscroll_mobile">
							<div className="row justify-content-center" style={{ height: "calc(100vh - 128px)" }}>
								<div className="custom_scrollbar remove_customscroll_mobile col-lg-6" style={{ height: "100%", overflowY: "auto" }}>
									<div className="mt-4 back" style={{ color: "rgb(198 2 36)" }} onClick={() => props.history.goBack()}>
										<ArrowBackIosIcon style={{ fontSize: "13px", marginTop: "-2px" }} />
										Back
									</div>
									<div className="mt-3 " style={{ fontSize: "1.5rem", fontFamily: "cnam-bold" }}>
										{internshipdetail.internships[0].internship_job_title}
									</div>

									<div className="mt-3" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										Department
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_department}
									</div>
									<hr />

									<div className="mt-3" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										Institution Name
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_institution_name}
									</div>
									<hr />

									<div className="mt-3" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										Institution Location
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_location}
									</div>
									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										Date
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										From {formatDate(internshipdetail.internships[0].internship_start_date)} till {formatDate(internshipdetail.internships[0].internship_end_date)}
									</div>
									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										Job Location
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_locations}
									</div>
									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										Internship length
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_length}
									</div>
									<hr />

									<div className="mt-2" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										Outline of the research or practical training experience and the roles and responsibilties of the position
									</div>
									<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_outline}
									</div>

									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										Category of students and major(s) most appropriate for the opportunity at your institution
									</div>
									<br />
									{internshipdetail.internships[0].internship_categorie_students === "MS" ? (
										<>
											<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
												MS, Majoring in
											</div>
											<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
												{internshipdetail.internships[0].student_major}
											</div>
											<hr />
										</>
									) : (
										<>
											<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
												PhD, Majoring in
											</div>
											<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
												{internshipdetail.internships[0].student_major}
											</div>
											<hr />
										</>
									)}

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										Prior work experience or technical skills requirements
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_prior_work_experience}
									</div>

									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										Compensation & Salary
									</div>
									<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_compensation_salary}
									</div>

									<hr />
									{internshipdetail.internships[0].contact_details && (
										<>
											<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
												Contact details
											</div>
											<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
												{internshipdetail.internships[0].contact_details}
											</div>
											<hr />
										</>
									)}
									{internshipdetail.internships[0].internship_link && (
										<>
											<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
												Internship Link
											</div>
											<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
												<Link style={{ color: "#6E6259" }} onClick={() => (internshipdetail.internships[0].internship_link.includes("https://") ? downloadFile(internshipdetail.internships[0].internship_link, `${internshipdetail.internships[0].internship_job_title}-document.pdf`) : internshipdetail.internships[0].internship_link.includes("www") && downloadFile(internshipdetail.internships[0].internship_link, `${internshipdetail.internships[0].internship_job_title}-document.pdf`))}>
													{internshipdetail.internships[0].internship_link}
												</Link>
											</div>
											<hr />
										</>
									)}

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										List of required documents
									</div>
									<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_required_document}
									</div>

									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
										A brief description about the company
									</div>
									<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_brief_description}
									</div>
								</div>

								{/* 
                        <div className="col-lg-4" style={{ paddingTop: '5.5rem', height: '100%' }}>

                            <div className="container" style={{ borderRadius: '5px', background: 'white', padding: '30px', boxShadow: '0px 0px 2px 2px #E9E9E9', }} >

                                <div className="mb-4 d-flex" style={{ fontWeight: '500' }}><img src={pdf} alt="img" style={{width:'24px'}}/> <div className="ml-3 pointer" onClick={download_pdf}>Download as PDF</div></div>


                                <div className="mb-4 d-flex" style={{ fontWeight: '500' }}><EmailIcon style={{color:'rgb(198 2 36)'}} /> <div className="ml-3" >Share via Email</div></div> <hr />


                                <div className="d-flex p-2">
                                    <div className="" style={{ fontWeight: '500', fontSize: '13px' }}><SmsIcon style={{color: '#e98300', fontSize: '17px' }} /> ({count}) Comments</div>
                                    <div className="font-weight-bold comment" style={{color:'rgb(198 2 36)', fontSize: '13px', marginLeft: 'auto' }} onClick={() => props.history.push(`/discussion/${btoa(encodeURIComponent(internshipid))}`)}><AddIcon style={{color:'rgb(198 2 36)', fontSize: '12px' }} /> Add a comment</div>
                                </div>

                            </div>
                            
                        </div> */}

								<div className="col-lg-4" style={{ paddingTop: "60px", height: "100%" }}>
									<div className="container" style={{ borderRadius: "5px", background: "white", padding: "30px", boxShadow: "0px 0px 2px 2px #E9E9E9" }}>
										<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
											Submitted by
										</div>
										<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
											{internshipdetail.internships[0].user_name 
											// + " (" + internshipdetail.internships[0].user_department + " )"
											}
											<hr style={{ marginTop: "0.7rem", marginBottom: "0.2rem" }} />
										</div>

										<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
											Company Name
										</div>
										<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
											{internshipdetail.internships[0].industry_details_company_name} <hr style={{ marginTop: "0.7rem", marginBottom: "0.2rem" }} />
										</div>

										<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
											Submitted on
										</div>
										<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
											{formatDate(internshipdetail.internships[0].created_date)}
											<hr style={{ marginTop: "0.7rem", marginBottom: "0.2rem" }} />
										</div>

										<div className="" style={{ fontWeight: "500" }}>
											Assigned to
										</div>
										<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
											{console.log(internshipdetail)}
											{internshipdetail.assigned.length !== 0 ? (internshipdetail.assigned[0].user_name + " (" + internshipdetail.assigned[0].user_department + " )") : "Not Assigned yet"}
											<hr style={{ marginTop: "0.7rem", marginBottom: "0.2rem" }} />
										</div>

										<div className="mb-1" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
											Status
										</div>
										<div className="">
											<Button style={internshipdetail.internships[0].job_status === "PENDING REVIEW" ? btnstyle : btnstyle2}>{internshipdetail.internships[0].job_status}</Button>
											<hr />
										</div>

										<div className="d-flex pt-3" style={{}}>
											<div className="" onClick={() => props.history.push(`/discussion/${btoa(encodeURIComponent(internshipid))}`)} style={{ fontWeight: "500", fontSize: "13px", cursor: "pointer" }}>
												<SmsIcon style={{ color: "#e98300", fontSize: "17px" }} /> ({count}) Comment{count > 1 ? "s" : ""}
											</div>
											<div className="font-weight-bold comment" style={{ color: "rgb(198 2 36)", fontSize: "13px", marginLeft: "auto" }} onClick={() => props.history.push(`/discussion/${btoa(encodeURIComponent(internshipid))}`)}>
												<AddIcon style={{ color: "rgb(198 2 36)", fontSize: "12px" }} /> Add a comment
											</div>
										</div>
									</div>

									<div className="d-flex justify-content-around mt-3">
										<div style={{ cursor: "pointer" }} onClick={download_pdf}>
											<img src={pdf} alt="img" style={{ width: "19px" }} /> Download as PDF
										</div>
										<div style={{ borderLeft: "2px solid #efeeee", height: "35px" }}></div>
										<div style={{ cursor: "pointer" }}>
											<a href={`mailto:?subject=cnam KPP - ${internshipdetail.internships[0].internship_job_title}&body=${share_content}`} title="Share by Email" style={{ color: "black", textDecoration: "none" }}>
												<EmailIcon style={{ color: "rgb(198 2 36)" }} /> Share by email
											</a>
										</div>
									</div>
									<hr style={{ borderTop: "2px solid #efeeee" }} />
								</div>
							</div>
						</div>
					)}
				</Loader>
			) : (
				<Loader
					message={
						<span>
							<Spinner />{" "}
						</span>
					}
					show={loaderState}
					backgroundStyle={{ zIndex: "9999" }}
				>
					{internshipdetail.internships.length !== 0 && (
						<div className="container-fluid text-right remove_customscroll_mobile">
							<div className="row justify-content-center" style={{ height: "calc(100vh - 128px)" }}>
								<div className="custom_scrollbar remove_customscroll_mobile col-lg-6" style={{ height: "100%", overflowY: "auto" }}>
									<div className="mt-3 back" style={{ color: "rgb(198 2 36)", fontFamily: "cnam-ar" }} onClick={() => props.history.goBack()}>
										<ArrowBackIosIcon style={{ fontSize: "13px", marginTop: "-2px", transform: "rotate(180deg)" }} />
										عودة
									</div>
									<div className="mt-3 " style={{ fontSize: "1.5rem", fontFamily: "cnam-bold" }}>
										{internshipdetail.internships[0].internship_job_title}
									</div>

									<div className="mt-3" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										قسم
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_department}
									</div>
									<hr />

									<div className="mt-3" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										اسم المنشآة
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_institution_name}
									</div>
									<hr />

									<div className="mt-3" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										موقع المنشآة
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_location}
									</div>
									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										تاريخ
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										من عند {formatDate(internshipdetail.internships[0].internship_start_date)} till {formatDate(internshipdetail.internships[0].internship_end_date)}
									</div>
									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										مكان العمل
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_locations}
									</div>
									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										طول فترة التدريب
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_length}
									</div>
									<hr />

									<div className="mt-2" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										الخطوط العريضة لخبرة البحث أو التدريب العملي وأدوار ومسؤوليات الوظيفة
									</div>
									<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_outline}
									</div>

									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										فئة الطلاب والتخصص (التخصصات) الأكثر ملاءمة للفرصة في مؤسستك
									</div>
									<br />
									{internshipdetail.internships[0].internship_categorie_students === "MS" ? (
										<>
											<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
												ماجستير ، تخصص في
											</div>
											<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
												{internshipdetail.internships[0].student_major}
											</div>
											<hr />
										</>
									) : (
										<>
											<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
												دكتوراه تخصص في
											</div>
											<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
												{internshipdetail.internships[0].student_major}
											</div>
											<hr />
										</>
									)}

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										خبرة العمل السابقة أو متطلبات المهارات الفنية
									</div>
									<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_prior_work_experience}
									</div>

									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										التعويضات والراتب
									</div>
									<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_compensation_salary}
									</div>

									<hr />
									{internshipdetail.internships[0].contact_details && (
										<>
											<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
												بيانات المتصل
											</div>
											<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
												{internshipdetail.internships[0].contact_details}
											</div>
											<hr />
										</>
									)}
									{internshipdetail.internships[0].internship_link && (
										<>
											<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
												رابط التدريب
											</div>
											<div className="mb-4" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
												<Link style={{ color: "#6E6259" }} onClick={() => (internshipdetail.internships[0].internship_link.includes("https://") ? downloadFile(internshipdetail.internships[0].internship_link, `${internshipdetail.internships[0].internship_job_title}-document.pdf`) : internshipdetail.internships[0].internship_link.includes("www") && downloadFile(internshipdetail.internships[0].internship_link, `${internshipdetail.internships[0].internship_job_title}-document.pdf`))}>
													{internshipdetail.internships[0].internship_link}
												</Link>
											</div>
											<hr />
										</>
									)}

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										{" "}
										المستندات المطلوبة
									</div>
									<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_required_document}
									</div>

									<hr />

									<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
										وصف موجز عن المنشأة
									</div>
									<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
										{internshipdetail.internships[0].internship_brief_description}
									</div>
								</div>

								{/* 
                        <div className="col-lg-4" style={{ paddingTop: '5.5rem', height: '100%' }}>

                            <div className="container" style={{ borderRadius: '5px', background: 'white', padding: '30px', boxShadow: '0px 0px 2px 2px #E9E9E9', }} >

                                <div className="mb-4 d-flex" style={{ fontWeight: '500' }}><img src={pdf} alt="img" style={{width:'24px'}}/> <div className="ml-3 pointer" onClick={download_pdf}>Download as PDF</div></div>


                                <div className="mb-4 d-flex" style={{ fontWeight: '500' }}><EmailIcon style={{color:'rgb(198 2 36)'}} /> <div className="ml-3" >Share via Email</div></div> <hr />


                                <div className="d-flex p-2">
                                    <div className="" style={{ fontWeight: '500', fontSize: '13px' }}><SmsIcon style={{color: '#e98300', fontSize: '17px' }} /> ({count}) Comments</div>
                                    <div className="font-weight-bold comment" style={{color:'rgb(198 2 36)', fontSize: '13px', marginLeft: 'auto' }} onClick={() => props.history.push(`/discussion/${btoa(encodeURIComponent(internshipid))}`)}><AddIcon style={{color:'rgb(198 2 36)', fontSize: '12px' }} /> Add a comment</div>
                                </div>

                            </div>
                            
                        </div> */}

								<div className="col-lg-4" style={{ paddingTop: "60px", height: "100%" }}>
									<div className="container" style={{ borderRadius: "5px", background: "white", padding: "30px", boxShadow: "0px 0px 2px 2px #E9E9E9" }}>
										<div className="" style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam-ar" }}>
											مقدم من
										</div>
										<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
											{internshipdetail.internships[0].user_name 
											// + " (" + internshipdetail.internships[0].user_department + " )"
											}
											<hr style={{ marginTop: "0.7rem", marginBottom: "0.2rem" }} />
										</div>

										<div className="" style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam-ar" }}>
											اسم المنشأة
										</div>
										<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
											{internshipdetail.internships[0].industry_details_company_name} <hr style={{ marginTop: "0.7rem", marginBottom: "0.2rem" }} />
										</div>

										<div className="" style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam-ar" }}>
										قدمت بتاريخ
										</div>
										<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
											{formatDate(internshipdetail.internships[0].created_date)}
											<hr style={{ marginTop: "0.7rem", marginBottom: "0.2rem" }} />
										</div>

										<div className="" style={{ fontWeight: "500" }}>
										تم استناد فترة تدريب إلى
										</div>
										<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
											{internshipdetail.assigned.length !== 0 ? (internshipdetail.assigned[0].user_name + " (" + internshipdetail.assigned[0].user_department + " )") : "Not Assigned yet"}
											<hr style={{ marginTop: "0.7rem", marginBottom: "0.2rem" }} />
										</div>

										<div className="mb-1" style={{ color: "#6E6259", fontSize: "0.95rem", fontFamily: "cnam-ar" }}>
											الحالة
										</div>
										<div className="">
											<Button style={internshipdetail.internships[0].job_status === "PENDING REVIEW" ? btnstyle : btnstyle2}>{internshipdetail.internships[0].job_status}</Button>
											<hr />
										</div>

										<div className="d-flex pt-3">
											<div className="" onClick={() => props.history.push(`/discussion/${btoa(encodeURIComponent(internshipid))}`)} style={{ fontWeight: "500", fontSize: "13px", cursor: "pointer" }}>
												<SmsIcon style={{ color: "#e98300", fontSize: "17px" }} /> ({count && toArabicDigits(count.toString())}) <span style={{ fontFamily: "cnam-ar" }}> تعليقات</span>
											</div>
											<div className="font-weight-bold comment" style={{ color: "rgb(198 2 36)", fontSize: "13px", marginRight: "auto", fontFamily: "cnam-ar" }} onClick={() => props.history.push(`/discussion/${btoa(encodeURIComponent(internshipid))}`)}>
												<AddIcon style={{ color: "rgb(198 2 36)", fontSize: "12px" }} /> اضف تعليق
											</div>
										</div>
									</div>

									<div className="d-flex justify-content-around mt-3">
										<div style={{ cursor: "pointer" }} onClick={download_pdf}>
											<img src={pdf} alt="img" style={{ width: "19px" }} /> <span style={{ fontFamily: "cnam-ar" }}>تنزيل كملف</span> PDF
										</div>
										<div style={{ borderLeft: "2px solid #efeeee", height: "35px" }}></div>
										<div style={{ cursor: "pointer", fontFamily: "cnam-ar" }}>
											<a href={`mailto:?subject=cnam KPP - ${internshipdetail.internships[0].internship_job_title}&body=${share_content}`} title="Share by Email" style={{ color: "black", textDecoration: "none" }}>
												<EmailIcon style={{ color: "rgb(198 2 36)" }} />مشاركة عبر البريد الإلكتروني  
											</a>
										</div>
									</div>
									<hr style={{ borderTop: "2px solid #efeeee" }} />
								</div>
							</div>
						</div>
					)}
				</Loader>
			)}
		</>
	);
}

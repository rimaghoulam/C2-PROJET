import React from "react";

import { formatDate } from "../../functions";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { getSessionInfo } from "../../variable";

// history

export default function InternshipDetailsLeft({ props, history, job_id }) {
	return (
		<>
			{getSessionInfo("language") === "arabic" ? (
				<>
					<div className=" col-lg-6 text-right custom_scrollbar remove_customscroll_mobile" style={{ height: "100%", overflowY: "auto" }}>
						<div className="mt-4 back" style={{ color: "rgb(198 2 36)", fontFamily: "cnam-ar" }} onClick={() => history.goBack()}>
							<ArrowBackIosIcon style={{ fontSize: "13px", marginTop: "-2px", transform: "rotate(180deg)" }} />
							عودة
						</div>

						<div className="mt-3">
							<span className="h3" style={{ fontFamily: "cnam-bold" }}>
								{props.internship_job_title}
							</span>
							{getSessionInfo("role") === 4 && (
								<button className="mr-sm-1 p-2 pointer" style={{ border: "none", backgroundColor: "rgb(198 2 36)", color: "white", fontSize: "0.85rem", fontWeight: "500", fontFamily: "cnam-ar", borderRadius: "5px" }} onClick={() => history.push(`/timeline/${btoa(encodeURIComponent(job_id))}`)}>
									تحقق الجدول الزمني
								</button>
							)}
						</div>

						<div className="mt-4" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							اسم المنشآة
						</div>
						<div className="mb-2" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_institution_name}
						</div>
						<hr />

						<div className="mt-2" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							موقع المنشآة
						</div>
						<div className="mb-2" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_location}
						</div>
						<hr />

						<div className="mt-2" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							قسم
						</div>
						<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_department}
						</div>
						<hr />

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							تاريخ
						</div>
						<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							من عند {formatDate(props.internship_start_date)} till {formatDate(props.internship_end_date)}
						</div>
						<hr />

						{/* <div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							مكان العمل
						</div>
						<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_locations}
						</div>
						<hr /> */}

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							طول فترة التدريب
						</div>
						<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_length}
						</div>
						<hr />

						<div className="mt-2" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							الخطوط العريضة لخبرة البحث أو التدريب العملي وأدوار ومسؤوليات الوظيفة
						</div>
						<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_outline}
						</div>

						<hr />

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							فئة الطلاب والتخصص (التخصصات) الأكثر ملاءمة للفرصة في مؤسستك
						</div>
						<br />
						{props.internship_categorie_students === "MS" ? (
							<>
								<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
									ماجستير ، تخصص في
								</div>
								<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
									{props.student_major}
								</div>
								<hr />
							</>
						) : (
							<>
								<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
									دكتوراه تخصص في
								</div>
								<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
									{props.student_major}
								</div>
								<hr />
							</>
						)}

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							خبرة العمل السابقة أو متطلبات المهارات الفنية
						</div>
						<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_prior_work_experience}
						</div>

						<hr />

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							التعويضات والراتب
						</div>
						<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_compensation_salary}
						</div>

						<hr />
						{props.contact_details && (
							<>
								<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
									بيانات المتصل
								</div>
								<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
									{props.contact_details}
								</div>
								<hr />
							</>
						)}
						{props.internship_link && (
							<>
								<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
									رابط التدريب
								</div>
								<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
									{props.internship_link}
								</div>
								<hr />
							</>
						)}

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							{" "}
							المستندات المطلوبة
						</div>
						<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_required_document}
						</div>

						<hr />

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold-ar" }}>
							وصف موجز عن المنشأة
						</div>
						<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_brief_description}
						</div>
					</div>
				</>
			) : (
				<>
					<div className="col-lg-6 custom_scrollbar remove_customscroll_mobile" style={{ height: "100%", overflowY: "auto" }}>
						<div className="mt-4 back" style={{ color: "rgb(198 2 36)" }} onClick={() => history.goBack()}>
							<ArrowBackIosIcon style={{ fontSize: "13px", marginTop: "-2px" }} />
							Back
						</div>
						<div className="mt-3">
							<span className="h3" style={{ fontFamily: "cnam-bold" }}>
								{props.internship_job_title}
							</span>
							{getSessionInfo('role') === 4 &&
								<button className="ml-sm-1 p-2 pointer" style={{ border: "none", backgroundColor: "rgb(198 2 36)", color: "white", fontSize: "0.85rem", fontWeight: "500", fontFamily: "cnam", borderRadius: "5px" }} onClick={() => history.push(`/timeline/${btoa(encodeURIComponent(job_id))}`)}>
									Check Timeline
								</button>
							}
						</div>


						<div className="mt-4" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							Institution Name
						</div>
						<div className="mb-2" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_institution_name}
						</div>
						<hr />

						<div className="mt-2" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							Institution Location
						</div>
						<div className="mb-2" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_location}
						</div>
						<hr />

						<div className="mt-2" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							Department
						</div>
						<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_department}
						</div>
						<hr />

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							Date
						</div>
						<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							From {formatDate(props.internship_start_date)} till {formatDate(props.internship_end_date)}
						</div>
						<hr />

						{/* <div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							Job Location
						</div>
						<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_locations}
						</div> 
						<hr />*/}

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							Internship length
						</div>
						<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_length}
						</div>
						<hr />

						<div className="mt-2" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							Outline of the research or practical training experience and the roles and responsibilties of the position
						</div>
						<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_outline}
						</div>

						<hr />

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							Category of students and major(s) most appropriate for the opportunity at your institution
						</div>
						<br />
						{props.internship_categorie_students === "MS" ? (
							<>
								<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
									MS, Majoring in
								</div>
								<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
									{props.student_major}
								</div>
								<hr />
							</>
						) : (
							<>
								<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
									PhD, Majoring in
								</div>
								<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
									{props.student_major}
								</div>
								<hr />
							</>
						)}

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							Prior work experience or technical skills requirements
						</div>
						<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_prior_work_experience}
						</div>

						<hr />

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							Compensation & Salary
						</div>
						<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_compensation_salary}
						</div>

						<hr />
						{props.contact_details && (
							<>
								<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
									Contact details
								</div>
								<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
									{props.contact_details}
								</div>
								<hr />
							</>
						)}
						{props.internship_link && (
							<>
								<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
									Internship Link
								</div>
								<div className="" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
									{props.internship_link}
								</div>
								<hr />
							</>
						)}

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							List of required documents
						</div>
						<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_required_document}
						</div>

						<hr />

						<div className="" style={{ fontSize: "0.95rem", fontFamily: "cnam-bold" }}>
							A brief description about the company
						</div>
						<div className="mb-3" style={{ color: "#6E6259", fontSize: "0.95rem" }}>
							{props.internship_brief_description}
						</div>
					</div>
				</>
			)}
		</>
	);
}

import React, { useState, useEffect, } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Helmet } from "react-helmet";

// import { formatDate } from "../../functions";

import { toast } from "react-toastify";
import Loader from "react-loader-advanced";

import RichTextEditor from '../../components/RichTextEditor/RichTextEditor'
import Spinner from "../../components/spinner/Spinner";
// import DatePicker from "react-datepicker";
import InputText from "../../components/InputText/InputText";
import Selector from "../../components/Selector/Selector";

import { Button } from "reactstrap";

// import "react-datepicker/dist/react-datepicker.css";
import "./AdminContactForm.css"

import { getSessionInfo, } from "../../variable";
import { WS_LINK } from "../../globals";

export default function AdminContactForm() {
	const [loaderState, setLoaderState] = useState(false);
	const [usersList, setuserslist] = useState([]);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		// watch,
	} = useForm({
		defaultValues: {
			subject: "",
			// date: "",
			user: "",
			message: "",
		},
	});

	useEffect(() => {
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
				var tmpUsersList = [];
				tmpUsersList = res.data[1].map((user) => {
					return { value: user.user_id, label: user.user_name }
				})
				setuserslist(tmpUsersList);
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = (data) => {
		document.getElementById("requestMeeting").scrollIntoView({ behavior: "smooth", block: "center" });

		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();
		// const date = data.date.getFullYear() + "-" + ("0" + (data.date.getMonth() + 1)).slice(-2) + "-" + data.date.getDate();

		const postedData = {
			adminid: getSessionInfo('id'),
			token: getSessionInfo('token'),
			subject: data.subject,
			// date: formatDate(data.date, true),
			// date: date,
			user: data.user.value,
			message: data.message,
		};

		setLoaderState(true);

		axios({
			method: "post",
			url: `${WS_LINK}contact_industry`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				// setValue('subject', '')
				reset()
				errors.subject = false;
				// errors.date = false;
				errors.user = false;
				errors.message = false;
				// eslint-disable-next-line no-lone-blocks
				{
					getSessionInfo("language") === "english"
						? toast.success("Contacted successfully!", {
							position: "top-right",
							autoClose: 2000,
							hideProgressBar: true,
							closeOnClick: true,
							pauseOnHover: false,
							draggable: false,
							progress: undefined,
						})
						: toast.success("تم طلب الإجتماع بنجاح !", {
							position: "top-left",
							textAlign: "right",
							autoClose: 2000,
							hideProgressBar: true,
							closeOnClick: true,
							pauseOnHover: false,
							draggable: false,
							progress: undefined,
						});
				}
				setLoaderState(false);
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

	return (
		<div>
			<Helmet>
				<title>{getSessionInfo('language') === 'arabic' ?
					'أشكال الاتصال |عن برنامج الشراكة المعرفية.'
					:
					'Contact Forms  | CNAM Portal'
				}
				</title>
			</Helmet>
			<div className="col mt-sm-0 mt-4">
				<h5 style={{ fontFamily: "cnam-bold" }}>Fill the form below</h5>
				<form onSubmit={handleSubmit(onSubmit)} id="requestMeeting" className="ml-0 pl-0">
					<div className="pad-0">
						<div className="row">
							<div className="col-lg-6 col-12">
								<div className="">
									<Controller
										render={({ field: { onChange, value } }) => (
											<InputText
												id="subject"
												placeholder="Subject"
												value={value}
												onChange={onChange}
												style={{
													boxShadow: "none",
													borderColor: "#CBCBCB",
													border: errors.subject ? "1px solid red" : "",
												}}
												className=" mt-sm-4 mt-1 rad requestingMeetingInputs"
											/>
										)}
										defaultValue=""
										rules={{ required: true, minLength: 4 }}
										name="subject"
										control={control}
									/>
									{errors.subject && errors.subject.type === "required" && <span className="errors">Subject is required.</span>}
								</div>
							</div>

							<div className="col-lg-6 col-12">
								<div className="">
									<Controller
										render={({ field: { onChange, value } }) => (
											<Selector
												value={value}
												onChange={onChange}
												options={usersList}
												placeholder="User"
												// className={`pointer col-12 shadow-none form-control mt-4 ${errors.user && "border_form"}`}
												style={{
													boxShadow: "none",
													borderColor: "#CBCBCB",
													border: errors.subject ? "1px solid red" : "",
												}}
												className={`mt-sm-4 mt-1 rad requestingMeetingInputs ${errors.user && "border_form"}`}
											/>
										)}
										rules={{ required: true }}
										name="user"
										control={control}
									/>
									{errors.user && <span className="errors_c">User is required.</span>}
								</div>
							</div>
						</div>
						<div className="">

							<Controller
								render={({ field: { onChange, value } }) => (
									<RichTextEditor
										name="message"
										className="col-12 px-0 mt-3"
										placeholder="Write a reply..."
										value={value}
										onChange={onChange}
										error={errors.message}
										language='en'
									/>
								)}
								defaultValue=""
								rules={{ required: true, minLength: 4 }}
								name="message"
								control={control}
							/>

							{errors.message && errors.message.type === "required" && <span className="errors">Message is required.</span>}
						</div>

						<div className="d-flex justify-content-end mt-3 mb-1 ">
							<Loader
								message={
									<span>
										<Spinner small={true} notFixed={true} />{" "}
									</span>
								}
								show={loaderState}
								backgroundStyle={{ zIndex: "555" }}
								className="mr-3"
							></Loader>

							<Button
								// onClick={handleSubmit}
								className=""
								type="submit"
								style={{
									background: "rgb(198 2 36)",
									padding: "0.7rem 1.8rem",
									border: "none",
									fontSize: "14px",
									fontFamily: "cnam-bold",
								}}
							>
								Contact
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

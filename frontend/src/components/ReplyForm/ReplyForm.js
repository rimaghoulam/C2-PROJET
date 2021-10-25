import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import { getSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";

import { toast } from "react-toastify";
import Loader from "react-loader-advanced";

import Spinner from "../../components/spinner/Spinner";
import InputText from "../../components/InputText/InputText";
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor'

import { Button } from "reactstrap";

export default function ReplyForm(props) {
	const [loaderState, setLoaderState] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		// watch,
	} = useForm({
		defaultValues: {
			subject: "",
			message: "",
		},
	});

	const onSubmit = (data) => {
		setLoaderState(true);

		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			adminid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			subject: data.subject,
			body: data.message,
			email_to: props.emailTo,
		};

		axios({
			method: "post",
			url: `${WS_LINK}reply_to_email`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				reset();
				errors.title = false;
				errors.fullName = false;
				errors.email = false;
				errors.phone = false;
				errors.message = false;
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
				setLoaderState(false);
			})
			.catch((err) => {
				toast.error("An error occured!", {
					position: "top-right",
					autoClose: 2000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: false,
					draggable: false,
					progress: undefined,
				});
				setLoaderState(false);
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});
	};

	return (
		<div style={{ padding: "0" }}>
			<div className="col-12 h4 mt-2" style={{ fontFamily: "cnam-bold" }}>
				{" "}
				Reply:{" "}
			</div>
			<form onSubmit={handleSubmit(onSubmit)} id="requestMeeting" className="col-12">
				<div className="pad-0">
					<div className="row justify-content-center">
						<div className="col-12">
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
										className=" mt-4 rad requestingMeetingInputs"
									/>
								)}
								defaultValue=""
								rules={{ required: true, minLength: 4 }}
								name="subject"
								control={control}
							/>
							{errors.subject && errors.subject.type === "required" && <span className="errors">subject is required.</span>}
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
								/>
							)}
							defaultValue=""
							rules={{ required: true, minLength: 4 }}
							name="message"
							control={control}
						/>

						{errors.message && errors.message.type === "required" && <span className="errors">Message is required.</span>}
					</div>

					<div className="d-flex justify-content-end mt-3 mb-4 ">
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
							Reply
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}

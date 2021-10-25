import React,{ useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

import { getSessionInfo, clearSessionInfo } from "../../../variable";
import { WS_LINK } from "../../../globals";

import TextArea from "../../../components/Text-Area/TextArea";
import Modal from "../../../components/Modal/Modal";

import { Button } from "reactstrap";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

import "./mailchimpSetting.css";

export default function MailchimpSettings(props) {
	const [loaded, setLoaded] = useState(false);

	// Success modal after updating mailChimp settings //
	const [successModal, setSuccessModal] = useState(false);

	const togglesuccess = () => {
		setSuccessModal(!successModal);
	};

	const modalsuccess = (
		<>
			{getSessionInfo("language") === "english" ? (
				<>
					<div className="row  ">
						<Button
							className="ml-auto mr-4"
							style={{ width: "50px" }}
							color="link close"
							onClick={() => {
								togglesuccess();
								getData();
							}}
						>
							X
						</Button>
					</div>

					<div className="col-12 text-center">
						<h6 className="text-center">
							<div className="text-center">
								<div>
									<CheckCircleOutlineIcon className="" style={{ fontSize: "50", color: "rgb(198 2 36)" }} />
								</div>
								<div className="font-weight-bold mt-4 mb-4">Mail Chimp Settings updated successfully</div>
								<div className="text-center"></div>
							</div>
						</h6>
					</div>
					<div className="col-12 text-center">
						<Button
							onClick={() => {
								togglesuccess();
								getData();
							}}
							style={{ backgroundColor: "rgb(198 2 36)", borderColor: "rgb(198 2 36)" }}
						>
							Ok
						</Button>
					</div>
				</>
			) : (
				// SUCCESS MODAL ARABIC

				<div style={{ textAlign: "right" }}>
					<div className="row  ">
						<Button
							className="mr-auto ml-4"
							style={{ width: "50px" }}
							color="link close"
							onClick={() => {
								togglesuccess();
								getData();
							}}
						>
							X
						</Button>
					</div>

					<div className="col-12 text-center">
						<h6 className="text-center">
							<div className="text-center">
								<div>
									<CheckCircleOutlineIcon className="" style={{ fontSize: "50", color: "rgb(198 2 36)" }} />
								</div>
								<div className=" mt-4 mb-4" style={{ fontFamily: "cnam-bold-ar" }}>
									تم تحديث إعدادات
									{" "}<span style={{ fontFamily: 'cnam-bold' }}>Mail Chimp</span>
									{" "}
									بنجاح
								</div>
								<div className="text-center"></div>
							</div>
						</h6>
					</div>

					<div className="col-12 text-center">
						<Button
							onClick={() => {
								togglesuccess();
								getData();
							}}
							style={{ backgroundColor: "rgb(198 2 36)", borderColor: "rgb(198 2 36)", fontFamily: 'cnam-bold-ar' }}
						>
							نعم
						</Button>
					</div>
				</div>

			)}
		</>
	);
	// -- //

	useEffect(() => {
		props.setPageTitle('Mailchimp Settings', 'إعدادات mailchimp')
		getData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const {
		control,
		handleSubmit,
		// watch,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: { base: "", api: "", reply_to: "", form_name: "" },
	});

	const getData = () => {
		props.toggleSpinner(true);
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
		};

		axios({
			method: "post",
			url: `${WS_LINK}get_mailchimp_settings`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data === "token error") {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				} else {
					setValue("base", res.data[0].settings_value);
					setValue("api", res.data[1].settings_value);
					setValue("reply_to", res.data[2].settings_value);
					setValue("form_name", res.data[3].settings_value);

					setLoaded(true);
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
	};

	const onSubmit = (data) => {
		props.toggleSpinner(true);
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
			base: data.base,
			api: data.api,
			reply_to: data.reply_to,
			form_name: data.form_name,
		};

		axios({
			method: "post",
			url: `${WS_LINK}update_mailchimp_settings`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data === "token error") {
					clearSessionInfo();
					window.location.reload(false).then(props.history.replace("/"));
				} else {
					togglesuccess();
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
	};


	return (
		<div className="BodyHeight w-100">
			{successModal && <Modal id="success" name="successModal" modalState={successModal} changeModalState={togglesuccess} modalBody={modalsuccess} />}

			<div className="scroll-in-body custom_scrollbar remove_scroll_mobile" style={{ overflowX: 'hidden' }}>
				{loaded && (
					<>
						<form className="col-12 mt-2 row mb-5" onSubmit={handleSubmit(onSubmit)}>
							<div className="col-lg-12">
								<div className="h5 ">Api </div>
								<div className="">
									<Controller
										render={({ field: { onChange, value } }) => <TextArea className="col-12 mt-3" maxRows={5} minRows={3} placeholder="Please enter text" style={{ resize: "none", border: errors.api && "1px solid red" }} value={value} onChange={onChange} />}
										rules={{
											required: true,
										}}
										name="api"
										control={control}
									/>
									{errors.api && <span className="errors">Text Required!</span>}
								</div>
							</div>

							<div className="col-lg-12">
								<div className="h5 ">Base </div>
								<div className="">
									<Controller
										render={({ field: { onChange, value } }) => <TextArea className="col-12 mt-3" maxRows={5} minRows={3} placeholder="Please enter text" style={{ resize: "none", border: errors.base && "1px solid red" }} value={value} onChange={onChange} />}
										rules={{
											required: true,
										}}
										name="base"
										control={control}
									/>
									{errors.base && <span className="errors">Text Required!</span>}
								</div>
							</div>

							<div className="col-lg-12">
								<div className="h5 ">Reply to </div>
								<div className="">
									<Controller
										render={({ field: { onChange, value } }) => <TextArea className="col-12 mt-3" maxRows={5} minRows={3} placeholder="Please enter text" style={{ resize: "none", border: errors.reply_to && "1px solid red" }} value={value} onChange={onChange} />}
										rules={{
											required: true,
										}}
										name="reply_to"
										control={control}
									/>
									{errors.reply_to && <span className="errors">Text Required!</span>}
								</div>
							</div>

							<div className="col-lg-12">
								<div className="h5 ">Form Name </div>
								<div className="">
									<Controller
										render={({ field: { onChange, value } }) => <TextArea className="col-12 mt-3" maxRows={5} minRows={3} placeholder="Please enter text" style={{ resize: "none", border: errors.form_name && "1px solid red" }} value={value} onChange={onChange} />}
										rules={{
											required: true,
										}}
										name="form_name"
										control={control}
									/>
									{errors.form_name && <span className="errors">Text Required!</span>}
								</div>
							</div>

							<div className="ml-auto mr-3 mt-4 d-flex flex-row justify-content-end">
								<Button style={{ marginLeft: 'auto', backgroundColor: "rgb(198 2 36)", borderColor: "rgb(198 2 36)" }}>Submit</Button>
							</div>
						</form>
					</>
				)}
			</div>
		</div>
	);
}

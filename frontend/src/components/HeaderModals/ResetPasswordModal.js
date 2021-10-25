import React from 'react'

import { Button } from 'reactstrap';

import { getSessionInfo } from '../../variable';

import check from '../../assets/images_png/check.png'

import CancelIcon from '@material-ui/icons/Cancel';


// passwordValueState      togglePasswordModal      changeLoginState   toggleopenforgot


export default function ResetPasswordModal(props) {
    return (
		<>
			{getSessionInfo("language") === "english" ? (
				<div>
					<div className="row justify-content-end">
						<Button className="d-flex justify-content-end mr-1" color="link close" onClick={props.togglePasswordModal}>
							X
						</Button>
					</div>

					<div className="col-12 text-center">
						<h6 className="text-center">
							{props.passwordValueState === "not ok" ? (
								<div className="text-center">
									<div>
										<CancelIcon className="" style={{ fontSize: "50", color: "rgb(198 2 36)" }} />
									</div>
									<div className="font-weight-bold mt-4 mb-4">This Email is Not Valid </div>
									<div className="text-center">
										<Button
											onClick={() => {
												props.changeLoginState();
												props.togglePasswordModal();
												props.toggleopenforgot();
											}}
											className="px-5 mb-2"
											style={{
												color: "black",
												borderColor: "rgb(198 2 36)",
												backgroundColor: "transparent",
												fontSize: "0.9rem",
												fontWeight: "500",
											}}
										>
											Try Again
										</Button>
									</div>
								</div>
							) : (
								<div className="text-center">
									<div>
										<img src={check} width={75} alt="" />
									</div>
									<div className="font-weight-bold mt-4 mb-4">Password reset email sent</div>
								</div>
							)}
						</h6>
					</div>
				</div>
			) : (
				<div style={{ fontFamily: "cnam-ar", textAlign: "right", direction: "rtl" }}>
					<div className="row  ">
						<Button className="mr-auto ml-4" style={{ fontFamily: "cnam" }} color="link close" onClick={props.togglePasswordModal}>
							X
						</Button>
					</div>

					<div className="col-12 text-center">
						<h6 className="text-center">
							{props.passwordValueState === "not ok" ? (
								<div className="text-center">
									<div>
										<CancelIcon className="" style={{ fontSize: "50", color: "rgb(198 2 36)" }} />
									</div>
									<div className=" mt-4 mb-4" style={{ fontFamily: "cnam-ar" }}>
										هذا البريد الإلكتروني غير صالح
									</div>
									<div className="text-center">
										<Button
											onClick={() => {
												props.changeLoginState();
												props.togglePasswordModal();
												props.toggleopenforgot();
											}}
											className="px-5 mb-2"
											style={{
												color: "black",
												borderColor: "rgb(198 2 36)",
												backgroundColor: "transparent",
												fontSize: "0.9rem",
												fontWeight: "500",
											}}
										>
											Try Again
										</Button>
									</div>
								</div>
							) : (
								<div className="text-center">
									<div>
										<img src={check} width={75} alt="" />
									</div>
									<div className=" mt-4 mb-4" style={{ fontFamily: "cnam-ar" }}>
										تم إرسال رسالة لتغيير كلمة المرور{" "}
									</div>
								</div>
							)}
						</h6>
					</div>
				</div>
			)}
		</>
	);
}

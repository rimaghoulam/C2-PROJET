import React from "react";
import Skeleton from "react-loading-skeleton";

import Coma from "../../assets/images_svg/coma.svg";

export default function Quote(props) {
	return (
		<>
			{props.language === "english" ? (
				<>
					<div className="p-lg-5 p-2 pt-5 pb-5">
						<div className="h1">
							<img src={Coma} width={30} alt="Coma" />
						</div>
						<div
							className="mt-2"
							style={{
								fontSize: "18px",
								lineHeight: "140%",
								color: "#5A5A5A",
							}}
						>
							{props.body}
						</div>

						<div className="">
							<img className="" style={{ transform: "rotate(180deg)", float: "right" }} src={Coma} width={30} alt="Coma" />
						</div>

						<div className="d-flex mt-5">
							<div>
								{props.profile_pic === "" ? ( // If no profile_pic is provided
									<Skeleton circle={true} height={80} width={80}/>
								) : (
									// If profile_pic provided
									<div style={{ width: "80px", height: "80px" }}>
										<img src={props.profile_pic} alt="profile_pic" width="80px" height="80px" style={{ borderRadius: "50%" }} />
									</div>
								)}
							</div>
							<div className="ml-1 ml-sm-5">
								<div className="mt-3 text-nowrap" style={{ fontSize: "16px", fontFamily: "cnam-bold" }}>
									{props.author}
								</div>
								<div className="text-nowrap" style={{ fontSize: "16px" }}>
									{props.role}
								</div>
							</div>
						</div>
					</div>
				</>
			) : (
				// If language is arabic

				<div className="p-lg-5 p-2 pt-5 pb-5" style={{ direction: "rtl" }}>
					<div className="h1">
						<div className="my-2">
							<img className="d-block" style={{ transform: "rotatex(180deg) rotatey(180deg)" }} src={Coma} width={30} alt="Coma" />
						</div>
					</div>
					<div
						className="mt-2 mb-2 text-right "
						style={{
							fontSize: "18px",
							lineHeight: "30px",
							color: "#5A5A5A",
						}}
					>
						{props.body}
					</div>

					<div className="my-2">
						<img className="" style={{ float: "left" }} src={Coma} width={30} alt="Coma" />
					</div>

					<div className="d-flex mt-5">
						<div>
							{props.profile_pic === "" ? ( // If no profile_pic is provided
									<Skeleton circle={true} height={80} width={80}/>
							) : (
								// If profile_pic provided
								<div style={{ width: "80px", height: "80px" }}>
									<img src={props.profile_pic} alt="profile_pic" width="80px" height="80px" style={{ borderRadius: "50%" }} />
								</div>
							)}
						</div>
						<div className="mr-2">
							<div className="mt-3 text-nowrap text-right" style={{ fontSize: "16px", fontFamily: "cnam-bold-ar" }}>
								{props.author}
							</div>
							<div className="text-nowrap" style={{ fontSize: "16px" }}>
								{props.role}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

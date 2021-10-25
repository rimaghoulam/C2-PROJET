import React, { useEffect, useState } from "react";
import axios from "axios";


import { getSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";

import "../../App.css";

export default function Footer(props) {
	// const [footerValue, setFooterValue] = useState({})
	const [footerValue, setFooterValue] = useState({
		footer_en_l: "",
		footer_ar_l: "",
		footer_en_r: "",
		footer_ar_r: "",
		widget_1_en: "",
		widget_1_ar: "",
		widget_2_en: "",
		widget_2_ar: "",
		widget_3_en: "",
		widget_3_ar: "",
		widget_4_en: "",
		widget_4_ar: "",
		socials: [],
	});

	useEffect(() => {
		//* If props.data (the text values) are not valid call get_page_component api)
		if (!props.data) {
			const cancelToken = axios.CancelToken;
			const source = cancelToken.source();

			const postedData = {
				page_id: 1,
				// type: 'media',
				// userid: getSessionInfo('id'),
				// token: getSessionInfo('token')
			};

			axios({
				method: "post",
				url: `${WS_LINK}get_page_component`,
				data: postedData,
				cancelToken: source.token,
			})
				.then((res) => {
					setFooterValue({
						footer_en_l: res.data.footer[0].english,
						footer_ar_l: res.data.footer[0].arabic,
						footer_en_r: res.data.footer[5].english,
						footer_ar_r: res.data.footer[5].arabic,
						widget_1_en: res.data.footer[1].english,
						widget_1_ar: res.data.footer[1].arabic,
						widget_2_en: res.data.footer[2].english,
						widget_2_ar: res.data.footer[2].arabic,
						widget_3_en: res.data.footer[3].english,
						widget_3_ar: res.data.footer[3].arabic,
						widget_4_en: res.data.footer[4].english,
						widget_4_ar: res.data.footer[4].arabic,
						// socials: res.data.social,
					});
				})
				.catch((err) => {
					if (axios.isCancel(err)) {
						console.log("request canceled");
					} else {
						console.log("request failed");
					}
				});
		} else {
			setFooterValue({
				footer_en_l: props.data[0].english,
				footer_ar_l: props.data[0].arabic,
				footer_en_r: props.data[5].english,
				footer_ar_r: props.data[5].arabic,
				widget_1_en: props.data[1].english,
				widget_1_ar: props.data[1].arabic,
				widget_2_en: props.data[2].english,
				widget_2_ar: props.data[2].arabic,
				widget_3_en: props.data[3].english,
				widget_3_ar: props.data[3].arabic,
				widget_4_en: props.data[4].english,
				widget_4_ar: props.data[4].arabic,
				socials: props.socials,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//* The first time the footer is rendered the api that contains the socials icons may not have finished
	//* if socials are passed to the footer and footerValue.socials is still empty (to avoid infinite re-renders)
	if (props.socials && !footerValue.socials) setFooterValue({ ...footerValue, socials: props.socials });

	return (
		<div style={{ height: "fit-content" }}>
			{getSessionInfo("language") === "english" ? (
				<div className={props.class ? `largeFooter ${props.class}` : "largeFooter"}>
					<div className="row" style={{ margin: "0 -30px" }}>
						<div
							className={`d-md-flex justify-content-around col-md-12 pt-5 pb-5 largeFooter3 ${props.footer3class}`}
							style={{ backgroundColor: "#f5f1ee" }}
						>
							<div
								className="col-12 col-md-2 p-2 flex-fill  mb-5 mb-md-0 text-center logoMobile pl-1 pl-md-0"
								style={{ marginLeft: "2.75rem" }}
							>
								<span dangerouslySetInnerHTML={{ __html: footerValue.widget_1_en }} />
							</div>
							<div className="col-12 col-md-7 row ml-1">
								<div className="col-5 p-0 p-md-2 flex-fill  mb-3 mb-md-0" style={{ fontSize: "15px" }}>
									<span dangerouslySetInnerHTML={{ __html: footerValue.widget_2_en }} />
								</div>

								<div className="col-5 p-0 p-md-2 flex-fill  mb-3 mb-md-0 ml-5 ml-md-0" style={{ fontSize: "15px" }}>
									<span dangerouslySetInnerHTML={{ __html: footerValue.widget_3_en }} />
								</div>
							</div>
							<div className="col-12 col-md-3 p-2 flex-fill  mb-3 mb-md-0 ml-2 ml-md-0">
								<div className="h6 mb-2" style={{ fontSize: "15px" }}>
									<span dangerouslySetInnerHTML={{ __html: footerValue.widget_4_en }} />
								</div>
								<div className="d-flex ">
									{footerValue.socials &&
										footerValue.socials.map((item, index) => {
											return (
												<div key={ item.social_id } className={index === 0 ? "" : "ml-1"}>
													<a href={item.social_link} style={{ color: "#2a2c36" }} rel="noreferrer" target="_blank">
														<img
															src={item.social_icon}
															height="20px"
															width="20px"
															alt="icon"
															style={{ color: "#727272", fontSize: "20px" }}
														/>
													</a>
												</div>
											);
										})}
								</div>
							</div>
						</div>
					</div>
					<div
						className="row bottom-part"
						style={{
							backgroundColor: "#444444",
							color: "#ffffff",
							margin: "0 -30px",
						}}
					>
						<div
							className="d-lg-flex justify-content-between col-md-12 largeFooter2 smallFooter"
							style={{ padding: "0px 10rem", alignItems: "center" }}
						>
							<div className="p-2 flex-fill justify-content-left contactusFooterClass text-left" style={{ alignItems: "left" }}>
								<div className="pt-0 mt-0" style={{ color: "#B9B9B9", fontSize: "12px", alignItems: "center" }}>
									&nbsp;&nbsp;
									<span>
										<span dangerouslySetInnerHTML={{ __html: footerValue.footer_en_l }} />
									</span>
								</div>
							</div>
							<div className="p-2 flex-fill justify-content-left contactusFooterClass text-right" style={{ alignItems: "center" }}>
								<div className="pt-0 mt-0" style={{ color: "#B9B9B9", fontSize: "12px", alignItems: "center" }}>
									&nbsp;&nbsp;
									<span>
										<span dangerouslySetInnerHTML={{ __html: footerValue.footer_en_r }} />
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className={`largeFooter ${props.class && props.class}`}>
					<div className="row" style={{ fontFamily: "cnam-ar", margin: "0 -30px" }}>
						<div
							className={`d-md-flex justify-content-around col-md-12 pt-5 pb-5 largeFooter3 ${props.footer3class}`}
							style={{ backgroundColor: "#f5f1ee", textAlign: "right" }}
						>
							<div
								className="col-12 col-md-2 p-2 flex-fill  mb-5 mb-md-0 text-center logoMobile pr-4 pr-md-0"
								style={{ marginRight: "2.75rem", textAlign: "right" }}
							>
								<span dangerouslySetInnerHTML={{ __html: footerValue.widget_1_ar }} />
							</div>
							<div className="col-12 col-md-7 row mr-4">
								<div className="col-5 p-0 p-md-2 flex-fill  mb-3 mb-md-0" style={{ fontSize: "15px" }}>
									<span dangerouslySetInnerHTML={{ __html: footerValue.widget_2_ar }} />
								</div>

								<div className="col-5 p-0 p-md-2 flex-fill  mb-3 mb-md-0 ml-5 ml-md-0" style={{ fontSize: "15px" }}>
									<span dangerouslySetInnerHTML={{ __html: footerValue.widget_3_ar }} />
								</div>
							</div>
							<div className="col-12 col-md-3 p-2 flex-fill  mb-3 mb-md-0 mr-4 mr-md-0">
								<div className="h6 mb-2" style={{ fontSize: "15px" }}>
									<span dangerouslySetInnerHTML={{ __html: footerValue.widget_4_ar }} />
								</div>
								<div className="d-flex ">
									{footerValue.socials &&
										footerValue.socials.map((item, index) => {
											return (
												<div key={ item.social_is } className={index === 0 ? "" : "mr-1"}>
													<a href={item.social_link} style={{ color: "#2a2c36" }} rel="noreferrer" target="_blank">
														<img
															src={item.social_icon}
															height="20px"
															width="20px"
															alt="icon"
															style={{ color: "#727272", fontSize: "20px" }}
														/>
													</a>
												</div>
											);
										})}
								</div>
							</div>
						</div>
					</div>
					<div
						className="row bottom-part"
						style={{
							backgroundColor: "#444444",
							color: "#ffffff",
							margin: "0 -30px",
							fontFamily: "cnam",
						}}
					>
						<div
							className="d-lg-flex justify-content-between col-md-12 largeFooter2 smallFooter  text-right"
							style={{ padding: "0px 10rem", direction: "rtl", fontFamily: "cnam-ar" }}
						>
							<div className="p-2 row flex-fill  justify-content-right ">
								<div className="p-2 d-lg-flex">
									<div className="p-2 flex-fill d-flex text-right" style={{ color: "#B9B9B9", fontSize: "12px" }}>
										<span dangerouslySetInnerHTML={{ __html: footerValue.footer_ar_l }} />
									</div>
								</div>
							</div>
							<div className="p-2 flex-fill mb-3 mb-md-1 mt-md-0 justify-content-left contactusFooterClass pb-3 text-left">
								<p className="pt-0 mt-0 text-right " style={{ color: "#B9B9B9", fontSize: "12px" }}>
									&nbsp;&nbsp;
									<span>
										<span dangerouslySetInnerHTML={{ __html: footerValue.footer_ar_r }} />
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

import { Button } from "reactstrap";
import Loader from "react-loader-advanced";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";
import { checkFontFamily, translate, formatDate, makePostRequest } from "../../functions";

import InputText from "../../components/InputText/InputText";
import Footer from "../../components/footer/Footer";
import Spinner from "../../components/spinner/Spinner";
import TestimonialSlider from "../../components/Testimonial-Slider/TestimonialSlider";
import NewsContainer from "../../components/NewsComponent/NewsContainer";
import StatisticsCard from "../../components/statisticsCard/statisticsCard";

import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import HomeSlider from "../../components/HomeSlider/HomeSlider";

import Skeleton from "react-loading-skeleton";

import AOS from "aos";
import "aos/dist/aos.css";
import InputNumeric from "../../components/InputNumeric/InputNumeric";

export default function Home(props) {
	const [loaderState, setLoaderState] = useState(false); // a spinner on the contact us form only

	const [PAGEDATA, setPageData] = useState({});
	const [IMAGEDATA, setImageData] = useState({});

	const {
		control,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: "",
			fullName: "",
			email: "",
			phone: "",
			time: "",
		},
	});

	const onSubmit = (data) => {
		document.getElementById("requestMeeting").scrollIntoView({ behavior: "smooth", block: "center" });

		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			title: data.title,
			name: data.fullName,
			email: data.email,
			phone: data.phone,
			time: formatDate(data.time, true),
		};

		setLoaderState(true);

		axios({
			method: "post",
			url: `${WS_LINK}request_meeting`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				setValue("title", "");
				setValue("fullName", "");
				setValue("email", "");
				setValue("phone", "");
				setValue("time", "");
				errors.title = false;
				errors.fullName = false;
				errors.email = false;
				errors.phone = false;
				errors.time = false;

				getSessionInfo("language") === "english"
					? toast.success("Meeting requested successfully!", {
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
				setLoaderState(false);

				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});
	};

	useEffect(() => {
		props.setPageTitle("CNAM PORTAL", "برنامج الشراكة المعرفية عن");

		makePostRequest("get_page_component", {
			page_id: 1,
		})
			.then((data) => {
				setPageData({ ...data });
				AOS.init({
					once: true,
					duration: 1500,
				});
			})
			.catch((err) => console.log(err));

		// for the images
		makePostRequest("get_page_component", {
			page_id: 1,
			type: "media",
		})
			.then((data) => {
				setImageData({ ...data });
			})
			.catch((err) => console.log(err));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// * *****************************************************************************************
	// * *****************************************************************************************
	// * *****************************************************************************************
	// * *****************************************************************************************

	const language = getSessionInfo("language");
	// console.log(PAGEDATA.sliders)
	// console.log(IMAGEDATA)

	return (
		<>
			{
				Object.keys(PAGEDATA).length > 0 ? (
					<div
						className="bg-white hide_scrollbar largeScreen px-3 px-lg-0 homePageBigContainer"
						style={{ overflowY: "visible", fontFamily: checkFontFamily() }}
					>
						{PAGEDATA.components[12].status === 1 && PAGEDATA.sliders && (
							<div className="homeSlider" style={{ margin: "0 -15px" }}>
								<HomeSlider data={PAGEDATA.sliders} img_data={IMAGEDATA.sliders} history={props.history} />
							</div>
						)}

						<div className="pad-0 ">
							{/* //* *************************************************************************** */}
							{/* //* *************************************************************************** */}
							{/* //* *************************************************************************** */}

							<div className="row justify-content-center">
								<div className="col-lg-5  pt-0 pt-lg-4">
									<div
										className="mt-5"
										style={{
											fontSize: "28px",
											lineHeight: "125%",
											fontFamily: checkFontFamily(true),
										}}
										data-aos={translate("fade-right", "fade-left")}
										data-aos-delay="50"
									>
										{PAGEDATA.components[0].status === 1 && PAGEDATA.components[0][language]}
									</div>
									<div
										className="mt-3"
										style={{
											fontSize: "18px",
											maxWidth: "90%",
											lineHeight: "140%",
											color: "#7f7f7f",
										}}
										data-aos={translate("fade-right", "fade-left")}
										data-aos-delay="100"
									>
										{PAGEDATA.components[1].status === 1 && PAGEDATA.components[1][language]}
									</div>
									{PAGEDATA.components[2].status === 1 && PAGEDATA.components[3].status === 1 && (
										<a href={PAGEDATA.components[3][language]}>
											<Button
												className="mt-4 getstarted_first"
												style={{
													background: "rgb(198 2 36)",
													padding: "0.7rem 1.8rem",
													border: "none",
													marginTop: "0.7rem",
													fontFamily: checkFontFamily(true),
												}}
												data-aos={translate("fade-right", "fade-left")}
												data-aos-delay="200"
											>
												{PAGEDATA.components[2][language]}
											</Button>
										</a>
									)}
								</div>
								<div className="col-lg-5 text-right" data-aos="fade-in" data-aos-delay="100">
									{PAGEDATA.components[11].status === 1 && (
										<div
											dangerouslySetInnerHTML={{
												__html: PAGEDATA.components[11][language] && PAGEDATA.components[11][language],
											}}
											className="homePageVideo"
										/>
									)}
									{Object.keys(IMAGEDATA).length > 0 ? (
										IMAGEDATA.components[0].status === 1 && (
											<img
												className="industry_innovation_image"
												style={{ width: "100%" }}
												src={IMAGEDATA.components[0][language] && IMAGEDATA.components[0][language]}
												alt={""}
											/>
										)
									) : (
										<Skeleton height={300} />
									)}
								</div>
							</div>

							{/* //* *************************************************************************** */}
							{/* //* *************************************************************************** */}
							{/* //* *************************************************************************** */}

							<div className="pad-0 about_industry_full_div mb-5 pb-5">
								<div className="row justify-content-center">
									<div className="col-lg-5 about_industry_image" data-aos="fade-in" data-aos-delay="100">
										{Object.keys(IMAGEDATA).length > 0 ? (
											<img
												src={IMAGEDATA.components[1].status === 1 && IMAGEDATA.components[1][language]}
												alt={""}
												style={{ width: "100%", background: "#D5D5D5" }}
											/>
										) : (
											<Skeleton height={300} />
										)}
									</div>

									<div className="col-lg-5 ">
										<div
											className="pt-3 pt-lg-4"
											style={{
												fontSize: "28px",
												lineHeight: "125%",
												fontFamily: checkFontFamily(true),
											}}
											data-aos={translate("fade-left", "fade-right")}
											data-aos-delay="50"
										>
											{PAGEDATA.components[4].status === 1 && PAGEDATA.components[4][language]}
										</div>
										<div
											className="mt-3"
											style={{
												fontSize: "18px",
												maxWidth: "90%",
												lineHeight: "140%",
												color: "#7f7f7f",
											}}
											data-aos={translate("fade-left", "fade-right")}
											data-aos-delay="100"
										>
											{PAGEDATA.components[5].status === 1 && PAGEDATA.components[5][language]}
										</div>
										{PAGEDATA.components[6].status === 1 && PAGEDATA.components[7].status === 1 && (
											<div
												className="mt-4 mb-5 learnMoreHome pointer"
												style={{
													color: "rgb(198 2 36)",
													fontFamily: checkFontFamily(true),
													fontSize: "18px",
												}}
												data-aos={translate("fade-left", "fade-right")}
												data-aos-delay="200"
											>
												<a style={{ color: "rgb(198, 2, 36)" }} className="link" href={PAGEDATA.components[7][language]}>
													{PAGEDATA.components[6][language]}
												</a>
												{translate(
													<ArrowForwardIcon className="learnMoreHomeArrow" style={{ fontSize: "16px" }} />,
													<ArrowBackIcon className="learnMoreHomeArrow-ar" style={{ fontSize: "16px" }} />
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

				
						<Footer data={PAGEDATA.footer} socials={IMAGEDATA.social} />
					</div>
				) : (
					// * *****************************************************************************************
					// * **********************************if page not loaded*************************************
					// * *****************************************************************************************
					// * *****************************************************************************************

					<Spinner small={true} notFixed={true} />
				)
				// <Skeleton className="BodyHeight w-100" />
			}
		</>
	);
}

import React from "react";
import Slider from "react-slick";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../../App.css";
import "./homeSlider.css";

import { getSessionInfo } from "../../variable";
import { translate } from "../../functions";

export default function HomeSlider({ data, history, className, style, img_data }) {
	const settings = {
		arrows: true,
		dots: false,
		infinite: true,
		speed: 400,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		cssEase: "linear",
		initialSlide: getSessionInfo("language") === "english" ? 0 : 1,
		rtl: getSessionInfo("language") === "english" ? false : true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
					initialSlide: getSessionInfo("language") === "english" ? 0 : 1,
					rtl: getSessionInfo("language") === "english" ? "false" : "true",
					dots: false,
				},
			},
		],
	};

	let sliderContent = [];

	// img_data = null;

	// If images have been loaded
	if (img_data) {
		if (getSessionInfo("language") === "english") {
			sliderContent = data.map((item, index) => {
				return (
					<div key={`home-slider${index}`}>
						<div
							
							className="homeSliderImg px-lg-4 px-3 "
							style={{
								height: "100%",
								backgroundImage: `url('${img_data[index].slider_image}')`,
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								backgroundSize: "cover",
							}}
						>
							{/* style={{ height:'calc(100vh - 110px)' }} */}
							<div className="card-overlay" style={{ height: "calc(100vh - 110px)", overflowY: "auto" }}>
								<div className="sliderText px-md-5 px-3 py-3 d-flex flex-column" style={{}}>
									<div>
										<div className="sliderTextTitle" style={{ fontFamily: "cnam-bold", color: "white" }}>
											<h3>{item.slider_title}</h3>
										</div>
										<div className="sliderTextText fs-5" style={{ color: "white" }}>
											{item.slider_subtitle}
										</div>
									</div>
									<div className="sliderTextButton  my-3">
										<button
											className="btn btn-secondary"
											onClick={() => history.push(item.btn_link)}
											style={{ background: "rgb(198 2 36)", border: "none" }}
										>
											{item.btn_text}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			});
		} else {
			sliderContent = data.map((item, index) => {
				return (
					<div key={`home-slider${index}`}>
						<div
							key={`home-slider${index}`}
							className="homeSliderImg px-lg-4 px-3"
							style={{
								height: "100%",
								backgroundImage: `url('${img_data[index].slider_image}')`,
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								backgroundSize: "cover",
								direction: "rtl",
							}}
						>
							{/* style={{ height:'calc(100vh - 110px)' }} */}
							<div className="card-overlay" style={{ height: "calc(100vh - 110px)", overflowY: "auto" }}>
								<div className="sliderText-ar px-md-5 px-3 py-3 d-flex flex-column" style={{}}>
									<div>
										<div className="sliderTextTitle" style={{ fontFamily: "cnam-bold-ar", color: "white" }}>
											<h3>{item.slider_title_ar}</h3>
										</div>
										<div className="sliderTextText fs-5" style={{ color: "white" }}>
											{item.slider_subtitle_ar}
										</div>
									</div>
									<div className="sliderTextButton  my-3">
										<button
											className="btn btn-secondary"
											onClick={() => history.push(item.btn_link_ar)}
											style={{ background: "rgb(198 2 36)", border: "none" }}
										>
											{item.btn_text_ar}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			});
		}
	}
	// If the text content is loaded but media are still loading
	else {
		return (
			<div style={{ height: "100vh" }}>
				<SkeletonTheme color="#c5c5c5" highlightColor="#cacaca">
					<Skeleton className="BodyHeight w-100" />
				</SkeletonTheme>
				<div style={{ position: "absolute", top: "1%", left: "0" }}>
					{data.map((item, index) => {
						return (
							<div key={`home-slider${index}`}>
								<div
									className="homeSliderImg px-lg-4 px-3 "
									style={{
										height: "100%",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "cover",
									}}
								>
									{/* style={{ height:'calc(100vh - 110px)' }} */}
									<div className="card-overlay" style={{ height: "calc(100vh - 110px)", overflowY: "auto" }}>
										<div
											className={`${translate("sliderText", "sliderText-ar")} px-md-5 px-3 py-3 d-flex flex-column`}
											style={{}}
										>
											<div>
												<div
													className="sliderTextTitle"
													style={{ fontFamily: translate("cnam-bold", "cnam-bol-ar"), color: "white" }}
												>
													<h3>{translate(item.slider_title, item.slider_title_ar)}</h3>
												</div>
												<div className="sliderTextText fs-5" style={{ color: "white" }}>
													{translate(item.slider_subtitle, item.slider_subtitle_ar)}
												</div>
											</div>
											<div className="sliderTextButton  my-3">
												<button
													className="btn btn-secondary"
													onClick={() => history.push(translate(item.btn_link, item.btn_link_ar))}
													style={{ background: "rgb(198 2 36)", border: "none" }}
												>
													{translate(item.btn_text, item.btn_text_ar)}
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	return (
		<Slider {...settings} className={className} style={style}>
			{sliderContent}
		</Slider>
	);
}

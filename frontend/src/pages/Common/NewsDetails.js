import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { Helmet } from "react-helmet";

import { useParams } from "react-router";

import { getSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";
import { formatDate } from "../../functions";

import Footer from "../../components/footer/Footer";
import Modal from "../../components/Modal/Modal";

import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./IndustryKpp.css";
import "./NewsDetails.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Tooltip from "@material-ui/core/Tooltip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PrintIcon from "@material-ui/icons/Print";
import FileCopyIcon from "@material-ui/icons/FileCopy";

const settings = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1,
};

export default function NewsDetails(props) {
	let { newsId } = useParams();
	const newsIdUrl = newsId;
	if (newsId !== undefined) newsId = decodeURIComponent(atob(newsId));
	else props.history.replace("/");

	const [imageSlider, setImageSlider] = useState(false);

	// when we click an image and open in modal multiple times 3am ysir kaza render this state solve it
	const [firstTime, setfirstTime] = useState(true);

	// For tooltip
	const [open, setOpen] = React.useState(false);

	const toggleImageSlider = () => {
		setImageSlider((p) => !p);
	};

	const handleTooltipClose = () => {
		setOpen(false);
	};

	const handleTooltipOpen = () => {
		setOpen(true);
	};

	const [pageData, setPageData] = useState({
		components: {},
		footer: [],
		social: [],
	});

	useEffect(() => {
		props.setPageTitle('News Details', 'تفاصيل الأخبار')
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			media_id: newsId,
		};

		props.toggleSpinner(true);

		axios({
			method: "post",
			url: `${WS_LINK}get_media`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				setPageData({ components: { ...res.data.media_details[0] }, footer: res.data.footer, social: res.data.social });
				props.toggleSpinner(false);
			})
			.catch((err) => {
				props.toggleSpinner(false);
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const shareDetailsHandle = (platform, id) => {
		const url_to_share = encodeURIComponent(`http://kpp.cnam.edu.sa/news_details/${id}/`);
		var share_link;
		switch (platform) {
			case "linkedin":
				share_link = `https://www.linkedin.com/shareArticle
								?mini=true
								&url=${url_to_share}
								&title=${encodeURIComponent(getSessionInfo("language") === "englsih" ? pageData.components.title_e : pageData.components.title_a)}
								&summary=${encodeURIComponent(getSessionInfo("language") === "englsih" ? pageData.components.text_e : pageData.components.text_a)}
								&source=cnam KPP`;
				break;
			case "twitter":
				share_link = `https://twitter.com/intent/tweet
								?url=${url_to_share}
								&text=${encodeURIComponent(getSessionInfo("language") === "englsih" ? pageData.components.text_e : pageData.components.text_a)}
								`;
				break;
			case "facebook":
				share_link = `https://www.facebook.com/sharer.php?u=${url_to_share}`;
				break;
			case "mail":
				window.location = `mailto:?subject=cnam KPP Article&body=${url_to_share}`;
				break;
			case "print":
				window.print();
				break;
			case "copy":
				navigator.clipboard.writeText(decodeURIComponent(url_to_share));
				break;
			default:
				break;
		}
		share_link && window.open(share_link, "_blank");
	};

	let all_images = [];

	const more_e = pageData.components.more_e;
	if (more_e) {
		var str = more_e.split("<img src=");
		var i = 1;
		all_images.push(pageData.components.image);
		for (i; i < str.length; i++) {
			all_images.push(str[i].split("\"")[1].replaceAll('"', ""));
		}
	}

	const modalBody = (
		<div className="images-slider">
			<Slider {...settings}>
				{all_images.map((image) => {
					return (
						// <div className="h-100">
						<img src={image} className="slider-img" alt="slider img" />
						// </div>
					);
				})}
			</Slider>
		</div>
	);

	if (document.getElementById("page_data_html")) {
		if (firstTime) {
			let images = document.getElementById("page_data_html").getElementsByTagName("img");
			for (let image of images) {
				image.addEventListener("click", () => toggleImageSlider());
				image.classList.add("pointer");
			}
			setfirstTime(false);
		}
	}

	return (
		<div>
			<Helmet>
				{/* <meta name="description" content={ pageData.components.text_e } /> */}

				<meta property="og:type" content="website" />
				<meta property="og:title" content={pageData.components.title_e} />
				<meta property="og:description" content={pageData.components.text_e} />
				<meta property="og:url" content={`http://kpp.cnam.edu.sa/news_details/${newsIdUrl}/`} />
				<meta property="og:site_name" content="cnam KPP" />
				{/* <meta property="og:image" content={pageData.components.image} /> */}

				{/* For Twitter */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content={`http://kpp.cnam.edu.sa/news_details/${newsIdUrl}/`} />
				<meta property="twitter:title" content={pageData.components.title_e} />
				<meta property="twitter:description" content={pageData.components.text_e} />
				{/* <meta property="twitter:image" content={pageData.components.image} /> */}
			</Helmet>
			{Object.keys(pageData.components).length > 0 && (
				<>
					{imageSlider && (
						<Modal name="loginModal" modalBody={modalBody} modalState={imageSlider} changeModalState={toggleImageSlider} size="lg" />
					)}

					{getSessionInfo("language") === "arabic" ? (
						<div
							className="row bg-white news-page-details m-0 pl-sm-2 pl-1"
							style={{ fontFamily: "cnam-ar" }}
						// style={{ paddingTop: "1rem", height: "calc(100vh - 101px)", overflowY: "scroll", fontFamily: "cnam" }}
						>
							<div className="col-1 d-flex justify-content-center " style={{}}>
								<div classname="social1 social2 social3 social4" style={{ position: "fixed", top: "200px" }}>
									<div className="mt-4 pointer" onClick={() => shareDetailsHandle("twitter", newsIdUrl)}>
										<TwitterIcon style={{ color: "#727272", fontsize: "25px" }} />
									</div>
									<div className="mt-4 pointer" onClick={() => shareDetailsHandle("linkedin", newsIdUrl)}>
										<LinkedInIcon style={{ color: "#727272", fontsize: "25px" }} />
									</div>
									<div className="mt-4 pointer" onClick={() => shareDetailsHandle("facebook", newsIdUrl)}>
										<FacebookIcon style={{ color: "#727272", fontsize: "25px" }} />
									</div>
									<div className="mt-4 pointer" onClick={() => shareDetailsHandle("mail", newsIdUrl)}>
										<MailOutlineIcon style={{ color: "#727272", fontsize: "25px" }} />
									</div>
									<div className="mt-4 pointer" onClick={() => shareDetailsHandle("print", newsIdUrl)}>
										<PrintIcon style={{ color: "#727272", fontsize: "25px" }} />
									</div>
									<div className="mt-4 pointer" onClick={() => shareDetailsHandle("copy", newsIdUrl)}>
										<FileCopyIcon style={{ color: "#727272", fontsize: "25px" }} />
									</div>
								</div>
							</div>
							<div className="col-10">
								<div className="container d-flex justify-content-center h6 " style={{ padding: "1% 6%" }}>
									الأخبار والتحديثات
								</div>

								<div
									className="h2 d-flex container justify-content-center text-center "
									style={{ color: "#6E6E6E", fontSize: "33px", lineHeight: "125%", padding: "1% 6%", fontFamily: "cnam-bold-ar" }}
								>
									{pageData.components.title_a}
								</div>

								<div className="container d-flex justify-content-center h6" style={{ padding: "1% 6%", color: "#B2B2B2" }}>
									{formatDate(pageData.components.created_date)}
								</div>

								<div className="row justify-content-center">
									<div className="container pad-0 mb-4" style={{ height: "fit-content" }}>
										<img style={{ width: "100%", maxHeight: "50%" }} src={pageData.components.image} alt="img" />
										<div className=" mt-3 mb-5" style={{ lineHeight: "140%", fontSize: "18px" }}>
											{pageData.components.text_a}
										</div>
									</div>
								</div>

								<div
									dangerouslySetInnerHTML={{ __html: pageData.components.more_a }}
									className="col-12"
								// style={{ lineHeight: "140%", fontSize: "18px", overflowX: "auto" }}
								/>
							</div>
						</div>
					) : (
						<div
							className="row bg-white m-0 pl-sm-2 pl-1 news-page-details"
						// style={{ paddingTop: "1rem", height: "calc(100vh - 101px)", overflowY: "scroll", fontFamily: "cnam" }}
						>
							<div className="col-1 d-flex justify-content-center " style={{}}>
								<div classname="social1 social2 social3 social4" style={{ position: "fixed", top: "200px" }}>
									<div className="mt-4 pointer" onClick={() => shareDetailsHandle("twitter", newsIdUrl)}>
										<TwitterIcon style={{ color: "#727272", fontsize: "25px" }} />
									</div>
									<div className="mt-4 pointer" onClick={() => shareDetailsHandle("linkedin", newsIdUrl)}>
										<LinkedInIcon style={{ color: "#727272", fontsize: "25px" }} />
									</div>
									<div className="mt-4 pointer" onClick={() => shareDetailsHandle("facebook", newsIdUrl)}>
										<FacebookIcon style={{ color: "#727272", fontsize: "25px" }} />
									</div>
									<div className="mt-4 pointer" onClick={() => shareDetailsHandle("mail", newsIdUrl)}>
										<MailOutlineIcon style={{ color: "#727272", fontsize: "25px" }} />
									</div>
									<div className="mt-4 pointer" onClick={() => shareDetailsHandle("print", newsIdUrl)}>
										<PrintIcon style={{ color: "#727272", fontsize: "25px" }} />
									</div>
									<ClickAwayListener onClickAway={handleTooltipClose}>
										<div>
											<Tooltip
												PopperProps={{
													disablePortal: true,
												}}
												onClose={handleTooltipClose}
												open={open}
												disableFocusListener
												disableHoverListener
												disableTouchListener
												title="Copied to clipboard"
											>
												{/* <div onClick={handleTooltipOpen}>Click</div> */}
												<div
													className="mt-4 pointer"
													onClick={() => {
														handleTooltipOpen();
														shareDetailsHandle("copy", newsIdUrl);
													}}
												>
													<FileCopyIcon style={{ color: "#727272", fontsize: "25px" }} />
												</div>
											</Tooltip>
										</div>
									</ClickAwayListener>
								</div>
							</div>
							<div className="col-10">
								<div className="container d-flex justify-content-center h6 " style={{ padding: "1% 6%" }}>
									News and updates
								</div>

								<div
									className="h2 d-flex container justify-content-center text-center "
									style={{ color: "#6E6E6E", fontSize: "33px", lineHeight: "125%", padding: "1% 6%", fontFamily: "cnam-bold" }}
								>
									{pageData.components.title_e}
								</div>

								<div className="container d-flex justify-content-center h6" style={{ padding: "1% 6%", color: "#B2B2B2" }}>
									{formatDate(pageData.components.created_date)}
								</div>

								<div className="row justify-content-center">
									<div className="container pad-0 mb-4" style={{ height: "fit-content" }}>
										<img
											style={{ cursor: "pointer", width: "100%", maxHeight: "50%" }}
											src={pageData.components.image}
											alt="img"
											onClick={() => toggleImageSlider()}
										/>
										<div className=" mt-3 mb-5" style={{ lineHeight: "140%", fontSize: "18px" }}>
											{pageData.components.text_e}
										</div>
									</div>
								</div>

								<div
									id="page_data_html"
									dangerouslySetInnerHTML={{ __html: pageData.components.more_e }}
									className="col-12"
								// style={{ lineHeight: "140%", fontSize: "18px", overflowX: "auto" }}
								/>
							</div>
						</div>
					)}
				</>
			)}
			{pageData.footer.length > 0 && <Footer data={pageData.footer} socials={pageData.social} />}
		</div>
	);
}

// import TwitterIcon from '@material-ui/icons/Twitter';
// import FacebookIcon from '@material-ui/icons/Facebook';
// import LinkedInIcon from '@material-ui/icons/LinkedIn';
// import MailOutlineIcon from '@material-ui/icons/MailOutline';
// import PrintIcon from '@material-ui/icons/Print';

/* <div classname="social1 social2 social3 social4" style={{ position: 'fixed',margintop:'15rem'}}>
<div classname="mt-4"><twittericon style={{ color: '#727272', fontsize: '25px' }} /></div>
<div classname="mt-4"><linkedinicon style={{ color: '#727272', fontsize: '25px' }} /></div>
<div classname="mt-4"><facebookicon style={{ color: '#727272', fontsize: '25px' }} /></div>
<div classname="mt-4"><mailoutlineicon style={{ color: '#727272', fontsize: '25px' }} /></div>
<div classname="mt-4"><printicon style={{ color: '#727272', fontsize: '25px' }} /></div>
</div> */

/*
<div className="row justify-content-center">

<div className="container pad-0">
<div className="container" style={{ height: "380px", background: '#eaeaea' }} ></div>
<div className="h6 mt-3 mb-5" style={{ lineHeight: '25px' }}>
هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور الطلب. كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة
هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور الطلب. كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة
هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور الطلب. كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة
</div>
</div>

</div>

<div className="row justify-content-center">

<div className="container pad-0">
<div className="container" style={{ height: "380px", background: '#eaeaea' }} ></div>
<div className="h6 mt-3 mb-5" style={{ lineHeight: '25px' }}>
هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور الطلب. كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة
هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور الطلب. كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة
هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور الطلب. كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة
</div>
</div>

</div> */

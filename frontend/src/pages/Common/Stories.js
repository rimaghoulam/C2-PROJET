import React, { useEffect, useState } from "react";
import axios from "axios";

import Footer from "../../components/footer/Footer";
import NewsContainer from "../../components/NewsComponent/NewsContainer";

import { getSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";

import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./IndustryKpp.css";

export default function News(props) {
	const [PAGEDATA, setPageData] = useState({});

	useEffect(() => {
		props.setPageTitle('Success Stories', 'قصص النجاح')
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			page_id: 5,
		};

		props.toggleSpinner(true);

		axios({
			method: "post",
			url: `${WS_LINK}get_page_component`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				setPageData({ ...res.data });
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

	return (
		<div>
			{PAGEDATA.success_stories && (
				<>
					{getSessionInfo("language") === "english" ? (
						<>
							<div className="pagesHeaderTitle" style={{ backgroundColor: "#4CC9B7", padding: "30px", paddingLeft: "10%" }}>
								<div className="row justify-content-start px-3 px-lg-0">
									<div className="text-white col-lg-5" style={{ fontSize: "28px", fontFamily: "cnam-bold" }}>
										Success Stories
									</div>
									<div className="col-lg-5"></div>
								</div>
							</div>

							{PAGEDATA.success_stories.length === 0 && <div style={{ height: "calc(100vh - 617.600px)" }}></div>}
							<div className="pagesHeaderTitle" style={{ paddingLeft: "10%" }}>
								<div className="row justify-content-start bg-white hide_scrollbar px-3 px-lg-0 homePageBigContainer mt-5" style={{}}>
									{PAGEDATA.success_stories.map((item) => (
										<NewsContainer
											class="news-img"
											image={item.image}
											title={item.title_e}
											date={item.created_date}
											body={item.text_e}
											id={item.media_id}
										/>
									))}
								</div>
							</div>
							{/* <div className="bg-white hide_scrollbar largeScreen px-3 px-lg-0 homePageBigContainer">
								<Footer data={PAGEDATA.footer} socials={PAGEDATA.social} />
							</div> */}
						</>
					) : (
						//---------ARABIC----------
						<>
							<div className="pagesHeaderTitle-ar" style={{ backgroundColor: "#4CC9B7", padding: "30px", paddingRight: "10%" }}>
								<div className="row justify-content-start px-3 px-lg-0">
									<div className="text-white col-lg-5" style={{ fontSize: "28px", fontFamily: "cnam-bold-ar" }}>
										قصص النجاح
									</div>
									<div className="col-lg-5"></div>
								</div>
							</div>

							{PAGEDATA.success_stories.length === 0 && <div style={{ height: "calc(100vh - 617.600px)" }}></div>}
							<div className="pagesHeaderTitle-ar" style={{ paddingRight: "10%" }}>
								<div className="row justify-content-start bg-white hide_scrollbar px-3 px-lg-0 homePageBigContainer mt-5" style={{}}>
									{PAGEDATA.success_stories.map((item) => (
										<NewsContainer
											class="news-img"
											image={item.image}
											title={item.title_a}
											date={item.created_date}
											body={item.text_a}
											id={item.media_id}
										/>
									))}
								</div>
							</div>
						</>
					)}
					<div className="bg-white hide_scrollbar largeScreen px-3 px-lg-0 homePageBigContainer">
						<Footer data={PAGEDATA.footer} socials={PAGEDATA.social} footer3class="pr-3" />
					</div>
				</>
			)}
		</div>
	);
}

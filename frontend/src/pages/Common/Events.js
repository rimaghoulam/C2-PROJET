import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";
// import NewsContainer from "../../components/NewsComponent/NewsContainer";

import { translate, checkFontFamily } from "../../functions";
import { getSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";

import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./IndustryKpp.css";
import "./Events.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import arLocale from "@fullcalendar/core/locales/ar";
// require("react-big-calendar/lib/css/react-big-calendar.css");

export default function News(props) {
	const [PAGEDATA, setPageData] = useState({});

	useEffect(() => {
		props.setPageTitle('Events', 'الأحداث')
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			page_id: 4,
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

	// var views = ["month", "day", "week", "agenda"];

	var events = [];
	var events_ar = [];

	if (PAGEDATA.events) {
		PAGEDATA.events.forEach((item) => {
			events_ar.push({
				title: item.title_a,
				date: new Date(item.event_date),
				id: item.media_id,
			});
			events.push({
				title: item.title_e,
				date: new Date(item.event_date),
				id: item.media_id,
			});
		});
	}

	return (
		<div>
			{PAGEDATA.events && (
				<>
					<div
						className={translate("pagesHeaderTitle", "pagesHeaderTitle-ar")}
						style={{
							backgroundColor: "#4CC9B7",
							padding: "30px",
							paddingLeft: translate("10%", "0"),
							paddingRight: translate("0", "10%"),
						}}
					>
						<div className="row justify-content-start px-3 px-lg-0">
							<div className="text-white col-lg-5" style={{ fontSize: "28px", fontFamily: checkFontFamily(true) }}>
								{translate("Events", "الأحداث")}
							</div>
							<div className="col-lg-5"></div>
						</div>
					</div>
					<div
						className={translate("pagesHeaderTitle", "pagesHeaderTitle-ar")}
						style={{ paddingLeft: translate("10%", "0"), paddingRight: translate("0", "10%") }}
					>
						<div
							style={{ height: "100%", fontFamily: checkFontFamily() }}
							className={translate("calendar-container mb-5 mt-4 d-flex flex-wrap justify-content-center px-0", " calendar-container-ar mb-5 mt-4 d-flex flex-wrap justify-content-center px-3 px-sm-0")}
						// col-lg-8 col-11
						>
							<FullCalendar
								plugins={[dayGridPlugin, listPlugin]}
								locale={getSessionInfo("language") === "english" ? null : arLocale}
								initialView="dayGridMonth"
								headerToolbar={{
									left: "prev,next",
									center: "title",
									right: "dayGridMonth,dayGridWeek,listWeek",
								}}
								events={translate(events, events_ar)}
								eventContent={renderEventContent}
							/>
						</div>
						{/* <div className="row justify-content-start bg-white hide_scrollbar px-3 px-lg-0 homePageBigContainer mt-5" style={{}}>
							{PAGEDATA.events.map((item) => (
								<NewsContainer
									image={item.image}
									location={translate(item.location_english, item.location_arabic)}
									title={translate(item.title_e, item.title_a)}
									date={item.created_date}
									body={translate(item.text_e, item.text_a)}
									id={item.media_id}
									class="news-img"
								/>
							))}
						</div> */}
					</div>
					<div className="bg-white hide_scrollbar largeScreen px-3 px-lg-0 homePageBigContainer">
						<Footer
							data={PAGEDATA.footer}
							socials={PAGEDATA.social}
							footer3class="pr-3"
							ipadStyle={PAGEDATA.events.length === 2 ? "ipadStyle" : ""}
						/>
					</div>
				</>
			)}
		</div>
	);
}

function renderEventContent(eventInfo) {
	return (
		<>
			<Link style={{ color: "white" }} className="link " to={`/news_details/${btoa(encodeURIComponent(eventInfo.event.id))}`}>
				{eventInfo.event.title}
			</Link>
		</>
	);
}


/* <>
<div className="pagesHeaderTitle-ar" style={{ backgroundColor: "#4CC9B7", padding: "30px", paddingRight: "10%" }}>
	<div className="row justify-content-start px-3 px-lg-0">
		<div className="text-white col-lg-5" style={{ fontSize: "28px", fontFamily: "cnam-bold-ar" }}>
			الأحداث
		</div>
		<div className="col-lg-5"></div>
	</div>
</div>
<div className="pagesHeaderTitle-ar" style={{ paddingRight: "10%" }}>
	<div style={{ height: "100%", fontFamily: "cnam-ar" }} className=" mb-5 mt-4 col-lg-10 col-12 px-3 px-sm-0">
		<FullCalendar
			plugins={[dayGridPlugin]}
			locale={arLocale}
			initialView="dayGridMonth"
			events={events_ar}
			eventContent={renderEventContent}
		/>
	</div>
	<div className="row justify-content-start bg-white hide_scrollbar px-3 px-lg-0 homePageBigContainer mt-5" style={{}}>
		{PAGEDATA.events.map((item) => (
			<NewsContainer
				image={item.image}
				location={item.location_arabic}
				title={item.title_a}
				date={item.created_date}
				body={item.text_a}
				id={item.media_id}
			/>
		))}
	</div>
</div>
</> */


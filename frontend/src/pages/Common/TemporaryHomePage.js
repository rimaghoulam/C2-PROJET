import React, { useState, useEffect } from "react";

import Skeleton from "react-loading-skeleton";

// import Spinner from "../../components/spinner/Spinner";
import StatisticsCard from "../../components/statisticsCard/statisticsCard";
import TmpVideo from "../../components/TmpVideo/TmpVideo";
import Login from "./login/Login";
import Modal from "../../components/Modal/Modal";

import { checkFontFamily, translate, makePostRequest } from "../../functions";

import classes from "./TemporaryHomePage.module.css";
import { getSessionInfo } from "../../variable";

const TemporaryHomePage = (props) => {
	const [PAGEDATA, setPageData] = useState([]);
	const [IMAGEDATA, setImageData] = useState([]);

	const [LoginOpen, setLoginOpen] = useState(false);

	const [passwordState, setPasswordState] = useState(false);

	const changeLoginState = () => {
		setLoginOpen((p) => !p);
	};

	const togglePasswordModal = () => {
		setPasswordState((p) => !p);
	};

	const ModalBody = (
		<Login props={props} changeLoginState={changeLoginState} passwordModalState={passwordState} togglePasswordModalState={togglePasswordModal} />
	);

	useEffect(() => {
		props.setPageTitle("cnam KPP", "برنامج الشراكة المعرفية عن");

		// id 13
		makePostRequest("get_page_component", {
			page_id: 13,
			// type: "media"
		})
			.then((data) => {
				setPageData({ ...data });
			})
			.catch((err) => console.log(err));

		makePostRequest("get_page_component", {
			page_id: 13,
			type: "media",
		})
			.then((data) => {
				setImageData({ ...data });
			})
			.catch((err) => console.log(err));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// if (PAGEDATA.length === 0) return <Spinner small={true} notFixed={true} />;

	return (
		<div className={classes.tmpHome}>
			<Modal name="loginModal" modalBody={ModalBody} modalState={LoginOpen} />

			<div className={`${classes.tmpHomeTop} ${PAGEDATA.components && PAGEDATA.components[2].status === 1 ? "" : classes.tmpHomeTop100}`}>
				{PAGEDATA.components ? (
					<div className={`col-12 col-lg-6 ${classes.tmpHomeHero}`}>
						<h3 style={{ fontFamily: checkFontFamily(true) }}>
							{/* {translate("Welcome to", "مرحبا بكم في ")}
						<br /> */}
							{translate(PAGEDATA.components[0].english, PAGEDATA.components[0].arabic)}
						</h3>
						<div dangerouslySetInnerHTML={{ __html: translate(PAGEDATA.components[1].english, PAGEDATA.components[1].arabic) }} style={{ fontFamily: checkFontFamily() }} />

						{getSessionInfo("loggedIn") || getSessionInfo("tempLoggedIn") ? (
							<button style={{ fontFamily: checkFontFamily(true) }} onClick={() => props.history.push("/dashboard")}>
								{translate("My Account", "حسابي")}
							</button>
						) : (
							<>
								<button style={{ fontFamily: checkFontFamily(true) }} onClick={() => props.history.push("/register")}>
									{translate("Get Started", "البدء")}
								</button>
								<span style={{ fontFamily: checkFontFamily() }} className={classes.signInSpan}>
									{translate("You already have an account sign in", "لديك بالفعل حساب تسجيل الدخول")}{" "}
									<span className={classes.loginLink} onClick={changeLoginState}>
										{translate("here", "هنا")}
									</span>
								</span>
							</>
						)}
					</div>
				) : (
					<Skeleton height={409} />
				)}

				<div className={`col-12 col-lg-6 mt-0 mt-lg-0 p-0 ${classes.tmpHomeVideo}`}>
					{IMAGEDATA.components ? (
						<TmpVideo
							// video={`<iframe width="727" height="409" src="https://www.youtube.com/embed/WQxlIxd48mc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`}
							image={IMAGEDATA.components[0].english}
						/>
					) : (
						<Skeleton height={409} />
					)}
				</div>
			</div>
			{/* //* ******************** */}

			{
				// Check if statistics cards are enabled
				PAGEDATA.components ? (
					<>
						{PAGEDATA.components[2].status === 1 && (
							<div className={`${classes.tmpHomeBottom} mt-3 `}>
								<div className="container">
									<div
										className="row px-5 pt-1"
										style={{
											// backgroundImage: `url('${IMAGEDATA.components[2][language]}')`,
											backgroundRepeat: "no-repeat",
											backgroundPosition: "center",
											backgroundSize: "cover",
											marginLeft: "-10vw",
											marginRight: "-10vw",
											textAlign: "center",
										}}
									>
										<div className="col-md-12 col-lg-3 mb-2">
											<StatisticsCard
												history={props.history}
												countup="true"
												title={translate("All Challenges", "التحديات المطروحة")}
												number={PAGEDATA.summary.challenges}
												isBlack={true}
											/>
										</div>
										<div className="col-md-12 col-lg-3 mb-2">
											<StatisticsCard
												history={props.history}
												countup="true"
												title={translate("All Internships​", "طلبات التدريب الادخلي")}
												number={PAGEDATA.summary.internships}
												isBlack={true}
											/>
										</div>
										<div className="col-md-12 col-lg-3 mb-2">
											<StatisticsCard
												history={props.history}
												countup="true"
												title={translate("All cnam Users", "أعضاء هيئة التدريس والباحثين")}
												number={PAGEDATA.summary.cnam}
												isBlack={true}
											/>
										</div>
										<div className="col-md-12 col-lg-3 mb-2">
											<StatisticsCard
												history={props.history}
												countup="true"
												title={translate("All Industry Users", "المستخدمين")}
												number={PAGEDATA.summary.companies}
												isBlack={true}
											/>
										</div>
									</div>
								</div>
							</div>
						)}
					</>
				) : (
					<Skeleton height={100} />
				)
			}
		</div>
	);
};

export default TemporaryHomePage;

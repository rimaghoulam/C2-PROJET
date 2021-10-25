import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

import { getSessionInfo, clearSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";

import Simple from "../../containers/Simple";
import Spinner from "../../components/spinner/Spinner";

import Loader from "react-loader-advanced";

import "../../App.css";
import "./NDAPage.css";

import { Button } from "reactstrap";

export default function NDAPage(props) {
	if (getSessionInfo("role") !== 3 && !getSessionInfo("loggedIn")) props.history.replace("/");

	const [PAGEDATA, setPageData] = useState({});
	const [loaderState, setLoaderState] = useState(true);

	const [checkerror, setCheckerror] = useState(false);

	const [fill, setFill] = useState();

	const [postfill, setPostfill] = useState();

	const handleCheckbox = (e) => {
		if (e.target.checked) {
			setFill(1);
			setCheckerror(false);
		} else {
			setFill(0);
			setCheckerror(true);
		}
	};

	useEffect(() => {
		//  check_nda();
		const cancelToken = axios.CancelToken;
		const source = cancelToken.source();

		const postedData = {
			page_id: 2,
		};

		axios({
			method: "post",
			url: `${WS_LINK}get_page_component`,
			data: postedData,
			cancelToken: source.token,
		})
			.then((res) => {
				setPageData({ ...res.data });
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});

		const postedData2 = {
			userid: getSessionInfo("id"),
			token: getSessionInfo("token"),
		};

		setLoaderState(true);
		axios({
			method: "post",
			url: `${WS_LINK}get_agree_guidline`,
			data: postedData2,
			cancelToken: source.token,
		})
			.then((res) => {
				if (res.data !== "role error" && res.data !== "token error") {
					if (res.data.length === 1) {
						setPostfill(1);
						setLoaderState(false);
					}
					setLoaderState(false);
				} else {
					clearSessionInfo();
					props.history.replace("/");
					window.location.reload(false);
				}
			})
			.catch((err) => {
				setLoaderState(false);

				if (axios.isCancel(err)) {
					console.log("request canceled");
				} else {
					console.log("request failed");
				}
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// console.log(PAGEDATA)

	const later = () => {
		if (fill === 1 || postfill === 1) {
			const cancelToken = axios.CancelToken;
			const source = cancelToken.source();
			const postedData = {
				userid: getSessionInfo("id"),
				token: getSessionInfo("token"),
				tick: fill,
				nda_path: "",
			};

			setLoaderState(true);
			axios({
				method: "post",
				url: `${WS_LINK}agree_guidline`,
				data: postedData,
				cancelToken: source.token,
			})
				.then((res) => {
					if (res.data !== "role error" && res.data !== "token error") {
						props.history.replace("/post_challenge");
						setLoaderState(false);
					} else {
						clearSessionInfo();
						window.location.reload(false).then(props.history.replace("/"));
					}
				})
				.catch((err) => {
					setLoaderState(false);
					if (axios.isCancel(err)) {
						console.log("request canceled");
					} else {
						console.log("request failed");
					}
				});
		} else setCheckerror(true);
	};

	const sign = () => {
		if (fill === 1 || postfill === 1) {
			const cancelToken = axios.CancelToken;
			const source = cancelToken.source();
			const postedData = {
				userid: getSessionInfo("id"),
				token: getSessionInfo("token"),
				tick: fill,
				nda_path: "",
			};

			setLoaderState(true);
			axios({
				method: "post",
				url: `${WS_LINK}agree_guidline`,
				data: postedData,
				cancelToken: source.token,
			})
				.then((res) => {
					if (res.data !== "role error" && res.data !== "token error") {
						props.history.replace("/upload_nda");
						setLoaderState(false);
					} else {
						clearSessionInfo();
						window.location.reload(false).then(props.history.replace("/"));
					}
				})
				.catch((err) => {
					setLoaderState(false);
					if (axios.isCancel(err)) {
						console.log("request canceled");
					} else {
						console.log("request failed");
					}
				});
		} else setCheckerror(true);
	};

	return (
		<div>
			<Loader
				message={
					<span>
						<Spinner />{" "}
					</span>
				}
				show={loaderState}
				backgroundStyle={{ zIndex: "9999" }}
			>
				<Helmet>
					<title>{getSessionInfo("language") === "arabic" ? "عن برنامج الشراكة المعرفية | اتفاق غير معلن" : "NDA | cnam KPP"}</title>
				</Helmet>
				{!loaderState && (
					<>
						{getSessionInfo("language") === "english" ? (
							<Simple
								props={props}
								logo={true}
								left={
									<div className="text-center">
										<div className="col-sm-10 ">
											<div className="row text-left">
												<div className="col-12 mb-4 px-0 mx-0 mt-2" style={{ fontFamily: "cnam-bold", fontSize: "1.5rem" }}>
													Before posting your challenges, please do the following
												</div>
												{/* // !    !== 1 */}
												{postfill !== 1 && (
													<div
														className="col-12 bg-white p-3"
														style={{
															// maxHeight: '250px',
															// overflowY: 'auto',
															boxShadow: "0px 0px 2px #888888",
															borderRadius: 4,
														}}
													>
														<div>
															<div
																className=" mt-1 p-0 mb-3 text-nowrap"
																style={{ fontSize: "1.2rem", fontFamily: "cnam-bold" }}
															>
																{PAGEDATA.components !== undefined ? PAGEDATA.components[5].english : "Guidelines"}
															</div>
															<div
																style={{ fontSize: "15px", lineHeight: "140px", padding: "0", marginTop: "10px" }}
																dangerouslySetInnerHTML={{
																	__html: PAGEDATA.components !== undefined ? PAGEDATA.components[6].english : "",
																}}
																className="col-12 toSelectFromAPI"
															/>
														</div>
														{/* <ul className="mt-3" style={{ paddingLeft: 20, color: '#797979', fontSize: '0.9rem' }}>
                        <li className="mt-2">
                          Your request will be evaluated based on resources
                          and capabilities available at cnam.
                        </li>
                        <li className="mt-2">
                          cnam cannot be held liable for any of its
                          consultation. It is the company's full
                          responsibility to use the consultation the way they
                          fell appropriate.
                        </li>
                        <li className="mt-2">
                          cnam has the full right to respond to the request
                          based on first come first serve and cannot be held
                          liable for any delays.
                        </li>
                      </ul> */}
														{/* <Link to="/industry_kpp" target='_blank' className="ml-1" style={{ color: 'rgb(198 2 36)' }}>read more</Link> */}
													</div>
												)}

												{postfill !== 1 && (
													<div className="w-100 d-flex align-items-center mt-4">
														<input
															className={checkerror && "error_check"}
															name="check"
															type="checkbox"
															defaultChecked={fill}
															value={fill}
															onChange={handleCheckbox}
														/>

														<div className="ml-1 font-weight-bold">I have read and I agreed to the guidelines</div>
													</div>
												)}
												<div className="w-100 d-flex justify-content-end">
													{checkerror && <span className="errors">Please read and check the box</span>}

													<div className="mt-3 text-right row">
														<Button
															// onClick={ scroll}
															onClick={later}
															className=" px-4 ml-1 mt-1 mt-sm-0 col"
															style={{
																backgroundColor: "transparent",
																fontSize: "0.9rem",
																padding: "0.65rem",
																borderColor: "rgb(198 2 36)",
																fontWeight: "600",
																color: "rgb(198 2 36)",
															}}
														>
															I'll do it later
														</Button>
														<Button
															// onClick={ scroll}
															onClick={sign}
															className="px-4 ml-1 mt-1 mt-sm-0 ml-md-2 col"
															style={{
																backgroundColor: "rgb(198 2 36)",
																fontSize: "0.9rem",
																padding: "0.65rem",
																border: "none",
																fontWeight: "600",
															}}
														>
															Sign NDA
														</Button>
													</div>
												</div>
											</div>
										</div>
									</div>
								}
								right={
									<>
										<div>
											<div className="" style={{ fontFamily: "cnam-bold", fontSize: "18px" }}>
												Welcome to cnam Industry KPP
											</div>
											<div style={{ fontSize: "15px", width: "88%" }}>
												This space will be used to explain the benefits registration the company or Industry information.{" "}
											</div>
										</div>
									</>
								}
							/>
						) : (
							//---------------------------------------
							//---------------------------------------
							//---------------------------------------
							//----------------ARABIC-----------------
							//---------------------------------------
							//---------------------------------------
							//---------------------------------------
							//---------------------------------------

							<Simple
								props={props}
								logo={true}
								left={
									<div className="text-right">
										<div className="col-sm-10 ">
											<div className="row text-right">
												<div
													className="col-12 mb-4 px-0 mx-0 mt-2"
													style={{ fontFamily: "cnam-bold-ar", fontSize: "1.5rem" }}
												>
													قبل طلب التحديات الخاصة بك ، يرجى القيام بما يلي
												</div>
												{/* // !! !== */}
												{postfill !== 1 && (
													<div
														className="col-12 bg-white p-3"
														style={{
															boxShadow: "0px 0px 2px #888888",
															borderRadius: 4,
														}}
													>
														<div>
															<div
																className=" mt-1 p-0 mb-3 text-nowrap"
																style={{ fontSize: "1.2rem", fontFamily: "cnam-bold-ar" }}
															>
																{PAGEDATA.components !== undefined
																	? PAGEDATA.components[5].arabic
																	: "القواعد الارشادية"}
															</div>
															<div
																style={{
																	fontSize: "15px",
																	lineHeight: "",
																	fontFamily: "cnam-ar",
																	padding: "0",
																	marginTop: "10px",
																}}
																dangerouslySetInnerHTML={{
																	__html: PAGEDATA.components !== undefined ? PAGEDATA.components[6].arabic : "",
																}}
																className="col-12 toSelectFromAPI"
															/>
														</div>
													</div>
												)}

												{postfill !== 1 && (
													<div className="w-100 d-flex align-items-center mt-4">
														<input
															className={checkerror && "error_check"}
															name="check"
															type="checkbox"
															defaultChecked={fill}
															value={fill}
															onChange={handleCheckbox}
														/>

														<div className="mr-1" style={{ fontFamily: "cnam-bold-ar" }}>
															لقد قرأت ووافقت على المبادئ التوجيهية
														</div>
													</div>
												)}
												<div className="w-100 d-flex justify-content-start">
													{checkerror && <span className="errors">يرجى قراءة وتحديد المربع</span>}

													<div className="mt-3 text-right row">
														<Button
															// onClick={ scroll}
															onClick={later}
															className=" px-4 mr-1 mt-1 mt-sm-0 col"
															style={{
																backgroundColor: "transparent",
																fontSize: "0.9rem",
																padding: "0.65rem",
																borderColor: "rgb(198 2 36)",
																fontFamily: "cnam-ar",
																color: "rgb(198 2 36)",
															}}
														>
															سوف افعلها لاحقا
														</Button>
														<Button
															// onClick={ scroll}
															onClick={sign}
															className="px-4 mr-1 mt-1 mt-sm-0 mr-md-1 col"
															style={{
																backgroundColor: "rgb(198 2 36)",
																fontSize: "0.9rem",
																padding: "0.65rem",
																border: "none",
																fontFamily: "cnam-ar",
															}}
														>
															التوقيع على اتفاقية عدم الإفصاح
														</Button>
													</div>
												</div>
											</div>
										</div>
									</div>
								}
								right={
									// <div className="" style={{ fontFamily: 'cnam-bold-ar', fontSize: '18px' }}>مرحبًا بكم في جامعة الملك عبدالله للعلوم والتقنية <span style={{ fontFamily:'cnam' }}>برنامج الشراكة المعرفية</span></div>
									// <div style={{ fontSize: "15px", width: "88%", fontFamily:'cnam-ar' }}>
									//   سيتم استخدام هذه المساحة لشرح فوائد التسجيل في
									//    معلومات المنشأة أو الصناعة.{" "}
									// </div>
									<>
										<div>
											<div className="" style={{ fontFamily: "cnam-bold-ar", fontSize: "18px" }}>
												مرحبا بكم في برنامج الشراكة المعرفية المقدم من جامعة الملك عبدالله للعلوم والتقنية{" "}
											</div>
											<div style={{ fontSize: "15px", width: "88%", fontFamily: "cnam-ar" }}>
												من أهداف البرنامج معالجة التحديات التقنية والبحثية التي تواجهها المنشآة.
											</div>
										</div>
									</>
								}
							/>
						)}
					</>
				)}
			</Loader>
		</div>
	);
}

// const check_nda = () => {
//   const cancelToken = axios.CancelToken;
//   const source = cancelToken.source()

//   const postedData = {
//     userid: getSessionInfo('id'),
//     token: getSessionInfo('token')
//   }

//   setLoaderState(true)
//   axios({
//     method: "post",
//     url: `${WS_LINK}check_self_signed_nda`,
//     data: postedData,
//     cancelToken: source.token,
//   })
//     .then(res => {

//     console.log(res.data)
//       if (res.data && res.data.length !== 0)
//         props.history.replace('/post_challenge')

//     }
//     )
//     .catch(err => {
//       setLoaderState(false)
//       if (axios.isCancel(err)) {
//         console.log('request canceled')
//       }
//       else {
//         console.log("request failed")
//       }

//     });

// }

/* const onSubmit = () => {
    if(fill === 1) post()
  }



  const post = (data) => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
      tick: fill,
      nda_path: ''
    };

    setLoaderState(true);
    axios({
      method: "post",
      url: `${WS_LINK}agree_guidline`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        if (res.data !== "role error" && res.data !== "token error") {
          props.history.replace("/upload_nda");
          setLoaderState(false);
          
        }
        else {
          clearSessionInfo()
          window.location.reload(false).then(props.history.replace('/'))
        }
      })
      .catch((err) => {
        setLoaderState(false);
        if (axios.isCancel(err)) {
          console.log("request canceled");
        } else {
          console.log("request failed");
        }
      });
  }; */
// console.log(fill)

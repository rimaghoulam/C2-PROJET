import React from "react";

import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";

export default function StatisticsCard(props) {
	const circles = {
		width: "60px",
		height: "60px",
		lineHeight: "60px",
		borderRadius: "50%",
		color: props.isBlack ? "black" : "#fff",
		textAlign: "center",
		border: props.isBlack ? "1px solid black": "1px solid white",
		margin: "2.5% auto",
	};
	// console.log(props.backgroundImg)
	return (
		<>
			<div className={`card ${props.url && "pointer"}`}
				style={{
					boxShadow: (props.color || props.backgroundImage) && "1px 1px 2px 1px #e0e0e0",
					backgroundImage: props.backgroundImg ? `url(${props.backgroundImg})` : "",
					backgroundRepeat: "no-repeat", backgroundPosition: "center",
					backgroundSize: "cover",
					backgroundColor: props.color || 'transparent',
					border: (props.color || props.backgroundImg) ? '1px solid lightgrey' : 'none'
				}}
				onClick={() => props.url && props.history.push(props.url || "/dashboard")}>
				<div className="card-body" style={{ marginBottom: "-1.2rem", height: "fit-content" }}>
					<div style={{ height: "25%" }}>
						<div
							className="col-12"
							style={{
								fontWeight: "600",
								fontSize: "1rem",
								textAlign: "center",
								color: props.isBlack ? 'black' : "#f6f6f6",
							}}
						>
							{props.title}
						</div>
					</div>
					<div className="col-12" style={circles}>
						{props.countup ? (
							<CountUp end={props.number ? props.number : 0} preserveValue={true} duration={1} redraw={false}>
								{({ countUpRef, start }) => (
									<VisibilitySensor onChange={start}>
										<span ref={countUpRef} />
									</VisibilitySensor>
								)}
							</CountUp>
						) : props.number ? (
							props.number
						) : (
							0
						)}
					</div>
				</div>
			</div>
		</>
	);
}

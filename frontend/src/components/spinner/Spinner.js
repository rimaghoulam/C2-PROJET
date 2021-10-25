import React from 'react';

export default function Spinner(props){
	return (
		<div
			className="spinner"
			style={{
				position: !props.notFixed && "fixed",
				top: "calc(50% - 20px)",
				left: "calc(50% - 20px)",
			}}
		>
			{!props.small ? 
			(
			<div>
			<div className="spinner-item" />
			<div className="spinner-item" />
			<div className="spinner-item" />
			</div>
			)
			:
			(

			<div>
			<div className="spinner-item-sm" />
			<div className="spinner-item-sm" />
			<div className="spinner-item-sm" />
			</div>
			)
			}
		</div>
	);
};
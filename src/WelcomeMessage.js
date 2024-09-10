import React from "react";

function WelcomeMessage({userData}){
	return (
		<div className="welcomeMessage">
			<span className="material-symbols-outlined welcomeMessageIcon">
				info
			</span>

			<h4>
				Welcome to your dashboard, {userData.name}!
			</h4>
		</div>
	);
}

export default WelcomeMessage;
import React from "react";
import notify from "./notify";

function AppBar({loggedIn, setLoggedIn, setUserData, setPage, setMessages}){
	function handleLogoutClick(){
		if (loggedIn){
			setMessages([]);

			setLoggedIn(false);

			setUserData({});

			setPage("login");

			notify("Logged out successfully!", 2000);

			localStorage.removeItem("attendance-app-user");
		}
		else{
			notify("You need to login!", 2000);
		}
	}

	return (
		<>
			<div className="appBar">
				<span className="material-symbols-outlined appBarIcon">
					face
				</span>

				<h2>
					FaceLogix
				</h2>

				<div className="logoutButton" onClick={handleLogoutClick}>
					<span className="material-symbols-outlined logoutIcon">
						exit_to_app
					</span>
				</div>
			</div>

			<div className="footer">
				© Made by Anuj Chowdhury
			</div>
		</>
	);
}

export default AppBar;
import React from "react";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

function Login({db, setLoggedIn, setUserData, setPage}){
	function signInWithGoogle(){
		const auth = getAuth();

		const provider = new GoogleAuthProvider();

		signInWithPopup(auth, provider).then((result) => {
    		const user = result.user;

    		const userData = {
    			id: user.uid,
    			name: user.displayName,
    			email: user.email
    		};

    		localStorage.setItem("attendance-app-user", JSON.stringify(userData));

    		setLoggedIn(true);

    		setUserData(userData);

    		setPage("home");

			getDoc(doc(db, "users", userData.id)).then((data) => {
				if (!data.exists()){
					setDoc(doc(db, "users", userData.id), userData);
				}
			});
		});
	}

	return (
		<div className="loginContainer">
			<div className="login">
				<div className="loginLogo">
					<h2>
						FaceLogix
					</h2>
				</div>

				<div className="loginHeader">
					<h3 className="loginTitle">
						Please login below:
					</h3>
				</div>

				<div className="classButton cameraButton loginButton" onClick={signInWithGoogle}>
					<span className="material-symbols-outlined cameraScanIcon">
						login
					</span>

					Login with Google
				</div>
			</div>
		</div>
	);
}

export default Login;
import React from "react";

function ClassContainer({setPage}){
	return (
		<div className="classContainer">
			<div className="classButton" onClick={() => {setPage("studentClassSelector")}}>
				Add Student
			
				<span className="material-symbols-outlined appBarIcon">
					person
				</span>
			</div>

			<div className="classButton" onClick={() => {setPage("classes")}}>
				Your Classes
			
				<span className="material-symbols-outlined appBarIcon">
					group
				</span>
			</div>

			<div className="classButton" onClick={() => {setPage("photoClicker")}}>
				Take Photo
			
				<span className="material-symbols-outlined appBarIcon">
					photo_camera
				</span>
			</div>
		</div>
	);
}

export default ClassContainer;
import React from "react";
import notify from "./notify";

function Students({setPage, currentClass, students}){
	const studentItems = students.map((student, index) => {
		return (
			<div className="studentSelf" key={index} onClick={() => {setPage("students")}}>
				<span className="material-symbols-outlined studentIcon">
					person
				</span>

				<h5 className="studentName">
					{student.name}
				</h5>

				<h5 className="studentRoll">
					{student.roll}
				</h5>						
			</div>
		);
	});

	function handleStartAttendance(){
		if (students.length > 0){
			setPage("attendanceRoom");
		}
		else{
			notify("No student in class!", 2000);
		}
	}

	return (
		<div className="students">
			<div className="classHeader">
				<h3>
					{currentClass}
				</h3>
		
				<div className="backButton" onClick={() => {setPage("classes")}}>
					<span className="material-symbols-outlined">
						undo
					</span>
				</div>
			</div>

			<div className="classBox">
				<div className="classOverflow">
					{studentItems}

					<div className="startAttendanceButton" onClick={() => {handleStartAttendance()}}>
						Start Attendance

						<span className="material-symbols-outlined attendanceIcon">
							groups
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Students;
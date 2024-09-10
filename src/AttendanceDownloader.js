import React, {useState, useEffect} from "react";
import {utils, writeFile} from "xlsx";

function AttendanceDownloader({setPage, setLoading, currentAttendanceData, currentClass}){
	const [currentData, setCurrentData] = useState([]);

	function downloadText(){
	    const jsonData = JSON.stringify(currentData, null, 2);

	    const blob = new Blob([jsonData], {
	    	type: "text/plain"
	    });

	    const url = URL.createObjectURL(blob);

	    const link = document.createElement("a");

	    const date = new Date();

	    link.href = url;

	    link.download = `${currentClass} - ${date.toLocaleDateString()}`;

	    document.body.appendChild(link);

	    link.click();

	    URL.revokeObjectURL(url);

	    document.body.removeChild(link);
	}

	function downloadExcel() {
	    const date = new Date();

		const fileName = `${currentClass} - ${date.toLocaleDateString()}.xlsx`;

	    const workBook = utils.book_new();

	    const workSheet = utils.json_to_sheet(currentData);

		workSheet["A1"].v = "Name";
		workSheet["B1"].v = "Roll Number";
		workSheet["C1"].v = "Status";

		workSheet["!cols"] = [
			{
				wpx: 200
			},
			{
				wpx: 120
			},
			{
				wpx: 120
			}
		];

	    utils.book_append_sheet(workBook, workSheet, "Sheet1");

	    writeFile(workBook, fileName);
	}

	useEffect(() => {
		if (currentData.length > 0){
			setLoading(false);
		}
	}, [currentData]);

	useEffect(() => {
		const data = [];

		currentAttendanceData.forEach((student, index) => {
			const updatedStudent = {
				name: student.name,
				roll: student.roll,
				status: student.status
			};

			data.push(updatedStudent);

			if ((index + 1) === currentAttendanceData.length){
				setCurrentData(data);
			}
		});
	}, []);

	return (
		<div className="attendanceDownloaderContainer">
			<div className="attendanceDownloader">
				<div className="attendanceDownloadHeader">
					<h3 className="attendanceDownloadTitle">
						Attendance Download Options
					</h3>
				</div>

				<div className="attendanceDownloaderButtonContainer">
					<div className="classButton cameraButton attendanceDownloaderButton" onClick={downloadText}>
						<span className="material-symbols-outlined cameraScanIcon">
							description
						</span>

						Download as Text
					</div>

					<div className="classButton cameraButton attendanceDownloaderButton" onClick={downloadExcel}>
						<span className="material-symbols-outlined cameraScanIcon">
							format_list_numbered
						</span>

						Download as Excel
					</div>

					<div className="classButton cameraButton attendanceDownloaderButton" onClick={() => setPage("home")}>
						<span className="material-symbols-outlined cameraScanIcon">
							arrow_back
						</span>

						Back to Dashboard
					</div>
				</div>
			</div>
		</div>
	);
}

export default AttendanceDownloader;
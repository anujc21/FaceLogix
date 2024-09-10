import React, {useState, useEffect, useRef} from "react";
import Mumble from "mumble-js";
import notify from "./notify";
import * as faceapi from "@vladmandic/face-api";

function AttendanceRoom({setPage, setLoading, students, setCurrentAttendanceData}){
	const scanButtonRef = useRef();

	const cameraFeedRef = useRef();

	const cameraFeedBoxRef = useRef();

	const [faceMatcher, setFaceMatcher] = useState({});

	const [attendanceStudents, setAttendanceStudents] = useState([]);

	const [brightness, setBrightness] = useState(1);

	const descriptors = [];

	const keys = [];

	let mumble;

	const studentItems = attendanceStudents.map((student, index) => {
		const studentStatus = student.status === "PRESENT" ? "studentPresent" : "studentAbsent";

		const studentName = student.status === "PRESENT" ? "studentNamePresent" : "studentNameAbsent";

		const studentRoll = student.status === "PRESENT" ? "studentRollPresent" : "studentRollAbsent";

		const studentStatusLabel = student.status === "PRESENT" ? "studentStatusPresent" : "studentStatusAbsent";

		const studentIcon =  student.status === "PRESENT" ? "material-symbols-outlined studentIcon" : "material-symbols-outlined studentIconAbsent";

		return (
			<div className={studentStatus} key={index}>
				<span className={studentIcon}>
					person
				</span>

				<h5 className={studentName}>
					{student.name}
				</h5>

				<h5 className={studentRoll}>
					{student.roll}
				</h5>

				<h5 className={studentStatusLabel}>
					{student.status}
				</h5>
			</div>
		);
	});

	function handleScan(){
		const video = cameraFeedRef.current;

		const cameraFeedBox = cameraFeedBoxRef.current;
		const cameraFeedBoxRect = cameraFeedBox.getBoundingClientRect();

		const canvas = document.createElement("canvas");

		canvas.width = cameraFeedBoxRect.width;
		canvas.height = video.videoHeight;

		const size = {
			x: -video.videoWidth,
			y:  0,
			width: video.videoWidth,
			height: canvas.height,
		};

		const context = canvas.getContext("2d");

		context.save();
		context.scale(-1, 1); 
		context.drawImage(video, size.x, size.y, size.width, size.height);

		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

		const data = imageData.data;

		const brightnessFactor = brightness;

		for (let i = 0; i < data.length; i += 4) {
		    data[i] *= brightnessFactor;
		    data[i + 1] *= brightnessFactor;
		    data[i + 2] *= brightnessFactor;
		}

		context.putImageData(imageData, 0, 0);
		context.restore();

		const image = new Image();

		image.src = canvas.toDataURL("image/jpg");

		faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors().then((testDetection) => {
			if (testDetection.length > 0){
				const studentLabels = [];

				for (let i = 0; i < testDetection.length; ++i){
					const bestMatch = faceMatcher.findBestMatch(testDetection[i].descriptor);
				
					const bestMatchLabel = bestMatch.label;
					
					const updatedStudents = [...attendanceStudents];

					if (bestMatchLabel === "unknown"){
						studentLabels.push("Unknown");

						const message = new SpeechSynthesisUtterance();

						message.text = "face not recognized";

						window.speechSynthesis.speak(message);

						if (i === (testDetection.length - 1)){
							notify(`${studentLabels.join(", ")} marked present!`, 2000);
						}
					}
					else{
						updatedStudents.forEach((student, index) => {
							const studentLabel = `${student.name}-${student.roll}`;

							if (studentLabel === bestMatchLabel){
								studentLabels.push(student.name);

								if (student.status === "ABSENT"){
									student.status = "PRESENT";

									const message = new SpeechSynthesisUtterance();

									message.text = `${student.name} marked present`;

									window.speechSynthesis.speak(message);
								}
								else{
									const message = new SpeechSynthesisUtterance();

									message.text = `${student.name} already marked present`;

									window.speechSynthesis.speak(message);
								}
							}

							if (i === (testDetection.length - 1)){
								if (index === (updatedStudents.length - 1)){
									notify(`${studentLabels.join(", ")} marked present!`, 2000);
								}
							}
						});
					}

					setAttendanceStudents(updatedStudents);
				}
			}
			else{
				notify("Please be in the frame!", 2000);

				const message = new SpeechSynthesisUtterance();

				message.text = "please be in the frame";

				window.speechSynthesis.speak(message);
			}
		});
	}

	function finishScan(){
		setCurrentAttendanceData(attendanceStudents);

		setPage("attendanceDownloader");

		setLoading(true);
	}

	function handleBrightnessDecrease(){
		const video = cameraFeedRef.current;

		video.style.filter = `brightness(${brightness - 0.5})`;

		setBrightness((prev) => {
			return (prev - 0.5);
		});
	}

	function handleBrightnessIncrease(){
		const video = cameraFeedRef.current;

		video.style.filter = `brightness(${brightness + 0.5})`;

		setBrightness((prev) => {
			return (prev + 0.5);
		});
	}

	useEffect(() => {
		setLoading(true);

		let streamCurrent;

		function addFace(face, faceIndex){
			const attendanceStudent = {
				status: "ABSENT",
				...face
			};

			setAttendanceStudents((prev) => {
				return [...prev, attendanceStudent];
			});

			const faceDescriptors = [];

			function addDetector(url, urlIndex){
				const image = new Image();

				image.src = url;

				faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor().then((faceDetection) => {
					const faceDescriptor = faceDetection.descriptor;

					faceDescriptors.push(faceDescriptor);

					if (faceDescriptors.length === face.images.length){
						const finalDescriptor = new faceapi.LabeledFaceDescriptors(`${face.name}-${face.roll}`, faceDescriptors);

						descriptors.push(finalDescriptor);

						if (descriptors.length === students.length){
							setFaceMatcher(new faceapi.FaceMatcher(descriptors));

							navigator.mediaDevices.getUserMedia({video: true}).then(function(stream){
								const video = cameraFeedRef.current;

								video.srcObject = stream;
								video.autoplay = true;

								video.setAttribute("playsinline", "");

								streamCurrent = stream;

								setLoading(false);

							}).catch(function(error){
								console.log("Error accessing the camera: ", error);
							});
						}
						else{
							addFace(students[faceIndex + 1], faceIndex + 1);
						}
					}
					else{
						addDetector(face.images[urlIndex], urlIndex + 1);
					}
				});
			}

			addDetector(face.images[0], 0);
		}

		addFace(students[0], 0);

        return () => {
        	if (streamCurrent){
	            streamCurrent.getTracks().forEach((track) => {
	                track.stop();
	            });
	        }
        }
	}, []);

	return (
		<div className="attendanceRoomContainer">
			<div className="cameraContainer">
				<div className="cameraFeedBox" ref={cameraFeedBoxRef}>
					<video className="cameraFeed" ref={cameraFeedRef}></video>
				</div>

				<div className="cameraScanButtons">
					<div className="cameraBrightnessButton cameraControlButton" onClick={handleBrightnessDecrease}>
						<span className="material-symbols-outlined cameraBrightnessButtonIcon">
							remove
						</span>
					</div>

					<div className="classButton cameraButton cameraScanButton" ref={scanButtonRef} onClick={handleScan}>
						<span className="material-symbols-outlined cameraScanIcon">
							sensor_occupied
						</span>

						Scan
					</div>

					<div className="cameraBrightnessButton cameraControlButton" onClick={handleBrightnessIncrease}>
						<span className="material-symbols-outlined cameraBrightnessButtonIcon">
							add
						</span>
					</div>
				</div>
			</div>

			<div className="studentList">
				<div className="classHeader">
					<h3>
						Scanning face for attendance
					</h3>

					<div className="backButton" onClick={() => {setPage("home")}}>
						<span className="material-symbols-outlined">
							undo
						</span>
					</div>
				</div>

				<div className="attendanceBox">
					<div className="classOverflow">
						{studentItems}
					</div>
				</div>

				<div className="attendanceBoxFinishContainer">
					<div className="classButton cameraButton finishAttendanceButton" onClick={finishScan}>
						<span className="material-symbols-outlined finishScanIcon">
							check_small	
						</span>

						Finish Attendance
					</div>
				</div>
			</div>
		</div>
	);
}

export default AttendanceRoom;
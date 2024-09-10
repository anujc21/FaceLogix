import React, {useState, useEffect, useRef} from "react";
import Mumble from "mumble-js";
import notify from "./notify";
import * as faceapi from "@vladmandic/face-api";

function PhotoClicker({setPage, setLoading}){
	const clickButtonRef = useRef();

	const cameraFeedRef = useRef();

	const cameraFeedBoxRef = useRef();

	const [brightness, setBrightness] = useState(1);

	const keys = [];

	let mumble;

	function handleScan(){
		const video = cameraFeedRef.current;

		const cameraFeedBox = cameraFeedBoxRef.current;
		const cameraFeedBoxRect = cameraFeedBox.getBoundingClientRect();

		const canvas = document.createElement("canvas");

		const size = {
			x: -canvas.width,
			y:  0,
			width: canvas.width,
			height: canvas.height,
		};

		if (video.videoWidth >= video.videoHeight){
			canvas.width = (cameraFeedBoxRect.width > 280) ? (cameraFeedBoxRect.width + 70) : 350;
			canvas.height = video.videoHeight;

			size.x = -video.videoWidth/1.3;
			size.y =  0;
			size.width = video.videoWidth;
			size.height = canvas.height;
		}

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

		faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor().then((faceDetection) => {
			if (faceDetection){
				notify("Photo cliked!", 2000);

				const message = new SpeechSynthesisUtterance();

				message.text = "photo cliked";

				window.speechSynthesis.speak(message);

				const downloadLink = document.createElement("a");

				downloadLink.href = image.src;

				downloadLink.download = "photo.jpg";

				document.body.appendChild(downloadLink);

				downloadLink.click();

				document.body.removeChild(downloadLink);
			}
			else{
				notify("Please be in the frame!", 2000);

				const message = new SpeechSynthesisUtterance();

				message.text = "please be in the frame";

				window.speechSynthesis.speak(message);
			}
		});
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

		navigator.mediaDevices.getUserMedia({video: true}).then(function(stream){
			const video = cameraFeedRef.current;

			video.srcObject = stream;
			video.autoplay = true;

			video.setAttribute("playsinline", "");

			streamCurrent = stream;

			setLoading(false);
		});

		return () => {
        	if (streamCurrent){
	            streamCurrent.getTracks().forEach((track) => {
	                track.stop();
	            });
	        }
        }
	}, []);

	return (
		<div className="photoClicker">
			<div className="classButton cameraButton backHomeButton" onClick={() => setPage("home")}>
				<span className="material-symbols-outlined cameraScanIcon">
					arrow_back
				</span>

				Back to Dashboard
			</div>

			<div className="photoClickerCameraContainer">
				<div className="photoClickerCameraFeedBox" ref={cameraFeedBoxRef}>
					<video className="cameraFeed" ref={cameraFeedRef}></video>
				</div>

				<div className="cameraScanButtons photoClickerButtons">
					<div className="cameraBrightnessButton" onClick={handleBrightnessDecrease}>
						<span className="material-symbols-outlined cameraBrightnessButtonIcon">
							remove
						</span>
					</div>

					<div className="classButton cameraScanButtons" ref={clickButtonRef} onClick={handleScan}>
						<span className="material-symbols-outlined cameraScanIcon">
							sensor_occupied
						</span>

						Click
					</div>

					<div className="cameraBrightnessButton" onClick={handleBrightnessIncrease}>
						<span className="material-symbols-outlined cameraBrightnessButtonIcon">
							add
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PhotoClicker;
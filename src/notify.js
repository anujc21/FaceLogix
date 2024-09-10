import anime from "animejs";

function notify(text, timeout){
	const notificationBox = document.createElement("div");

	notificationBox.classList.add("notificationBox");

	const notificationText = document.createElement("h5");

	notificationText.classList.add("notificationText");

	notificationText.innerText = text;

	notificationBox.appendChild(notificationText);

	document.body.appendChild(notificationBox);

	anime({
		targets: notificationBox,
		translateX: ["-50%", "-50%"],
		translateY: ["-100%", "0"],
		duration: 200,
		easing: "easeInOutQuad",

		complete: () => {
			setTimeout(() => {
				anime({
					targets: notificationBox,
					opacity: "0",
					duration: 200,
					easing: "easeInOutQuad",

					complete: () => {
						notificationBox.remove();
					}
				});
			}, timeout);
		}
	});
}

export default notify;
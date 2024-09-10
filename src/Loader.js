import React, {useEffect, useRef} from "react";
import anime from "animejs";

function Loader(){
	const loaderBall1Ref = useRef();

	const loaderBall2Ref = useRef();

	useEffect(() => {
		anime({
			targets: loaderBall1Ref.current,
			width: ["50px", "100px"],
			height: ["50px", "100px"],
			easing: "easeInOutQuad",
			direction: "alternate",
			loop: true,
			duration: 500
		});

		anime({
			targets: loaderBall2Ref.current,
			width: ["100px", "50px"],
			height: ["100px", "50px"],
			easing: "easeInOutQuad",
			direction: "alternate",
			loop: true,
			duration: 500
		});
	}, []);

	return (
		<div className="loaderContainer">
			<div className="loaderBall1" ref={loaderBall1Ref}></div>
			<div className="loaderBall2" ref={loaderBall2Ref}></div>
		</div>
	);
}

export default Loader;
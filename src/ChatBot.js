import React, {useState, useEffect, useRef} from "react";
import anime from "animejs";

function ChatBot({userData, messages, setMessages}){
	const chatButtonRef = useRef();

	const chatBoxRef = useRef();

    const chatOverflowRef = useRef();

	const inputRef = useRef();

	const chats = messages.map((message, index) => {
		const classValue = (message.sender === "ChatBot") ? "chatMessage" : "chatMessage chatMessageSelf";

		return (
			<div className={classValue} key={index}>
				<div className="chatMessageHeader">
					{message.name}
				</div>

				<div className="chatMessageBody">
					{message.value}
				</div>
			</div>
		);
	});

	const responses = {
		"what app website": "This app enables you to record your attendance sessions using face recognition technique. Feel free to ask further about it!",
		"how use usage explain guide": "You can create classes and add students to yours classes using this app. Then you can start taking attendance of each class using face recognition. To scan your face, you need to say 'Start Scanning' out loud.",
		"start take taking record attendance begin": "To start an attendance session, select a class after clicking the 'Your Classes' button in the home page, then you can start the attendance by clicking the 'Start Attendance' button.",
		"add create student students picture pictures image images photo photos name names roll id": "To add a student you can click the 'Add Student' button in the home page. Then you can add their name, roll number and pictures.",
	    "add class classes create new": "To add a new class, click the 'Your Classes' button and then the 'Add Class' button where you'll be prompted to enter your new class name.",
	    "click take photo photos picture pictures image images": "To take pictures you can use the app's photo clicker which can be accessed by clicking the 'Take Photo' button in the home page. You need to say 'Take Photo' out loud to click a picture.",
	    "see access watch class classes": "To access your classes you can click the 'Your Classes' button which will show you a list of all the classes created by you.",
	    "save download attendance scanning scannings": "To save your attendance you need to first finish the ongoing attendance using the 'Finish Attendance' button in the attendance room, then you'll be prompted to download your attendance as a text file or an excel file.",
	    "logout quit close exit": "To logout, click the logout icon at the top right of the app.",
	    "change account switch different another gmail google": "To switch account, logout the app using the icon at the top right of the app then select another account for login."
	};

	function query(data, socket){
		data = data.toLowerCase().replace(/[^\w\s]/g, "");

	    const keywords = data.split(" ");

	    let maxMatchCount = 0;

	    let matchedResponse = null;

	    Object.keys(responses).forEach((response) => {
	        const responseWords = response.split(" ");

	        let matchCount = 0;

	        responseWords.forEach((word) => {
	            if (keywords.includes(word)) {
	                ++matchCount;
	            }
	        });

	        if (matchCount > maxMatchCount) {
	            maxMatchCount = matchCount;

	            matchedResponse = responses[response];
	        }
	    });

	    if (matchedResponse){
            setMessages((oldMessages) => {
                return [...oldMessages, {
		    		sender: "ChatBot",
		    		name: "ChatBot",
		    		value: matchedResponse
		    	}];
            });
	    }
	    else{
            setMessages((oldMessages) => {
                return [...oldMessages, {
		    		sender: "ChatBot",
		    		name: "ChatBot",
		    		value: "Sorry, I don't understand! Can I assist you with something else?"
		    	}];
            });
	    }
	}

	function sendMessage(){
		const newMessage = inputRef.current.value.slice(0, 100);

		if (newMessage){
	    	inputRef.current.value = "";

	    	setMessages((oldMessages) => {
	    		return [...oldMessages, {
	    			sender: "user",
	    			name: userData.name,
	    			value: newMessage
	    		}];
	    	});

	    	query(newMessage);
	    }
	}

	function chatButtonClick(){
		chatButtonRef.current.style.visibility = "hidden";

		chatBoxRef.current.style.visibility = "visible";

		anime({
			targets: chatBoxRef.current,
			translateX: ["100%", "0"],
			duration: 200,
			easing: "easeInOutQuad"
		});
	}

	function chatCloseClick(){
		anime({
			targets: chatBoxRef.current,
			translateX: ["0", "100%"],
			duration: 200,
			easing: "easeInOutQuad",

			complete: () => {
				chatButtonRef.current.style.visibility = "visible";

				chatBoxRef.current.style.visibility = "hidden";
			}
		});
	}

	useEffect(() => {
		if (messages.length > 30){
			setMessages((oldMessages) => {
				const newMessages = [...oldMessages];

				newMessages.splice(0, 1);

				return newMessages;
			});
		}

		chatOverflowRef.current.scrollTop = chatOverflowRef.current.scrollHeight;
	}, [messages]);

	return (
		<>
			<div className="chatButton" onClick={chatButtonClick} ref={chatButtonRef}>
				<span className="material-symbols-outlined chatIcon">
					chat
				</span>
			</div>

			<div className="chatBox" ref={chatBoxRef}>
				<div className="chatBoxHeader">
					<div className="chatBoxTitle">
						<h3>
							Assistant Bot
						</h3>
					</div>

					<div className="chatCloseButton" onClick={chatCloseClick}>
						<span className="material-symbols-outlined chatCloseIcon">
							close
						</span>
					</div>
				</div>

				<div className="chatMessageContainer">
					<div className="chatMessageOverflow" ref={chatOverflowRef}>
						<div className="chatMessage">
							<div className="chatMessageHeader">
								ChatBot
							</div>

							<div className="chatMessageBody">
								Hello, {userData.name}! How can I assist you?
							</div>
						</div>

						{chats}
					</div>
				</div>

				<div className="chatMessageInputContainer">
					<input className="chatMessageInput" maxLength="100" ref={inputRef}/>

					<div className="chatMessageSendButton" onClick={sendMessage}>
						<span className="material-symbols-outlined chatCloseIcon">
							send
						</span>
					</div>
				</div>
			</div>
		</>
	);
}

export default ChatBot;
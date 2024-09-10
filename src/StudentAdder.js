import React, {useState, useRef} from "react";
import {doc, setDoc}  from "firebase/firestore";
import {v4 as uuid} from "uuid";
import Compressor from "compressorjs";
import notify from "./notify";

function StudentAdder({db, userData, setPage, setLoading, studentAddingClass}){
	const nameRef = useRef();

	const rollRef = useRef();

	const [previewText, setPreviewText] = useState("NO IMAGES ADDED");

	const [pictures, setPictures] = useState([]);

	function updateImage(event){
		const input = event.target;

		if (input.files.length !== 0){
			const images = [];

	        Object.keys(input.files).forEach((file, index) => {
		        const reader = new FileReader();

		        function addFile(image){
			        reader.readAsDataURL(image);

			        reader.onload = (readerEvent) => {
			            const base64String = readerEvent.target.result;
			        
			            images.push(base64String);

			            if (index === input.files.length - 1){
			            	setPictures(images);

			            	setLoading(false);

			            	setPreviewText(`${input.files.length} IMAGES ADDED`);
			            }
			        }
		        }

		        function compressFile(image, imageQuality){
		        	new Compressor(image, {
                       	quality: imageQuality,

                       	success: (result) => {
                       		if (result.size <= (300 * 1024)){
                       			addFile(image);
                   			}
                       		else{
                       			if (imageQuality > 0.1){
                       				compressFile(image, parseFloat((imageQuality - 0.1).toFixed(1)));
                       			}
                       			else{
                       				addFile(image);
                       			}
                       		}
                       	}
		        	});
		        }

		        if (input.files[file].size > (300 * 1024)){
		        	compressFile(input.files[file], 0.9);
		        }
		        else{
		        	addFile(input.files[file]);
		        }
		    });
		}
		else{
			setLoading(false);
		}

		setLoading(true);
	}

	function addStudent(){
		const studentName = nameRef.current.value;

		const studentRoll = rollRef.current.value;

		if (studentName && studentRoll){
			if ((pictures.length > 3) || (pictures.length < 3)){
				notify("Add exactly 3 images!", 2000);
			}
			else{
				const studentID = uuid();

				setDoc(doc(db, "users", userData.id, "classes", studentAddingClass, "students", studentID), {
					name: studentName.slice(0, 30),
					roll: studentRoll.slice(0, 15),
					images: pictures
				}).then(() => {
		            setPage("home");

		            setLoading(false);

		            notify("Student added successfully!", 2000);
				});

				setLoading(true);
			}
		}
		else{
			notify("Fill name and roll number!", 2000);
		}
	}

	return (
		<div className="studentAdderContainer">
			<h3 className="studentAdderHeader">
				Student Details
			</h3>

			<h4 className="studentAdderName">
				Student Name
			</h4>

			<input className="studentAdderNameInput" maxLength="30" ref={nameRef}/>

			<h4 className="studentAdderRoll">
				Student Roll Number
			</h4>

			<input className="studentAdderRollInput" maxLength="15" ref={rollRef}/>

			<h4 className="studentAdderPictures">
				Student Pictures (3)
			</h4>

			<label className="studentAdderPicturesImageButton">
				<span className="material-symbols-outlined studentAdderImageIcon">
					upload_file
				</span>

				Upload Pictures

				<input className="studentAdderPicturesImageInput" type="file" accept="image/*" onChange={(event) => {updateImage(event)}} multiple/>
			</label>

			<h6 className="studentAdderPicturesImagePreview">
				{previewText}
			</h6>

			<div className="classAdderButtons">
				<div className="classAdderCloseButton studentAdderButtons" onClick={() => {setPage("home")}}>
					<span className="material-symbols-outlined classAdderIcon">
							close
						</span>

						Cancel
					</div>

				<div className="classAdderAddButton studentAdderButtons" onClick={() => {addStudent()}}>
					<span className="material-symbols-outlined classAdderIcon">
						add
					</span>

					Add
				</div>
			</div>
		</div>
	);
}

export default StudentAdder;
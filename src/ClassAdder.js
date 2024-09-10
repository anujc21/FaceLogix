import React, {useRef} from "react";
import {collection, doc, setDoc, getDocs} from "firebase/firestore";
import {v4 as uuid} from "uuid";
import notify from "./notify";

function ClassAdder({db, userData, setPage, setLoading, setClasses, setClassAdding}){
	const inputRef = useRef();

	function handleAddClass(){
		const classAddedName = inputRef.current.value; 
		
		if (classAddedName.length > 0){
			setLoading(true);

		    setClassAdding(false);

			const classID = uuid();

			if (classAddedName.length > 0){
				setDoc(doc(db, "users", userData.id, "classes", classID), {
					id: classID,
					name: classAddedName.slice(0, 35)
				}).then(() => {
					getDocs(collection(db, "users", userData.id, "classes")).then((data) => {
						const classes = [];

						let index = 0;

						if (data.size === 0){
							setClasses([]);

							setLoading(false);
						}
						else{
							data.forEach((value) => {
								classes.push(value.data());

								if (index === (data.size - 1)){
									setClasses(classes);

									setLoading(false);

		            				notify("Class added successfully!", 2000);
								}
								else{
									++index;
								}
							});
						}
					});
				});
			}
		}
	}

	return (
		<div className="classAdderBackground">
			<div className="classAdderContainer">
				<h4 className="classAdderName">
					Enter New Class Name
				</h4>

				<input className="classAdderInput" maxLength={35} ref={inputRef}/>

				<div className="classAdderButtons">
					<div className="classAdderCloseButton" onClick={() => setClassAdding(false)}>
						<span className="material-symbols-outlined classAdderIcon">
							close
						</span>

						Cancel
					</div>

					<div className="classAdderAddButton" onClick={() => handleAddClass()}>
						<span className="material-symbols-outlined classAdderIcon">
							add
						</span>

						Add
					</div>
				</div>
			</div>
		</div>
	);
}

export default ClassAdder;
import React, {useEffect} from "react";
import {collection, getDocs} from "firebase/firestore";

function StudentClassSelector({db, userData, setPage, setLoading, classes, setClasses, setStudentAddingClass}){
	const classItems = classes.map((classItem, classIndex) => {
		return (
			<div className="classSelf" key={classIndex} onClick={() => {handleOpenClass(classItem.id)}}>
				<h5>
					{classItem.name}
				</h5>
			</div>
		);
	});

	function handleOpenClass(id){
		setStudentAddingClass(id);

		setPage("studentAdder");
	}

	useEffect(() => {
		setLoading(true);

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
					}
					else{
						++index;
					}
				});
			}
		});
	}, []);

	return (
		<div className="classes">
			<div className="classHeader">
				<h3>
					Choose Class
				</h3>
		
				<div className="backButton" onClick={() => {setPage("home")}}>
					<span className="material-symbols-outlined">
						undo
					</span>
				</div>
			</div>

			<div className="classBox">
				<div className="classOverflow">
					{classItems}
				</div>
			</div>
		</div>
	);
}

export default StudentClassSelector;
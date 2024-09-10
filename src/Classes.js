import React, {useEffect} from "react";
import {collection, getDocs} from "firebase/firestore";

function Classes({db, userData, setPage, setLoading, classes, setClasses, setStudents, setClassAdding, setCurrentClass}){
	const classItems = classes.map((classItem, classIndex) => {
		return (
			<div className="classSelf" key={classIndex} onClick={() => {handleOpenClass(classItem)}}>
				<h5>
					{classItem.name}
				</h5>
			</div>
		);
	});

	function handleOpenClass(classItem){
		setLoading(true);

		setCurrentClass(classItem.name);

		getDocs(collection(db, "users", userData.id, "classes", classItem.id, "students")).then((data) => {
			const students = [];

			let index = 0;

			if (data.size === 0){
				setStudents([]);

				setPage("students");

				setLoading(false);
			}
			else{
				data.forEach((value) => {
					students.push(value.data());

					if (index === (data.size - 1)){
						setStudents(students);

						setPage("students");

						setLoading(false);
					}
					else{
						++index;
					}
				});
			}
		});
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
					Your Classes
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

					<div className="classAddButton" onClick={() => {setClassAdding(true)}}>
						Add Class

						<span className="material-symbols-outlined appBarIcon">
							add
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Classes;
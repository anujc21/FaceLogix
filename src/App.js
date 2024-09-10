import React, {useState, useEffect} from "react";
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import * as faceapi from "@vladmandic/face-api";
import Loader from "./Loader";
import AppBar from "./AppBar";
import Login from "./Login";
import WelcomeMessage from "./WelcomeMessage";
import ClassContainer from "./ClassContainer";
import Classes from "./Classes";
import ClassAdder from "./ClassAdder";
import Students from "./Students";
import StudentClassSelector from "./StudentClassSelector";
import StudentAdder from "./StudentAdder";
import AttendanceRoom from "./AttendanceRoom";
import AttendanceDownloader from "./AttendanceDownloader";
import PhotoClicker from "./PhotoClicker";
import ChatBot from "./ChatBot";
import "./App.css";

const app = initializeApp({
    apiKey: "AIzaSyCvRY1GMdWxcZMUcm14zMSyOF67MthlMm0",
    authDomain: "faceattendancemain.firebaseapp.com",
    projectId: "faceattendancemain",
    storageBucket: "faceattendancemain.appspot.com",
    messagingSenderId: "979651049148",
    appId: "1:979651049148:web:da1a40dcff1528b93b42b9"
});

const db = getFirestore(app);

function App(){
    const [loading, setLoading] = useState(true);

    const [loggedIn, setLoggedIn] = useState(false);

    const [userData, setUserData] = useState({});

    const [page, setPage] = useState("login");

    const [classes, setClasses] = useState([]);

    const [classAdding, setClassAdding] = useState(false);
    
    const [currentClass, setCurrentClass] = useState("");

    const [students, setStudents] = useState([]);

    const [studentAddingClass, setStudentAddingClass] = useState("");

    const [currentAttendanceData, setCurrentAttendanceData] = useState([]);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models").then(() => {
            faceapi.nets.faceLandmark68Net.loadFromUri("/models").then(() => {
                faceapi.nets.faceRecognitionNet.loadFromUri("/models").then(() => {
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    const width = 1;
                    const height = 1;

                    canvas.width = width;
                    canvas.height = height;

                    context.fillStyle = "#FFFFFF";

                    context.fillRect(0, 0, width, height);

                    const image = new Image();

                    image.src = canvas.toDataURL("image/jpg");

                    faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor().then(() => {
                        const user = JSON.parse(localStorage.getItem("attendance-app-user"));

                        if (user){
                            setLoggedIn(true);

                            setUserData(user);

                            setPage("home");
                        }

                        setLoading(false);
                    });
                });
            });
        });
    }, []);

    return (
        <>
            <AppBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUserData={setUserData} setPage={setPage} setMessages={setMessages}/>
            
            {(page === "login") &&
                <Login db={db} setLoggedIn={setLoggedIn} setUserData={setUserData} setPage={setPage}/>
            }

            {(page === "home") &&
                <>
                    <WelcomeMessage userData={userData}/>
                    <ClassContainer setPage={setPage}/>
                </>
            }

            {(page === "classes") &&
                <Classes db={db} userData={userData} setPage={setPage} setLoading={setLoading} classes={classes} setClasses={setClasses} setStudents={setStudents} setClassAdding={setClassAdding} setCurrentClass={setCurrentClass}/>
            }

            {(page === "students") &&
                <Students setPage={setPage} currentClass={currentClass} students={students}/>
            }

            {(page === "studentClassSelector") &&
                <StudentClassSelector db={db} userData={userData} setPage={setPage} setLoading={setLoading} classes={classes} setClasses={setClasses} setStudentAddingClass={setStudentAddingClass}/>
            }

            {(page === "studentAdder") &&
                <StudentAdder db={db} userData={userData} setPage={setPage} setLoading={setLoading} studentAddingClass={studentAddingClass}/>
            }

            {(page === "attendanceRoom") &&
                <AttendanceRoom setPage={setPage} setLoading={setLoading} students={students} setCurrentAttendanceData={setCurrentAttendanceData}/>
            }

            {(page === "attendanceDownloader") &&
                <AttendanceDownloader setPage={setPage} setLoading={setLoading} currentAttendanceData={currentAttendanceData} currentClass={currentClass}/>
            }

            {(page === "photoClicker") &&
                <PhotoClicker setPage={setPage} setLoading={setLoading}/>
            }

            {(classAdding) &&
                <ClassAdder db={db} userData={userData} setPage={setPage} setLoading={setLoading} setClasses={setClasses} setClassAdding={setClassAdding}/>
            }

            {(loading) &&
                <Loader/>
            }

            <ChatBot userData={userData} messages={messages} setMessages={setMessages}/>
        </>
    );
}

export default App;
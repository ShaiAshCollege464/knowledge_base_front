import "./Course.css"
import "./NewForm.css"
import "./Card.css"
import {useState,useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Pagination} from "@mui/material";
import {COURSE_URL} from "../Utils/Constants.jsx";

export default function CoursesList(){
    const navigate = useNavigate();
    const [lecturers, setLecturers] = useState([])
    const [courses, setCourses] = useState([])
    const [chosenLecturer, setChosenLecturer] = useState("")
    const [courseName,setCourseName] = useState("")
    // const [currentCourse, setCurrentCourse] = useState({name:"",id:""})
    const [description, setDescription] = useState("")
    // const [goToCourse, setGoToCourse] = useState(false)
    const SERVER_URL = "http://localhost:8080"
    const [newCourseVisibility, setNewCourseVisibility] = useState(false)

    function getLecturers(){
        axios.get(SERVER_URL+"/get-lecturers")
            .then(response => {
                if (response.data!=null){
                    setLecturers(response.data)
                }
            })
    }

    function getAllCourses(){
        axios.get(SERVER_URL+"/get-all-courses")
            .then(response=>{
                console.log(response.data)
                if(response.data!=null){
                    setCourses(response.data);
                    console.log(courses);
                }
            })
    }
    function addCourse(){
        axios.get(SERVER_URL+"/add-course?name="+ courseName + "&description=" + description + "&lecturer=" + getLecturerId()).then(
            response => {
                getAllCourses();
                setCourseName("");
                setDescription("");
                setChosenLecturer("");
            }
        )

    }

    function getLecturerId(){
        const temp = lecturers.filter(lecturer =>{return lecturer.name===chosenLecturer});
        return temp[0].id;
    }


    function handleNewCourseVisibility(){
        setNewCourseVisibility(!newCourseVisibility)
    }
    function courseComponent(index, lecturer, course, description,courseId){
        return (
            <div id={index}>
                <div className={"card"}
                     onClick={() => navigate(COURSE_URL + courseId)}>
                    <div className="card-content-image">
                        <img style={{width: "100%", height: "100%"}} src={"src/assets/course-image-placeholder.png"}
                             alt={"course image"}/>
                    </div>
                    <div className="card-content-text">
                        <text style={{
                            color: "darkgrey",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            height:"15%"
                        }}>{course} • {lecturer}</text>
                        <text style={{color: "black", fontSize: "1.3rem", fontWeight: "bold", height:"85%"}}>{description}</text>
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        getLecturers();
        getAllCourses();

    }, []);

    function addNewCourseComponent() {
        return (
            <div className={`add-new-form`}>
                <div className="new-form-image">
                    <img style={{width: "100%", height: "100%"}} src={"src/assets/course-image-placeholder.png"}
                         alt={"course image"}/>
                </div>
                {/*<h1>New Course</h1>*/}
                <input className={"new-form-input"} type={"text"} value={courseName}
                       onChange={(event) => setCourseName(event.target.value)} placeholder={"Course Name"}/>
                <textarea className={"new-form-input-desc"} type={"text"} value={description}
                          onChange={(event) => setDescription(event.target.value)} placeholder={"Description"}/>
                <select className={"new-form-input-select"} value={chosenLecturer}
                        onChange={(event) => setChosenLecturer(event.target.value)}>

                    <option value="" disabled>Select lecturer</option>

                    {
                        lecturers.map((lecturer, index) => {
                            return (
                                <option key={index} value={lecturer.name}>
                                    {lecturer.name}
                                </option>
                            );
                        })
                    }
                </select>
                <button className={"new-form-button"} onClick={() => {
                    addCourse()
                    setNewCourseVisibility(false)
                }}>Add Course
                </button>
            </div>
            // </div>
        )
    }
    function coursesListComponent(){
        return(
            courses.map((course, index) => {
                return (
                    courseComponent(index, course.lecturerEntity.name, course.name, course.description, course.id)
                )
            })
        )
    }
    function nothingToShowComponent(){
        return (
            <div className={"nothing-to-show"}>
                <text>Nothing to show here yet 🤷</text>
                <br/>
                <text>Maybe click on the + icon to add a new Course</text>
            </div>
        )
    }
    function handleComponentRendering(){
        if (courses.length === 0 && !newCourseVisibility){
            return nothingToShowComponent()
        } else if (courses.length > 0) {
            return coursesListComponent()
        }
    }
    return (
        <div className="courses-page">
            <div className={"upper-container"}>
                <text className={"course-page-header"} style={{fontSize: "3rem"}}>Courses</text>
            </div>
            <div className={"lower-container"}>
                <div className={"card-container"} aria-expanded={newCourseVisibility}>
                    {newCourseVisibility && addNewCourseComponent()}
                    {handleComponentRendering()}
                    <button className={"add-new"}
                            onClick={() => handleNewCourseVisibility()}>
                        <svg aria-expanded={newCourseVisibility} xmlns="http://www.w3.org/2000/svg" className="plus"
                             viewBox="0 0 160 160" width="35" fill={"white"}>
                            <rect className="vertical-line" x="70" width="20" height="160"/>
                            <rect className="horizontal-line" y="70" width="160" height="20"/>
                        </svg>
                    </button>
                </div>

            </div>


        </div>
    )
}
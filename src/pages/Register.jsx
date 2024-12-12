import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Form.css';
import axios from "axios";
import {teal} from "@mui/material/colors";
import CodeInputComponent from "./CodeInputComponent.jsx";

function Register() {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOtpComponent,setShowOtpComponent] = useState(false);
    const [email, setEmail] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [errorCode, setErrorCode]= useState(-1);
    const [phoneNumber,setPhoneNumber] = useState("")
    const navigate = useNavigate();

    const SERVER_URL = "http://localhost:8080"
    const INVALID_REPEAT_PASSWORD = 102;
    const USERNAME_NOT_AVAILABLE = 103

    function register(){
        console.log("rrrrr")
        axios.get("http://localhost:8080/register?userName="+username+"&password="+password+"&name="+name+"&lastName="+lastName+"&email="+email+"&role="+jobTitle+"&phoneNumber="+phoneNumber)
            .then(response => {
                if (response.data.success){
                    if (!response.data.registeredSuccessfully){
                        setErrorCode(USERNAME_NOT_AVAILABLE)
                    }else{
                        console.log(response.data)
                        setShowOtpComponent(true);
                        // navigate("/codeInputComponent", { state: { userName: username, password: password ,type:"register"} });
                    }
                }
            })
    }
    const onOtpSubmit = (otp) => {
        axios.get("http://localhost:8080/check-otp-to-register?username="+username+"&otp="+otp)
            .then(response => {
                if (response.data.success){
                    if (!response.data.registeredSuccessfully){
                        console.log("no" + username)
                    }else{
                        setShowOtpComponent(false);
                        console.log(response.data)
                        navigate("/");
                    }
                }
            })
    }
    const allFieldsFilled = () => {
        return (
            name.trim() &&
            lastName.trim() &&
            username.trim() &&
            password.trim() &&
            passwordConfirm.trim() &&
            email.trim() &&
            jobTitle.trim()
        );
    };
    function pattern(type){
        switch(type){
            case "password": return (".{0}|.{8,}");
            case "text": return (".{0}|.{3,}");
            case "email": return (".{0}|.{0,}");
            case "username": return (".{0}|.{5,}");
            case "tel": return (".{0}|.{10,}");
        }
    }
    function getInput(title, value, setValue, type) {
        return (
            <div className={"input-container"} key={title}>
                <label className={"form-label"}>{title}:</label>
                <div style={{ display: "flex", width:"100%" }}>
                    {type === "password" && <button className={"show-password"} style={{}}
                                                    onClick={(event) => {title==="Password" ? handleShowPassword(event) : handleShowConfirmPassword(event)}}
                    ></button>}
                    <input required
                           className={"form-input"}
                           type={type}
                           name={title}
                           value={value}
                           onChange={(e) => setValue(e.target.value)}
                           placeholder={title}
                           pattern={pattern(type)}
                           size={1}

                    />
                </div>


            </div>
        );
    }
    function showErrorCode() {
        let errorMessage = "";
        switch (errorCode){

            case -1 : errorMessage = "Please fill in all fields"; break;
            case  USERNAME_NOT_AVAILABLE :errorMessage = "Username not available";break;
            case INVALID_REPEAT_PASSWORD : errorMessage ="Invalid repeat password ";break;
        }
        return errorMessage;
    }
    function handleShowPassword(event){
        setShowPassword(!showPassword);
        let input = event.target.closest("div").lastChild
        console.log(input)
        if (showPassword) {
            event.currentTarget.style.backgroundImage = 'url("src/assets/form/hide_password.png")';
            input.setAttribute("type", "text");
        } else{
            event.currentTarget.style.backgroundImage = 'url("src/assets/form/show_password.png")';
            input.setAttribute("type", "password");
        }
    }
    function handleShowConfirmPassword(event){
        setShowConfirmPassword(!showConfirmPassword);
        let input = event.target.closest("div").lastChild
        if (showConfirmPassword) {
            event.currentTarget.style.backgroundImage = 'url("src/assets/form/hide_password.png")';
            input.setAttribute("type", "text");
        } else {
            event.currentTarget.style.backgroundImage = 'url("src/assets/form/show_password.png")';
            input.setAttribute("type", "password");
        }
    }
    return (
        <div className="form-page">
            <div className="form-container">
                <div className={"right-side"}>
                    <div className={"form-headers"}>
                        <img style={{width: "50px", height: "50px"}} src={"src/assets/book-logo.PNG"} alt={"logo"}/>
                        <text style={{fontSize: "2.4rem", fontWeight: "bold"}}>Register</text>
                        <text style={{fontSize: "1.5rem", fontWeight: "bold"}}>Thank you for joining us 🫡</text>
                    </div>

                    <div className={"form register"} >
                        <label> {showErrorCode()}</label>
                        {/* Form fields using getInput */}
                        <div className="input-pair">
                            {getInput("Name", name, setName, "text")}
                            {getInput("Last Name", lastName, setLastName, "text")}
                        </div>
                        <div className={"input-pair"}>
                            {getInput("Email", email, setEmail, "email")}
                            {getInput("Phone", phoneNumber, setPhoneNumber, "tel")}
                        </div>
                        <div className="input-pair">
                            {getInput("Username", username, setUsername,"username")}
                            <div className={"input-container"}>
                                <label className={"form-label"}>Job Title:</label>
                                <select required className={"form-input"} value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}>
                                    <option value="" disabled>Select Job Title</option>
                                    <option value="Student">Student</option>
                                    <option value="Lecturer">Lecturer</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-pair">
                            {getInput("Password", password, setPassword, "password")}
                            {getInput("Confirm Password", passwordConfirm, setPasswordConfirm, "password")}
                        </div>

                    </div>
                    <div className={"submit-container"}>
                        <button onClick={()=>register()} id={"submit-button"}
                                className={allFieldsFilled() ? "active" : ""}
                                disabled={!allFieldsFilled()}>
                            Register Now
                        </button>
                        <div className={"have-an-account"}>
                            <label>Already have an account?</label>
                            <button className={"have-an-account-button"} onClick={() => navigate('/')}> Login Now!
                            </button>
                        </div>
                    </div>
                </div>
                <div className={"left-side"}>
                    <div className={"image-container"}>
                        <img className={"form-image"} style={{width: "500px", height: "500px"}}
                             src={"src/assets/image11.png"}
                             alt={"register-page-image"}/>
                    </div>

                </div>
            </div>
            {showOtpComponent&&<CodeInputComponent length={6} username={username} onOtpSubmit={onOtpSubmit}/>}
        </div>

    );
}

export default Register;
import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import './Form.css';
import axios from "axios";
import Error from "../Components/General/Error/Error.jsx"
import Cookies from 'universal-cookie';
import OtpComponent from "./OtpComponent.jsx";
import {DASHBOARD_URL, REGISTER_URL} from "../Utils/Constants.jsx";
import {Alert} from "@mui/material";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showOtpComponent,setShowOtpComponent] = useState(false);
    const [errorCode, setErrorCode]= useState(-1);
    const navigate = useNavigate();
    const SERVER_URL = "http://localhost:8080"
    const ERROR_PASSWORD = 401;
    const USER_NOT_EXIST = 400;

    function showErrorCode(){
        let errorMessage = "";
        switch (errorCode){
            case -1 : errorMessage = "Please fill in all fields"; break;
            case  USER_NOT_EXIST :errorMessage = "User doesn't exist, SIGN-UP 😁";break;
            case ERROR_PASSWORD : errorMessage = "Wrong Password";break;
        }
        return errorMessage;
    }
    function login(){
        axios.get(SERVER_URL+"/login?username=" + username + "&password=" + password)

            .then(response => {

                if (!response.data.success){
                    console.log(response.data);
                    setErrorCode(response.data.errorCode)
                }else{
                    console.log(response.data);
                    setShowOtpComponent(true);
                    
                }
            })
    }
    const onOtpSubmit = (otp) => {
        console.log(otp);
        axios.get("http://localhost:8080/check-otp?username="+username+"&password="+password+"&otp="+otp)
            .then(response => {
                if (response.data != null){
                    if (!response.data.success){
                        console.log("no" + username)
                        alert("הקוד לא תקין נסה שוב")
                    }else{
                        const cookies = new Cookies();
                        console.log(response.data.token);

                        cookies.set('token', response.data.token, { path: '/' });
                        const newCookies = new Cookies();
                        newCookies.set('id', response.data.id);
                        const token = cookies.get("token");

                        console.log("token: "+token);
                        console.log("otp: "+otp)
                        if (token) {
                            console.log(token);
                            navigate(DASHBOARD_URL);
                            window.location.reload()
                        } else {
                            console.log("Token not found");
                        }
                    }
                }
            })
    }
    const allFieldsFilled = () => {
        return (
            username.length>2 &&
            (
                /[A-Z]/.test(password) &&
                /[a-z]/.test(password) &&
                /[0-9]/.test(password) &&
                /[!@$%^&*_=+-]/.test(password)
            )
        );
    };
    function handleShowPassword(event){
        setShowPassword(!showPassword);
        let input = event.target.closest("div").lastChild;
        console.log(input)
        if (showPassword) {
            event.currentTarget.style.backgroundImage = 'url("src/assets/form/hide_password.png")';
            input.setAttribute("type", "text");
        } else{
            event.currentTarget.style.backgroundImage = 'url("src/assets/form/show_password.png")';
            input.setAttribute("type", "password");
        }
    }
    function getInput(title, value, setValue, type,pattern) {
        return (
            <div className={"flex input-container"} key={title}>
                <label className={"form-label"}>{title}:</label>
                <div style={{ display: "flex", width:"100%" }}>
                    {type === "password" && <button className={"show-password"}
                                                    onClick={(event) => {title==="Password" && handleShowPassword(event)}}
                    ></button>}
                    <input required
                           className={"form-input"}
                           type={type}
                           name={title}
                           value={value}
                           onChange={(e) => {
                               setValue(e.target.value)
                               setErrorCode(-1)
                           }}
                           placeholder={title}
                           pattern={pattern}
                           size={1}

                    />

                </div>
                {type === "password" && <button className={"forgot-password-button"}>Forgot Password?</button>}
            </div>
        );
    }

    const handleRegex=(type)=>{
        let regex = ""
        switch (type) {
            case "password": regex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+\\-]).{8,}'; break;
            case "username":  regex = "(?=.*[a-z]).{6,12}$"; break;
        }
        return regex
    }
                return (
                <div className="flex form-page">
                    <div className="flex form-container">
                        <div className={"flex left-side"}>
                            <div className={"flex form-headers"}>
                                <img style={{width: "50px", height: "50px"}} src={"src/assets/book-logo.PNG"} alt={"logo"}/>
                                <text style={{fontSize: "1.8rem", fontWeight: "bold"}}>Login</text>
                                <text style={{fontSize: "1.2rem", fontWeight: "bold"}}>Hi! welcome back 😊</text>
                            </div>
                            <div className={"flex form"} id="login">
                                {getInput("Username", username, setUsername, "text", handleRegex("username"))}
                                {getInput("Password", password, setPassword, "password", handleRegex("password"))}
                               {errorCode !== -1 && <Error errorMessage={showErrorCode()}/> }
                            </div>
                            <div className={"submit-container"}>
                                <div className={"input-pair"}>
                                    <button id={"submit-button"} type="submit" onClick={() => login()}
                                            className={allFieldsFilled()&&errorCode===-1 ? "active" : ""}
                                            disabled={!allFieldsFilled()||errorCode!==-1}>
                                        Login
                                    </button>
                                    <div className={"have-an-account"}>
                                        <label>Dont have an account?</label>
                                        <button className={"have-an-account-button"}
                                                onClick={() => navigate(REGISTER_URL)}> Create
                                            Now!
                                        </button>
                                    </div>
                                </div>
                            </div>

                            </div>
                            <div className={"right-side"}>
                            <div className={"image-container"}>
                                <img className={"form-image"} style={{width: "500px", height: "500px"}}
                                     src={"src/assets/image10.png"}
                                     alt={"login-page-image"}/>
                            </div>
                        </div>
                    </div>
                    {showOtpComponent&&<OtpComponent length={6} username={username} onOtpSubmit={onOtpSubmit}/>}

                </div>
                );
                }

                export default Login;
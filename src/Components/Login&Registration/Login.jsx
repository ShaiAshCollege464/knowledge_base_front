import { useState} from "react";
import { useNavigate } from 'react-router-dom';
import '../CssFiles/Form.css';
import axios from "axios";
import Error from "./Error.jsx"
import Cookies from 'universal-cookie';
import OtpComponent from "./OtpComponent.jsx";
import {DASHBOARD_URL, ERROR_PASSWORD, REGISTER_URL, SERVER_URL, USER_NOT_EXIST} from "../../Utils/Constants.jsx";



function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showOtpComponent,setShowOtpComponent] = useState(false);
    const [errorCode, setErrorCode]= useState(-1);
    const [otpVerified, setOtpVerified] = useState(false);

    const navigate = useNavigate();

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
        axios.get(SERVER_URL+"/check-otp?username="+username+"&password="+password+"&otp="+otp)
            .then(response => {
                if (response.data != null){
                    if (!response.data.success){
                        setShowOtpComponent(true);
                        setOtpVerified(false);
                    }else{
                        setOtpVerified(true);
                        setTimeout(()=>{
                            const cookies = new Cookies();
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
                            setShowOtpComponent(false);
                        },5000)

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
                <div style={{display: "flex", width: "100%"}}>
                    {type === "password" && <button className={"show-password"}
                                                    onClick={(event) => {
                                                        title === "Password" && handleShowPassword(event)
                                                    }}
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

    const handleRegex = (type) => {
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
                                    <img style={{width: "50px", height: "50px"}} src={"src/assets/icons/book-logo.PNG"}
                                         alt={"logo"}/>
                                    <text style={{fontSize: "1.8rem", fontWeight: "bold"}}>Login</text>
                                    <text style={{fontSize: "1.2rem", fontWeight: "bold"}}>Hi! welcome back 😊</text>
                                </div>
                                <div className={"flex form"} id="login">
                                    {getInput("Username", username, setUsername, "text", handleRegex("username"))}
                                    {getInput("Password", password, setPassword, "password", handleRegex("password"))}
                                    {errorCode !== -1 && <Error errorMessage={showErrorCode()}/>}
                                </div>
                                <div className={"submit-container"}>
                                    <div className={"input-pair"}>
                                        <button id={"submit-button"} type="submit" onClick={() => login()}
                                                className={allFieldsFilled() && errorCode === -1 ? "active" : ""}
                                                disabled={!allFieldsFilled() || errorCode !== -1}>
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
                                         src={"src/assets/icons/image10.png"}
                                         alt={"login-page-image"}/>
                                </div>
                            </div>
                        </div>
                        <img src={"https://i.imgur.com/9Aaen3V.png"}/>

                        {showOtpComponent && <OtpComponent arrayLength={6} username={username} onOtpSubmit={onOtpSubmit}
                                                           isVerified={otpVerified}
                                                           verifiedMessage={"Login successfully, you're transferred to your dashboard"}
                                                           unverifiedMessage={"Login was unsuccessful, try entering the code again"}/>}
                    </div>
                );
}

export default Login;
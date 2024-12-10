import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import './Form.css';
import axios from "axios";
import Cookies from 'universal-cookie';


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorCode, setErrorCode]= useState(-1);

    const navigate = useNavigate();
    const SERVER_URL = "http://localhost:8080"
    const ERROR_PASSWORD = 401;
    const USER_NOT_EXIST = 400;

    useEffect(() => {
        const cookies = new Cookies(null, { path: '/' });
        const token = cookies.get("token");
        if (token) {
            navigate("/dashboard");
        }
    }, []);

    function showErrorCode(){

        let errorMessage = "";
        switch (errorCode){

            case -1 : errorMessage = "Please fill in all fields"; break;
            case  USER_NOT_EXIST :errorMessage = "Not exist, SIGN-UP 😁";break;
            case ERROR_PASSWORD : errorMessage = "Error password";break;
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
                    const cookies = new Cookies(null, { path: '/login' });
                    cookies.set('token', response.data.token);
                    navigate("/dashboard");
                }

            })
    }
    const allFieldsFilled = () => {
        return (
            username.trim() &&
            password.trim()
        );
    };
    function getInput(title, value, setValue, type, requirement) {
        return (
            <div className={"input-container"} key={title}>
                <label className={"form-label"}>{title}:</label>
                <input required className={"form-input"}
                       type={type}
                       value={value}
                       onChange={(e) => setValue(e.target.value)}
                       placeholder={title}
                       minLength={requirement}
                />
            </div>
        );
    }

    function handleLogin() {
        //some login logic here
    }

    return (
        <div className="form-page">
            <div className="form-container">
                <div className={"right-side"}>
                    <div className={"form-headers"}>
                        <img style={{width: "50px", height: "50px"}} src={"src/assets/book-logo.PNG"} alt={"logo"}/>
                        <h1 style={{height: "30px"}}>Login</h1>
                        <h3 style={{height: "30px"}}>Hi! welcome back 😊</h3>
                    </div>
                    <div className={"form"}>

                        <div className={"input-container"}>
                            {getInput("Username", username, setUsername, "text", 5)}
                            {getInput("Password", password, setPassword, "password", 8)}
                            <button className={"forgot-password-button"}>Forgot Password?</button>

                        </div>
                        {/*<button id={"submit-button"} onClick={login}>Login</button>*/}
                        <button id={"submit-button"} type="submit" onClick={login}
                                className={allFieldsFilled() ? "active" : ""}
                                disabled={!allFieldsFilled()}>
                            Login
                        </button>
                        <div className={"have-an-account"}>
                            <label>Dont have an account?</label>
                            <button className={"have-an-account-button"} onClick={() => navigate('/register')}> Create Now!</button>
                        </div>

                    </div>
                    <label> {showErrorCode()}</label>

                </div>
                <div className={"left-side"}>
                    <div className={"image-container"}>
                        <img style={{width: "25vw", height: "40vh"}} src={"src/assets/image10.png"}
                             alt={"login-page-image"}/>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Login;
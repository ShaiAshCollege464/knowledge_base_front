import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Form.css';
import axios from "axios";
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import RegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorCode, setErrorCode]= useState(-1);

    const navigate = useNavigate();

    const SERVER_URL = "http://localhost:8080"
    const ERROR_PASSWORD = 401;
    const USER_NOT_EXIST = 400;

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
                if (response.data.success){
                    if (!response.data.loginSuccessful){
                        setErrorCode(response.data.errorCode)
                    }else{
                        navigate("/dashboard");
                    }
                }
            })
    }
    const allFieldsFilled = () => {
        return (
            username.trim() &&
            password.trim()
        );
    };
    function getInput(title, value, setValue, type = "text") {
        return (
            <div className={"input-container"} key={title}>
                <label className={"form-label"}>{title}:</label>
                <input className={"form-input"}
                       type={type}
                       value={value}
                       onChange={(e) => setValue(e.target.value)}
                       placeholder={title}
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
                        <h1 style={{height: "30px"}}>Login</h1>
                        <h3 style={{height: "30px"}}>Hi! welcome back 😊</h3>
                    </div>
                    <form className={"form"} onSubmit={handleLogin}>

                        <div className={"input-container"}>
                            {getInput("Username", username, setUsername)}
                            {getInput("Password", password, setPassword)}
                            <button className={"forgot-password-button"}>Forgot Password?</button>

                        </div>
                        {/*<button id={"submit-button"} onClick={login}>Login</button>*/}
                        <button id={"submit-button"} type="submit" onClick={login}
                                className={allFieldsFilled() ? "active" : ""}
                                disabled={!allFieldsFilled()}>
                            <label>Login</label>
                        </button>
                        <div className={"dont-have-account"}>
                            <label>Dont have an account?</label>
                            <button className={"register"} onClick={() => navigate('/register')}> Create Now!</button>
                        </div>

                    </form>
                    <label> {showErrorCode()}</label>

                </div>
                <div className={"left-side"}>
                <img style={{height:"30vh"}} src={"src/assets/images4.svg"} alt={"login-page-image"}/>
                </div>
            </div>

        </div>
    );
}

export default Login;
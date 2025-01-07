import axios from "axios";
import {SERVER_URL} from "../Utils/Constants.jsx";
import Cookies from "universal-cookie";



const cookies = new Cookies(null, {path: '/'});
const token = cookies.get("token");


export async function sendQuestion(message) {
    const params = {
        token:token,
        text: message,
    }
    try {
        const response = await axios.get(SERVER_URL+"/search", {params})
        return await response?.data;

    } catch (error) {
        console.error('Error:', error);
    }
}
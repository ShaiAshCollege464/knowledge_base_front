import axios from "axios";
import * as Constants from "../Utils/Constants.jsx";

 export async function getNotifications() {
        try {
            const response = await axios.get(Constants.URL+"/get-notifications", {})
            console.log(response?.data);
            return await response?.data;

        } catch (error) {
            console.error('Error:', error);
        }
}

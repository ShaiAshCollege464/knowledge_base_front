import axios from "axios"
import * as Constants from "../Utils/Constants.jsx";

export async function getCourses() {
        try {
            const response = await axios.get(Constants.URL+"/get-all-courses", {})
            return await response?.data;

        } catch (error) {
            console.error('Error:', error);
        }

}
export async function getCourse(id) {
    const params = {id: id}

    try {
        const response = await axios.get("http://localhost:8080//get-course", {params})
        return await response?.data;

    } catch (error) {
        console.error('Error:', error);
    }

}
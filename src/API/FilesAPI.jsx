import axios from "axios";
import {FILE_ERROR_CODE, SERVER_URL} from "../Utils/Constants.jsx";
import Cookies from "universal-cookie";



export async function uploadFiles(files ,materialId) {
    const cookies = new Cookies(null, {path: '/'});
    const token = cookies.get("token");
    const userId = cookies.get("id");

    const data = new FormData();
    data.append('materialId', materialId);
    data.append("userId",userId)
    data.append("token",token)
    for (const file of files) {
        data.append('file', file);

    }

    try {
        const response = await axios.post(SERVER_URL + "/upload-files", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return response;
    } catch (error) {
        console.error('Error:', error);
        return {status: FILE_ERROR_CODE};
    }
}

export async function getMaterialFiles(materialId) {
    const cookies = new Cookies(null, {path: '/'});
    const userId = cookies.get("id");

    const params = {
        materialId: materialId,
        userId: userId,
    }
console.log(params)
    try {
        const response = await axios.get(SERVER_URL + "/get-material-files-by-id", {params})
        return await response?.data;
    } catch (error) {
        console.error('Error:', error);
    }
}


export async function deleteMaterialFiles(materialId, fileName) {
    const cookies = new Cookies(null, {path: '/'});
    const userId = cookies.get("id");

    const data = new FormData();
    data.append('materialId', materialId);
    data.append('userId', userId);
    for (const file of fileName) {
        data.append('fileNames', file);

    }
    try {

        const response = await axios.delete(SERVER_URL + "/delete-material-files-by-id-and-name", {data},{ headers: {
                "Content-Type": "multipart/form-data"
            }})
        return await response?.data;
    } catch (error) {
        console.error('Error:', error);
    }
}
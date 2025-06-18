import axios from "./api";

export const registerUserApi = (data) => axios.post("/register", data);
export const loginUserApi = async (formData) => {
    console.log("FormData:", formData);
    return await axios.post("/login", formData); 
};

import { registerUserApi } from "../api/authApi";
import { loginUserApi } from "../api/authApi";

export const registerUserService = async (formData) => {
    try {
        const response = await registerUserApi(formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Registration failed" };
    }
}

export default registerUserService;

export const loginUserService = async (formData) => {
    try {
        const response = await loginUserApi(formData);
        console.log("API response:", response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Login failed" };
    }
};



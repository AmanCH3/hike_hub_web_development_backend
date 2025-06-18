// // import { useState } from "react";
// // import { registerUserService } from "../services/authServices";

// // export const useRegisterUser = () => {
// //     const [loading, setLoading] = useState(false);
// //     const [error, setError] = useState(null);
// //     const [data, setData] = useState(null);

// //     const register = async (formData) => {
// //         //when user clicks on register button, this function will be called
// //         //it will send the formData to the server and get the response
// //         setLoading(true);
// //         setError(null);
// //         setData(null);//clear state
// //         try {
// //             const response = await registerUserService(formData);
// //             setData(response);
// //             return response; // Return the response for further use if needed
// //         } catch (err) {
// //             setError(err.message || "Registration Failed");
// //             return null; // Return null or handle the error as needed
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //     return {
// //         register,
// //         loading,
// //         error,
// //         data
// //     };
// // }

// // export default useRegisterUser;



// import { useMutation } from "@tanstack/react-query";
// import { registerUserService } from "../services/authServices";
// import { toast } from "react-toastify";

// export const useRegisterUser = () => {
//   return useMutation(registerUserService, {
//     mutationKey: ["register-key"],
//     onSuccess: (res) => {
//       toast.success("Registration successful! Please login.");
//       // you can do more here, e.g. redirect or clear forms, but better done in component
//     },
//     onError: (error) => {
//       const message = error.response?.data?.message || "Registration failed. Please try again.";
//       toast.error(message);
//     },
//   });
// };
// export default useRegisterUser;



// import { useMutation } from '@tanstack/react-query';
// import { registerUserService } from '../services/authServices';

// export const useRegisterUser = () => {
//   return useMutation((formData) => registerUserService(formData));
// };

// export default useRegisterUser;



import { useMutation } from '@tanstack/react-query';
import { registerUserService } from '../services/authServices';
import { toast } from 'react-toastify';

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: (formData) => registerUserService(formData),
    mutationKey: ['register-key'],
    onSuccess: (res) => {
      toast.success('Registration successful! Please login.');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      toast.error(message);
    },
  });
};

export default useRegisterUser;

// // import { loginUserService } from "../services/authServices";
// // import { useMutation } from "@tanstack/react-query";
// // import { toast } from "react-toastify";

// // export const useLoginUser = () => {
// //     return useMutation({
// //         mutationFn: loginUserService,
// //         mutationKey: ["login-key"],
// //         onSuccess: (res) => {
// //             console.log("Login response:", res); // 👀 Check this

// //             // Correct: res.data is the user, res.token is the token
// //             login(res.data, res.token); // ✅ Works with backend format
// //             toast.success("Login successful!");
// //         },

// //         onError: (error) => {
// //             toast.error("Login failed. Please try again.");
// //         }
// //     });
// // };

// // export default useLoginUser;


// import { login } from '../utils/auth'; // or wherever your login fn lives

// export const useLoginUser = () => {
//   return useMutation({
//     mutationFn: loginUserService,
//     mutationKey: ['login-key'],
//     onSuccess: (res) => {
//       console.log('Login response:', res);
      
//       // Assuming your backend returns { data: user, token: '...' }
//       login(res.data, res.token); // Save user & token
      
//       toast.success('Login successful!');
//     },
//     onError: (error) => {
//       toast.error('Login failed. Please try again.');
//     },
//   });
// };
// export default useLoginUser;



import { useMutation } from '@tanstack/react-query';
import { loginUserService } from '../services/authServices';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

export const useLoginUser = () => {
  const { login } = useContext(AuthContext);

  return useMutation({
    mutationFn: loginUserService,
    mutationKey: ['login-key'],
    onSuccess: (res) => {
      console.log('Login response:', res);

      // Assuming your backend returns { data: user, token: '...' }
      login(res.data, res.token); // Save user & token

      toast.success('Login successful!');
    },
    onError: () => {
      toast.error('Login failed. Please try again.');
    },
  });
};

export default useLoginUser;

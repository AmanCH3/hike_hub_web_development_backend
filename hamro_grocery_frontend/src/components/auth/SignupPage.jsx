
// import React, { useState, useContext } from 'react';
// import { toast } from 'react-toastify';
// import NavigationContext from '../../context/NavigationContext';
// import Navbar from '../Navbar';
// import logo from '../../assets/hamro2.png';
// import { useRegisterUser } from '../../hooks/useRegisterUser'; 
// const SignupPage = () => {
//   const { navigate } = useContext(NavigationContext);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });

//   const { mutate: registerUser } = useRegisterUser();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const { fullName, email, password } = formData;

//     if (!fullName || !email || !password) {
//       toast.error('Please fill in all fields.');
//       return;
//     }

//     setIsSubmitting(true);

//     registerUser(formData, {
//       onSuccess: (res) => {
        
//         setFormData({ fullName: '', email: '', password: '' });
//         navigate('login');
//         setIsSubmitting(false);
//       },
//       onError: (err) => {
        
//         setIsSubmitting(false);
//       },
//     });
//   };

//   return (
//     <>
//       <Navbar />

//       {/* Scoped CSS */}
//       <style jsx>{`
//         header {
//           background: rgba(255, 255, 255, 0.95) !important;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
//           backdrop-filter: blur(4px) !important;
//         }
//         header nav a {
//           color: #1a1a1a !important;
//         }
//         header nav a:hover {
//           color: #15803d !important;
//         }
//         header nav button svg,
//         header nav .lg\\:hidden button svg {
//           stroke: #1a1a1a !important;
//         }
//         header nav button:hover {
//           background: #e5e7eb !important;
//         }
//         .bg-black\\/40 .bg-white {
//           background: #ffffff !important;
//         }
//         .bg-black\\/40 .bg-white a,
//         .bg-black\\/40 .bg-white button svg {
//           color: #1a1a1a !important;
//           stroke: #1a1a1a !important;
//         }
//         .bg-black\\/40 .bg-white span {
//           color: #15803d !important;
//         }
//         header nav div button.bg-green-600,
//         .bg-black\\/40 .bg-white button.bg-green-600 {
//           display: none !important;
//         }
//       `}</style>

//       <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg m-4">
//           <div className="text-center mb-8">
//             <a href="#" onClick={() => navigate('home')}>
//             <img
//                 src={logo}
//                 alt="Logo"
//                 className="h-12 w-auto mx-auto"
//               />
//             </a>
//             <p className="text-gray-500 mt-2">Start your fresh journey with us today.</p>
//           </div>

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label className="text-sm font-medium text-gray-700 block mb-2">Full Name</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                 placeholder="John Doe"
//                 disabled={isSubmitting}
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                 placeholder="you@example.com"
//                 disabled={isSubmitting}
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                 placeholder="••••••••"
//                 disabled={isSubmitting}
//               />
//             </div>
//             <div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`w-full ${
//                   isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
//                 } text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-60`}
//               >
//                 {isSubmitting ? 'Signing up...' : 'Create Account'}
//               </button>
//             </div>
//           </form>

//           <p className="text-center text-sm text-gray-500 mt-8">
//             Already have an account?{' '}
//             <a href="#" onClick={() => navigate('login')} className="font-semibold text-green-600 hover:underline">
//               Login
//             </a>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignupPage;
// export { NavigationContext, SignupPage };
import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import NavigationContext from '../../context/NavigationContext';
import Navbar from '../Navbar';
import logo from '../../assets/hamro2.png';
import { useRegisterUser } from '../../hooks/useRegisterUser';

const SignupPage = () => {
  const { navigate } = useContext(NavigationContext);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  // Destructure mutate and isLoading from the hook
  const { mutate: registerUser, isLoading: isSubmitting } = useRegisterUser();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { fullName, email, password } = formData;
    if (!fullName || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    registerUser(formData, {
      onSuccess: () => {
        toast.success('Registration successful!');
        setFormData({ fullName: '', email: '', password: '' });
        navigate('login');
      },
      onError: (error) => {
        toast.error(error?.message || 'Registration failed.');
      },
    });
  };

  return (
    <>
      <Navbar />
      <style jsx>{`
        header {
          background: rgba(255, 255, 255, 0.95) !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          backdrop-filter: blur(4px) !important;
        }
        header nav a {
          color: #1a1a1a !important;
        }
        header nav a:hover {
          color: #15803d !important;
        }
        header nav button svg,
        header nav .lg\\:hidden button svg {
          stroke: #1a1a1a !important;
        }
        header nav button:hover {
          background: #e5e7eb !important;
        }
        .bg-black\\/40 .bg-white {
          background: #ffffff !important;
        }
        .bg-black\\/40 .bg-white a,
        .bg-black\\/40 .bg-white button svg {
          color: #1a1a1a !important;
          stroke: #1a1a1a !important;
        }
        .bg-black\\/40 .bg-white span {
          color: #15803d !important;
        }
        header nav div button.bg-green-600,
        .bg-black\\/40 .bg-white button.bg-green-600 {
          display: none !important;
        }
      `}</style>

      <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg m-4">
          <div className="text-center mb-8">
            <a href="#" onClick={() => navigate('home')}>
              <img src={logo} alt="Logo" className="h-12 w-auto mx-auto" />
            </a>
            <p className="text-gray-500 mt-2">Start your fresh journey with us today.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                } text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-60`}
              >
                {isSubmitting ? 'Signing up...' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <a href="#" onClick={() => navigate('login')} className="font-semibold text-green-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
export { NavigationContext, SignupPage };

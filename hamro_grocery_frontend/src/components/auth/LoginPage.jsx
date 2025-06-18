
import React, { useState, useContext } from 'react';
import NavigationContext from '../../context/NavigationContext';
import Navbar from '../Navbar';
import { toast } from 'react-toastify';
import logo from '../../assets/hamro2.png';
import { useLoginUser } from '../../hooks/useLoginUser'; 

const LoginPage = () => {
  const { navigate } = useContext(NavigationContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: loginUser } = useLoginUser();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    loginUser(formData, {
      onSuccess: (res) => {
        // toast.success(res?.message || 'Login successful!');
        setFormData({ email: '', password: '' });
        navigate('home'); // or dashboard, adjust as needed
        setIsSubmitting(false);
      },
      onError: (err) => {
        // toast.error(err?.message || 'Login failed. Please try again.');
        setIsSubmitting(false);
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
        header nav button svg {
          stroke: #1a1a1a !important;
        }
        header nav div button.bg-green-600 {
          display: none !important;
        }
      `}</style>

      <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg m-4">
          <div className="text-center mb-8">
            <a href="#" onClick={() => navigate('home')}>
              <img src={logo}
                alt="Logo"
                className="h-12 w-auto mx-auto"/>
            </a>
            <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center justify-between">
              <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-green-600 hover:underline">
                Forgot Password?
              </a>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                } text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-60`}
              >
                {isSubmitting ? 'Signing in...' : 'Login'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <a href="#" onClick={() => navigate('signup')} className="font-semibold text-green-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
export { NavigationContext, LoginPage };

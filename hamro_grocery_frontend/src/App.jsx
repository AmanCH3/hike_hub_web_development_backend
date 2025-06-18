// import React, { useState } from 'react';
// import NavigationContext from './context/NavigationContext';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import LoginPage from './components/auth/LoginPage';
// import SignupPage from './components/auth/SignupPage';
// import HomePage from './pages/HomePage';

// function App() {
//   const [currentPage, setCurrentPage] = useState('home');
//   const navigate = (page) => setCurrentPage(page);

//   const renderPage = () => {
//     switch (currentPage) {
//       case 'login': return <LoginPage />;
//       case 'signup': return <SignupPage />;
//       case 'products':
//       case 'contact':
//       case 'about':
//       case 'home':
//       default: return <HomePage />;
//     }
//   };

//   return (
//     <NavigationContext.Provider value={{ navigate }}>
//       <Navbar />
//       {renderPage()}
//       {/* <Footer /> */}
//     </NavigationContext.Provider>
//   );
// }

// export default App;
// export { NavigationContext, App };




import React, { useContext } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

import { AuthPage } from './pages/authPage';
import { AuthContext } from './auth/AuthContext';
import ProtectedRoute from './routers/ProtectedRoutes';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import NavBar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

   console.log("User object in App:", user);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {!user && <NavBar />}

      <main className="flex-grow w-full">
        <Routes>
          <Route
            path="/"
            element={!user ? <HomePage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/login"
            element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/register"
            element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <p>I am at user dashboard</p>
                )}
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!user && <Footer />}
    </div>
  );
}

export default App;

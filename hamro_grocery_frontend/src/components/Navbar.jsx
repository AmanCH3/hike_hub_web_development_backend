
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/hamro.png';

const Navbar = () => {
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', page: '' },
    { name: 'Products', page: 'products' },
    { name: 'Contact', page: 'contact' },
    { name: 'About', page: 'about' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (page) => {
    navigate(`/${page}`);
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 w-full transition-all duration-300 z-50 ${isScrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-transparent"}`}>
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center">
          <img
            src={logo}
            alt="HamroGrocery Logo"
            className="h-20 w-auto"
          />
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.page)}
              className={`text-lg font-medium tracking-wide transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-gray-200'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button
            className={`p-2 rounded-full transition-colors ${
              isScrolled ? 'text-gray-600 hover:bg-gray-200' : 'text-white hover:bg-white/20'
            }`}
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 text-white text-base font-semibold px-6 py-2 rounded-full hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Menu Panel */}
        <div className={`fixed inset-0 bg-black/40 z-50 transition-opacity lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className={`absolute top-0 right-0 h-full w-2/3 max-w-sm bg-white shadow-xl transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <span className="text-2xl font-bold text-green-700">HamroGrocery</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2"
                  aria-label="Close menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.page)}
                    className="text-gray-700 font-medium text-lg text-left"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => handleLinkClick('login')}
                  className="w-full bg-green-600 text-white text-lg font-bold px-6 py-3 rounded-full hover:bg-green-700"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;



// import React, { useState, useEffect, useContext } from 'react';
// import NavigationContext from '../context/NavigationContext';
// import logo from '../assets/hamro.png';

// const Navbar = () => {
//   const { navigate } = useContext(NavigationContext);

//   const navLinks = [
//     { name: 'Home', page: 'home' },
//     { name: 'Products', page: 'products' },
//     { name: 'Contact', page: 'contact' },
//     { name: 'About', page: 'about' },
//   ];

//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLinkClick = (page) => {
//     navigate(page);
//     setIsMenuOpen(false);
//   };

//   return (
//     <header className={`fixed top-0 left-0 w-full transition-all duration-300 z-50 ${isScrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-transparent"}`}>
//       <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
//         <button onClick={() => navigate('home')} className="flex items-center">
//           <img
//             src={logo}
//             alt="HamroGrocery Logo"
//             className="h-20 w-auto"
//           />
//         </button>

//         {/* Desktop Menu */}
//         <div className="hidden lg:flex items-center gap-8">
//           {navLinks.map((link) => (
//             <button
//               key={link.name}
//               onClick={() => navigate(link.page)}
              
//               className={`text-lg font-medium tracking-wide transition-colors ${
//                 isScrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-gray-200'
//               }`}
//             >
//               {link.name}
//             </button>
//           ))}
//         </div>

//         <div className="hidden lg:flex items-center gap-4">
//           <button
//             className={`p-2 rounded-full transition-colors ${
//               isScrolled ? 'text-gray-600 hover:bg-gray-200' : 'text-white hover:bg-white/20'
//             }`}
//             aria-label="Search"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
//               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="11" cy="11" r="8"></circle>
//               <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//             </svg>
//           </button>
//           <button
//             onClick={() => navigate('login')}
//             // UPDATED: Added 'text-base' to slightly increase size
//             className="bg-green-600 text-white text-base font-semibold px-6 py-2 rounded-full hover:bg-green-700 transition-transform transform hover:scale-105"
//           >
//             Login
//           </button>
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="lg:hidden">
//           <button
//             onClick={() => setIsMenuOpen(true)}
//             className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}
//             aria-label="Open menu"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
//               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="3" y1="12" x2="21" y2="12"></line>
//               <line x1="3" y1="6" x2="21" y2="6"></line>
//               <line x1="3" y1="18" x2="21" y2="18"></line>
//             </svg>
//           </button>
//         </div>

//         {/* Mobile Menu Panel */}
//         <div className={`fixed inset-0 bg-black/40 z-50 transition-opacity lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
//           <div className={`absolute top-0 right-0 h-full w-2/3 max-w-sm bg-white shadow-xl transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//             <div className="p-6 flex flex-col h-full">
//               <div className="flex justify-between items-center mb-8">
//                 <span className="text-2xl font-bold text-green-700">HamroGrocery</span>
//                 <button
//                   onClick={() => setIsMenuOpen(false)}
//                   className="p-2"
//                   aria-label="Close menu"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
//                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <line x1="18" y1="6" x2="6" y2="18"></line>
//                     <line x1="6" y1="6" x2="18" y2="18"></line>
//                   </svg>
//                 </button>
//               </div>
//               <div className="flex flex-col gap-6">
//                 {navLinks.map((link) => (
//                   <button
//                     key={link.name}
//                     onClick={() => handleLinkClick(link.page)}
//                     // NOTE: 'text-lg' was already a good size for mobile, so it remains unchanged.
//                     className="text-gray-700 font-medium text-lg text-left"
//                   >
//                     {link.name}
//                   </button>
//                 ))}
//               </div>
//               <div className="mt-auto">
//                 <button
//                   onClick={() => handleLinkClick('login')}
//                    // UPDATED: Added 'text-lg' to match mobile menu links
//                   className="w-full bg-green-600 text-white text-lg font-bold px-6 py-3 rounded-full hover:bg-green-700"
//                 >
//                   Login
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;
// import React from 'react';

// import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
// import NavigationContext from '../context/NavigationContext';

// const Footer = () => {
//   const { navigate } = React.useContext(NavigationContext);

//   return (
//     <footer className="bg-gray-900 text-white">
//       <div className="container mx-auto px-6 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

//           {/* LOGO IMAGE */}
//           <div>
            
//             <p className="text-gray-400 text-sm">
//               Your daily dose of freshness, delivered right to your door.
//             </p>
//           </div>

//           <div>
//             <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
//             <ul className="space-y-2 text-sm">
//               <li><button onClick={() => navigate('home')} className="text-gray-400 hover:text-white transition">Home</button></li>
//               <li><button onClick={() => navigate('products')} className="text-gray-400 hover:text-white transition">Products</button></li>
//               <li><button onClick={() => navigate('about')} className="text-gray-400 hover:text-white transition">About Us</button></li>
//               <li><button onClick={() => navigate('contact')} className="text-gray-400 hover:text-white transition">Contact</button></li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
//             <div className="flex space-x-4 text-2xl">
//               <a href="#" className="text-gray-400 hover:text-blue-500 transition"><FaFacebookF /></a>
//               <a href="#" className="text-gray-400 hover:text-pink-500 transition"><FaInstagram /></a>
//               <a href="#" className="text-gray-400 hover:text-sky-400 transition"><FaTwitter /></a>
//             </div>
//           </div>

//           <div>
//             <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
//             <p className="text-gray-400 mb-4 text-sm">Subscribe for updates and offers.</p>
//             <form className="flex" onSubmit={(e) => e.preventDefault()}>
//               <input
//                 type="email"
//                 placeholder="Your email"
//                 className="w-full rounded-l-md px-4 py-2 text-white-800 focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//               <button className="bg-green-600 px-4 rounded-r-md hover:bg-green-700 transition">Go</button>
//             </form>
//           </div>
//         </div>

//         <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
//           &copy; {new Date().getFullYear()} Hamro Grocery. All Rights Reserved.
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
// export { NavigationContext, Footer };



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* LOGO / MISSION */}
          <div>
            <p className="text-gray-400 text-sm">
              Your daily dose of freshness, delivered right to your door.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition">Home</button></li>
              <li><button onClick={() => navigate('/products')} className="text-gray-400 hover:text-white transition">Products</button></li>
              <li><button onClick={() => navigate('/about')} className="text-gray-400 hover:text-white transition">About Us</button></li>
              <li><button onClick={() => navigate('/contact')} className="text-gray-400 hover:text-white transition">Contact</button></li>
            </ul>
          </div>

          {/* SOCIAL LINKS */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition"><FaFacebookF /></a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition"><FaTwitter /></a>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4 text-sm">Subscribe for updates and offers.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-l-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-600 px-4 rounded-r-md hover:bg-green-700 transition">Go</button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Hamro Grocery. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../logo'; // Assuming Logo is a well-designed component
import About from './about';
import Contact from './contact';


function Footer() {
 return (
   <footer className="bg-gray-900 py-12 border-t border-gray-800 text-gray-400">
     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
         {/* Logo and Copyright */}
         <div className="flex flex-col items-center md:items-start">
           <Link to="/" className="inline-flex items-center mb-3">
             <Logo width="90px" className="filter brightness-110" /> {/* Adjust logo size and brightness as needed */}
           </Link>
           <p className="text-sm text-gray-500 text-center md:text-left">
             &copy; {new Date().getFullYear()} <b>Lekhoni</b>. All Rights Reserved.
           </p>
         </div>

         {/* Navigation Links */}
         <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3 text-sm font-medium">
           <Link to="About" className="hover:text-gray-300 transition-colors duration-200">
           About
           </Link>
           {/* <Link to="/services" className="hover:text-gray-300 transition-colors duration-200">
             Services
           </Link> */}
           <Link to="/privacy" className="hover:text-gray-300 transition-colors duration-200">
             Privacy Policy
           </Link>
           <Link to="/terms" className="hover:text-gray-300 transition-colors duration-200">
             Terms of Service
           </Link>
           <Link to="/Contact" className="hover:text-gray-300 transition-colors duration-200">
             Contact
           </Link>
         </nav>
       </div>
     </div>
   </footer>
 );
}

export default Footer;
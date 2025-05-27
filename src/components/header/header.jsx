import React from 'react';
import { Container, Logo, LogoutBtn } from '../index'; // Assuming LogoutBtn is correctly imported
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'; // Import Heroicons for menu toggle
import { useState } from 'react'; // Import useState
// Assuming you've created a header.css file and put the animation there:
// import './header.css'; // Uncomment if you create a component-specific CSS file

function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu visibility

    const navItems = [
        { name: 'Home', slug: "/" },
        { name: "My Posts", slug: "/all-posts" },
        { name: "Add Post", slug: "/add-post" },
        { name: "Account", slug: "/account" }, // Corrected slug here, assuming your /account route
    ];

    return (
        <header className="py-4 shadow-2xl bg-gray-950 sticky top-0 z-50 transition-all duration-300">
         
                <div className="flex w-full justify-between items-center">
                    {/* Left Section: Logo and Brand Name */}
                    <div className="flex items-center gap-2">
                        <Link to="/">
                            <Logo
                                width="70px"
                                className="h-auto transition-transform duration-300 hover:scale-105 filter brightness-[1.8] contrast-125 rounded-none"
                            />
                        </Link>
                        <div className="text-red-600 text-3xl md:text-4xl font-extrabold font-serif tracking-tight drop-shadow-md transition-colors duration-300 hover:text-red-400 cursor-pointer">
                            Lekhoni
                        </div>
                    </div>

                    {/* Right Section: Conditional Navigation and Auth Buttons */}
                    <div className="flex flex-grow justify-end items-center gap-4 md:gap-12 mr-4">
                        {authStatus ? (
                            <>
                                {/* Desktop Navigation (hidden on mobile) */}
                                <nav className="hidden md:block">
                                    <ul className="flex items-center space-x-6 lg:space-x-12 text-lg font-semibold">
                                        {navItems.map((item) => (
                                            <li key={item.name}>
                                                <NavLink
                                                    to={item.slug}
                                                    className={({ isActive }) =>
                                                        `px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap
                                                        ${isActive
                                                            ? 'bg-red-700 text-white shadow-md transform scale-105 font-bold'
                                                            : 'text-gray-300 hover:text-white hover:bg-gray-900'
                                                        }`
                                                    }
                                                    onClick={() => setMobileMenuOpen(false)} // Close menu on click
                                                >
                                                    {item.name}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>

                                {/* Mobile Menu Toggle (Hamburger Icon) */}
                                <div className="md:hidden flex items-center">
                                    <button
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        className="text-white focus:outline-none p-2 rounded-md hover:bg-gray-800 transition-colors"
                                    >
                                        {mobileMenuOpen ? (
                                            <XMarkIcon className="h-7 w-7 text-red-500" />
                                        ) : (
                                            <Bars3Icon className="h-7 w-7" />
                                        )}
                                    </button>
                                </div>

                                {/* Logout button (always visible or responsive) */}
                                {/* <LogoutBtn className="px-5 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-all duration-300 shadow-lg transform hover:scale-105" /> */}
                            </>
                        ) : (
                            // Single button for logged-out users (Get Started)
                            <Link
                                to="/login" // Directs to the login page for either signing in or signing up
                                className="inline-block px-8 py-3 rounded-full bg-red-700 text-white text-lg font-semibold shadow-lg hover:bg-red-800 transition-all duration-300 transform hover:scale-105 tracking-wide border border-red-600"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
           

            {/* Mobile Menu Content (conditionally rendered) */}
            {authStatus && mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-gray-800 shadow-lg pb-4 animate-fade-in-down">
                    <ul className="flex flex-col items-start px-4 py-2 space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name} className="w-full">
                                <NavLink
                                    to={item.slug}
                                    className={({ isActive }) =>
                                        `block w-full text-left px-4 py-2 rounded-lg transition-all duration-300
                                        ${isActive
                                            ? 'bg-red-700 text-white font-bold'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                        }`
                                    }
                                    onClick={() => setMobileMenuOpen(false)} // Close menu on click
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                        {/* Include LogoutBtn here if you want it in the mobile menu */}
                        {/* {authStatus && (
                            <li className="w-full">
                                <LogoutBtn className="w-full text-left px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-all duration-300" />
                            </li>
                        )} */}
                    </ul>
                </div>
            )}
        </header>
    );
}

export default Header;
import React from 'react';
import { Link } from 'react-router-dom'; // Make sure react-router-dom is installed for Link

function Contact() {
    return (
        <div className="w-full bg-gradient-to-br from-gray-950 to-black text-white min-h-screen py-20 px-4 sm:px-6 lg:px-8 font-inter">

            {/* Contact Page Header */}
            <div className="text-center mb-24 animate-fade-in-up">
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-red-600 mb-8 drop-shadow-2xl tracking-tighter font-playfair">
                    Get in Touch
                </h1>
                <p className="text-2xl sm:text-3xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                    Have a question, a project idea, or just want to connect? Reach out!
                </p>
            </div>

            {/* Main Contact Section */}
            <section className="animate-fade-in">
                <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-700 max-w-3xl mx-auto transform hover:scale-[1.005] transition-transform duration-300">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 text-center font-playfair">
                        Connect with Somnath Kar
                    </h2>

                    <div className="space-y-8">
                        {/* Gmail */}
                        <div className="flex items-center justify-center sm:justify-start bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-red-600 transition-all duration-300 group">
                            <a href="mailto:somnathkar612005@gmail.com" className="flex items-center text-white hover:text-red-500 transition-colors duration-200">
                                <svg className="h-10 w-10 text-red-600 group-hover:text-red-500 transition-colors duration-200 mr-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 000 2h16a2 2 000 2V8.118z"></path>
                                </svg>
                                <div>
                                    <p className="text-lg text-gray-400 group-hover:text-gray-300">Send an Email:</p>
                                    <p className="text-xl sm:text-2xl font-semibold break-all">somnathkar612005@gmail.com</p>
                                </div>
                            </a>
                        </div>

                        {/* LinkedIn */}
                        <div className="flex items-center justify-center sm:justify-start bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-600 transition-all duration-300 group">
                            <a href="https://www.linkedin.com/in/sommath-kar-39a8b2292" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-blue-500 transition-colors duration-200">
                                <svg className="h-10 w-10 text-blue-600 group-hover:text-blue-500 transition-colors duration-200 mr-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 6.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-8.401c0-7.792-8.267-7.42-10.046-3.79z"/>
                                </svg>
                                <div>
                                    <p className="text-lg text-gray-400 group-hover:text-gray-300">Find me on LinkedIn:</p>
                                    <p className="text-xl sm:text-2xl font-semibold break-all">Somnath Kar Profile</p>
                                </div>
                            </a>
                        </div>

                        {/* GitHub */}
                        <div className="flex items-center justify-center sm:justify-start bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-purple-600 transition-all duration-300 group">
                            <a href="https://github.com/Mistry06" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-purple-500 transition-colors duration-200">
                                <svg className="h-10 w-10 text-purple-600 group-hover:text-purple-500 transition-colors duration-200 mr-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.909-.62.068-.608.068-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.529 2.341 1.086 2.91.829.091-.64.359-1.086.653-1.334-2.22-.253-4.555-1.113-4.555-4.931 0-1.096.391-1.996 1.029-2.695-.103-.255-.446-1.275.097-2.673 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.398.202 2.418.097 2.673.638.699 1.029 1.599 1.029 2.695 0 3.821-2.339 4.673-4.566 4.92.369.31.672.923.672 1.854 0 1.334-.012 2.41-.012 2.727 0 .266.18.593.687.484C21.137 20.281 24 16.528 24 12.017 24 6.484 19.522 2 14 2h-2z" clipRule="evenodd"/>
                                </svg>
                                <div>
                                    <p className="text-lg text-gray-400 group-hover:text-gray-300">Explore my code on GitHub:</p>
                                    <p className="text-xl sm:text-2xl font-semibold break-all">Mistry06 Profile</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* General Inquiry / Call to Action */}
                    <div className="text-center mt-12 pt-8 border-t border-gray-800">
                        <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-wide font-playfair">
                            Got a Project Idea?
                        </h3>
                        <p className="text-lg text-gray-400 mb-8 font-normal leading-relaxed">
                            I'm always open to collaborating on interesting projects or discussing new opportunities. Feel free to reach out directly!
                        </p>
                        <a
                            href="mailto:somnathkar612005@gmail.com"
                            className="inline-block px-10 py-4 rounded-full bg-red-700 text-white text-xl font-semibold shadow-lg hover:bg-red-800 transition-all duration-300 transform hover:scale-105 tracking-wide border border-red-600"
                        >
                            Send Me an Email
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Contact;
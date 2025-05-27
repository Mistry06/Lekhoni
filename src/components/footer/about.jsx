import React from 'react';
import { Link } from 'react-router-dom';

function About() {
    return (
        <div className="w-full bg-gradient-to-br from-gray-950 to-black text-white min-h-screen py-20 px-4 sm:px-6 lg:px-8 font-inter">

            {/* About Page Header Section */}
            <div className="text-center mb-24 animate-fade-in-up">
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-red-600 mb-8 drop-shadow-2xl tracking-tighter font-playfair">
                    About Lekhoni
                </h1>
                <p className="text-2xl sm:text-3xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                    A space for quality literature, envisioned and built by Somnath Kar.
                </p>
            </div>

            {/* Main Content Section: Your Story & Lekhoni's Mission */}
            <section className="animate-fade-in">
                <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-700 max-w-5xl mx-auto transform hover:scale-[1.005] transition-transform duration-300">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-playfair">
                        My Vision for Lekhoni
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-400 mb-6 leading-relaxed">
                        Lekhoni is more than just a platform; it's the realization of a vision by **Somnath Kar**, a **2nd-year undergraduate Computer Science student** with a deep passion for both technology and the nuanced world of literature.
                    </p>
                    <p className="text-lg sm:text-xl text-gray-400 mb-6 leading-relaxed">
                        In my journey, I observed a significant disconnect: a growing audience eager for **quality literary content** often struggles to find it, and talented creators of such content lack a dedicated, accessible space to share their work. This gap inspired me to build Lekhoni. My mission is simple yet profound: to create a premier digital home for literature, offering a platform where **quality creators** can connect directly with an appreciative audience.
                    </p>
                    <p className="text-lg sm:text-xl text-gray-400 mb-6 leading-relaxed">
                        Developed using **React** for a dynamic and intuitive front-end experience, and powered by a robust **backend** for seamless content management, Lekhoni is engineered to be efficient and user-friendly. It's a space where poets, storytellers, essayists, and literary enthusiasts can publish their work with ease, knowing it will reach readers who truly value thoughtful and well-crafted content.
                    </p>
                    <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
                        Looking ahead, Lekhoni will continue to evolve with this core mission at its heart: empowering literary voices and fostering a vibrant community centered around the art of written expression.
                    </p>

                    {/* Call to Action Section (integrated into the main section) */}
                    <div className="text-center mt-12 pt-8 border-t border-gray-800">
                        <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-wide font-playfair">
                            Ready to Share Your Voice?
                        </h3>
                        <p className="text-lg text-gray-400 mb-8 font-normal leading-relaxed">
                            Join our vibrant community and start publishing your unique poems, stories, and insights today.
                        </p>
                        <Link
                            to="/add-post"
                            className="inline-block px-10 py-4 rounded-full bg-red-700 text-white text-xl font-semibold shadow-lg hover:bg-red-800 transition-all duration-300 transform hover:scale-105 tracking-wide border border-red-600"
                        >
                            Start Writing Now!
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default About;
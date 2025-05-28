import React from 'react';
import { Link } from 'react-router-dom'; // <--- Make sure Link is imported here

function PrivacyPolicy() {
    return (
        <div className="w-full bg-gradient-to-br from-gray-950 to-black text-white min-h-screen py-20 px-4 sm:px-6 lg:px-8 font-inter">

            {/* Privacy Policy Header Section */}
            <div className="text-center mb-16 animate-fade-in-up">
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-red-600 mb-8 drop-shadow-2xl tracking-tighter font-playfair">
                    Privacy Policy
                </h1>
                <p className="text-2xl sm:text-3xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                    Protecting your privacy is our top priority at Lekhoni.
                </p>
            </div>

            {/* Main Single Section for Privacy Policy Content */}
            <section className="animate-fade-in">
                <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-700 max-w-4xl mx-auto transform hover:scale-[1.005] transition-transform duration-300">

                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-playfair">
                        Your Privacy at Lekhoni
                    </h2>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8 border-b border-gray-800 pb-8">
                        This Privacy Policy explains how **Lekhoni** ("we," "us," or "our") collects, uses, and safeguards your personal information when you use our website, applications, and services (collectively, the "Service"). By accessing or using Lekhoni, you agree to the practices described in this policy. We are deeply committed to ensuring your privacy and the security of your personal data.
                    </p>

                    {/* Information We Collect */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        1. Information We Collect
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        We collect various types of information to provide and improve our Service. This includes:
                    </p>
                    <ul className="list-disc list-inside text-lg sm:text-xl space-y-3 pl-5 leading-relaxed mb-8">
                        <li>
                            **Account & Profile Information:** When you register, we collect details like your **name, email address, username**, and **password**. You may also choose to provide additional profile information.
                        </li>
                        <li>
                            **User Content:** Any literary works, posts, comments, messages, or other content you create, upload, or share on Lekhoni.
                        </li>
                        <li>
                            **Usage Data:** Information about how you interact with our Service, such as your **IP address, browser type, operating system, pages visited, time spent, and referral sources**. This helps us understand user behavior and optimize our platform.
                        </li>
                        <li>
                            **Technical Data:** Information about the device and network you use, including device IDs and network connection type.
                        </li>
                    </ul>

                    {/* How We Use Your Information */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        2. How We Use Your Information
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        The information we collect is used to:
                    </p>
                    <ul className="list-disc list-inside text-lg sm:text-xl space-y-3 pl-5 leading-relaxed mb-8">
                        <li>
                            **Provide and Maintain the Service:** To operate Lekhoni, manage your account, and enable you to create and access content.
                        </li>
                        <li>
                            **Improve and Personalize:** To understand user preferences, enhance user experience, and develop new features and functionalities.
                        </li>
                        <li>
                            **Communicate with You:** To send you updates, service announcements, security alerts, and respond to your inquiries.
                        </li>
                        <li>
                            **Ensure Security:** To detect, prevent, and address technical issues, fraud, and unauthorized access.
                        </li>
                        <li>
                            **Analyze Usage:** For internal analytics and research to understand trends and optimize performance.
                        </li>
                    </ul>

                    {/* Sharing Your Information */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        3. Sharing Your Information
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        We **do not sell or rent your personal information to third parties**. We may share your information in the following limited circumstances:
                    </p>
                    <ul className="list-disc list-inside text-lg sm:text-xl space-y-3 pl-5 leading-relaxed mb-8">
                        <li>
                            **With Your Consent:** When you give us explicit permission to do so.
                        </li>
                        <li>
                            **Publicly Available Content:** Content you choose to make public on Lekhoni (e.g., your literary posts, public profile information) will be accessible to others.
                        </li>
                        <li>
                            **Legal Requirements:** If required by law, court order, or to protect the rights, property, or safety of Lekhoni, our users, or the public.
                        </li>
                        <li>
                            **Business Transfers:** In connection with a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your information is transferred and becomes subject to a different privacy policy.
                        </li>
                    </ul>

                    {/* Data Security */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        4. Data Security
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8">
                        We employ a variety of industry-standard security measures to protect your personal information from unauthorized access, use, or disclosure. This includes encryption, access controls, and regular security audits. However, please remember that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.
                    </p>

                    {/* Your Data Protection Rights */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        5. Your Data Protection Rights
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        Depending on your location and applicable data protection laws, you may have the following rights regarding your personal data:
                    </p>
                    <ul className="list-disc list-inside text-lg sm:text-xl space-y-3 pl-5 leading-relaxed mb-8">
                        <li>
                            **Right to Access:** Request a copy of the personal data we hold about you.
                        </li>
                        <li>
                            **Right to Rectification:** Request corrections to inaccurate or incomplete personal data.
                        </li>
                        <li>
                            **Right to Erasure:** Request the deletion of your personal data under certain conditions.
                        </li>
                        <li>
                            **Right to Restrict Processing:** Request that we limit the processing of your personal data.
                        </li>
                        <li>
                            **Right to Object to Processing:** Object to our processing of your personal data.
                        </li>
                        <li>
                            **Right to Data Portability:** Request that we transfer your data to another organization, or directly to you, under certain conditions.
                        </li>
                    </ul>
                    <p className="text-lg sm:text-xl leading-relaxed mt-4 mb-8">
                        To exercise any of these rights, please contact us using the details provided below.
                    </p>

                    {/* Children's Privacy */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        6. Children's Privacy
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8">
                        Our Service is not intended for individuals under the age of 13. We do not knowingly collect personally identifiable information from anyone under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers.
                    </p>

                    {/* Changes to this Privacy Policy */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        7. Changes to This Privacy Policy
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8">
                        We may update this Privacy Policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. We encourage you to review this policy periodically for any updates.
                    </p>

                    {/* Contact Us */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        8. Contact Us
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <ul className="list-disc list-inside text-lg sm:text-xl space-y-2 pl-5 leading-relaxed">
                        <li>
                            **By Email:** <a href="mailto:somnathkar612005@gmail.com" className="text-red-400 hover:underline">somnathkar612005@gmail.com</a>
                        </li>
                        <li>
                            {/* Corrected Link to Contact Page */}
                            **By Visiting Our Contact Page:** <Link to="/contact" className="text-red-400 hover:underline">contact</Link>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default PrivacyPolicy;

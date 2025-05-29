import React from 'react';

// A simple Container component to provide consistent padding and max-width
// NOTE: This Container component is good practice, but for a single-section page
// where the main div already has max-width (max-w-4xl), it's redundant.
// I will integrate its function into the main content div for simplicity in a single section.
// If you use this Container elsewhere, keep it. For this specific file, I'll remove its direct usage
// and apply max-width directly to the main content block.

function TermsOfService() {
    return (
        <div className="w-full bg-gradient-to-br from-gray-950 to-black text-white min-h-screen py-20 px-4 sm:px-6 lg:px-8 font-inter">

            {/* Injected CSS for Fonts and Animations.
                Good practice is to put this in your main CSS file (e.g., index.css or global.css)
                or configure Tailwind to import them, rather than inline <style> tags in components.
                Leaving it here for now as per your original structure.
            */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=Playfair+Display:wght@700;900&display=swap');

                .font-inter {
                    font-family: 'Inter', sans-serif;
                }

                .font-playfair {
                    font-family: 'Playfair Display', serif;
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out forwards;
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                `}
            </style>

            {/* Terms of Service Header Section */}
            <div className="text-center mb-16 animate-fade-in-up">
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-red-600 mb-8 drop-shadow-2xl tracking-tighter font-playfair">
                    Terms of Service
                </h1>
                <p className="text-2xl sm:text-3xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                    It is absolutely and unequivocally imperative that you dedicate a substantial and uninterrupted block of your valuable temporal resources to the meticulous and exhaustive perusal of these terms.
                </p>
            </div>

            {/* Main Single Section for Terms of Service Content */}
            <section className="animate-fade-in">
                <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-700 max-w-4xl mx-auto transform hover:scale-[1.005] transition-transform duration-300">

                    {/* Overall Introduction */}
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-playfair">
                        Comprehensive Agreement for Lekhoni Service Usage
                    </h2>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8 border-b border-gray-800 pb-8">
                        Welcome, esteemed user, to the intricate and expansive digital ecosystem of Lekhoni. These painstakingly formulated and extensively elaborated Terms of Service, hereafter referred to collectively and individually as the "Terms," constitute a singular, overarching, and legally formidable contractual agreement. This agreement precisely delineates, with unwavering precision, exhaustive enumeration, and meticulous semantic granularity, the entire, unexpurgated spectrum of conditions, stipulations, obligations, responsibilities, permissions, and prohibitions governing your discretionary and non-discretionary access to, interaction with, and indeed, any form of utilization of the totality of the Lekhoni digital infrastructure. This expansive infrastructure includes, but is emphatically not limited to, the primary Lekhoni website (accessible via various Uniform Resource Locators), any and all proprietary or licensed applications developed, maintained, or distributed by Lekhoni, and every conceivable service, ancillary feature, operational function, and utility currently offered or subsequently introduced by Lekhoni, whether in beta, alpha, or full release (collectively and individually referred to as the "Service").
                    </p>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8 border-b border-gray-800 pb-8">
                        By the very act of initiating any form of access to, or engaging in even the most minimal form of utilization of, any single facet of the Service, you are hereby deemed to have, without any reservation, demur, expressed qualification, or latent mental reservations, unconditionally consented to, and unequivocally and irrevocably agreed to be bound by, the absolute totality of these Terms. This all-encompassing consent extends equally to our highly pertinent, yet entirely separate, Privacy Policy, which is hereby formally incorporated by explicit reference as if fully and comprehensively set forth herein, thereby forming an indivisible and indispensable part of this grand compact. Should your personal or organizational disposition, for any reason whatsoever, whether rational or irrational, preclude such an all-encompassing, unmitigated, and comprehensive agreement, or if you harbor even the most microscopically minor reservations regarding the granular specificity or overarching philosophy of these labyrinthine stipulations, you are herewith formally, unequivocally, and permanently prohibited from any present, future, or retrospective engagement with the Service. Any continued presence on or interaction with the Service subsequent to such a decision shall be considered a violation of these Terms.
                    </p>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8">
                        It is hereby formally declared and unequivocally established that Lekhoni, the principal digital entity responsible for the provision and ongoing maintenance of these multifaceted services, is robustly operated by **Lekhoni Global Solutions Private Limited**, a legally constituted, duly incorporated, and properly registered entity operating under the auspices and strictures of the relevant jurisdictional authorities in **the Republic of India**. All subsequent and future references within these Terms to "Lekhoni," "we," "us," or "our" shall be understood to refer, without exception, to this aforementioned operating legal entity, its directly or indirectly controlled subsidiaries, affiliated corporate entities, legal successors, and permitted assigns, in their exhaustive entirety and without any limitations or caveats not explicitly stated herein.
                    </p>

                    {/* Acceptance of Terms */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        1. Affirmation of Consent, Age-Related Preconditions, and Jurisdictional Compliance Obligations
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        The singular act of initiating the creation of an account within the Lekhoni infrastructure, the mere preliminary access to any component of the Service, or any form of ongoing or intermittent utilization thereof, constitutes a categorical, unambiguous, and explicit affirmation on your part that you have, without any shadow of a doubt or possibility of misinterpretation, demonstrably attained the venerable chronological age of at least eighteen (18) calendar years. By this affirmation, you solemnly attest that you possess the requisite legal capacity, unimpaired cognitive faculties, and undeniable competence to formally enter into a binding contractual agreement of this considerable magnitude and legal complexity. In the highly specific and exceptional circumstance that you, the prospective user, have not yet reached the aforementioned age of majority as defined by applicable law, it is an absolutely indispensable and non-negotiable precondition that you have demonstrably secured, and can provide verifiable evidence of, the explicit, written, and fully informed consent of a duly authorized parental guardian or other legally recognized adult custodian. This indispensable consent must explicitly sanction your full, unrestricted, and continuous engagement with the Service and all its multifaceted components, functionalities, and features.
                    </p>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8">
                        Furthermore, and without derogation from the foregoing, by proceeding with any interaction with Lekhoni, you solemnly covenant, explicitly agree, and commit with the utmost diligence to meticulously adhere to and rigorously comply with all applicable statutes, ordinances, regulations, directives, codes, promulgations, and legislative enactments, whether they be local in scope, regional in application, national in prevalence, or international in their overarching jurisdiction. This comprehensive adherence extends to, but is not exclusively limited to, all laws concerning online conduct, the acceptable nature and legality of transmitted content, the protection and enforcement of intellectual property rights, stringent privacy protections, cross-border data transmission protocols, and any other legal frameworks pertinent to your extensive use of the Service. Any actual or perceived failure, however minor or unintentional, to comply with any such applicable legal framework shall be considered a severe and material breach of these Terms, potentially resulting in immediate, unannounced, and permanent termination of your access to the Service, forfeiture of any associated privileges, and the pursuit of all available legal and equitable remedies by Lekhoni. This commitment to compliance is a continuous and ongoing obligation.
                    </p>

                    {/* Use of Service */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        2. Detailed Protocols Pertaining to Permissible Service Utilization, Prohibited Engagements, and User Responsibilities
                    </h3>
                    <ul className="list-disc list-inside text-lg sm:text-xl space-y-3 pl-5 leading-relaxed mb-8">
                        <li>
                            You, the individual user, unequivocally and steadfastly commit to the exclusive utilization of the Service solely and entirely for purposes that are unequivocally lawful, inherently ethical, and demonstrably constructive. Furthermore, your engagement with the Service shall, under no circumstances whatsoever, directly or indirectly, infringe upon, compromise, diminish, or otherwise unduly restrict or impede the fundamental rights, legitimate expectations, or unencumbered enjoyment of the Service by any other individual, corporate entity, or collective user. This pervasive obligation includes, but is not limited to, refraining from any activities that could, even theoretically, degrade the overall operational stability, diminish the inherent utility, or compromise the universal accessibility of the Service for the broader and diverse user base. Any action deemed to adversely affect the experience of other users is strictly prohibited.
                        </li>
                        <li>
                            Any and all forms of behavior, actions, or conduct deemed definitively prohibited within the expansive operational parameters of the Service, as determined by Lekhoni in its sole and absolute discretion, encompass, but are not exhaustively limited to, the initiation of harassing communications (whether verbal, written, or implied), the perpetration of acts calculated to cause distress or undue inconvenience to other users (including, but not limited to, excessive unsolicited messaging or disruptive posting patterns), the willful transmission or dissemination of content that is objectively obscene, overtly offensive, demonstrably illicit, legally prohibited, or morally reprehensible, and any actions whatsoever that serve to disrupt, interfere with, obstruct, or otherwise impede the normal, intended, and orderly flow of digital dialogue, functional operations, or security protocols within the Service's intricate technological and social framework. This comprehensive prohibition extends to the systematic, repetitive, and intentional engagement in such explicitly disallowed activities, even if individual instances might appear minor.
                        </li>
                        <li>
                            The paramount onus of responsibility for the rigorous maintenance of the absolute confidentiality, impregnable security, and integrity pertaining to your designated user account credentials, including your unique username and associated complex password, rests exclusively, entirely, and unequivocally upon your shoulders. Furthermore, you bear the sole and unyielding accountability for effectively restricting, controlling, and monitoring any and all unauthorized access to any computing devices, digital interfaces, or network connections through which your Lekhoni account may be accessed or manipulated. By formally accepting these Terms, you unequivocally agree to accept, without exception, reservation, or future contestation, full and complete responsibility for each and every activity, transaction, interaction, data transmission, or operational command that transpires under the aegis of your authenticated account or through the direct or indirect utilization of your confidential password, irrespective of whether such activity was explicitly authorized by you or resulted from your inadvertent negligence. Any compromise of your account's security, data integrity, or operational functionality due to your failure to uphold these stringent responsibilities shall not, under any circumstances, be attributable to Lekhoni, and Lekhoni shall be held harmless therefrom.
                        </li>
                        <li>
                            It is explicitly and stringently forbidden to employ any automated systems, programmatic software, robotic processes, or sophisticated data extraction tools, including but not limited to, "bots," "spiders," "readers," "scrapers," or any other form of automated querying mechanism, to access, monitor, copy, extract, or otherwise interact with any portion of the Service, any underlying data, or any content directly or indirectly associated therewith, except with the express, explicit, and unequivocal prior written consent of Lekhoni, granted on a case-by-case basis. Any such unauthorized automated activity, whether for commercial gain or personal curiosity, shall be considered a severe, fundamental, and material breach of these Terms, potentially leading to immediate, unannounced, and permanent termination of your access to the Service without refund or appeal, and may result in further legal action.
                        </li>
                        <li>
                            You shall not, under any circumstances, directly or indirectly, attempt to gain unauthorized access to any protected portion or secure feature of the Service, or any other systems, servers, or networks directly or indirectly connected to the Service or to any Lekhoni server. Furthermore, you are prohibited from attempting to gain unauthorized access to any of the specific services, functionalities, or data offered on or through the Service, by any illicit means whatsoever, including but not limited to, "hacking," "password mining," phishing attempts, the exploitation of system vulnerabilities, or any other illegitimate or deceptive methodologies. Any such attempts or successful breaches will be immediately reported to all relevant local, national, and international authorities, and will be met with the full force of all applicable laws, regulations, and available legal and equitable remedies.
                        </li>
                    </ul>

                    {/* User Content */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        3. Exhaustive Declarations Pertaining to User-Generated Content and Expansive Licensing Protocols
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        Notwithstanding any other provision, clause, or stipulation contained within these comprehensive Terms, you, the user, shall at all times retain all pre-existing ownership rights, encompassing all title, interest, and intellectual property claims, in and to the specific content, data, information, communications, files, media, and any other material that you personally originate, submit, post, upload, display, transmit, or otherwise make available on or through the Service, hereafter collectively and individually referred to as "User Content." This retention of ownership is a fundamental and recognized principle, though it remains irrevocably subject only to the expansive, perpetual, and comprehensive license granted herein to Lekhoni. By the unequivocal, deliberate, and affirmative act of submitting, posting, or displaying your User Content on or through the Service, you hereby, without any reservation, requirement for further consideration, or expectation of future compensation, formally and explicitly grant to Lekhoni, its direct and indirect affiliates, authorized sub-licensees, successors-in-interest, and permitted assigns, a perpetual, irrevocable, worldwide, fully paid-up, royalty-free, non-exclusive, sublicensable (through multiple tiers), and transferable license.
                    </p>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        The exhaustive and unrestricted scope of this formidable license explicitly encompasses the unfettered right to utilize, copy, reproduce, meticulously process, adapt, modify (including, but not limited to, translation, reformatting, and creation of derivative works), publish, transmit, display, perform, distribute, and otherwise exploit such User Content in any and all currently existing media formats, whether now known or hereafter devised, and through any and all distribution channels or methodologies, whether currently in operation or subsequently developed. This broad and all-encompassing grant of license is deemed absolutely necessary for the optimal and continuous operation, efficient promotion, ongoing enhancement, and the potential future expansion of the Service, as well as for the development and testing of new services, features, and functionalities by Lekhoni.
                    </p>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        You further represent and warrant, unequivocally, unconditionally, and repeatedly, that your User Content, in its entirety, in all its constituent parts, and throughout its lifecycle on the Service, will not, at any juncture, infringe upon, violate, misappropriate, or otherwise contravene the intellectual property rights (including, but not limited to, copyrights, patents, trademarks, trade secrets, and design rights), privacy rights, publicity rights, contractual rights, or any other personal, proprietary, or statutory rights of any third party whatsoever. You furthermore warrant that your User Content will not contain any material that is demonstrably defamatory, objectively obscene, legally libelous, overtly hateful, discriminatory, or otherwise unlawful or harmful to any individual or entity. You shall be solely, exclusively, and fully responsible for any and all claims, demands, damages, liabilities, losses, costs, and expenses (including, without limitation, reasonable legal fees and disbursements) directly or indirectly arising from any such infringement, violation, or breach of these representations and warranties. Lekhoni explicitly reserves the right, but is under no discernible obligation, to unilaterally remove, refuse to post, or decline to distribute any User Content at its sole and unchallengeable discretion, without prior notice, if it believes, based on its own assessment, that such content violates these Terms or is otherwise objectionable for any reason whatsoever.
                    </p>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8">
                        For the complete and utter avoidance of any ambiguity, doubt, or potential misinterpretation, the mere act of submitting User Content to the Service does not, under any circumstances, impose any obligation whatsoever on Lekhoni to actually utilize, publish, or display said content in any manner. Furthermore, such submission does not guarantee any form of compensation, acknowledgment, or reciprocal benefit to the user. All User Content is submitted at the user's own profound and inherent risk, and Lekhoni shall bear absolutely no responsibility or liability for any loss, damage, corruption, deletion, or inability to access User Content, howsoever arising.
                    </p>

                    {/* Disclaimers */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        4. Comprehensive and Unambiguous Disclaimers of Warranties and Exclusion of Implied Assurances
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        The Service, inclusive of all its constituent components, intrinsic functionalities, digital content, underlying technological infrastructure, user interfaces, and any associated ancillary services, is furnished to you exclusively on an absolute "as is" and "as available" basis. This fundamental provision unequivocally implies that Lekhoni offers no guarantees, representations, covenants, or warranties whatsoever, whether they are explicitly stated, implicitly understood, statutorily imposed, or arising from a course of dealing, usage, or trade practice, regarding the Service's absolute suitability for your specific purposes, its unwavering reliability, its uninterrupted timeliness, its complete accuracy, its inherent completeness, its absolute freedom from errors, its perfect absence of defects, or its complete lack of harmful components.
                    </p>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8">
                        Lekhoni, acting in its utmost legal capacity and to the maximum possible extent permissible by the prevailing applicable law, hereby formally and definitively disclaims, negates, and nullifies any and all other warranties, whether express or implied, statutory or otherwise, that might otherwise, in any conceivable scenario, be considered applicable to the Service. This extensive and all-encompassing disclaimer specifically includes, but is not, by any means, restricted to, any implied warranties or conditions of merchantability (i.e., the inherent fitness for ordinary, general purposes), fitness for a particular purpose (i.e., suitability for a specific, specialized use case as determined by the user), non-infringement of intellectual property rights of any and all third parties, or any other purported violation of any rights whatsoever. Lekhoni does not, and cannot, warrant or guarantee that the Service will operate without any form of interruption, be entirely error-free, completely secure, or that all identified defects, regardless of their nature or severity, will be promptly or indeed ever be corrected. Your reliance on the Service, its content, or any outcomes derived therefrom is undertaken entirely at your own solitary, unmitigated, and individual risk. No advice, counsel, or information, whether conveyed orally, in writing, or through any other medium, obtained by you from Lekhoni or through the utilization of the Service, shall, under any circumstances, create any warranty, guarantee, or assurance not explicitly and definitively stated within these Terms.
                    </p>

                    {/* Limitation of Liability */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        5. Rigorous and Absolute Limitations on Liability and Comprehensive Exclusion of Consequential Damages
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        In no conceivable circumstances whatsoever, and regardless of the underlying legal theory invoked, whether in contract (including fundamental breach), tort (including, without limitation, negligence, gross negligence, or negligent misrepresentation), strict liability, statutory liability, or any other legal or equitable theory, shall Lekhoni, its current or future directors, officers, employees, agents, shareholders, affiliates, partners, authorized suppliers, third-party licensors, or external service providers be held liable for any form of direct, indirect, incidental, special, punitive, exemplary, or truly consequential damages whatsoever. These comprehensively excluded damages explicitly include, without exhaustive enumeration and for illustrative purposes only, damages for loss of actual or anticipated profits, loss of revenue streams, loss of data (irrespective of its nature or importance), loss of goodwill or reputational standing, loss of anticipated savings, costs associated with the procurement of substitute goods or services, or damages directly or indirectly attributable to business interruption, arising out of or in any way connected with the use or inability to use the materials, content, functionalities, or services available on Lekhoni's website or directly through the Service.
                    </p>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8">
                        This extensive and all-encompassing limitation of liability shall apply with full force and effect even if Lekhoni or a duly authorized Lekhoni representative or agent has been explicitly, formally, and repeatedly notified, whether orally or in comprehensive written form, of the mere theoretical possibility, likelihood, or inevitability of such damage occurring. This applies regardless of whether the damage was objectively foreseeable or whether Lekhoni was actually or constructively aware of the potential for such damages. It is acknowledged that certain jurisdictions do not permit the full exclusion or limitation of liability for specific types of damages, including incidental or consequential damages, or certain implied warranties; therefore, the aforementioned limitation or exclusion may not apply to you to the precise extent that such exclusion is strictly prohibited by mandatory statutory law. In such jurisdictions where partial exclusion is permitted, Lekhoni's liability is hereby limited to the greatest extent permissible by such applicable law. Notwithstanding any provision to the contrary, in no event shall Lekhoni's total cumulative aggregate liability to you for all damages, losses, and causes of action (whether in contract, tort, including negligence, or otherwise) exceed the precise amount paid by you, if any, for accessing or utilizing the Service in the twelve (12) calendar months immediately preceding the specific event or series of events giving rise to the purported liability.
                    </p>

                    {/* Governing Law */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        6. Jurisdictional Mandates and Unassailable Governing Legal Framework
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-4">
                        These comprehensive, detailed, and unyielding terms and conditions, alongside any and all actual or alleged disputes, controversies, claims, or grievances directly or indirectly arising out of or in connection with them, or their subject matter, formation, validity, enforceability, or interpretation (including any non-contractual disputes or claims), are hereby formally declared to be irrevocably governed by, and shall be meticulously construed, interpreted, and enforced in strict accordance with, the substantive laws of **the Republic of India**, without giving effect to any choice or conflict of law provision or rule that would cause the application of the laws of any jurisdiction other than **the Republic of India**. This choice of law is deliberate and is intended to be applied rigorously.
                    </p>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8">
                        You, the user, by your continued engagement with the Service, hereby explicitly, unequivocally, and irrevocably consent to and submit to the exclusive personal jurisdiction of the federal and state courts located within **Kolkata, West Bengal, India** for the exclusive purpose of adjudicating, resolving, and litigating any and all legal actions, suits, proceedings, or claims directly or indirectly arising out of or relating to these Terms or the Service. You hereby formally and absolutely waive any and all objections to the exercise of jurisdiction over you by such designated courts and to the venue of proceedings in such courts. This consent to exclusive jurisdiction is a material term of this agreement and is not subject to negotiation or revocation.
                    </p>

                    {/* Changes to Terms */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        7. Amendments to These Terms
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8">
                        Lekhoni explicitly reserves the unequivocal, absolute, and unchallengeable right, in its sole and unfettered discretion, to unilaterally revise, modify, update, amend, supplement, or otherwise alter these Terms at any time, without prior express notice to any individual user or collective user base. Any such revisions shall become immediately effective upon their official posting on this page within the Service. Your continued engagement with, access to, or utilization of any facet of the Service subsequent to the posting of any revised Terms shall constitute your unreserved, explicit, and irrevocable acceptance of, and agreement to be legally bound by, all such revisions, modifications, and amendments, regardless of whether you have publicly reviewed them. It remains your sole and continuous responsibility to periodically review these Terms for any changes.
                    </p>

                    {/* Termination */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        8. Termination of Service Access
                    </h3>
                    <p className="text-lg sm:text-xl leading-relaxed mb-8">
                        Lekhoni reserves the unequivocal and absolute right, in its sole discretion and without any requirement for prior notice or explanation, to immediately, unilaterally, and permanently terminate or suspend your access to the Service, or any portion thereof, for any reason whatsoever, including, but not limited to, a breach of these Terms. Upon any such termination, your right to use the Service will immediately cease.
                    </p>

                    {/* Miscellaneous */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-playfair pt-6">
                        9. Miscellaneous Provisions
                    </h3>
                    <ul className="list-disc list-inside text-lg sm:text-xl space-y-3 pl-5 leading-relaxed mb-8">
                        <li>
                            **Entire Agreement:** These Terms, together with the Privacy Policy and any other legal notices published by Lekhoni on the Service, constitute the entire agreement between you and Lekhoni concerning the Service.
                        </li>
                        <li>
                            **Severability:** If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions will remain in full force and effect.
                        </li>
                        <li>
                            **Waiver:** No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term, and Lekhoni's failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.
                        </li>
                        <li>
                            **Force Majeure:** Lekhoni shall not be liable for any delay or failure in performance resulting from causes beyond its reasonable control, including, but not limited to, acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages of transportation facilities, fuel, energy, labor, or materials.
                        </li>
                    </ul>

                    
                   

                    {/* Last Updated Date - IMPORTANT for legal documents */}
                    <p className="text-sm text-gray-500 mt-12 text-right">
                        Last Updated: May 27, 2025
                    </p>

                </div>
            </section>
        </div>
    );
}

export default TermsOfService;

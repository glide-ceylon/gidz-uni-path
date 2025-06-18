import localFont from "next/font/local";
import "./globals.css";
import Nav from "./components/nav-german";
import FloatingButtons from "./components/floatingButton";
import Link from "next/link";
import {
  FaGraduationCap,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaCode,
} from "react-icons/fa";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "GIDZ UniPath - Your Gateway to German Excellence",
  description:
    "Premium education consultancy specializing in German university admissions for Sri Lankan students. Experience world-class education with German precision and Apple-like attention to detail.",
  keywords: [
    "German education",
    "university admissions",
    "student visa",
    "Germany",
    "Sri Lanka",
    "premium consultancy",
  ],
  author: "GIDZ UniPath Education Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-appleGray-50`}
      >
        <Nav />
        <main className="min-h-screen">{children}</main>

        {/* German-Apple Inspired Footer */}
        <footer className="bg-appleGray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="py-16 grid lg:grid-cols-4 md:grid-cols-2 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-2">
                {" "}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-soft">
                    <FaGraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">GIDZ UniPath</h3>
                    <p className="text-appleGray-400 text-sm">
                      Your Gateway to German Excellence
                    </p>
                  </div>
                </div>
                <p className="text-appleGray-300 mb-8 leading-relaxed max-w-md text-lg">
                  We are Sri Lanka's premier education consultancy, specializing
                  in German university admissions and visa processing. Our
                  expert team has helped over 1000 students achieve their
                  academic dreams in Germany.
                </p>
                {/* German Flag Colors Accent */}
                <div className="flex items-center space-x-2 mb-6">
                  {" "}
                  <div className="w-6 h-4 bg-sky-600 rounded-sm"></div>
                  <div className="w-6 h-4 bg-sky-500 rounded-sm"></div>
                  <div className="w-6 h-4 bg-sky-400 rounded-sm"></div>
                  <span className="text-appleGray-400 text-sm ml-2">
                    Excellence. Precision. Success.
                  </span>
                </div>
                {/* Social Links */}
                {/* <div className="flex space-x-3">
                  {" "}
                  <a
                    href="mailto:info@gidzunipath.com"
                    className="w-12 h-12 bg-appleGray-700 rounded-2xl flex items-center justify-center hover:bg-sky-500 transition-all duration-300 btn-apple-hover"
                  >
                    <FaEnvelope className="w-5 h-5" />
                  </a>
                  <a
                    href="tel:+94701234567"
                    className="w-12 h-12 bg-appleGray-700 rounded-2xl flex items-center justify-center hover:bg-sky-500 transition-all duration-300 btn-apple-hover"
                  >
                    <FaPhone className="w-5 h-5" />
                  </a>
                  <a
                    href="https://wa.me/94701234567"
                    className="w-12 h-12 bg-appleGray-700 rounded-2xl flex items-center justify-center hover:bg-sky-400 transition-all duration-300 btn-apple-hover"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </a>
                </div> */}
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xl font-bold mb-6 text-white">
                  Quick Links
                </h4>
                <ul className="space-y-4">
                  <li>
                    {" "}
                    <Link
                      href="/apply-now"
                      className="text-appleGray-300 hover:text-sky-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <span>Apply Now</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        →
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-appleGray-300 hover:text-sky-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <span>Contact Us</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        →
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/application"
                      className="text-appleGray-300 hover:text-sky-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <span>Application Status</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        →
                      </span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      href="/applications"
                      className="text-appleGray-300 hover:text-sky-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <span>View Applications</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        →
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="text-appleGray-300 hover:text-sky-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <span>Login</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        →
                      </span>
                    </Link>
                  </li> */}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-xl font-bold mb-6 text-white">
                  Contact Info
                </h4>
                <div className="space-y-6">
                  {" "}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
                      <FaMapMarkerAlt className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-appleGray-300 font-medium">
                        123 Main Street
                      </p>
                      <p className="text-appleGray-400">
                        Colombo 03, Sri Lanka
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-sky-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
                      <FaPhone className="w-5 h-5 text-white" />
                    </div>
                    <a
                      href="tel:+94701234567"
                      className="text-appleGray-300 hover:text-white transition-colors duration-300"
                    >
                      +94 70 123 4567
                    </a>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-appleGray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
                      <FaEnvelope className="w-5 h-5 text-white" />
                    </div>
                    <a
                      href="mailto:info@gidzunipath.com"
                      className="text-appleGray-300 hover:text-white transition-colors duration-300"
                    >
                      info@gidzunipath.com
                    </a>
                  </div>{" "}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
                      <FaClock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-appleGray-300 font-medium">
                        Mon - Fri: 9:00 AM - 6:00 PM
                      </p>
                      <p className="text-appleGray-400">
                        Sat: 9:00 AM - 2:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-appleGray-700 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-appleGray-400">
                  <p>
                    &copy; 2025 GIDZ UniPath. All rights reserved. Crafted with
                    German precision.
                  </p>
                </div>

                {/* Credit to Helarix Technologies with German colors */}
                <div className="flex items-center space-x-2 text-appleGray-400">
                  <span>Developed by</span>
                  <a
                    href="https://helarix.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sky-400 hover:text-white transition-colors duration-300 font-bold"
                  >
                    <FaCode className="w-4 h-4" />
                    <span>Helarix Technologies</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <FloatingButtons />
      </body>
    </html>
  );
}

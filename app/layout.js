import localFont from "next/font/local";
import "./globals.css";
import Nav from "./components/nav";
import FloatingButtons from "./components/floatingButton";
import Link from "next/link";
import { FaGraduationCap, FaEnvelope, FaPhone, FaWhatsapp, FaMapMarkerAlt, FaClock, FaCode } from "react-icons/fa";

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
  title: "Gideon International Dream Zone",
  description:
    "Empowering students with knowledge and skills for a brighter future. Join us to explore trending technologies and career pathways.",
  keywords: ["education", "career pathways", "technology", "online learning", "Gidzuni"],
  author: "Gidzuni Education Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {" "}
        <Nav />
        <div style={{ minHeight: "70vh" }}>{children}</div>
        {/* Professional Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="py-16 grid lg:grid-cols-4 md:grid-cols-2 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <FaGraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">GIDZ UniPath</h3>
                    <p className="text-gray-400 text-sm">Your Gateway to German Excellence</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                  We are Sri Lanka&apos;s leading education consultancy, specializing in German university admissions and visa
                  processing. Our expert team has helped over 1000 students achieve their academic dreams in Germany.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="mailto:info@gidzunipath.com"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                  >
                    <FaEnvelope className="w-5 h-5" />
                  </a>
                  <a
                    href="tel:+94701234567"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                  >
                    <FaPhone className="w-5 h-5" />
                  </a>
                  <a
                    href="https://wa.me/94701234567"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-300"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </a>
                </div>
              </div>{" "}
              {/* Quick Links - Only Working Pages */}
              <div>
                <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/apply-now" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Apply Now
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/application" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Application Status
                    </Link>
                  </li>
                  <li>
                    <Link href="/applications" className="text-gray-300 hover:text-white transition-colors duration-300">
                      View Applications
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">123 Main Street</p>
                      <p className="text-gray-300">Colombo 03, Sri Lanka</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="w-5 h-5 text-blue-400" />
                    <a href="tel:+94701234567" className="text-gray-300 hover:text-white transition-colors duration-300">
                      +94 70 123 4567
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="w-5 h-5 text-blue-400" />
                    <a
                      href="mailto:info@gidzunipath.com"
                      className="text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      info@gidzunipath.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaClock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-gray-300">Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-300">Sat: 9:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-gray-400 text-sm">
                  <p>&copy; 2025 GIDZ UniPath. All rights reserved.</p>
                </div>

                {/* Credit to Helarix Technologies */}
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <a
                    href="https://helarix.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors duration-300 font-semibold"
                  >
                    <FaCode className="w-4 h-4" />
                    <span>Helarix</span>
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

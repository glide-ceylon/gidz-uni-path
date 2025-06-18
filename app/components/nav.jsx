"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For redirecting on logout
import Image from "next/image";

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisaDropdownOpen, setIsVisaDropdownOpen] = useState(false); // For Desktop
  const [isMobileVisaOpen, setIsMobileVisaOpen] = useState(false); // For Mobile

  // Track user login status based on localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const visaDropdownRef = useRef(null);

  // Check localStorage on mount to see if the user is already logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle logout: clear localStorage, update state, and redirect if desired
  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    // Optional: redirect somewhere after logout
    // router.push("/");
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle mobile visa dropdown
  const toggleMobileVisa = () => {
    setIsMobileVisaOpen(!isMobileVisaOpen);
  };

  // Close Visa dropdown if clicked outside (desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        visaDropdownRef.current &&
        !visaDropdownRef.current.contains(event.target)
      ) {
        setIsVisaDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="bg-gradient-to-r from-appleGray-50 to-white w-full bg-[length:400%_400%] animate-gradient-move shadow-sm border-b border-appleGray-200">
      <div className="container mx-auto flex justify-between lg:w-10/12 items-center p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/gidz.png"
            alt="Gidzuni Education Pathways Logo"
            className="h-16"
          />
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center relative">
          {" "}
          <Link
            href="/"
            className="ml-2 text-appleGray-600 hover:text-appleGray-800 active:font-bold px-4 py-2 rounded-md transition duration-200"
          >
            Home
          </Link>
          {/* Visa Dropdown for Desktop */}
          <div
            className="ml-2 relative"
            onMouseEnter={() => setIsVisaDropdownOpen(true)}
            onMouseLeave={() => setIsVisaDropdownOpen(false)}
            ref={visaDropdownRef}
          >
            {" "}
            <Link href="/apply-now">
              <button
                className="ml-2 text-appleGray-600 hover:text-appleGray-800 active:font-bold px-4 py-2 rounded-md flex items-center transition duration-200"
                aria-haspopup="true"
                aria-expanded={isVisaDropdownOpen}
              >
                Visa
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </Link>
            {isVisaDropdownOpen && (
              <div className="absolute top-full left-0 w-48 bg-white border border-appleGray-200 rounded-md shadow-lg z-50">
                <Link
                  href="/apply-now/student"
                  className="block px-4 py-2 text-appleGray-600 hover:text-appleGray-800 hover:bg-appleGray-50 transition duration-200"
                >
                  Student Visa
                </Link>
                <Link
                  href="/apply-now/work"
                  className="block px-4 py-2 text-appleGray-600 hover:text-appleGray-800 hover:bg-appleGray-50 transition duration-200"
                >
                  Work Visa
                </Link>
              </div>
            )}
          </div>{" "}
          <Link
            href="/contact"
            className="ml-2 text-appleGray-600 hover:text-appleGray-800 active:font-bold px-4 py-2 rounded-md transition duration-200"
          >
            Contact Us
          </Link>
        </nav>
        {/* Show Login button if NOT logged in; otherwise show Logout button */}{" "}
        {!isLoggedIn ? (
          <Link
            href="/login"
            className="ml-6 bg-sky-500 text-white active:font-bold px-4 py-2 rounded-md shadow-md transition duration-200 hover:bg-sky-600"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="ml-6 bg-sky-500 text-white active:font-bold px-4 py-2 rounded-md shadow-md transition duration-200 hover:bg-sky-600"
          >
            Logout
          </button>
        )}
        {/* Mobile Menu Button */}{" "}
        <button
          className="md:hidden flex items-center text-appleGray-600 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleMobileMenu}
              aria-label="Close menu"
              className="text-appleGray-600"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center h-full space-y-6">
            {" "}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-medium text-appleGray-700 hover:text-sky-500 transition duration-200"
            >
              Home
            </Link>
            {/* Mobile Visa with Submenu */}
            <div className="w-full flex flex-col items-center">
              {" "}
              <button
                onClick={toggleMobileVisa}
                aria-haspopup="true"
                aria-expanded={isMobileVisaOpen}
                className="flex items-center justify-center w-full text-2xl font-medium text-appleGray-700 hover:text-sky-500 transition duration-200"
              >
                Visa
                <svg
                  className={`w-5 h-5 ml-1 transform transition-transform duration-300 ${
                    isMobileVisaOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isMobileVisaOpen && (
                <div className="mt-4 flex flex-col items-center space-y-4">
                  <Link
                    href="/apply-now/student"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-medium text-appleGray-600 hover:text-sky-500 transition duration-200"
                  >
                    Student Visa
                  </Link>
                  <Link
                    href="/apply-now/work"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-medium text-appleGray-600 hover:text-sky-500 transition duration-200"
                  >
                    Work Visa
                  </Link>
                </div>
              )}
            </div>{" "}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-medium text-appleGray-700 hover:text-sky-500 transition duration-200"
            >
              Contact Us
            </Link>
            {/* Show Login or Logout in Mobile Menu */}{" "}
            {!isLoggedIn ? (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-sky-500 text-white px-6 py-3 rounded-md text-2xl font-medium shadow-lg hover:bg-sky-600 transition duration-200"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-sky-500 text-white px-6 py-3 rounded-md text-2xl font-medium shadow-lg hover:bg-sky-600 transition duration-200"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaGraduationCap,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisaDropdownOpen, setIsVisaDropdownOpen] = useState(false);
  const [isMobileVisaOpen, setIsMobileVisaOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const visaDropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // Check localStorage on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle mobile visa dropdown
  const toggleMobileVisa = () => {
    setIsMobileVisaOpen(!isMobileVisaOpen);
  };

  // Handle dropdown with delay
  const openDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsVisaDropdownOpen(true);
  };

  const closeDropdownWithDelay = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsVisaDropdownOpen(false);
    }, 150); // 500ms delay
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdown if clicked outside
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-effect shadow-medium backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-german-red to-german-gold rounded-xl flex items-center justify-center shadow-soft transition-all duration-300 group-hover:scale-110"> */}
            <Link href="/" className="flex items-center">
              <img
                src="/gidz-transperant.png"
                alt="Gidzuni Education Pathways Logo"
                className="h-10 w-10 object-contain"
              />
            </Link>
            {/* </div> */}
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-appleGray-800">
                GIDZ UniPath
              </div>
              <div className="text-xs text-appleGray-500 -mt-1">
                German Excellence
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {" "}
            <Link
              href="/"
              className="text-appleGray-700 hover:text-sky-500 font-medium transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>{" "}
            {/* Visa Dropdown */}
            <div
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdownWithDelay}
              ref={visaDropdownRef}
            >
              <Link
                href="/apply-now"
                onClick={() => setIsVisaDropdownOpen(!isVisaDropdownOpen)}
                className="flex items-center space-x-1 text-appleGray-700 hover:text-sky-500 font-medium transition-colors duration-200 relative group"
                aria-haspopup="true"
                aria-expanded={isVisaDropdownOpen}
              >
                <span>Visa Services</span>
                <FaChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isVisaDropdownOpen ? "rotate-180" : ""
                  }`}
                />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              {isVisaDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-large border border-appleGray-200 overflow-hidden animate-scale-in z-50"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdownWithDelay}
                >
                  <div className="p-2">
                    <Link
                      href="/apply-now/student"
                      className="block px-4 py-3 rounded-xl text-appleGray-700 hover:bg-sky-500/10 hover:text-sky-500 transition-colors duration-200"
                      onClick={() => setIsVisaDropdownOpen(false)}
                    >
                      <div className="font-medium">Student Visa</div>
                      <div className="text-sm text-appleGray-500">
                        For university applications
                      </div>
                    </Link>
                    <Link
                      href="/apply-now/work"
                      className="block px-4 py-3 rounded-xl text-appleGray-700 hover:bg-sky-500/10 hover:text-sky-500 transition-colors duration-200"
                      onClick={() => setIsVisaDropdownOpen(false)}
                    >
                      <div className="font-medium">Work Visa</div>
                      <div className="text-sm text-appleGray-500">
                        For professional opportunities
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>{" "}
            {/* <Link
              href="/applications"
              className="text-appleGray-700 hover:text-sky-500 font-medium transition-colors duration-200 relative group"
            >
              Applications
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all duration-200 group-hover:w-full"></span>
            </Link> */}
            <Link
              href="/contact"
              className="text-appleGray-700 hover:text-sky-500 font-medium transition-colors duration-200 relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            {/* Authentication */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {" "}
                <Link
                  href="/my-admin"
                  className="text-appleGray-700 hover:text-sky-500 font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-appleGray-100 text-appleGray-700 px-4 py-2 rounded-xl font-medium hover:bg-appleGray-200 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-xl font-semibold btn-apple-hover shadow-soft"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-appleGray-100 text-appleGray-700 hover:bg-appleGray-200 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-appleGray-200 bg-white/95 backdrop-blur-xl rounded-b-3xl shadow-large animate-fade-in-up">
            <div className="px-4 py-6 space-y-4">
              {" "}
              <Link
                href="/"
                className="block text-appleGray-700 hover:text-sky-500 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {/* Mobile Visa Dropdown */}
              <div>
                {" "}
                <button
                  onClick={toggleMobileVisa}
                  className="flex items-center justify-between w-full text-appleGray-700 hover:text-sky-500 font-medium py-2 transition-colors duration-200"
                >
                  <span>Visa Services</span>
                  <FaChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isMobileVisaOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isMobileVisaOpen && (
                  <div className="pl-4 mt-2 space-y-2 animate-fade-in-up">
                    {" "}
                    <Link
                      href="/apply-now/student"
                      className="block text-appleGray-600 hover:text-sky-500 py-2 transition-colors duration-200 text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Student Visa
                    </Link>
                    <Link
                      href="/apply-now/work"
                      className="block text-appleGray-600 hover:text-sky-500 py-2 transition-colors duration-200 text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Work Visa
                    </Link>
                  </div>
                )}
              </div>{" "}
              <Link
                href="/applications"
                className="block text-appleGray-700 hover:text-sky-500 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Applications
              </Link>{" "}
              <Link
                href="/contact"
                className="block text-appleGray-700 hover:text-sky-500 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {/* Mobile Authentication */}
              <div className="pt-4 border-t border-appleGray-200">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    {" "}
                    <Link
                      href="/my-admin"
                      className="block text-appleGray-700 hover:text-sky-500 font-medium py-2 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-appleGray-700 hover:text-sky-500 font-medium py-2 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-xl font-semibold text-center btn-apple-hover shadow-soft"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

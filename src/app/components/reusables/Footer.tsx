import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaX } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        {/* Main grid content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">flexica</h2>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for everything you need.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* (You can add a third column here if you want, or leave empty) */}
          <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
  <p className="text-gray-400 text-sm mb-1">Mbezi Africana, Dar es salaam , Tanzania</p>
  <p className="text-gray-400 text-sm mb-1">Phone: +255 723 456 7890</p>
  <p className="text-gray-400 text-sm">Email: support@flexica.com</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebook size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedin size={24} />
              </a>
            </div>
        </div>
        </div>

        {/* Bottom copyright line separated */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FLEXICA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

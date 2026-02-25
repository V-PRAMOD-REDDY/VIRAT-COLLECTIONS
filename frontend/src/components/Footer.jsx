import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'; // Icons Import

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-32 md:pb-12 px-6 md:px-20 border-t border-gray-800 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand Info & Social Media */}
          <div className="col-span-1">
            <Link to='/'>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6">
                Virat <span className="text-blue-500 text-xs block font-normal tracking-normal">Collections</span>
              </h2>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              We provide premium quality apparel at affordable prices. Visit our stores directly to experience the latest in modern fashion.
            </p>
            {/* --- Social Media Icons --- */}
            <div className="flex gap-5 text-xl text-gray-400">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-all" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-600 transition-all" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-all" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-600 transition-all" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="font-bold mb-6 uppercase text-sm tracking-wider">Quick Links</h3>
            <ul className="text-xs text-gray-400 space-y-3 font-medium">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition">Shop Collections</Link></li>
              <li><Link to="/offers" className="hover:text-white transition">Special Offers</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition">Track Order</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          {/* 3. Store Location 1 */}
          <div>
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wider text-blue-400">📍 KGF Branch</h3>
            <div className="rounded-xl overflow-hidden h-32 bg-gray-900 border border-gray-800">
              <iframe 
                title="KGF Branch Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15549.33642456637!2d78.2587!3d12.9608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae39853a4736f3%3A0x8e83161c8a143f2!2sKolar%20Gold%20Fields%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890" 
                className="w-full h-full border-0 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-500"
                allowFullScreen="" loading="lazy">
              </iframe>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 italic">Geetha Road, 1st Cross, KGF.</p>
          </div>

          {/* 4. Store Location 2 */}
          <div>
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wider text-green-400">📍 Kolar Branch</h3>
            <div className="rounded-xl overflow-hidden h-32 bg-gray-900 border border-gray-800">
              <iframe 
                title="Kolar Branch Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15544.577960322353!2d78.1275!3d13.1367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae4930646c265b%3A0x9043e06f855d0a!2sKolar%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890" 
                className="w-full h-full border-0 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-500"
                allowFullScreen="" loading="lazy">
              </iframe>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 italic">Benz Circle, Gandhi Road Road, Kolar.</p>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="text-center border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            © 2026 Virat Collections. Built for the Modern Hustler.
          </p>
          <div className="flex gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
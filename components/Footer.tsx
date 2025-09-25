import React from 'react';
import { Facebook, Linkedin, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2622FF] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <span className="text-blue-600 font-bold text-sm">SIM</span>
              </div>
              <span className="text-xl font-bold">Logo</span>
            </div>
            <p className="text-blue-100 mb-4 text-sm">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
            </p>
            <div className="flex space-x-3">
              <Facebook size={20} className="hover:text-blue-200 cursor-pointer" />
              <Linkedin size={20} className="hover:text-blue-200 cursor-pointer" />
              <Instagram size={20} className="hover:text-blue-200 cursor-pointer" />
              <Twitter size={20} className="hover:text-blue-200 cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Company</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">News</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors">Market Research</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Market Analysis</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SEO Consulting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Page Ranking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SMM</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors">Brand Strategy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Audience Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Copywriting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Team Training</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Email Marketing</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-500 mt-8 pt-8 text-center">
          <p className="text-blue-100">© 2025 SIM Keliling Kemudahan Layanan Dimana Saja</p>
        </div>
      </div>
    </footer>
  );
}
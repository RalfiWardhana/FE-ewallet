import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-purple-700 text-white py-6 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <p className="text-sm">
            Copyright © 2023 CashEase | All Rights Reserved
          </p>
          <div className="flex items-center space-x-5">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-purple-200 transition-colors" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-purple-200 transition-colors" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-purple-200 transition-colors" />
            <Linkedin className="w-5 h-5 cursor-pointer hover:text-purple-200 transition-colors" />
            <Youtube className="w-5 h-5 cursor-pointer hover:text-purple-200 transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}
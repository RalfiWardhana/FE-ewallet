import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-purple-700 text-white py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <p className="text-sm">
            Copyright © 2023 CashEase | All Rights Reserved
          </p>
          <div className="flex items-center space-x-4">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-purple-300" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-purple-300" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-purple-300" />
            <Linkedin className="w-5 h-5 cursor-pointer hover:text-purple-300" />
            <Youtube className="w-5 h-5 cursor-pointer hover:text-purple-300" />
          </div>
        </div>
      </div>
    </footer>
  );
}
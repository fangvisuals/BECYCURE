import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 p-8 z-20">
      <Link to="/" className="flex items-center text-sky-400 text-xl font-mono hover:text-sky-300 transition-colors">
        <span className="mr-2 text-white"> /</span>
        <span className="font-inter font-bold bg-gradient-to-t from-sky-400 to-blue-600 inline-block text-transparent bg-clip-text bg-[length:100%_200%] bg-bottom transition-all duration-500 hover:bg-top">BECYCURE</span>
      </Link>
    </header>
  );
}

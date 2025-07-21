import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 p-8 z-20">
      <Link to="/" className="flex items-center text-sky-400 text-xl font-mono hover:text-sky-300 transition-colors">
        <span className="mr-2 text-white"> /</span>
        <span className="font-inter font-bold">BECYCURE</span>
      </Link>
    </header>
  );
}

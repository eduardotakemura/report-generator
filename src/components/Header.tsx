'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import './Header.css';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link href="/" className="logo-link">
            <h1>Gerador de Relatórios</h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Mobile Dropdown Menu */}
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link href="/dashboard" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

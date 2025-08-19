import React, { useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#documents', label: 'Documents' },
    { href: '#amenities', label: 'Amenities' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <header className="bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg sticky top-0 z-50">
      <nav role="navigation" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center min-h-20">
          <div className="logo">
            <h1 className="text-3xl font-bold mb-0">Crestview Eighty HOA</h1>
            <p className="text-sm opacity-90 -mt-1">Bigfork, Montana</p>
          </div>
          
          <ul className="hidden md:flex list-none gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a 
                  href={item.href} 
                  className="text-white no-underline font-medium hover:text-blue-200 transition-colors duration-300 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-primary-700 rounded"
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="md:hidden">
            <button 
              className="text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-primary-700 rounded"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden bg-primary-700 px-5 py-4"
            role="menu"
          >
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.href} role="none">
                  <a 
                    href={item.href} 
                    className="text-white no-underline font-medium hover:text-blue-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-primary-700 rounded py-1 px-2 block"
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
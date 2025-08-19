import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-700 text-white text-center py-10">
      <div className="max-w-6xl mx-auto px-5">
        <p className="mb-2 text-lg">
          &copy; {currentYear} Crestview Eighty HOA. All rights reserved.
        </p>
        <p className="text-blue-200">
          Bigfork, Montana
        </p>
      </div>
    </footer>
  );
};

export default Footer;
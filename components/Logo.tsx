import React from 'react';

const Logo: React.FC = () => (
  <div className="flex justify-center mb-4">
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="neovidLogoTitle neovidLogoDesc">
      <title id="neovidLogoTitle">Neovid Inspect Logo</title>
      <desc id="neovidLogoDesc">Stylized N inside a circular gradient for Neovid Inspect.</desc>
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" /> {/* orange-500 */}
          <stop offset="100%" stopColor="#ea580c" /> {/* orange-600 */}
        </linearGradient>
      </defs>
      {/* Outer shape / Lens */}
      <path d="M40 5 C20.68 5 5 20.68 5 40 C5 59.32 20.68 75 40 75 C59.32 75 75 59.32 75 40 C75 20.68 59.32 5 40 5 Z" fill="url(#logoGradient)"/>
      {/* Inner "N" */}
      <path d="M25 25 L25 55 L35 55 L35 35 L45 55 L55 55 L55 25 L45 25 L45 45 L35 25 Z" fill="#000000"/>
    </svg>
  </div>
);

export default Logo;
import React, { useState } from 'react';

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = '919346638123';
  const defaultMessage = encodeURIComponent(
    'Hello BuildMaster, I am interested in your construction projects and luxury properties. Please assist me.'
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside aria-label="WhatsApp Quick Contact" className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip Label */}
      <span
        className={`hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full bg-navy-950/95 text-white text-xs font-bold border border-gold-400/40 shadow-2xl backdrop-blur-md transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
        Chat on WhatsApp
      </span>

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white flex items-center justify-center shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/30"
        aria-label="Chat with BuildMaster on WhatsApp: +91 93466 38123"
        title="WhatsApp: +91 93466 38123"
      >
        {/* Radar Ping Animation */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-40 animate-ping -z-10 group-hover:opacity-75" />

        {/* Official WhatsApp SVG Icon */}
        <svg
          className="w-7 h-7 fill-white drop-shadow-md"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.71C7.02 10.93 7.91 12.11 8.03 12.28C8.16 12.45 9.77 14.94 12.24 16.01C12.83 16.26 13.28 16.42 13.64 16.53C14.23 16.72 14.77 16.69 15.2 16.63C15.68 16.56 16.67 16.03 16.88 15.45C17.08 14.86 17.08 14.36 17.02 14.25C16.96 14.15 16.8 14.09 16.55 13.96C16.3 13.84 15.08 13.24 14.86 13.15C14.63 13.07 14.47 13.03 14.3 13.28C14.14 13.53 13.66 14.09 13.52 14.25C13.38 14.42 13.23 14.44 12.99 14.32C12.74 14.19 11.94 13.93 11 13.09C10.26 12.44 9.77 11.63 9.62 11.39C9.48 11.14 9.61 11.01 9.73 10.89C9.84 10.78 9.98 10.6 10.11 10.45C10.23 10.3 10.27 10.19 10.35 10.02C10.43 9.86 10.39 9.71 10.33 9.59C10.27 9.46 9.8 8.31 9.6 7.84C9.41 7.37 9.22 7.43 9.07 7.43C8.93 7.42 8.76 7.42 8.59 7.42L8.53 7.33Z" />
        </svg>

        {/* Small Online Status Badge */}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
      </a>
    </aside>
  );
};

export default WhatsAppButton;

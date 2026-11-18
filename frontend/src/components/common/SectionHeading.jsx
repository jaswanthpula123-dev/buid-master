import React from 'react';

const SectionHeading = ({
  badge,
  title,
  subtitle,
  centered = true,
  light = false,
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gold-100 text-gold-700 border border-gold-300/40 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-600"></span>
          {badge}
        </span>
      )}
      <h2
        className={`font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${
          light ? 'text-white' : 'text-navy-950'
        }`}
      >
        {title}
      </h2>
      <div className={`w-16 h-1 bg-gradient-to-r from-gold-500 to-amber-600 rounded-full mb-4 ${centered ? 'mx-auto' : ''}`}></div>
      {subtitle && (
        <p className={`text-base sm:text-lg leading-relaxed ${light ? 'text-slate-300' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;

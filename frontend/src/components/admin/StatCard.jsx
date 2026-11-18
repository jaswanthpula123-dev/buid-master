import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'gold', trend }) => {
  const colorMap = {
    gold: {
      bg: 'bg-gold-50',
      iconBg: 'bg-gold-500/10 text-gold-600',
      border: 'border-gold-200/50',
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-500/10 text-blue-600',
      border: 'border-blue-200/50',
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      border: 'border-emerald-200/50',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500/10 text-purple-600',
      border: 'border-purple-200/50',
    },
  };

  const scheme = colorMap[color] || colorMap.gold;

  return (
    <div className={`p-6 rounded-2xl bg-white border ${scheme.border} shadow-sm hover:shadow-md transition flex items-start justify-between`}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-navy-950 font-display">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        {trend && (
          <span className="inline-block mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${scheme.iconBg}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;

import React from 'react';
import {
  Award,
  ShieldCheck,
  Building2,
  Users,
  Target,
  Eye,
  CheckCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';

const AboutUs = () => {
  const milestones = [
    {
      year: '2008',
      title: 'Foundation of BuildMaster Infra',
      description:
        'Established by master civil engineer Robert Vance with a vision to revolutionize urban residential architecture with uncompromising structural integrity.',
    },
    {
      year: '2013',
      title: 'First Gated High-Rise Community',
      description:
        'Delivered the iconic "Green Valley Crest" residential enclave 3 months ahead of schedule, earning our first National Construction Excellence Award.',
    },
    {
      year: '2019',
      title: 'Commercial & Mixed-Use Expansion',
      description:
        'Ventured into Grade-A commercial tech parks and sustainable mixed-use towers, achieving IGBC Gold and Platinum environmental standards.',
    },
    {
      year: '2024',
      title: 'Grand Horizon Towers Handover',
      description:
        'Completed our 120th landmark project, delivering luxury waterfront living to 140 families in Downtown Bayview.',
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* Top Banner */}
      <div className="bg-navy-950 text-white py-16 mb-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gold-500/10 text-gold-400 border border-gold-400/20 mb-3">
            <Building2 size={14} />
            18+ Years of Engineering Excellence
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mb-4">
            Shaping Skylines, Building Trust
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
            BuildMaster stands at the forefront of premier real estate and construction.
            We combine high-tensile structural engineering with timeless architectural aesthetics
            to create living spaces of enduring value.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* BUILDER PROFILE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl shadow-premium border border-slate-100">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] bg-navy-900">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                alt="Robert Vance - Master Builder"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Experience Badge Overlay */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 p-6 rounded-3xl shadow-xl border border-white">
              <p className="text-3xl font-black font-display">18+</p>
              <p className="text-xs font-bold uppercase tracking-wider">Years Experience</p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-600">
              Builder Leadership
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 leading-tight">
              "We don't cut corners on concrete, because we build homes for generations."
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Founded and spearheaded by Chief Builder Robert Vance, BuildMaster has grown from a
              boutique residential contractor into a full-scale construction and real estate development
              powerhouse. With a master's degree in structural mechanics from MIT and over two decades
              of field supervision, Robert oversees every project from foundation soil testing to final
              interior detailing.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <span className="block text-2xl font-black text-navy-950 font-display">120+</span>
                <span className="text-xs text-slate-500 font-semibold">Completed Projects</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-navy-950 font-display">2,800+</span>
                <span className="text-xs text-slate-500 font-semibold">Happy Homeowner Families</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-navy-950 font-display">2.4M</span>
                <span className="text-xs text-slate-500 font-semibold">Square Feet Built</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-navy-950 font-display">15+</span>
                <span className="text-xs text-slate-500 font-semibold">National Industry Awards</span>
              </div>
            </div>
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-navy-950 text-white p-8 sm:p-10 rounded-3xl border border-navy-800 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-6">
              <Target size={28} />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3 text-white">Our Mission</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              To construct landmark residential and commercial environments of unyielding structural
              integrity, transparent handover milestones, and sustainable design that enrich the lives
              of homeowners while generating strong capital appreciation for investors.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gold-500 to-amber-600 text-navy-950 p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center mb-6">
              <Eye size={28} />
            </div>
            <h3 className="font-display text-2xl font-black mb-3">Our Vision</h3>
            <p className="text-navy-950/90 text-sm sm:text-base font-medium leading-relaxed">
              To become the most respected and dependable builder in the country, pioneering zero-carbon
              sustainable building practices, automated smart-building technologies, and absolute customer
              satisfaction across all socio-economic spectrums.
            </p>
          </div>
        </div>

        {/* TIMELINE / HISTORY */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-premium border border-slate-100">
          <SectionHeading
            badge="Historical Milestones"
            title="The Journey of BuildMaster"
            subtitle="Explore our steady growth and major breakthroughs over 18 remarkable years."
          />

          <div className="relative border-l-2 border-gold-400/40 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
            {milestones.map((item, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center ring-4 ring-white shadow-md">
                  <span className="w-2 h-2 rounded-full bg-navy-950"></span>
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-navy-900 text-gold-400 mb-2">
                  {item.year}
                </span>
                <h4 className="text-lg font-bold text-navy-950 font-display">{item.title}</h4>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

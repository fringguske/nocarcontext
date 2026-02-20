import React, { useState, useEffect } from "react";
import Link from "next/link";

const HeroSection: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full flex flex-col items-center">
      {/* Navigation */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[calc(100%-3rem)] max-w-5xl rounded-[2rem] border border-white/20 ${scrolled ? 'bg-white/70 backdrop-blur-xl shadow-2xl py-3 px-8' : 'bg-white/30 backdrop-blur-md py-4 px-10'
        }`}>
        <div className="flex justify-between items-center">
          <Link href="/" className="relative z-50">
            <span className="font-outfit font-black text-2xl tracking-tighter text-slate-900">
              NOCARCONTEXT<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink href="#fleet">Fleet</NavLink>
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#about">About</NavLink>
            <Link
              href="/admin"
              className="px-7 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-blue-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-50 p-2 text-slate-900 bg-white/50 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <div className={`w-5 h-0.5 bg-current my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white/98 backdrop-blur-2xl z-40 flex flex-col items-center justify-center gap-10 transition-all duration-700 ease-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}>
        <MobileNavLink onClick={() => setIsMenuOpen(false)} href="#fleet">Fleet</MobileNavLink>
        <MobileNavLink onClick={() => setIsMenuOpen(false)} href="#services">Services</MobileNavLink>
        <MobileNavLink onClick={() => setIsMenuOpen(false)} href="#about">About</MobileNavLink>
        <Link
          href="/admin"
          onClick={() => setIsMenuOpen(false)}
          className="px-10 py-4 rounded-full bg-slate-900 text-white font-black text-xl mt-6 shadow-2xl"
        >
          Admin Access
        </Link>
      </div>

      {/* Hero Image Banner */}
      <div className="relative w-full mt-16 md:mt-24">
        {/* Image at natural aspect ratio */}
        <img
          src="/1080x360.jfif"
          alt="Hero Background"
          className="w-full h-auto block"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />

        {/* Text Content floating on image */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="flex flex-col gap-4 md:gap-6 max-w-2xl animate-fade-in">
              <div className="hidden sm:inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-blue-300 text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase">Premium Showroom Live</span>
              </div>

              <h1 className="font-outfit text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight text-white">
                Beyond <br />
                <span className="text-blue-500">Ordinary.</span>
              </h1>

              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-lg font-medium hidden sm:block">
                Curated precision. Unrivaled luxury. Discover a collection of the world&apos;s finest automotive masterpieces.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-4 rounded-2xl bg-blue-600 text-white font-black text-base md:text-lg flex items-center justify-center gap-3 group transition-all duration-500 hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1">
                  Explore Fleet
                  <div className="bg-white/20 p-1 rounded-lg transition-transform duration-500 group-hover:translate-x-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
                <button className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg text-white hover:bg-white/10 border border-white/20 transition-all duration-500 backdrop-blur-md">
                  Contact VIP Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-center sm:justify-start gap-10 md:gap-16">
          <Stat number="85+" label="Active Fleet" lightMode={true} />
          <Stat number="24" label="Global Parts" lightMode={true} />
          <Stat number="15m" label="Verified" lightMode={true} />
        </div>
      </div>
    </section>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-slate-600 font-bold text-sm hover:text-blue-600 transition-colors relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
  </a>
);

const MobileNavLink = ({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-4xl font-outfit font-black text-slate-900 hover:text-blue-600 transition-colors"
  >
    {children}
  </a>
);

const Stat = ({ number, label, lightMode = false }: { number: string; label: string; lightMode?: boolean }) => (
  <div>
    <p className={`text-4xl font-black font-outfit tracking-tighter ${lightMode ? 'text-white' : 'text-slate-900'}`}>{number}</p>
    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${lightMode ? 'text-blue-300' : 'text-slate-400'}`}>{label}</p>
  </div>
);

export default HeroSection;
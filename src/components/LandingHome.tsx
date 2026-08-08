import React from 'react';
import bgImageUrl from '../assets/images/cinematic_film_set_1785254501370.jpg';
import { PricingSection } from './PricingSection';
import { User } from '../types';

interface LandingHomeProps {
  onNavigate: (route: string, params?: any) => void;
  currentUser?: { user: User; profile: any };
  onOpenAuth?: (tab: 'login' | 'signup') => void;
  isDaylight?: boolean;
}

export const LandingHome: React.FC<LandingHomeProps> = ({ onNavigate, currentUser, onOpenAuth, isDaylight = false }) => {
  const currentBgImage = bgImageUrl || '/images/cinematic_film_set_1785254501370.jpg';

  return (
    <div 
      className={`relative min-h-[calc(100vh-64px)] ${isDaylight ? 'daylight-bg bg-[#edf2f7] text-[#0f172a]' : 'bg-[#181a20] text-[#f8f7f4]'} font-['Inter',sans-serif] selection:bg-[#ff3e00] selection:text-[#0b0b0d] py-6 sm:py-12 px-3 sm:px-6 lg:px-8 bg-cover bg-center bg-fixed transition-colors duration-300 w-full max-w-full overflow-hidden`}
      style={{
        backgroundImage: isDaylight
          ? `linear-gradient(to bottom, rgba(237, 242, 247, 0.94), rgba(226, 232, 240, 0.98)), url('${currentBgImage}')`
          : `linear-gradient(to bottom, var(--bg-overlay, rgba(24, 26, 32, 0.82)), var(--bg-overlay-bottom, rgba(24, 26, 32, 0.94))), url('${currentBgImage}')`
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto space-y-12 sm:space-y-20">
        
        {/* HERO SECTION */}
        <section className="space-y-6 sm:space-y-8 pt-2 sm:pt-8 text-center max-w-4xl mx-auto px-1 sm:px-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${isDaylight ? 'bg-white border-[#cbd5e1] shadow-sm' : 'bg-[#111114] border-[#f8f7f4]/10'} border rounded-full font-mono-code text-[0.62rem] sm:text-[0.65rem] uppercase tracking-widest text-[#ff3e00] max-w-full truncate`}>
            <span className="w-2 h-2 rounded-full bg-[#ff3e00] animate-pulse shrink-0" />
            <span className="truncate">KUTAFUTATALENT // CINEMATIC TALENT NETWORK</span>
          </div>

          <h1
            className={`font-syne text-[44px] font-extrabold uppercase tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} leading-[1.08] sm:leading-[0.95] break-words`}
            style={{ fontSize: '44px' }}
          >
            Where Film, Cast & Crew <br className="hidden sm:inline" />
            <span className="text-[#ff3e00]">Vision Meets Production.</span>
          </h1>

          <p className={`font-mono-code text-xs sm:text-sm ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} uppercase leading-relaxed tracking-wider max-w-2xl mx-auto`}>
            Kutafutatalent is an exclusive film, cast & crew marketplace bridging elite Directors of Photography, Actors, Models, Sound Recordists, Colorists, and Directors directly with global studios and independent filmmakers.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-3 font-mono-code text-[0.7rem] w-full max-w-sm sm:max-w-none mx-auto">
            <button
              onClick={() => onNavigate('marketplace')}
              className={`px-6 sm:px-8 py-3.5 sm:py-4 ${isDaylight ? 'bg-[#0f172a] hover:bg-black text-white shadow-md' : 'bg-[#f8f7f4] hover:bg-white text-[#0b0b0d] shadow-lg'} font-bold uppercase tracking-widest transition-all cursor-pointer hover:scale-[1.02] text-center`}
            >
              Enter Marketplace &rarr;
            </button>
            <button
              onClick={() => onNavigate('directory')}
              className={`px-6 sm:px-8 py-3.5 sm:py-4 ${isDaylight ? 'bg-white hover:bg-slate-100 text-[#0f172a] border-[#cbd5e1] shadow-sm' : 'bg-transparent hover:bg-[#f8f7f4]/5 text-[#f8f7f4] border-[#f8f7f4]/20'} border font-bold uppercase tracking-widest transition-all cursor-pointer text-center`}
            >
              Browse Talent Directory
            </button>
            <button
              onClick={() => onNavigate('jobs_create')}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#ff3e00] hover:bg-[#e03700] text-white font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md text-center"
            >
              Post Production Call
            </button>
          </div>
        </section>

        {/* CORE MANIFESTO / IDEOLOGY GRID */}
        <section className="space-y-6">
          <div className={`border-b ${isDaylight ? 'border-[#cbd5e1]' : 'border-[#f8f7f4]/10'} pb-4 flex items-center justify-between font-mono-code`}>
            <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00]">
              [ 01 // CORE IDEOLOGY ]
            </span>
            <span className={`text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/40'}`}>
              PURPOSE & SPECS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono-code">
            <div className={`${isDaylight ? 'bg-white border-[#cbd5e1] shadow-sm' : 'bg-[#111114] border-[#f8f7f4]/10'} border p-6 space-y-3 rounded-lg`}>
              <span className="text-xl text-[#ff3e00] block">01 /</span>
              <h3 className={`font-syne text-lg font-bold uppercase tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                Curated Excellence
              </h3>
              <p className={`text-[0.7rem] ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/60'} uppercase leading-relaxed`}>
                Only verified film professionals with vetted showreels, confirmed gear packages, and certified industry experience. No unverified spam.
              </p>
            </div>

            <div className={`${isDaylight ? 'bg-white border-[#cbd5e1] shadow-sm' : 'bg-[#111114] border-[#f8f7f4]/10'} border p-6 space-y-3 rounded-lg`}>
              <span className="text-xl text-[#ff3e00] block">02 /</span>
              <h3 className={`font-syne text-lg font-bold uppercase tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                Transparent Rates & Gear
              </h3>
              <p className={`text-[0.7rem] ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/60'} uppercase leading-relaxed`}>
                Clear day-rate benchmarks, camera package manifests, and union compliance options laid out before sending production offers.
              </p>
            </div>

            <div className={`${isDaylight ? 'bg-white border-[#cbd5e1] shadow-sm' : 'bg-[#111114] border-[#f8f7f4]/10'} border p-6 space-y-3 rounded-lg`}>
              <span className="text-xl text-[#ff3e00] block">03 /</span>
              <h3 className={`font-syne text-lg font-bold uppercase tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                Direct Producer Connection
              </h3>
              <p className={`text-[0.7rem] ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/60'} uppercase leading-relaxed`}>
                Bypass agency markups and administrative friction with direct messaging, contract locks, and cloud media vault integration.
              </p>
            </div>
          </div>
        </section>

        {/* METRICS STARK BAR */}
        <section className={`grid grid-cols-2 lg:grid-cols-4 gap-px ${isDaylight ? 'bg-[#cbd5e1] border-[#cbd5e1]' : 'bg-[#f8f7f4]/10 border-[#f8f7f4]/10'} border font-mono-code`}>
          <div className={`${isDaylight ? 'bg-white' : 'bg-[#0b0b0d]'} p-6 space-y-1 text-center sm:text-left`}>
            <span className={`text-[0.6rem] uppercase tracking-widest ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50'} block`}>Registered Talent</span>
            <span className={`font-syne text-3xl font-extrabold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>3,200+</span>
          </div>
          <div className={`${isDaylight ? 'bg-white' : 'bg-[#0b0b0d]'} p-6 space-y-1 text-center sm:text-left`}>
            <span className={`text-[0.6rem] uppercase tracking-widest ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50'} block`}>Production Budgets</span>
            <span className={`font-syne text-3xl font-extrabold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>$18M+</span>
          </div>
          <div className={`${isDaylight ? 'bg-white' : 'bg-[#0b0b0d]'} p-6 space-y-1 text-center sm:text-left`}>
            <span className={`text-[0.6rem] uppercase tracking-widest ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50'} block`}>Fulfillment Rate</span>
            <span className="font-syne text-3xl font-extrabold text-[#ff3e00]">99.2%</span>
          </div>
          <div className={`${isDaylight ? 'bg-white' : 'bg-[#0b0b0d]'} p-6 space-y-1 text-center sm:text-left`}>
            <span className={`text-[0.6rem] uppercase tracking-widest ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50'} block`}>Global Hubs</span>
            <span className={`font-syne text-3xl font-extrabold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>45+</span>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-6">
          <div className={`border-b ${isDaylight ? 'border-[#cbd5e1]' : 'border-[#f8f7f4]/10'} pb-4 font-mono-code`}>
            <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block">
              [ 02 // WORKFLOW ENGINE ]
            </span>
            <h2 className={`font-syne text-2xl font-bold uppercase tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} mt-1`}>
              How Fikare Teseto Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono-code">
            <div className={`${isDaylight ? 'bg-white border-[#cbd5e1] shadow-sm' : 'bg-[#111114]'} p-6 border-l-4 border-l-[#ff3e00] border space-y-2 rounded-r-lg`}>
              <span className={`text-[0.65rem] ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50'} uppercase tracking-widest`}>Step 01</span>
              <h4 className={`font-syne text-base font-bold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Discover & Review</h4>
              <p className={`text-[0.68rem] ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/60'} uppercase leading-relaxed`}>
                Browse talent by department, evaluate 4K showreels, and verify owned camera/sound packages.
              </p>
            </div>

            <div className={`${isDaylight ? 'bg-white border-[#cbd5e1] shadow-sm' : 'bg-[#111114]'} p-6 border-l-4 ${isDaylight ? 'border-l-slate-400' : 'border-l-[#f8f7f4]/30'} border space-y-2 rounded-r-lg`}>
              <span className={`text-[0.65rem] ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50'} uppercase tracking-widest`}>Step 02</span>
              <h4 className={`font-syne text-base font-bold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Send Direct Inquiry</h4>
              <p className={`text-[0.68rem] ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/60'} uppercase leading-relaxed`}>
                Submit production dates, location, offered day rates, and shoot requirements directly to talent.
              </p>
            </div>

            <div className={`${isDaylight ? 'bg-white border-[#cbd5e1] shadow-sm' : 'bg-[#111114]'} p-6 border-l-4 ${isDaylight ? 'border-l-slate-400' : 'border-l-[#f8f7f4]/30'} border space-y-2 rounded-r-lg`}>
              <span className={`text-[0.65rem] ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50'} uppercase tracking-widest`}>Step 03</span>
              <h4 className={`font-syne text-base font-bold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Confirm & Execute</h4>
              <p className={`text-[0.68rem] ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/60'} uppercase leading-relaxed`}>
                Finalize booking, upload production assets to media vault uploader, and hit the set ready to shoot.
              </p>
            </div>
          </div>
        </section>

        {/* AGENCY & CLIENT PRICING OPTIONS */}
        <PricingSection
          currentUser={currentUser}
          onNavigate={onNavigate}
          onOpenAuth={onOpenAuth}
          isDaylight={isDaylight}
        />

        {/* QUICK ACCESS CARDS */}
        <section className={`${isDaylight ? 'bg-white border-[#cbd5e1] text-[#0f172a] shadow-sm' : 'bg-[#111114] border-[#f8f7f4]/10 text-[#f8f7f4]'} border p-8 space-y-6 font-mono-code text-center sm:text-left rounded-xl`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-1">
                Get Started
              </span>
              <h3 className={`font-syne text-2xl font-bold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                Ready to Assemble Your Crew?
              </h3>
              <p className={`text-[0.7rem] ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/60'} uppercase mt-1`}>
                Explore available talent or post your shoot requirements in under 2 minutes.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                onClick={() => onNavigate('marketplace')}
                className={`px-6 py-3 ${isDaylight ? 'bg-[#ff3e00] hover:bg-[#e03500] text-white' : 'bg-[#f8f7f4] hover:bg-white text-[#0b0b0d]'} font-bold uppercase text-[0.7rem] tracking-widest cursor-pointer transition-colors shadow-sm`}
              >
                Marketplace
              </button>
              <button
                onClick={() => onNavigate('directory')}
                className={`px-6 py-3 ${isDaylight ? 'bg-slate-100 hover:bg-slate-200 text-[#0f172a] border-[#cbd5e1]' : 'bg-[#0b0b0d] hover:bg-[#18181c] text-[#f8f7f4] border-[#f8f7f4]/20'} border font-bold uppercase text-[0.7rem] tracking-widest cursor-pointer transition-colors`}
              >
                Talent Directory
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

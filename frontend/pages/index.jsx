// File: /frontend/pages/index.jsx
// Public Landing Page Component for Film & Media Talent Marketplace

import React, { useState, useEffect } from 'react';
import { Camera, Clapperboard, Mic, Scissors, Sparkles, Radio } from 'lucide-react';
import bgImageUrl from '../../src/assets/images/cinematic_film_set_1785254501370.jpg';
import { PricingSection } from '../../src/components/PricingSection';
import { getApiEndpoint } from '../../src/services/api';

export default function HomePage({ onNavigate, onSelectTalent, currentUser }) {
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredTalents, setFeaturedTalents] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top featured talent and recent job opportunities
    Promise.all([
      fetch(getApiEndpoint('/talents?limit=4')).then(res => res.json()).catch(() => ({ talents: [] })),
      fetch(getApiEndpoint('/jobs')).then(res => res.json()).catch(() => ({ jobs: [] }))
    ]).then(([talentData, jobData]) => {
      setFeaturedTalents(talentData.talents || []);
      
      let serverJobs = jobData.jobs || [];
      try {
        const localJobsStr = localStorage.getItem('cinecraft_local_jobs');
        if (localJobsStr) {
          const localJobs = JSON.parse(localJobsStr);
          // Combine local jobs and server jobs, eliminating duplicates by ID
          const combined = [...localJobs, ...serverJobs];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
          serverJobs = unique;
        }
      } catch (e) {}

      setRecentJobs(serverJobs.slice(0, 5));
      setLoading(false);
    }).catch(err => {
      console.error('Landing page data fetch error:', err);
      setLoading(false);
    });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('directory', { category: searchCategory, query: searchQuery });
    }
  };

  const categoriesList = [
    { id: 'cinematography', title: 'Cinematography', icon: Camera, count: '840+ DPs & Steadicam', desc: 'ARRI, RED, Anamorphic, Tracking Rigs' },
    { id: 'directing', title: 'Directing', icon: Clapperboard, count: '420+ Directors', desc: 'Commercials, Features, Music Videos' },
    { id: 'sound_audio', title: 'Location Sound & Audio', icon: Mic, count: '510+ Sound Mixers', desc: 'Multitrack Recorders, Wireless Lavs, Boom' },
    { id: 'editing_post', title: 'Editing & Color Grading', icon: Scissors, count: '630+ Post Artists', desc: 'DaVinci Resolve, Premiere Pro, Avid' },
    { id: 'vfx_animation', title: 'Virtual Production & VFX', icon: Sparkles, count: '290+ Specialists', desc: 'Unreal Engine ICVFX, CGI, Nuke' },
    { id: 'drone_aerial', title: 'Drone & Aerial Cinematography', icon: Radio, count: '180+ Licensed Pilots', desc: 'FPV Heavy-Lift Rigs, FAA Part 107' },
  ];

  const currentBgImage = bgImageUrl || '/images/cinematic_film_set_1785254501370.jpg';

  return (
    <div 
      className="min-h-screen daylight-bg bg-[#181a20] text-[#f8f7f4] font-['Inter',sans-serif] selection:bg-[#ff3e00] selection:text-[#0b0b0d] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(to bottom, var(--bg-overlay, rgba(24, 26, 32, 0.82)), var(--bg-overlay-bottom, rgba(24, 26, 32, 0.94))), url('${currentBgImage}')`
      }}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* FULL WIDTH HERO & SEARCH SECTION */}
        <div className="daylight-card bg-[#20232c] border border-[#f8f7f4]/15 p-6 sm:p-10 space-y-8 font-mono-code transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* HERO TITLE & TEXT */}
            <div className="lg:col-span-7 space-y-4">
              <h1 className="font-syne text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase leading-[1.08] sm:leading-[0.95] tracking-tight break-words">
                Hire Premier <br className="hidden sm:inline" />
                <span className="text-[#ff3e00]">Film Talent.</span>
              </h1>
              <p className="text-xs sm:text-sm text-inherit opacity-80 uppercase leading-relaxed tracking-wider max-w-2xl">
                Bridges world-class DPs, Sound Recordists, Colorists, and VFX Supervisors with leading studios and agencies.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-[0.7rem]">
                <button
                  onClick={() => onNavigate && onNavigate('jobs_create')}
                  className="px-6 py-3.5 bg-[#ff3e00] hover:bg-[#e03500] text-white font-bold uppercase tracking-widest cursor-pointer transition-colors shadow-sm"
                >
                  Post Production Job
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('talent_dashboard')}
                  className="px-6 py-3.5 bg-transparent hover:bg-white/10 border border-current font-bold uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Join as Creative
                </button>
              </div>
            </div>

            {/* QUICK SEARCH FORM */}
            <div className="lg:col-span-5 daylight-card bg-[#181a20] p-6 border border-[#f8f7f4]/15 space-y-4">
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1.5">
                    Department
                  </label>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full bg-[#111114] text-[#f8f7f4] p-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  >
                    <option value="all">All Production Departments</option>
                    <option value="cinematography">Cinematography & Camera</option>
                    <option value="directing">Directing</option>
                    <option value="sound_audio">Location Sound & Audio</option>
                    <option value="editing_post">Post-Production & Color</option>
                    <option value="vfx_animation">VFX & Virtual Production</option>
                    <option value="drone_aerial">Drone & Aerial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1.5">
                    Keywords / Gear
                  </label>
                  <input
                    type="text"
                    placeholder="ARRI, STEADICAM..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#111114] text-[#f8f7f4] placeholder-[#f8f7f4]/30 p-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#ff3e00] hover:bg-[#e03700] text-white font-bold uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Search Crew Directory
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="space-y-12">
          
          {/* FEATURED KEY CREW SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#f8f7f4]/10 pb-3">
              <span className="font-mono-code text-[0.7rem] uppercase tracking-widest text-[#f8f7f4]/70">
                Featured Key Crew // Vault v4.0
              </span>
              <button
                onClick={() => onNavigate && onNavigate('directory')}
                className="font-mono-code text-[0.7rem] uppercase tracking-widest text-[#ff3e00] hover:underline cursor-pointer"
              >
                View All Talent &rarr;
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-64 bg-[#111114] border border-[#f8f7f4]/10 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTalents.slice(0, 6).map((talent) => (
                  <div
                    key={talent.id}
                    onClick={() => onSelectTalent ? onSelectTalent(talent.id) : (onNavigate && onNavigate('talent_detail', { id: talent.id }))}
                    className="border border-[#f8f7f4]/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#f8f7f4]/30 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 overflow-hidden relative bg-[#111114]">
                        <img
                          src={talent.featured_reel?.thumbnail_url || talent.avatar_url}
                          alt={talent.full_name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-[#0b0b0d]/90 px-2 py-0.5 border border-[#f8f7f4]/20 font-mono-code text-[0.6rem] font-bold text-[#ff3e00]">
                          ★ {talent.rating}
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-mono-code text-xs font-bold uppercase text-[#f8f7f4] group-hover:text-[#ff3e00] transition-colors">
                            {talent.full_name}
                          </h3>
                        </div>
                        <p className="font-mono-code text-[0.6rem] text-[#f8f7f4]/60 uppercase">
                          {talent.tagline || talent.category}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-[#f8f7f4]/10 mt-3 flex items-center justify-between font-mono-code text-[0.65rem] text-[#f8f7f4]/80">
                      <span className="font-bold text-[#f8f7f4]">${talent.day_rate}/DAY</span>
                      <span className="text-[#f8f7f4] group-hover:translate-x-1 transition-transform">
                        View Reel &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#f8f7f4]/10 border border-[#f8f7f4]/10">
            <div className="daylight-card bg-[#20232c] p-5 space-y-1">
              <span className="font-mono-code text-[0.6rem] uppercase tracking-widest text-[#f8f7f4]/60 block">Budgets</span>
              <span className="font-syne text-2xl sm:text-3xl font-extrabold">$18M+</span>
            </div>
            <div className="daylight-card bg-[#20232c] p-5 space-y-1">
              <span className="font-mono-code text-[0.6rem] uppercase tracking-widest text-[#f8f7f4]/60 block">Talent</span>
              <span className="font-syne text-2xl sm:text-3xl font-extrabold">3,200+</span>
            </div>
            <div className="daylight-card bg-[#20232c] p-5 space-y-1">
              <span className="font-mono-code text-[0.6rem] uppercase tracking-widest text-[#f8f7f4]/60 block">Fulfillment</span>
              <span className="font-syne text-2xl sm:text-3xl font-extrabold text-[#ff3e00]">99.2%</span>
            </div>
            <div className="daylight-card bg-[#20232c] p-5 space-y-1">
              <span className="font-mono-code text-[0.6rem] uppercase tracking-widest text-[#f8f7f4]/60 block">Agencies</span>
              <span className="font-syne text-2xl sm:text-3xl font-extrabold">1,400+</span>
            </div>
          </div>

          {/* PRODUCTION DEPARTMENTS GRID */}
          <div className="space-y-6 pt-4">
            <div className="border-b border-[#f8f7f4]/10 pb-3">
              <span className="font-mono-code text-[0.7rem] uppercase tracking-widest text-[#f8f7f4]/70">
                Departments Directory
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoriesList.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => onNavigate && onNavigate('directory', { category: cat.id })}
                    className="p-5 border border-[#f8f7f4]/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#ff3e00]/50 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="p-2.5 bg-[#ff3e00]/10 border border-[#ff3e00]/25 rounded-lg text-[#ff3e00]">
                        <IconComponent className="w-6 h-6 text-[#ff3e00] group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-mono-code text-[0.6rem] text-[#ff3e00] uppercase font-bold border border-[#ff3e00]/30 px-2 py-0.5">
                        {cat.count}
                      </span>
                    </div>
                    <h3 className="font-syne text-lg font-bold uppercase text-[#f8f7f4] group-hover:text-[#ff3e00] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="font-mono-code text-[0.65rem] text-[#f8f7f4]/60 uppercase tracking-wider mt-1">
                      {cat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECENT PRODUCTION OPPORTUNITIES */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-[#f8f7f4]/10 pb-3">
              <span className="font-mono-code text-[0.7rem] uppercase tracking-widest text-[#f8f7f4]/70">
                Recent Production Opportunities
              </span>
              <button
                onClick={() => onNavigate && onNavigate('jobs_create')}
                className="font-mono-code text-[0.7rem] uppercase tracking-widest text-[#ff3e00] hover:underline cursor-pointer"
              >
                Post Call for Crew &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 border border-[#f8f7f4]/10 bg-white/[0.02] hover:border-[#f8f7f4]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-code text-[0.6rem] px-2 py-0.5 bg-[#ff3e00]/20 text-[#ff3e00] font-bold border border-[#ff3e00]/30 uppercase">
                        {job.department}
                      </span>
                      <span className="font-mono-code text-[0.65rem] text-[#f8f7f4]/50 uppercase">
                        {job.project_type} • {job.location}
                      </span>
                    </div>
                    <h4 className="font-mono-code text-sm font-bold uppercase text-[#f8f7f4]">{job.title}</h4>
                    <p className="font-mono-code text-[0.65rem] text-[#f8f7f4]/60 line-clamp-1">{job.shoot_dates}</p>
                  </div>

                  <div className="flex items-center gap-4 self-start sm:self-auto">
                    <span className="font-mono-code text-xs font-bold text-[#f8f7f4]">
                      ${job.budget_min} - ${job.budget_max}
                    </span>
                    <button
                      onClick={() => onNavigate && onNavigate('directory')}
                      className="px-4 py-2 bg-transparent hover:bg-[#f8f7f4] hover:text-[#0b0b0d] text-[#f8f7f4] border border-[#f8f7f4]/20 font-mono-code text-[0.65rem] font-bold uppercase transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AGENCY & CLIENT ACCESS PRICING OPTIONS */}
          <PricingSection
            currentUser={currentUser}
            onNavigate={onNavigate}
          />

        </div>
      </div>
    </div>
  );
}


// File: /frontend/pages/index.js
// Public Landing Page Component for Film & Media Talent Marketplace

import React, { useState, useEffect } from 'react';

export default function HomePage({ onNavigate, onSelectTalent, currentUser }) {
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredTalents, setFeaturedTalents] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top featured talent and recent job opportunities
    Promise.all([
      fetch('/api/talents?limit=4').then(res => res.json()),
      fetch('/api/jobs').then(res => res.json())
    ]).then(([talentData, jobData]) => {
      setFeaturedTalents(talentData.talents || []);
      setRecentJobs((jobData.jobs || []).slice(0, 3));
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
    { id: 'cinematography', title: 'Cinematography', icon: '🎥', count: '840+ DPs & Steadicam', desc: 'ARRI, RED, Anamorphic, Tracking Rigs' },
    { id: 'directing', title: 'Directing', icon: '🎬', count: '420+ Directors', desc: 'Commercials, Features, Music Videos' },
    { id: 'sound_audio', title: 'Location Sound & Audio', icon: '🎙️', count: '510+ Sound Mixers', desc: 'Multitrack Recorders, Wireless Lavs, Boom' },
    { id: 'editing_post', title: 'Editing & Color Grading', icon: '✂️', count: '630+ Post Artists', desc: 'DaVinci Resolve, Premiere Pro, Avid' },
    { id: 'vfx_animation', title: 'Virtual Production & VFX', icon: '🪄', count: '290+ Specialists', desc: 'Unreal Engine ICVFX, CGI, Nuke' },
    { id: 'drone_aerial', title: 'Drone & Aerial Cinematography', icon: '🚁', count: '180+ Licensed Pilots', desc: 'FPV Heavy-Lift Rigs, FAA Part 107' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-slate-800 bg-radial from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            The Premier Film & Commercial Crew Network
          </div>

          <h1 className="text-[45px] font-extrabold tracking-tight text-white leading-[1.1] mb-6" style={{ fontSize: '45px' }}>
            Hire Premier Film Talent. <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
              Bring Cinematic Visions to Life.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed mb-10">
            CineCraft bridges world-class Directors of Photography, Sound Recordists, Colorists, and VFX Supervisors with leading film studios, commercial ad agencies, and indie directors.
          </p>

          {/* QUICK SEARCH FORM */}
          <form onSubmit={handleSearchSubmit} className="bg-slate-900/90 p-3 sm:p-4 rounded-2xl border border-slate-700/80 shadow-2xl max-w-4xl backdrop-blur-md mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-slate-400 mb-1 ml-2">Department / Role</label>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-amber-400 text-sm"
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

              <div className="sm:col-span-5">
                <label className="block text-xs font-medium text-slate-400 mb-1 ml-2">Keywords, Gear, or Skills</label>
                <input
                  type="text"
                  placeholder="e.g. ARRI Alexa 35, Steadicam, DaVinci..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div className="sm:col-span-3 pt-4 sm:pt-0">
                <button
                  type="submit"
                  className="w-full h-[46px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Crew
                </button>
              </div>
            </div>
          </form>

          {/* PRIMARY CALL TO ACTIONS */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate && onNavigate('jobs_create')}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Post Production Job</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('talent_dashboard')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Join as Creative Talent</span>
            </button>
          </div>
        </div>
      </section>

      {/* METRICS & STATS STRIP */}
      <section className="py-8 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <p className="text-3xl font-extrabold text-amber-400">$18M+</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Production Budgets Booked</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-extrabold text-amber-400">3,200+</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Vetted Creative Talent</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-extrabold text-amber-400">99.2%</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">On-Set Fulfillment Rate</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-extrabold text-amber-400">1,400+</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Studios & Ad Agencies</p>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Browse by Department</h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">Specialized crew verified by work experience, union status, and gear inventory.</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('directory')}
            className="mt-4 md:mt-0 text-amber-400 hover:text-amber-300 font-semibold text-sm flex items-center gap-1 cursor-pointer"
          >
            Explore All Departments &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate && onNavigate('directory', { category: cat.id })}
              className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition-all cursor-pointer hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                  {cat.count}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{cat.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOP FEATURED TALENT */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Featured Industry Talent</h2>
              <p className="text-slate-400 mt-2 text-sm sm:text-base">Top rated key crew with verified showreels and active availability.</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('directory')}
              className="mt-4 md:mt-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 text-sm font-medium transition-all cursor-pointer"
            >
              View Full Talent Directory
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-80 bg-slate-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTalents.map((talent) => (
                <div
                  key={talent.id}
                  onClick={() => onSelectTalent ? onSelectTalent(talent.id) : (onNavigate && onNavigate('talent_detail', { id: talent.id }))}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden group transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-slate-800 overflow-hidden">
                    <img
                      src={talent.featured_reel?.thumbnail_url || talent.avatar_url}
                      alt={talent.full_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                    <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-md">
                      ${talent.day_rate}/day
                    </span>
                    <span className="absolute bottom-3 left-3 text-xs font-medium text-slate-300 flex items-center gap-1">
                      📍 {talent.location}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{talent.full_name}</h3>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <span>★</span>
                          <span>{talent.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-amber-400/90 mb-3">{talent.tagline}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">{talent.bio}</p>
                    </div>

                    <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {talent.union_status ? talent.union_status.replace('_', ' ') : 'Non-Union'}
                      </span>
                      <span className="text-xs text-amber-400 font-semibold group-hover:underline">
                        View Reel & Profile &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RECENT PRODUCTION OPPORTUNITIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Recent Production Calls</h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">Active job postings from verified film studios and agencies.</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('jobs_create')}
            className="mt-4 md:mt-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-all cursor-pointer"
          >
            Post a Call for Crew
          </button>
        </div>

        <div className="space-y-4">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all"
            >
              <div className="flex items-start gap-4">
                <img
                  src={job.client_logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800'}
                  alt={job.client_name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-amber-400 uppercase tracking-wider">
                      {job.department}
                    </span>
                    <span className="text-xs text-slate-400">
                      {job.project_type} &bull; {job.location}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{job.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mt-1">{job.description}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:self-center shrink-0">
                <div className="text-left sm:text-right">
                  <p className="text-lg font-bold text-amber-400">
                    ${job.budget_min} - ${job.budget_max} <span className="text-xs font-normal text-slate-400">/{job.budget_type}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{job.shoot_dates}</p>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('directory')}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
                >
                  Apply for Role
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

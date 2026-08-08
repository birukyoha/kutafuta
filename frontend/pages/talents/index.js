// File: /frontend/pages/talents/index.js
// Talent Directory Search Page Component with Sidebar Filters for Film & Media Marketplace

import React, { useState, useEffect } from 'react';

export default function TalentDirectoryPage({ initialCategory = 'all', initialQuery = '', onSelectTalent }) {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total_items: 0, total_pages: 1, current_page: 1 });

  // Filter States
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [location, setLocation] = useState('all');
  const [unionStatus, setUnionStatus] = useState('all');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync props if initial state changes
  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
    if (initialQuery) setSearchQuery(initialQuery);
  }, [initialCategory, initialQuery]);

  // Fetch Talent Listings whenever filters change
  useEffect(() => {
    fetchTalents();
  }, [category, location, unionStatus, minRate, maxRate, isAvailable, currentPage]);

  const fetchTalents = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (searchQuery) params.append('query', searchQuery);
    if (location && location !== 'all') params.append('location', location);
    if (unionStatus && unionStatus !== 'all') params.append('union_status', unionStatus);
    if (minRate) params.append('min_rate', minRate);
    if (maxRate) params.append('max_rate', maxRate);
    if (isAvailable) params.append('is_available', 'true');
    params.append('page', currentPage.toString());
    params.append('limit', '9');

    fetch(`/api/talents?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setTalents(data.talents || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Directory fetch error:', err);
        setLoading(false);
      });
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTalents();
  };

  const resetFilters = () => {
    setCategory('all');
    setSearchQuery('');
    setLocation('all');
    setUnionStatus('all');
    setMinRate('');
    setMaxRate('');
    setIsAvailable(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Film & Media Talent Directory
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Discover and hire verified key crew, DPs, sound mixers, editors, and virtual production leads.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR FILTERS PANEL */}
          <aside className="lg:col-span-3 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-6 h-fit sticky top-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter Talent
              </h2>
              <button
                onClick={resetFilters}
                className="text-xs text-amber-400 hover:underline font-medium cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Search Keywords</label>
              <form onSubmit={handleSearchFormSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Gear, name, or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                >
                  🔍
                </button>
              </form>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Production Department</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-800 text-white rounded-xl px-3 py-2.5 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Departments</option>
                <option value="cinematography">Cinematography & Camera</option>
                <option value="directing">Directing</option>
                <option value="sound_audio">Location Sound & Audio</option>
                <option value="editing_post">Post-Production & Color</option>
                <option value="vfx_animation">VFX & Virtual Production</option>
                <option value="drone_aerial">Drone & Aerial</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Location Hub</label>
              <select
                value={location}
                onChange={(e) => { setLocation(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-800 text-white rounded-xl px-3 py-2.5 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Locations</option>
                <option value="Los Angeles">Los Angeles, CA</option>
                <option value="New York">New York, NY</option>
                <option value="Atlanta">Atlanta, GA</option>
                <option value="San Francisco">San Francisco, CA</option>
              </select>
            </div>

            {/* Union Status Filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Union Affiliation</label>
              <select
                value={unionStatus}
                onChange={(e) => { setUnionStatus(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-800 text-white rounded-xl px-3 py-2.5 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
              >
                <option value="all">Any Affiliation</option>
                <option value="iatse_600">IATSE Local 600 (Camera)</option>
                <option value="dga">DGA (Directors Guild)</option>
                <option value="sag_aftra">SAG-AFTRA</option>
                <option value="non_union">Non-Union / Independent</option>
              </select>
            </div>

            {/* Day Rate Range Filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Day Rate Range ($)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minRate}
                  onChange={(e) => { setMinRate(e.target.value); setCurrentPage(1); }}
                  className="w-1/2 bg-slate-800 text-white placeholder-slate-500 rounded-xl px-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
                />
                <span className="text-slate-500 text-sm">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxRate}
                  onChange={(e) => { setMaxRate(e.target.value); setCurrentPage(1); }}
                  className="w-1/2 bg-slate-800 text-white placeholder-slate-500 rounded-xl px-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => { setIsAvailable(e.target.checked); setCurrentPage(1); }}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-400"
                />
                <span className="text-sm font-medium text-slate-300">Show Available Immediately</span>
              </label>
            </div>
          </aside>

          {/* MAIN TALENT CARD GRID */}
          <main className="lg:col-span-9">
            {/* RESULTS HEADER */}
            <div className="flex items-center justify-between mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-300">
                Showing <span className="font-bold text-amber-400">{talents.length}</span> of <span className="font-bold text-white">{pagination.total_items}</span> verified creative talents
              </p>
              <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                Sorted by Recommended
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="h-96 bg-slate-900 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : talents.length === 0 ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center my-8">
                <p className="text-4xl mb-3">🎬</p>
                <h3 className="text-xl font-bold text-white">No Talent Found Matching Filters</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                  Try adjusting your search keywords, day rate range, or department categories to find available crew.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-all cursor-pointer"
                >
                  Reset Filter Criteria
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {talents.map((talent) => (
                  <div
                    key={talent.id}
                    onClick={() => onSelectTalent && onSelectTalent(talent.id)}
                    className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* CARD REEL / AVATAR PREVIEW */}
                      <div className="relative h-44 bg-slate-800 overflow-hidden">
                        <img
                          src={talent.featured_reel?.thumbnail_url || talent.avatar_url}
                          alt={talent.full_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        
                        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-slate-700">
                          ${talent.day_rate} <span className="font-normal text-[10px] text-slate-400">/day</span>
                        </div>

                        {talent.is_available && (
                          <span className="absolute top-3 right-3 bg-emerald-500/90 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            Available
                          </span>
                        )}

                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <img
                            src={talent.avatar_url}
                            alt={talent.full_name}
                            className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover shadow-md"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-white leading-tight group-hover:text-amber-400 transition-colors">{talent.full_name}</h3>
                            <p className="text-[11px] text-slate-300">📍 {talent.location}</p>
                          </div>
                        </div>
                      </div>

                      {/* CARD DETAILS */}
                      <div className="p-4 space-y-3">
                        <p className="text-xs font-semibold text-amber-400 line-clamp-1">{talent.tagline}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{talent.bio}</p>

                        {/* EQUIPMENT / SKILL HIGHLIGHT */}
                        {talent.equipment_list && (
                          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Key Gear / Kit</p>
                            <p className="text-[11px] text-slate-300 line-clamp-1">{talent.equipment_list}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* FOOTER ACTION */}
                    <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <span>★</span>
                        <span>{talent.rating}</span>
                        <span className="text-[10px] text-slate-500 font-normal">({talent.review_count || 12})</span>
                      </div>
                      <span className="text-xs text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                        View Profile & Reel &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION CONTROLS */}
            {pagination.total_pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-40 rounded-xl text-xs font-semibold text-white cursor-pointer"
                >
                  &larr; Previous Page
                </button>
                <span className="text-xs text-slate-400 font-medium">
                  Page {pagination.current_page} of {pagination.total_pages}
                </span>
                <button
                  disabled={currentPage === pagination.total_pages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-40 rounded-xl text-xs font-semibold text-white cursor-pointer"
                >
                  Next Page &rarr;
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

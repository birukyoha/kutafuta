import React, { useState, useEffect } from 'react';
import bgImageUrl from '../../../src/assets/images/cinematic_film_set_1785254501370.jpg';
import { getApiEndpoint } from '../../../src/services/api';

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

    fetch(getApiEndpoint(`/talents?${params.toString()}`))
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

  const currentBgImage = bgImageUrl || '/images/cinematic_film_set_1785254501370.jpg';

  return (
    <div 
      className="min-h-screen daylight-bg bg-[#181a20] text-[#f8f7f4] font-['Inter',sans-serif] selection:bg-[#ff3e00] selection:text-[#0b0b0d] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(to bottom, var(--bg-overlay, rgba(24, 26, 32, 0.82)), var(--bg-overlay-bottom, rgba(24, 26, 32, 0.94))), url('${currentBgImage}')`
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* PAGE HEADER */}
        <div className="border-b border-[#f8f7f4]/10 pb-6">
          <span className="font-mono-code text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-1">
            Verified Roster Vault // CineCraft
          </span>
          <h1 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#f8f7f4] uppercase tracking-tight">
            Film & Media Talent Directory
          </h1>
          <p className="font-mono-code text-[0.7rem] text-[#f8f7f4]/60 uppercase tracking-wider mt-1">
            Discover and hire vetted key crew, DPs, sound mixers, editors, and virtual production leads.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR FILTERS PANEL */}
          <aside className="lg:col-span-3 bg-[#111114] p-5 border border-[#f8f7f4]/10 space-y-6 h-fit sticky top-20 font-mono-code">
            <div className="flex items-center justify-between pb-3 border-b border-[#f8f7f4]/10">
              <h2 className="text-[0.75rem] font-bold uppercase tracking-wider text-[#f8f7f4]">
                Filter Roster
              </h2>
              <button
                onClick={resetFilters}
                className="text-[0.65rem] text-[#ff3e00] hover:underline font-bold uppercase tracking-wider cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Search Keywords</label>
              <form onSubmit={handleSearchFormSubmit} className="relative">
                <input
                  type="text"
                  placeholder="GEAR, NAME, SKILL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 px-3 py-2 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                />
              </form>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Department</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
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
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Location Hub</label>
              <select
                value={location}
                onChange={(e) => { setLocation(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
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
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Union Affiliation</label>
              <select
                value={unionStatus}
                onChange={(e) => { setUnionStatus(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
              >
                <option value="all">Any Affiliation</option>
                <option value="iatse_600">IATSE Local 600</option>
                <option value="dga">DGA (Directors Guild)</option>
                <option value="sag_aftra">SAG-AFTRA</option>
                <option value="non_union">Non-Union / Independent</option>
              </select>
            </div>

            {/* Day Rate Range Filter */}
            <div>
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Day Rate Range ($)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="MIN"
                  value={minRate}
                  onChange={(e) => { setMinRate(e.target.value); setCurrentPage(1); }}
                  className="w-1/2 bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 px-2.5 py-1.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                />
                <span className="text-[#f8f7f4]/40 text-xs">-</span>
                <input
                  type="number"
                  placeholder="MAX"
                  value={maxRate}
                  onChange={(e) => { setMaxRate(e.target.value); setCurrentPage(1); }}
                  className="w-1/2 bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 px-2.5 py-1.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                />
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="pt-2 border-t border-[#f8f7f4]/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => { setIsAvailable(e.target.checked); setCurrentPage(1); }}
                  className="w-3.5 h-3.5 bg-[#0b0b0d] border-[#f8f7f4]/20 text-[#ff3e00] focus:ring-0"
                />
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#f8f7f4]/80">Available Immediately</span>
              </label>
            </div>
          </aside>

          {/* MAIN TALENT CARD GRID */}
          <main className="lg:col-span-9 space-y-6">
            {/* RESULTS HEADER */}
            <div className="flex items-center justify-between bg-[#111114] p-4 border border-[#f8f7f4]/10 font-mono-code text-[0.7rem]">
              <p className="text-[#f8f7f4]/70 uppercase">
                Showing <span className="text-[#ff3e00] font-bold">{talents.length}</span> of <span className="text-[#f8f7f4] font-bold">{pagination.total_items}</span> Verified Talents
              </p>
              <span className="text-[0.65rem] text-[#f8f7f4]/60 uppercase">
                Sorted by Recommended
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="h-80 bg-[#111114] border border-[#f8f7f4]/10 animate-pulse" />
                ))}
              </div>
            ) : talents.length === 0 ? (
              <div className="bg-[#111114] border border-[#f8f7f4]/10 p-12 text-center my-8 font-mono-code space-y-3">
                <p className="text-3xl">🎬</p>
                <h3 className="text-sm font-bold text-[#f8f7f4] uppercase">No Talent Found Matching Filters</h3>
                <p className="text-[0.65rem] text-[#f8f7f4]/60 uppercase max-w-md mx-auto">
                  Try adjusting your search keywords, day rate range, or department categories.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-5 py-2.5 bg-[#f8f7f4] text-[#0b0b0d] font-bold uppercase text-[0.65rem] tracking-wider cursor-pointer hover:bg-white"
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
                    className="bg-white/[0.02] border border-[#f8f7f4]/10 hover:border-[#f8f7f4]/30 group transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* CARD REEL / AVATAR PREVIEW */}
                      <div className="relative h-44 bg-[#111114] overflow-hidden">
                        <img
                          src={talent.featured_reel?.thumbnail_url || talent.avatar_url}
                          alt={talent.full_name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-[#0b0b0d]/90 font-mono-code text-[0.6rem] font-bold uppercase text-[#f8f7f4] px-2 py-0.5 border border-[#f8f7f4]/20">
                          ${talent.day_rate}/DAY
                        </div>

                        {talent.is_available && (
                          <span className="absolute top-2 right-2 bg-[#00ff00]/20 border border-[#00ff00]/40 text-[#00ff00] font-mono-code text-[0.6rem] font-bold uppercase px-2 py-0.5">
                            Available
                          </span>
                        )}
                      </div>

                      {/* CARD DETAILS */}
                      <div className="p-4 space-y-2 font-mono-code">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xs font-bold uppercase text-[#f8f7f4] group-hover:text-[#ff3e00] transition-colors">{talent.full_name}</h3>
                          <span className="text-[#ff3e00] text-[0.65rem] font-bold">★ {talent.rating}</span>
                        </div>
                        <p className="text-[0.6rem] text-[#f8f7f4]/60 uppercase line-clamp-1">{talent.tagline || talent.category}</p>
                        <p className="text-[0.65rem] text-[#f8f7f4]/80 line-clamp-2 leading-relaxed">{talent.bio}</p>
                      </div>
                    </div>

                    {/* FOOTER ACTION */}
                    <div className="p-4 pt-0 mt-2 border-t border-[#f8f7f4]/10 pt-3 flex items-center justify-between font-mono-code text-[0.65rem]">
                      <span className="text-[#f8f7f4]/50 uppercase">📍 {talent.location}</span>
                      <span className="text-[#f8f7f4] group-hover:translate-x-1 transition-transform">
                        View Profile &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION CONTROLS */}
            {pagination.total_pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4 font-mono-code">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2 border border-[#f8f7f4]/20 hover:border-[#f8f7f4] disabled:opacity-30 text-[0.65rem] font-bold uppercase text-[#f8f7f4] cursor-pointer"
                >
                  &larr; Prev
                </button>
                <span className="text-[0.65rem] text-[#f8f7f4]/60 uppercase">
                  Page {pagination.current_page} of {pagination.total_pages}
                </span>
                <button
                  disabled={currentPage === pagination.total_pages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
                  className="px-4 py-2 border border-[#f8f7f4]/20 hover:border-[#f8f7f4] disabled:opacity-30 text-[0.65rem] font-bold uppercase text-[#f8f7f4] cursor-pointer"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


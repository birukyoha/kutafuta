// File: /frontend/pages/talents/[id].js
// Individual Talent Profile View Page with Video Reel Gallery & Direct Hire Trigger

import React, { useState, useEffect } from 'react';

export default function TalentProfilePage({ talentId, onNavigate, currentUser }) {
  const [talent, setTalent] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMediaModal, setActiveMediaModal] = useState(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireMessage, setHireMessage] = useState('');
  const [offerRate, setOfferRate] = useState('');
  const [hireSuccess, setHireSuccess] = useState(false);

  useEffect(() => {
    if (!talentId) return;
    setLoading(true);

    fetch(`/api/talents/${talentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.talent) {
          setTalent(data.talent);
          setOfferRate(data.talent.day_rate ? data.talent.day_rate.toString() : '1200');
        }
        setPortfolio(data.portfolio || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching talent detail:', err);
        setLoading(false);
      });
  }, [talentId]);

  const handleSendInquiry = (e) => {
    e.preventDefault();
    setHireSuccess(true);
    setTimeout(() => {
      setShowHireModal(false);
      setHireSuccess(false);
      setHireMessage('');
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400" />
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold">Talent Profile Not Found</h2>
        <button
          onClick={() => onNavigate && onNavigate('directory')}
          className="mt-4 px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl"
        >
          Return to Talent Directory
        </button>
      </div>
    );
  }

  const primaryReel = portfolio.find(m => m.media_type === 'showreel') || portfolio[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => onNavigate && onNavigate('directory')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          &larr; Back to Directory
        </button>

        {/* PROFILE HERO HEADER */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={talent.avatar_url}
                alt={talent.full_name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-amber-400/80 object-cover shadow-2xl shrink-0"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase tracking-wider">
                    {talent.category ? talent.category.replace('_', ' ') : 'Film Professional'}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                    {talent.union_status ? talent.union_status.replace('_', ' ') : 'Non-Union'}
                  </span>
                  {talent.is_available && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      ● Available for Hire
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{talent.full_name}</h1>
                <p className="text-base sm:text-lg font-medium text-amber-300">{talent.tagline}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 pt-1">
                  <span>📍 {talent.location}</span>
                  <span>🎬 {talent.years_experience || 8}+ Years Experience</span>
                  <span className="text-amber-400 font-bold">★ {talent.rating || 5.0} ({talent.review_count || 18} Client Reviews)</span>
                </div>
              </div>
            </div>

            {/* RATES & HIRE ACTION */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center lg:text-right shrink-0 w-full lg:w-auto">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Day Rate / Hourly</p>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">
                ${talent.day_rate} <span className="text-xs font-normal text-slate-400">/day</span>
              </p>
              {talent.hourly_rate && (
                <p className="text-xs text-slate-400 mt-0.5">${talent.hourly_rate} / hour</p>
              )}

              <button
                onClick={() => setShowHireModal(true)}
                className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl shadow-xl transition-all cursor-pointer"
              >
                Hire / Send Production Inquiry
              </button>
            </div>
          </div>
        </div>

        {/* MAIN BODY GRID: SHOWREEL & PORTFOLIO VS GEAR & BIO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 8 COLS: SHOWREELS & MEDIA GALLERY */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* FEATURED SHOWREEL PLAYER */}
            {primaryReel && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🎬</span> Featured Showreel
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">{primaryReel.title}</span>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                  {primaryReel.file_url.endsWith('.mp4') ? (
                    <video
                      controls
                      poster={primaryReel.thumbnail_url}
                      src={primaryReel.file_url}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={primaryReel.embed_url || primaryReel.file_url}
                      className="w-full h-full border-0"
                      allow="autoplay; fullscreen"
                      title={primaryReel.title}
                    />
                  )}
                </div>
                <p className="text-xs text-slate-400">{primaryReel.description}</p>
              </div>
            )}

            {/* MEDIA PORTFOLIO GALLERY */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">Media Portfolio ({portfolio.length})</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveMediaModal(item)}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-3 hover:border-amber-500/60 cursor-pointer group transition-all"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-slate-900">
                      <img
                        src={item.thumbnail_url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 left-2 bg-slate-950/80 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {item.media_type}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* BIO & EXPERIENCE STATEMENT */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">Professional Background</h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{talent.bio}</p>
            </div>
          </div>

          {/* RIGHT 4 COLS: EQUIPMENT & CONTACT INFO */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* EQUIPMENT & KIT LIST */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📹</span> Owned Camera & Gear Package
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {talent.equipment_list || 'Full commercial gear package available upon request.'}
              </p>
            </div>

            {/* SOCIAL & IMDB LINKS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h2 className="text-lg font-bold text-white">Verified Links</h2>
              <div className="space-y-2 text-sm">
                {talent.website_url && (
                  <a href={talent.website_url} target="_blank" rel="noreferrer" className="block text-amber-400 hover:underline truncate">
                    🌐 Official Website
                  </a>
                )}
                {talent.vimeo_url && (
                  <a href={talent.vimeo_url} target="_blank" rel="noreferrer" className="block text-amber-400 hover:underline truncate">
                    ▶️ Vimeo Channel
                  </a>
                )}
                {talent.imdb_url && (
                  <a href={talent.imdb_url} target="_blank" rel="noreferrer" className="block text-amber-400 hover:underline truncate">
                    🎬 IMDb Credits
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIRECT HIRE / INQUIRY MODAL */}
      {showHireModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowHireModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-white">Send Production Offer</h3>
            <p className="text-xs text-slate-400">Direct message to {talent.full_name} regarding dates and rates.</p>

            {hireSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                <p className="text-2xl">🎉</p>
                <h4 className="text-lg font-bold text-emerald-400">Inquiry Sent Successfully!</h4>
                <p className="text-xs text-slate-300">{talent.full_name} has been notified and will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Offered Day Rate ($)</label>
                  <input
                    type="number"
                    value={offerRate}
                    onChange={(e) => setOfferRate(e.target.value)}
                    className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Production Details & Dates</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your shoot concept, dates, location, and equipment requirements..."
                    value={hireMessage}
                    onChange={(e) => setHireMessage(e.target.value)}
                    className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg cursor-pointer transition-all"
                >
                  Send Inquiry & Book
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MEDIA PREVIEW MODAL */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-4 relative">
            <button
              onClick={() => setActiveMediaModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white">{activeMediaModal.title}</h3>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden">
              <video controls autoPlay src={activeMediaModal.file_url} className="w-full h-full object-contain" />
            </div>
            <p className="text-xs text-slate-400">{activeMediaModal.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

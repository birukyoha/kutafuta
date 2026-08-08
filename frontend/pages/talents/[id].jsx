import React, { useState, useEffect } from 'react';
import { generatePortfolioPDF } from '../../../src/utils/generatePortfolioPDF';
import { getApiEndpoint } from '../../../src/services/api';

export default function TalentProfilePage({ talentId, onNavigate, currentUser }) {
  const [talent, setTalent] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMediaModal, setActiveMediaModal] = useState(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireMessage, setHireMessage] = useState('');
  const [offerRate, setOfferRate] = useState('');
  const [hireSuccess, setHireSuccess] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!talentId) return;
    setLoading(true);

    fetch(getApiEndpoint(`/talents/${talentId}`))
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

  const handleDownloadPdf = () => {
    if (!talent) return;
    setIsGeneratingPdf(true);
    try {
      generatePortfolioPDF(talent, portfolio);
    } catch (err) {
      console.error('Portfolio PDF generation failed:', err);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 600);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] flex items-center justify-center p-6">
        <div className="animate-spin rounded-none h-12 w-12 border-t-2 border-b-2 border-[#ff3e00]" />
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] text-[#f8f7f4] font-mono-code flex flex-col items-center justify-center p-6">
        <h2 className="font-syne text-2xl font-extrabold uppercase tracking-tight">Talent Profile Not Found</h2>
        <button
          onClick={() => onNavigate && onNavigate('directory')}
          className="mt-6 px-6 py-3 bg-[#f8f7f4] text-[#0b0b0d] font-bold uppercase text-xs tracking-widest cursor-pointer hover:bg-white"
        >
          Return to Talent Directory
        </button>
      </div>
    );
  }

  const primaryReel = portfolio.find(m => m.media_type === 'showreel') || portfolio[0];

  return (
    <div className="min-h-screen daylight-bg bg-[#181a20] text-[#f8f7f4] font-['Inter',sans-serif] selection:bg-[#ff3e00] selection:text-[#0b0b0d] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => onNavigate && onNavigate('directory')}
          className="inline-flex items-center gap-2 text-[#f8f7f4]/60 hover:text-[#f8f7f4] font-mono-code text-[0.7rem] uppercase tracking-widest transition-colors cursor-pointer"
        >
          &larr; Back to Directory
        </button>

        {/* PROFILE HERO HEADER */}
        <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 relative overflow-hidden font-mono-code">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={talent.avatar_url}
                alt={talent.full_name}
                className="w-24 h-24 sm:w-32 sm:h-32 border border-[#f8f7f4]/20 object-cover shrink-0 grayscale hover:grayscale-0 transition-all"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[0.65rem] font-bold px-2.5 py-0.5 bg-[#f8f7f4]/10 text-[#f8f7f4] border border-[#f8f7f4]/20 uppercase tracking-widest">
                    {talent.category ? talent.category.replace('_', ' ') : 'Film Professional'}
                  </span>
                  <span className="text-[0.65rem] font-bold px-2.5 py-0.5 bg-[#0b0b0d] text-[#f8f7f4]/60 border border-[#f8f7f4]/10 uppercase tracking-widest">
                    {talent.union_status ? talent.union_status.replace('_', ' ') : 'Non-Union'}
                  </span>
                  {talent.is_available && (
                    <span className="text-[0.65rem] font-bold px-2.5 py-0.5 bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 uppercase tracking-widest">
                      Ready For Set
                    </span>
                  )}
                </div>

                <h1 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#f8f7f4] uppercase tracking-tight">{talent.full_name}</h1>
                <p className="text-[0.7rem] font-bold text-[#ff3e00] uppercase tracking-wider">{talent.tagline}</p>

                <div className="flex flex-wrap items-center gap-4 text-[0.65rem] text-[#f8f7f4]/60 uppercase tracking-wider pt-1">
                  <span>📍 {talent.location}</span>
                  <span>🎬 {talent.years_experience || 8}+ Yrs Exp</span>
                  <span className="text-[#ff3e00]">★ {talent.rating || 5.0} ({talent.review_count || 18} Reviews)</span>
                </div>
              </div>
            </div>

            {/* RATES & HIRE ACTION */}
            <div className="bg-[#0b0b0d] p-5 border border-[#f8f7f4]/10 text-center lg:text-right shrink-0 w-full lg:w-auto flex flex-col justify-center">
              <p className="text-[0.6rem] uppercase tracking-widest text-[#f8f7f4]/60">Day Rate</p>
              <p className="font-syne text-2xl font-extrabold text-[#f8f7f4] tracking-tight mt-0.5">
                ${talent.day_rate} <span className="font-mono-code text-[0.65rem] font-normal text-[#f8f7f4]/60 uppercase">/day</span>
              </p>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setShowHireModal(true)}
                  className="w-full px-6 py-3 bg-[#f8f7f4] hover:bg-white text-[#0b0b0d] font-bold text-[0.7rem] uppercase tracking-widest transition-all cursor-pointer shadow-md hover:scale-[1.01]"
                >
                  Book / Send Inquiry
                </button>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="w-full px-5 py-2.5 bg-[#ff3e00]/10 hover:bg-[#ff3e00]/20 text-[#ff3e00] border border-[#ff3e00]/40 font-bold text-[0.65rem] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                  title="Generate & Download Styled PDF Portfolio Summary"
                >
                  {isGeneratingPdf ? (
                    <>
                      <span className="animate-spin text-xs">⏳</span>
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs">📄</span>
                      <span>Download Portfolio PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN BODY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            {primaryReel && (
              <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 space-y-4 font-mono-code">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-0.5">
                      Featured Showreel
                    </span>
                    <h2 className="font-syne text-xl font-bold uppercase tracking-tight text-[#f8f7f4]">{primaryReel.title}</h2>
                  </div>
                </div>

                <div className="relative aspect-video bg-[#0b0b0d] border border-[#f8f7f4]/10">
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
                <p className="text-[0.65rem] text-[#f8f7f4]/60 uppercase tracking-wider">{primaryReel.description}</p>
              </div>
            )}

            <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 space-y-4 font-mono-code">
              <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block">
                Work Archive
              </span>
              <h2 className="font-syne text-xl font-bold uppercase tracking-tight text-[#f8f7f4]">Media Portfolio ({portfolio.length})</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveMediaModal(item)}
                    className="bg-[#0b0b0d] border border-[#f8f7f4]/10 p-3 hover:border-[#f8f7f4]/30 cursor-pointer group transition-all"
                  >
                    <div className="relative aspect-video mb-2 bg-[#0b0b0d] border border-[#f8f7f4]/10 overflow-hidden">
                      <img
                        src={item.thumbnail_url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800'}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-[#0b0b0d]/90 text-[#f8f7f4] text-[0.6rem] font-bold px-2 py-0.5 border border-[#f8f7f4]/20 uppercase">
                        {item.media_type}
                      </span>
                    </div>
                    <h3 className="text-[0.7rem] font-bold uppercase text-[#f8f7f4] group-hover:text-[#ff3e00] transition-colors line-clamp-1">{item.title}</h3>
                    <p className="text-[0.6rem] text-[#f8f7f4]/50 line-clamp-1 mt-0.5 uppercase">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 space-y-4 font-mono-code">
              <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block">
                Biography & Profile Specs
              </span>
              <h2 className="font-syne text-xl font-bold uppercase tracking-tight text-[#f8f7f4]">Professional Background</h2>
              <p className="text-[0.7rem] text-[#f8f7f4]/80 leading-relaxed whitespace-pre-line uppercase">{talent.bio}</p>

              {/* CAST PHYSICAL STATS & SPECIAL SKILLS */}
              {talent.profile_type === 'cast' || talent.height || talent.special_skills ? (
                <div className="pt-4 border-t border-[#f8f7f4]/10 space-y-3">
                  <span className="text-[0.6rem] font-bold uppercase tracking-widest text-amber-400 block">
                    🎭 Cast Physical Stats & Performer Attributes
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#0b0b0d] p-3 border border-[#f8f7f4]/10 text-[0.65rem] uppercase">
                    {talent.height && <div><span className="text-[#f8f7f4]/50">Height:</span> {talent.height}</div>}
                    {talent.clothing_size && <div><span className="text-[#f8f7f4]/50">Clothing:</span> {talent.clothing_size}</div>}
                    {talent.shoe_size && <div><span className="text-[#f8f7f4]/50">Shoe:</span> {talent.shoe_size}</div>}
                    {talent.hair_color && <div><span className="text-[#f8f7f4]/50">Hair:</span> {talent.hair_color}</div>}
                    {talent.eye_color && <div><span className="text-[#f8f7f4]/50">Eye Color:</span> {talent.eye_color}</div>}
                    {talent.representation_status && <div><span className="text-[#f8f7f4]/50">Agency:</span> {talent.representation_status}</div>}
                  </div>
                  {talent.special_skills && (
                    <div className="text-[0.65rem] uppercase text-[#f8f7f4]/80">
                      <span className="text-amber-400 font-bold">Special Skills:</span> {talent.special_skills}
                    </div>
                  )}
                </div>
              ) : null}

              {/* CREW CERTIFICATIONS & PREVIOUS PRODUCTIONS */}
              {(talent.certifications_licenses || talent.previous_productions) && (
                <div className="pt-4 border-t border-[#f8f7f4]/10 space-y-2 text-[0.65rem] uppercase">
                  {talent.certifications_licenses && (
                    <div><span className="text-[#ff3e00] font-bold">Certifications & Licenses:</span> {talent.certifications_licenses}</div>
                  )}
                  {talent.previous_productions && (
                    <div><span className="text-[#ff3e00] font-bold">Previous Productions:</span> {talent.previous_productions}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8 font-mono-code">
            <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 space-y-4">
              <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block">
                Kit & Equipment
              </span>
              <h2 className="font-syne text-lg font-bold uppercase tracking-tight text-[#f8f7f4]">
                Owned Camera Package
              </h2>
              <p className="text-[0.65rem] text-[#f8f7f4]/80 leading-relaxed bg-[#0b0b0d] p-4 border border-[#f8f7f4]/10 uppercase">
                {talent.equipment_list || 'FULL COMMERCIAL GEAR PACKAGE AVAILABLE UPON REQUEST.'}
              </p>
            </div>

            <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 space-y-4">
              <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block">
                External Channels
              </span>
              <h2 className="font-syne text-lg font-bold uppercase tracking-tight text-[#f8f7f4]">Verified Links</h2>
              <div className="space-y-2 text-[0.65rem] uppercase">
                {talent.website_url && (
                  <a href={talent.website_url} target="_blank" rel="noreferrer" className="block text-[#f8f7f4]/80 hover:text-[#ff3e00] truncate">
                    Official Website &rarr;
                  </a>
                )}
                {talent.vimeo_url && (
                  <a href={talent.vimeo_url} target="_blank" rel="noreferrer" className="block text-[#f8f7f4]/80 hover:text-[#ff3e00] truncate">
                    Vimeo Channel &rarr;
                  </a>
                )}
                {talent.imdb_url && (
                  <a href={talent.imdb_url} target="_blank" rel="noreferrer" className="block text-[#f8f7f4]/80 hover:text-[#ff3e00] truncate">
                    IMDb Credits &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHireModal && (
        <div className="fixed inset-0 z-50 bg-[#0b0b0d]/90 backdrop-blur-md flex items-center justify-center p-4 font-mono-code">
          <div className="bg-[#111114] border border-[#f8f7f4]/10 max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setShowHireModal(false)}
              className="absolute top-4 right-4 text-[#f8f7f4]/60 hover:text-[#f8f7f4] cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block">
              Direct Booking
            </span>
            <h3 className="font-syne text-2xl font-bold uppercase tracking-tight text-[#f8f7f4]">Send Production Offer</h3>
            <p className="text-[0.65rem] text-[#f8f7f4]/60 uppercase">Direct message to {talent.full_name} regarding dates and rates.</p>

            {hireSuccess ? (
              <div className="p-6 bg-[#00ff00]/10 border border-[#00ff00]/30 text-center space-y-2">
                <p className="text-2xl">🎉</p>
                <h4 className="text-sm font-bold uppercase text-[#00ff00]">Inquiry Sent Successfully!</h4>
                <p className="text-[0.65rem] text-[#f8f7f4]/80 uppercase">{talent.full_name} has been notified and will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">Offered Day Rate ($)</label>
                  <input
                    type="number"
                    value={offerRate}
                    onChange={(e) => setOfferRate(e.target.value)}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">Production Details & Dates</label>
                  <textarea
                    rows={4}
                    placeholder="DESCRIBE YOUR SHOOT CONCEPT, DATES, LOCATION..."
                    value={hireMessage}
                    onChange={(e) => setHireMessage(e.target.value)}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#f8f7f4] hover:bg-white text-[#0b0b0d] font-bold uppercase text-[0.7rem] tracking-widest cursor-pointer transition-all"
                >
                  Send Inquiry & Book
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {activeMediaModal && (
        <div className="fixed inset-0 z-50 bg-[#0b0b0d]/90 backdrop-blur-md flex items-center justify-center p-4 font-mono-code">
          <div className="bg-[#111114] border border-[#f8f7f4]/10 max-w-3xl w-full p-6 space-y-4 relative">
            <button
              onClick={() => setActiveMediaModal(null)}
              className="absolute top-4 right-4 text-[#f8f7f4]/60 hover:text-[#f8f7f4] cursor-pointer"
            >
              ✕
            </button>
            <h3 className="font-syne text-xl font-bold uppercase text-[#f8f7f4]">{activeMediaModal.title}</h3>
            <div className="aspect-video bg-[#0b0b0d] border border-[#f8f7f4]/10 overflow-hidden">
              <video controls autoPlay src={activeMediaModal.file_url} className="w-full h-full object-contain" />
            </div>
            <p className="text-[0.65rem] text-[#f8f7f4]/60 uppercase">{activeMediaModal.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}


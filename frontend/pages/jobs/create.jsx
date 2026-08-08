// File: /frontend/pages/jobs/create.jsx
// Client / Agency Job Posting Form Interface Page for Film Marketplace

import React, { useState } from 'react';
import { getApiEndpoint } from '../../../src/services/api';

export default function CreateJobPage({ onNavigate, currentUser }) {
  const [formData, setFormData] = useState({
    title: '',
    department: 'cinematography',
    project_type: 'Commercial',
    location: 'Los Angeles, CA',
    is_remote: false,
    shoot_dates: '',
    budget_type: 'Day Rate',
    budget_min: '1500',
    budget_max: '2000',
    required_skills: 'ARRI Alexa 35, Anamorphic Lenses, Steadicam',
    union_requirement: 'non_union',
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const newJobPayload = {
      ...formData,
      id: `job-${Date.now()}`,
      client_id: currentUser?.profile?.id || 'client-1',
      client_name: currentUser?.profile?.company_name || currentUser?.user?.full_name || 'Apex Media Studios',
      status: 'open',
      created_at: new Date().toISOString()
    };

    try {
      const response = await fetch(getApiEndpoint('/jobs'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJobPayload)
      });

      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text); } catch (err) {}

      // Save locally to localStorage so it immediately shows up in listings
      try {
        const stored = localStorage.getItem('cinecraft_local_jobs');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(data.job || newJobPayload);
        localStorage.setItem('cinecraft_local_jobs', JSON.stringify(list));
      } catch (err) {
        console.error('Failed to save job locally:', err);
      }

      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        if (onNavigate) onNavigate('marketplace');
      }, 2000);
    } catch (err) {
      console.error('Create job error:', err);
      // Fallback local save if offline
      try {
        const stored = localStorage.getItem('cinecraft_local_jobs');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newJobPayload);
        localStorage.setItem('cinecraft_local_jobs', JSON.stringify(list));
        setSubmitting(false);
        setSuccess(true);
        setTimeout(() => {
          if (onNavigate) onNavigate('marketplace');
        }, 2000);
      } catch (e) {
        setErrorMsg(err.message || 'An error occurred while posting job.');
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen daylight-bg bg-[#181a20] text-[#f8f7f4] font-['Inter',sans-serif] selection:bg-[#ff3e00] selection:text-[#0b0b0d] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="border-b border-[#f8f7f4]/10 pb-6 flex items-center justify-between font-mono-code">
          <div>
            <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-1">
              Call For Crew // CineCraft
            </span>
            <h1 className="font-syne text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#f8f7f4]">Post a Production Call</h1>
            <p className="text-[0.7rem] text-[#f8f7f4]/60 uppercase tracking-wider mt-1">Broadcast your opportunity to verified creative talent.</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('directory')}
            className="text-[0.7rem] font-bold uppercase tracking-widest text-[#f8f7f4]/60 hover:text-[#f8f7f4] transition-colors cursor-pointer"
          >
            ✕ Cancel
          </button>
        </div>

        {/* SUCCESS NOTIFICATION */}
        {success && (
          <div className="p-6 bg-[#00ff00]/10 border border-[#00ff00]/30 text-center space-y-2 font-mono-code">
            <p className="text-3xl">🎉</p>
            <h3 className="font-syne text-xl font-bold uppercase text-[#00ff00]">Production Opportunity Published!</h3>
            <p className="text-[0.65rem] text-[#f8f7f4]/80 uppercase">Your job posting is now live in the crew marketplace.</p>
          </div>
        )}

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-[0.65rem] font-bold uppercase tracking-wider text-rose-400 font-mono-code">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 space-y-6 font-mono-code">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Job Title / Opportunity *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="E.G. LEAD DIRECTOR OF PHOTOGRAPHY - SCI-FI FEATURE"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
              >
                <option value="cinematography">Cinematography</option>
                <option value="directing">Directing</option>
                <option value="sound_audio">Location Sound</option>
                <option value="editing_post">Editing & Color</option>
                <option value="vfx_animation">Virtual Production / VFX</option>
                <option value="drone_aerial">Drone & Aerial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Project Type</label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
              >
                <option value="Commercial">Commercial</option>
                <option value="Feature Film">Feature Film</option>
                <option value="Music Video">Music Video</option>
                <option value="Documentary">Documentary</option>
                <option value="TV Series">TV Series</option>
              </select>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Shoot Location</label>
              <input
                type="text"
                name="location"
                placeholder="E.G. LOS ANGELES, CA OR MOAB, UT"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
              />
            </div>

            <div className="sm:col-span-3 flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={formData.is_remote}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 bg-[#0b0b0d] border-[#f8f7f4]/20 text-[#ff3e00] focus:ring-0"
                />
                <span className="text-[0.65rem] uppercase tracking-wider text-[#f8f7f4]/80">Remote Post Role</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Shoot Dates / Timeline *</label>
              <input
                type="text"
                name="shoot_dates"
                required
                placeholder="E.G. AUG 15 - AUG 28, 2026 (8 SHOOT DAYS)"
                value={formData.shoot_dates}
                onChange={handleChange}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
              />
            </div>

            <div>
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Union Status Requirement</label>
              <select
                name="union_requirement"
                value={formData.union_requirement}
                onChange={handleChange}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
              >
                <option value="non_union">Non-Union / Open</option>
                <option value="iatse_600">IATSE Local 600 Required</option>
                <option value="dga">DGA Required</option>
                <option value="sag_aftra">SAG-AFTRA Required</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0b0b0d] p-4 border border-[#f8f7f4]/10">
            <div>
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Budget Type</label>
              <select
                name="budget_type"
                value={formData.budget_type}
                onChange={handleChange}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-2.5 py-2 text-[0.7rem] border border-[#f8f7f4]/10"
              >
                <option value="Day Rate">Day Rate ($)</option>
                <option value="Project Total">Project Total ($)</option>
                <option value="Hourly">Hourly ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Min Rate ($) *</label>
              <input
                type="number"
                name="budget_min"
                required
                value={formData.budget_min}
                onChange={handleChange}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-2.5 py-2 text-[0.7rem] border border-[#f8f7f4]/10"
              />
            </div>

            <div>
              <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Max Rate ($) *</label>
              <input
                type="number"
                name="budget_max"
                required
                value={formData.budget_max}
                onChange={handleChange}
                className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-2.5 py-2 text-[0.7rem] border border-[#f8f7f4]/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Required Skills / Gear Inventory</label>
            <input
              type="text"
              name="required_skills"
              placeholder="E.G. ARRI ALEXA 35, ANAMORPHIC GLASS, LECTROSONICS"
              value={formData.required_skills}
              onChange={handleChange}
              className="w-full bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
            />
          </div>

          <div>
            <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-2">Detailed Production Description *</label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="PROVIDE A COMPREHENSIVE BREAKDOWN OF THE CREATIVE CONCEPT, VISUAL STYLE, GEAR EXPECTATIONS..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#f8f7f4] hover:bg-white text-[#0b0b0d] font-bold uppercase text-[0.7rem] tracking-widest transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Publishing Opportunity...' : 'Publish Call for Crew'}
          </button>
        </form>
      </div>
    </div>
  );
}

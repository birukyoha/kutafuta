// File: /frontend/pages/jobs/create.js
// Client / Agency Job Posting Form Interface Page for Film Marketplace

import React, { useState } from 'react';

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

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          client_id: currentUser?.profile?.id || 'client-1'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish job posting.');
      }

      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        if (onNavigate) onNavigate('directory');
      }, 2000);
    } catch (err) {
      console.error('Create job error:', err);
      setErrorMsg(err.message || 'An error occurred while posting job.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Post a Production Call</h1>
            <p className="text-sm text-slate-400 mt-1">Broadcast your open opportunity to thousands of verified creative talent.</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('directory')}
            className="text-xs text-slate-400 hover:text-white font-medium"
          >
            ✕ Cancel
          </button>
        </div>

        {/* SUCCESS NOTIFICATION */}
        {success && (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl text-center space-y-2">
            <p className="text-3xl">🎉</p>
            <h3 className="text-xl font-bold text-emerald-400">Production Opportunity Published!</h3>
            <p className="text-xs text-slate-300">Your job posting is now live in the crew marketplace.</p>
          </div>
        )}

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/40 rounded-xl text-xs text-rose-400">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          
          {/* TITLE & DEPARTMENT */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Job Title / Opportunity *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Lead Director of Photography - Sci-Fi Feature Film"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
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

          {/* PROJECT TYPE & LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Project Type</label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
              >
                <option value="Commercial">Commercial</option>
                <option value="Feature Film">Feature Film</option>
                <option value="Music Video">Music Video</option>
                <option value="Documentary">Documentary</option>
                <option value="TV Series">TV Series</option>
              </select>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Shoot Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Los Angeles, CA or Moab, UT"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-3 flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={formData.is_remote}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500"
                />
                <span className="text-xs font-medium text-slate-300">Remote Post Role</span>
              </label>
            </div>
          </div>

          {/* DATES & UNION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Shoot Dates / Timeline *</label>
              <input
                type="text"
                name="shoot_dates"
                required
                placeholder="e.g. Aug 15 - Aug 28, 2026 (8 Shoot Days)"
                value={formData.shoot_dates}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Union Status Requirement</label>
              <select
                name="union_requirement"
                value={formData.union_requirement}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
              >
                <option value="non_union">Non-Union / Open</option>
                <option value="iatse_600">IATSE Local 600 Required</option>
                <option value="dga">DGA Required</option>
                <option value="sag_aftra">SAG-AFTRA Required</option>
              </select>
            </div>
          </div>

          {/* BUDGET & RATES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Budget Type</label>
              <select
                name="budget_type"
                value={formData.budget_type}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 text-sm border border-slate-700"
              >
                <option value="Day Rate">Day Rate ($)</option>
                <option value="Project Total">Project Total ($)</option>
                <option value="Hourly">Hourly ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Min Rate ($) *</label>
              <input
                type="number"
                name="budget_min"
                required
                value={formData.budget_min}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 text-sm border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Max Rate ($) *</label>
              <input
                type="number"
                name="budget_max"
                required
                value={formData.budget_max}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 text-sm border border-slate-700"
              />
            </div>
          </div>

          {/* REQUIRED SKILLS */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Required Skills / Gear Inventory</label>
            <input
              type="text"
              name="required_skills"
              placeholder="e.g. ARRI Alexa 35, Anamorphic Glass, Lectrosonics"
              value={formData.required_skills}
              onChange={handleChange}
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Detailed Production Description *</label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Provide a comprehensive breakdown of the creative concept, visual style, gear expectations, and crew requirements..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base rounded-2xl shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Publishing Opportunity...' : 'Publish Call for Crew'}
          </button>
        </form>
      </div>
    </div>
  );
}

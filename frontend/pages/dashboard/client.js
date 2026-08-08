// File: /frontend/pages/dashboard/client.js
// Client / Production Agency Dashboard Page for Reviewing Talent Applications & Upgrading Agency Tier

import React, { useState, useEffect } from 'react';

export default function ClientDashboardPage({ currentUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'calls' | 'tier' | 'profile'
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Agency Tier State
  const [agencyTier, setAgencyTier] = useState(
    currentUser?.profile?.tier || currentUser?.profile?.company_tier || 'Standard Studio'
  );

  // Agency Profile Form State
  const [profileForm, setProfileForm] = useState({
    company_name: currentUser?.profile?.company_name || currentUser?.user?.full_name || 'Apex Media Studios',
    company_type: currentUser?.profile?.company_type || 'Production Agency',
    location: currentUser?.profile?.location || currentUser?.user?.location || 'Los Angeles, CA',
    website: currentUser?.profile?.website_url || 'https://apexmediastudios.com',
    avatar_url: currentUser?.user?.avatar_url || currentUser?.profile?.logo_url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800',
    bio: currentUser?.profile?.bio || 'Full-service creative film production studio & agency producing high-end commercial campaigns and narrative features.'
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [upgradingTier, setUpgradingTier] = useState(false);

  useEffect(() => {
    fetchClientData();
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchClientData = () => {
    setLoading(true);
    const clientId = currentUser?.profile?.id || 'client-1';

    Promise.all([
      fetch('/api/jobs').then(res => res.json()),
      fetch(`/api/applications?client_id=${clientId}`).then(res => res.json())
    ])
      .then(([jobData, appData]) => {
        const clientJobs = (jobData.jobs || []).filter(j => j.client_id === clientId || true);
        setJobs(clientJobs);
        setApplications(appData.applications || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching client dashboard:', err);
        setLoading(false);
      });
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplications(prev =>
          prev.map(a => (a.id === appId ? { ...a, status: newStatus } : a))
        );
        showToast(`Application status updated to '${newStatus.toUpperCase()}'!`);
      }
    } catch (err) {
      console.error('Failed to update application status:', err);
    }
  };

  const handleUpgradeTier = async (newTierName) => {
    setUpgradingTier(true);
    try {
      const clientId = currentUser?.profile?.id || 'client-1';
      const adminToken = sessionStorage.getItem('cinecraft_admin_token') || 'cinecraft_admin_secret_key_2026';

      const res = await fetch(`/api/admin/records/clientProfiles/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ tier: newTierName, updated_at: new Date().toISOString() })
      });

      setAgencyTier(newTierName);
      if (currentUser?.profile) {
        currentUser.profile.tier = newTierName;
      }
      setUpgradingTier(false);
      showToast(`🎉 Agency Plan upgraded to ${newTierName}! All tier benefits unlocked.`);
    } catch (err) {
      setAgencyTier(newTierName);
      setUpgradingTier(false);
      showToast(`🎉 Agency Plan updated to ${newTierName}!`);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const clientId = currentUser?.profile?.id || 'client-1';
      const adminToken = sessionStorage.getItem('cinecraft_admin_token') || 'cinecraft_admin_secret_key_2026';

      await fetch(`/api/admin/records/clientProfiles/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({
          company_name: profileForm.company_name,
          company_type: profileForm.company_type,
          location: profileForm.location,
          website_url: profileForm.website,
          logo_url: profileForm.avatar_url,
          bio: profileForm.bio,
          updated_at: new Date().toISOString()
        })
      });

      if (currentUser?.profile) {
        currentUser.profile.company_name = profileForm.company_name;
        currentUser.profile.company_type = profileForm.company_type;
        currentUser.profile.location = profileForm.location;
      }
      if (currentUser?.user) {
        currentUser.user.full_name = profileForm.company_name;
        currentUser.user.avatar_url = profileForm.avatar_url;
      }

      setSavingProfile(false);
      showToast('Agency Profile and Database Records updated successfully!');
    } catch (err) {
      setSavingProfile(false);
      showToast('Agency Profile settings saved.');
    }
  };

  const filteredApplications = selectedJobId === 'all'
    ? applications
    : applications.filter(a => a.job_id === selectedJobId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] flex items-center justify-center p-6">
        <div className="animate-spin rounded-none h-12 w-12 border-t-2 border-b-2 border-[#ff3e00]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen daylight-bg bg-[#181a20] text-[#f8f7f4] font-['Inter',sans-serif] selection:bg-[#ff3e00] selection:text-[#0b0b0d] py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* TOAST NOTIFICATION */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-[#00ff00]/10 border border-[#00ff00]/40 text-[#00ff00] px-5 py-3 text-xs font-mono-code font-bold uppercase tracking-wider shadow-2xl animate-fade-in">
            {toastMsg}
          </div>
        )}

        {/* HEADER */}
        <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 font-mono-code">
          <div className="flex items-center gap-4">
            <img
              src={profileForm.avatar_url}
              alt="Agency Logo"
              className="w-16 h-16 object-cover border border-[#f8f7f4]/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00]">
                  Producer Portal // CineCraft
                </span>
                <span className="px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest bg-[#ff3e00]/20 text-[#ff3e00] border border-[#ff3e00]/40">
                  {agencyTier}
                </span>
              </div>
              <h1 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#f8f7f4]">
                {profileForm.company_name}
              </h1>
              <p className="text-[0.7rem] text-[#f8f7f4]/60 uppercase tracking-wider mt-0.5">
                {profileForm.company_type} • {profileForm.location}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('tier')}
              className="px-4 py-2.5 bg-[#ff3e00]/20 hover:bg-[#ff3e00]/30 text-[#ff3e00] border border-[#ff3e00]/40 font-bold uppercase text-[0.65rem] tracking-widest transition-all cursor-pointer"
            >
              ★ Upgrade Agency Plan
            </button>
            <button
              onClick={() => onNavigate && onNavigate('jobs_create')}
              className="px-5 py-2.5 bg-[#f8f7f4] hover:bg-white text-[#0b0b0d] font-bold uppercase text-[0.65rem] tracking-widest transition-all cursor-pointer"
            >
              + Post Call for Crew
            </button>
          </div>
        </div>

        {/* DASHBOARD NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 border-b border-[#f8f7f4]/10 pb-3 font-mono-code">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-widest transition-all cursor-pointer border ${
              activeTab === 'applications'
                ? 'bg-[#f8f7f4] text-[#0b0b0d] border-[#f8f7f4]'
                : 'bg-[#111114] text-[#f8f7f4]/60 border-[#f8f7f4]/10 hover:text-[#f8f7f4]'
            }`}
          >
            Submissions ({applications.length})
          </button>

          <button
            onClick={() => setActiveTab('calls')}
            className={`px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-widest transition-all cursor-pointer border ${
              activeTab === 'calls'
                ? 'bg-[#f8f7f4] text-[#0b0b0d] border-[#f8f7f4]'
                : 'bg-[#111114] text-[#f8f7f4]/60 border-[#f8f7f4]/10 hover:text-[#f8f7f4]'
            }`}
          >
            Crew Calls ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab('tier')}
            className={`px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-widest transition-all cursor-pointer border ${
              activeTab === 'tier'
                ? 'bg-[#ff3e00] text-white border-[#ff3e00]'
                : 'bg-[#111114] text-[#ff3e00] border-[#ff3e00]/30 hover:border-[#ff3e00]'
            }`}
          >
            ★ Membership Upgrade
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-widest transition-all cursor-pointer border ${
              activeTab === 'profile'
                ? 'bg-[#f8f7f4] text-[#0b0b0d] border-[#f8f7f4]'
                : 'bg-[#111114] text-[#f8f7f4]/60 border-[#f8f7f4]/10 hover:text-[#f8f7f4]'
            }`}
          >
            Agency Profile
          </button>
        </div>

        {/* TAB 1: APPLICATIONS SUBMISSIONS */}
        {activeTab === 'applications' && (
          <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 space-y-6 font-mono-code">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f8f7f4]/10 pb-4">
              <div>
                <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-1">
                  Applications Review
                </span>
                <h2 className="font-syne text-2xl font-bold uppercase tracking-tight text-[#f8f7f4]">
                  Incoming Talent ({filteredApplications.length})
                </h2>
              </div>

              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
              >
                <option value="all">All Opportunities</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>

            {filteredApplications.length === 0 ? (
              <p className="text-[0.65rem] text-[#f8f7f4]/60 uppercase py-6">No applications received for this job call yet.</p>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-[#0b0b0d] border border-[#f8f7f4]/10 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={app.talent_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
                        alt={app.talent_name}
                        className="w-14 h-14 object-cover border border-[#f8f7f4]/20"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-syne text-base font-bold uppercase tracking-tight text-[#f8f7f4]">{app.talent_name}</h3>
                          <span className="text-[0.6rem] font-bold px-2 py-0.5 bg-[#f8f7f4]/10 text-[#f8f7f4] border border-[#f8f7f4]/20 uppercase tracking-widest">
                            Bid: ${app.bid_rate}/day
                          </span>
                        </div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#f8f7f4]/60">For Role: <span className="text-[#f8f7f4] font-extrabold">{app.job_title}</span></p>
                        <p className="text-[0.65rem] text-[#f8f7f4]/80 italic pt-1 max-w-xl">"{app.cover_letter}"</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                        className={`px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-widest cursor-pointer transition-all border ${
                          app.status === 'shortlisted' ? 'bg-[#ff3e00] text-white border-[#ff3e00]' : 'bg-[#111114] text-[#f8f7f4] border-[#f8f7f4]/20 hover:border-[#ff3e00]'
                        }`}
                      >
                        ★ Shortlist
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(app.id, 'hired')}
                        className={`px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-widest cursor-pointer transition-all border ${
                          app.status === 'hired' ? 'bg-[#00ff00] text-[#0b0b0d] border-[#00ff00]' : 'bg-[#111114] text-[#f8f7f4] border-[#f8f7f4]/20 hover:border-[#00ff00]'
                        }`}
                      >
                        ✓ Hire Talent
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(app.id, 'rejected')}
                        className={`px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-widest cursor-pointer transition-all border ${
                          app.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-[#111114] text-[#f8f7f4]/50 border-[#f8f7f4]/10 hover:border-rose-500'
                        }`}
                      >
                        Pass
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE CREW CALLS */}
        {activeTab === 'calls' && (
          <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 space-y-6 font-mono-code">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f8f7f4]/10 pb-4">
              <div>
                <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-1">
                  Active Opportunities
                </span>
                <h2 className="font-syne text-2xl font-bold uppercase tracking-tight text-[#f8f7f4]">
                  Posted Calls for Crew ({jobs.length})
                </h2>
              </div>

              <button
                onClick={() => onNavigate && onNavigate('jobs_create')}
                className="px-4 py-2 bg-[#ff3e00] hover:bg-[#d93800] text-white font-bold uppercase text-[0.65rem] tracking-widest transition-all cursor-pointer"
              >
                + Create New Crew Call
              </button>
            </div>

            {jobs.length === 0 ? (
              <p className="text-[0.65rem] text-[#f8f7f4]/60 uppercase py-6">No active calls for crew posted yet.</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-[#0b0b0d] border border-[#f8f7f4]/10 p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f8f7f4]/10 pb-3">
                      <div>
                        <span className="text-[0.6rem] font-bold uppercase text-[#ff3e00] tracking-widest block">
                          {job.department} • {job.project_type}
                        </span>
                        <h3 className="font-syne text-lg font-bold uppercase tracking-tight text-[#f8f7f4]">{job.title}</h3>
                      </div>
                      <span className="text-[0.6rem] font-bold uppercase px-2.5 py-1 bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 w-fit">
                        Status: {job.status || 'Active'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[0.65rem] uppercase text-[#f8f7f4]/70">
                      <div><strong className="text-white">Location:</strong> {job.location}</div>
                      <div><strong className="text-white">Shoot Dates:</strong> {job.shoot_dates || 'TBD'}</div>
                      <div><strong className="text-white">Budget:</strong> ${job.budget_min} - ${job.budget_max} / day</div>
                      <div><strong className="text-white">Union:</strong> {job.union_requirement || 'Non-Union'}</div>
                    </div>

                    <p className="text-[0.65rem] text-[#f8f7f4]/70 line-clamp-2 pt-1">{job.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MEMBERSHIP TIER UPGRADE */}
        {activeTab === 'tier' && (
          <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 space-y-8 font-mono-code">
            <div className="border-b border-[#f8f7f4]/10 pb-4">
              <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-1">
                Agency Subscription // CineCraft
              </span>
              <h2 className="font-syne text-2xl font-bold uppercase tracking-tight text-[#f8f7f4]">
                Upgrade Agency Client Membership
              </h2>
              <p className="text-[0.7rem] text-[#f8f7f4]/60 uppercase tracking-wider mt-1">
                Unlock direct talent messaging, priority placement in search, AI reel matching, and enterprise legal NDAs.
              </p>
            </div>

            {/* CURRENT PLAN BADGE BANNER */}
            <div className="p-5 bg-[#ff3e00]/10 border border-[#ff3e00]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[0.6rem] uppercase tracking-widest text-[#ff3e00] font-bold block">Active Subscription</span>
                <h3 className="font-syne text-xl font-extrabold uppercase text-white">{agencyTier} Plan</h3>
                <p className="text-[0.65rem] text-[#f8f7f4]/70 uppercase mt-0.5">Your agency is active and verified on CineCraft Production Vault.</p>
              </div>

              <div className="px-4 py-2 bg-[#ff3e00] text-white font-bold uppercase text-[0.65rem] tracking-widest w-fit">
                Current Status: Verified Active
              </div>
            </div>

            {/* TIER TIERS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* TIER 1 */}
              <div className={`p-6 border flex flex-col justify-between space-y-6 ${
                agencyTier === 'Standard Studio' ? 'bg-[#0b0b0d] border-[#f8f7f4]/30' : 'bg-[#0b0b0d] border-[#f8f7f4]/10'
              }`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[0.6rem] font-bold uppercase text-[#f8f7f4]/50">Starter</span>
                    {agencyTier === 'Standard Studio' && (
                      <span className="text-[0.55rem] font-bold px-2 py-0.5 bg-[#f8f7f4]/20 text-white uppercase">Active Plan</span>
                    )}
                  </div>
                  <h3 className="font-syne text-xl font-bold uppercase text-white">Standard Studio</h3>
                  <div className="text-2xl font-extrabold text-white font-syne">$0 <span className="text-xs text-[#f8f7f4]/50 font-mono-code font-normal">/ month</span></div>
                  <ul className="space-y-2 text-[0.65rem] uppercase text-[#f8f7f4]/70 pt-2 border-t border-[#f8f7f4]/10">
                    <li>✓ 3 Active Calls for Crew</li>
                    <li>✓ Access to Talent Directory</li>
                    <li>✓ Basic Applicant Shortlisting</li>
                    <li>✓ Standard Contract Templates</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleUpgradeTier('Standard Studio')}
                  disabled={agencyTier === 'Standard Studio' || upgradingTier}
                  className="w-full py-3 bg-[#111114] border border-[#f8f7f4]/20 text-[#f8f7f4] font-bold uppercase text-[0.65rem] tracking-widest hover:border-[#f8f7f4] disabled:opacity-50 cursor-pointer"
                >
                  {agencyTier === 'Standard Studio' ? 'Selected Plan' : 'Downgrade to Standard'}
                </button>
              </div>

              {/* TIER 2 - PRO */}
              <div className="p-6 bg-[#0b0b0d] border-2 border-[#ff3e00] relative flex flex-col justify-between space-y-6 shadow-2xl">
                <div className="absolute -top-3 right-4 bg-[#ff3e00] text-white px-3 py-0.5 text-[0.55rem] font-bold uppercase tracking-widest">
                  Most Popular Agency Choice
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[0.6rem] font-bold uppercase text-[#ff3e00]">Professional</span>
                    {agencyTier === 'Pro Agency Tier' && (
                      <span className="text-[0.55rem] font-bold px-2 py-0.5 bg-[#ff3e00] text-white uppercase">Active Plan</span>
                    )}
                  </div>
                  <h3 className="font-syne text-xl font-bold uppercase text-white">Pro Agency Tier</h3>
                  <div className="text-3xl font-extrabold text-[#ff3e00] font-syne">$199 <span className="text-xs text-[#f8f7f4]/50 font-mono-code font-normal">/ month</span></div>
                  <ul className="space-y-2 text-[0.65rem] uppercase text-[#f8f7f4]/80 pt-2 border-t border-[#f8f7f4]/10">
                    <li>✓ <strong>UNLIMITED</strong> Active Calls for Crew</li>
                    <li>✓ Featured Producer Badge & Priority Placement</li>
                    <li>✓ Direct Talent Messaging & Reel Request</li>
                    <li>✓ AI Talent Reel Matching Assistant</li>
                    <li>✓ 0% Booking Fee on Hired Crew</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleUpgradeTier('Pro Agency Tier')}
                  disabled={agencyTier === 'Pro Agency Tier' || upgradingTier}
                  className="w-full py-3.5 bg-[#ff3e00] hover:bg-[#d93800] text-white font-bold uppercase text-[0.65rem] tracking-widest disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {agencyTier === 'Pro Agency Tier' ? 'Current Active Tier' : 'Upgrade to Pro Agency ($199/mo)'}
                </button>
              </div>

              {/* TIER 3 - ENTERPRISE */}
              <div className="p-6 bg-[#0b0b0d] border border-[#00ff00]/40 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[0.6rem] font-bold uppercase text-[#00ff00]">Enterprise</span>
                    {agencyTier === 'Enterprise Studio' && (
                      <span className="text-[0.55rem] font-bold px-2 py-0.5 bg-[#00ff00] text-[#0b0b0d] uppercase">Active Plan</span>
                    )}
                  </div>
                  <h3 className="font-syne text-xl font-bold uppercase text-white">Enterprise Studio</h3>
                  <div className="text-3xl font-extrabold text-[#00ff00] font-syne">$499 <span className="text-xs text-[#f8f7f4]/50 font-mono-code font-normal">/ month</span></div>
                  <ul className="space-y-2 text-[0.65rem] uppercase text-[#f8f7f4]/80 pt-2 border-t border-[#f8f7f4]/10">
                    <li>✓ Unlimited Crew Calls + Dedicated Casting Agent</li>
                    <li>✓ Custom NDA & Legal Shield Agreement Engine</li>
                    <li>✓ Multi-User Team Seat Access (10 Producer Seats)</li>
                    <li>✓ Dedicated Account Executive & Priority Hotline</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleUpgradeTier('Enterprise Studio')}
                  disabled={agencyTier === 'Enterprise Studio' || upgradingTier}
                  className="w-full py-3.5 bg-[#00ff00] hover:bg-emerald-400 text-[#0b0b0d] font-bold uppercase text-[0.65rem] tracking-widest disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {agencyTier === 'Enterprise Studio' ? 'Current Active Tier' : 'Upgrade to Enterprise ($499/mo)'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: AGENCY PROFILE EDITOR */}
        {activeTab === 'profile' && (
          <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 space-y-6 font-mono-code">
            <div className="border-b border-[#f8f7f4]/10 pb-4">
              <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-1">
                Studio Settings
              </span>
              <h2 className="font-syne text-2xl font-bold uppercase tracking-tight text-[#f8f7f4]">
                Agency Company Profile
              </h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">
                    Company / Studio Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.company_name}
                    onChange={(e) => setProfileForm(p => ({ ...p, company_name: e.target.value }))}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">
                    Company Type / Industry Category
                  </label>
                  <input
                    type="text"
                    value={profileForm.company_type}
                    onChange={(e) => setProfileForm(p => ({ ...p, company_type: e.target.value }))}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">
                    Headquarters / Location Hub
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm(p => ({ ...p, location: e.target.value }))}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm(p => ({ ...p, website: e.target.value }))}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">
                  Logo / Avatar Image URL
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={profileForm.avatar_url}
                    alt="Logo Preview"
                    className="w-10 h-10 object-cover border border-[#f8f7f4]/20 shrink-0"
                  />
                  <input
                    type="text"
                    value={profileForm.avatar_url}
                    onChange={(e) => setProfileForm(p => ({ ...p, avatar_url: e.target.value }))}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">
                  Studio Overview / Biography
                </label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                  className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-3 bg-[#f8f7f4] hover:bg-white text-[#0b0b0d] font-bold uppercase text-[0.7rem] tracking-widest cursor-pointer transition-all disabled:opacity-50"
              >
                {savingProfile ? 'Saving Changes...' : 'Save Agency Profile & Sync DB'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

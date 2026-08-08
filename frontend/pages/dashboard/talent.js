// File: /frontend/pages/dashboard/talent.js
// Talent Private Dashboard, Profile Analytics & AWS S3 Media Uploader Page Component

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export default function TalentDashboardPage({ currentUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'vault' | 'edit_profile' | 'applications'
  const [profile, setProfile] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Analytics State
  const [analyticsRange, setAnalyticsRange] = useState('30d'); // '7d' | '30d' | '90d' | 'ytd'
  const [chartType, setChartType] = useState('area'); // 'area' | 'bar' | 'line'
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [visibleMetrics, setVisibleMetrics] = useState({
    projectViews: true,
    collaborationInvites: true,
    profileVisits: true
  });

  // S3 Uploader States
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState('showreel');
  const [uploadEmbedUrl, setUploadEmbedUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalyticsData(analyticsRange);
    }
  }, [activeTab, analyticsRange, currentUser]);

  const fetchDashboardData = () => {
    setLoading(true);
    const talentId = currentUser?.profile?.id || 'talent-1';

    Promise.all([
      fetch(`/api/talents/${talentId}`).then(res => res.json()),
      fetch(`/api/applications?talent_id=${talentId}`).then(res => res.json())
    ])
      .then(([talentData, appData]) => {
        if (talentData.talent) {
          setProfile(talentData.talent);
        }
        setMediaList(talentData.portfolio || []);
        setApplications(appData.applications || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading dashboard:', err);
        setLoading(false);
      });
  };

  const fetchAnalyticsData = (range) => {
    setLoadingAnalytics(true);
    const talentId = currentUser?.profile?.id || 'talent-1';

    fetch(`/api/talents/${talentId}/analytics?range=${range}`)
      .then(res => res.json())
      .then(data => {
        setAnalyticsData(data);
        setLoadingAnalytics(false);
      })
      .catch(err => {
        console.error('Error fetching analytics:', err);
        setLoadingAnalytics(false);
      });
  };

  const toggleMetricVisibility = (key) => {
    setVisibleMetrics(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage('');

    try {
      const targetId = profile?.id || currentUser?.profile?.id || 'talent-1';
      const response = await fetch(`/api/talents/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile || {})
      });

      const data = await response.json();
      setSavingProfile(false);
      if (response.ok) {
        setProfileMessage('✅ Profile details updated successfully.');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setSavingProfile(false);
      setProfileMessage('❌ Failed to update profile.');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadTitle && !uploadFile && !uploadEmbedUrl) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const fileName = uploadFile ? uploadFile.name : 'showreel_2026.mp4';
      const fileType = uploadFile ? uploadFile.type : 'video/mp4';

      setUploadProgress(35);

      const s3Res = await fetch('/api/upload/s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileType, category: 'portfolios' })
      });

      const s3Data = await s3Res.json();
      setUploadProgress(70);

      const targetTalentId = profile?.id || currentUser?.profile?.id || 'talent-1';
      const mediaPayload = {
        title: uploadTitle || 'New Media Showcase',
        description: 'Uploaded via CineCraft S3 Vault',
        media_type: uploadType,
        file_url: s3Data.fileUrl,
        s3_key: s3Data.s3Key,
        embed_url: uploadEmbedUrl
      };

      const mediaRes = await fetch(`/api/talents/${targetTalentId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mediaPayload)
      });

      const newMediaData = await mediaRes.json();
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        if (newMediaData.media) {
          setMediaList(prev => [...prev, newMediaData.media]);
        }
        setUploadTitle('');
        setUploadEmbedUrl('');
        setUploadFile(null);
        setUploadProgress(0);
        setTimeout(() => setUploadSuccess(false), 3000);
      }, 500);
    } catch (err) {
      console.error('S3 Upload failed:', err);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Custom Recharts Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b0b0d] border border-[#f8f7f4]/20 p-3 shadow-2xl font-mono-code text-[0.65rem] space-y-1.5 min-w-[180px]">
          <p className="text-[#f8f7f4] font-bold uppercase border-b border-[#f8f7f4]/10 pb-1 text-[0.6rem] tracking-wider">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span style={{ color: entry.color }} className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-extrabold text-white">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

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
        
        {/* HEADER */}
        <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 font-mono-code">
          <div className="flex items-center gap-4">
            <img
              src={profile?.avatar_url || currentUser?.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
              alt={profile?.full_name}
              className="w-16 h-16 object-cover border border-[#f8f7f4]/20 grayscale hover:grayscale-0 transition-all"
            />
            <div>
              <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-0.5">
                Talent Control Center // CineCraft
              </span>
              <h1 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#f8f7f4]">{profile?.full_name}</h1>
              <p className="text-[0.7rem] text-[#f8f7f4]/80 font-bold uppercase tracking-wider">{profile?.tagline}</p>
              <p className="text-[0.65rem] text-[#f8f7f4]/60 uppercase tracking-wider mt-1">📍 {profile?.location} &bull; Day Rate: ${profile?.day_rate}/day</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('talent_detail', { id: profile?.id || currentUser?.profile?.id || 'talent-1' })}
              className="px-5 py-3 bg-[#0b0b0d] hover:bg-[#18181c] text-[#f8f7f4] border border-[#f8f7f4]/20 text-[0.65rem] font-bold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Preview Public Profile &rarr;
            </button>
          </div>
        </div>

        {/* DASHBOARD TAB NAVIGATION */}
        <div className="flex flex-wrap gap-2 border-b border-[#f8f7f4]/10 pb-3 font-mono-code">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-widest transition-all cursor-pointer border flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-[#ff3e00] text-white border-[#ff3e00]'
                : 'bg-[#111114] text-[#f8f7f4]/60 border-[#f8f7f4]/10 hover:text-[#f8f7f4]'
            }`}
          >
            📊 Profile Analytics
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-widest transition-all cursor-pointer border ${
              activeTab === 'vault'
                ? 'bg-[#f8f7f4] text-[#0b0b0d] border-[#f8f7f4]'
                : 'bg-[#111114] text-[#f8f7f4]/60 border-[#f8f7f4]/10 hover:text-[#f8f7f4]'
            }`}
          >
            📁 S3 Cloud Vault ({mediaList.length})
          </button>

          <button
            onClick={() => setActiveTab('edit_profile')}
            className={`px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-widest transition-all cursor-pointer border ${
              activeTab === 'edit_profile'
                ? 'bg-[#f8f7f4] text-[#0b0b0d] border-[#f8f7f4]'
                : 'bg-[#111114] text-[#f8f7f4]/60 border-[#f8f7f4]/10 hover:text-[#f8f7f4]'
            }`}
          >
            ⚙ Edit Professional Specs
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-widest transition-all cursor-pointer border ${
              activeTab === 'applications'
                ? 'bg-[#f8f7f4] text-[#0b0b0d] border-[#f8f7f4]'
                : 'bg-[#111114] text-[#f8f7f4]/60 border-[#f8f7f4]/10 hover:text-[#f8f7f4]'
            }`}
          >
            📋 Applications ({applications.length})
          </button>
        </div>

        {/* ================= SECTION 1: PROFILE ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 font-mono-code">
            
            {/* ANALYTICS HEADER & CONTROLS */}
            <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f8f7f4]/10 pb-4">
                <div>
                  <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-1">
                    Performance Metrics // Realtime Engagement
                  </span>
                  <h2 className="font-syne text-2xl font-bold uppercase tracking-tight text-[#f8f7f4]">
                    Profile & Portfolio Reach
                  </h2>
                  <p className="text-[0.65rem] text-[#f8f7f4]/60 uppercase tracking-wider mt-0.5">
                    Visualizing project showreel plays, direct producer collaboration invites, and profile directory visits.
                  </p>
                </div>

                {/* RANGE SELECTOR BUTTONS */}
                <div className="flex items-center gap-1.5 bg-[#0b0b0d] p-1 border border-[#f8f7f4]/10">
                  {[
                    { id: '7d', label: '7 Days' },
                    { id: '30d', label: '30 Days' },
                    { id: '90d', label: '90 Days' },
                    { id: 'ytd', label: 'YTD' }
                  ].map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => setAnalyticsRange(btn.id)}
                      className={`px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        analyticsRange === btn.id
                          ? 'bg-[#ff3e00] text-white'
                          : 'text-[#f8f7f4]/60 hover:text-white'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* STATS SUMMARY METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* CARD 1: PROJECT VIEWS */}
                <div
                  onClick={() => toggleMetricVisibility('projectViews')}
                  className={`p-5 bg-[#0b0b0d] border transition-all cursor-pointer ${
                    visibleMetrics.projectViews ? 'border-[#3b82f6]' : 'border-[#f8f7f4]/10 opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#3b82f6]">
                      🎬 Project Views
                    </span>
                    <span className="text-[0.55rem] font-bold px-1.5 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] uppercase">
                      +24.1%
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-syne mb-1">
                    {analyticsData?.totals?.projectViews?.toLocaleString() || '3,890'}
                  </div>
                  <p className="text-[0.6rem] text-[#f8f7f4]/60 uppercase">Portfolio reels & stills plays</p>
                </div>

                {/* CARD 2: COLLABORATION INVITES */}
                <div
                  onClick={() => toggleMetricVisibility('collaborationInvites')}
                  className={`p-5 bg-[#0b0b0d] border transition-all cursor-pointer ${
                    visibleMetrics.collaborationInvites ? 'border-[#00ff00]' : 'border-[#f8f7f4]/10 opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#00ff00]">
                      ✉️ Collaboration Invites
                    </span>
                    <span className="text-[0.55rem] font-bold px-1.5 py-0.5 bg-[#00ff00]/20 text-[#00ff00] uppercase">
                      +12.5%
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-syne mb-1">
                    {analyticsData?.totals?.collaborationInvites?.toLocaleString() || '48'}
                  </div>
                  <p className="text-[0.6rem] text-[#f8f7f4]/60 uppercase">Direct job calls & shortlists</p>
                </div>

                {/* CARD 3: PROFILE VISITS */}
                <div
                  onClick={() => toggleMetricVisibility('profileVisits')}
                  className={`p-5 bg-[#0b0b0d] border transition-all cursor-pointer ${
                    visibleMetrics.profileVisits ? 'border-[#ff3e00]' : 'border-[#f8f7f4]/10 opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#ff3e00]">
                      👁️ Profile Visits
                    </span>
                    <span className="text-[0.55rem] font-bold px-1.5 py-0.5 bg-[#ff3e00]/20 text-[#ff3e00] uppercase">
                      +18.4%
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-syne mb-1">
                    {analyticsData?.totals?.profileVisits?.toLocaleString() || '1,420'}
                  </div>
                  <p className="text-[0.6rem] text-[#f8f7f4]/60 uppercase">Unique agency impressions</p>
                </div>

                {/* CARD 4: BOOKING CONVERSION */}
                <div className="p-5 bg-[#0b0b0d] border border-[#f8f7f4]/10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#f8f7f4]/80">
                      🤝 Booking Rate
                    </span>
                    <span className="text-[0.55rem] font-bold px-1.5 py-0.5 bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 uppercase">
                      High Demand
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-syne mb-1">
                    {analyticsData?.totals?.conversionRate || '68.4%'}
                  </div>
                  <p className="text-[0.6rem] text-[#f8f7f4]/60 uppercase">Invites converted to bookings</p>
                </div>

              </div>

              {/* CHART VISUALIZATION CANVAS */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f8f7f4]/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#f8f7f4]">
                      Engagement Timeline
                    </span>
                    <span className="text-[0.6rem] text-[#f8f7f4]/40 uppercase">
                      ({analyticsData?.chartData?.length || 30} data points)
                    </span>
                  </div>

                  {/* CHART TYPE TOGGLE & METRIC CHECKS */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-wider text-[#f8f7f4]/70">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleMetrics.projectViews}
                          onChange={() => toggleMetricVisibility('projectViews')}
                          className="accent-[#3b82f6]"
                        />
                        <span className="text-[#3b82f6] font-bold">Project Views</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleMetrics.collaborationInvites}
                          onChange={() => toggleMetricVisibility('collaborationInvites')}
                          className="accent-[#00ff00]"
                        />
                        <span className="text-[#00ff00] font-bold">Invites</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleMetrics.profileVisits}
                          onChange={() => toggleMetricVisibility('profileVisits')}
                          className="accent-[#ff3e00]"
                        />
                        <span className="text-[#ff3e00] font-bold">Visits</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-1 bg-[#0b0b0d] p-1 border border-[#f8f7f4]/10 text-[0.6rem]">
                      {['area', 'bar', 'line'].map(type => (
                        <button
                          key={type}
                          onClick={() => setChartType(type)}
                          className={`px-2.5 py-1 font-bold uppercase tracking-wider cursor-pointer ${
                            chartType === type ? 'bg-[#f8f7f4] text-[#0b0b0d]' : 'text-[#f8f7f4]/60 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RECHARTS SVG CONTAINER */}
                <div className="bg-[#0b0b0d] border border-[#f8f7f4]/10 p-4 pt-6">
                  {loadingAnalytics ? (
                    <div className="h-[320px] flex items-center justify-center">
                      <div className="animate-spin rounded-none h-8 w-8 border-t-2 border-b-2 border-[#ff3e00]" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      {chartType === 'area' ? (
                        <AreaChart data={analyticsData?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorProjectViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="colorInvites" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00ff00" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#00ff00" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="colorProfileVisits" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ff3e00" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#ff3e00" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f8f7f4" strokeOpacity={0.07} />
                          <XAxis dataKey="date" stroke="#f8f7f4" strokeOpacity={0.4} tick={{ fill: '#f8f7f4', fontSize: 10, opacity: 0.6 }} />
                          <YAxis stroke="#f8f7f4" strokeOpacity={0.4} tick={{ fill: '#f8f7f4', fontSize: 10, opacity: 0.6 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', paddingTop: '10px' }} />
                          {visibleMetrics.projectViews && (
                            <Area type="monotone" dataKey="projectViews" name="Project Views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorProjectViews)" />
                          )}
                          {visibleMetrics.collaborationInvites && (
                            <Area type="monotone" dataKey="collaborationInvites" name="Collaboration Invites" stroke="#00ff00" strokeWidth={2} fillOpacity={1} fill="url(#colorInvites)" />
                          )}
                          {visibleMetrics.profileVisits && (
                            <Area type="monotone" dataKey="profileVisits" name="Profile Visits" stroke="#ff3e00" strokeWidth={2} fillOpacity={1} fill="url(#colorProfileVisits)" />
                          )}
                        </AreaChart>
                      ) : chartType === 'bar' ? (
                        <BarChart data={analyticsData?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f8f7f4" strokeOpacity={0.07} />
                          <XAxis dataKey="date" stroke="#f8f7f4" strokeOpacity={0.4} tick={{ fill: '#f8f7f4', fontSize: 10, opacity: 0.6 }} />
                          <YAxis stroke="#f8f7f4" strokeOpacity={0.4} tick={{ fill: '#f8f7f4', fontSize: 10, opacity: 0.6 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', paddingTop: '10px' }} />
                          {visibleMetrics.projectViews && (
                            <Bar dataKey="projectViews" name="Project Views" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                          )}
                          {visibleMetrics.collaborationInvites && (
                            <Bar dataKey="collaborationInvites" name="Collaboration Invites" fill="#00ff00" radius={[2, 2, 0, 0]} />
                          )}
                          {visibleMetrics.profileVisits && (
                            <Bar dataKey="profileVisits" name="Profile Visits" fill="#ff3e00" radius={[2, 2, 0, 0]} />
                          )}
                        </BarChart>
                      ) : (
                        <LineChart data={analyticsData?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f8f7f4" strokeOpacity={0.07} />
                          <XAxis dataKey="date" stroke="#f8f7f4" strokeOpacity={0.4} tick={{ fill: '#f8f7f4', fontSize: 10, opacity: 0.6 }} />
                          <YAxis stroke="#f8f7f4" strokeOpacity={0.4} tick={{ fill: '#f8f7f4', fontSize: 10, opacity: 0.6 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', paddingTop: '10px' }} />
                          {visibleMetrics.projectViews && (
                            <Line type="monotone" dataKey="projectViews" name="Project Views" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 2 }} />
                          )}
                          {visibleMetrics.collaborationInvites && (
                            <Line type="monotone" dataKey="collaborationInvites" name="Collaboration Invites" stroke="#00ff00" strokeWidth={2.5} dot={{ r: 2 }} />
                          )}
                          {visibleMetrics.profileVisits && (
                            <Line type="monotone" dataKey="profileVisits" name="Profile Visits" stroke="#ff3e00" strokeWidth={2.5} dot={{ r: 2 }} />
                          )}
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* BREAKDOWN SECTION: TOP TRAFFIC SOURCES & TOP PERFORMING PROJECTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* BREAKDOWN 1: TRAFFIC SOURCES */}
              <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 space-y-4">
                <div className="border-b border-[#f8f7f4]/10 pb-3">
                  <span className="text-[0.6rem] uppercase tracking-widest text-[#ff3e00] block mb-0.5">
                    Acquisition Channels
                  </span>
                  <h3 className="font-syne text-lg font-bold uppercase tracking-tight text-[#f8f7f4]">
                    Top Traffic Sources
                  </h3>
                </div>

                <div className="space-y-3">
                  {(analyticsData?.topTrafficSources || [
                    { source: 'Direct Search & Directory', percentage: 42, count: 596 },
                    { source: 'Producer Shortlists', percentage: 28, count: 398 },
                    { source: 'Featured Showreel Placement', percentage: 18, count: 255 },
                    { source: 'External Portfolio Links', percentage: 12, count: 171 }
                  ]).map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[0.65rem] uppercase font-bold text-[#f8f7f4]">
                        <span>{item.source}</span>
                        <span className="text-[#ff3e00]">{item.percentage}% ({item.count} views)</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0b0b0d] overflow-hidden">
                        <div
                          className="h-full bg-[#ff3e00] transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BREAKDOWN 2: TOP PERFORMING PROJECTS */}
              <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 space-y-4">
                <div className="border-b border-[#f8f7f4]/10 pb-3">
                  <span className="text-[0.6rem] uppercase tracking-widest text-[#3b82f6] block mb-0.5">
                    Portfolio Engagement
                  </span>
                  <h3 className="font-syne text-lg font-bold uppercase tracking-tight text-[#f8f7f4]">
                    Most Viewed Projects & Reels
                  </h3>
                </div>

                <div className="space-y-3">
                  {(analyticsData?.topViewedProjects || [
                    { title: '2026 Commercial Showreel (4K)', views: 2022, category: 'Showreel' },
                    { title: 'ARRI Alexa Sci-Fi Narrative Stills', views: 1205, category: 'Photo' },
                    { title: 'Anamorphic Lens Test Reel', views: 663, category: 'Showreel' }
                  ]).map((proj, idx) => (
                    <div key={idx} className="bg-[#0b0b0d] border border-[#f8f7f4]/10 p-3.5 flex items-center justify-between">
                      <div className="space-y-0.5 pr-2">
                        <p className="text-[0.7rem] font-bold uppercase tracking-tight text-[#f8f7f4]">{proj.title}</p>
                        <p className="text-[0.6rem] text-[#f8f7f4]/50 uppercase font-mono-code">{proj.category} Media Asset</p>
                      </div>
                      <span className="text-[0.65rem] font-bold uppercase px-2.5 py-1 bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 shrink-0">
                        {proj.views.toLocaleString()} plays
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* PRODUCER ENGAGEMENT PULSE BANNER */}
            <div className="p-5 bg-[#00ff00]/10 border border-[#00ff00]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#00ff00] block">
                  🔥 Producer Engagement Insights
                </span>
                <p className="text-[0.7rem] font-bold text-white uppercase mt-0.5">
                  Peak Booking Activity: Tuesdays & Thursdays (10:00 AM – 2:00 PM PST)
                </p>
                <p className="text-[0.65rem] text-[#f8f7f4]/70 uppercase mt-0.5">
                  Your profile is currently saved in 14 agency shortlists across Los Angeles & New York.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('vault')}
                className="px-4 py-2.5 bg-[#00ff00] text-[#0b0b0d] font-bold uppercase text-[0.65rem] tracking-widest transition-all hover:bg-emerald-400 cursor-pointer w-fit shrink-0"
              >
                + Add Fresh Showreel to Vault
              </button>
            </div>

          </div>
        )}

        {/* ================= SECTION 2: S3 MEDIA UPLOADER ================= */}
        {activeTab === 'vault' && (
          <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 space-y-6 font-mono-code">
            <div className="border-b border-[#f8f7f4]/10 pb-4">
              <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-1">
                Cloud Vault
              </span>
              <h2 className="font-syne text-2xl font-bold uppercase tracking-tight text-[#f8f7f4] flex items-center gap-2">
                AWS S3 Media Vault Uploader
              </h2>
              <p className="text-[0.65rem] text-[#f8f7f4]/60 uppercase tracking-wider mt-1">
                Upload high-bitrate showreels, high-res stills, or Vimeo/YouTube embed URLs to your portfolio.
              </p>
            </div>

            {uploadSuccess && (
              <div className="p-4 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[0.65rem] font-bold uppercase tracking-wider text-[#00ff00]">
                🎉 Media successfully processed & attached to portfolio!
              </div>
            )}

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6">
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">Title of Media / Reel</label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. 2026 COMMERCIAL SHOWREEL (4K)"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">Media Type</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  >
                    <option value="showreel">Video Showreel</option>
                    <option value="photo">Photo / Stills</option>
                    <option value="audio_sample">Audio / Location Sound</option>
                    <option value="headshot">Headshot</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">Vimeo / YouTube Link</label>
                  <input
                    type="text"
                    placeholder="HTTPS://VIMEO.COM/..."
                    value={uploadEmbedUrl}
                    onChange={(e) => setUploadEmbedUrl(e.target.value)}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>
              </div>

              <div className="border border-dashed border-[#f8f7f4]/20 hover:border-[#f8f7f4]/40 p-6 text-center bg-[#0b0b0d] transition-all cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="video/*,image/*,audio/*"
                  onChange={(e) => setUploadFile(e.target.files[0] || null)}
                />
                <label htmlFor="file-upload" className="cursor-pointer space-y-1 block">
                  <p className="text-xl">📁</p>
                  <p className="text-[0.7rem] font-bold uppercase text-[#f8f7f4]">
                    {uploadFile ? uploadFile.name : 'Click or Drag video/image file here'}
                  </p>
                  <p className="text-[0.6rem] uppercase tracking-widest text-[#f8f7f4]/50">Supports ProRes, MP4, MOV, WAV, RAW Stills up to 500MB</p>
                </label>
              </div>

              {isUploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[0.6rem] uppercase tracking-widest text-[#f8f7f4]/70">
                    <span>Uploading to S3 Bucket...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#0b0b0d] overflow-hidden">
                    <div className="h-full bg-[#ff3e00] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-3 bg-[#f8f7f4] hover:bg-white text-[#0b0b0d] font-bold uppercase text-[0.7rem] tracking-widest transition-all cursor-pointer disabled:opacity-50"
              >
                Upload to Cloud Vault
              </button>
            </form>

            <div className="pt-4 border-t border-[#f8f7f4]/10">
              <h3 className="text-[0.65rem] font-bold uppercase tracking-wider text-[#f8f7f4]/80 mb-3">Your Portfolio Items ({mediaList.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {mediaList.map((item) => (
                  <div key={item.id} className="bg-[#0b0b0d] border border-[#f8f7f4]/10 p-3 flex items-center justify-between">
                    <div className="truncate pr-2">
                      <p className="text-[0.7rem] font-bold uppercase tracking-tight text-[#f8f7f4] truncate">{item.title}</p>
                      <p className="text-[0.6rem] font-bold text-[#f8f7f4]/60 uppercase">{item.media_type}</p>
                    </div>
                    <span className="text-[0.6rem] text-[#00ff00] font-bold uppercase tracking-widest shrink-0 border border-[#00ff00]/30 px-2 py-0.5">S3 Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 3: EDIT PROFILE SPECS ================= */}
        {activeTab === 'edit_profile' && (
          <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 space-y-6 font-mono-code">
            <div className="border-b border-[#f8f7f4]/10 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block mb-1">
                  Account Specs
                </span>
                <h2 className="font-syne text-2xl font-bold uppercase tracking-tight text-[#f8f7f4]">Edit Professional Profile</h2>
                <p className="text-[0.65rem] text-[#f8f7f4]/60 uppercase tracking-wider mt-1">Keep your day rates, availability, and camera packages up to date.</p>
              </div>
              {profileMessage && <span className="text-[0.65rem] font-bold uppercase text-[#ff3e00]">{profileMessage}</span>}
            </div>

            {profile && (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">Tagline / Headline</label>
                    <input
                      type="text"
                      value={profile.tagline || ''}
                      onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                      className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">Location Hub</label>
                    <input
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">Day Rate ($)</label>
                    <input
                      type="number"
                      value={profile.day_rate || 1000}
                      onChange={(e) => setProfile({ ...profile, day_rate: Number(e.target.value) })}
                      className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">Union Status</label>
                    <select
                      value={profile.union_status || 'non_union'}
                      onChange={(e) => setProfile({ ...profile, union_status: e.target.value })}
                      className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                    >
                      <option value="iatse_600">IATSE Local 600</option>
                      <option value="dga">DGA</option>
                      <option value="sag_aftra">SAG-AFTRA</option>
                      <option value="non_union">Non-Union</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.is_available ?? true}
                        onChange={(e) => setProfile({ ...profile, is_available: e.target.checked })}
                        className="w-3.5 h-3.5 bg-[#0b0b0d] border-[#f8f7f4]/20 text-[#ff3e00]"
                      />
                      <span className="text-[0.65rem] uppercase tracking-wider text-[#f8f7f4]">Available for Immediate Hire</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">Owned Camera & Equipment Inventory</label>
                  <textarea
                    rows={2}
                    value={profile.equipment_list || ''}
                    onChange={(e) => setProfile({ ...profile, equipment_list: e.target.value })}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] uppercase tracking-widest text-[#f8f7f4]/70 mb-1">Bio / Credits Summary</label>
                  <textarea
                    rows={4}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full bg-[#0b0b0d] text-[#f8f7f4] px-3 py-2.5 text-[0.7rem] border border-[#f8f7f4]/10 focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-[#f8f7f4] hover:bg-white text-[#0b0b0d] font-bold uppercase text-[0.7rem] tracking-widest transition-all cursor-pointer"
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= SECTION 4: SUBMITTED APPLICATIONS ================= */}
        {activeTab === 'applications' && (
          <div className="bg-[#111114] border border-[#f8f7f4]/10 p-6 sm:p-8 space-y-4 font-mono-code">
            <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] block">
              Activity Tracking
            </span>
            <h2 className="font-syne text-2xl font-bold uppercase tracking-tight text-[#f8f7f4]">Submitted Job Applications ({applications.length})</h2>
            
            {applications.length === 0 ? (
              <p className="text-[0.65rem] text-[#f8f7f4]/60 uppercase">No active job applications submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="bg-[#0b0b0d] p-4 border border-[#f8f7f4]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-[0.75rem] font-bold uppercase text-[#f8f7f4]">{app.job_title}</h3>
                      <p className="text-[0.65rem] font-bold uppercase text-[#f8f7f4]/60 mt-0.5">Bid Rate: ${app.bid_rate} &bull; Submitted on {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 border ${
                      app.status === 'shortlisted' ? 'bg-[#ff3e00]/10 text-[#ff3e00] border-[#ff3e00]/30' :
                      app.status === 'hired' ? 'bg-[#00ff00]/10 text-[#00ff00] border-[#00ff00]/30' :
                      'bg-[#111114] text-[#f8f7f4]/60 border-[#f8f7f4]/10'
                    }`}>
                      Status: {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

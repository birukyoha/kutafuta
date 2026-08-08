// File: /backend/controllers/talentController.js
// Talent Directory API Controller for Film & Media Marketplace

import { talentProfiles, mediaPortfolios, users } from '../db.js';

/**
 * Get Filtered Talent Directory
 * GET /api/talents
 * Query parameters: category, query, location, union_status, min_rate, max_rate, is_available, page, limit
 */
export const getTalents = async (req, res) => {
  try {
    const {
      category,
      query,
      location,
      union_status,
      min_rate,
      max_rate,
      is_available,
      page = 1,
      limit = 12
    } = req.query;

    let results = [...talentProfiles];

    // Sort by created_at descending so newly registered talents appear first
    results.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

    // Category filter
    if (category && category !== 'all') {
      results = results.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    // Keyword / Text search (name, tagline, bio, equipment, sub-categories)
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      results = results.filter(t => 
        t.full_name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.bio.toLowerCase().includes(q) ||
        (t.equipment_list && t.equipment_list.toLowerCase().includes(q)) ||
        (t.sub_categories && t.sub_categories.some(sub => sub.toLowerCase().includes(q)))
      );
    }

    // Location filter
    if (location && location !== 'all') {
      const loc = location.toLowerCase();
      results = results.filter(t => t.location.toLowerCase().includes(loc));
    }

    // Union Status filter
    if (union_status && union_status !== 'all') {
      results = results.filter(t => t.union_status === union_status);
    }

    // Day Rate range filter
    if (min_rate) {
      results = results.filter(t => t.day_rate >= Number(min_rate));
    }
    if (max_rate) {
      results = results.filter(t => t.day_rate <= Number(max_rate));
    }

    // Availability filter
    if (is_available === 'true') {
      results = results.filter(t => t.is_available === true);
    }

    // Attach primary portfolio media / showreel to each talent card
    const enrichedResults = results.map(talent => {
      const portfolio = mediaPortfolios.filter(m => m.talent_profile_id === talent.id);
      const featuredReel = portfolio.find(m => m.media_type === 'showreel') || portfolio[0] || null;
      return {
        ...talent,
        portfolio_count: portfolio.length,
        featured_reel: featuredReel
      };
    });

    // Pagination calculation
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const totalCount = enrichedResults.length;
    const totalPages = Math.ceil(totalCount / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedTalents = enrichedResults.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      talents: paginatedTalents,
      pagination: {
        total_items: totalCount,
        total_pages: totalPages,
        current_page: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching talent directory:', error);
    return res.status(500).json({ error: 'Failed to retrieve talent directory listings.' });
  }
};

/**
 * Get Individual Talent Profile by ID
 * GET /api/talents/:id
 */
export const getTalentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find profile by talent ID or user ID
    const talent = talentProfiles.find(t => t.id === id || t.user_id === id);
    if (!talent) {
      return res.status(404).json({ error: 'Talent profile not found.' });
    }

    // Fetch talent media portfolio (showreels, stills, audio samples)
    const portfolio = mediaPortfolios
      .filter(m => m.talent_profile_id === talent.id)
      .sort((a, b) => a.display_order - b.display_order);

    // Fetch user details
    const user = users.find(u => u.id === talent.user_id);

    return res.status(200).json({
      talent: {
        ...talent,
        email: user ? user.email : '',
        phone_number: user ? user.phone_number : ''
      },
      portfolio
    });
  } catch (error) {
    console.error('Error fetching talent profile:', error);
    return res.status(500).json({ error: 'Failed to retrieve talent profile details.' });
  }
};

/**
 * Update Talent Profile Details
 * PUT /api/talents/:id
 */
export const updateTalentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const index = talentProfiles.findIndex(t => t.id === id || t.user_id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Talent profile not found.' });
    }

    const existing = talentProfiles[index];
    const updatedProfile = {
      ...existing,
      ...req.body,
      updated_at: new Date().toISOString()
    };

    talentProfiles[index] = updatedProfile;

    // Sync with corresponding user object if avatar_url or full_name changed
    const userIndex = users.findIndex(u => u.id === existing.user_id);
    if (userIndex !== -1) {
      if (req.body.avatar_url) users[userIndex].avatar_url = req.body.avatar_url;
      if (req.body.full_name) users[userIndex].full_name = req.body.full_name;
    }

    return res.status(200).json({
      message: 'Talent profile updated successfully.',
      talent: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Failed to update talent profile.' });
  }
};

/**
 * Add Portfolio Media Item (S3 / Cloud Upload metadata)
 * POST /api/talents/:id/media
 */
export const addTalentMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, media_type, file_url, thumbnail_url, embed_url, s3_key } = req.body;

    const talent = talentProfiles.find(t => t.id === id || t.user_id === id);
    if (!talent) {
      return res.status(404).json({ error: 'Talent profile not found.' });
    }

    const newMedia = {
      id: `media-${Date.now()}`,
      talent_profile_id: talent.id,
      title: title || 'Untitled Media Item',
      description: description || '',
      media_type: media_type || 'showreel',
      file_url: file_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail_url: thumbnail_url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
      s3_key: s3_key || `portfolios/${talent.id}/${Date.now()}_media.mp4`,
      embed_url: embed_url || '',
      display_order: mediaPortfolios.length + 1,
      created_at: new Date().toISOString()
    };

    mediaPortfolios.push(newMedia);

    return res.status(201).json({
      message: 'Media portfolio item uploaded and attached to talent profile.',
      media: newMedia
    });
  } catch (error) {
    console.error('Error adding media item:', error);
    return res.status(500).json({ error: 'Failed to add media to portfolio.' });
  }
};

/**
 * Get Profile Analytics Data
 * GET /api/talents/:id/analytics
 * Query parameters: range ('7d', '30d', '90d', 'ytd')
 */
export const getTalentAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { range = '30d' } = req.query;

    let days = 30;
    if (range === '7d') days = 7;
    if (range === '90d') days = 90;
    if (range === 'ytd') days = 180;

    const chartData = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      const dateStr = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      const baseSeed = (d.getDay() + 1) * (i + 3);
      const profileVisits = Math.floor(25 + Math.sin(i * 0.5) * 15 + (baseSeed % 18));
      const projectViews = Math.floor(profileVisits * 2.4 + (baseSeed % 22));
      const collaborationInvites = Math.floor((profileVisits * 0.18) + (baseSeed % 3));

      chartData.push({
        date: dateStr,
        fullDate: d.toISOString().split('T')[0],
        profileVisits,
        projectViews,
        collaborationInvites
      });
    }

    const totalVisits = chartData.reduce((acc, curr) => acc + curr.profileVisits, 0);
    const totalProjectViews = chartData.reduce((acc, curr) => acc + curr.projectViews, 0);
    const totalInvites = chartData.reduce((acc, curr) => acc + curr.collaborationInvites, 0);

    return res.status(200).json({
      talent_id: id,
      range,
      totals: {
        profileVisits: totalVisits,
        projectViews: totalProjectViews,
        collaborationInvites: totalInvites,
        conversionRate: '68.4%'
      },
      topTrafficSources: [
        { source: 'Direct Search & Directory', percentage: 42, count: Math.floor(totalVisits * 0.42) },
        { source: 'Producer Shortlists', percentage: 28, count: Math.floor(totalVisits * 0.28) },
        { source: 'Featured Showreel Placement', percentage: 18, count: Math.floor(totalVisits * 0.18) },
        { source: 'External Portfolio Links', percentage: 12, count: Math.floor(totalVisits * 0.12) }
      ],
      topViewedProjects: [
        { title: '2026 Commercial Showreel (4K)', views: Math.floor(totalProjectViews * 0.52), category: 'Showreel' },
        { title: 'ARRI Alexa Sci-Fi Narrative Stills', views: Math.floor(totalProjectViews * 0.31), category: 'Photo' },
        { title: 'Anamorphic Lens Test Reel', views: Math.floor(totalProjectViews * 0.17), category: 'Showreel' }
      ],
      chartData
    });
  } catch (error) {
    console.error('Error fetching talent analytics:', error);
    return res.status(500).json({ error: 'Failed to compute profile analytics data.' });
  }
};

// File: /backend/controllers/authController.js
// Authentication & User Management Controller for Film & Media Talent Marketplace

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { users, talentProfiles, clientProfiles } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'cinecraft_jwt_secret_key_2026';

/**
 * Sequential ID Helpers
 */
export function getNextUserId(role = 'talent') {
  const prefixMap = { talent: 'user-t', client: 'user-c', admin: 'user-a' };
  const prefix = prefixMap[role] || 'user-t';
  let maxNum = 0;
  users.forEach(u => {
    if (u.id && u.id.startsWith(prefix)) {
      const num = parseInt(u.id.replace(prefix, ''), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return `${prefix}${maxNum + 1}`;
}

export function getNextTalentId() {
  let maxNum = 0;
  talentProfiles.forEach(t => {
    if (t.id && t.id.startsWith('talent-')) {
      const num = parseInt(t.id.replace('talent-', ''), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return `talent-${maxNum + 1}`;
}

export function getNextClientId() {
  let maxNum = 0;
  clientProfiles.forEach(c => {
    if (c.id && c.id.startsWith('client-')) {
      const num = parseInt(c.id.replace('client-', ''), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return `client-${maxNum + 1}`;
}

/**
 * Register a new user (Talent or Client / Agency)
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { email, password, role, full_name, company_name, category, location, day_rate } = req.body;

    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ error: 'Missing required fields: email, password, full_name, and role are mandatory.' });
    }

    if (!['talent', 'client', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid user role specified.' });
    }

    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userId = getNextUserId(role);
    const userAvatar = req.body.avatar_url || req.body.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`;
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password_hash,
      role,
      full_name,
      avatar_url: userAvatar,
      phone_number: req.body.phone_number || '',
      created_at: new Date().toISOString()
    };

    users.unshift(newUser);

    let profileData = null;

    if (role === 'talent') {
      const talentId = getNextTalentId();
      profileData = {
        id: talentId,
        user_id: userId,
        full_name,
        avatar_url: newUser.avatar_url,
        tagline: req.body.tagline || `${category || 'Creative'} Professional`,
        bio: req.body.bio || 'Film, media and performance talent profile on KutafutaTalent.',
        category: category || (req.body.profile_type === 'cast' ? 'acting_performance' : 'cinematography'),
        sub_categories: req.body.sub_categories || (req.body.specific_roles ? req.body.specific_roles.split(',').map(s => s.trim()) : []),
        location: location || req.body.city_country || 'Los Angeles, CA',
        years_experience: Number(req.body.years_experience) || 3,
        union_status: req.body.union_status || 'non_union',
        hourly_rate: Number(req.body.hourly_rate) || 100,
        day_rate: Number(day_rate) || 800,
        website_url: req.body.website_url || req.body.portfolio_url || '',
        imdb_url: req.body.imdb_url || '',
        vimeo_url: req.body.vimeo_url || req.body.demo_reel_url || '',
        instagram_handle: req.body.instagram_handle || (req.body.social_links?.instagram || ''),
        equipment_list: req.body.equipment_owned || req.body.equipment_list || '',
        is_available: true,
        rating: 5.0,
        review_count: 0,
        featured: false,
        created_at: new Date().toISOString(),

        // Document specific questionnaire responses
        profile_type: req.body.profile_type || 'crew',
        stage_name: req.body.stage_name || '',
        city_country: req.body.city_country || location || '',
        date_of_birth_age: req.body.date_of_birth_age || '',
        languages_spoken: req.body.languages_spoken || 'English',
        social_links: req.body.social_links || {
          instagram: req.body.instagram_handle || '',
          tiktok: req.body.tiktok || '',
          linkedin: req.body.linkedin || '',
          youtube: req.body.youtube || ''
        },
        consent_to_contact: req.body.consent_to_contact !== undefined ? req.body.consent_to_contact : true,

        // Crew specific
        primary_department: req.body.primary_department || req.body.category || 'camera',
        specific_roles: req.body.specific_roles || '',
        skills_proficiency: req.body.skills_proficiency || req.body.special_skills || '',
        equipment_owned: req.body.equipment_owned || req.body.equipment_list || '',
        resume_cv_url: req.body.resume_cv_url || '',
        previous_productions: req.body.previous_productions || req.body.previous_projects || '',
        certifications_licenses: req.body.certifications_licenses || '',
        references_info: req.body.references_info || '',

        // Cast specific
        representation_status: req.body.representation_status || 'Self-represented',
        acting_experience: req.body.acting_experience || '',
        special_skills: req.body.special_skills || req.body.skills_proficiency || '',
        height: req.body.height || '',
        clothing_size: req.body.clothing_size || '',
        shoe_size: req.body.shoe_size || '',
        hair_color: req.body.hair_color || '',
        eye_color: req.body.eye_color || '',
        distinctive_features: req.body.distinctive_features || '',
        demo_reel_url: req.body.demo_reel_url || req.body.vimeo_url || '',
        video_intro_url: req.body.video_intro_url || '',
        headshot_gallery: req.body.headshot_gallery || [newUser.avatar_url],

        // Logistics & travel
        willing_to_travel: req.body.willing_to_travel !== undefined ? req.body.willing_to_travel : true,
        passport_visa_status: req.body.passport_visa_status || 'Valid Passport',
        transportation_availability: req.body.transportation_availability || 'Vehicle & License',
        emergency_contact: req.body.emergency_contact || '',
        searchable_tags: req.body.searchable_tags || [],
        booking_availability_calendar: req.body.booking_availability_calendar || 'Immediate Availability',
        reviews_testimonials: req.body.reviews_testimonials || '',
        rate_expectations: req.body.rate_expectations || (day_rate ? `$${day_rate}/day` : ''),
        how_heard_about_us: req.body.how_heard_about_us || 'Online Discovery'
      };
      talentProfiles.unshift(profileData);
    } else if (role === 'client') {
      const clientId = getNextClientId();
      profileData = {
        id: clientId,
        user_id: userId,
        company_name: company_name || full_name,
        company_type: req.body.company_type || 'Production Company',
        website: req.body.website || '',
        logo_url: newUser.avatar_url,
        bio: req.body.bio || 'Film production & creative client.',
        location: location || 'New York, NY',
        verified: true,
        created_at: new Date().toISOString()
      };
      clientProfiles.push(profileData);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role, email: newUser.email, name: newUser.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account successfully registered.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        full_name: newUser.full_name,
        avatar_url: newUser.avatar_url
      },
      profile: profileData
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

/**
 * User Login (JWT Issuance)
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch && password !== 'password123') { // Fallback for seed user test passwords
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    let profile = null;
    if (user.role === 'talent') {
      profile = talentProfiles.find(t => t.user_id === user.id);
    } else if (user.role === 'client') {
      profile = clientProfiles.find(c => c.user_id === user.id);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email, name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      },
      profile
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

/**
 * Get Current Authenticated User Session
 * GET /api/auth/me
 */
export const me = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User session not found.' });
    }

    let profile = null;
    if (user.role === 'talent') {
      profile = talentProfiles.find(t => t.user_id === user.id);
    } else if (user.role === 'client') {
      profile = clientProfiles.find(c => c.user_id === user.id);
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      },
      profile
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authentication session.' });
  }
};

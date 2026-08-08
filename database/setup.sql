-- ==============================================================================
-- KUTAFUTATALENT DATABASE MIGRATION SCRIPT (MySQL / MariaDB Dialect)
-- Designed for cPanel Shared Hosting (phpMyAdmin Import Ready)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS crew_calls;
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS job_listings;
DROP TABLE IF EXISTS media_portfolios;
DROP TABLE IF EXISTS talent_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS client_profiles;
DROP TABLE IF EXISTS talent_profiles;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE users (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('talent', 'client', 'admin') NOT NULL DEFAULT 'talent',
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT NULL,
  phone_number VARCHAR(50) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. TALENT PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE talent_profiles (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT NULL,
  tagline VARCHAR(255) NULL,
  bio TEXT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'cinematography',
  sub_categories JSON NULL,
  location VARCHAR(255) NOT NULL DEFAULT 'Los Angeles, CA',
  years_experience INT DEFAULT 0,
  union_status VARCHAR(50) DEFAULT 'non_union',
  hourly_rate DECIMAL(10, 2) DEFAULT 0.00,
  day_rate DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
  website_url TEXT NULL,
  imdb_url TEXT NULL,
  vimeo_url TEXT NULL,
  instagram_handle VARCHAR(100) NULL,
  equipment_list TEXT NULL,
  is_available TINYINT(1) DEFAULT 1,
  rating DECIMAL(3, 2) DEFAULT 5.00,
  review_count INT DEFAULT 0,
  featured TINYINT(1) DEFAULT 0,
  
  -- Additional Questionnaire / Portfolio Details
  profile_type VARCHAR(50) DEFAULT 'crew',
  stage_name VARCHAR(255) NULL,
  city_country VARCHAR(255) NULL,
  date_of_birth_age VARCHAR(100) NULL,
  languages_spoken VARCHAR(255) DEFAULT 'English',
  social_links JSON NULL,
  consent_to_contact TINYINT(1) DEFAULT 1,
  
  -- Crew Specific Fields
  primary_department VARCHAR(100) NULL,
  specific_roles TEXT NULL,
  skills_proficiency TEXT NULL,
  equipment_owned TEXT NULL,
  resume_cv_url TEXT NULL,
  previous_productions TEXT NULL,
  certifications_licenses TEXT NULL,
  references_info TEXT NULL,
  
  -- Cast Specific Fields
  representation_status VARCHAR(100) NULL,
  acting_experience TEXT NULL,
  special_skills TEXT NULL,
  height VARCHAR(50) NULL,
  clothing_size VARCHAR(50) NULL,
  shoe_size VARCHAR(50) NULL,
  hair_color VARCHAR(50) NULL,
  eye_color VARCHAR(50) NULL,
  distinctive_features TEXT NULL,
  demo_reel_url TEXT NULL,
  video_intro_url TEXT NULL,
  headshot_gallery JSON NULL,
  
  -- Logistics & Travel
  willing_to_travel TINYINT(1) DEFAULT 1,
  passport_visa_status VARCHAR(100) NULL,
  transportation_availability VARCHAR(100) NULL,
  emergency_contact TEXT NULL,
  searchable_tags JSON NULL,
  booking_availability_calendar TEXT NULL,
  reviews_testimonials TEXT NULL,
  rate_expectations VARCHAR(100) NULL,
  how_heard_about_us VARCHAR(100) NULL,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_talent_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_talent_category (category),
  INDEX idx_talent_location (location),
  INDEX idx_talent_day_rate (day_rate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. CLIENT PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE client_profiles (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  company_name VARCHAR(255) NOT NULL,
  company_type VARCHAR(100) NULL,
  website TEXT NULL,
  logo_url TEXT NULL,
  bio TEXT NULL,
  location VARCHAR(255) NULL,
  verified TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_client_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. SKILLS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE skills (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE talent_skills (
  talent_profile_id VARCHAR(36) NOT NULL,
  skill_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (talent_profile_id, skill_id),
  CONSTRAINT fk_ts_talent FOREIGN KEY (talent_profile_id) REFERENCES talent_profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_ts_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. MEDIA PORTFOLIOS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE media_portfolios (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  talent_profile_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  media_type ENUM('showreel', 'headshot', 'photo', 'audio_sample', 'document') NOT NULL DEFAULT 'showreel',
  file_url TEXT NOT NULL,
  thumbnail_url TEXT NULL,
  s3_key VARCHAR(500) NULL,
  embed_url TEXT NULL,
  display_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_media_talent FOREIGN KEY (talent_profile_id) REFERENCES talent_profiles(id) ON DELETE CASCADE,
  INDEX idx_media_talent (talent_profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. JOB LISTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE job_listings (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  client_name VARCHAR(255) NULL,
  client_logo TEXT NULL,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  project_type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  is_remote TINYINT(1) DEFAULT 0,
  shoot_dates VARCHAR(255) NOT NULL,
  budget_type VARCHAR(50) DEFAULT 'Day Rate',
  budget_min DECIMAL(10, 2) NOT NULL,
  budget_max DECIMAL(10, 2) NOT NULL,
  required_skills JSON NULL,
  union_requirement VARCHAR(50) DEFAULT 'non_union',
  description TEXT NOT NULL,
  status ENUM('open', 'in_review', 'filled', 'closed') DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_jobs_client FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE CASCADE,
  INDEX idx_jobs_status (status),
  INDEX idx_jobs_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. JOB APPLICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE job_applications (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  talent_id VARCHAR(36) NOT NULL,
  talent_name VARCHAR(255) NULL,
  talent_avatar TEXT NULL,
  talent_category VARCHAR(100) NULL,
  cover_letter TEXT NOT NULL,
  bid_rate DECIMAL(10, 2) NOT NULL,
  portfolio_links JSON NULL,
  status ENUM('applied', 'under_review', 'shortlisted', 'interviewing', 'hired', 'rejected') DEFAULT 'applied',
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES job_listings(id) ON DELETE CASCADE,
  CONSTRAINT fk_app_talent FOREIGN KEY (talent_id) REFERENCES talent_profiles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_job_talent (job_id, talent_id),
  INDEX idx_app_job (job_id),
  INDEX idx_app_talent (talent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. CREW CALLS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE crew_calls (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  client_id VARCHAR(36) NOT NULL,
  producer_name VARCHAR(255) NULL,
  call_title VARCHAR(255) NULL,
  department VARCHAR(100) NULL,
  project_type VARCHAR(100) NULL,
  crew_positions_needed INT DEFAULT 1,
  budget_range VARCHAR(255) NULL,
  location VARCHAR(255) NULL,
  shoot_dates VARCHAR(255) NULL,
  status VARCHAR(50) DEFAULT 'active',
  call_sheet_notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- INITIAL SEED DATA INSERTIONS
-- ==============================================================================

-- 1. USERS SEED
INSERT INTO users (id, email, password_hash, role, full_name, avatar_url, phone_number, created_at) VALUES
('user-t1', 'elena.rostova@cinema.io', '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.', 'talent', 'Elena Rostova', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', '+1 (310) 555-0192', '2025-01-10 10:00:00'),
('user-t2', 'marcus.vance@soundworks.com', '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.', 'talent', 'Marcus Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', '+1 (212) 555-0144', '2025-01-15 12:00:00'),
('user-t3', 'sora.takahashi@postvfx.io', '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.', 'talent', 'Sora Takahashi', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800', '+1 (415) 555-0188', '2025-02-01 14:30:00'),
('user-c1', 'producer@apexmedia.com', '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.', 'client', 'Apex Media Studios', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800', '+1 (310) 555-9000', '2025-01-05 09:00:00'),
('user-c2', 'creatives@luminaryagency.com', '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.', 'client', 'Luminary Ad Agency', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800', '+1 (212) 555-4422', '2025-01-08 11:15:00'),
('user-a1', 'admin@cinecraft.com', '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.', 'admin', 'Database Administrator', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', '+1 (800) 555-ADMIN', '2025-01-01 00:00:00');

-- 2. TALENT PROFILES SEED
INSERT INTO talent_profiles (id, user_id, full_name, avatar_url, tagline, bio, category, sub_categories, location, years_experience, union_status, hourly_rate, day_rate, website_url, imdb_url, vimeo_url, instagram_handle, equipment_list, is_available, rating, review_count, featured, created_at) VALUES
('talent-1', 'user-t1', 'Elena Rostova', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', 'Award-winning Director of Photography & Steadicam Owner/Operator', '12+ years shooting commercial campaigns for Nike, Apple, and Porsche, alongside indie feature films premiered at Sundance. Expert in ARRI Alexa 35, RED V-Raptor, anamorphic glass, and high-speed car tracking mounts.', 'cinematography', '["Commercial DP", "Steadicam Operator", "High Speed", "Anamorphic Specialist"]', 'Los Angeles, CA', 12, 'iatse_600', 220.00, 1800.00, 'https://elena-rostova-dp.com', 'https://imdb.com/name/nm920192', 'https://vimeo.com/elena_rostova', '@elena_dp', 'ARRI Alexa 35 Camera Package, Cooke Anamorphic/i Full Frame Lenses, Tiffen M-2 Steadicam Rig, Wireless Teradek 4K System, SmallHD Cine 13 Monitor', 1, 4.95, 28, 1, '2025-01-10 10:00:00'),
('talent-2', 'user-t2', 'Marcus Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', 'Production Sound Mixer & Boom Operator | Full Location Sound Package', 'Veteran location sound recordist with experience on feature films, high-budget commercials, and remote documentary shoots. Equipped with Sound Devices Scorpio, Lectrosonics wireless, and Schoeps/Sennheiser microphones.', 'sound_audio', '["Location Sound Mixer", "Boom Operator", "Sound Design"]', 'New York, NY', 9, 'non_union', 150.00, 1200.00, 'https://marcusvancesound.com', 'https://imdb.com/name/nm817261', 'https://vimeo.com/marcusvance', '@mvance_sound', 'Sound Devices Scorpio 32-Track Recorder, 6x Lectrosonics Digital Wireless Kits, Schoeps CMIT 5U Shotgun, Sennheiser MKH 416, Timecode Boxes', 1, 4.88, 19, 1, '2025-01-15 12:00:00'),
('talent-3', 'user-t3', 'Sora Takahashi', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800', 'Senior Film Editor & Colorist (DaVinci Resolve Certified)', 'Passionate lead post-production artist with 8+ years cut and color grading commercials, music videos, and episodic television. Focused on rhythm, emotion, and striking color palettes.', 'editing_post', '["Lead Editor", "Senior Colorist", "Finishing Artist"]', 'San Francisco, CA', 8, 'non_union', 140.00, 1100.00, 'https://soracolor.com', '', 'https://vimeo.com/sorata', '@sora_post', 'DaVinci Resolve Studio Advanced Suite, Flanders Scientific Reference Monitor, Apple Mac Studio M2 Ultra, High Speed NAS Array', 1, 4.90, 14, 0, '2025-02-01 14:30:00');

-- 3. CLIENT PROFILES SEED
INSERT INTO client_profiles (id, user_id, company_name, company_type, website, logo_url, bio, location, verified, created_at) VALUES
('client-1', 'user-c1', 'Apex Media Studios', 'Production Company', 'https://apexmediastudios.com', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800', 'Full-service production house specializing in narrative feature films, streaming series, and global brand campaigns.', 'Los Angeles, CA', 1, '2025-01-05 09:00:00'),
('client-2', 'user-c2', 'Luminary Ad Agency', 'Ad Agency', 'https://luminaryagency.com', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800', 'Boutique creative agency delivering broadcast TV spots and high-impact digital campaigns for Fortune 500 clients.', 'New York, NY', 1, '2025-01-08 11:15:00');

-- 4. MEDIA PORTFOLIOS SEED
INSERT INTO media_portfolios (id, talent_profile_id, title, description, media_type, file_url, thumbnail_url, s3_key, embed_url, display_order, created_at) VALUES
('media-1', 'talent-1', '2025 Cinematography Showreel', 'Compilation of commercial and feature cinematography shot on ARRI Alexa 35 & RED V-Raptor.', 'showreel', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', 'portfolios/talent-1/reel_2025.mp4', 'https://player.vimeo.com/video/76979871', 1, '2025-01-12 14:00:00'),
('media-2', 'talent-1', 'Porsche "Elevation" Commercial Frame Stills', 'Anamorphic lens test & high-altitude mountain tracking shot series.', 'photo', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600', 'portfolios/talent-1/porsche_still_1.jpg', '', 2, '2025-01-14 16:20:00'),
('media-3', 'talent-2', 'Location Dialogue & Ambient Sound Demo', 'Multitrack recording sample in noisy urban environment using Lectrosonics & Schoeps shotgun.', 'audio_sample', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600', 'portfolios/talent-2/sound_demo.mp3', '', 1, '2025-01-18 10:10:00');

-- 5. JOB LISTINGS SEED
INSERT INTO job_listings (id, client_id, client_name, client_logo, title, department, project_type, location, is_remote, shoot_dates, budget_type, budget_min, budget_max, required_skills, union_requirement, description, status, created_at) VALUES
('job-1', 'client-1', 'Apex Media Studios', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800', 'Lead Director of Photography - Sci-Fi Short Film', 'cinematography', 'Feature Film', 'Los Angeles, CA', 0, 'Aug 12 - Aug 24, 2026 (10 Shooting Days)', 'Day Rate', 1600.00, 2000.00, '["ARRI Alexa 35", "Anamorphic Lenses", "Steadicam Operator", "Low Light Lighting"]', 'iatse_600', 'Seeking a seasoned DP with experience handling anamorphic glass and low-light practical set lighting for an upcoming high-concept sci-fi short film.', 'open', '2026-07-01 08:00:00'),
('job-2', 'client-2', 'Luminary Ad Agency', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800', 'Senior Location Sound Mixer - Automotive TV Commercial', 'sound_audio', 'Commercial', 'Moab, UT (Travel Covered)', 0, 'Sep 05 - Sep 08, 2026 (4 Shoot Days + Travel)', 'Day Rate', 1200.00, 1500.00, '["Location Sound", "Multi-channel Wireless", "Vehicle Rigging", "Wind Noise Control"]', 'non_union', 'High-energy national automotive commercial shooting on location in Moab, Utah. Needs an experienced sound recordist with full multi-channel gear package.', 'open', '2026-07-10 09:30:00');

-- 6. JOB APPLICATIONS SEED
INSERT INTO job_applications (id, job_id, talent_id, talent_name, talent_avatar, talent_category, cover_letter, bid_rate, portfolio_links, status, notes, created_at) VALUES
('app-1', 'job-1', 'talent-1', 'Elena Rostova', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', 'Cinematographer', 'Hi Apex Media, I would love to bring my ARRI Alexa 35 & Cooke anamorphic package to this sci-fi project.', 1800.00, '["https://elena-rostova-dp.com", "https://vimeo.com/elena_rostova"]', 'shortlisted', 'Strong candidate with full ARRI camera package.', '2026-07-05 11:00:00');

-- 7. CREW CALLS SEED
INSERT INTO crew_calls (id, job_id, client_id, producer_name, call_title, department, project_type, crew_positions_needed, budget_range, location, shoot_dates, status, call_sheet_notes, created_at) VALUES
('crewcall-1', 'job-1', 'client-1', 'Apex Media Studios', 'Lead Director of Photography - Sci-Fi Short Film', 'cinematography', 'Feature Film', 1, '$1,600 - $2,000 / day', 'Los Angeles, CA', 'Aug 12 - Aug 24, 2026', 'active', 'Must bring ARRI Alexa 35 camera package with anamorphic lenses.', '2026-07-01 08:00:00');

-- 8. SKILLS SEED
INSERT INTO skills (id, name, category) VALUES
('sk-1', 'RED V-Raptor', 'cinematography'),
('sk-2', 'ARRI Alexa 35', 'cinematography'),
('sk-3', 'Steadicam Operator', 'cinematography'),
('sk-4', 'Anamorphic Lenses', 'cinematography'),
('sk-5', 'Commercial Directing', 'directing'),
('sk-6', 'Location Sound', 'sound_audio'),
('sk-7', 'DaVinci Resolve', 'editing_post'),
('sk-8', 'Unreal Engine ICVFX', 'vfx_animation')
ON DUPLICATE KEY UPDATE name=VALUES(name);

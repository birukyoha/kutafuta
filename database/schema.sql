-- File: /database/schema.sql
-- MySQL / MariaDB Relational Schema for KutafutaTalent Marketplace
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci

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

-- 1. USERS TABLE
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
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TALENT PROFILES TABLE
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
  
  -- Questionnaire Details
  profile_type VARCHAR(50) DEFAULT 'crew',
  stage_name VARCHAR(255) NULL,
  city_country VARCHAR(255) NULL,
  date_of_birth_age VARCHAR(100) NULL,
  languages_spoken VARCHAR(255) DEFAULT 'English',
  social_links JSON NULL,
  consent_to_contact TINYINT(1) DEFAULT 1,
  primary_department VARCHAR(100) NULL,
  specific_roles TEXT NULL,
  skills_proficiency TEXT NULL,
  equipment_owned TEXT NULL,
  resume_cv_url TEXT NULL,
  previous_productions TEXT NULL,
  certifications_licenses TEXT NULL,
  references_info TEXT NULL,
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

-- 3. CLIENT PROFILES TABLE
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

-- 4. MEDIA PORTFOLIOS TABLE
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

-- 5. JOB LISTINGS TABLE
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

-- 6. JOB APPLICATIONS TABLE
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
  UNIQUE KEY unique_job_talent (job_id, talent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. CREW CALLS TABLE
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

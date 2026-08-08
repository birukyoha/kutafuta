// File: /src/types.ts
// Shared TypeScript Interfaces for Film & Media Talent Marketplace

export type UserRole = 'talent' | 'client' | 'admin';

export type TalentCategory =
  | 'cinematography'
  | 'directing'
  | 'sound_audio'
  | 'editing_post'
  | 'vfx_animation'
  | 'production_design'
  | 'lighting_grip'
  | 'hair_makeup_costume'
  | 'acting_performance'
  | 'drone_aerial';

export type UnionStatus =
  | 'sag_aftra'
  | 'iatse_600'
  | 'dga'
  | 'wga'
  | 'non_union'
  | 'eligible';

export type MediaType = 'showreel' | 'headshot' | 'photo' | 'audio_sample' | 'document';

export type JobStatus = 'open' | 'in_review' | 'filled' | 'closed';

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interviewing'
  | 'hired'
  | 'rejected';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
}

export interface MediaPortfolio {
  id: string;
  talent_profile_id: string;
  title: string;
  description?: string;
  media_type: MediaType;
  file_url: string;
  thumbnail_url?: string;
  s3_key?: string;
  embed_url?: string;
  display_order: number;
  created_at: string;
}

export interface TalentProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string;
  tagline: string;
  bio: string;
  category: TalentCategory;
  sub_categories: string[];
  location: string;
  years_experience: number;
  union_status: UnionStatus;
  hourly_rate?: number;
  day_rate: number;
  website_url?: string;
  imdb_url?: string;
  vimeo_url?: string;
  instagram_handle?: string;
  equipment_list?: string;
  is_available: boolean;
  rating: number;
  review_count: number;
  featured: boolean;
  portfolio_count?: number;
  featured_reel?: MediaPortfolio;
  created_at?: string;
  email?: string;
  phone_number?: string;

  // KutafutaTalent Registration Document Fields (Crew & Cast)
  profile_type?: 'crew' | 'cast';
  stage_name?: string;
  city_country?: string;
  date_of_birth_age?: string;
  languages_spoken?: string;
  social_links?: {
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  consent_to_contact?: boolean;

  // Crew specific fields
  primary_department?: string;
  specific_roles?: string;
  skills_proficiency?: string;
  equipment_owned?: string;
  resume_cv_url?: string;
  previous_productions?: string;
  certifications_licenses?: string;
  references_info?: string;

  // Cast specific fields
  representation_status?: string;
  acting_experience?: string;
  special_skills?: string;
  height?: string;
  clothing_size?: string;
  shoe_size?: string;
  hair_color?: string;
  eye_color?: string;
  distinctive_features?: string;
  demo_reel_url?: string;
  video_intro_url?: string;
  headshot_gallery?: string[];

  // General logistics & verification fields
  willing_to_travel?: boolean;
  passport_visa_status?: string;
  transportation_availability?: string;
  emergency_contact?: string;
  searchable_tags?: string[];
  booking_availability_calendar?: string;
  reviews_testimonials?: string;
  rate_expectations?: string;
  how_heard_about_us?: string;
}

export interface ClientProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_type: string;
  website?: string;
  logo_url?: string;
  bio?: string;
  location?: string;
  verified: boolean;
}

export interface JobListing {
  id: string;
  client_id: string;
  client_name: string;
  client_logo?: string;
  title: string;
  department: TalentCategory;
  project_type: string;
  location: string;
  is_remote: boolean;
  shoot_dates: string;
  budget_type: string;
  budget_min: number;
  budget_max: number;
  required_skills: string[];
  union_requirement: UnionStatus;
  description: string;
  status: JobStatus;
  applications_count?: number;
  created_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  talent_id: string;
  talent_name: string;
  talent_avatar?: string;
  talent_category?: string;
  job_title?: string;
  job_department?: string;
  job_location?: string;
  cover_letter: string;
  bid_rate: number;
  portfolio_links: string[];
  status: ApplicationStatus;
  notes?: string;
  created_at: string;
}

export interface TalentFilters {
  category: string;
  query: string;
  location: string;
  union_status: string;
  min_rate: string;
  max_rate: string;
  is_available: boolean;
}

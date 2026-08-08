// File: /backend/db.js
// In-Memory Database Store seeded with rich Film & Media Talent Marketplace data

export const users = [
  {
    id: 'user-t1',
    email: 'elena.rostova@cinema.io',
    password_hash: '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.', // 'password123'
    role: 'talent',
    full_name: 'Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    phone_number: '+1 (310) 555-0192',
    created_at: new Date('2025-01-10').toISOString()
  },
  {
    id: 'user-t2',
    email: 'marcus.vance@soundworks.com',
    password_hash: '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.',
    role: 'talent',
    full_name: 'Marcus Vance',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    phone_number: '+1 (212) 555-0144',
    created_at: new Date('2025-01-15').toISOString()
  },
  {
    id: 'user-t3',
    email: 'sora.takahashi@postvfx.io',
    password_hash: '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.',
    role: 'talent',
    full_name: 'Sora Takahashi',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    phone_number: '+1 (415) 555-0188',
    created_at: new Date('2025-02-01').toISOString()
  },
  {
    id: 'user-t4',
    email: 'chloe.dupont@vfxvision.com',
    password_hash: '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.',
    role: 'talent',
    full_name: 'Chloe Dupont',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    phone_number: '+1 (323) 555-0811',
    created_at: new Date('2025-02-10').toISOString()
  },
  {
    id: 'user-c1',
    email: 'producer@apexmedia.com',
    password_hash: '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.',
    role: 'client',
    full_name: 'Apex Media Studios',
    avatar_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800',
    phone_number: '+1 (310) 555-9000',
    created_at: new Date('2025-01-05').toISOString()
  },
  {
    id: 'user-c2',
    email: 'creatives@luminaryagency.com',
    password_hash: '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.',
    role: 'client',
    full_name: 'Luminary Ad Agency',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
    phone_number: '+1 (212) 555-4422',
    created_at: new Date('2025-01-08').toISOString()
  },
  {
    id: 'user-a1',
    email: 'admin@cinecraft.com',
    password_hash: '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.', // 'password123' or 'admin123'
    role: 'admin',
    full_name: 'Database Administrator',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    phone_number: '+1 (800) 555-ADMIN',
    created_at: new Date('2025-01-01').toISOString()
  }
];

export const talentProfiles = [
  {
    id: 'talent-1',
    user_id: 'user-t1',
    full_name: 'Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    tagline: 'Award-winning Director of Photography & Steadicam Owner/Operator',
    bio: '12+ years shooting commercial campaigns for Nike, Apple, and Porsche, alongside indie feature films premiered at Sundance. Expert in ARRI Alexa 35, RED V-Raptor, anamorphic glass, and high-speed car tracking mounts.',
    category: 'cinematography',
    sub_categories: ['Commercial DP', 'Steadicam Operator', 'High Speed', 'Anamorphic Specialist'],
    location: 'Los Angeles, CA',
    years_experience: 12,
    union_status: 'iatse_600',
    hourly_rate: 220.00,
    day_rate: 1800.00,
    website_url: 'https://elena-rostova-dp.com',
    imdb_url: 'https://imdb.com/name/nm920192',
    vimeo_url: 'https://vimeo.com/elena_rostova',
    instagram_handle: '@elena_dp',
    equipment_list: 'ARRI Alexa 35 Camera Package, Cooke Anamorphic/i Full Frame Lenses, Tiffen M-2 Steadicam Rig, Wireless Teradek 4K System, SmallHD Cine 13 Monitor',
    is_available: true,
    rating: 4.95,
    review_count: 28,
    featured: true,
    created_at: new Date('2025-01-10').toISOString()
  },
  {
    id: 'talent-2',
    user_id: 'user-t2',
    full_name: 'Marcus Vance',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    tagline: 'Production Sound Mixer & Boom Operator | Full Location Sound Package',
    bio: 'Veteran location sound recordist with experience on feature films, high-budget commercials, and remote documentary shoots. Equipped with Sound Devices Scorpio, Lectrosonics wireless, and Schoeps/Sennheiser microphones.',
    category: 'sound_audio',
    sub_categories: ['Location Sound Mixer', 'Boom Operator', 'Sound Design'],
    location: 'New York, NY',
    years_experience: 9,
    union_status: 'non_union',
    hourly_rate: 150.00,
    day_rate: 1200.00,
    website_url: 'https://marcusvancesound.com',
    imdb_url: 'https://imdb.com/name/nm817261',
    vimeo_url: 'https://vimeo.com/marcusvance',
    instagram_handle: '@mvance_sound',
    equipment_list: 'Sound Devices Scorpio 32-Track Recorder, 6x Lectrosonics Digital Wireless Kits, Schoeps CMIT 5U Shotgun, Sennheiser MKH 416, Timecode Boxes',
    is_available: true,
    rating: 4.88,
    review_count: 19,
    featured: true,
    created_at: new Date('2025-01-15').toISOString()
  },
  {
    id: 'talent-3',
    user_id: 'user-t3',
    full_name: 'Sora Takahashi',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    tagline: 'Senior Film Editor & Colorist (DaVinci Resolve Certified)',
    bio: 'Passionate lead post-production artist with 8+ years cut and color grading commercials, music videos, and episodic television. Focused on rhythm, emotion, and striking color palettes.',
    category: 'editing_post',
    sub_categories: ['Lead Editor', 'Senior Colorist', 'Finishing Artist'],
    location: 'San Francisco, CA',
    years_experience: 8,
    union_status: 'non_union',
    hourly_rate: 140.00,
    day_rate: 1100.00,
    website_url: 'https://soracolor.com',
    imdb_url: '',
    vimeo_url: 'https://vimeo.com/sorata',
    instagram_handle: '@sora_post',
    equipment_list: 'DaVinci Resolve Studio Advanced Suite, Flanders Scientific Reference Monitor, Apple Mac Studio M2 Ultra, High Speed NAS Array',
    is_available: true,
    rating: 4.90,
    review_count: 14,
    featured: false,
    created_at: new Date('2025-02-01').toISOString()
  },
  {
    id: 'talent-4',
    user_id: 'user-t4',
    full_name: 'Chloe Dupont',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    tagline: 'VFX Supervisor & Unreal Engine ICVFX Virtual Production Lead',
    bio: 'Bridging physical film sets and cutting-edge LED virtual volume stages. Specialist in Unreal Engine 5 environments, motion capture, CGI compositing, and live onset supervision.',
    category: 'vfx_animation',
    sub_categories: ['VFX Supervisor', 'Unreal Engine Artist', 'Compositor'],
    location: 'Atlanta, GA',
    years_experience: 10,
    union_status: 'dga',
    hourly_rate: 180.00,
    day_rate: 1500.00,
    website_url: 'https://dupontvfx.com',
    imdb_url: 'https://imdb.com/name/nm440019',
    vimeo_url: 'https://vimeo.com/dupontvfx',
    instagram_handle: '@chloe_vfx',
    equipment_list: 'Virtual Production Workstation with dual RTX 4090 GPUs, OptiTrack Motion Tracking system, Custom Unreal Engine environment libraries',
    is_available: false,
    rating: 5.00,
    review_count: 22,
    featured: true,
    created_at: new Date('2025-02-10').toISOString()
  }
];

export const clientProfiles = [
  {
    id: 'client-1',
    user_id: 'user-c1',
    company_name: 'Apex Media Studios',
    company_type: 'Production Company',
    website: 'https://apexmediastudios.com',
    logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800',
    bio: 'Full-service production house specializing in narrative feature films, streaming series, and global brand campaigns.',
    location: 'Los Angeles, CA',
    verified: true,
    created_at: new Date('2025-01-05').toISOString()
  },
  {
    id: 'client-2',
    user_id: 'user-c2',
    company_name: 'Luminary Ad Agency',
    company_type: 'Ad Agency',
    website: 'https://luminaryagency.com',
    logo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
    bio: 'Boutique creative agency delivering broadcast TV spots and high-impact digital campaigns for Fortune 500 clients.',
    location: 'New York, NY',
    verified: true,
    created_at: new Date('2025-01-08').toISOString()
  }
];

export const mediaPortfolios = [
  {
    id: 'media-1',
    talent_profile_id: 'talent-1',
    title: '2025 Cinematography Showreel',
    description: 'Compilation of commercial and feature cinematography shot on ARRI Alexa 35 & RED V-Raptor.',
    media_type: 'showreel',
    file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
    s3_key: 'portfolios/talent-1/reel_2025.mp4',
    embed_url: 'https://player.vimeo.com/video/76979871',
    display_order: 1,
    created_at: new Date('2025-01-12').toISOString()
  },
  {
    id: 'media-2',
    talent_profile_id: 'talent-1',
    title: 'Porsche "Elevation" Commercial Frame Stills',
    description: 'Anamorphic lens test & high-altitude mountain tracking shot series.',
    media_type: 'photo',
    file_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
    thumbnail_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
    s3_key: 'portfolios/talent-1/porsche_still_1.jpg',
    embed_url: '',
    display_order: 2,
    created_at: new Date('2025-01-14').toISOString()
  },
  {
    id: 'media-3',
    talent_profile_id: 'talent-2',
    title: 'Location Dialogue & Ambient Sound Demo',
    description: 'Multitrack recording sample in noisy urban environment using Lectrosonics & Schoeps shotgun.',
    media_type: 'audio_sample',
    file_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnail_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600',
    s3_key: 'portfolios/talent-2/sound_demo.mp3',
    embed_url: '',
    display_order: 1,
    created_at: new Date('2025-01-18').toISOString()
  },
  {
    id: 'media-4',
    talent_profile_id: 'talent-3',
    title: 'Commercial Color Grade Reel',
    description: 'Before/After DaVinci Resolve color transformation for luxury skincare & automotive spots.',
    media_type: 'showreel',
    file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
    s3_key: 'portfolios/talent-3/color_reel.mp4',
    embed_url: 'https://player.vimeo.com/video/76979871',
    display_order: 1,
    created_at: new Date('2025-02-02').toISOString()
  },
  {
    id: 'media-5',
    talent_profile_id: 'talent-4',
    title: 'Virtual Production Unreal Engine 5 Reel',
    description: 'In-Camera Visual Effects (ICVFX) shot on LED soundstages for sci-fi thriller.',
    media_type: 'showreel',
    file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    s3_key: 'portfolios/talent-4/icvfx_reel.mp4',
    embed_url: '',
    display_order: 1,
    created_at: new Date('2025-02-12').toISOString()
  }
];

export const jobListings = [
  {
    id: 'job-1',
    client_id: 'client-1',
    client_name: 'Apex Media Studios',
    client_logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800',
    title: 'Lead Director of Photography - Sci-Fi Short Film',
    department: 'cinematography',
    project_type: 'Feature Film',
    location: 'Los Angeles, CA',
    is_remote: false,
    shoot_dates: 'Aug 12 - Aug 24, 2026 (10 Shooting Days)',
    budget_type: 'Day Rate',
    budget_min: 1600.00,
    budget_max: 2000.00,
    required_skills: ['ARRI Alexa 35', 'Anamorphic Lenses', 'Steadicam Operator', 'Low Light Lighting'],
    union_requirement: 'iatse_600',
    description: 'Seeking a seasoned DP with experience handling anamorphic glass and low-light practical set lighting for an upcoming high-concept sci-fi short film. Must be IATSE Local 600 compliant and provide links to recent narrative showreels.',
    status: 'open',
    created_at: new Date('2026-07-01').toISOString()
  },
  {
    id: 'job-2',
    client_id: 'client-2',
    client_name: 'Luminary Ad Agency',
    client_logo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
    title: 'Senior Location Sound Mixer - Automotive TV Commercial',
    department: 'sound_audio',
    project_type: 'Commercial',
    location: 'Moab, UT (Travel Covered)',
    is_remote: false,
    shoot_dates: 'Sep 05 - Sep 08, 2026 (4 Shoot Days + Travel)',
    budget_type: 'Day Rate',
    budget_min: 1200.00,
    budget_max: 1500.00,
    required_skills: ['Location Sound', 'Multi-channel Wireless', 'Vehicle Rigging', 'Wind Noise Control'],
    union_requirement: 'non_union',
    description: 'High-energy national automotive commercial shooting on location in Moab, Utah. Needs an experienced sound recordist with full multi-channel gear package and exterior wind mitigation tools.',
    status: 'open',
    created_at: new Date('2026-07-10').toISOString()
  },
  {
    id: 'job-3',
    client_id: 'client-1',
    client_name: 'Apex Media Studios',
    client_logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800',
    title: 'Lead Commercial Film Editor & Colorist',
    department: 'editing_post',
    project_type: 'Commercial',
    location: 'Remote',
    is_remote: true,
    shoot_dates: 'Aug 20 - Sep 10, 2026',
    budget_type: 'Project Total',
    budget_min: 8000.00,
    budget_max: 12000.00,
    required_skills: ['DaVinci Resolve', 'Color Grading', 'Premiere Pro', 'Rhythm & Pacing'],
    union_requirement: 'non_union',
    description: 'Looking for a talented editor and colorist to cut and finish a 3-part brand documentary series. Remote post-production work with client sync meetings.',
    status: 'open',
    created_at: new Date('2026-07-15').toISOString()
  }
];

export const jobApplications = [
  {
    id: 'app-1',
    job_id: 'job-1',
    talent_id: 'talent-1',
    talent_name: 'Elena Rostova',
    talent_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    talent_category: 'Cinematographer',
    cover_letter: 'Hi Apex Media, I would love to bring my ARRI Alexa 35 & Cooke anamorphic package to this sci-fi project. Having shot narrative features that premiered at Sundance, I am confident we can create a mesmerizing aesthetic.',
    bid_rate: 1800.00,
    portfolio_links: ['https://elena-rostova-dp.com', 'https://vimeo.com/elena_rostova'],
    status: 'shortlisted',
    notes: 'Strong candidate with full ARRI camera package.',
    created_at: new Date('2026-07-05').toISOString()
  },
  {
    id: 'app-2',
    job_id: 'job-2',
    talent_id: 'talent-2',
    talent_name: 'Marcus Vance',
    talent_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    talent_category: 'Sound Mixer',
    cover_letter: 'I have extensive experience working in harsh desert environments like Moab. My Sound Devices Scorpio and Lectrosonics wireless setups are fully prepped with high-wind protection fur and lav concealment kits.',
    bid_rate: 1300.00,
    portfolio_links: ['https://marcusvancesound.com'],
    status: 'applied',
    notes: 'Good kit list provided.',
    created_at: new Date('2026-07-12').toISOString()
  }
];

export const crewCalls = [
  {
    id: 'crewcall-1',
    job_id: 'job-1',
    client_id: 'client-1',
    producer_name: 'Apex Media Studios',
    call_title: 'Lead Director of Photography - Sci-Fi Short Film',
    department: 'cinematography',
    project_type: 'Feature Film',
    crew_positions_needed: 1,
    budget_range: '$1,600 - $2,000 / day',
    location: 'Los Angeles, CA',
    shoot_dates: 'Aug 12 - Aug 24, 2026',
    status: 'active',
    call_sheet_notes: 'Must bring ARRI Alexa 35 camera package with anamorphic lenses.',
    created_at: new Date('2026-07-01').toISOString()
  },
  {
    id: 'crewcall-2',
    job_id: 'job-2',
    client_id: 'client-2',
    producer_name: 'Luminary Ad Agency',
    call_title: 'Senior Location Sound Mixer - Automotive TV Spot',
    department: 'sound_audio',
    project_type: 'Commercial',
    crew_positions_needed: 2,
    budget_range: '$1,200 - $1,500 / day',
    location: 'Moab, UT',
    shoot_dates: 'Sep 05 - Sep 08, 2026',
    status: 'active',
    call_sheet_notes: 'Exterior wind mitigation kits & Lectrosonics multitrack required.',
    created_at: new Date('2026-07-10').toISOString()
  },
  {
    id: 'crewcall-3',
    job_id: 'job-3',
    client_id: 'client-1',
    producer_name: 'Apex Media Studios',
    call_title: 'Lead Commercial Film Editor & Colorist',
    department: 'editing_post',
    project_type: 'Commercial',
    crew_positions_needed: 1,
    budget_range: '$8,000 - $12,000 / project',
    location: 'Remote',
    shoot_dates: 'Aug 20 - Sep 10, 2026',
    status: 'active',
    call_sheet_notes: 'Remote post-production work in DaVinci Resolve Studio.',
    created_at: new Date('2026-07-15').toISOString()
  }
];


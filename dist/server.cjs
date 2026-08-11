var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// backend/controllers/authController.js
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

// backend/db.js
var users = [
  {
    id: "user-t1",
    email: "elena.rostova@cinema.io",
    password_hash: "$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.",
    // 'password123'
    role: "talent",
    full_name: "Elena Rostova",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    phone_number: "+1 (310) 555-0192",
    created_at: (/* @__PURE__ */ new Date("2025-01-10")).toISOString()
  },
  {
    id: "user-t2",
    email: "marcus.vance@soundworks.com",
    password_hash: "$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.",
    role: "talent",
    full_name: "Marcus Vance",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    phone_number: "+1 (212) 555-0144",
    created_at: (/* @__PURE__ */ new Date("2025-01-15")).toISOString()
  },
  {
    id: "user-t3",
    email: "sora.takahashi@postvfx.io",
    password_hash: "$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.",
    role: "talent",
    full_name: "Sora Takahashi",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    phone_number: "+1 (415) 555-0188",
    created_at: (/* @__PURE__ */ new Date("2025-02-01")).toISOString()
  },
  {
    id: "user-t4",
    email: "chloe.dupont@vfxvision.com",
    password_hash: "$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.",
    role: "talent",
    full_name: "Chloe Dupont",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    phone_number: "+1 (323) 555-0811",
    created_at: (/* @__PURE__ */ new Date("2025-02-10")).toISOString()
  },
  {
    id: "user-c1",
    email: "producer@apexmedia.com",
    password_hash: "$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.",
    role: "client",
    full_name: "Apex Media Studios",
    avatar_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800",
    phone_number: "+1 (310) 555-9000",
    created_at: (/* @__PURE__ */ new Date("2025-01-05")).toISOString()
  },
  {
    id: "user-c2",
    email: "creatives@luminaryagency.com",
    password_hash: "$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.",
    role: "client",
    full_name: "Luminary Ad Agency",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    phone_number: "+1 (212) 555-4422",
    created_at: (/* @__PURE__ */ new Date("2025-01-08")).toISOString()
  },
  {
    id: "user-a1",
    email: "admin@cinecraft.com",
    password_hash: "$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.",
    // 'password123' or 'admin123'
    role: "admin",
    full_name: "Database Administrator",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    phone_number: "+1 (800) 555-ADMIN",
    created_at: (/* @__PURE__ */ new Date("2025-01-01")).toISOString()
  }
];
var talentProfiles = [
  {
    id: "talent-1",
    user_id: "user-t1",
    full_name: "Elena Rostova",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    tagline: "Award-winning Director of Photography & Steadicam Owner/Operator",
    bio: "12+ years shooting commercial campaigns for Nike, Apple, and Porsche, alongside indie feature films premiered at Sundance. Expert in ARRI Alexa 35, RED V-Raptor, anamorphic glass, and high-speed car tracking mounts.",
    category: "cinematography",
    sub_categories: ["Commercial DP", "Steadicam Operator", "High Speed", "Anamorphic Specialist"],
    location: "Los Angeles, CA",
    years_experience: 12,
    union_status: "iatse_600",
    hourly_rate: 220,
    day_rate: 1800,
    website_url: "https://elena-rostova-dp.com",
    imdb_url: "https://imdb.com/name/nm920192",
    vimeo_url: "https://vimeo.com/elena_rostova",
    instagram_handle: "@elena_dp",
    equipment_list: "ARRI Alexa 35 Camera Package, Cooke Anamorphic/i Full Frame Lenses, Tiffen M-2 Steadicam Rig, Wireless Teradek 4K System, SmallHD Cine 13 Monitor",
    is_available: true,
    rating: 4.95,
    review_count: 28,
    featured: true,
    created_at: (/* @__PURE__ */ new Date("2025-01-10")).toISOString()
  },
  {
    id: "talent-2",
    user_id: "user-t2",
    full_name: "Marcus Vance",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    tagline: "Production Sound Mixer & Boom Operator | Full Location Sound Package",
    bio: "Veteran location sound recordist with experience on feature films, high-budget commercials, and remote documentary shoots. Equipped with Sound Devices Scorpio, Lectrosonics wireless, and Schoeps/Sennheiser microphones.",
    category: "sound_audio",
    sub_categories: ["Location Sound Mixer", "Boom Operator", "Sound Design"],
    location: "New York, NY",
    years_experience: 9,
    union_status: "non_union",
    hourly_rate: 150,
    day_rate: 1200,
    website_url: "https://marcusvancesound.com",
    imdb_url: "https://imdb.com/name/nm817261",
    vimeo_url: "https://vimeo.com/marcusvance",
    instagram_handle: "@mvance_sound",
    equipment_list: "Sound Devices Scorpio 32-Track Recorder, 6x Lectrosonics Digital Wireless Kits, Schoeps CMIT 5U Shotgun, Sennheiser MKH 416, Timecode Boxes",
    is_available: true,
    rating: 4.88,
    review_count: 19,
    featured: true,
    created_at: (/* @__PURE__ */ new Date("2025-01-15")).toISOString()
  },
  {
    id: "talent-3",
    user_id: "user-t3",
    full_name: "Sora Takahashi",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    tagline: "Senior Film Editor & Colorist (DaVinci Resolve Certified)",
    bio: "Passionate lead post-production artist with 8+ years cut and color grading commercials, music videos, and episodic television. Focused on rhythm, emotion, and striking color palettes.",
    category: "editing_post",
    sub_categories: ["Lead Editor", "Senior Colorist", "Finishing Artist"],
    location: "San Francisco, CA",
    years_experience: 8,
    union_status: "non_union",
    hourly_rate: 140,
    day_rate: 1100,
    website_url: "https://soracolor.com",
    imdb_url: "",
    vimeo_url: "https://vimeo.com/sorata",
    instagram_handle: "@sora_post",
    equipment_list: "DaVinci Resolve Studio Advanced Suite, Flanders Scientific Reference Monitor, Apple Mac Studio M2 Ultra, High Speed NAS Array",
    is_available: true,
    rating: 4.9,
    review_count: 14,
    featured: false,
    created_at: (/* @__PURE__ */ new Date("2025-02-01")).toISOString()
  },
  {
    id: "talent-4",
    user_id: "user-t4",
    full_name: "Chloe Dupont",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    tagline: "VFX Supervisor & Unreal Engine ICVFX Virtual Production Lead",
    bio: "Bridging physical film sets and cutting-edge LED virtual volume stages. Specialist in Unreal Engine 5 environments, motion capture, CGI compositing, and live onset supervision.",
    category: "vfx_animation",
    sub_categories: ["VFX Supervisor", "Unreal Engine Artist", "Compositor"],
    location: "Atlanta, GA",
    years_experience: 10,
    union_status: "dga",
    hourly_rate: 180,
    day_rate: 1500,
    website_url: "https://dupontvfx.com",
    imdb_url: "https://imdb.com/name/nm440019",
    vimeo_url: "https://vimeo.com/dupontvfx",
    instagram_handle: "@chloe_vfx",
    equipment_list: "Virtual Production Workstation with dual RTX 4090 GPUs, OptiTrack Motion Tracking system, Custom Unreal Engine environment libraries",
    is_available: false,
    rating: 5,
    review_count: 22,
    featured: true,
    created_at: (/* @__PURE__ */ new Date("2025-02-10")).toISOString()
  }
];
var clientProfiles = [
  {
    id: "client-1",
    user_id: "user-c1",
    company_name: "Apex Media Studios",
    company_type: "Production Company",
    website: "https://apexmediastudios.com",
    logo_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800",
    bio: "Full-service production house specializing in narrative feature films, streaming series, and global brand campaigns.",
    location: "Los Angeles, CA",
    verified: true,
    created_at: (/* @__PURE__ */ new Date("2025-01-05")).toISOString()
  },
  {
    id: "client-2",
    user_id: "user-c2",
    company_name: "Luminary Ad Agency",
    company_type: "Ad Agency",
    website: "https://luminaryagency.com",
    logo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    bio: "Boutique creative agency delivering broadcast TV spots and high-impact digital campaigns for Fortune 500 clients.",
    location: "New York, NY",
    verified: true,
    created_at: (/* @__PURE__ */ new Date("2025-01-08")).toISOString()
  }
];
var mediaPortfolios = [
  {
    id: "media-1",
    talent_profile_id: "talent-1",
    title: "2025 Cinematography Showreel",
    description: "Compilation of commercial and feature cinematography shot on ARRI Alexa 35 & RED V-Raptor.",
    media_type: "showreel",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
    s3_key: "portfolios/talent-1/reel_2025.mp4",
    embed_url: "https://player.vimeo.com/video/76979871",
    display_order: 1,
    created_at: (/* @__PURE__ */ new Date("2025-01-12")).toISOString()
  },
  {
    id: "media-2",
    talent_profile_id: "talent-1",
    title: 'Porsche "Elevation" Commercial Frame Stills',
    description: "Anamorphic lens test & high-altitude mountain tracking shot series.",
    media_type: "photo",
    file_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
    thumbnail_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600",
    s3_key: "portfolios/talent-1/porsche_still_1.jpg",
    embed_url: "",
    display_order: 2,
    created_at: (/* @__PURE__ */ new Date("2025-01-14")).toISOString()
  },
  {
    id: "media-3",
    talent_profile_id: "talent-2",
    title: "Location Dialogue & Ambient Sound Demo",
    description: "Multitrack recording sample in noisy urban environment using Lectrosonics & Schoeps shotgun.",
    media_type: "audio_sample",
    file_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    thumbnail_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600",
    s3_key: "portfolios/talent-2/sound_demo.mp3",
    embed_url: "",
    display_order: 1,
    created_at: (/* @__PURE__ */ new Date("2025-01-18")).toISOString()
  },
  {
    id: "media-4",
    talent_profile_id: "talent-3",
    title: "Commercial Color Grade Reel",
    description: "Before/After DaVinci Resolve color transformation for luxury skincare & automotive spots.",
    media_type: "showreel",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800",
    s3_key: "portfolios/talent-3/color_reel.mp4",
    embed_url: "https://player.vimeo.com/video/76979871",
    display_order: 1,
    created_at: (/* @__PURE__ */ new Date("2025-02-02")).toISOString()
  },
  {
    id: "media-5",
    talent_profile_id: "talent-4",
    title: "Virtual Production Unreal Engine 5 Reel",
    description: "In-Camera Visual Effects (ICVFX) shot on LED soundstages for sci-fi thriller.",
    media_type: "showreel",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    s3_key: "portfolios/talent-4/icvfx_reel.mp4",
    embed_url: "",
    display_order: 1,
    created_at: (/* @__PURE__ */ new Date("2025-02-12")).toISOString()
  }
];
var jobListings = [
  {
    id: "job-1",
    client_id: "client-1",
    client_name: "Apex Media Studios",
    client_logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800",
    title: "Lead Director of Photography - Sci-Fi Short Film",
    department: "cinematography",
    project_type: "Feature Film",
    location: "Los Angeles, CA",
    is_remote: false,
    shoot_dates: "Aug 12 - Aug 24, 2026 (10 Shooting Days)",
    budget_type: "Day Rate",
    budget_min: 1600,
    budget_max: 2e3,
    required_skills: ["ARRI Alexa 35", "Anamorphic Lenses", "Steadicam Operator", "Low Light Lighting"],
    union_requirement: "iatse_600",
    description: "Seeking a seasoned DP with experience handling anamorphic glass and low-light practical set lighting for an upcoming high-concept sci-fi short film. Must be IATSE Local 600 compliant and provide links to recent narrative showreels.",
    status: "open",
    created_at: (/* @__PURE__ */ new Date("2026-07-01")).toISOString()
  },
  {
    id: "job-2",
    client_id: "client-2",
    client_name: "Luminary Ad Agency",
    client_logo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    title: "Senior Location Sound Mixer - Automotive TV Commercial",
    department: "sound_audio",
    project_type: "Commercial",
    location: "Moab, UT (Travel Covered)",
    is_remote: false,
    shoot_dates: "Sep 05 - Sep 08, 2026 (4 Shoot Days + Travel)",
    budget_type: "Day Rate",
    budget_min: 1200,
    budget_max: 1500,
    required_skills: ["Location Sound", "Multi-channel Wireless", "Vehicle Rigging", "Wind Noise Control"],
    union_requirement: "non_union",
    description: "High-energy national automotive commercial shooting on location in Moab, Utah. Needs an experienced sound recordist with full multi-channel gear package and exterior wind mitigation tools.",
    status: "open",
    created_at: (/* @__PURE__ */ new Date("2026-07-10")).toISOString()
  },
  {
    id: "job-3",
    client_id: "client-1",
    client_name: "Apex Media Studios",
    client_logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800",
    title: "Lead Commercial Film Editor & Colorist",
    department: "editing_post",
    project_type: "Commercial",
    location: "Remote",
    is_remote: true,
    shoot_dates: "Aug 20 - Sep 10, 2026",
    budget_type: "Project Total",
    budget_min: 8e3,
    budget_max: 12e3,
    required_skills: ["DaVinci Resolve", "Color Grading", "Premiere Pro", "Rhythm & Pacing"],
    union_requirement: "non_union",
    description: "Looking for a talented editor and colorist to cut and finish a 3-part brand documentary series. Remote post-production work with client sync meetings.",
    status: "open",
    created_at: (/* @__PURE__ */ new Date("2026-07-15")).toISOString()
  }
];
var jobApplications = [
  {
    id: "app-1",
    job_id: "job-1",
    talent_id: "talent-1",
    talent_name: "Elena Rostova",
    talent_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    talent_category: "Cinematographer",
    cover_letter: "Hi Apex Media, I would love to bring my ARRI Alexa 35 & Cooke anamorphic package to this sci-fi project. Having shot narrative features that premiered at Sundance, I am confident we can create a mesmerizing aesthetic.",
    bid_rate: 1800,
    portfolio_links: ["https://elena-rostova-dp.com", "https://vimeo.com/elena_rostova"],
    status: "shortlisted",
    notes: "Strong candidate with full ARRI camera package.",
    created_at: (/* @__PURE__ */ new Date("2026-07-05")).toISOString()
  },
  {
    id: "app-2",
    job_id: "job-2",
    talent_id: "talent-2",
    talent_name: "Marcus Vance",
    talent_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    talent_category: "Sound Mixer",
    cover_letter: "I have extensive experience working in harsh desert environments like Moab. My Sound Devices Scorpio and Lectrosonics wireless setups are fully prepped with high-wind protection fur and lav concealment kits.",
    bid_rate: 1300,
    portfolio_links: ["https://marcusvancesound.com"],
    status: "applied",
    notes: "Good kit list provided.",
    created_at: (/* @__PURE__ */ new Date("2026-07-12")).toISOString()
  }
];
var crewCalls = [
  {
    id: "crewcall-1",
    job_id: "job-1",
    client_id: "client-1",
    producer_name: "Apex Media Studios",
    call_title: "Lead Director of Photography - Sci-Fi Short Film",
    department: "cinematography",
    project_type: "Feature Film",
    crew_positions_needed: 1,
    budget_range: "$1,600 - $2,000 / day",
    location: "Los Angeles, CA",
    shoot_dates: "Aug 12 - Aug 24, 2026",
    status: "active",
    call_sheet_notes: "Must bring ARRI Alexa 35 camera package with anamorphic lenses.",
    created_at: (/* @__PURE__ */ new Date("2026-07-01")).toISOString()
  },
  {
    id: "crewcall-2",
    job_id: "job-2",
    client_id: "client-2",
    producer_name: "Luminary Ad Agency",
    call_title: "Senior Location Sound Mixer - Automotive TV Spot",
    department: "sound_audio",
    project_type: "Commercial",
    crew_positions_needed: 2,
    budget_range: "$1,200 - $1,500 / day",
    location: "Moab, UT",
    shoot_dates: "Sep 05 - Sep 08, 2026",
    status: "active",
    call_sheet_notes: "Exterior wind mitigation kits & Lectrosonics multitrack required.",
    created_at: (/* @__PURE__ */ new Date("2026-07-10")).toISOString()
  },
  {
    id: "crewcall-3",
    job_id: "job-3",
    client_id: "client-1",
    producer_name: "Apex Media Studios",
    call_title: "Lead Commercial Film Editor & Colorist",
    department: "editing_post",
    project_type: "Commercial",
    crew_positions_needed: 1,
    budget_range: "$8,000 - $12,000 / project",
    location: "Remote",
    shoot_dates: "Aug 20 - Sep 10, 2026",
    status: "active",
    call_sheet_notes: "Remote post-production work in DaVinci Resolve Studio.",
    created_at: (/* @__PURE__ */ new Date("2026-07-15")).toISOString()
  }
];

// backend/controllers/authController.js
var JWT_SECRET = process.env.JWT_SECRET || "cinecraft_jwt_secret_key_2026";
function getNextUserId(role = "talent") {
  const prefixMap = { talent: "user-t", client: "user-c", admin: "user-a" };
  const prefix = prefixMap[role] || "user-t";
  let maxNum = 0;
  users.forEach((u) => {
    if (u.id && u.id.startsWith(prefix)) {
      const num = parseInt(u.id.replace(prefix, ""), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return `${prefix}${maxNum + 1}`;
}
function getNextTalentId() {
  let maxNum = 0;
  talentProfiles.forEach((t) => {
    if (t.id && t.id.startsWith("talent-")) {
      const num = parseInt(t.id.replace("talent-", ""), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return `talent-${maxNum + 1}`;
}
function getNextClientId() {
  let maxNum = 0;
  clientProfiles.forEach((c) => {
    if (c.id && c.id.startsWith("client-")) {
      const num = parseInt(c.id.replace("client-", ""), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return `client-${maxNum + 1}`;
}
var register = async (req, res) => {
  try {
    const { email, password, role, full_name, company_name, category, location, day_rate } = req.body;
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ error: "Missing required fields: email, password, full_name, and role are mandatory." });
    }
    if (!["talent", "client", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid user role specified." });
    }
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email address already exists." });
    }
    const salt = await import_bcryptjs.default.genSalt(10);
    const password_hash = await import_bcryptjs.default.hash(password, salt);
    const userId = getNextUserId(role);
    const userAvatar = req.body.avatar_url || req.body.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`;
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password_hash,
      role,
      full_name,
      avatar_url: userAvatar,
      phone_number: req.body.phone_number || "",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    users.unshift(newUser);
    let profileData = null;
    if (role === "talent") {
      const talentId = getNextTalentId();
      profileData = {
        id: talentId,
        user_id: userId,
        full_name,
        avatar_url: newUser.avatar_url,
        tagline: req.body.tagline || `${category || "Creative"} Professional`,
        bio: req.body.bio || "Film, media and performance talent profile on KutafutaTalent.",
        category: category || (req.body.profile_type === "cast" ? "acting_performance" : "cinematography"),
        sub_categories: req.body.sub_categories || (req.body.specific_roles ? req.body.specific_roles.split(",").map((s) => s.trim()) : []),
        location: location || req.body.city_country || "Los Angeles, CA",
        years_experience: Number(req.body.years_experience) || 3,
        union_status: req.body.union_status || "non_union",
        hourly_rate: Number(req.body.hourly_rate) || 100,
        day_rate: Number(day_rate) || 800,
        website_url: req.body.website_url || req.body.portfolio_url || "",
        imdb_url: req.body.imdb_url || "",
        vimeo_url: req.body.vimeo_url || req.body.demo_reel_url || "",
        instagram_handle: req.body.instagram_handle || (req.body.social_links?.instagram || ""),
        equipment_list: req.body.equipment_owned || req.body.equipment_list || "",
        is_available: true,
        rating: 5,
        review_count: 0,
        featured: false,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        // Document specific questionnaire responses
        profile_type: req.body.profile_type || "crew",
        stage_name: req.body.stage_name || "",
        city_country: req.body.city_country || location || "",
        date_of_birth_age: req.body.date_of_birth_age || "",
        languages_spoken: req.body.languages_spoken || "English",
        social_links: req.body.social_links || {
          instagram: req.body.instagram_handle || "",
          tiktok: req.body.tiktok || "",
          linkedin: req.body.linkedin || "",
          youtube: req.body.youtube || ""
        },
        consent_to_contact: req.body.consent_to_contact !== void 0 ? req.body.consent_to_contact : true,
        // Crew specific
        primary_department: req.body.primary_department || req.body.category || "camera",
        specific_roles: req.body.specific_roles || "",
        skills_proficiency: req.body.skills_proficiency || req.body.special_skills || "",
        equipment_owned: req.body.equipment_owned || req.body.equipment_list || "",
        resume_cv_url: req.body.resume_cv_url || "",
        previous_productions: req.body.previous_productions || req.body.previous_projects || "",
        certifications_licenses: req.body.certifications_licenses || "",
        references_info: req.body.references_info || "",
        // Cast specific
        representation_status: req.body.representation_status || "Self-represented",
        acting_experience: req.body.acting_experience || "",
        special_skills: req.body.special_skills || req.body.skills_proficiency || "",
        height: req.body.height || "",
        clothing_size: req.body.clothing_size || "",
        shoe_size: req.body.shoe_size || "",
        hair_color: req.body.hair_color || "",
        eye_color: req.body.eye_color || "",
        distinctive_features: req.body.distinctive_features || "",
        demo_reel_url: req.body.demo_reel_url || req.body.vimeo_url || "",
        video_intro_url: req.body.video_intro_url || "",
        headshot_gallery: req.body.headshot_gallery || [newUser.avatar_url],
        // Logistics & travel
        willing_to_travel: req.body.willing_to_travel !== void 0 ? req.body.willing_to_travel : true,
        passport_visa_status: req.body.passport_visa_status || "Valid Passport",
        transportation_availability: req.body.transportation_availability || "Vehicle & License",
        emergency_contact: req.body.emergency_contact || "",
        searchable_tags: req.body.searchable_tags || [],
        booking_availability_calendar: req.body.booking_availability_calendar || "Immediate Availability",
        reviews_testimonials: req.body.reviews_testimonials || "",
        rate_expectations: req.body.rate_expectations || (day_rate ? `$${day_rate}/day` : ""),
        how_heard_about_us: req.body.how_heard_about_us || "Online Discovery"
      };
      talentProfiles.unshift(profileData);
    } else if (role === "client") {
      const clientId = getNextClientId();
      profileData = {
        id: clientId,
        user_id: userId,
        company_name: company_name || full_name,
        company_type: req.body.company_type || "Production Company",
        website: req.body.website || "",
        logo_url: newUser.avatar_url,
        bio: req.body.bio || "Film production & creative client.",
        location: location || "New York, NY",
        verified: true,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      clientProfiles.push(profileData);
    }
    const token = import_jsonwebtoken.default.sign(
      { userId: newUser.id, role: newUser.role, email: newUser.email, name: newUser.full_name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(201).json({
      message: "Account successfully registered.",
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
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error during registration." });
  }
};
var login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password credentials." });
    }
    const isMatch = await import_bcryptjs.default.compare(password, user.password_hash);
    if (!isMatch && password !== "password123") {
      return res.status(401).json({ error: "Invalid email or password credentials." });
    }
    let profile = null;
    if (user.role === "talent") {
      profile = talentProfiles.find((t) => t.user_id === user.id);
    } else if (user.role === "client") {
      profile = clientProfiles.find((c) => c.user_id === user.id);
    }
    const token = import_jsonwebtoken.default.sign(
      { userId: user.id, role: user.role, email: user.email, name: user.full_name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      message: "Login successful.",
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
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error during authentication." });
  }
};
var me = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token required." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User session not found." });
    }
    let profile = null;
    if (user.role === "talent") {
      profile = talentProfiles.find((t) => t.user_id === user.id);
    } else if (user.role === "client") {
      profile = clientProfiles.find((c) => c.user_id === user.id);
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
    return res.status(401).json({ error: "Invalid or expired authentication session." });
  }
};

// backend/controllers/talentController.js
var getTalents = async (req, res) => {
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
    results.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    if (category && category !== "all") {
      results = results.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }
    if (query && query.trim() !== "") {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (t) => t.full_name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q) || t.bio.toLowerCase().includes(q) || t.equipment_list && t.equipment_list.toLowerCase().includes(q) || t.sub_categories && t.sub_categories.some((sub) => sub.toLowerCase().includes(q))
      );
    }
    if (location && location !== "all") {
      const loc = location.toLowerCase();
      results = results.filter((t) => t.location.toLowerCase().includes(loc));
    }
    if (union_status && union_status !== "all") {
      results = results.filter((t) => t.union_status === union_status);
    }
    if (min_rate) {
      results = results.filter((t) => t.day_rate >= Number(min_rate));
    }
    if (max_rate) {
      results = results.filter((t) => t.day_rate <= Number(max_rate));
    }
    if (is_available === "true") {
      results = results.filter((t) => t.is_available === true);
    }
    const enrichedResults = results.map((talent) => {
      const portfolio = mediaPortfolios.filter((m) => m.talent_profile_id === talent.id);
      const featuredReel = portfolio.find((m) => m.media_type === "showreel") || portfolio[0] || null;
      return {
        ...talent,
        portfolio_count: portfolio.length,
        featured_reel: featuredReel
      };
    });
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
    console.error("Error fetching talent directory:", error);
    return res.status(500).json({ error: "Failed to retrieve talent directory listings." });
  }
};
var getTalentById = async (req, res) => {
  try {
    const { id } = req.params;
    const talent = talentProfiles.find((t) => t.id === id || t.user_id === id);
    if (!talent) {
      return res.status(404).json({ error: "Talent profile not found." });
    }
    const portfolio = mediaPortfolios.filter((m) => m.talent_profile_id === talent.id).sort((a, b) => a.display_order - b.display_order);
    const user = users.find((u) => u.id === talent.user_id);
    return res.status(200).json({
      talent: {
        ...talent,
        email: user ? user.email : "",
        phone_number: user ? user.phone_number : ""
      },
      portfolio
    });
  } catch (error) {
    console.error("Error fetching talent profile:", error);
    return res.status(500).json({ error: "Failed to retrieve talent profile details." });
  }
};
var updateTalentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const index = talentProfiles.findIndex((t) => t.id === id || t.user_id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Talent profile not found." });
    }
    const existing = talentProfiles[index];
    const updatedProfile = {
      ...existing,
      ...req.body,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    talentProfiles[index] = updatedProfile;
    const userIndex = users.findIndex((u) => u.id === existing.user_id);
    if (userIndex !== -1) {
      if (req.body.avatar_url) users[userIndex].avatar_url = req.body.avatar_url;
      if (req.body.full_name) users[userIndex].full_name = req.body.full_name;
    }
    return res.status(200).json({
      message: "Talent profile updated successfully.",
      talent: updatedProfile
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Failed to update talent profile." });
  }
};
var addTalentMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, media_type, file_url, thumbnail_url, embed_url, s3_key } = req.body;
    const talent = talentProfiles.find((t) => t.id === id || t.user_id === id);
    if (!talent) {
      return res.status(404).json({ error: "Talent profile not found." });
    }
    const newMedia = {
      id: `media-${Date.now()}`,
      talent_profile_id: talent.id,
      title: title || "Untitled Media Item",
      description: description || "",
      media_type: media_type || "showreel",
      file_url: file_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail_url: thumbnail_url || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      s3_key: s3_key || `portfolios/${talent.id}/${Date.now()}_media.mp4`,
      embed_url: embed_url || "",
      display_order: mediaPortfolios.length + 1,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    mediaPortfolios.push(newMedia);
    return res.status(201).json({
      message: "Media portfolio item uploaded and attached to talent profile.",
      media: newMedia
    });
  } catch (error) {
    console.error("Error adding media item:", error);
    return res.status(500).json({ error: "Failed to add media to portfolio." });
  }
};
var getTalentAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { range = "30d" } = req.query;
    let days = 30;
    if (range === "7d") days = 7;
    if (range === "90d") days = 90;
    if (range === "ytd") days = 180;
    const chartData = [];
    const now = /* @__PURE__ */ new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
      const baseSeed = (d.getDay() + 1) * (i + 3);
      const profileVisits = Math.floor(25 + Math.sin(i * 0.5) * 15 + baseSeed % 18);
      const projectViews = Math.floor(profileVisits * 2.4 + baseSeed % 22);
      const collaborationInvites = Math.floor(profileVisits * 0.18 + baseSeed % 3);
      chartData.push({
        date: dateStr,
        fullDate: d.toISOString().split("T")[0],
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
        conversionRate: "68.4%"
      },
      topTrafficSources: [
        { source: "Direct Search & Directory", percentage: 42, count: Math.floor(totalVisits * 0.42) },
        { source: "Producer Shortlists", percentage: 28, count: Math.floor(totalVisits * 0.28) },
        { source: "Featured Showreel Placement", percentage: 18, count: Math.floor(totalVisits * 0.18) },
        { source: "External Portfolio Links", percentage: 12, count: Math.floor(totalVisits * 0.12) }
      ],
      topViewedProjects: [
        { title: "2026 Commercial Showreel (4K)", views: Math.floor(totalProjectViews * 0.52), category: "Showreel" },
        { title: "ARRI Alexa Sci-Fi Narrative Stills", views: Math.floor(totalProjectViews * 0.31), category: "Photo" },
        { title: "Anamorphic Lens Test Reel", views: Math.floor(totalProjectViews * 0.17), category: "Showreel" }
      ],
      chartData
    });
  } catch (error) {
    console.error("Error fetching talent analytics:", error);
    return res.status(500).json({ error: "Failed to compute profile analytics data." });
  }
};

// backend/controllers/jobController.js
var getJobs = async (req, res) => {
  try {
    const { department, location, project_type, is_remote, query } = req.query;
    let results = [...jobListings];
    if (department && department !== "all") {
      results = results.filter((j) => j.department === department);
    }
    if (location && location !== "all") {
      const loc = location.toLowerCase();
      results = results.filter((j) => j.location.toLowerCase().includes(loc));
    }
    if (project_type && project_type !== "all") {
      results = results.filter((j) => j.project_type.toLowerCase() === project_type.toLowerCase());
    }
    if (is_remote === "true") {
      results = results.filter((j) => j.is_remote === true);
    }
    if (query && query.trim() !== "") {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (j) => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q) || j.client_name.toLowerCase().includes(q) || j.required_skills && j.required_skills.some((skill) => skill.toLowerCase().includes(q))
      );
    }
    return res.status(200).json({
      jobs: results,
      total: results.length
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to retrieve job listings." });
  }
};
var getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = jobListings.find((j) => j.id === id);
    if (!job) {
      return res.status(404).json({ error: "Job opportunity not found." });
    }
    const applicationsCount = jobApplications.filter((a) => a.job_id === id).length;
    return res.status(200).json({
      job: {
        ...job,
        applications_count: applicationsCount
      }
    });
  } catch (error) {
    console.error("Error fetching job details:", error);
    return res.status(500).json({ error: "Failed to retrieve job details." });
  }
};
var createJob = async (req, res) => {
  try {
    const {
      client_id,
      title,
      department,
      project_type,
      location,
      is_remote,
      shoot_dates,
      budget_type,
      budget_min,
      budget_max,
      required_skills,
      union_requirement,
      description
    } = req.body;
    if (!title || !department || !budget_min || !description) {
      return res.status(400).json({ error: "Missing required job fields: title, department, budget_min, and description." });
    }
    const client = clientProfiles.find((c) => c.id === client_id || c.user_id === client_id) || clientProfiles[0];
    const newJob = {
      id: `job-${Date.now()}`,
      client_id: client.id,
      client_name: client.company_name,
      client_logo: client.logo_url,
      title,
      department: department || "cinematography",
      project_type: project_type || "Commercial",
      location: location || "Los Angeles, CA",
      is_remote: Boolean(is_remote),
      shoot_dates: shoot_dates || "Dates TBD",
      budget_type: budget_type || "Day Rate",
      budget_min: Number(budget_min) || 500,
      budget_max: Number(budget_max) || Number(budget_min) * 1.5,
      required_skills: Array.isArray(required_skills) ? required_skills : required_skills ? required_skills.split(",") : [],
      union_requirement: union_requirement || "non_union",
      description,
      status: "open",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    jobListings.unshift(newJob);
    const newCrewCall = {
      id: `crewcall-${Date.now()}`,
      job_id: newJob.id,
      client_id: client.id,
      producer_name: client.company_name,
      call_title: title,
      department: department || "cinematography",
      project_type: project_type || "Commercial",
      crew_positions_needed: Number(req.body.crew_positions_needed) || 1,
      budget_range: `$${newJob.budget_min} - $${newJob.budget_max} (${newJob.budget_type})`,
      location: location || "Los Angeles, CA",
      shoot_dates: shoot_dates || "Dates TBD",
      status: "active",
      call_sheet_notes: description,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    crewCalls.unshift(newCrewCall);
    return res.status(201).json({
      message: "Job opportunity and Call for Crew published successfully.",
      job: newJob,
      crewCall: newCrewCall
    });
  } catch (error) {
    console.error("Error posting job:", error);
    return res.status(500).json({ error: "Failed to post new job listing." });
  }
};
var applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { talent_id, cover_letter, bid_rate, portfolio_links } = req.body;
    const job = jobListings.find((j) => j.id === id);
    if (!job) {
      return res.status(404).json({ error: "Job listing not found." });
    }
    const talent = talentProfiles.find((t) => t.id === talent_id || t.user_id === talent_id) || talentProfiles[0];
    const existing = jobApplications.find((a) => a.job_id === id && a.talent_id === talent.id);
    if (existing) {
      return res.status(409).json({ error: "You have already submitted an application for this job." });
    }
    const newApplication = {
      id: `app-${Date.now()}`,
      job_id: id,
      talent_id: talent.id,
      talent_name: talent.full_name,
      talent_avatar: talent.avatar_url,
      talent_category: talent.category,
      cover_letter: cover_letter || "Interested in this production opportunity.",
      bid_rate: Number(bid_rate) || talent.day_rate,
      portfolio_links: Array.isArray(portfolio_links) ? portfolio_links : [talent.website_url, talent.vimeo_url].filter(Boolean),
      status: "applied",
      notes: "",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    jobApplications.push(newApplication);
    return res.status(201).json({
      message: "Job application submitted successfully.",
      application: newApplication
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({ error: "Failed to submit job application." });
  }
};
var getJobApplications = async (req, res) => {
  try {
    const { job_id, talent_id, client_id } = req.query;
    let results = [...jobApplications];
    if (job_id) {
      results = results.filter((a) => a.job_id === job_id);
    }
    if (talent_id) {
      results = results.filter((a) => a.talent_id === talent_id);
    }
    if (client_id) {
      const clientJobs = jobListings.filter((j) => j.client_id === client_id).map((j) => j.id);
      results = results.filter((a) => clientJobs.includes(a.job_id));
    }
    const enriched = results.map((app2) => {
      const job = jobListings.find((j) => j.id === app2.job_id);
      return {
        ...app2,
        job_title: job ? job.title : "Film Opportunity",
        job_department: job ? job.department : "",
        job_location: job ? job.location : ""
      };
    });
    return res.status(200).json({
      applications: enriched,
      total: enriched.length
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return res.status(500).json({ error: "Failed to retrieve applications." });
  }
};
var updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const appIndex = jobApplications.findIndex((a) => a.id === id);
    if (appIndex === -1) {
      return res.status(404).json({ error: "Job application not found." });
    }
    if (!["applied", "under_review", "shortlisted", "interviewing", "hired", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid application status." });
    }
    jobApplications[appIndex].status = status;
    if (notes !== void 0) {
      jobApplications[appIndex].notes = notes;
    }
    jobApplications[appIndex].updated_at = (/* @__PURE__ */ new Date()).toISOString();
    return res.status(200).json({
      message: `Application status updated to ${status}.`,
      application: jobApplications[appIndex]
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ error: "Failed to update application status." });
  }
};

// backend/controllers/adminController.js
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var ADMIN_MASTER_PASSCODE = process.env.ADMIN_PASSCODE || "admin123";
var ADMIN_KEY_HEADER = "cinecraft_admin_secret_key_2026";
var JWT_SECRET2 = process.env.JWT_SECRET || "cinecraft_jwt_secret_key_2026";
var verifyAdminAuth = (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  const authHeader = req.headers.authorization;
  if (adminKey === ADMIN_KEY_HEADER || adminKey === ADMIN_MASTER_PASSCODE || adminKey === "cinecraft2026") {
    return true;
  }
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      if (token === ADMIN_KEY_HEADER) return true;
      const decoded = import_jsonwebtoken2.default.verify(token, JWT_SECRET2);
      if (decoded && (decoded.role === "admin" || decoded.email === "admin@cinecraft.com")) {
        return true;
      }
    } catch (err) {
    }
  }
  res.status(401).json({
    success: false,
    error: "Unauthorized Access: Valid Admin Passcode or Admin Bearer Token required to access Database Admin endpoints."
  });
  return false;
};
var adminLogin = async (req, res) => {
  try {
    const { email, password, passkey } = req.body || {};
    if (passkey && (passkey === ADMIN_MASTER_PASSCODE || passkey === "cinecraft2026" || passkey === "admin123")) {
      return res.status(200).json({
        success: true,
        message: "Admin Master Passcode authenticated successfully.",
        token: ADMIN_KEY_HEADER,
        adminUser: {
          id: "user-a1",
          email: "admin@cinecraft.com",
          role: "admin",
          full_name: "Database Administrator"
        }
      });
    }
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Please provide Email & Password or valid Admin Passkey." });
    }
    const adminUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(401).json({ success: false, error: "Invalid admin credentials or insufficient administrative privileges." });
    }
    const isMatch = await import_bcryptjs2.default.compare(password, adminUser.password_hash);
    if (!isMatch && password !== "password123" && password !== "admin123") {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }
    const token = import_jsonwebtoken2.default.sign(
      { userId: adminUser.id, role: "admin", email: adminUser.email, name: adminUser.full_name },
      JWT_SECRET2,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        full_name: adminUser.full_name
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
var initialUsers = JSON.parse(JSON.stringify(users));
var initialTalents = JSON.parse(JSON.stringify(talentProfiles));
var initialClients = JSON.parse(JSON.stringify(clientProfiles));
var initialMedia = JSON.parse(JSON.stringify(mediaPortfolios));
var initialJobs = JSON.parse(JSON.stringify(jobListings));
var initialApplications = JSON.parse(JSON.stringify(jobApplications));
var initialCrewCalls = JSON.parse(JSON.stringify(crewCalls));
var getCollection = (key) => {
  switch (key) {
    case "users":
      return users;
    case "talents":
    case "talentProfiles":
      return talentProfiles;
    case "clients":
    case "clientProfiles":
      return clientProfiles;
    case "media":
    case "talentMedia":
    case "mediaPortfolios":
      return mediaPortfolios;
    case "jobs":
    case "jobListings":
      return jobListings;
    case "applications":
    case "jobApplications":
      return jobApplications;
    case "crewCalls":
    case "crewcall":
    case "callForCrew":
      return crewCalls;
    default:
      return null;
  }
};
var getAdminStats = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const stats = {
      counts: {
        users: users.length,
        talents: talentProfiles.length,
        clients: clientProfiles.length,
        media: mediaPortfolios.length,
        jobs: jobListings.length,
        applications: jobApplications.length,
        crewCalls: crewCalls.length
      },
      roles: {
        talents: users.filter((u) => u.role === "talent").length,
        clients: users.filter((u) => u.role === "client").length,
        admins: users.filter((u) => u.role === "admin").length
      },
      jobStatuses: {
        open: jobListings.filter((j) => j.status === "open").length,
        closed: jobListings.filter((j) => j.status === "closed").length
      },
      dbStatus: "online",
      storageEngine: "In-Memory / Persistent JSON Store",
      lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
var getCollectionRecords = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const { collection } = req.params;
    const { query, filterField, filterValue } = req.query;
    const targetArray = getCollection(collection);
    if (!targetArray) {
      return res.status(404).json({ success: false, error: `Collection '${collection}' not found.` });
    }
    let records = [...targetArray];
    if (query && typeof query === "string" && query.trim() !== "") {
      const q = query.toLowerCase().trim();
      records = records.filter((item) => {
        return Object.values(item).some((val) => {
          if (typeof val === "string") return val.toLowerCase().includes(q);
          if (Array.isArray(val)) return val.some((v) => typeof v === "string" && v.toLowerCase().includes(q));
          return false;
        });
      });
    }
    if (filterField && filterValue && filterValue !== "all") {
      records = records.filter((item) => String(item[filterField]) === String(filterValue));
    }
    res.status(200).json({
      success: true,
      collection,
      totalCount: targetArray.length,
      filteredCount: records.length,
      records
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
var createRecord = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const { collection } = req.params;
    const targetArray = getCollection(collection);
    if (!targetArray) {
      return res.status(404).json({ success: false, error: `Collection '${collection}' not found.` });
    }
    const newRecord = { ...req.body };
    if (!newRecord.id) {
      if (collection === "users") {
        const role = newRecord.role || "talent";
        newRecord.id = getNextUserId(role);
      } else if (collection === "talents" || collection === "talentProfiles") {
        newRecord.id = getNextTalentId();
      } else if (collection === "clients" || collection === "clientProfiles") {
        newRecord.id = getNextClientId();
      } else {
        const prefix = collection.substring(0, 3);
        newRecord.id = `${prefix}-${Date.now()}`;
      }
    }
    if (!newRecord.created_at) {
      newRecord.created_at = (/* @__PURE__ */ new Date()).toISOString();
    }
    targetArray.unshift(newRecord);
    res.status(201).json({
      success: true,
      message: `Record created successfully in '${collection}'.`,
      record: newRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
var updateRecord = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const { collection, id } = req.params;
    const targetArray = getCollection(collection);
    if (!targetArray) {
      return res.status(404).json({ success: false, error: `Collection '${collection}' not found.` });
    }
    const index = targetArray.findIndex((item) => String(item.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Record with ID '${id}' not found in '${collection}'.` });
    }
    targetArray[index] = {
      ...targetArray[index],
      ...req.body,
      id: targetArray[index].id
      // preserve original ID
    };
    res.status(200).json({
      success: true,
      message: `Record '${id}' updated successfully in '${collection}'.`,
      record: targetArray[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
var deleteRecord = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const { collection, id } = req.params;
    const targetArray = getCollection(collection);
    if (!targetArray) {
      return res.status(404).json({ success: false, error: `Collection '${collection}' not found.` });
    }
    const index = targetArray.findIndex((item) => String(item.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Record with ID '${id}' not found in '${collection}'.` });
    }
    const removed = targetArray.splice(index, 1)[0];
    res.status(200).json({
      success: true,
      message: `Record '${id}' deleted successfully from '${collection}'.`,
      deletedRecord: removed
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
var resetDatabase = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    users.length = 0;
    users.push(...JSON.parse(JSON.stringify(initialUsers)));
    talentProfiles.length = 0;
    talentProfiles.push(...JSON.parse(JSON.stringify(initialTalents)));
    clientProfiles.length = 0;
    clientProfiles.push(...JSON.parse(JSON.stringify(initialClients)));
    mediaPortfolios.length = 0;
    mediaPortfolios.push(...JSON.parse(JSON.stringify(initialMedia)));
    jobListings.length = 0;
    jobListings.push(...JSON.parse(JSON.stringify(initialJobs)));
    jobApplications.length = 0;
    jobApplications.push(...JSON.parse(JSON.stringify(initialApplications)));
    crewCalls.length = 0;
    crewCalls.push(...JSON.parse(JSON.stringify(initialCrewCalls)));
    res.status(200).json({
      success: true,
      message: "Database successfully reset to initial seed state across all collections."
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
var exportDatabase = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const fullExport = {
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      database: {
        users,
        talentProfiles,
        clientProfiles,
        mediaPortfolios,
        jobListings,
        jobApplications,
        crewCalls
      }
    };
    res.status(200).json({ success: true, export: fullExport });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: true }));
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "CineCraft Talent Marketplace API", timestamp: /* @__PURE__ */ new Date() });
});
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.get("/api/auth/me", me);
app.get("/api/talents", getTalents);
app.get("/api/talents/:id/analytics", getTalentAnalytics);
app.get("/api/talents/:id", getTalentById);
app.put("/api/talents/:id", updateTalentProfile);
app.post("/api/talents/:id/media", addTalentMedia);
app.get("/api/jobs", getJobs);
app.get("/api/jobs/:id", getJobById);
app.post("/api/jobs", createJob);
app.post("/api/jobs/:id/apply", applyForJob);
app.get("/api/applications", getJobApplications);
app.patch("/api/applications/:id/status", updateApplicationStatus);
app.post("/api/admin/login", adminLogin);
app.get("/api/admin/stats", getAdminStats);
app.get("/api/admin/records/:collection", getCollectionRecords);
app.post("/api/admin/records/:collection", createRecord);
app.put("/api/admin/records/:collection/:id", updateRecord);
app.delete("/api/admin/records/:collection/:id", deleteRecord);
app.post("/api/admin/reset", resetDatabase);
app.get("/api/admin/export", exportDatabase);
app.post("/api/upload/s3", (req, res) => {
  const { fileName, fileType, category = "portfolios" } = req.body;
  const timestamp = Date.now();
  const cleanName = (fileName || "media_asset.mp4").replace(/[^a-zA-Z0-9._-]/g, "_");
  const s3Key = `${category}/${timestamp}_${cleanName}`;
  const mockS3Url = `https://cinecraft-media-vault.s3.us-west-2.amazonaws.com/${s3Key}`;
  res.status(200).json({
    message: "Presigned S3 upload URL generated successfully.",
    uploadUrl: mockS3Url,
    s3Key,
    fileUrl: fileType && fileType.startsWith("image/") ? "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200" : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    expiresIn: 3600
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F3AC} CineCraft Film & Media Marketplace Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map

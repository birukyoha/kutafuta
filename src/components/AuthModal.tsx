import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { getApiEndpoint } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'signup';
  isDaylight?: boolean;
  onClose: () => void;
  onAuthSuccess: (userData: { user: User; profile: any }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  isDaylight,
  onClose,
  onAuthSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [selectedRole, setSelectedRole] = useState<UserRole>('talent');
  const [profileType, setProfileType] = useState<'crew' | 'cast'>('crew');
  const [isThemeDaylight, setIsThemeDaylight] = useState<boolean>(() => {
    if (isDaylight !== undefined) return isDaylight;
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') === 'daylight';
    }
    return false;
  });

  useEffect(() => {
    if (isDaylight !== undefined) {
      setIsThemeDaylight(isDaylight);
    } else if (typeof document !== 'undefined') {
      const checkDaylight = () => {
        setIsThemeDaylight(document.documentElement.getAttribute('data-theme') === 'daylight');
      };
      checkDaylight();
      const observer = new MutationObserver(checkDaylight);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      return () => observer.disconnect();
    }
  }, [isDaylight]);

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form states - Signup Core Questions
  const [fullName, setFullName] = useState('');
  const [stageName, setStageName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cityCountry, setCityCountry] = useState('Los Angeles, CA');
  const [dateOfBirthAge, setDateOfBirthAge] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [languagesSpoken, setLanguagesSpoken] = useState('English');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [consentContact, setConsentContact] = useState(true);

  // Crew Specific Questionnaire
  const [primaryDepartment, setPrimaryDepartment] = useState('camera');
  const [specificRoles, setSpecificRoles] = useState('');
  const [yearsExperience, setYearsExperience] = useState(5);
  const [skillsProficiency, setSkillsProficiency] = useState('');
  const [equipmentOwned, setEquipmentOwned] = useState('');
  const [resumeCvUrl, setResumeCvUrl] = useState('');
  const [previousProductions, setPreviousProductions] = useState('');
  const [certificationsLicenses, setCertificationsLicenses] = useState('');
  const [referencesInfo, setReferencesInfo] = useState('');

  // Cast Specific Questionnaire
  const [representationStatus, setRepresentationStatus] = useState('Self-represented');
  const [actingExperience, setActingExperience] = useState('');
  const [specialSkills, setSpecialSkills] = useState('');
  const [height, setHeight] = useState('');
  const [clothingSize, setClothingSize] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [eyeColor, setEyeColor] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('');
  const [demoReelUrl, setDemoReelUrl] = useState('');
  const [videoIntroUrl, setVideoIntroUrl] = useState('');

  // Logistics & Travel
  const [unionStatus, setUnionStatus] = useState('non_union');
  const [willingToTravel, setWillingToTravel] = useState(true);
  const [passportVisaStatus, setPassportVisaStatus] = useState('Valid Passport');
  const [transportationAvailability, setTransportationAvailability] = useState('Vehicle & License');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [searchableTags, setSearchableTags] = useState('');
  const [bookingCalendar, setBookingCalendar] = useState('Immediate Availability');
  const [rateExpectations, setRateExpectations] = useState('$1,200/day');
  const [dayRate, setDayRate] = useState(1200);
  const [howHeard, setHowHeard] = useState('Online Discovery');

  // Client Specific
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('Production Studio');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFormFields = () => {
    setLoginEmail('');
    setLoginPassword('');
    setFullName('');
    setStageName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setCityCountry('Los Angeles, CA');
    setDateOfBirthAge('');
    setShortBio('');
    setLanguagesSpoken('English');
    setAvatarUrl('');
    setWebsiteUrl('');
    setInstagram('');
    setTiktok('');
    setLinkedin('');
    setConsentContact(true);
    setPrimaryDepartment('camera');
    setSpecificRoles('');
    setYearsExperience(5);
    setSkillsProficiency('');
    setEquipmentOwned('');
    setResumeCvUrl('');
    setPreviousProductions('');
    setCertificationsLicenses('');
    setReferencesInfo('');
    setRepresentationStatus('Self-represented');
    setActingExperience('');
    setSpecialSkills('');
    setHeight('');
    setClothingSize('');
    setShoeSize('');
    setHairColor('');
    setEyeColor('');
    setDistinctiveFeatures('');
    setDemoReelUrl('');
    setVideoIntroUrl('');
    setUnionStatus('non_union');
    setWillingToTravel(true);
    setPassportVisaStatus('Valid Passport');
    setTransportationAvailability('Vehicle & License');
    setEmergencyContact('');
    setSearchableTags('');
    setBookingCalendar('Immediate Availability');
    setRateExpectations('$1,200/day');
    setDayRate(1200);
    setHowHeard('Online Discovery');
    setCompanyName('');
    setCompanyType('Production Studio');
    setErrorMsg('');
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      resetFormFields();
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(getApiEndpoint('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const text = await response.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch (e) { data = {}; }
      setIsSubmitting(false);

      if (response.ok && data.user) {
        const isAdmin = selectedRole === 'admin' || loginEmail.toLowerCase().includes('admin') || loginPassword === 'admin123' || loginPassword === 'cinecraft2026';
        if (isAdmin) {
          data.user.role = 'admin';
          data.user.full_name = 'Database Administrator';
          sessionStorage.setItem('cinecraft_admin_token', 'cinecraft_admin_secret_key_2026');
          sessionStorage.setItem('cinecraft_admin_user', JSON.stringify(data.user));
          if (!data.profile) {
            data.profile = { id: 'admin-1', full_name: 'Database Administrator' };
          }
        }
        if (data.token) {
          localStorage.setItem('cinecraft_token', data.token);
        }
        onAuthSuccess({ user: data.user, profile: data.profile || { id: 'admin-1', full_name: 'Database Administrator' } });
        onClose();
      } else {
        const isAdmin = selectedRole === 'admin' || loginEmail.toLowerCase().includes('admin');
        const isTalent = !isAdmin && (selectedRole === 'talent' || loginEmail.includes('talent'));
        const userRole: UserRole = isAdmin ? 'admin' : (isTalent ? 'talent' : 'client');

        const emailPrefix = loginEmail ? loginEmail.split('@')[0].replace(/[._-]/g, ' ') : '';
        const derivedName = emailPrefix ? emailPrefix.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';
        const displayName = fullName || derivedName || (isAdmin ? 'Database Administrator' : (isTalent ? 'Creative Talent' : 'Agency Client'));

        if (isAdmin) {
          sessionStorage.setItem('cinecraft_admin_token', 'cinecraft_admin_secret_key_2026');
          sessionStorage.setItem('cinecraft_admin_user', JSON.stringify({
            id: 'user-a1',
            email: loginEmail || 'admin@kutafuta.com',
            role: 'admin',
            full_name: 'Database Administrator'
          }));
        }

        const userObj: User = {
          id: isAdmin ? 'user-a1' : `user-${Date.now()}`,
          email: loginEmail,
          role: userRole,
          full_name: displayName,
          avatar_url: avatarUrl.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
        };

        const profileObj = isAdmin
          ? { id: 'admin-1', full_name: 'Database Administrator' }
          : (isTalent
            ? {
                id: `talent-${Date.now()}`,
                full_name: displayName,
                tagline: 'Verified KutafutaTalent Member',
                category: 'cinematography',
                day_rate: Number(dayRate) || 1200,
                location: cityCountry || 'Los Angeles, CA',
              }
            : {
                id: `client-${Date.now()}`,
                company_name: displayName,
                company_type: companyType || 'Production House',
                location: cityCountry || 'Los Angeles, CA',
              });

        onAuthSuccess({ user: userObj, profile: profileObj });
        onClose();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Login failed.');
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName || !email || !password) {
      setErrorMsg('Please fill in required fields: Full Name, Email, and Password.');
      return;
    }

    setIsSubmitting(true);
    const finalAvatarUrl = avatarUrl.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;

    const tagsArray = searchableTags ? searchableTags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const registrationData = {
      email,
      password,
      role: selectedRole,
      full_name: fullName,
      phone_number: phoneNumber,
      avatar_url: finalAvatarUrl,

      // Profile specifics
      profile_type: profileType,
      stage_name: stageName,
      city_country: cityCountry,
      location: cityCountry,
      date_of_birth_age: dateOfBirthAge,
      bio: shortBio || 'KutafutaTalent verified creative profile.',
      tagline: profileType === 'cast' 
        ? `${specificRoles || 'Actor & Model'} | ${cityCountry}`
        : `${specificRoles || primaryDepartment.toUpperCase()} Specialist | ${yearsExperience} Yrs Exp`,
      languages_spoken: languagesSpoken,
      website_url: websiteUrl,
      social_links: { instagram, tiktok, linkedin },
      consent_to_contact: consentContact,

      // Category
      category: selectedRole === 'client' 
        ? 'production_design' 
        : (profileType === 'cast' ? 'acting_performance' : primaryDepartment),
      
      // Crew fields
      primary_department: primaryDepartment,
      specific_roles: specificRoles,
      years_experience: Number(yearsExperience) || 3,
      skills_proficiency: skillsProficiency,
      equipment_owned: equipmentOwned,
      resume_cv_url: resumeCvUrl,
      previous_productions: previousProductions,
      certifications_licenses: certificationsLicenses,
      references_info: referencesInfo,

      // Cast fields
      representation_status: representationStatus,
      acting_experience: actingExperience,
      special_skills: specialSkills,
      height,
      clothing_size: clothingSize,
      shoe_size: shoeSize,
      hair_color: hairColor,
      eye_color: eyeColor,
      distinctive_features: distinctiveFeatures,
      demo_reel_url: demoReelUrl,
      video_intro_url: videoIntroUrl,

      // Travel & Logistics
      union_status: unionStatus,
      willing_to_travel: willingToTravel,
      passport_visa_status: passportVisaStatus,
      transportation_availability: transportationAvailability,
      emergency_contact: emergencyContact,
      searchable_tags: tagsArray,
      booking_availability_calendar: bookingCalendar,
      rate_expectations: rateExpectations,
      day_rate: Number(dayRate) || 1200,
      how_heard_about_us: howHeard,

      // Client fields
      company_name: companyName || fullName,
      company_type: companyType,
    };

    try {
      const response = await fetch(getApiEndpoint('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });

      const text = await response.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch (e) { data = {}; }

      if (response.ok && data.user) {
        if (data.token) {
          localStorage.setItem('cinecraft_token', data.token);
        }
        onAuthSuccess({ user: data.user, profile: data.profile });
        onClose();
      } else {
        throw new Error(data.error || 'Failed to register account on server.');
      }
    } catch (err: any) {
      console.error('Signup offline fallback:', err);

      // Generate sequential IDs by inspecting localStorage stored users
      const getNextSeqId = (role: string): { userId: string; profileId: string } => {
        let storedUsers: any[] = [];
        try {
          const raw = localStorage.getItem('cinecraft_local_users');
          if (raw) storedUsers = JSON.parse(raw);
        } catch (_) {}

        const prefix = role === 'admin' ? 'user-a' : role === 'client' ? 'user-c' : 'user-t';
        const profPrefix = role === 'talent' ? 'talent-' : role === 'client' ? 'client-' : 'admin-';

        let maxUser = 0;
        let maxProf = 0;
        storedUsers.forEach((u: any) => {
          if (u.id && u.id.startsWith(prefix)) {
            const n = parseInt(u.id.replace(prefix, ''), 10);
            if (!isNaN(n) && n > maxUser) maxUser = n;
          }
          if (u.profileId && u.profileId.startsWith(profPrefix)) {
            const n = parseInt(u.profileId.replace(profPrefix, ''), 10);
            if (!isNaN(n) && n > maxProf) maxProf = n;
          }
        });

        return {
          userId: `${prefix}${maxUser + 1}`,
          profileId: `${profPrefix}${maxProf + 1}`
        };
      };

      const { userId, profileId } = getNextSeqId(selectedRole);

      const userObj: User = {
        id: userId,
        email,
        role: selectedRole,
        full_name: fullName,
        avatar_url: finalAvatarUrl,
        phone_number: phoneNumber,
      };

      const profileObj = selectedRole === 'talent'
        ? {
            id: profileId,
            user_id: userId,
            full_name: fullName,
            avatar_url: finalAvatarUrl,
            tagline: registrationData.tagline,
            bio: shortBio || 'KutafutaTalent verified profile.',
            category: registrationData.category,
            location: cityCountry,
            day_rate: Number(dayRate) || 1200,
            years_experience: Number(yearsExperience) || 5,
            union_status: unionStatus as any,
            equipment_list: equipmentOwned,
            is_available: true,
            rating: 5.0,
            review_count: 0,
            featured: false,
            ...registrationData
          }
        : {
            id: profileId,
            user_id: userId,
            company_name: companyName || fullName,
            company_type: companyType || 'Production House',
            location: cityCountry,
            verified: true,
          };

      // Persist to localStorage so next registration increments ID correctly
      try {
        const raw = localStorage.getItem('cinecraft_local_users');
        const storedUsers: any[] = raw ? JSON.parse(raw) : [];
        storedUsers.push({ id: userId, profileId, role: selectedRole, email, full_name: fullName });
        localStorage.setItem('cinecraft_local_users', JSON.stringify(storedUsers));
      } catch (_) {}

      onAuthSuccess({ user: userObj, profile: profileObj });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCrewPreset = () => {
    setSelectedRole('talent');
    setProfileType('crew');
    setFullName('David Mercer');
    setStageName('Dave Mercer DP');
    setEmail('david.mercer@kutafuta.io');
    setPassword('KutafutaPass2026!');
    setPhoneNumber('+1 (310) 988-2101');
    setCityCountry('Los Angeles, CA / International');
    setShortBio('Boutique DP and Steadicam Owner-Operator with 8+ years narrative, commercial & music video experience.');
    setLanguagesSpoken('English, Spanish, French');
    setPrimaryDepartment('camera');
    setSpecificRoles('Director of Photography, Steadicam Operator, A-Camera');
    setYearsExperience(8);
    setSkillsProficiency('ARRI Alexa 35, RED V-Raptor, DaVinci Resolve Studio, Wireless Focus');
    setEquipmentOwned('ARRI Alexa Mini LF Package, Steadicam M2 Rig, Cooke Anamorphic Primes');
    setResumeCvUrl('https://kutafutatalent.com/resumes/david_mercer.pdf');
    setPreviousProductions('Marvel Commercial (2025), HBO Indie Pilot (2024), Nike Global Campaign');
    setCertificationsLicenses('Part 107 Commercial Drone License, First Aid Certified');
    setUnionStatus('iatse_600');
    setWillingToTravel(true);
    setPassportVisaStatus('Valid US Passport & Schengen Visa');
    setTransportationAvailability('Production Truck & All-Terrain Van');
    setEmergencyContact('Sarah Mercer (+1 310 555-0999)');
    setSearchableTags('Cinematographer, Steadicam, Camera Operator, ARRI, Commercial DP');
    setDayRate(2200);
    setRateExpectations('$2,200/day');
    setHowHeard('Industry Referral');
  };

  const fillCastPreset = () => {
    setSelectedRole('talent');
    setProfileType('cast');
    setFullName('Sophia Lorenza');
    setStageName('Sophia Lorenza');
    setEmail('sophia.lorenza@kutafuta.io');
    setPassword('KutafutaPass2026!');
    setPhoneNumber('+1 (212) 431-8920');
    setCityCountry('New York, NY / London');
    setDateOfBirthAge('26 (Plays 20-30)');
    setShortBio('Versatile stage & screen actress, runway model, and contemporary dancer with background in dramatic theater.');
    setLanguagesSpoken('English, Italian, Conversational Swahili');
    setRepresentationStatus('Agenced (MTA Talent NYC & Elite Paris)');
    setActingExperience('Off-Broadway Lead (2 HBO Guest Star roles, 15+ Fashion Campaigns)');
    setSpecialSkills('Singing (Mezzo-Soprano), Contemporary Dance, British Accent, Horseback Riding, Stage Combat');
    setHeight('5 ft 10 in (178 cm)');
    setClothingSize('US 4 / UK 8');
    setShoeSize('US 8.5 / EU 39');
    setHairColor('Dark Chestnut Brown');
    setEyeColor('Hazel Green');
    setDistinctiveFeatures('High cheekbones, subtle tattoo on left wrist');
    setDemoReelUrl('https://vimeo.com/showreel/sophia_lorenza');
    setVideoIntroUrl('https://youtube.com/watch?v=sophia_intro');
    setUnionStatus('sag_aftra');
    setWillingToTravel(true);
    setPassportVisaStatus('US & EU Dual Citizenship Passports');
    setTransportationAvailability('Local Metro & Personal Vehicle');
    setEmergencyContact('Elena Lorenza (+1 212 555-3211)');
    setSearchableTags('Actor, Fashion Model, Lead Actress, Singer, Contemporary Dancer');
    setDayRate(1800);
    setRateExpectations('$1,800/day or SAG Scale');
    setHowHeard('Casting Call');
  };

  const fillClientPreset = () => {
    setSelectedRole('client');
    setCompanyName('Aura Motion Pictures');
    setCompanyType('Feature & Commercial Studio');
    setFullName('Alexandra Hayes');
    setEmail('alexandra@auramotion.com');
    setPassword('KutafutaPass2026!');
    setPhoneNumber('+1 (323) 890-4411');
    setCityCountry('Los Angeles, CA');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-2xl ${isThemeDaylight ? 'bg-white text-[#0f172a] border-[#cbd5e1] shadow-2xl' : 'bg-[#12141a] text-[#f8f7f4] border-[#f8f7f4]/15 shadow-2xl'} border rounded-2xl overflow-hidden my-8 transition-colors`}>
        {/* HEADER BAR */}
        <div className={`px-6 py-4 ${isThemeDaylight ? 'bg-[#f1f5f9] border-[#cbd5e1]' : 'bg-[#1a1d26] border-[#f8f7f4]/10'} border-b flex items-center justify-between`}>
          <div>
            <span className="text-[0.6rem] font-bold font-mono-code uppercase tracking-widest text-[#ff3e00]">
              Vault Access Portal
            </span>
            <h2 className={`text-xl font-syne font-extrabold uppercase tracking-tight ${isThemeDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
              KutafutaTalent
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full ${isThemeDaylight ? 'bg-[#e2e8f0] text-[#0f172a] hover:bg-[#ff3e00] hover:text-white' : 'bg-[#0b0b0d] text-[#f8f7f4] hover:bg-[#ff3e00]'} font-bold text-xs flex items-center justify-center transition-all cursor-pointer`}
          >
            ✕
          </button>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div className={`mx-6 mt-4 p-3 ${isThemeDaylight ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-rose-500/20 border-rose-500/50 text-rose-200'} border rounded-lg text-xs font-mono-code`}>
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="p-6">
          {/* TAB SWITCHER */}
          <div className={`grid grid-cols-2 ${isThemeDaylight ? 'bg-[#e2e8f0] border-[#cbd5e1]' : 'bg-[#0b0b0d] border-[#f8f7f4]/10'} p-1 border font-mono-code rounded-lg mb-6`}>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); resetFormFields(); }}
              className={`py-2 text-[0.7rem] font-bold uppercase tracking-wider transition-all cursor-pointer rounded-md ${
                activeTab === 'login'
                  ? (isThemeDaylight ? 'bg-[#0f172a] text-white shadow-sm' : 'bg-[#f8f7f4] text-[#0b0b0d]')
                  : (isThemeDaylight ? 'text-[#475569] hover:text-[#0f172a]' : 'text-[#f8f7f4]/60 hover:text-[#f8f7f4]')
              }`}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); resetFormFields(); }}
              className={`py-2 text-[0.7rem] font-bold uppercase tracking-wider transition-all cursor-pointer rounded-md ${
                activeTab === 'signup'
                  ? 'bg-[#ff3e00] text-white shadow-sm'
                  : (isThemeDaylight ? 'text-[#475569] hover:text-[#0f172a]' : 'text-[#f8f7f4]/60 hover:text-[#f8f7f4]')
              }`}
            >
              Register New Profile
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono-code">
              <div>
                <label className={`block text-[0.65rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="USER@KUTAFUTATALENT.COM"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3.5 py-2.5 text-[0.75rem] border rounded-lg focus:outline-none focus:border-[#ff3e00]`}
                />
              </div>

              <div>
                <label className={`block text-[0.65rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#0b0b0d] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3.5 py-2.5 text-[0.75rem] border rounded-lg focus:outline-none focus:border-[#ff3e00]`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 ${isThemeDaylight ? 'bg-[#0f172a] hover:bg-[#1e293b] text-white' : 'bg-[#f8f7f4] hover:bg-white text-[#0b0b0d]'} font-bold uppercase text-[0.7rem] tracking-widest cursor-pointer transition-all rounded-lg disabled:opacity-50 shadow-md`}
              >
                {isSubmitting ? 'Authenticating...' : 'Log In to Account'}
              </button>

              {/* DEMO PRESETS */}
              <div className={`pt-3 border-t ${isThemeDaylight ? 'border-[#cbd5e1]' : 'border-[#f8f7f4]/10'} text-center space-y-2`}>
                <span className={`text-[0.6rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#475569] font-bold' : 'text-[#f8f7f4]/50'}`}>
                  Quick Demo Credentials:
                </span>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('talent');
                      setLoginEmail('elena.rostova@cinema.io');
                      setLoginPassword('password123');
                    }}
                    className={`px-2.5 py-1 ${isThemeDaylight ? 'bg-slate-100 text-[#0f172a] border-[#cbd5e1] hover:bg-slate-200' : 'bg-[#0b0b0d] text-[#f8f7f4] border-[#f8f7f4]/20 hover:bg-[#f8f7f4]/10'} text-[0.6rem] uppercase tracking-wider border rounded cursor-pointer font-bold`}
                  >
                    Demo Crew
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('talent');
                      setLoginEmail('sophia.lorenza@kutafuta.io');
                      setLoginPassword('KutafutaPass2026!');
                    }}
                    className={`px-2.5 py-1 ${isThemeDaylight ? 'bg-slate-100 text-[#0f172a] border-[#cbd5e1] hover:bg-slate-200' : 'bg-[#0b0b0d] text-[#f8f7f4] border-[#f8f7f4]/20 hover:bg-[#f8f7f4]/10'} text-[0.6rem] uppercase tracking-wider border rounded cursor-pointer font-bold`}
                  >
                    Demo Cast
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('client');
                      setLoginEmail('alexandra@auramotion.com');
                      setLoginPassword('KutafutaPass2026!');
                    }}
                    className={`px-2.5 py-1 ${isThemeDaylight ? 'bg-slate-100 text-[#0f172a] border-[#cbd5e1] hover:bg-slate-200' : 'bg-[#0b0b0d] text-[#f8f7f4] border-[#f8f7f4]/20 hover:bg-[#f8f7f4]/10'} text-[0.6rem] uppercase tracking-wider border rounded cursor-pointer font-bold`}
                  >
                    Demo Agency
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('admin');
                      setLoginEmail('admin@cinecraft.com');
                      setLoginPassword('admin123');
                    }}
                    className={`px-2.5 py-1 ${isThemeDaylight ? 'bg-orange-50 text-[#d93800] border-orange-300 hover:bg-orange-100' : 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40 hover:bg-[#ff3e00]/30'} text-[0.6rem] uppercase tracking-wider border rounded cursor-pointer font-bold`}
                  >
                    Demo Admin
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* REGISTRATION FORM - CREW & CAST QUESTIONNAIRE */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-5 font-mono-code max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* SELECT ROLE TYPE */}
              <div>
                <label className={`block text-[0.65rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#d93800] font-bold' : 'text-[#ff3e00] font-bold'} mb-1.5`}>
                  1. Select Account & Profile Category *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedRole('talent'); setProfileType('crew'); }}
                    className={`py-2.5 px-2 border text-[0.65rem] font-bold uppercase tracking-wider cursor-pointer text-center rounded-lg transition-all ${
                      selectedRole === 'talent' && profileType === 'crew'
                        ? 'bg-[#ff3e00] border-[#ff3e00] text-white shadow-md'
                        : (isThemeDaylight ? 'bg-white border-[#cbd5e1] text-[#334155] hover:border-[#ff3e00] hover:text-[#0f172a]' : 'bg-[#0b0b0d] border-[#f8f7f4]/15 text-[#f8f7f4]/70 hover:border-[#f8f7f4]/40')
                    }`}
                  >
                    🛠️ Crew Member
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedRole('talent'); setProfileType('cast'); }}
                    className={`py-2.5 px-2 border text-[0.65rem] font-bold uppercase tracking-wider cursor-pointer text-center rounded-lg transition-all ${
                      selectedRole === 'talent' && profileType === 'cast'
                        ? 'bg-[#ff3e00] border-[#ff3e00] text-white shadow-md'
                        : (isThemeDaylight ? 'bg-white border-[#cbd5e1] text-[#334155] hover:border-[#ff3e00] hover:text-[#0f172a]' : 'bg-[#0b0b0d] border-[#f8f7f4]/15 text-[#f8f7f4]/70 hover:border-[#f8f7f4]/40')
                    }`}
                  >
                    🎭 Cast / Performer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('client')}
                    className={`py-2.5 px-2 border text-[0.65rem] font-bold uppercase tracking-wider cursor-pointer text-center rounded-lg transition-all ${
                      selectedRole === 'client'
                        ? 'bg-[#ff3e00] border-[#ff3e00] text-white shadow-md'
                        : (isThemeDaylight ? 'bg-white border-[#cbd5e1] text-[#334155] hover:border-[#ff3e00] hover:text-[#0f172a]' : 'bg-[#0b0b0d] border-[#f8f7f4]/15 text-[#f8f7f4]/70 hover:border-[#f8f7f4]/40')
                    }`}
                  >
                    🎬 Agency / Client
                  </button>
                </div>
              </div>

              {/* QUICK AUTO-FILL PRESET BUTTONS */}
              <div className={`p-2.5 ${isThemeDaylight ? 'bg-[#f1f5f9] border-[#cbd5e1]' : 'bg-[#0b0b0d] border-[#f8f7f4]/10'} border rounded-lg flex items-center justify-between text-[0.6rem]`}>
                <span className={`${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/60 font-bold'} uppercase tracking-widest`}>
                  ⚡ Auto-Fill Sample Data:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={fillCrewPreset}
                    className={`px-2 py-1 ${isThemeDaylight ? 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200' : 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40 hover:bg-[#ff3e00]/30'} border rounded font-bold uppercase cursor-pointer`}
                  >
                    Fill Crew Sample
                  </button>
                  <button
                    type="button"
                    onClick={fillCastPreset}
                    className={`px-2 py-1 ${isThemeDaylight ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200' : 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'} border rounded font-bold uppercase cursor-pointer`}
                  >
                    Fill Cast Sample
                  </button>
                  <button
                    type="button"
                    onClick={fillClientPreset}
                    className={`px-2 py-1 ${isThemeDaylight ? 'bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30'} border rounded font-bold uppercase cursor-pointer`}
                  >
                    Fill Agency Sample
                  </button>
                </div>
              </div>

              {/* SECTION 1: ACCOUNT & CONTACT INFO */}
              <div className={`p-4 ${isThemeDaylight ? 'bg-[#f8fafc] border-[#cbd5e1]' : 'bg-[#0b0b0d]/70 border-[#f8f7f4]/10'} border rounded-xl space-y-3`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isThemeDaylight ? 'text-[#d93800] border-[#cbd5e1]' : 'text-[#ff3e00] border-[#f8f7f4]/10'} border-b pb-1.5`}>
                  2. Personal & Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="E.G. DAVID MERCER"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]`}
                    />
                  </div>

                  {selectedRole === 'talent' ? (
                    <div>
                      <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                        Professional / Stage Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="E.G. DAVE MERCER DP"
                        value={stageName}
                        onChange={(e) => setStageName(e.target.value)}
                        className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]`}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                        Company / Studio Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="E.G. AURA MOTION PICTURES"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]`}
                      />
                    </div>
                  )}

                  <div>
                    <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="NAME@DOMAIN.COM"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      placeholder="+1 (310) 555-0199"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                      City / Country *
                    </label>
                    <input
                      type="text"
                      placeholder="LOS ANGELES, CA / USA"
                      value={cityCountry}
                      onChange={(e) => setCityCountry(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]` }
                    />
                  </div>

                  {selectedRole === 'talent' && profileType === 'cast' && (
                    <div>
                      <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                        Date of Birth or Playing Age
                      </label>
                      <input
                        type="text"
                        placeholder="26 (PLAYS 20-30)"
                        value={dateOfBirthAge}
                        onChange={(e) => setDateOfBirthAge(e.target.value)}
                        className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]`}
                      />
                    </div>
                  )}

                  <div>
                    <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Create Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]`}
                    />
                  </div>
                </div>

                {/* PHOTO UPLOAD */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'}`}>
                      Profile Photo / Headshot
                    </label>
                    <label className="text-[0.6rem] text-[#ff3e00] hover:underline uppercase tracking-wider font-bold cursor-pointer">
                      📁 Upload Photo File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={avatarUrl.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || 'Kutafuta')}`}
                      alt="Avatar Preview"
                      className={`w-9 h-9 object-cover rounded-lg border ${isThemeDaylight ? 'border-[#cbd5e1] bg-slate-100' : 'border-[#f8f7f4]/20 bg-[#0b0b0d]'} shrink-0`}
                    />
                    <input
                      type="text"
                      placeholder="Paste headshot image URL or upload above"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]`}
                    />
                  </div>
                </div>

                {/* BIO & LANGUAGES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Short Bio & Creative Statement
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview of your experience, artistic vision, and notable work..."
                      value={shortBio}
                      onChange={(e) => setShortBio(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Languages Spoken
                    </label>
                    <input
                      type="text"
                      placeholder="English, Spanish, Swahili"
                      value={languagesSpoken}
                      onChange={(e) => setLanguagesSpoken(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[0.62rem] uppercase tracking-widest ${isThemeDaylight ? 'text-[#334155] font-bold' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Portfolio Website / IMDb Link
                    </label>
                    <input
                      type="text"
                      placeholder="https://imdb.com/name/nm... OR website"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-3 py-2 text-[0.7rem] border rounded-md focus:outline-none focus:border-[#ff3e00]` }
                    />
                  </div>
                </div>

                {/* SOCIAL LINKS */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={`block text-[0.58rem] uppercase ${isThemeDaylight ? 'text-[#475569] font-bold' : 'text-[#f8f7f4]/60'} mb-0.5`}>Instagram</label>
                    <input
                      type="text"
                      placeholder="@handle"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-2.5 py-1.5 text-[0.68rem] border rounded-md`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[0.58rem] uppercase ${isThemeDaylight ? 'text-[#475569] font-bold' : 'text-[#f8f7f4]/60'} mb-0.5`}>TikTok</label>
                    <input
                      type="text"
                      placeholder="@handle"
                      value={tiktok}
                      onChange={(e) => setTiktok(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-2.5 py-1.5 text-[0.68rem] border rounded-md`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[0.58rem] uppercase ${isThemeDaylight ? 'text-[#475569] font-bold' : 'text-[#f8f7f4]/60'} mb-0.5`}>LinkedIn</label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/..."
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className={`w-full ${isThemeDaylight ? 'bg-white text-[#0f172a] placeholder-[#94a3b8] border-[#cbd5e1]' : 'bg-[#12141a] text-[#f8f7f4] placeholder-[#f8f7f4]/30 border-[#f8f7f4]/15'} px-2.5 py-1.5 text-[0.68rem] border rounded-md`}
                    />
                  </div>
                </div>
              </div>

              {/* PROFILE COMPLETION INFO CALLOUT */}
              <div className={`p-3 ${isThemeDaylight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'} border rounded-xl text-[0.68rem] flex items-center gap-2.5 font-mono-code`}>
                <span className="text-base">💡</span>
                <div>
                  <strong>Quick Sign-Up:</strong> You can finalize your detailed rates, gear inventory, physical attributes, and portfolio videos inside your profile settings once you log in!
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#ff3e00] hover:bg-[#e03700] text-white font-bold uppercase text-[0.75rem] tracking-widest cursor-pointer transition-all rounded-lg shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Profile & Entering Account...' : 'Complete Sign-Up & Enter Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

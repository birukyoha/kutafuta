// File: /src/pages/PricingPage.tsx
// Comprehensive Film, Cast & Crew Pricing & Production Packages Page

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  X,
  Send,
  Phone,
  Mail,
  Building2,
  CreditCard,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Film,
  Clapperboard,
  Users,
  Award,
  Video,
  Calendar,
  TrendingUp,
  Briefcase,
  ShieldCheck,
  Zap,
  MessageSquare,
  ArrowRight,
  Tv,
  Star,
  Camera,
  Layers,
  FileCheck,
  Lock,
  LogIn,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface PricingPageProps {
  currentUser?: { user: User; profile: any };
  onNavigate: (route: string, params?: any) => void;
  onOpenAuth?: (tab: 'login' | 'signup') => void;
  isDaylight?: boolean;
}

export interface ComprehensivePlan {
  id: string;
  name: string;
  tierSubtitle: string;
  priceETB: string;
  priceNote: string;
  billingCycle: string;
  popular?: boolean;
  badge?: string;
  cardColor?: string;
  description: string;
  planIncludes: {
    text: string;
    info?: string;
  }[];
  preRequestExtras?: {
    text: string;
    info?: string;
  }[];
  ctaText: string;
}

const PRICING_TIERS: ComprehensivePlan[] = [
  {
    id: 'pay_per_post',
    name: 'Pay-per-Post',
    tierSubtitle: 'SINGLE CASTING / CREW CALL',
    priceETB: '1,495',
    priceNote: 'including 15% VAT',
    billingCycle: 'ETB / Post',
    description: 'Perfect for one-time casting or emergency replacement crew on set.',
    ctaText: 'Post Single Call',
    planIncludes: [
      { text: '1 Casting Call or Crew Job Post', info: 'Active for 30 days on KutafutaTalent board' },
      { text: '1 Free Recruiter / Casting Assistant Seat', info: 'Manage applications and review candidate reels' },
      { text: 'Multi-platform broadcast', info: 'Cross-posted to Kutafuta Web + Mobile channels' },
      { text: 'Call center & WhatsApp support', info: 'Direct assistance during normal production hours' },
      { text: 'Direct showreel & audition tape review' },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    tierSubtitle: 'INDIE PRODUCTIONS & MUSIC VIDEOS',
    priceETB: '9,890',
    priceNote: 'including 15% VAT',
    billingCycle: 'ETB / Year',
    description: 'Affordable for indie filmmakers, music video directors & short films.',
    ctaText: 'Get Starter Plan',
    planIncludes: [
      { text: '10 Casting & Crew Job Posts', info: 'Use across multiple project phases over 12 months' },
      { text: '1 Free Recruiter / Casting Director Seat' },
      { text: 'Multi-platform distribution', info: 'Kutafuta network, Telegram casting channels & alerts' },
      { text: '24h Call center & production support' },
      { text: 'Full talent CV and showreel downloads' },
    ],
    preRequestExtras: [
      { text: '3 Telegram Channel Pinned Broadcasts', info: 'Featured to 45,000+ film talent subscribers' },
      { text: 'Standard Applicant Filtering & Role Tagging' },
      { text: 'Talent Contact Unlocks (Up to 150 CVs)' },
    ],
  },
  {
    id: 'growth',
    name: 'Studio Growth',
    tierSubtitle: 'COMMERCIAL AGENTS & TV SERIES',
    priceETB: '21,850',
    priceNote: 'including 15% VAT',
    billingCycle: 'ETB / Year',
    popular: true,
    badge: 'MOST POPULAR FOR STUDIOS',
    description: 'Great for rising production houses, commercial agencies & serial TV dramas.',
    ctaText: 'Get Studio Growth',
    planIncludes: [
      { text: '25 Casting & Crew Job Posts', info: 'Unlimited roll-over during the active 12-month year' },
      { text: '1 Free + 2 Recruiter / Casting Seats', info: 'Assign 1st AD, Casting Director, and Producer accounts' },
      { text: 'Instant Auto-Approval on Shoot Calls', info: 'Go live immediately without moderation queues' },
      { text: 'Multi-platform prioritized broadcast', info: 'Top of feed placement and Telegram push alerts' },
      { text: 'Dedicated 24/7 Production Support Specialist' },
    ],
    preRequestExtras: [
      { text: '6 Telegram Channel Pinned Broadcasts' },
      { text: '2 Advertised Spotlight Casting Posts' },
      { text: '2 Audition Video / Applicant Screenings', info: 'Our casting team pre-evaluates audition tapes for you' },
      { text: '1 Specialized Crew Headhunt (Intermediate)', info: 'Direct recruiting assistance for key crew like DP, Gaffer, 1st AD' },
      { text: 'Talent Contact Unlocks (Up to 500 CVs)' },
    ],
  },
  {
    id: 'corporate',
    name: 'Major Studio',
    tierSubtitle: 'FEATURE FILM SLATES & BROADCASTERS',
    priceETB: '37,950',
    priceNote: 'including 15% VAT',
    billingCycle: 'ETB / Year',
    description: 'Designed for major feature films, TV broadcast networks & global studios.',
    ctaText: 'Get Major Studio Plan',
    planIncludes: [
      { text: '50 Casting & Crew Job Posts', info: 'High-volume casting for full feature slates & series' },
      { text: '1 Free + 5 Recruiter / Casting Coordinator Seats' },
      { text: 'Instant Auto-Approval & Priority Listing' },
      { text: 'Multi-Platform + Direct Talent SMS/Email Blasts' },
      { text: 'Dedicated Senior Account & Casting Executive' },
    ],
    preRequestExtras: [
      { text: '12 Telegram Channel Pinned Broadcasts' },
      { text: '4 Advertised Spotlight Hero Casting Posts' },
      { text: '4 Comprehensive Audition Tape Pre-Screenings' },
      { text: '2 Executive Crew Headhunts (Senior / Key Crew)', info: 'Assisted placement for Lead Cast, Chief DP, Post Supervisor' },
      { text: 'Unlimited CV Downloads & Direct Talent Outreach' },
      { text: 'Custom Production NDA & Contract Templates' },
    ],
  },
];

const TRUSTED_STUDIOS = [
  { name: 'Kana TV', category: 'Broadcaster & Drama' },
  { name: 'Zeleman Productions', category: 'Commercial Agency' },
  { name: 'Kuraz Cinema', category: 'Feature Film House' },
  { name: 'Bole Studios', category: 'Production & Post' },
  { name: 'Balageru Media', category: 'Television & Music' },
  { name: 'Habesha Castings', category: 'Talent Agency' },
  { name: 'Prime Media', category: 'Commercial & Doc' },
  { name: 'Ethiopian Film Guild', category: 'Industry Guild' },
];

export const PricingPage: React.FC<PricingPageProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth,
  isDaylight = false,
}) => {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'project'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<ComprehensivePlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState<boolean>(false);
  const [pendingPlan, setPendingPlan] = useState<ComprehensivePlan | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>(currentUser?.user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<string>('telebirr');
  const [productionType, setProductionType] = useState<string>('feature_film');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // FAQ Tab & State
  const [faqTab, setFaqTab] = useState<'production' | 'talent'>('production');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Notice Banner State
  const [showTopNotice, setShowTopNotice] = useState<boolean>(true);

  const isUserLoggedIn = Boolean(
    currentUser &&
    currentUser.user &&
    currentUser.user.id !== 'guest' &&
    currentUser.user.role !== 'guest' &&
    currentUser.user.email
  );

  const handleSelectPlan = (plan: ComprehensivePlan) => {
    if (!isUserLoggedIn) {
      setPendingPlan(plan);
      setIsAuthPromptOpen(true);
      return;
    }
    setSelectedPlan(plan);
    setCompanyName(currentUser?.user?.full_name || '');
    setContactEmail(currentUser?.user?.email || '');
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const handleCustomQuote = () => {
    const customPlan: ComprehensivePlan = {
      id: 'custom_enterprise',
      name: 'Custom Production & Casting Package',
      tierSubtitle: 'BESPOKE CAST & CREW RECRUITMENT',
      priceETB: 'Custom',
      priceNote: 'Tailored to your shoot schedule',
      billingCycle: 'Per Project',
      description: 'End-to-end casting, on-set crew staffing, extras coordination & executive search.',
      ctaText: 'Submit Inquiry',
      planIncludes: [
        { text: 'Custom number of casting calls and crew postings' },
        { text: 'Dedicated On-Set Casting Manager' },
        { text: 'Audition venue & video capture assistance' },
      ]
    };

    if (!isUserLoggedIn) {
      setPendingPlan(customPlan);
      setIsAuthPromptOpen(true);
      return;
    }

    setSelectedPlan(customPlan);
    setCompanyName(currentUser?.user?.full_name || '');
    setContactEmail(currentUser?.user?.email || '');
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      const existing = JSON.parse(localStorage.getItem('kutafuta_plan_requests') || '[]');
      existing.push({
        id: 'PLAN-REQ-' + Date.now(),
        planId: selectedPlan?.id,
        planTitle: selectedPlan?.name,
        price: selectedPlan?.priceETB + ' ETB',
        billingCycle: selectedPlan?.billingCycle,
        companyName: companyName || currentUser?.user?.full_name || 'Production Client',
        contactPhone,
        contactEmail,
        productionType,
        paymentMethod,
        notes,
        status: 'pending_activation',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('kutafuta_plan_requests', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
    }, 3500);
  };

  const productionFaqs = [
    {
      q: 'Can I post both Crew jobs and Cast / Actor audition calls on the same plan?',
      a: 'Yes, absolutely. Every plan on KutafutaTalent provides unified call credits that can be used flexibly for any department: Cast (Lead Actors, Supporting, Extras, Voiceover, Models) and Crew (Director of Photography, Sound Mixers, Editors, Grips, Gaffers, Costume Designers, etc.).',
    },
    {
      q: 'How does audition tape submission and video screening work?',
      a: 'When you publish an Actor or Model casting call, applicants can directly link or upload their self-tape audition videos, demo reels, and high-res headshots. On Growth and Corporate tiers, our in-house casting directors will pre-screen and filter tapes according to your character brief.',
    },
    {
      q: 'What payment methods are supported in Ethiopia and for diaspora productions?',
      a: 'We support instant local payments via Telebirr Direct, CBE Birr, Dashen Bank / Amole, Commercial Bank of Ethiopia direct account transfer, and wire transfers. For diaspora & international co-productions, we accept international credit/debit cards.',
    },
    {
      q: 'What happens to my job postings when my subscription period ends?',
      a: 'All candidate applications, CVs, and audition tapes you received remain permanently accessible in your Agency Portal dashboard. Your published calls will expire gracefully at the end of their 30-day listing cycle unless you choose to renew.',
    },
    {
      q: 'Can KutafutaTalent help recruit specialized key crew (DP, Gaffer, Sound Recordist)?',
      a: 'Yes! Our Studio Growth and Corporate tiers include specialized headhunting credits. Our production staffing team will tap into our private roster of verified, award-winning cinematography, audio, and technical talent in Addis Ababa and across East Africa.',
    },
    {
      q: 'Can we manage background extras and crowd casting for large feature shoots?',
      a: 'Yes. Our platform has over 2,500+ registered background actors, dancers, and models. For bulk extras casting (50 to 500+ extras), our Enterprise package includes on-set coordinator support to organize check-in and wardrobe schedules.',
    },
  ];

  const talentFaqs = [
    {
      q: 'Is creating a profile and applying to casting calls free for talent?',
      a: 'Yes! Talent registration, uploading showreels, building portfolios, and submitting audition tapes to public casting calls is 100% free for all actors, crew members, models, voiceover artists, and directors.',
    },
    {
      q: 'How do production companies contact me after I apply?',
      a: 'Producers and casting directors can message you directly through the platform or access your verified phone number, email, and agent contact if your profile is verified.',
    },
    {
      q: 'How can I get the Verified Talent Badge for my showreel and experience?',
      a: 'You can submit proof of previous film credits, IMDb links, YouTube/Vimeo showreels, or production references via your Talent Portal dashboard. Our curation board reviews verifications within 24-48 hours.',
    },
  ];

  const activeFaqList = faqTab === 'production' ? productionFaqs : talentFaqs;

  return (
    <div className={`min-h-screen ${isDaylight ? 'bg-[#f0f3f8] text-[#0f172a]' : 'bg-[#181a20] text-[#f8f7f4]'} font-['Inter',sans-serif] selection:bg-[#ff3e00] selection:text-white pb-24 transition-colors duration-300`}>
      
      {/* TOP PROMO NOTICE BANNER */}
      {showTopNotice && (
        <div className={`${isDaylight ? 'bg-[#e2e8f0] border-[#cbd5e1] text-[#0f172a]' : 'bg-[#111114] border-[#ff3e00]/30 text-[#f8f7f4]'} border-b py-2.5 px-4 font-mono-code text-[0.68rem] uppercase tracking-wider relative flex items-center justify-center text-center transition-colors`}>
          <div className="flex items-center gap-2 max-w-4xl mx-auto flex-wrap justify-center">
            <span className="inline-block w-2 h-2 rounded-full bg-[#ff3e00] animate-ping" />
            <span className={isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/90'}>
              Want to hire film crew or cast faster? Join our active Telegram casting channel:
            </span>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="text-[#ff3e00] font-bold underline hover:text-[#d93800] transition-colors ml-1"
            >
              Join here →
            </a>
          </div>
          <button
            onClick={() => setShowTopNotice(false)}
            className={`absolute right-4 ${isDaylight ? 'text-[#64748b] hover:text-[#0f172a]' : 'text-[#f8f7f4]/40 hover:text-white'} p-1 transition-colors`}
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* HERO / HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 text-center space-y-4">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 ${isDaylight ? 'bg-white border-[#ff3e00]/40 shadow-sm' : 'bg-[#111114] border-[#ff3e00]/40'} border rounded-full font-mono-code text-[0.7rem] uppercase tracking-widest text-[#ff3e00]`}>
          <Sparkles className="w-3.5 h-3.5 text-[#ff3e00]" />
          PLANS FOR STUDIOS, CASTING DIRECTORS & PRODUCERS
        </div>

        <h1
          className={`font-syne text-[36px] leading-[44px] font-extrabold uppercase tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}
          style={{ fontSize: '36px', lineHeight: '44px' }}
        >
          Transparent <span className="text-[#ff3e00]">Pricing</span>
        </h1>

        <p className={`max-w-3xl mx-auto font-mono-code text-xs sm:text-sm ${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/70'} uppercase tracking-wide leading-relaxed`}>
          Get started on KutafutaTalent for free. Upgrade for more casting calls, verified crew showreels, instant audition tape uploads, talent screening, and dedicated on-set production staffing. Save up to 50% on job posts and build a stronger film & media team faster.
        </p>

        {/* BILLING TOGGLE */}
        <div className="pt-4 flex items-center justify-center">
          <div className={`${isDaylight ? 'bg-[#e2e8f0] border-[#cbd5e1]' : 'bg-[#111114] border-[#f8f7f4]/15'} border p-1 rounded-full flex items-center gap-1 font-mono-code text-xs shadow-inner`}>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-[#ff3e00] text-white shadow-md'
                  : (isDaylight ? 'text-[#475569] hover:text-[#0f172a]' : 'text-[#f8f7f4]/60 hover:text-white')
              }`}
            >
              Annual Subscriptions <span className="text-[0.65rem] opacity-90">(Save 20%)</span>
            </button>
            <button
              onClick={() => setBillingCycle('project')}
              className={`px-5 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
                billingCycle === 'project'
                  ? 'bg-[#ff3e00] text-white shadow-md'
                  : (isDaylight ? 'text-[#475569] hover:text-[#0f172a]' : 'text-[#f8f7f4]/60 hover:text-white')
              }`}
            >
              Single Project / Pay-Per-Post
            </button>
          </div>
        </div>
      </div>

      {/* 4 PRIMARY PRICING CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const isPopular = tier.popular;

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 ${
                  isPopular
                    ? (isDaylight
                        ? 'bg-gradient-to-b from-[#fff5f2] to-[#ffffff] text-[#0f172a] border-2 border-[#ff3e00] shadow-[0_12px_36px_rgba(255,62,0,0.18)] ring-2 ring-[#ff3e00]/25'
                        : 'bg-gradient-to-b from-[#252834] to-[#121318] text-[#f8f7f4] border-2 border-[#ff3e00] shadow-[0_12px_40px_rgba(255,62,0,0.25)] ring-2 ring-[#ff3e00]/30'
                      )
                    : (isDaylight
                        ? 'bg-white text-[#0f172a] border border-[#cbd5e1] hover:border-[#ff3e00]/60 shadow-md'
                        : 'bg-[#111114] text-[#f8f7f4] border border-[#f8f7f4]/15 hover:border-[#ff3e00]/40 shadow-xl'
                      )
                }`}
              >
                {/* POPULAR BADGE */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ff3e00] text-white text-[0.65rem] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg font-mono-code border border-[#ff3e00]">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* CARD HEADER */}
                  <div>
                    <h3 className={`font-syne text-2xl font-bold uppercase tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                      {tier.name}
                    </h3>
                    <p className="font-mono-code text-[0.68rem] font-bold tracking-wider uppercase text-[#ff3e00] mt-0.5">
                      {tier.tierSubtitle}
                    </p>
                  </div>

                  {/* PRICE BLOCK */}
                  <div className={`border-b ${isDaylight ? 'border-[#cbd5e1]' : 'border-[#f8f7f4]/10'} pb-5`}>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`font-syne text-4xl font-extrabold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                        {tier.priceETB}
                      </span>
                      <span className="font-mono-code text-xs font-bold text-[#ff3e00]">
                        {tier.billingCycle}
                      </span>
                    </div>
                    <p className={`font-mono-code text-[0.65rem] ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50'} uppercase mt-1`}>
                      {tier.priceNote}
                    </p>
                    <p className={`font-mono-code text-xs ${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/75'} uppercase mt-3 leading-relaxed`}>
                      {tier.description}
                    </p>
                  </div>

                  {/* PLAN INCLUDES */}
                  <div className="space-y-3 font-mono-code">
                    <div className={`text-[0.68rem] font-bold uppercase tracking-widest ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50'}`}>
                      Plan Includes:
                    </div>
                    <ul className="space-y-2.5 text-xs">
                      {tier.planIncludes.map((inc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#ff3e00] mt-0.5" />
                          <span className={`${isDaylight ? 'text-[#1e293b]' : 'text-[#f8f7f4]/85'} leading-snug font-medium`}>
                            {inc.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* PRE-REQUEST / EXTRAS */}
                  {tier.preRequestExtras && tier.preRequestExtras.length > 0 && (
                    <div className={`space-y-2.5 font-mono-code pt-3 border-t ${isDaylight ? 'border-[#cbd5e1]' : 'border-[#f8f7f4]/10'}`}>
                      <div className="text-[0.65rem] font-bold uppercase tracking-widest text-[#ff3e00]">
                        Production Extras:
                      </div>
                      <ul className="space-y-2 text-xs">
                        {tier.preRequestExtras.map((ext, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Zap className="w-3.5 h-3.5 flex-shrink-0 text-[#ff3e00] mt-0.5" />
                            <span className={`${isDaylight ? 'text-[#1e293b]' : 'text-[#f8f7f4]/80'} text-[0.72rem] leading-snug font-medium`}>
                              {ext.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CTA BUTTON */}
                <div className="pt-8">
                  <button
                    onClick={() => handleSelectPlan(tier)}
                    className={`w-full py-3.5 px-4 rounded-xl font-mono-code font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-[0.98] ${
                      isPopular
                        ? 'bg-[#ff3e00] hover:bg-[#e03500] text-white shadow-[0_4px_25px_rgba(255,62,0,0.4)]'
                        : (isDaylight
                            ? 'bg-[#f1f5f9] hover:bg-[#ff3e00] text-[#0f172a] hover:text-white border border-[#cbd5e1] hover:border-[#ff3e00]'
                            : 'bg-[#181a20] hover:bg-[#ff3e00] text-[#f8f7f4] hover:text-white border border-[#f8f7f4]/20 hover:border-[#ff3e00]'
                          )
                    }`}
                  >
                    {tier.ctaText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BESPOKE ENTERPRISE PRODUCTION BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`relative rounded-3xl ${isDaylight ? 'bg-gradient-to-r from-white via-[#fff5f2] to-white border-2 border-[#ff3e00]/60 text-[#0f172a] shadow-xl' : 'bg-gradient-to-r from-[#181a20] via-[#20232c] to-[#121318] border-2 border-[#ff3e00]/50 text-[#f8f7f4] shadow-2xl'} p-8 sm:p-10 overflow-hidden transition-colors`}>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#ff3e00]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* LEFT TEXT & ACTIONS */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff3e00]/15 border border-[#ff3e00]/40 rounded-full text-[#ff3e00] font-mono-code text-[0.65rem] font-bold uppercase tracking-widest">
                <Film className="w-3 h-3" />
                PREMIUM ENTERPRISE & BESPOKE FILM PACKAGES
              </div>

              <h2 className={`font-syne text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} tracking-tight`}>
                Need a custom production package?
              </h2>

              <p className={`font-mono-code text-xs sm:text-sm ${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'} uppercase leading-relaxed tracking-wider`}>
                Get tailored casting calls, crowd/extras booking, on-set staffing, and specialized crew headhunting to fit your unique shooting schedule. Contact our production team to build the perfect package for full, end-to-end film & media projects.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <button
                  onClick={handleCustomQuote}
                  className="bg-[#ff3e00] hover:bg-[#e03500] text-white px-6 py-3.5 rounded-xl font-mono-code font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Phone className="w-4 h-4" />
                  Contact Our Casting Team
                </button>

                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  className={`${isDaylight ? 'bg-white hover:bg-slate-100 border-[#cbd5e1] text-[#0f172a]' : 'bg-[#111114] hover:bg-[#282b36] border-[#f8f7f4]/20 text-[#f8f7f4]'} border px-5 py-3.5 rounded-xl font-mono-code font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer`}
                >
                  <Send className="w-4 h-4 text-[#ff3e00]" />
                  Telegram Inquiry
                </a>

                <span className={`font-mono-code text-xs ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/60'} uppercase`}>
                  or call: <strong className={isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}>+251 961 666 667</strong>
                </span>
              </div>
            </div>

            {/* RIGHT ADD-ONS PILLS */}
            <div className="lg:col-span-5 space-y-3 font-mono-code">
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className={`${isDaylight ? 'bg-white border-[#cbd5e1]' : 'bg-[#111114] border-[#f8f7f4]/15'} border p-3 rounded-xl flex items-center gap-2 shadow-sm`}>
                  <Briefcase className="w-4 h-4 text-[#ff3e00]" />
                  <span className={`${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]/90'} text-[0.72rem] uppercase font-bold`}>Bulk Job Posts</span>
                </div>
                <div className={`${isDaylight ? 'bg-white border-[#cbd5e1]' : 'bg-[#111114] border-[#f8f7f4]/15'} border p-3 rounded-xl flex items-center gap-2 shadow-sm`}>
                  <Users className="w-4 h-4 text-[#ff3e00]" />
                  <span className={`${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]/90'} text-[0.72rem] uppercase font-bold`}>Multi-Recruiter</span>
                </div>
                <div className={`${isDaylight ? 'bg-white border-[#cbd5e1]' : 'bg-[#111114] border-[#f8f7f4]/15'} border p-3 rounded-xl flex items-center gap-2 shadow-sm`}>
                  <Send className="w-4 h-4 text-[#ff3e00]" />
                  <span className={`${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]/90'} text-[0.72rem] uppercase font-bold`}>Telegram Pins</span>
                </div>
                <div className={`${isDaylight ? 'bg-white border-[#cbd5e1]' : 'bg-[#111114] border-[#f8f7f4]/15'} border p-3 rounded-xl flex items-center gap-2 shadow-sm`}>
                  <Sparkles className="w-4 h-4 text-[#ff3e00]" />
                  <span className={`${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]/90'} text-[0.72rem] uppercase font-bold`}>Advertised Posts</span>
                </div>
                <div className={`${isDaylight ? 'bg-white border-[#cbd5e1]' : 'bg-[#111114] border-[#f8f7f4]/15'} border p-3 rounded-xl flex items-center gap-2 shadow-sm`}>
                  <Video className="w-4 h-4 text-[#ff3e00]" />
                  <span className={`${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]/90'} text-[0.72rem] uppercase font-bold`}>Audition Screening</span>
                </div>
                <div className={`${isDaylight ? 'bg-white border-[#cbd5e1]' : 'bg-[#111114] border-[#f8f7f4]/15'} border p-3 rounded-xl flex items-center gap-2 shadow-sm`}>
                  <Clapperboard className="w-4 h-4 text-[#ff3e00]" />
                  <span className={`${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]/90'} text-[0.72rem] uppercase font-bold`}>Crew Staffing</span>
                </div>
              </div>

              {/* ENTERPRISE ADD-ONS BAR */}
              <div className={`pt-2 border-t ${isDaylight ? 'border-[#cbd5e1]' : 'border-[#f8f7f4]/10'}`}>
                <div className="text-[0.65rem] uppercase text-[#ff3e00] font-bold tracking-wider mb-2">
                  ENTERPRISE ON-SET ADD-ONS:
                </div>
                <div className="grid grid-cols-3 gap-2 text-[0.65rem] uppercase">
                  <div className={`${isDaylight ? 'bg-white text-[#1e293b] border-[#cbd5e1]' : 'bg-[#111114]/80 text-[#f8f7f4] border-[#f8f7f4]/10'} p-2 rounded-lg border text-center font-medium`}>
                    🎯 Key DP / Crew Headhunt
                  </div>
                  <div className={`${isDaylight ? 'bg-white text-[#1e293b] border-[#cbd5e1]' : 'bg-[#111114]/80 text-[#f8f7f4] border-[#f8f7f4]/10'} p-2 rounded-lg border text-center font-medium`}>
                    👔 On-Set Casting Manager
                  </div>
                  <div className={`${isDaylight ? 'bg-white text-[#1e293b] border-[#cbd5e1]' : 'bg-[#111114]/80 text-[#f8f7f4] border-[#f8f7f4]/10'} p-2 rounded-lg border text-center font-medium`}>
                    ⚖️ Guild Contracts & NDA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TRUSTED LOGO STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center space-y-6">
        <div className={`font-mono-code text-[0.7rem] font-bold uppercase tracking-widest ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50'}`}>
          Top Ethiopian & Regional Studios Trust KutafutaTalent to Cast & Crew Faster
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {TRUSTED_STUDIOS.map((studio, idx) => (
            <div
              key={idx}
              className={`${isDaylight ? 'bg-white border-[#cbd5e1] text-[#0f172a] shadow-sm' : 'bg-[#111114] border-[#f8f7f4]/10 text-[#f8f7f4]'} border rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-1 hover:border-[#ff3e00]/60 transition-colors`}
            >
              <div className={`font-syne text-xs font-extrabold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                {studio.name}
              </div>
              <div className={`font-mono-code text-[0.6rem] ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50'} uppercase`}>
                {studio.category}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED SIDE-BY-SIDE PLAN COMPARISON TABLE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className={`font-syne text-3xl font-extrabold uppercase tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
            Compare Plans
          </h2>
          <p className={`font-mono-code text-xs ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} uppercase tracking-wider`}>
            Everything in each plan, side by side. Prices include 15% VAT.
          </p>
        </div>

        {/* TABLE CONTAINER */}
        <div className={`overflow-x-auto rounded-2xl border ${isDaylight ? 'border-[#cbd5e1] bg-white text-[#0f172a]' : 'border-[#f8f7f4]/15 bg-[#111114] text-[#f8f7f4]'} shadow-2xl font-mono-code text-xs`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] bg-[#f8fafc]' : 'border-[#f8f7f4]/15 bg-[#181a20]'}`}>
                <th className={`p-4 sm:p-5 uppercase font-bold ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/60'} text-[0.7rem] w-2/6`}>
                  FEATURES & SPECS
                </th>
                <th className={`p-4 sm:p-5 text-center font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} text-xs`}>
                  <div>Pay-per-Post</div>
                  <div className="text-[#ff3e00] font-extrabold text-sm mt-0.5">1,495 ETB</div>
                </th>
                <th className={`p-4 sm:p-5 text-center font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} text-xs`}>
                  <div>Starter</div>
                  <div className="text-[#ff3e00] font-extrabold text-sm mt-0.5">9,890 ETB</div>
                </th>
                <th className={`p-4 sm:p-5 text-center font-bold text-[#ff3e00] text-xs ${isDaylight ? 'bg-[#ff3e00]/10 border-x border-[#ff3e00]/30' : 'bg-[#ff3e00]/10 border-x border-[#ff3e00]/30'}`}>
                  <div className="inline-block bg-[#ff3e00] text-white text-[0.6rem] px-2 py-0.5 rounded-full font-bold uppercase mb-1">
                    POPULAR
                  </div>
                  <div>Studio Growth</div>
                  <div className={`${isDaylight ? 'text-[#0f172a]' : 'text-white'} font-extrabold text-sm mt-0.5`}>21,850 ETB</div>
                </th>
                <th className={`p-4 sm:p-5 text-center font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} text-xs`}>
                  <div>Corporate</div>
                  <div className="text-[#ff3e00] font-extrabold text-sm mt-0.5">37,950 ETB</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* SECTION: FUNDAMENTALS */}
              <tr className={`${isDaylight ? 'bg-[#ff3e00]/10 border-y border-[#ff3e00]/30' : 'bg-[#ff3e00]/10 border-y border-[#ff3e00]/30'}`}>
                <td colSpan={5} className="p-3 px-5 font-bold uppercase text-[0.72rem] text-[#ff3e00] tracking-wider">
                  ✦ FUNDAMENTALS & CASTING CAPACITY
                </td>
              </tr>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] hover:bg-slate-50' : 'border-[#f8f7f4]/10 hover:bg-[#181a20]'}`}>
                <td className={`p-4 font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Casting & Crew Job Posts</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'}`}>1</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'}`}>10</td>
                <td className={`p-4 text-center font-extrabold text-[#ff3e00] ${isDaylight ? 'bg-[#ff3e00]/5 border-x border-[#ff3e00]/20' : 'bg-[#ff3e00]/5 border-x border-[#ff3e00]/20'}`}>25</td>
                <td className={`p-4 text-center font-extrabold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>50</td>
              </tr>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] hover:bg-slate-50' : 'border-[#f8f7f4]/10 hover:bg-[#181a20]'}`}>
                <td className={`p-4 font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Recruiter & Casting Seats</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'}`}>1 free</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'}`}>1 free</td>
                <td className={`p-4 text-center font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-white'} bg-[#ff3e00]/5 border-x border-[#ff3e00]/20`}>1 free + 2</td>
                <td className={`p-4 text-center font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>1 free + 5</td>
              </tr>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] hover:bg-slate-50' : 'border-[#f8f7f4]/10 hover:bg-[#181a20]'}`}>
                <td className={`p-4 font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Auto-Approval on Calls</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/30'}`}>—</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/30'}`}>—</td>
                <td className="p-4 text-center text-[#ff3e00] font-bold bg-[#ff3e00]/5 border-x border-[#ff3e00]/20">✓ Instant</td>
                <td className="p-4 text-center text-[#ff3e00] font-bold">✓ Instant</td>
              </tr>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] hover:bg-slate-50' : 'border-[#f8f7f4]/10 hover:bg-[#181a20]'}`}>
                <td className={`p-4 font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Multi-Platform Posting</td>
                <td className="p-4 text-center text-[#ff3e00]">✓</td>
                <td className="p-4 text-center text-[#ff3e00]">✓</td>
                <td className="p-4 text-center text-[#ff3e00] bg-[#ff3e00]/5 border-x border-[#ff3e00]/20">✓</td>
                <td className="p-4 text-center text-[#ff3e00]">✓</td>
              </tr>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] hover:bg-slate-50' : 'border-[#f8f7f4]/10 hover:bg-[#181a20]'}`}>
                <td className={`p-4 font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Call Center & WhatsApp Support</td>
                <td className="p-4 text-center text-[#ff3e00]">✓</td>
                <td className="p-4 text-center text-[#ff3e00]">✓</td>
                <td className="p-4 text-center text-[#ff3e00] bg-[#ff3e00]/5 border-x border-[#ff3e00]/20">✓ Priority 24/7</td>
                <td className="p-4 text-center text-[#ff3e00]">✓ Dedicated Manager</td>
              </tr>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] hover:bg-slate-50' : 'border-[#f8f7f4]/10 hover:bg-[#181a20]'}`}>
                <td className={`p-4 font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Direct Audition Video Uploads</td>
                <td className="p-4 text-center text-[#ff3e00]">✓</td>
                <td className="p-4 text-center text-[#ff3e00]">✓</td>
                <td className="p-4 text-center text-[#ff3e00] bg-[#ff3e00]/5 border-x border-[#ff3e00]/20">✓</td>
                <td className="p-4 text-center text-[#ff3e00]">✓</td>
              </tr>

              {/* SECTION: EXTRAS & SCREENING */}
              <tr className={`${isDaylight ? 'bg-[#ff3e00]/10 border-y border-[#ff3e00]/30' : 'bg-[#ff3e00]/10 border-y border-[#ff3e00]/30'}`}>
                <td colSpan={5} className="p-3 px-5 font-bold uppercase text-[0.72rem] text-[#ff3e00] tracking-wider">
                  ★ PRODUCTION EXTRAS & RECRUITMENT SERVICES
                </td>
              </tr>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] hover:bg-slate-50' : 'border-[#f8f7f4]/10 hover:bg-[#181a20]'}`}>
                <td className={`p-4 font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Telegram Channel Pin Broadcasts</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/30'}`}>—</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'}`}>3</td>
                <td className={`p-4 text-center font-extrabold text-[#ff3e00] bg-[#ff3e00]/5 border-x border-[#ff3e00]/20`}>6</td>
                <td className={`p-4 text-center font-extrabold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>12</td>
              </tr>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] hover:bg-slate-50' : 'border-[#f8f7f4]/10 hover:bg-[#181a20]'}`}>
                <td className={`p-4 font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Advertised Spotlight Casting Posts</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/30'}`}>—</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/30'}`}>—</td>
                <td className={`p-4 text-center font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-white'} bg-[#ff3e00]/5 border-x border-[#ff3e00]/20`}>2</td>
                <td className={`p-4 text-center font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>4</td>
              </tr>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] hover:bg-slate-50' : 'border-[#f8f7f4]/10 hover:bg-[#181a20]'}`}>
                <td className={`p-4 font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Applicant & Audition Tape Screening</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/30'}`}>—</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/30'}`}>—</td>
                <td className={`p-4 text-center font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-white'} bg-[#ff3e00]/5 border-x border-[#ff3e00]/20`}>2 Screenings</td>
                <td className={`p-4 text-center font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>4 Screenings</td>
              </tr>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] hover:bg-slate-50' : 'border-[#f8f7f4]/10 hover:bg-[#181a20]'}`}>
                <td className={`p-4 font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Specialized Crew / Cast Headhunting</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/30'}`}>—</td>
                <td className={`p-4 text-center ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/30'}`}>—</td>
                <td className={`p-4 text-center font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-white'} bg-[#ff3e00]/5 border-x border-[#ff3e00]/20`}>1 Intermediate</td>
                <td className="p-4 text-center font-bold text-[#ff3e00]">2 Key / Senior Crew</td>
              </tr>
              <tr className={`border-b ${isDaylight ? 'border-[#cbd5e1] hover:bg-slate-50' : 'border-[#f8f7f4]/10 hover:bg-[#181a20]'}`}>
                <td className={`p-4 font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>Custom NDA & Talent Contract Templates</td>
                <td className="p-4 text-center text-[#ff3e00]">✓</td>
                <td className="p-4 text-center text-[#ff3e00]">✓</td>
                <td className="p-4 text-center text-[#ff3e00] bg-[#ff3e00]/5 border-x border-[#ff3e00]/20">✓</td>
                <td className="p-4 text-center text-[#ff3e00]">✓ Full Legal Pack</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-3">
          <h2 className={`font-syne text-3xl sm:text-4xl font-extrabold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
            Frequently Asked Questions
          </h2>

          {/* FAQ CATEGORY TOGGLE */}
          <div className="flex justify-center pt-2">
            <div className={`${isDaylight ? 'bg-[#e2e8f0] border-[#cbd5e1]' : 'bg-[#111114] border-[#f8f7f4]/15'} border p-1 rounded-full flex gap-1 font-mono-code text-xs shadow-inner`}>
              <button
                onClick={() => setFaqTab('production')}
                className={`px-5 py-2 rounded-full font-bold uppercase transition-all cursor-pointer ${
                  faqTab === 'production'
                    ? 'bg-[#ff3e00] text-white shadow-md'
                    : (isDaylight ? 'text-[#475569] hover:text-[#0f172a]' : 'text-[#f8f7f4]/60 hover:text-white')
                }`}
              >
                For Production & Casting
              </button>
              <button
                onClick={() => setFaqTab('talent')}
                className={`px-5 py-2 rounded-full font-bold uppercase transition-all cursor-pointer ${
                  faqTab === 'talent'
                    ? 'bg-[#ff3e00] text-white shadow-md'
                    : (isDaylight ? 'text-[#475569] hover:text-[#0f172a]' : 'text-[#f8f7f4]/60 hover:text-white')
                }`}
              >
                For Actors, Models & Crew
              </button>
            </div>
          </div>
        </div>

        {/* ACCORDION */}
        <div className="space-y-3 font-mono-code">
          {activeFaqList.map((faq, idx) => {
            const isOpen = expandedFaqIndex === idx;

            return (
              <div
                key={idx}
                className={`${isDaylight ? 'bg-white border-[#cbd5e1] shadow-sm' : 'bg-[#111114] border-[#f8f7f4]/15'} border rounded-2xl overflow-hidden transition-all`}
              >
                <button
                  onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                  className={`w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm uppercase tracking-wide ${isDaylight ? 'text-[#0f172a] hover:text-[#ff3e00]' : 'text-[#f8f7f4] hover:text-[#ff3e00]'} transition-colors cursor-pointer`}
                >
                  <span>{faq.q}</span>
                  <div className={`p-1 rounded-full border ${isDaylight ? 'border-[#cbd5e1]' : 'border-[#f8f7f4]/20'} flex items-center justify-center transition-transform ${isOpen ? 'rotate-180 bg-[#ff3e00] text-white border-[#ff3e00]' : (isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/50')}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`border-t ${isDaylight ? 'border-[#cbd5e1] bg-slate-50 text-[#334155]' : 'border-[#f8f7f4]/10 bg-[#181a20]/60 text-[#f8f7f4]/80'} p-5 pt-3 text-xs uppercase leading-relaxed tracking-wider`}
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* INDUSTRY TESTIMONIALS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="text-center space-y-1">
          <div className="text-[0.68rem] text-[#ff3e00] font-mono-code font-bold uppercase tracking-widest">
            KUTAFUTA THROUGH THE EYES OF FILM DIRECTORS & PRODUCERS
          </div>
          <h2 className={`font-syne text-3xl font-extrabold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
            Hear what our customers are saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono-code text-xs">
          <div className={`${isDaylight ? 'bg-white border-[#cbd5e1] text-[#0f172a] shadow-sm' : 'bg-[#111114] border-[#f8f7f4]/15 text-[#f8f7f4]'} border p-5 rounded-2xl space-y-4 flex flex-col justify-between`}>
            <p className={`${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'} uppercase leading-relaxed text-[0.72rem]`}>
              "We cast our entire 12-episode TV serial drama using Kutafuta's Growth plan. The audition tape screening saved our casting director over 80 hours."
            </p>
            <div className={`border-t ${isDaylight ? 'border-[#cbd5e1]' : 'border-[#f8f7f4]/10'} pt-3`}>
              <div className={`font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} uppercase`}>Yared Tadesse</div>
              <div className="text-[0.62rem] text-[#ff3e00]">Producer, Bole Film Studios</div>
            </div>
          </div>

          <div className={`${isDaylight ? 'bg-white border-[#cbd5e1] text-[#0f172a] shadow-sm' : 'bg-[#111114] border-[#f8f7f4]/15 text-[#f8f7f4]'} border p-5 rounded-2xl space-y-4 flex flex-col justify-between`}>
            <p className={`${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'} uppercase leading-relaxed text-[0.72rem]`}>
              "Finding a verified drone cinematographer and gaffer for a high-budget beverage commercial took less than 3 hours. Phenomenal platform."
            </p>
            <div className={`border-t ${isDaylight ? 'border-[#cbd5e1]' : 'border-[#f8f7f4]/10'} pt-3`}>
              <div className={`font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} uppercase`}>Selamawit Bekele</div>
              <div className="text-[0.62rem] text-[#ff3e00]">Executive Producer, Zeleman Agency</div>
            </div>
          </div>

          <div className={`${isDaylight ? 'bg-white border-[#cbd5e1] text-[#0f172a] shadow-sm' : 'bg-[#111114] border-[#f8f7f4]/15 text-[#f8f7f4]'} border p-5 rounded-2xl space-y-4 flex flex-col justify-between`}>
            <p className={`${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'} uppercase leading-relaxed text-[0.72rem]`}>
              "The Telegram broadcast feature gave us over 200 actor audition tapes in 24 hours. The talent directory is the most comprehensive in Addis."
            </p>
            <div className={`border-t ${isDaylight ? 'border-[#cbd5e1]' : 'border-[#f8f7f4]/10'} pt-3`}>
              <div className={`font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} uppercase`}>Henok Mengistu</div>
              <div className="text-[0.62rem] text-[#ff3e00]">Film Director, Kuraz Cinema</div>
            </div>
          </div>

          <div className={`${isDaylight ? 'bg-white border-[#cbd5e1] text-[#0f172a] shadow-sm' : 'bg-[#111114] border-[#f8f7f4]/15 text-[#f8f7f4]'} border p-5 rounded-2xl space-y-4 flex flex-col justify-between`}>
            <p className={`${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'} uppercase leading-relaxed text-[0.72rem]`}>
              "Direct Telebirr payment and automated invoicing made accounting effortless. Highly recommended for any professional Ethiopian production."
            </p>
            <div className={`border-t ${isDaylight ? 'border-[#cbd5e1]' : 'border-[#f8f7f4]/10'} pt-3`}>
              <div className={`font-bold ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} uppercase`}>Abeba Worku</div>
              <div className="text-[0.62rem] text-[#ff3e00]">Production Manager, Prime Media</div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CALL TO ACTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="rounded-3xl bg-gradient-to-b from-[#ff3e00] to-[#b32b00] p-8 sm:p-12 text-center text-white space-y-4 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
              Ready to Cast & Crew Your Next Project?
            </h2>
            <p className="font-mono-code text-xs sm:text-sm uppercase tracking-wider opacity-90">
              Join 1,200+ directors, producers, and agencies finding verified talent in minutes.
            </p>
          </div>

          <div className="pt-3 flex flex-wrap justify-center gap-4 font-mono-code">
            <button
              onClick={() => onNavigate('jobs_create')}
              className="bg-[#111114] hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer"
            >
              Post a Casting Call
            </button>
            <button
              onClick={() => onNavigate('directory')}
              className="bg-white/20 hover:bg-white text-white hover:text-black border border-white/40 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              Browse Talent Roster
            </button>
          </div>
        </div>
      </div>

      {/* REQUEST & ACTIVATION MODAL */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className={`${isDaylight ? 'bg-white text-[#0f172a] border-[#ff3e00]' : 'bg-[#181a20] text-[#f8f7f4] border-[#ff3e00]'} border-2 max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl font-mono-code max-h-[90vh] overflow-y-auto`}>
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-4 right-4 ${isDaylight ? 'text-[#64748b] hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#f8f7f4]/60 hover:text-white hover:bg-white/10'} p-1.5 rounded-full transition-all cursor-pointer`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER */}
            <div className="space-y-1 pr-6">
              <div className="inline-flex items-center gap-1.5 text-[0.65rem] text-[#ff3e00] font-bold uppercase tracking-widest">
                <Building2 className="w-3.5 h-3.5" />
                Production Studio / Agency Plan Request
              </div>
              <h3 className={`font-syne text-2xl font-bold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                {selectedPlan.name}
              </h3>
              <p className={`text-xs ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} uppercase`}>
                Rate: <span className="text-[#ff3e00] font-bold">{selectedPlan.priceETB} {selectedPlan.billingCycle}</span> • {selectedPlan.priceNote}
              </p>
            </div>

            {isSubmitted ? (
              <div className={`${isDaylight ? 'bg-slate-50 border-[#ff3e00]' : 'bg-[#111114] border-[#ff3e00]'} border p-6 rounded-2xl text-center space-y-3 my-4`}>
                <div className="w-12 h-12 bg-[#ff3e00]/20 text-[#ff3e00] rounded-full mx-auto flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <h4 className="font-syne text-lg font-bold uppercase text-[#ff3e00]">
                  Plan Activation Request Sent!
                </h4>
                <p className={`text-xs ${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'} uppercase leading-relaxed`}>
                  Thank you! Our production onboarding team will activate your credits for <strong>{selectedPlan.name}</strong> and contact you at <strong>{contactEmail || contactPhone}</strong> with your Telebirr / CBE payment invoice.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
                <div>
                  <label className={`block text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} mb-1`}>
                    Production Company / Agency / Director Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Bole Film Studios / CineCraft Media"
                    className={`w-full ${isDaylight ? 'bg-slate-50 border-[#cbd5e1] text-[#0f172a] placeholder-[#94a3b8]' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4]'} border rounded-xl p-3 focus:outline-none focus:border-[#ff3e00]`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className={`w-3.5 h-3.5 absolute left-3 top-3.5 ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/40'}`} />
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+251 9..."
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-[#cbd5e1] text-[#0f172a] placeholder-[#94a3b8]' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4]'} border rounded-xl py-3 pl-9 pr-3 focus:outline-none focus:border-[#ff3e00]`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Business Email *
                    </label>
                    <div className="relative">
                      <Mail className={`w-3.5 h-3.5 absolute left-3 top-3.5 ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/40'}`} />
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="producer@studio.com"
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-[#cbd5e1] text-[#0f172a] placeholder-[#94a3b8]' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4]'} border rounded-xl py-3 pl-9 pr-3 focus:outline-none focus:border-[#ff3e00]`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Primary Production Type
                    </label>
                    <select
                      value={productionType}
                      onChange={(e) => setProductionType(e.target.value)}
                      className={`w-full ${isDaylight ? 'bg-slate-50 border-[#cbd5e1] text-[#0f172a]' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4]'} border rounded-xl py-3 px-3 focus:outline-none focus:border-[#ff3e00]`}
                    >
                      <option value="feature_film">Feature Film</option>
                      <option value="tv_series">TV Series / Drama</option>
                      <option value="commercial">Commercial / Ad Campaign</option>
                      <option value="music_video">Music Video</option>
                      <option value="documentary">Documentary</option>
                      <option value="short_film">Short Film</option>
                      <option value="agency">Casting / Talent Agency</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Preferred Payment Method
                    </label>
                    <div className="relative">
                      <CreditCard className={`w-3.5 h-3.5 absolute left-3 top-3.5 ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/40'}`} />
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-[#cbd5e1] text-[#0f172a]' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4]'} border rounded-xl py-3 pl-9 pr-3 focus:outline-none focus:border-[#ff3e00]`}
                      >
                        <option value="telebirr">Telebirr Direct Transfer</option>
                        <option value="cbe_birr">CBE Birr / Commercial Bank</option>
                        <option value="dashen">Dashen Bank / Amole</option>
                        <option value="bank_transfer">Wire / Direct Bank Transfer</option>
                        <option value="card">International Credit Card</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} mb-1`}>
                    Roles or Upcoming Shoot Details (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Need Lead Actress (20-25), DP with RED/ARRI package, 1st AD for shoot in September..."
                    className={`w-full ${isDaylight ? 'bg-slate-50 border-[#cbd5e1] text-[#0f172a] placeholder-[#94a3b8]' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4]'} border rounded-xl p-3 focus:outline-none focus:border-[#ff3e00]`}
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#ff3e00] hover:bg-[#e03500] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    Confirm & Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={`px-4 py-3.5 ${isDaylight ? 'bg-slate-100 border-[#cbd5e1] text-[#0f172a] hover:bg-slate-200' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4] hover:bg-[#20232c]'} border rounded-xl`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AUTHENTICATION REQUIRED MODAL (FOR LOGGED-OUT USERS) */}
      {isAuthPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className={`${isDaylight ? 'bg-white text-[#0f172a] border-[#ff3e00]' : 'bg-[#181a20] text-[#f8f7f4] border-[#ff3e00]'} border-2 max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl font-mono-code`}>
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsAuthPromptOpen(false)}
              className={`absolute top-4 right-4 ${isDaylight ? 'text-[#64748b] hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#f8f7f4]/60 hover:text-white hover:bg-white/10'} p-1.5 rounded-full transition-all cursor-pointer`}
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER BADGE & ICON */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#ff3e00]/15 border border-[#ff3e00]/40 flex items-center justify-center text-[#ff3e00]">
                <Lock className="w-7 h-7" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff3e00]/10 border border-[#ff3e00]/30 rounded-full font-mono-code text-[0.65rem] uppercase tracking-widest text-[#ff3e00] font-bold">
                <Sparkles className="w-3 h-3" />
                ACCOUNT LOGIN REQUIRED
              </div>

              <h3 className={`font-syne text-2xl font-extrabold uppercase tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                Sign In to Select Plan
              </h3>

              <p className={`text-xs ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} uppercase leading-relaxed tracking-wide`}>
                Please log in to your account or sign up to select this plan, request activation, and manage casting applicant shortlists.
              </p>
            </div>

            {/* SELECTED PLAN CHIP */}
            {pendingPlan && (
              <div className={`p-4 rounded-2xl border ${isDaylight ? 'bg-slate-50 border-[#cbd5e1]' : 'bg-[#111114] border-[#f8f7f4]/15'} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] font-bold">Selected Package:</span>
                  <span className="font-syne text-sm font-extrabold text-[#ff3e00]">
                    {pendingPlan.priceETB} {pendingPlan.billingCycle}
                  </span>
                </div>
                <div className={`font-syne text-base font-bold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                  {pendingPlan.name}
                </div>
                <div className={`text-[0.68rem] ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/60'} uppercase`}>
                  {pendingPlan.tierSubtitle}
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-1">
              <button
                onClick={() => {
                  setIsAuthPromptOpen(false);
                  onOpenAuth?.('login');
                }}
                className="w-full bg-[#ff3e00] hover:bg-[#e03500] text-white py-3.5 px-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01]"
              >
                <LogIn className="w-4 h-4" />
                Log In to Existing Account
              </button>

              <button
                onClick={() => {
                  setIsAuthPromptOpen(false);
                  onOpenAuth?.('signup');
                }}
                className={`w-full ${isDaylight ? 'bg-slate-100 hover:bg-slate-200 text-[#0f172a] border-[#cbd5e1]' : 'bg-[#111114] hover:bg-[#20232c] text-[#f8f7f4] border-[#f8f7f4]/20'} border py-3.5 px-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2`}
              >
                <UserPlus className="w-4 h-4 text-[#ff3e00]" />
                Create New Account / Sign Up
              </button>

              <button
                onClick={() => setIsAuthPromptOpen(false)}
                className={`w-full text-center text-[0.68rem] uppercase tracking-wider ${isDaylight ? 'text-[#64748b] hover:text-[#0f172a]' : 'text-[#f8f7f4]/50 hover:text-white'} pt-2 transition-colors cursor-pointer`}
              >
                Continue Browsing Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

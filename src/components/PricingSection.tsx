import React, { useState } from 'react';
import { Calendar, TrendingUp, Briefcase, Award, CheckCircle2, X, Send, Sparkles, Building2, Phone, Mail, CreditCard, Lock, LogIn, UserPlus } from 'lucide-react';
import { User } from '../types';

export interface PricingPlan {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  currency: string;
  durationMonths: number;
  cvDownloads: string;
  icon: any;
  featured?: boolean;
  badge?: string;
  features: string[];
}

interface PricingSectionProps {
  currentUser?: { user: User; profile: any };
  onNavigate?: (route: string) => void;
  onOpenAuth?: (tab: 'login' | 'signup') => void;
  isDaylight?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: '3-months',
    title: '3 Month Access',
    subtitle: 'URGENT HIRING NEEDS',
    price: '8,000',
    currency: 'ETB',
    durationMonths: 3,
    cvDownloads: '150 Full CV Downloads',
    icon: Calendar,
    features: [
      'Unlimited Profile Previews',
      '150 Full CV Downloads',
      '3 Months Access',
      'Unlimited Searching',
      '24h Customer Support',
    ],
  },
  {
    id: '6-months',
    title: '6 Month Access',
    subtitle: 'SCALING TEAMS',
    price: '15,000',
    currency: 'ETB',
    durationMonths: 6,
    cvDownloads: '350 Full CV Downloads',
    icon: TrendingUp,
    features: [
      'Unlimited Profile Previews',
      '350 Full CV Downloads',
      '6 Months Access',
      'Unlimited Searching',
      '24h Customer Support',
    ],
  },
  {
    id: '8-months',
    title: '8 Month Access',
    subtitle: 'LONG-TERM PROJECTS',
    price: '20,000',
    currency: 'ETB',
    durationMonths: 8,
    cvDownloads: '500 Full CV Downloads',
    icon: Briefcase,
    features: [
      'Unlimited Profile Previews',
      '500 Full CV Downloads',
      '8 Months Access',
      'Unlimited Searching',
      '24h Customer Support',
    ],
  },
  {
    id: '1-year',
    title: '1 Year Access',
    subtitle: 'YEAR-ROUND HIRING',
    price: '25,000',
    currency: 'ETB',
    durationMonths: 12,
    cvDownloads: '1000 Full CV Downloads',
    icon: Award,
    featured: true,
    badge: 'BEST VALUE',
    features: [
      'Unlimited Profile Previews',
      '1000 Full CV Downloads',
      '1 Year Access',
      'Unlimited Searching',
      '24h Customer Support',
    ],
  },
];

export const PricingSection: React.FC<PricingSectionProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth,
  isDaylight = false,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState<boolean>(false);
  const [pendingPlan, setPendingPlan] = useState<PricingPlan | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>(currentUser?.user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<string>('telebirr');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const isUserLoggedIn = Boolean(
    currentUser &&
    currentUser.user &&
    currentUser.user.id !== 'guest' &&
    currentUser.user.role !== 'guest' &&
    currentUser.user.email
  );

  const handleRequestClick = (plan: PricingPlan) => {
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

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Cache order in localStorage so Client Dashboard can see it
    try {
      const existingRequests = JSON.parse(localStorage.getItem('kutafuta_plan_requests') || '[]');
      existingRequests.push({
        id: 'REQ-' + Date.now(),
        planId: selectedPlan?.id,
        planTitle: selectedPlan?.title,
        price: selectedPlan?.price + ' ' + selectedPlan?.currency,
        companyName: companyName || currentUser?.user?.full_name || 'Agency Client',
        contactPhone,
        contactEmail,
        paymentMethod,
        notes,
        status: 'pending_approval',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('kutafuta_plan_requests', JSON.stringify(existingRequests));
    } catch (err) {
      console.error('Failed to store request:', err);
    }

    setTimeout(() => {
      // Auto close after 3 seconds
      setIsModalOpen(false);
      setIsSubmitted(false);
    }, 3200);
  };

  return (
    <section className="space-y-10 py-6" id="pricing-section">
      {/* SECTION HEADER */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className={`inline-flex items-center gap-2 px-3 py-1 ${isDaylight ? 'bg-white border-[#ff3e00]/40 shadow-sm' : 'bg-[#111114] border-[#ff3e00]/30'} border rounded-full font-mono-code text-[0.65rem] uppercase tracking-widest text-[#ff3e00]`}>
          <Sparkles className="w-3 h-3 animate-spin" />
          CLIENT & AGENCY ACCESS PACKAGES
        </div>
        <h2 className={`font-syne text-3xl sm:text-4xl font-extrabold uppercase tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
          Talent Roster & CV Search Plans
        </h2>
        <p className={`font-mono-code text-xs sm:text-sm ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} uppercase leading-relaxed tracking-wider`}>
          Unlock full contact details, verified crew portfolios, and instant CV downloads for production studios, agencies, and independent casting directors.
        </p>
      </div>

      {/* 4 PRICING CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const IconComponent = plan.icon;
          const isFeatured = plan.featured;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 ${
                isFeatured
                  ? (isDaylight
                      ? 'bg-gradient-to-b from-[#fff5f2] to-white text-[#0f172a] border-2 border-[#ff3e00] shadow-[0_10px_35px_rgba(255,62,0,0.18)] ring-2 ring-[#ff3e00]/50'
                      : 'bg-gradient-to-b from-[#20232c] to-[#111114] text-[#f8f7f4] border-2 border-[#ff3e00] shadow-[0_0_30px_rgba(255,62,0,0.22)] ring-1 ring-[#ff3e00]/40'
                    )
                  : (isDaylight
                      ? 'bg-white text-[#0f172a] border border-[#cbd5e1] hover:border-[#ff3e00]/50 shadow-md'
                      : 'bg-[#111114] text-[#f8f7f4] border border-[#f8f7f4]/15 hover:border-[#ff3e00]/50 shadow-xl'
                    )
              }`}
            >
              {/* FEATURED BADGE */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ff3e00] text-white text-[0.65rem] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-md font-mono-code border border-[#ff3e00]">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                {/* ICON BOX */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isFeatured
                      ? (isDaylight ? 'bg-[#ff3e00]/15 border border-[#ff3e00]/40 text-[#ff3e00]' : 'bg-[#ff3e00]/20 border border-[#ff3e00]/40 text-[#ff3e00]')
                      : (isDaylight ? 'bg-slate-100 border border-[#cbd5e1] text-[#ff3e00]' : 'bg-[#181a20] border border-[#f8f7f4]/15 text-[#ff3e00]')
                  }`}
                >
                  <IconComponent className="w-6 h-6 stroke-[1.8]" />
                </div>

                {/* TITLE & SUBTITLE */}
                <div>
                  <h3 className={`font-syne text-xl sm:text-2xl font-bold tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                    {plan.title}
                  </h3>
                  <p className={`font-mono-code text-[0.68rem] font-semibold tracking-wider uppercase mt-1 ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/60'}`}>
                    {plan.subtitle}
                  </p>
                </div>

                {/* PRICE DISPLAY */}
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span
                    className={`font-syne text-3xl sm:text-4xl font-extrabold ${
                      isFeatured ? 'text-[#ff3e00]' : (isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]')
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span className="font-mono-code text-xs font-bold tracking-wider text-[#ff3e00]">
                    {plan.currency}
                  </span>
                </div>

                {/* FEATURE LIST */}
                <ul className="space-y-3 pt-2 text-xs font-mono-code">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#ff3e00]" />
                      <span className={isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/85'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* REQUEST BUTTON */}
              <div className="pt-8">
                <button
                  onClick={() => handleRequestClick(plan)}
                  className={`w-full py-3.5 px-4 rounded-xl font-mono-code font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-[0.98] ${
                    isFeatured
                      ? 'bg-[#ff3e00] hover:bg-[#e03500] text-white shadow-[0_4px_20px_rgba(255,62,0,0.35)]'
                      : (isDaylight
                          ? 'bg-slate-100 hover:bg-[#ff3e00] text-[#0f172a] hover:text-white border border-[#cbd5e1] hover:border-[#ff3e00]'
                          : 'bg-[#181a20] hover:bg-[#ff3e00] text-[#f8f7f4] hover:text-white border border-[#f8f7f4]/20 hover:border-[#ff3e00]'
                        )
                  }`}
                >
                  Request This
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DEDICATED PRICING PAGE PROMPT */}
      {onNavigate && (
        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('pricing')}
            className={`inline-flex items-center gap-2 ${isDaylight ? 'bg-white hover:bg-slate-100 border-[#ff3e00]/60 text-[#0f172a] shadow-md' : 'bg-[#111114] hover:bg-[#20232c] border-[#ff3e00]/50 hover:border-[#ff3e00] text-[#f8f7f4] shadow-md'} border px-6 py-3 rounded-full font-mono-code text-xs uppercase font-bold tracking-wider transition-all hover:scale-[1.02] cursor-pointer`}
          >
            <span>🎬 View Complete Film, Cast & Crew Pricing Matrix & Bespoke Packages</span>
            <span className="text-[#ff3e00]">→</span>
          </button>
        </div>
      )}

      {/* REQUEST MODAL */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className={`${isDaylight ? 'bg-white text-[#0f172a] border-[#ff3e00]' : 'bg-[#181a20] text-[#f8f7f4] border-[#ff3e00]'} border-2 max-w-lg w-full rounded-2xl p-6 sm:p-8 space-y-6 relative shadow-2xl font-mono-code`}>
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-4 right-4 ${isDaylight ? 'text-[#64748b] hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#f8f7f4]/60 hover:text-white hover:bg-white/10'} p-1 rounded-full transition-all cursor-pointer`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL HEADER */}
            <div className="space-y-1 pr-6">
              <div className="inline-flex items-center gap-1.5 text-[0.65rem] text-[#ff3e00] font-bold uppercase tracking-widest">
                <Building2 className="w-3.5 h-3.5" />
                Agency / Client Plan Request
              </div>
              <h3 className={`font-syne text-2xl font-bold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                {selectedPlan.title}
              </h3>
              <p className={`text-xs ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} uppercase`}>
                Price: <span className="text-[#ff3e00] font-bold">{selectedPlan.price} {selectedPlan.currency}</span> • Includes {selectedPlan.cvDownloads}
              </p>
            </div>

            {isSubmitted ? (
              <div className={`${isDaylight ? 'bg-slate-50 border-[#ff3e00]' : 'bg-[#111114] border-[#ff3e00]'} border p-6 rounded-xl text-center space-y-3 my-4`}>
                <div className="w-12 h-12 bg-[#ff3e00]/20 text-[#ff3e00] rounded-full mx-auto flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <h4 className="font-syne text-lg font-bold uppercase text-[#ff3e00]">
                  Access Request Submitted!
                </h4>
                <p className={`text-xs ${isDaylight ? 'text-[#334155]' : 'text-[#f8f7f4]/80'} uppercase leading-relaxed`}>
                  Our account team has received your request for <strong>{selectedPlan.title} ({selectedPlan.price} {selectedPlan.currency})</strong>. We will contact you at <strong>{contactEmail || contactPhone}</strong> within 1 hour to activate full access.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
                <div>
                  <label className={`block text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} mb-1`}>
                    Company / Production Agency Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. CineMedia Studios / Bole Films"
                    className={`w-full ${isDaylight ? 'bg-slate-50 border-[#cbd5e1] text-[#0f172a] placeholder-[#94a3b8]' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4]'} border rounded-lg p-3 focus:outline-none focus:border-[#ff3e00]`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className={`w-3.5 h-3.5 absolute left-3 top-3 ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/40'}`} />
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+251 9..."
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-[#cbd5e1] text-[#0f172a] placeholder-[#94a3b8]' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4]'} border rounded-lg py-3 pl-9 pr-3 focus:outline-none focus:border-[#ff3e00]`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} mb-1`}>
                      Business Email *
                    </label>
                    <div className="relative">
                      <Mail className={`w-3.5 h-3.5 absolute left-3 top-3 ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/40'}`} />
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="producer@studio.com"
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-[#cbd5e1] text-[#0f172a] placeholder-[#94a3b8]' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4]'} border rounded-lg py-3 pl-9 pr-3 focus:outline-none focus:border-[#ff3e00]`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} mb-1`}>
                    Preferred Payment Method
                  </label>
                  <div className="relative">
                    <CreditCard className={`w-3.5 h-3.5 absolute left-3 top-3 ${isDaylight ? 'text-[#94a3b8]' : 'text-[#f8f7f4]/40'}`} />
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className={`w-full ${isDaylight ? 'bg-slate-50 border-[#cbd5e1] text-[#0f172a]' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4]'} border rounded-lg py-3 pl-9 pr-3 focus:outline-none focus:border-[#ff3e00]`}
                    >
                      <option value="telebirr">Telebirr Direct Transfer</option>
                      <option value="cbe_birr">CBE Birr / Commercial Bank</option>
                      <option value="dashen">Dashen Bank / Amole</option>
                      <option value="bank_transfer">Wire / Bank Transfer</option>
                      <option value="card">International Card / Credit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-[0.65rem] uppercase tracking-widest ${isDaylight ? 'text-[#475569]' : 'text-[#f8f7f4]/70'} mb-1`}>
                    Specific Hiring Needs / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe roles or talent departments you need to hire immediately..."
                    className={`w-full ${isDaylight ? 'bg-slate-50 border-[#cbd5e1] text-[#0f172a] placeholder-[#94a3b8]' : 'bg-[#111114] border-[#f8f7f4]/20 text-[#f8f7f4]'} border rounded-lg p-3 focus:outline-none focus:border-[#ff3e00]`}
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#ff3e00] hover:bg-[#e03500] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Confirm & Send Request
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
          <div className={`${isDaylight ? 'bg-white text-[#0f172a] border-[#ff3e00]' : 'bg-[#181a20] text-[#f8f7f4] border-[#ff3e00]'} border-2 max-w-md w-full rounded-2xl p-6 sm:p-8 space-y-6 relative shadow-2xl font-mono-code`}>
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
                Please log in to your account or register a new Studio / Client account to activate this access plan and unlock full candidate profiles.
              </p>
            </div>

            {/* SELECTED PLAN CHIP */}
            {pendingPlan && (
              <div className={`p-4 rounded-xl border ${isDaylight ? 'bg-slate-50 border-[#cbd5e1]' : 'bg-[#111114] border-[#f8f7f4]/15'} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] uppercase tracking-widest text-[#ff3e00] font-bold">Selected Package:</span>
                  <span className="font-syne text-sm font-extrabold text-[#ff3e00]">
                    {pendingPlan.price} {pendingPlan.currency}
                  </span>
                </div>
                <div className={`font-syne text-base font-bold uppercase ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'}`}>
                  {pendingPlan.title}
                </div>
                <div className={`text-[0.68rem] ${isDaylight ? 'text-[#64748b]' : 'text-[#f8f7f4]/60'} uppercase`}>
                  {pendingPlan.subtitle} • {pendingPlan.cvDownloads}
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
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

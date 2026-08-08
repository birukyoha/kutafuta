// File: /src/App.tsx
// Main Application Wrapper with Navigation & State Management

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Home, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  PlusCircle, 
  UserCheck, 
  Shield, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { LandingHome } from './components/LandingHome';
import HomePage from '../frontend/pages/index.jsx';
import TalentDirectoryPage from '../frontend/pages/talents/index.jsx';
import TalentProfilePage from '../frontend/pages/talents/[id].jsx';
import CreateJobPage from '../frontend/pages/jobs/create.jsx';
import TalentDashboardPage from '../frontend/pages/dashboard/talent.jsx';
import ClientDashboardPage from '../frontend/pages/dashboard/client.jsx';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { PricingPage } from './pages/PricingPage';
import { AuthModal } from './components/AuthModal';
import { LegalModal } from './components/LegalModal';
import { User } from './types';

// Helper component for Role-Restricted Pages
function RoleRestrictedCard({
  requiredRole,
  currentRole,
  title,
  description,
  onOpenAuth,
  onNavigate,
}: {
  requiredRole: 'talent' | 'client' | 'admin';
  currentRole: string;
  title: string;
  description: string;
  onOpenAuth: (tab: 'login' | 'signup') => void;
  onNavigate: (route: string) => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 daylight-bg bg-[#181a20] text-[#f8f7f4] font-mono-code">
      <div className="max-w-lg w-full daylight-card bg-[#20232c] border-2 border-[#ff3e00]/60 p-8 text-center space-y-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#ff3e00] text-white px-4 py-1 text-[0.6rem] font-bold uppercase tracking-widest">
          ACCESS RESTRICTED
        </div>

        <div className="w-16 h-16 mx-auto bg-[#ff3e00]/10 border-2 border-[#ff3e00] rounded-full flex items-center justify-center text-3xl text-[#ff3e00]">
          🔒
        </div>

        <div className="space-y-2">
          <h2 className="font-syne text-2xl font-extrabold uppercase tracking-tight text-[#f8f7f4]">
            {title}
          </h2>
          <p className="text-xs text-[#f8f7f4]/70 uppercase leading-relaxed tracking-wider">
            {description}
          </p>
        </div>

        <div className="p-4 bg-[#111114] border border-[#f8f7f4]/10 rounded-xl space-y-2 text-[0.7rem] text-left">
          <div className="flex justify-between border-b border-[#f8f7f4]/10 pb-2">
            <span className="text-[#f8f7f4]/60">Your Active Role:</span>
            <span className="font-bold text-[#ff3e00] uppercase">
              {currentRole === 'guest' ? 'Guest Visitor (Not Logged In)' : currentRole.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-[#f8f7f4]/60">Required Access Role:</span>
            <span className="font-bold text-emerald-400 uppercase">
              {requiredRole.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => onOpenAuth('login')}
            className="flex-1 px-4 py-3.5 bg-[#ff3e00] hover:bg-[#e03500] text-white font-bold uppercase text-[0.7rem] tracking-widest transition-all cursor-pointer rounded-lg shadow-md"
          >
            {currentRole === 'guest' ? 'Sign In / Register' : 'Switch Role Account'}
          </button>
          <button
            onClick={() => {
              if (currentRole === 'talent') onNavigate('talent_dashboard');
              else if (currentRole === 'client') onNavigate('client_dashboard');
              else if (currentRole === 'admin') onNavigate('admin');
              else onNavigate('home');
            }}
            className="flex-1 px-4 py-3.5 bg-[#111114] hover:bg-[#181a20] text-[#f8f7f4] border border-[#f8f7f4]/20 font-bold uppercase text-[0.7rem] tracking-widest transition-all cursor-pointer rounded-lg"
          >
            Return to Allowed Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeRoute, setActiveRoute] = useState<'home' | 'marketplace' | 'directory' | 'pricing' | 'talent_detail' | 'jobs_create' | 'talent_dashboard' | 'client_dashboard' | 'admin'>('home');
  const [selectedTalentId, setSelectedTalentId] = useState<string>('talent-1');
  const [searchFilterCategory, setSearchFilterCategory] = useState<string>('all');
  const [searchFilterQuery, setSearchFilterQuery] = useState<string>('');

  // Authentication & Auth modal state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [authToast, setAuthToast] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDaylight, setIsDaylight] = useState<boolean>(false);
  const [legalModalState, setLegalModalState] = useState<{ isOpen: boolean; tab: 'privacy' | 'terms' }>({
    isOpen: false,
    tab: 'privacy',
  });

  const guestUserSession = {
    user: {
      id: 'guest',
      email: '',
      role: 'guest' as const,
      full_name: 'Guest Visitor',
      avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Guest'
    },
    profile: null
  };

  // Simulated active user session state
  const [currentUser, setCurrentUser] = useState<{ user: User; profile: any }>(guestUserSession);

  useEffect(() => {
    if (isDaylight) {
      document.documentElement.setAttribute('data-theme', 'daylight');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDaylight]);

  // Restore authenticated user session from localStorage if available
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('cinecraft_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.user && parsed.user.role) {
          setCurrentUser(parsed);
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      console.error('Failed to parse cached user session:', e);
    }
  }, []);

  const handleOpenAuth = (tab: 'login' | 'signup') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData: { user: User; profile: any }) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('cinecraft_user', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
    if (userData.user.role === 'admin') {
      setActiveRoute('admin');
    }
    const actionText = authModalTab === 'login' ? 'Successfully logged in as' : 'Account created for';
    setAuthToast(`🎉 ${actionText} ${userData.user.full_name} (${userData.user.role.toUpperCase()})!`);
    setTimeout(() => setAuthToast(''), 4000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(guestUserSession);
    try {
      localStorage.removeItem('cinecraft_user');
      localStorage.removeItem('cinecraft_token');
      sessionStorage.removeItem('cinecraft_admin_token');
      sessionStorage.removeItem('cinecraft_admin_user');
    } catch (e) {
      console.error(e);
    }
    setAuthToast('👋 Logged out. Returned to Guest Mode.');
    setTimeout(() => setAuthToast(''), 3000);
    setActiveRoute('home');
  };

  const handleNavigation = (route: string, params?: { id?: string; category?: string; query?: string }) => {
    if (params?.id) {
      setSelectedTalentId(params.id);
    }
    if (params?.category) {
      setSearchFilterCategory(params.category);
    }
    if (params?.query !== undefined) {
      setSearchFilterQuery(params.query);
    }
    setActiveRoute(route as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${isDaylight ? 'daylight-bg bg-[#ebedf2] text-[#0f172a]' : 'bg-[#181a20] text-[#f8f7f4]'} flex flex-col font-['Inter',sans-serif] selection:bg-[#ff3e00] selection:text-[#0b0b0d] transition-colors duration-300 w-full max-w-full overflow-x-hidden`}>
       {/* FLOATING ANIMATED HEADER */}
      <header className="fixed top-2 sm:top-4 inset-x-0 z-50 px-2 sm:px-4 lg:px-6 pointer-events-none w-full max-w-[1540px] mx-auto">
        <div className="w-full max-w-full mx-auto pointer-events-auto">
          <div className={`${isDaylight ? 'bg-[#ffffff]/95 text-[#0f172a] border-[#0f172a]/20 shadow-lg' : 'bg-[#181a20]/95 text-[#f8f7f4] border-[#f8f7f4]/15 shadow-[0_16px_40px_rgba(0,0,0,0.85)]'} backdrop-blur-2xl border rounded-2xl md:rounded-full px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 flex items-center justify-between transition-all hover:border-[#ff3e00]/40 gap-2 lg:gap-4`}>
            
            {/* LOGO */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                handleNavigation('home');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer select-none group shrink-0 whitespace-nowrap"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff3e00] shadow-[0_0_12px_#ff3e00] animate-pulse shrink-0" />
              <span className={`font-syne text-sm sm:text-base lg:text-lg font-extrabold uppercase tracking-tight ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} group-hover:text-[#ff3e00] transition-colors whitespace-nowrap`}>
                KutafutaTalent
              </span>
            </motion.div>

            {/* ANIMATED FLOATING NAV ITEMS (DESKTOP) */}
            <nav className={`hidden lg:flex items-center gap-0.5 xl:gap-1 ${isDaylight ? 'bg-[#e2e8f0] border-[#cbd5e1]' : 'bg-[#20232c]/90 border-[#f8f7f4]/10'} border rounded-full p-1 xl:p-1.5 shadow-inner shrink-0`}>
              {[
                { id: 'home', label: 'Home' },
                { id: 'marketplace', label: 'Marketplace' },
                { id: 'directory', label: 'Talent Directory' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'jobs_create', label: 'Post Job' },
                ...(!isAuthenticated || currentUser.user.role === 'talent' || currentUser.user.role === 'admin' ? [{ id: 'talent_dashboard', label: 'Talent Portal' }] : []),
                ...(!isAuthenticated || currentUser.user.role === 'client' || currentUser.user.role === 'admin' ? [{ id: 'client_dashboard', label: 'Agency Portal' }] : []),
                ...(currentUser.user.role === 'admin' ? [{ id: 'admin', label: 'Admin DB' }] : []),
              ].map((item) => {
                const isActive = activeRoute === item.id || (item.id.includes('dashboard') && activeRoute.includes('dashboard'));
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleNavigation(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`relative isolate px-2.5 xl:px-3.5 py-1.5 rounded-full font-mono-code text-[0.62rem] xl:text-[0.68rem] font-bold uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap ${
                      isActive 
                        ? 'text-white' 
                        : (isDaylight ? 'text-[#0f172a] hover:text-[#ff3e00]' : 'text-[#f8f7f4]/70 hover:text-[#f8f7f4]')
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="floatingNavActivePill"
                        className="absolute inset-0 bg-[#ff3e00] rounded-full z-0 shadow-sm"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* RIGHT CONTROLS & MOBILE HAMBURGER */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap">
              {/* DAYLIGHT / SOLAR VISIBILITY MODE TOGGLE */}
              <button
                onClick={() => setIsDaylight(!isDaylight)}
                className={`p-1.5 sm:p-2 rounded-full border transition-all cursor-pointer ${
                  isDaylight
                    ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-sm hover:bg-amber-200'
                    : 'bg-[#20232c] text-amber-400 border-amber-500/30 hover:border-amber-400 hover:bg-[#282c37]'
                }`}
                title="Toggle Outdoor Daylight Mode"
                aria-label="Toggle Outdoor Daylight Mode"
              >
                {isDaylight ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className={`hidden md:flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 ${isDaylight ? 'bg-[#f0f3f8] border-[#0f172a]/20 text-[#0f172a]' : 'bg-[#20232c] border-[#f8f7f4]/15 text-[#f8f7f4]/80'} border rounded-full font-mono-code text-[0.62rem] xl:text-[0.65rem] font-bold uppercase tracking-wider hover:border-[#ff3e00] transition-all cursor-pointer`}
                    title="Click to Switch Account or Role"
                  >
                    <span>ROLE:</span>
                    <span className="text-[#ff3e00] font-bold">{currentUser.user.role}</span>
                  </button>

                  <button
                    onClick={() => handleNavigation(currentUser.user.role === 'admin' ? 'admin' : (currentUser.user.role === 'client' ? 'client_dashboard' : 'talent_dashboard'))}
                    className={`hidden sm:flex items-center gap-1.5 px-2 sm:px-2.5 py-1 ${isDaylight ? 'bg-[#f0f3f8] border-[#0f172a]/20' : 'bg-[#20232c] border-[#f8f7f4]/20'} border rounded-full transition-all cursor-pointer`}
                    title="View Dashboard"
                  >
                    <img
                      src={currentUser.user.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                      alt={currentUser.user.full_name}
                      className="w-4 h-4 sm:w-5 sm:h-5 object-cover rounded-full filter grayscale hover:grayscale-0 transition-all"
                    />
                    <span className={`font-mono-code text-[0.65rem] sm:text-[0.68rem] font-bold uppercase tracking-wider ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]'} hidden md:inline max-w-[90px] truncate`}>
                      {currentUser.user.full_name.split(' ')[0]}
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="hidden md:inline-block px-2.5 xl:px-3 py-1 bg-transparent hover:bg-rose-500/10 text-[#ff4d4d] border border-rose-500/20 font-mono-code text-[0.62rem] xl:text-[0.65rem] font-bold uppercase tracking-wider transition-all cursor-pointer rounded-full"
                    title="Log Out of Account"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-1.5 xl:gap-2 font-mono-code text-[0.65rem] xl:text-[0.68rem]">
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className={`px-3 xl:px-3.5 py-1.5 border ${isDaylight ? 'border-[#0f172a]/30 text-[#0f172a]' : 'border-[#f8f7f4]/20 text-[#f8f7f4]'} uppercase font-bold rounded-full hover:border-[#ff3e00] transition-all cursor-pointer`}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleOpenAuth('signup')}
                    className="px-3 xl:px-3.5 py-1.5 bg-[#ff3e00] text-[#ffffff] font-bold uppercase rounded-full hover:bg-[#e03500] transition-all cursor-pointer shadow-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* MOBILE HAMBURGER TOGGLE BUTTON - ALWAYS ACCESSIBLE & VISIBLE */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden px-2.5 sm:px-3 py-1.5 transition-all cursor-pointer rounded-full border border-[#ff3e00] ${
                  isMobileMenuOpen ? 'bg-white text-[#ff3e00]' : 'bg-[#ff3e00] hover:bg-[#e03700] text-white'
                } flex items-center gap-1 select-none font-mono-code font-bold uppercase text-[0.65rem] sm:text-[0.68rem] shadow-md shrink-0`}
                aria-label="Toggle Mobile Navigation Menu"
                title="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Menu className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                <span>{isMobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
              </button>
            </div>
          </div>

          {/* MOBILE FULL-FEATURED DRAWER & BACKDROP */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop Click Dismiss */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs lg:hidden pointer-events-auto"
                />

                {/* Animated Menu Drawer Card */}
                <motion.div
                  initial={{ opacity: 0, y: -16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className={`fixed top-14 sm:top-16 inset-x-2 sm:inset-x-6 z-50 max-h-[calc(100vh-70px)] overflow-y-auto ${
                    isDaylight
                      ? 'bg-[#ffffff] text-[#0f172a] border-[#cbd5e1] shadow-[0_25px_60px_rgba(0,0,0,0.2)]'
                      : 'bg-[#181a20] text-[#f8f7f4] border-[#f8f7f4]/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
                  } border-2 rounded-2xl p-4 sm:p-5 space-y-4 lg:hidden font-mono-code text-xs pointer-events-auto`}
                >
                  {/* DRAWER TOP BAR */}
                  <div className="flex items-center justify-between border-b border-current/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ff3e00] animate-pulse" />
                      <span className="text-[0.7rem] uppercase tracking-widest font-bold text-[#ff3e00]">
                        NAVIGATION & ROSTER VAULT
                      </span>
                    </div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1 rounded-lg hover:bg-white/10 text-current/70 hover:text-current transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* USER STATUS / AUTH BANNER */}
                  {isAuthenticated ? (
                    <div className={`p-3 rounded-xl border ${isDaylight ? 'bg-[#f8fafc] border-[#e2e8f0]' : 'bg-[#111114] border-[#f8f7f4]/10'} space-y-2.5`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={currentUser.user.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                            alt={currentUser.user.full_name}
                            className="w-8 h-8 rounded-full border border-[#ff3e00]/50 object-cover"
                          />
                          <div>
                            <div className="font-bold uppercase text-[0.75rem] text-current leading-tight">
                              {currentUser.user.full_name}
                            </div>
                            <div className="text-[0.62rem] text-current/60 lowercase truncate max-w-[160px]">
                              {currentUser.user.email}
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#ff3e00]/15 text-[#ff3e00] border border-[#ff3e00]/30 text-[0.6rem] font-bold uppercase">
                          {currentUser.user.role}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => {
                            handleOpenAuth('login');
                            setIsMobileMenuOpen(false);
                          }}
                          className={`py-2 px-2 text-center rounded-lg border text-[0.65rem] font-bold uppercase transition-colors ${
                            isDaylight ? 'border-[#cbd5e1] hover:bg-slate-100' : 'border-[#f8f7f4]/15 hover:bg-white/5'
                          }`}
                        >
                          Switch Role
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="py-2 px-2 text-center rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/30 text-[0.65rem] font-bold uppercase hover:bg-rose-500 hover:text-white transition-colors"
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 p-1">
                      <button
                        onClick={() => {
                          handleOpenAuth('login');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`py-3 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold uppercase text-[0.7rem] transition-colors ${
                          isDaylight
                            ? 'border-[#0f172a]/30 hover:bg-slate-100'
                            : 'border-[#f8f7f4]/20 hover:bg-white/5'
                        }`}
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Log In</span>
                      </button>
                      <button
                        onClick={() => {
                          handleOpenAuth('signup');
                          setIsMobileMenuOpen(false);
                        }}
                        className="py-3 px-3 rounded-xl bg-[#ff3e00] hover:bg-[#e03700] text-white flex items-center justify-center gap-2 font-bold uppercase text-[0.7rem] shadow-sm transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Sign Up</span>
                      </button>
                    </div>
                  )}

                  {/* NAVIGATION LINKS LIST */}
                  <div className="space-y-1.5 pt-1">
                    {[
                      { id: 'home', label: 'Home Page', icon: Home },
                      { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
                      { id: 'directory', label: 'Talent Directory', icon: Users },
                      { id: 'pricing', label: 'Pricing & Plans', icon: CreditCard },
                      { id: 'jobs_create', label: 'Post Production Call', icon: PlusCircle },
                      ...(!isAuthenticated || currentUser.user.role === 'talent' || currentUser.user.role === 'admin' ? [{ id: 'talent_dashboard', label: 'Talent Portal (Creative)', icon: UserCheck }] : []),
                      ...(!isAuthenticated || currentUser.user.role === 'client' || currentUser.user.role === 'admin' ? [{ id: 'client_dashboard', label: 'Agency Portal (Client)', icon: Shield }] : []),
                      ...(currentUser.user.role === 'admin' ? [{ id: 'admin', label: 'Database Admin Portal', icon: Shield }] : []),
                    ].map((item) => {
                      const IconComponent = item.icon;
                      const isActive = activeRoute === item.id || (item.id.includes('dashboard') && activeRoute.includes('dashboard'));
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleNavigation(item.id as any);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-3 rounded-xl font-bold uppercase text-[0.72rem] transition-all cursor-pointer flex items-center justify-between ${
                            isActive
                              ? 'bg-[#ff3e00] text-white shadow-sm'
                              : (isDaylight 
                                  ? 'text-[#0f172a] hover:bg-[#f1f5f9] hover:text-[#ff3e00]' 
                                  : 'text-[#f8f7f4]/80 hover:bg-[#111114] hover:text-[#f8f7f4]'
                                )
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#ff3e00]'}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive ? (
                            <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-white/20">ACTIVE</span>
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* DRAWER FOOTER / MODE SWITCH */}
                  <div className="pt-3 border-t border-current/10 flex items-center justify-between text-[0.65rem] text-current/60 uppercase">
                    <button
                      onClick={() => setIsDaylight(!isDaylight)}
                      className="flex items-center gap-1.5 hover:text-[#ff3e00] transition-colors"
                    >
                      {isDaylight ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                      <span>{isDaylight ? 'Daylight Active' : 'Dark Mode Active'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setLegalModalState({ isOpen: true, tab: 'privacy' });
                          setIsMobileMenuOpen(false);
                        }}
                        className="hover:text-[#ff3e00] transition-colors"
                      >
                        Privacy
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => {
                          setLegalModalState({ isOpen: true, tab: 'terms' });
                          setIsMobileMenuOpen(false);
                        }}
                        className="hover:text-[#ff3e00] transition-colors"
                      >
                        Terms
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* AUTH TOAST NOTIFICATION */}
      {authToast && (
        <div className="fixed top-20 sm:top-24 right-4 z-50 bg-[#0b0b0d] border-2 border-[#ff3e00] text-[#f8f7f4] px-4 py-2 shadow-2xl font-mono-code font-bold uppercase text-xs tracking-wider animate-bounce">
          {authToast}
        </div>
      )}

      {/* DYNAMIC PAGE ROUTING RENDER */}
      <main className="flex-1 pt-16 sm:pt-24 pb-20 lg:pb-0 min-w-0 w-full max-w-full overflow-x-hidden">
        {activeRoute === 'home' && (
          <LandingHome
            onNavigate={handleNavigation}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            isDaylight={isDaylight}
          />
        )}

        {activeRoute === 'marketplace' && (
          <HomePage
            onNavigate={handleNavigation}
            onSelectTalent={(id) => handleNavigation('talent_detail', { id })}
            currentUser={currentUser}
          />
        )}

        {activeRoute === 'directory' && (
          <TalentDirectoryPage
            initialCategory={searchFilterCategory}
            initialQuery={searchFilterQuery}
            onSelectTalent={(id) => handleNavigation('talent_detail', { id })}
          />
        )}

        {activeRoute === 'pricing' && (
          <PricingPage
            currentUser={currentUser}
            onNavigate={handleNavigation}
            onOpenAuth={handleOpenAuth}
            isDaylight={isDaylight}
          />
        )}

        {activeRoute === 'talent_detail' && (
          <TalentProfilePage
            talentId={selectedTalentId}
            onNavigate={handleNavigation}
            currentUser={currentUser}
          />
        )}

        {activeRoute === 'jobs_create' && (
          !isAuthenticated ? (
            <RoleRestrictedCard
              requiredRole="client"
              currentRole="guest"
              title="Producer / Client Login Required"
              description="Posting production calls is reserved for Client, Agency, and Producer accounts. Please sign in or register a Client account to post hiring calls."
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigation}
            />
          ) : (currentUser.user.role === 'talent') ? (
            <RoleRestrictedCard
              requiredRole="client"
              currentRole="talent"
              title="Job Posting Restricted"
              description="Job creation is reserved for Client & Producer accounts. As a Talent member, you can browse active production calls on the Marketplace."
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigation}
            />
          ) : (
            <CreateJobPage
              onNavigate={handleNavigation}
              currentUser={currentUser}
            />
          )
        )}

        {activeRoute === 'talent_dashboard' && (
          !isAuthenticated ? (
            <RoleRestrictedCard
              requiredRole="talent"
              currentRole="guest"
              title="Talent Portal Login Required"
              description="Please log in to your Crew or Cast account to view your portfolio dashboard, upload media, and manage job applications."
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigation}
            />
          ) : (currentUser.user.role === 'client') ? (
            <RoleRestrictedCard
              requiredRole="talent"
              currentRole="client"
              title="Talent Portal Restricted"
              description="The Talent Portal is reserved for Film Crew & Cast members. As a Client / Studio account, please use your Agency Portal."
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigation}
            />
          ) : (
            <TalentDashboardPage
              currentUser={currentUser}
              onNavigate={handleNavigation}
            />
          )
        )}

        {activeRoute === 'client_dashboard' && (
          !isAuthenticated ? (
            <RoleRestrictedCard
              requiredRole="client"
              currentRole="guest"
              title="Agency Portal Login Required"
              description="Please log in to your Studio / Agency account to view your posted jobs, candidate shortlists, and booking inquiries."
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigation}
            />
          ) : (currentUser.user.role === 'talent') ? (
            <RoleRestrictedCard
              requiredRole="client"
              currentRole="talent"
              title="Agency Portal Restricted"
              description="The Agency / Client Portal is reserved for Studio and Producer accounts. As a Talent member, please use your Talent Portal."
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigation}
            />
          ) : (
            <ClientDashboardPage
              currentUser={currentUser}
              onNavigate={handleNavigation}
            />
          )
        )}

        {activeRoute === 'admin' && (
          (!isAuthenticated || currentUser.user.role !== 'admin') ? (
            <RoleRestrictedCard
              requiredRole="admin"
              currentRole={isAuthenticated ? currentUser.user.role : 'guest'}
              title="Admin Portal Access Restricted"
              description="The Admin Database Portal requires Administrator privileges and valid admin authorization."
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigation}
            />
          ) : (
            <AdminPortalPage
              isDaylight={isDaylight}
            />
          )
        )}
      </main>

      {/* FOOTER */}
      <footer className={`${isDaylight ? 'bg-[#e2e6f0] text-[#0f172a] border-[#0f172a]/20' : 'bg-[#111317] text-[#f8f7f4]/60 border-[#f8f7f4]/10'} border-t py-3.5 pb-24 lg:pb-3.5 px-6 font-mono-code text-[0.65rem] uppercase tracking-wider transition-colors`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 KUTAFUTATALENT</div>

          <div className={`text-center sm:text-left ${isDaylight ? 'text-[#0f172a]' : 'text-[#f8f7f4]/80'} font-bold`}>
            Developed by <span className="text-[#ff3e00]">Proton Technology Plc</span>
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 ${isDaylight ? 'text-[#0f172a]/80' : 'text-[#f8f7f4]/60'}`}>
            {currentUser.user.role === 'admin' && (
              <>
                <button
                  onClick={() => handleNavigation('admin')}
                  className="text-[#ff3e00] font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Database Admin</span>
                </button>
                <span>/</span>
              </>
            )}
            <button
              onClick={() => handleNavigation('pricing')}
              className="hover:text-[#ff3e00] transition-colors cursor-pointer text-[#ff3e00]/90 font-bold"
            >
              Pricing & Plans
            </button>
            <span>/</span>
            <button
              onClick={() => setLegalModalState({ isOpen: true, tab: 'privacy' })}
              className="hover:text-[#ff3e00] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>/</span>
            <button
              onClick={() => setLegalModalState({ isOpen: true, tab: 'terms' })}
              className="hover:text-[#ff3e00] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION DOCK (ALWAYS VISIBLE & ACCESSIBLE ON MOBILE) */}
      <nav
        aria-label="Mobile Navigation Dock"
        className={`fixed bottom-0 inset-x-0 z-40 lg:hidden ${
          isDaylight
            ? 'bg-white/95 text-[#0f172a] border-[#cbd5e1] shadow-[0_-4px_25px_rgba(0,0,0,0.12)]'
            : 'bg-[#14161d]/95 text-[#f8f7f4] border-[#f8f7f4]/15 shadow-[0_-8px_30px_rgba(0,0,0,0.85)]'
        } backdrop-blur-2xl border-t px-2 py-1.5 flex items-center justify-around font-mono-code`}
      >
        {/* TAB 1: HOME */}
        <button
          onClick={() => handleNavigation('home')}
          className={`flex flex-col items-center justify-center min-w-[54px] py-1 transition-all select-none cursor-pointer ${
            activeRoute === 'home'
              ? 'text-[#ff3e00] font-bold'
              : (isDaylight ? 'text-slate-600 hover:text-[#ff3e00]' : 'text-slate-400 hover:text-white')
          }`}
        >
          <div className="relative">
            <Home className={`w-4 h-4 ${activeRoute === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeRoute === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff3e00] rounded-full" />
            )}
          </div>
          <span className="text-[0.6rem] uppercase tracking-tighter mt-0.5">Home</span>
        </button>

        {/* TAB 2: MARKETPLACE */}
        <button
          onClick={() => handleNavigation('marketplace')}
          className={`flex flex-col items-center justify-center min-w-[54px] py-1 transition-all select-none cursor-pointer ${
            activeRoute === 'marketplace'
              ? 'text-[#ff3e00] font-bold'
              : (isDaylight ? 'text-slate-600 hover:text-[#ff3e00]' : 'text-slate-400 hover:text-white')
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-4 h-4 ${activeRoute === 'marketplace' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeRoute === 'marketplace' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff3e00] rounded-full" />
            )}
          </div>
          <span className="text-[0.6rem] uppercase tracking-tighter mt-0.5">Market</span>
        </button>

        {/* TAB 3: TALENT DIRECTORY */}
        <button
          onClick={() => handleNavigation('directory')}
          className={`flex flex-col items-center justify-center min-w-[54px] py-1 transition-all select-none cursor-pointer ${
            activeRoute === 'directory'
              ? 'text-[#ff3e00] font-bold'
              : (isDaylight ? 'text-slate-600 hover:text-[#ff3e00]' : 'text-slate-400 hover:text-white')
          }`}
        >
          <div className="relative">
            <Users className={`w-4 h-4 ${activeRoute === 'directory' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeRoute === 'directory' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff3e00] rounded-full" />
            )}
          </div>
          <span className="text-[0.6rem] uppercase tracking-tighter mt-0.5">Talents</span>
        </button>

        {/* TAB 4: MY PORTAL / DASHBOARD */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              handleOpenAuth('login');
            } else if (currentUser.user.role === 'talent') {
              handleNavigation('talent_dashboard');
            } else if (currentUser.user.role === 'client') {
              handleNavigation('client_dashboard');
            } else {
              handleNavigation('admin');
            }
          }}
          className={`flex flex-col items-center justify-center min-w-[54px] py-1 transition-all select-none cursor-pointer ${
            activeRoute.includes('dashboard') || activeRoute === 'admin'
              ? 'text-[#ff3e00] font-bold'
              : (isDaylight ? 'text-slate-600 hover:text-[#ff3e00]' : 'text-slate-400 hover:text-white')
          }`}
        >
          <div className="relative">
            {isAuthenticated ? (
              <div className="w-4 h-4 rounded-full overflow-hidden border border-current flex items-center justify-center">
                <img
                  src={currentUser.user.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <UserCheck className="w-4 h-4 stroke-2" />
            )}
            {(activeRoute.includes('dashboard') || activeRoute === 'admin') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff3e00] rounded-full" />
            )}
          </div>
          <span className="text-[0.6rem] uppercase tracking-tighter mt-0.5">
            {isAuthenticated ? (currentUser.user.role === 'admin' ? 'Admin' : 'Portal') : 'Sign In'}
          </span>
        </button>

        {/* TAB 5: ALL MENU / DRAWER TOGGLE */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center min-w-[54px] py-1 transition-all select-none cursor-pointer ${
            isMobileMenuOpen
              ? 'text-[#ff3e00] font-bold'
              : (isDaylight ? 'text-slate-600 hover:text-[#ff3e00]' : 'text-slate-400 hover:text-white')
          }`}
        >
          <div className="relative">
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Menu className="w-4 h-4 stroke-2" />
            )}
            {isMobileMenuOpen && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff3e00] rounded-full" />
            )}
          </div>
          <span className="text-[0.6rem] uppercase tracking-tighter mt-0.5">
            {isMobileMenuOpen ? 'Close' : 'Menu'}
          </span>
        </button>
      </nav>

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* LEGAL & PRIVACY / TERMS MODAL */}
      <LegalModal
        isOpen={legalModalState.isOpen}
        initialTab={legalModalState.tab}
        onClose={() => setLegalModalState({ ...legalModalState, isOpen: false })}
      />
    </div>
  );
}


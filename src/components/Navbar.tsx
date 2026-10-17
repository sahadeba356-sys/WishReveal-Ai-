/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  LogOut,
  FileCheck2,
  PlusCircle,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { User } from '../types/backend';

interface NavbarProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenQuiz: () => void;
  onOpenContact: () => void;
  onOpenCreateQuiz: () => void;
  onOpenResponses: () => void;
  onOpenPrivacy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenQuiz,
  onOpenContact,
  onOpenCreateQuiz,
  onOpenResponses,
  onOpenPrivacy,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'হোম', href: '#home', active: true },
    { label: 'ফিচার', href: '#features' },
    { label: 'কিভাবে কাজ করে', href: '#how-it-works' },
    { label: 'ডিসকভার', href: '#features', onClick: onOpenQuiz },
    { label: 'যোগাযোগ', href: '#contact', onClick: onOpenContact },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#090d22]/95 backdrop-blur-md border-b border-indigo-950/60 shadow-lg shadow-black/30 py-2.5 sm:py-3'
            : 'bg-[#080c1e]/80 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none py-3 sm:py-4 md:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          {/* Brand Logo Lockup */}
          <a
            href="#home"
            className="flex items-center gap-2 sm:gap-3 group transition-transform hover:scale-105 shrink-0"
          >
            <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-purple-500 p-0.5 shadow-md shadow-pink-500/25 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#111738] rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-pink-400 fill-pink-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-pink-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl md:text-2xl font-brand font-extrabold tracking-tight text-white flex items-center gap-1">
                WishReveal <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Ai</span>
              </span>
              <span className="text-[9px] sm:text-[11px] text-pink-200/70 font-bengali font-normal -mt-0.5 tracking-wide hidden xs:block">
                মনের ইচ্ছা এখন আর রহস্য নয়!
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-[#131a42]/60 border border-white/5 rounded-full px-3.5 py-1.5 backdrop-blur-sm shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  link.active
                    ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-sm shadow-purple-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: User Menu / Login & Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer min-h-[40px]"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.name.slice(0, 1)}
                  </div>
                  <span className="font-bengali font-semibold max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f153a] border border-white/15 shadow-2xl backdrop-blur-xl p-1.5 z-50 text-xs font-bengali space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-white/10">
                      <span className="text-[10px] text-pink-300 font-bold block">লগইন করা অ্যাকাউন্ট:</span>
                      <span className="text-white font-semibold truncate block">{currentUser.name}</span>
                      <span className="text-[10px] text-slate-400 truncate block">{currentUser.email}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenResponses();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <FileCheck2 className="w-4 h-4 text-sky-400" />
                      <span>আমার কুইজ ও রেসপন্স</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenCreateQuiz();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-400" />
                      <span>নতুন কুইজ তৈরি করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenPrivacy();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Shield className="w-4 h-4 text-indigo-400" />
                      <span>গোপনীয়তা ও ডেটা সেটিংস</span>
                    </button>

                    <div className="pt-1 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>লগআউট (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 animate-gradient-flow text-white font-medium text-xs sm:text-sm shadow-md shadow-purple-600/30 hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer min-h-[40px] sm:min-h-[44px]"
              >
                <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-100" />
                <span className="font-bengali font-medium">লগইন</span>
              </button>
            )}

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-200 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-3 p-4 rounded-2xl bg-[#0f153a] border border-white/10 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200 max-h-[calc(100vh-80px)] overflow-y-auto font-bengali">
            {currentUser && (
              <div className="p-3 mb-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-pink-300 font-bold block">লগইন করা ইউজার:</span>
                <span className="text-white font-semibold block">{currentUser.name}</span>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenResponses();
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-sky-500/20 text-sky-300 text-xs text-center font-bold"
                  >
                    আমার কুইজ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenPrivacy();
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs text-center font-bold"
                  >
                    প্রাইভেসি
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between min-h-[44px] ${
                    link.active
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold'
                      : 'text-slate-200 hover:bg-white/5 active:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-white/50">›</span>
                </a>
              ))}

              <div className="pt-2 border-t border-white/10 mt-2 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuiz();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-200 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-pink-500/30 active:scale-98 transition-all min-h-[44px] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>কুইজ শুরু করুন</span>
                </button>

                {currentUser && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>লগআউট করুন</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Dimmed backdrop when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 md:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
};

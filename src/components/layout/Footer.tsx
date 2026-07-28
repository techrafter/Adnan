'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';

export const Footer: React.FC = () => {
  let categories: any[] = [];
  let siteSettings: any = null;
  try {
    const catalog = useCatalog();
    if (catalog?.categories) {
      categories = catalog.categories;
    }
    if (catalog?.siteSettings) {
      siteSettings = catalog.siteSettings;
    }
  } catch (e) {
    // fallback if context not available
  }

  const displayCategories = categories.length > 0 ? categories : [];
  const logoUrl = siteSettings?.logoUrl || '';
  const storeName = siteSettings?.storeName || 'ADNAN SUPER STORE';

  const aboutUsLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Categories', href: '/browse' },
    { name: 'All Brands', href: '/browse' },
    { name: 'Blogs', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'FAQs', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Ramzan Offerings', href: '/browse' },
  ];

  return (
    <footer className="bg-[#f8f9fa] text-slate-700 pt-10 pb-6 border-t border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10">
          
          {/* Col 1: About Us */}
          <div className="md:col-span-3 lg:col-span-3 md:border-r md:border-slate-200 md:pr-6">
            <h4 className="font-bold text-slate-900 text-sm tracking-tight mb-4">About Us</h4>
            <ul className="space-y-2 text-[13px]">
              {aboutUsLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Categories (Dynamic from Store) */}
          <div className="md:col-span-6 lg:col-span-6 md:px-2">
            <h4 className="font-bold text-slate-900 text-sm tracking-tight mb-4">Categories</h4>
            {displayCategories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2.5 text-[13px]">
                {displayCategories.map((cat) => {
                  const catTarget = cat.slug || cat.id || cat.name;
                  return (
                    <a
                      key={cat.id || cat.slug || cat.name}
                      href={`/browse?category=${encodeURIComponent(catTarget)}`}
                      className="text-slate-600 hover:text-slate-900 transition-colors font-normal truncate block"
                      title={cat.name}
                    >
                      {cat.name}
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Loading categories...</p>
            )}
          </div>

          {/* Col 3: Store Timings & Service (ADNAN SUPER STORE) */}
          <div className="md:col-span-3 lg:col-span-3 md:border-l md:border-slate-200 md:pl-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={storeName}
                    className="h-10 w-auto object-contain max-w-[180px]"
                  />
                ) : null}
              </div>
              <h4 className="font-bold text-slate-900 text-xs tracking-tight uppercase text-slate-400 mb-3">
                Store Timings & Service
              </h4>
            </div>

            <ul className="space-y-3 text-[13px] text-slate-600">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>Open Daily: 08:00 AM - 11:00 PM</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                <span>Main Bazaar Road, Razzar, Pakistan</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <a href="https://wa.me/923348699487" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">
                  +92 334 8699487 (WhatsApp Direct)
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                <a href="mailto:support@adnansuperstore.com" className="hover:text-accent-600 transition-colors">
                  support@adnansuperstore.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Adnan Super Store (Razzar). All rights reserved.</p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-700">
            <a href="#" aria-label="Instagram" className="hover:text-black transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-black transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
            </a>
            <a href="#" aria-label="Twitter / X" className="hover:text-black transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-black transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" aria-label="TikTok" className="hover:text-black transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.96v7.41c.01 2.92-1.71 5.66-4.41 6.74-2.7 1.08-5.87.5-7.98-1.46-2.1-1.96-2.68-5.12-1.46-7.8 1.22-2.68 4.05-4.3 7.02-4.04v4.02c-1.39-.14-2.74.5-3.37 1.75-.63 1.25-.33 2.77.72 3.69 1.05.92 2.61 1.01 3.76.22 1.15-.79 1.66-2.19 1.65-3.58V0h-.01z"/></svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

"use client";

import { useEffect, useState } from "react";
import ChromaticBackground from "./ChromaticBackground";

export function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white font-sans flex flex-col justify-between">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <ChromaticBackground />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-black/65 backdrop-blur-[1px]" />

      {/* Navbar */}
            <nav className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center shrink-0">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 800"
    className="h-10 w-auto aspect-square"
    fill="none"
  >
    <g transform="translate(0, 0)">
      {/* Letter R */}
      <path
        d="M 143 273 C 215 273, 302 268, 302 342 C 302 405, 230 411, 192 410 C 192 410, 280 500, 310 598 L 260 598 C 225 500, 182 422, 182 422 L 182 598 L 143 598 Z M 182 302 L 182 383 C 205 383, 263 385, 263 342 C 263 302, 205 302, 182 302 Z"
        fill="#FFF7D3"
        stroke="#FFF7D3"
        strokeWidth="12"
        strokeLinejoin="round"
      />
      <g fill="none" stroke="#FFF7D3" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M 400 338 C 388 338, 388 304, 402 304 C 413 304, 412 316, 401 323 C 395 327, 395 338, 395 338"
          strokeWidth="10"
        />
        <path
          d="M 395 338 L 378 360 L 300 400 Q 400 375, 500 400 L 422 360 Z"
          strokeWidth="12"
        />
        <path d="M 320 393 Q 400 370 480 393" strokeWidth="8" />
        <path d="M 350 380 L 378 365" strokeWidth="6" />
        <path d="M 450 380 L 422 365" strokeWidth="6" />
      </g>
      <path
        d="M 355 520 C 335 520, 325 538, 325 558 C 325 582, 342 598, 362 598 C 375 598, 385 588, 387 575 L 387 598 L 402 598 L 402 525 C 385 520, 370 520, 355 520 Z M 387 540 L 387 560 C 380 578, 342 578, 342 558 C 342 538, 375 538, 387 540 Z"
        fill="#FFF7D3"
        stroke="#FFF7D3"
        strokeWidth="12"
        strokeLinejoin="round"
      />
      <path
        d="M 465 528 C 455 520, 440 520, 430 528 C 412 542, 412 576, 430 590 C 442 600, 460 598, 468 588 L 456 578 C 450 584, 438 585, 432 576 C 424 564, 424 552, 432 542 C 438 534, 452 534, 458 540 Z"
        fill="#FFF7D3"
        stroke="#FFF7D3"
        strokeWidth="12"
        strokeLinejoin="round"
      />
      <path
        d="M 508 273 L 547 273 L 547 400 L 622 273 L 670 273 L 582 410 L 677 598 L 625 598 L 547 435 L 547 598 L 508 598 Z"
        fill="#FFF7D3"
        stroke="#FFF7D3"
        strokeWidth="12"
        strokeLinejoin="round"
      />
    </g>
  </svg>
</div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-xs sm:text-sm text-white/70">
          <a href="#" className="hover:text-white transition">Templates</a>
          <a href="#" className="hover:text-white transition">Features</a>
          <a href="#" className="hover:text-white transition">Resources</a>
        </div>

        {/* Mobile Hamburger - centered */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="md:hidden absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-1.5 w-9 h-9 rounded-full border border-[#ab1f09]/50 bg-[#ab1f09]/20 hover:bg-[#ab1f09]/40 transition"
        >
          <span className={`block h-0.5 w-4 bg-[#fff7d3] transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block h-0.5 w-4 bg-[#fff7d3] transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
          <span className={`block h-0.5 w-4 bg-[#fff7d3] transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </button>

        <button className="rounded-full border border-[#ab1f09]/50 bg-[#ab1f09]/20 px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-medium text-[#fff7d3] hover:bg-[#ab1f09]/40 transition">
         Build a form
        </button>
      </nav>

      {/* Mobile Dropdown - Grid Layout */}
      {menuOpen && (
        <div className="md:hidden relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pb-4">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#ab1f09]/30 bg-black/95 backdrop-blur-md p-4">
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl border border-[#ab1f09]/30 bg-[#ab1f09]/10 px-4 py-4 text-center text-sm text-[#fff7d3] hover:bg-[#ab1f09]/30 transition"
            >
              Templates
            </a>
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl border border-[#ab1f09]/30 bg-[#ab1f09]/10 px-4 py-4 text-center text-sm text-[#fff7d3] hover:bg-[#ab1f09]/30 transition"
            >
              Features
            </a>
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="col-span-2 rounded-xl border border-[#ab1f09]/30 bg-[#ab1f09]/10 px-4 py-4 text-center text-sm text-[#fff7d3] hover:bg-[#ab1f09]/30 transition"
            >
              Resources
            </a>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-2 pb-4 text-center flex flex-col items-center flex-1 justify-start">
        
        {/* Top Announcement Badge */}
        <div className="my-3 inline-flex items-center gap-2 rounded-full border border-[#ab1f09]/40 bg-[#ab1f09]/20 px-3.5 py-1 text-[11px] sm:text-xs text-[#fff7d3] backdrop-blur-md">
          <span>Forms, polls, and voting in one place</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.15] text-white max-w-3xl">
          Create. Collect. Decide.<br />
          Everything you need to turn responses into action.
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-lg text-xs sm:text-base text-white/60 leading-relaxed">
          Build beautiful forms, collect responses, and run smarter votes
          with powerful analytics designed for teams and communities.
        </p>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button className="w-full sm:w-auto rounded-full bg-[#fff7d3] px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#ab1f09] hover:bg-white transition shadow-lg shadow-[#fff7d3]/10">
            Build a form
          </button>

        </div>

        
        {/* Dashboard Preview Component */}
        <div className="mt-6 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0a0c0e]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-md text-left">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2 text-[#fff7d3] font-semibold text-xs sm:text-sm">
              <div className="h-4 w-4 rounded-full border border-[#ab1f09] bg-[#ab1f09] flex items-center justify-center text-[8px] text-[#fff7d3]">✓</div>
              Rack
            </div>
            <div className="h-4 w-1/3 rounded-md bg-neutral-800/80" />
            <div className="flex gap-1.5">
              <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-neutral-800/80" />
              <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-neutral-800/80" />
              <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-neutral-800/80" />
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-3 sm:gap-4">
            <div className="col-span-3 space-y-3 pr-2 border-r border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                <div className="h-2 w-full rounded bg-neutral-800" />
              </div>
              <div className="h-2 w-4/5 rounded bg-neutral-800/60" />
              <div className="h-2 w-3/4 rounded bg-neutral-800/60" />
              <div className="h-2 w-5/6 rounded bg-neutral-800/60" />
            </div>

            <div className="col-span-9 space-y-3">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                <div className="rounded-xl bg-neutral-900/80 border border-white/5 p-3 space-y-2">
                  <div className="h-2 w-3/4 rounded bg-neutral-700" />
                  <div className="h-2 w-1/2 rounded bg-neutral-800" />
                  <div className="h-2 w-2/3 rounded bg-neutral-800" />
                </div>

                <div className="rounded-xl bg-neutral-900/80 border border-white/5 p-3 space-y-2">
                  <div className="h-2 w-3/4 rounded bg-neutral-700" />
                  <div className="h-2 w-1/2 rounded bg-neutral-800" />
                  <div className="h-2 w-2/3 rounded bg-neutral-800" />
                </div>

                <div className="rounded-xl bg-neutral-900/80 border border-white/5 p-3 space-y-2">
                  <div className="h-2 w-3/4 rounded bg-neutral-700" />
                  <div className="h-2 w-1/2 rounded bg-neutral-800" />
                  <div className="h-2 w-2/3 rounded bg-neutral-800" />
                </div>
              </div>

              <div className="h-10 sm:h-12 w-full rounded-xl bg-neutral-900/50 border border-white/5" />
            </div>
          </div>

        </div>

      </div>

      {/* Social Proof Section */}
      <div className="relative z-10 w-full py-4 border-t border-b border-white bg-black/80 backdrop-blur-sm flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-40 grayscale text-xs sm:text-sm">
        <span className="font-bold tracking-widest uppercase">LogoIpsum</span>
        <span className="font-bold tracking-widest uppercase">LogoIpsum</span>
        <span className="font-bold tracking-widest uppercase">LogoIpsum</span>
        <span className="font-bold tracking-widest uppercase">LogoIpsum</span>
      </div>
    </section>
  );
}
export function Footer() {
  const brandName = "Rack...";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < brandName.length) {
            setDisplayText(brandName.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000); // Pause at full text
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(brandName.slice(0, displayText.length - 1));
          } else {
            setIsDeleting(false);
          }
        }
      },
      isDeleting ? 100 : 150
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting]);

  // Pixel grid dot matrix mapping (exact pattern representation from screenshot)
  const dotPattern = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0],
    [1,1,0,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0],
    [1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,0,1,1,1,0,0,0,1,1,0,0,1,1,1,0,0,1,1,1,0,0,0,1,1,0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,0,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ];

  return (
    <footer className="w-full bg-black text-white overflow-hidden pt-12 sm:pt-16 pb-0 px-6 sm:px-12 md:px-16 font-sans border-t border-neutral-800">
      <div className="max-w-6xl mx-auto flex flex-col justify-between min-h-[340px]">
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Brand & Typewriter Column */}
          <div className="md:col-span-6 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-[#fff7d3] min-h-[32px] flex items-center">
              <span>{displayText}</span>
              <span className="inline-block w-[2px] h-5 bg-[#ab1f09] ml-0.5 animate-pulse" />
            </h2>
            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
              A modern approach to forms,<br /> built to make collecting information simpler and more effective.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-neutral-700/80 bg-neutral-900/60 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-neutral-700/80 bg-neutral-900/60 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-neutral-700/80 bg-neutral-900/60 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-6 grid grid-cols-3 gap-6 text-xs">
            {/* Links */}
            <div className="space-y-3">
              <h3 className="text-white font-medium text-xs mb-4">Links</h3>
              <ul className="space-y-2.5 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>

            
            {/* Legal */}
            <div className="space-y-3">
              <h3 className="text-white font-medium text-xs mb-4">Legal</h3>
              <ul className="space-y-2.5 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">License</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Dot Matrix Graphic Pattern */}
        <div className="w-full flex flex-col items-center gap-1.5 overflow-hidden pt-4 pointer-events-none select-none">
          {dotPattern.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-between w-full max-w-6xl gap-1">
              {row.map((cell, cellIndex) => (
                <span
                  key={cellIndex}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-opacity ${
                    cell === 1 ? "bg-[#fff7d3] opacity-90" : "bg-transparent opacity-0"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function ClaritySection() {
  const categories = [
    "Create Forms",
    "Collect Insights",
    "Run Surveys",
    "Gather Feedback",
    "Make Decisions",
    "Automate Workflows",
    "Analyze Data",
    "Collaborate",
  ];

  return (
    <section className="relative w-full bg-black text-white py-16 sm:py-28 px-4 sm:px-8 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#ab1f09]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left Content Column */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.15]">
            <span className="text-[#ab1f09]">Build</span> powerful <span className="text-[#ab1f09]">Forms,</span> Survey <span className="text-[#ab1f09]">and Workflows</span> without limits.
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed">
            Build forms that feel simple for creators and seamless for everyone who responds.
          </p>

          <div className="pt-2">
            <button className="w-full sm:w-auto rounded-full bg-[#ab1f09] px-8 py-3 text-xs sm:text-sm font-semibold text-[#fff7d3] hover:bg-[#ab1f09]/80 transition shadow-lg shadow-[#ab1f09]/30">
              Build a form
            </button>
          </div>
        </div>

        {/* Right UI Preview Cards Column */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Top Pill Tags & Display Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 sm:p-6 backdrop-blur-md space-y-6">
            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, idx) => {
                const isActive = cat === "Artificial Intelligence";
                return (
                  <span
                    key={idx}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#fff7d3] text-[#ab1f09] font-bold"
                        : "border border-neutral-700 bg-neutral-900/60 text-neutral-300 hover:border-[#ab1f09]/50"
                    }`}
                  >
                    {cat}
                  </span>
                );
              })}
            </div>

            {/* Inner Display Card */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 sm:p-5 space-y-8 min-h-[140px] flex flex-col justify-between">
              <span className="inline-block px-3 py-1 rounded-full border border-[#ab1f09]/40 bg-[#ab1f09]/15 text-[10px] sm:text-[11px] text-[#fff7d3] w-max">
                Form Builder
              </span>
              <p className="text-xs text-neutral-400 text-right">
                Build forms that feel simple for creators and seamless for everyone who responds
              </p>
            </div>
          </div>

          {/* Bottom Dual Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Conversion Card */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 backdrop-blur-md flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-[#ab1f09]" />
                  <span className="text-xs font-bold tracking-wider text-white uppercase">
                    Collaboration
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Build and manage forms together with your team.
                </p>
              </div>
              <a href="#" className="text-xs text-[#fff7d3]/80 underline underline-offset-4 hover:text-[#fff7d3] transition text-right block">
                See how it works
              </a>
            </div>

            {/* Analytics Card */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 backdrop-blur-md flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded bg-[#ab1f09]" />
                  <span className="text-xs font-bold tracking-wider text-white uppercase">
                    Insights
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Understand responses and make better decisions.
                </p>
              </div>
              <a href="#" className="text-xs text-[#fff7d3]/80 underline underline-offset-4 hover:text-[#fff7d3] transition text-right block">
                View insights
              </a>
            </div>

          </div>

        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full border-b border-white" />
    </section>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-black min-h-screen">
      <Hero />
      <ClaritySection />
      <StepProcessSection />
      <CapabilitiesSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is Rack?",
      answer:
        "Rack is a modern form builder that helps you create, share, and manage forms while making it easier to collect and understand responses.",
    },
    {
      question: "Can I customize my forms?",
      answer:
        "YYes. You can customize your forms with different question types, layouts, and settings to match your needs.",
    },
    {
      question: "Do I need coding experience to use Rack?",
      answer:
        "No. Rack is designed to help anyone create powerful forms without needing technical skills.",
    },
    {
      question: "Can I view and manage responses?",
      answer:
        "Yes. Rack helps you organize, review, and manage all responses in one place.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-black text-white py-16 px-4 sm:px-8 border-b border-neutral-800">
      <div className="max-w-6xl mx-auto border border-neutral-800 rounded-xl overflow-hidden bg-[#0a0a0a] p-8 sm:p-14">
        
        {/* Header Block */}
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-[#ab1f09]" />
            <span className="text-xs font-mono tracking-widest text-[#fff7d3] uppercase">
              FREQUENTLY ASKED QUESTIONS
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            Everything you need to know
          </h2>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-neutral-800 border-t border-b border-neutral-800">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-6 transition-colors">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between text-left focus:outline-none group"
                >
                  <span
                    className={`text-lg sm:text-xl font-medium transition-colors ${
                      isOpen ? "text-[#fff7d3]" : "text-neutral-200 group-hover:text-white"
                    }`}
                  >
                    {faq.question}
                  </span>
                  
                  {/* Plus/Minus Indicator */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                      isOpen
                        ? "border-[#ab1f09] bg-[#ab1f09]/10 text-[#fff7d3]"
                        : "border-neutral-800 bg-neutral-900 text-neutral-400 group-hover:border-neutral-700"
                    }`}
                  >
                    <span className="text-xl font-mono leading-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                </button>

                {/* Animated Dropdown Content */}
                {isOpen && (
                  <div className="mt-4 pr-12 text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="w-full bg-black text-white py-12 px-4 sm:px-8 border-b border-neutral-800">
      <div className="max-w-6xl mx-auto border border-neutral-800 rounded-xl overflow-hidden relative">
        
        {/* Rust Brand Dynamic Background Layer with Grain */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-[#ab1f09]/80 to-[#ab1f09] opacity-90" />
        
        {/* Texturized Grid/Dot Mesh Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(#fff7d3 1px, transparent 1px)`,
            backgroundSize: "12px 12px",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 p-8 sm:p-14 flex flex-col md:flex-row md:items-end justify-between gap-8 min-h-[320px]">
          
          {/* Left Text Block */}
          <div className="space-y-6 max-w-xl">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 border border-neutral-700/60 backdrop-blur-md">
              <span className="w-4 h-4 rounded bg-[#ab1f09] flex items-center justify-center text-[10px] text-[#fff7d3]">
                .
              </span>
              <span className="text-xs font-mono tracking-widest text-[#fff7d3] uppercase">
                Join Rack
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Create forms <br /> without limits
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-md">
              Build powerful forms, collect responses, and manage your data with a platform designed for flexibility and simplicity.
            </p>
          </div>

          {/* Right Action Button */}
          <div className="pt-4 md:pt-0">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold tracking-wider text-sm hover:bg-[#fff7d3] transition-colors rounded-none uppercase">
              Build a form
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export function StepProcessSection() {
  const [activeTab, setActiveTab] = useState("connect");

  const stepsData = {
    connect: {
      stepLabel: "Step: 1",
      title: "Connect your data",
      description:
        "Design powerful forms with flexible questions, custom layouts, and everything you need to collect the right information.",
      number: "01",
      footerText: "Create your form",
      imageLeft: false, // Text on left, Image on right
      icon: (
        <svg className="w-8 h-8 text-[#fff7d3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    process: {
      stepLabel: "Step: 2",
      title: "Share with your audience",
      description:
        "Send your form anywhere with a simple link and start collecting responses instantly.",
      number: "02",
      footerText: "Share with your audience",
      imageLeft: true, // Image on left, Text on right (Matches Image 2)
      icon: (
        <svg className="w-8 h-8 text-[#fff7d3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    execute: {
      stepLabel: "Step: 3",
      title: "Execute with precision",
      description:
        "Review submissions, discover insights, and make better decisions with organized response data.",
      number: "03",
      footerText: "Analyze your responses",
      imageLeft: false, // Text on left, Image on right
      icon: (
        <svg className="w-8 h-8 text-[#fff7d3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m-2.828 9.9a9 9 0 010-12.728M12 12h.01" />
        </svg>
      ),
    },
  };

  const currentStep = stepsData[activeTab as keyof typeof stepsData];

  return (
    <section className="w-full bg-black text-white py-12 px-4 sm:px-8 border-b border-neutral-800">
      <div className="max-w-6xl mx-auto border border-neutral-800 rounded-xl overflow-hidden bg-[#0a0a0a]">
        
        {/* Top Navigation Tabs */}
        <div className="grid grid-cols-3 border-b border-neutral-800 text-sm sm:text-base font-medium">
          <button
            onClick={() => setActiveTab("connect")}
            className={`py-5 px-4 flex items-center justify-center gap-3 border-r border-neutral-800 transition-all ${
              activeTab === "connect"
                ? "bg-neutral-900/80 text-white border-b-2 border-b-[#ab1f09]"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-lg sm:text-xl font-semibold">Create</span>
          </button>

          <button
            onClick={() => setActiveTab("process")}
            className={`py-5 px-4 flex items-center justify-center gap-3 border-r border-neutral-800 transition-all ${
              activeTab === "process"
                ? "bg-neutral-900/80 text-white border-b-2 border-b-[#ab1f09]"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-lg sm:text-xl font-semibold">Share</span>
          </button>

          <button
            onClick={() => setActiveTab("execute")}
            className={`py-5 px-4 flex items-center justify-center gap-3 transition-all ${
              activeTab === "execute"
                ? "bg-neutral-900/80 text-white border-b-2 border-b-[#ab1f09]"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m-2.828 9.9a9 9 0 010-12.728M12 12h.01" />
            </svg>
            <span className="text-lg sm:text-xl font-semibold">Analyze</span>
          </button>
        </div>

        {/* Content Section - Grid swaps sides dynamically */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
          
          {/* Text Content Block */}
          <div
            className={`lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between border-neutral-800 ${
              currentStep.imageLeft ? "order-2 lg:border-l" : "order-1 lg:border-r border-b lg:border-b-0"
            }`}
          >
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400">
                {currentStep.stepLabel}
              </span>

              <h3 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                {currentStep.title}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md">
                {currentStep.description}
              </p>

              <div className="text-6xl sm:text-8xl font-bold text-neutral-900 select-none pt-4">
                {currentStep.number}
              </div>
            </div>

            {/* Bottom Label Line */}
            <div className="pt-8 border-t border-neutral-900 flex items-center justify-between text-[11px] tracking-widest text-neutral-500 font-mono">
              <span>|</span>
              <span>{currentStep.footerText}</span>
              <span>|</span>
            </div>
          </div>

          {/* Animated Graphic Canvas Area (Rust Brand Colored Wave) */}
          <div
            className={`lg:col-span-6 relative overflow-hidden flex items-center justify-center p-8 bg-black ${
              currentStep.imageLeft ? "order-1 border-b lg:border-b-0" : "order-2"
            }`}
          >
            {/* Animated Brand Color Moving Glow Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ab1f09]/60 via-[#ab1f09]/20 to-black animate-pulse duration-1000" />
            
            {/* Moving Wavy Noise Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#fff7d3_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />

            {/* Center Glass Card with Icon */}
            <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-xl border border-[#ab1f09]/60 bg-black/80 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-[#ab1f09]/40">
              {currentStep.icon}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
export function CapabilitiesSection() {
  return (
    <section className="relative w-full bg-black text-white py-16 sm:py-24 px-4 sm:px-8 overflow-hidden border-b border-white/10">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#ab1f09]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Top Header Block */}
        <div className="space-y-4 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-md border border-[#ab1f09]/40 bg-[#ab1f09]/15 px-3 py-1 text-xs font-mono font-semibold text-[#fff7d3] uppercase tracking-wider">
            <span>.</span> RACK CAPABILITIES
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.15]">
            Built for <span className="text-[#fff7d3]">simplicity</span> and{" "}
            <span className="text-[#ab1f09]">collaboration.</span>
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Instant Data Inputs */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden flex flex-col justify-between backdrop-blur-md group hover:border-[#ab1f09]/40 transition duration-300">
            {/* Card Content Top */}
            <div className="p-6 sm:p-8 space-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                Powerful Form Builder
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
                Create beautiful forms with flexible layouts, question types, and customization.
              </p>
            </div>

            {/* Card Graphic Area */}
            <div className="relative h-64 sm:h-72 w-full bg-gradient-to-br from-[#ab1f09]/40 via-[#ab1f09]/20 to-neutral-950 flex items-center justify-center p-6 overflow-hidden">
              {/* Decorative Mesh Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#fff7d3_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

              {/* Upload Card Mockup */}
              <div className="relative z-10 w-full max-w-xs rounded-xl border border-neutral-700/80 bg-neutral-950/90 p-4 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white">Create your form</span>
                  <span className="text-[10px] text-neutral-500 border border-neutral-700 rounded-full h-4 w-4 flex items-center justify-center">i</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-700 bg-neutral-900/60 p-2.5 text-xs text-neutral-400">
                  <span>.</span>
                  <span>Add a question...</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button className="rounded-md bg-[#ab1f09] px-3 py-1 text-[11px] font-bold text-[#fff7d3]">
                    ADD QUESTION
                  </button>
                  <button className="rounded-md bg-neutral-800 px-3 py-1 text-[11px] font-medium text-neutral-400">
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Live AI Insights */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden flex flex-col justify-between backdrop-blur-md group hover:border-[#ab1f09]/40 transition duration-300">
            {/* Card Content Top */}
            <div className="p-6 sm:p-8 space-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                Response Management
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
                Organize, review, and manage all responses in one place.
              </p>
            </div>

            {/* Card Graphic Area */}
            <div className="relative h-64 sm:h-72 w-full bg-gradient-to-bl from-[#ab1f09]/40 via-[#ab1f09]/20 to-neutral-950 flex items-center justify-center p-6 overflow-hidden">
              {/* Decorative Mesh Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#fff7d3_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

              {/* Analytics Card Mockup */}
              <div className="relative z-10 w-full max-w-xs rounded-xl border border-neutral-700/80 bg-neutral-950/90 p-4 shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-[10px] text-neutral-400">
                  <span className="text-[#fff7d3] font-semibold border-b border-[#fff7d3] pb-0.5">7d</span>
                  <span>1m</span>
                  <span>3m</span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">2,354 responses</span>
                    <span className="text-[10px] text-emerald-400 font-medium">↑ 2.5%</span>
                  </div>
                </div>

                {/* SVG Sparkline Graph */}
                <div className="h-10 w-full pt-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                    <path
                      d="M 0 25 Q 20 5, 40 20 T 80 10 T 100 5"
                      fill="none"
                      stroke="#fff7d3"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-800/80">
                  <span>View all responses</span>
                  <span>›</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
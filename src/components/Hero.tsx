"use client";

import { useEffect, useState } from "react";
import ChromaticBackground from "./ChromaticBackground";
export function Hero() {
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

      {/* Clothes Hanger Icon */}
      <g fill="none" stroke="#FFF7D3" strokeLinecap="round" strokeLinejoin="round">
        {/* Hook */}
        <path
          d="M 400 338 C 388 338, 388 304, 402 304 C 413 304, 412 316, 401 323 C 395 327, 395 338, 395 338"
          strokeWidth="10"
        />

        {/* Main Frame */}
        <path
          d="M 395 338 L 378 360 L 300 400 Q 400 375, 500 400 L 422 360 Z"
          strokeWidth="12"
        />

        {/* Hanger Details / Accent Lines */}
        <path d="M 320 393 Q 400 370 480 393" strokeWidth="8" />
        <path d="M 350 380 L 378 365" strokeWidth="6" />
        <path d="M 450 380 L 422 365" strokeWidth="6" />
      </g>

      {/* Lowercase "a" */}
      <path
        d="M 355 520 C 335 520, 325 538, 325 558 C 325 582, 342 598, 362 598 C 375 598, 385 588, 387 575 L 387 598 L 402 598 L 402 525 C 385 520, 370 520, 355 520 Z M 387 540 L 387 560 C 380 578, 342 578, 342 558 C 342 538, 375 538, 387 540 Z"
        fill="#FFF7D3"
        stroke="#FFF7D3"
        strokeWidth="12"
        strokeLinejoin="round"
      />

      {/* Lowercase "c" */}
      <path
        d="M 465 528 C 455 520, 440 520, 430 528 C 412 542, 412 576, 430 590 C 442 600, 460 598, 468 588 L 456 578 C 450 584, 438 585, 432 576 C 424 564, 424 552, 432 542 C 438 534, 452 534, 458 540 Z"
        fill="#FFF7D3"
        stroke="#FFF7D3"
        strokeWidth="12"
        strokeLinejoin="round"
      />

      {/* Letter K */}
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
        <div className="hidden md:flex items-center gap-8 text-xs sm:text-sm text-white/70">
          <a href="#" className="hover:text-white transition">Templates</a>
          <a href="#" className="hover:text-white transition">Features</a>
          <a href="#" className="hover:text-white transition">Resources</a>
        </div>

        <button className="rounded-full border border-[#ab1f09]/50 bg-[#ab1f09]/20 px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-medium text-[#fff7d3] hover:bg-[#ab1f09]/40 transition">
         Build a form
        </button>
      </nav>

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
              A modern approach to forms,<br> built to make collecting information simpler and more effective.</br>
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
      <CapabilitiesSection />
      <Footer />
    </main>
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
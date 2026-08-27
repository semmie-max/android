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
          Get started
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
            Start stacking responses
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

export function ClaritySection() {
  const categories = [
    "Product Strategy",
    "Information Technology",
    "eCommerce",
    "Artificial Intelligence",
    "Model Production",
    "Process Optimization",
    "Business Automation",
    "Growth Strategy",
  ];

  return (
    <section className="relative w-full bg-black text-white py-16 sm:py-28 px-4 sm:px-8 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#ab1f09]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left Content Column */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.15]">
            <span className="text-[#ab1f09]">Clarity</span> and <span className="text-[#ab1f09]">Control</span> in Every Click — <span className="text-[#ab1f09]">Streamline</span>, Track, and <span className="text-[#ab1f09]">Grow</span> with Ease
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed">
            Simplify operations, gain instant insights, and accelerate growth with intelligent automation designed to keep your business running smarter and faster.
          </p>

          <div className="pt-2">
            <button className="w-full sm:w-auto rounded-full bg-[#ab1f09] px-8 py-3 text-xs sm:text-sm font-semibold text-[#fff7d3] hover:bg-[#ab1f09]/80 transition shadow-lg shadow-[#ab1f09]/30">
              Take Control
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
                Artificial Intelligence
              </span>
              <p className="text-xs text-neutral-400 text-right">
                AI that saves time, cuts costs, and drives growth
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
                    Conversion
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Turn visitors into customers.
                </p>
              </div>
              <a href="#" className="text-xs text-[#fff7d3]/80 underline underline-offset-4 hover:text-[#fff7d3] transition text-right block">
                Learn more
              </a>
            </div>

            {/* Analytics Card */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 backdrop-blur-md flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded bg-[#ab1f09]" />
                  <span className="text-xs font-bold tracking-wider text-white uppercase">
                    Analytics
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Clear data, smart moves.
                </p>
              </div>
              <a href="#" className="text-xs text-[#fff7d3]/80 underline underline-offset-4 hover:text-[#fff7d3] transition text-right block">
                Learn more
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
    </main>
  );
}
export function StatsSection() {
  const regions = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Europe', code: 'EU' },
    { name: 'Australia', code: 'AU' },
  ]

  const stats = [
    { value: '1%', label: 'Domestic Fees' },
    { value: '3%', label: 'Cross Border' },
    { value: '70%', label: 'Savings on Fees' },
  ]

  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-foreground overflow-hidden">
      {/* Globe background with 3D effect */}
      <div 
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] sm:w-[120%] md:w-[1420px] translate-y-[40%] md:translate-y-[45%]"
        aria-hidden="true"
      >
        {/* Radial gradient overlay to create sphere illusion */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'radial-gradient(ellipse 50% 60% at 50% 40%, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.9) 100%)',
          }}
        />
        {/* Subtle glow behind globe */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
          }}
        />
        <img 
          src="/global-map.svg" 
          alt="" 
          className="w-full h-auto opacity-80"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading - uses font-display (Space Grotesk) via h2 tag */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-8 md:mb-10 tracking-tight">
          Global Coverage. One Integration.
        </h2>

        {/* Region pills - cleaner, more refined styling */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 md:mb-16 lg:mb-20">
          {regions.map((region) => (
            <div
              key={region.code}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium text-white/90 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-colors"
            >
              {region.name}
            </div>
          ))}
        </div>

        {/* Stats grid - always 3 columns, scales with screen */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-12 lg:gap-16 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1 sm:space-y-2">
              <div 
                className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight gradient-text-light"
              >
                {stat.value}
              </div>
              <div className="text-xs sm:text-base md:text-lg lg:text-xl font-medium text-white/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

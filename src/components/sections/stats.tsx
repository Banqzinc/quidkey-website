export function StatsSection() {
  const regions = [
    'United States',
    'United Kingdom',
    'Europe',
    'Australia',
  ]

  const stats = [
    { value: '1%', label: 'Domestic Fees' },
    { value: '3%', label: 'Cross Border' },
    { value: '70%', label: 'Savings on Fees' },
  ]

  return (
    <section className="relative py-20 md:py-28 lg:py-32 bg-black overflow-hidden">
      {/* World map background */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1420px] max-w-[200%] translate-y-[45%] opacity-90"
        aria-hidden="true"
      >
        <img 
          src="/global-map.svg" 
          alt="" 
          className="w-full h-auto"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white text-center mb-10 leading-tight">
          Global Coverage. One Integration.
        </h2>

        {/* Region pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 md:mb-20">
          {regions.map((region) => (
            <div
              key={region}
              className="px-3 py-2 rounded text-lg md:text-xl font-medium text-white bg-white/25 backdrop-blur-[87px] border border-[#b49dff]"
            >
              {region}
            </div>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div 
                className="text-6xl sm:text-7xl lg:text-[80px] font-bold leading-none mb-3"
                style={{
                  background: 'linear-gradient(-90deg, #3a81ff 0%, #b49dff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </div>
              <div className="text-lg md:text-xl font-semibold text-white/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

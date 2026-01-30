export function StatsSection() {
  const stats = [
    { value: '1-3.5%', label: 'All-in fees (typical)' },
    { value: '3-6%', label: 'Card fees you can avoid' },
    { value: '10-20 hrs', label: 'Finance ops saved per month' },
    { value: 'US + EU + UK + AU', label: 'One integration, global coverage' },
  ]

  return (
    <section className="py-12 md:py-16 border-y border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

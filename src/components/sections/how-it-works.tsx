export function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Bank Prediction',
      description: 'Quidkey predicts and auto-selects customer bank for payment.',
      icon: '🔮',
    },
    {
      number: '2',
      title: 'Authorization',
      description: 'Customer authorizes payment via their bank app.',
      icon: '📱',
    },
    {
      number: '3',
      title: 'Complete',
      description: 'Payment is complete. Funds settle instantly.',
      icon: '✅',
    },
  ]

  return (
    <section id="how-it-works" className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to accept bank payments with intelligent prediction.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-border" />
              )}
              
              {/* Step content */}
              <div className="relative">
                {/* Icon */}
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-secondary mb-6 text-4xl">
                  {step.icon}
                </div>
                
                {/* Number badge */}
                <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

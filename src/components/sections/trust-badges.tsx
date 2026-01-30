const LOGO_DEV_TOKEN = 'pk_DsNHFndhT3yo-85c5vdKKg'

const partners = [
  { name: 'Tryp.com', domain: 'tryp.com' },
  { name: 'TransferMate', domain: 'transfermate.com' },
  { name: 'SKUTopia', domain: 'skutopia.com' },
  { name: 'Manière De Voir', domain: 'manieredevoir.com' },
]

const markets = [
  { label: 'United States', detail: 'ACH' },
  { label: 'United Kingdom', detail: 'FPS' },
  { label: 'Europe', detail: 'SEPA' },
  { label: 'Australia', detail: 'NPP' },
]

export function TrustBadgesSection() {
  return (
    <section className="py-8 md:py-12 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Trusted by global businesses. Built for US pay by bank.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {markets.map((market) => (
            <div
              key={market.label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-3 py-1 text-xs text-muted-foreground"
            >
              <span className="font-medium text-foreground/80">{market.label}</span>
              <span className="text-muted-foreground/70">{market.detail}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div key={partner.domain} className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity duration-200">
              <img
                src={`https://img.logo.dev/${partner.domain}?token=${LOGO_DEV_TOKEN}`}
                alt={`${partner.name} logo`}
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="text-sm font-medium text-muted-foreground">{partner.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity duration-200">
            <div className="h-6 w-6 bg-muted rounded flex items-center justify-center text-xs">🛡️</div>
            <span className="text-sm font-medium text-muted-foreground">SOC 2 Type II</span>
          </div>
        </div>
      </div>
    </section>
  )
}

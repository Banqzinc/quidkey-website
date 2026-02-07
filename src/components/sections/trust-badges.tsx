const LOGO_DEV_TOKEN = 'pk_DsNHFndhT3yo-85c5vdKKg'

const partners = [
  { name: 'Shopify', domain: 'shopify.com' },
  { name: 'WooCommerce', domain: 'woocommerce.com' },
  { name: 'Tryp.com', domain: 'tryp.com' },
  { name: 'TransferMate', domain: 'transfermate.com' },
  { name: 'SKUTopia', domain: 'skutopia.com' },
  { name: 'Manière De Voir', domain: 'manieredevoir.com' },
]

export function TrustBadgesSection() {
  return (
    <section className="py-8 md:py-12 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Trusted by global businesses. Built for US pay by bank.
        </p>

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
        </div>
      </div>
    </section>
  )
}

export function TrustBadgesSection() {
  return (
    <section className="py-8 md:py-12 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Trusted by businesses across Europe and beyond
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
          {/* Partner logos as text placeholders */}
          <div className="text-xl font-semibold text-muted-foreground">Tryp.com</div>
          <div className="text-xl font-semibold text-muted-foreground">TransferMate</div>
          <div className="text-xl font-semibold text-muted-foreground">SKUTopia</div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-muted rounded flex items-center justify-center text-xs">🛡️</div>
            <span className="text-sm font-medium text-muted-foreground">SOC 2 Type II</span>
          </div>
        </div>
      </div>
    </section>
  )
}

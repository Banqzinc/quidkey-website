// Loading-state skeleton for the lazy-loaded Treasury mockup. Shared by
// homepage `Products` section and `PartnerTreasury` so both pages render
// the same placeholder chrome while the mockup chunk loads.

export function TreasuryMockupSkeleton() {
  return (
    <div className="tm2 tm2--loading" aria-busy="true">
      <div className="tm2__chrome">
        <div className="tm2__chrome-l">
          <span className="tm2__chrome-dot" />
          <span className="tm2__chrome-dot" />
          <span className="tm2__chrome-dot" />
        </div>
        <div className="tm2__chrome-path">treasury · acme studios</div>
      </div>
      <div className="tm2__body" />
    </div>
  )
}

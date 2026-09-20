// Options are rows and criteria are columns, so on a phone each option folds
// into its own card with labelled cells and the table stays one element.
const CRITERIA = ['Protection', 'Funds', 'Buyer setup', 'Cost'] as const

type Option = {
  name: string
  highlight?: boolean
  cells: Record<(typeof CRITERIA)[number], string>
}

const OPTIONS: Option[] = [
  {
    name: 'Direct wire',
    cells: {
      Protection: 'None',
      Funds: 'With the seller immediately',
      'Buyer setup': 'None',
      Cost: 'Bank fees plus FX spread, typically 2% or more',
    },
  },
  {
    name: 'Third-party escrow',
    cells: {
      Protection: 'Yes',
      Funds: 'Held by the escrow agent',
      'Buyer setup': 'Account and KYB',
      Cost: 'Typically 1% to 3%, plus acquiring where cards are used',
    },
  },
  {
    name: 'Protected Pay',
    highlight: true,
    cells: {
      Protection: 'Yes',
      Funds: 'In the seller’s own account, restricted',
      'Buyer setup': 'None',
      Cost: 'About 1% all-in',
    },
  },
]

export function MarketplaceCompared() {
  return (
    <section className="section mkt-cmp mkt-section--white">
      <div className="container">
        <span className="section__eyebrow">Compared</span>
        <h2 className="section__h mkt-h">How Protected Pay compares.</h2>

        <table className="mkt-cmp__table">
          <colgroup>
            <col className="mkt-cmp__col-name" />
            <col className="mkt-cmp__col-protection" />
            <col className="mkt-cmp__col-funds" />
            <col className="mkt-cmp__col-setup" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Option</span>
              </th>
              {CRITERIA.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {OPTIONS.map((opt) => (
              <tr key={opt.name} className={opt.highlight ? 'is-highlight' : undefined}>
                <th scope="row">{opt.name}</th>
                {CRITERIA.map((c) => (
                  <td key={c} data-label={c}>
                    {opt.cells[c]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

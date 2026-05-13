// Customer/partner logo marquee. Only the `customers` variant is rendered by
// the homepage today; the merchants/fintechs variants from the prototype are
// not used in the App() composition and have been intentionally dropped to
// keep the bundle focused. They can be re-added if they're ever needed.

import type { ReactElement } from 'react'

const LOGO_DEV_TOKEN = 'pk_DsNHFndhT3yo-85c5vdKKg'

type LogoItem = {
  name: string
  domain?: string
  imgUrl?: string
  svg?: ReactElement
  placeholder?: boolean
}

const VisaSvg = (
  <svg
    viewBox="0 0 1336 430"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Visa"
  >
    <path
      fill="currentColor"
      d="M507.369 7.60031L332.588 423.495H218.557L132.547 91.592C127.325 71.1489 122.785 63.6595 106.904 55.0468C80.9894 41.0181 38.172 27.8632 0.5 19.6942L3.05875 7.60031H186.614C210.012 7.60031 231.045 23.1338 236.357 50.0053L281.782 290.663L394.047 7.60031H507.369ZM954.17 287.709C954.629 177.942 801.98 171.895 803.03 122.86C803.356 107.937 817.603 92.0705 848.788 88.0207C864.245 86.0028 906.833 84.4633 955.136 106.633L974.083 18.4391C948.127 9.0427 914.732 0 873.18 0C766.554 0 691.515 56.5308 690.883 137.478C690.194 197.351 744.443 230.762 785.313 250.658C827.359 271.031 841.466 284.124 841.307 302.348C841.008 330.246 807.772 342.562 776.712 343.047C722.492 343.879 691.029 328.415 665.949 316.786L646.397 407.899C671.602 419.432 718.125 429.494 766.359 430C879.688 430 953.822 374.17 954.17 287.709ZM1235.73 423.502H1335.5L1248.41 7.60031H1156.32C1135.62 7.60031 1118.15 19.6249 1110.42 38.1125L948.545 423.495H1061.82L1084.31 361.368H1222.71L1235.74 423.495L1235.73 423.502ZM1115.36 276.135L1172.14 119.982L1204.82 276.135H1115.37H1115.36ZM661.506 7.60031L572.304 423.495H464.433L553.67 7.60031H661.506Z"
    />
  </svg>
)

const CUSTOMER_ITEMS: LogoItem[] = [
  {
    name: 'SKUTopia',
    imgUrl:
      'https://cdn.prod.website-files.com/634e978ddcd60909a96337dd/636ce260b0c59e96c8f007c7_Skutopia%20Logo.svg',
  },
  {
    name: 'TransferMate',
    imgUrl:
      'https://cdn.prod.website-files.com/641b1c191794fb3d99c5f72b/64b76d77b44da70d86866237_tm_logo_colour.svg',
  },
  {
    name: 'Grace & Co',
    imgUrl: 'https://www.graceandcojewellery.co.uk/cdn/shop/files/G_C-logo.png?v=1736438163&width=500',
  },
  // Tryp logo lives in the prototype bundle. Asset audit (step 10) copies it to /homepage/.
  { name: 'Tryp.com', imgUrl: '/homepage/tryp-logo.svg' },
  { name: 'Visa', svg: VisaSvg },
  {
    name: 'FumoPay',
    imgUrl:
      'https://static.wixstatic.com/media/260927_6f872b165b784696b15192fadebc5d8a~mv2.png/v1/crop/x_438,y_983,w_1525,h_434/fill/w_240,h_68,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design%20(22).png',
  },
  { name: 'Shopify', imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' },
  {
    name: 'NetSuite',
    imgUrl: 'https://system.netsuite.com/authentication/ui/loginpage/assets/logo/NetSuite-logo-mobius.svg',
  },
  {
    name: 'QuickBooks',
    imgUrl: 'https://plugin.intuitcdn.net/one-intuit-help-hub-conf/1.212.1/assets/component/navbar/assets/qbo-icon.svg',
  },
]

function LogoMark({ item }: { item: LogoItem }) {
  if (item.svg) {
    return (
      <div className="logos__item logos__item--customer logos__item--svg">
        <span className="logos__svg" aria-hidden="true">
          {item.svg}
        </span>
        <span className="logos__sr">{item.name}</span>
      </div>
    )
  }
  if (item.imgUrl) {
    return (
      <div className="logos__item logos__item--customer logos__item--imgurl">
        <img src={item.imgUrl} alt={`${item.name} logo`} className="logos__img-mark" width="80" height="22" />
        <span className="logos__sr">{item.name}</span>
      </div>
    )
  }
  if (item.placeholder || !item.domain) {
    return (
      <div className="logos__item logos__item--ph" title="Customer logo coming soon">
        <span className="logos__ph-mark" aria-hidden="true">
          ◇
        </span>
        <span>{item.name}</span>
      </div>
    )
  }
  return (
    <div className="logos__item logos__item--customer">
      <img src={`https://img.logo.dev/${item.domain}?token=${LOGO_DEV_TOKEN}`} alt={`${item.name} logo`} width="18" height="18" />
      <span>{item.name}</span>
    </div>
  )
}

function Marquee({ items, ariaLabel }: { items: LogoItem[]; ariaLabel: string }) {
  // Duplicate the list so the CSS animation can loop seamlessly.
  return (
    <div className="marquee" aria-label={ariaLabel} role="group">
      <div className="marquee__track">
        {[0, 1].map((dup) => (
          <div key={dup} className="marquee__row" aria-hidden={dup === 1 ? 'true' : undefined}>
            {items.map((item, i) => (
              <LogoMark key={`${dup}-${item.name}-${i}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Logos() {
  return (
    <section className="logos trust-strip">
      <div className="container">
        <div className="trust__head">
          <p className="trust__lead">Trusted by merchants. Powered by partners.</p>
        </div>
        <Marquee items={CUSTOMER_ITEMS} ariaLabel="Integrations, platforms, and customers" />
      </div>
    </section>
  )
}

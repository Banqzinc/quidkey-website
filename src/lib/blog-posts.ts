export type BlogPostBlock =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ul'; items: string[] }

export type BlogPost = {
  slug: string
  /** Display date (e.g., "December 12, 2025") */
  date: string
  /** ISO 8601 date for structured data (e.g., "2025-12-12") */
  dateISO: string
  /** Full title for the page */
  title: string
  /** SEO-optimized title (50-60 chars, keyword first) - used in <title> tag */
  seoTitle: string
  /** Meta description (150-160 chars) */
  description: string
  /** Primary keyword for this article */
  keyword: string
  /** Author name */
  author: string
  blocks: BlogPostBlock[]
  featured?: boolean
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'quidkey-achieves-soc-2-type-ii-compliance-strengthening-security-for-global-payments',
    date: 'December 12, 2025',
    dateISO: '2025-12-12',
    title: 'Quidkey Achieves SOC 2 Type II Compliance, Strengthening Security for Global Payments',
    seoTitle: 'SOC 2 Type II Compliance for Global Payments | Quidkey',
    description:
      'Quidkey completes SOC 2 Type II audit by Sensiba LLP, validating enterprise-grade security for API-driven global payments infrastructure.',
    keyword: 'SOC 2 Type II compliance',
    author: 'Quidkey Team',
    featured: true,
    blocks: [
      {
        type: 'p',
        text: 'December 12, 2025 — Bnqz Inc. (Quidkey), a leading provider of API-driven global payments infrastructure, proudly announces the successful completion of its SOC 2® Type II audit by Sensiba LLP, a leading provider of audit and accounting services.',
      },
      {
        type: 'p',
        text: "This milestone confirms Quidkey's adherence to the American Institute of Certified Public Accountants (AICPA)'s rigorous standards for security, availability, and confidentiality, reinforcing the strength and reliability of our infrastructure for partners and merchants worldwide.",
      },
      {
        type: 'p',
        text: 'The SOC 2 Type II report evaluates not just the design of internal controls and systems, but also their operating effectiveness over a specified review period. It is a widely recognized benchmark for demonstrating that a company maintains robust security practices.',
      },
      {
        type: 'p',
        text: "Quidkey's infrastructure underwent deep scrutiny of processes, systems, and practices, proving robust protection for customer data in a high-stakes payments landscape.",
      },
      {
        type: 'p',
        text: '"Security and trust are foundational to our relationship with customers," said Rabea Bader, CTO of Quidkey. "Successfully completing this audit underscores our commitment to protecting sensitive data and maintaining the highest operational standards as we scale globally."',
      },
      { type: 'h2', text: 'Key Audit Highlights' },
      {
        type: 'p',
        text: 'The comprehensive review validated critical controls, including:',
      },
      {
        type: 'ul',
        items: [
          'Secure data storage and encrypted transmission',
          'Advanced access controls and multi-factor authentication',
          'Real-time system monitoring with swift incident response',
          'Proactive vendor risk management',
          'Resilient business continuity and disaster recovery plans',
        ],
      },
      {
        type: 'p',
        text: 'These strengths position Quidkey as a trusted partner for enterprises and developers who prioritize data integrity and regulatory readiness.',
      },
      { type: 'h2', text: 'For Partners' },
      {
        type: 'p',
        text: 'Enterprises seeking the full SOC 2 Type II report can request secure access via legal@quidkey.com.',
      },
      { type: 'h2', text: 'About Quidkey' },
      {
        type: 'p',
        text: 'Quidkey acts as business-facing clearing abstraction layer, enabling borderless payment solutions that drive personalisation, boost conversion, enhance security, and build on existing customer-bank trust.',
      },
    ],
  },
  {
    slug: 'quidkey-a-global-clearing-house-for-modern-payments',
    date: 'December 8, 2025',
    dateISO: '2025-12-08',
    title: 'Quidkey: A Global Clearing House for Modern Payments',
    seoTitle: 'Global Clearing House for A2A Payments | Quidkey',
    description:
      'COO Bhavna Saraf explains how Quidkey uses APIs and AI to transform open banking into merchant-ready A2A payment solutions.',
    keyword: 'global clearing house',
    author: 'Bhavna Saraf',
    blocks: [
      {
        type: 'p',
        text: "Founded in early 2023, Quidkey has quickly established itself as a trusted provider of next-generation Account-to-account (A2A) payments. Also known as 'Pay by bank'. Leveraging AI-powered bank prediction, instant settlement, and a streamlined user experience, Quidkey is redefining how global businesses collect payments.",
      },
      {
        type: 'p',
        text: "Chief Operating Officer Bhavna Saraf met CEO Rob Zeko and CTO Rabea Bader, Quidkey's co-founders, at the end of her time with Santander. They were pitching Quidkey's offering to top bank executives. The idea was simple but powerful:",
      },
      {
        type: 'ul',
        items: [
          'Democratising access to bank products amongst its customers through a single channel',
          'Leveraging and monetising its API stack for payments',
          'Providing value add services making open banking usable for businesses',
        ],
      },
      {
        type: 'p',
        text: '"I remember thinking it wasn\'t a standard FinTech pitch," recalls Bhavna. "It was a real infrastructure story that was additive and complimentary to all ecommerce ecosystem players, merchants, banks, PSPs."',
      },
      {
        type: 'p',
        text: 'Rob believes A2A payments are the future of commerce, and merchants deserve simpler, faster and fairer ways to get paid. "We\'ve built a model designed to scale responsibly," he notes. "Bhavna brings the operational layer we need to go global."',
      },
      {
        type: 'p',
        text: "Rabea is responsible for technology and product at Quidkey. With a seasoned background in technology, he has developed the core engine driving Quidkey's diverse solutions. These include bank-prediction, instant settlement, and unified multi-provider orchestration.",
      },
      {
        type: 'p',
        text: '"Our aim is to make the technology invisible," Rabea explains. "If it feels effortless for merchants, it means we\'ve done the hard work well."',
      },
      {
        type: 'p',
        text: "Together, Rob and Rabea laid the foundation. Bhavna's arrival added the operational layer needed to take Quidkey global.",
      },
      { type: 'h3', text: 'Tell us about your approach to leadership at Quidkey…' },
      {
        type: 'p',
        text: "Learning has always meant leaning into the unknown. It's not just about a strategy, but a mindset. Taking on new business lines, exploring unfamiliar customer segments, getting closer to technology, or entering new geographies have all been opportunities to stretch.",
      },
      {
        type: 'p',
        text: "It's the same mindset that underpins my approach to leadership. That it's not just about hierarchy but influence. Creating an environment where people feel trusted, empowered, and part of something larger than themselves.",
      },
      { type: 'h3', text: 'What drives and inspires you?' },
      {
        type: 'p',
        text: 'At the core of my journey is a relentless drive to deliver progress. Time is money. And… Impossible is nothing. Those words capture my pragmatism and optimism. Qualities that have guided me from scaling large enterprises to now building a nimble fintech.',
      },
      { type: 'h3', text: 'Tell us about the genesis of Quidkey and its mission…' },
      {
        type: 'p',
        text: 'Quidkey was born from a simple idea, that merchants should be able to grow with confidence, scale sustainably, and offer customers a seamless payment experience, at home or abroad.',
      },
      {
        type: 'p',
        text: 'For too long, fragmented rails and card scheme costs have added friction to the payment ecosystem, especially hurting SMBs. Quidkey changes that. Our payment solution requires no change to the checkout experience, leverages existing customer-bank trust, and provides real-time settlement.',
      },
      {
        type: 'p',
        text: 'By cutting out unnecessary intermediaries and using Open Banking rails, Quidkey delivers faster, more transparent and cost-efficient payments, empowering merchants to grow and helping banks realise greater value from their infrastructure investments.',
      },
      { type: 'h3', text: 'What industry challenges can Quidkey solve?' },
      {
        type: 'p',
        text: 'Payments today are still more complicated than they need to be. Merchants face high fees, chargebacks, and slow settlements, while banks and PSPs struggle to turn their Open Banking investments into meaningful revenue.',
      },
      {
        type: 'p',
        text: 'Quidkey bridges that gap. By simplifying how money moves between banks, fintechs, and merchants, we make payments faster, cheaper and transparent. The outcome is better liquidity and smoother experiences for everyone.',
      },
      { type: 'h3', text: "What benefits are your clients experiencing from Quidkey's approach to open banking?" },
      {
        type: 'p',
        text: 'Open banking adoption is accelerating fast. There are already more than 15 million UK consumers and small businesses taking advantage of open banking-powered services, generating two billion transactions just last year.',
      },
      {
        type: 'p',
        text: 'Quidkey is at the centre of this evolution, turning Open Banking into measurable value through intelligent settlements, stronger customer loyalty, and real returns on investment.',
      },
      { type: 'h3', text: 'How easy is it for merchants to deploy Quidkey?' },
      {
        type: 'p',
        text: 'Quidkey offers easy integrations via Shopify plug-in, WooCommerce, or iFrame with set up in minutes… No code and zero impact to existing payment options – just faster payments that generate capital to grow your business.',
      },
      {
        type: 'p',
        text: "With fair fees and no lock-ins, Quidkey's daily settlement can cut costs and optimise cash flow with product bundles designed for growth. Additionally, Quidkey delivers an Apple Pay–style one-tap experience, using AI to predict a user's bank and streamline checkout.",
      },
      { type: 'h2', text: 'About Quidkey' },
      {
        type: 'p',
        text: 'Quidkey is a cross-border payments technology company enabling merchants to accept instant account-to-account payments across the UK, EU, and US. By operating alongside existing PSPs rather than replacing them, Quidkey makes it easy for businesses to offer bank-direct payment options with minimal integration effort.',
      },
    ],
  },
  {
    slug: 'quidkey-announces-strategic-partnership-with-tryp-com-to-power-next-generation-pay-by-bank-travel-payments',
    date: 'October 29, 2025',
    dateISO: '2025-10-29',
    title: 'Quidkey Announces Strategic Partnership with Tryp.com to Power Next-Generation "Pay by Bank" Travel Payments',
    seoTitle: 'Quidkey Partners with Tryp.com for Pay by Bank Travel Payments',
    description:
      'Quidkey and Tryp.com partner to deliver instant settlement and 3x lower payment costs for travel bookings using Pay by Bank.',
    keyword: 'pay by bank travel payments',
    author: 'Quidkey Team',
    blocks: [
      {
        type: 'p',
        text: "London, UK — 10.29.25 — Quidkey, the fast-growing cross-border payments technology provider, today announced a strategic partnership with Tryp.com, one of Europe's fastest-growing OTAs, to integrate its Pay by Bank solution.",
      },
      {
        type: 'p',
        text: 'Quidkey operates alongside existing PSPs like Stripe, giving merchants a modern, bank-direct payment method without replacing existing infrastructure. Through a one-click integration available on Shopify, WooCommerce, and via iFrame or API, Quidkey enables seamless, high-converting checkout experiences.',
      },
      {
        type: 'p',
        text: 'Tryp.com is included in a select group of merchants that Quidkey has brought live across the UK, EU, and US, and early results have exceeded expectations.',
      },
      {
        type: 'p',
        text: '"We were incredibly impressed by the Quidkey team\'s speed. We pitched a custom rewards program — allowing our users to earn Tryp.com coins by using Quidkey — and they immediately grasped the vision and built it quickly," said Bruno Rangel, CEO of Tryp.com.',
      },
      {
        type: 'p',
        text: "Tryp.com reports that Quidkey's Pay by Bank solution is more than 3x more cost-effective than traditional payment methods, enabling the OTA to reinvest savings into its user base.",
      },
      {
        type: 'p',
        text: '"The significantly faster settlement times are a game-changer. It dramatically improves our cash flow as we scale, giving us more flexibility to grow our platform," Rangel added.',
      },
      { type: 'h2', text: 'A More Intelligent "Pay by Bank" Experience' },
      {
        type: 'p',
        text: "Unlike traditional A2A providers that require multiple redirects and bank searches, Quidkey uses an AI-powered bank prediction layer that surfaces the customer's bank instantly — resulting in a consumer experience on par with Apple Pay.",
      },
      {
        type: 'p',
        text: '"Merchants shouldn\'t have to choose between better conversion or lower cost. With Tryp.com, we\'re proving that a modern A2A experience can be faster than cards, cheaper than cards, and better aligned with how consumers already pay," said Rob Zeko, CEO of Quidkey.',
      },
      { type: 'h2', text: 'About Quidkey' },
      {
        type: 'p',
        text: 'Quidkey is a cross-border payments technology company enabling merchants to accept instant account-to-account payments across the UK, EU, and US. By operating alongside existing PSPs rather than replacing them, Quidkey makes it easy for businesses to offer bank-direct payment options with minimal integration effort.',
      },
      { type: 'h2', text: 'About Tryp.com' },
      {
        type: 'p',
        text: 'Tryp.com is a next-generation online travel agency helping a global audience discover and book multi-destination travel experiences. With a fast-growing Millennial and Gen Z customer base, Tryp.com delivers curated itineraries, flexible bookings, and a seamless mobile-first experience.',
      },
    ],
  },
  {
    slug: 'refunds-rewards-and-real-time-settlement-unlocking-merchant-payments',
    date: 'October 26, 2025',
    dateISO: '2025-10-26',
    title: 'Refunds, Rewards, and Real-Time Settlement: Unlocking Merchant Payments',
    seoTitle: 'Real-Time Settlement and Instant Refunds for Merchants | Quidkey',
    description:
      'Learn how Open Banking enables real-time settlement, seamless refunds, and loyalty rewards to improve merchant cash flow by 15-30%.',
    keyword: 'real-time settlement',
    author: 'Quidkey Team',
    blocks: [
      {
        type: 'p',
        text: "The payments landscape is changing rapidly. For merchants, it's not enough to just accept payments; the real value comes from what happens after the transaction.",
      },
      {
        type: 'p',
        text: 'If you are a CFO managing profitability, a COO managing costs, an e-commerce manager or in marketing building customer engagement, staying on top of all those expectations, whilst no mean feat in the current landscape, is now fully achievable.',
      },
      {
        type: 'p',
        text: "At Quidkey, we're making it easier for merchants to use Open Banking-powered payments that are seamless, predictable, rewarding and help businesses grow with confidence.",
      },
      { type: 'h2', text: 'The Hidden Cost of Refunds' },
      {
        type: 'p',
        text: 'Refunds and returns have become a major challenge for merchant profitability. E-commerce returns rates average between 15% and 30%. This issue directly impacts margins. Each return can cost a merchant between $15 to $20 in processing, restocking, and lost value.',
      },
      {
        type: 'p',
        text: 'In addition to operational costs, fraud and abuse worsen the situation. Retailers incur losses exceeding US $103 billion on an annual basis due to fraudulent refund requests, which constitute approximately 13.7% of all returns.',
      },
      { type: 'h2', text: 'Why Real-Time Settlement Matters' },
      {
        type: 'p',
        text: "Even when a sale isn't returned, merchants often wait one to five business days for funds to clear in their accounts. During this time, goods are shipped, suppliers are paid, or partial refunds are issued — all while cash remains tied up elsewhere.",
      },
      {
        type: 'p',
        text: 'In contrast, merchants using real-time settlement see 15% to 30% improvements in cash flow management, enhancing their operational agility and resilience. It allows merchants to access revenue as soon as transactions complete, reducing working capital needs and accelerating reinvestment.',
      },
      { type: 'h2', text: 'The Role of Rewards in Merchant Value' },
      {
        type: 'p',
        text: 'Rewards and loyalty programs add another important layer of value after a purchase. Research shows that loyalty members generate 12% to 18% more revenue annually compared to non-members, while 70% of customers say they are more likely to recommend brands with strong loyalty programs.',
      },
      {
        type: 'p',
        text: 'When coupled with instantaneous settlement, rewards transform into a powerhouse of effectiveness.',
      },
      {
        type: 'p',
        text: 'The rapid access to capital enables merchants to rejuvenate their connections with their customers, offering instant cashback, store credits, or rewards that cultivate trust and encourage recurring purchases.',
      },
      { type: 'h2', text: "Quidkey's Approach to Simplifying Merchant Adoption" },
      {
        type: 'p',
        text: "At Quidkey, we're creating a bank-branded checkout system powered by Open Banking that combines refunds, rewards, and real-time settlement bringing together cash flow, trust, and convenience.",
      },
      {
        type: 'p',
        text: 'Our solution is simple to use, scalable, and secure. Merchants can easily integrate through Shopify plugin, WooCommerce, or iFrame, enjoying competitive and clear pricing with instant settlements that optimise cash flow.',
      },
      {
        type: 'p',
        text: "By eliminating complexity from the payment process, Quidkey enables merchants to offer frictionless payment experiences - without any concessions. The trajectory of merchant payments is not solely changing; it is evolving to be smarter, faster, and more merchant-friendly.",
      },
      {
        type: 'p',
        text: "At Quidkey, we're collaborating with banks, payment service providers, and e-commerce platforms to turn this vision into reality. We're simplifying merchant adoption and raising the bar for excellence in the payments sector.",
      },
      {
        type: 'p',
        text: 'Borderless. Bank-powered. Real-time.',
      },
    ],
  },
  {
    slug: 'quidkey-and-transfermate-drive-down-card-costs-for-merchants',
    date: 'October 14, 2025',
    dateISO: '2025-10-14',
    title: 'Quidkey and TransferMate Drive Down Card Costs for Merchants',
    seoTitle: 'Reduce Card Payment Costs with A2A Payments | Quidkey',
    description:
      'Quidkey partners with TransferMate to offer merchants a faster, cheaper alternative to card payments using global A2A infrastructure.',
    keyword: 'reduce card costs',
    author: 'Quidkey Team',
    blocks: [
      {
        type: 'p',
        text: "October 14, 2025: Quidkey, a leading fintech in account-to-account (A2A) payments, has chosen TransferMate, the world's leading provider of embedded B2B payments infrastructure as a service (IaaS) to power global A2A payments for e-commerce merchants. The collaboration unlocks a faster, cheaper alternative to traditional card payments for merchants operating across the UK, EU, and US.",
      },
      {
        type: 'p',
        text: "Through this embedded solution, both companies will harness Open Banking technology to replace costly card rails with a faster, more efficient model of payments. TransferMate's global network of payment licenses and banking integrations will allow Quidkey to extend its cross-border payments capabilities to merchants worldwide.",
      },
      {
        type: 'p',
        text: 'Founded in early 2023, Quidkey has quickly established itself as a trusted provider of next-generation A2A payments. Leveraging AI-powered bank prediction, instant settlement, and a streamlined user experience, Quidkey is redefining how global businesses collect payments.',
      },
      {
        type: 'p',
        text: '"Partnering with TransferMate gives our merchants a truly global reach. Their infrastructure and regulatory footprint mean we can offer seamless, low-cost cross-border payments without compromise," said Rob Zeko, Co-Founder & CEO of Quidkey.',
      },
      {
        type: 'p',
        text: 'For merchants, the solution means a reduced dependency on expensive credit card processing, faster settlement cycles, and the ability to expand into new regions with confidence. For consumers, it means a smoother, faster checkout experience without the friction of traditional payment methods.',
      },
      {
        type: 'p',
        text: '"We\'re excited to power Quidkey\'s global expansion. Together, we\'re giving merchants a modern payment rail that reduces costs and accelerates cash flow — essential ingredients for growth in today\'s e-commerce landscape," said Gary Conroy, CEO of TransferMate.',
      },
      {
        type: 'p',
        text: "The Open Banking market is forecast to grow from $35 billion in 2025 to $94 billion by 2029 and $180 billion by 2032. With Quidkey's next-gen payments innovation and TransferMate's largest fintech payments network, the partnership is poised to capture significant share of this rapidly expanding market.",
      },
      { type: 'h2', text: 'About TransferMate' },
      {
        type: 'p',
        text: "TransferMate is a leading provider of embedded B2B payments technology, helping companies, software providers & financial institutions to streamline their global receivables, payments, & local account management processes. TransferMate's innovative technology platform simplifies business-to-business and consumer payments for clients in more than 200 countries.",
      },
      { type: 'h2', text: 'About Quidkey' },
      {
        type: 'p',
        text: 'Quidkey is on a mission to become the merchant-facing clearing abstraction layer, enabling borderless A2A checkouts that drive personalisation, boost conversion, enhance security, and build on existing customer-bank trust.',
      },
      {
        type: 'p',
        text: 'Our approach creates value across the ecosystem:',
      },
      {
        type: 'ul',
        items: [
          'Consumers enjoy frictionless, bank-authenticated payments with protections.',
          'Merchants save on processing costs, increase conversions, and reduce fraud/chargebacks.',
          'Banks strengthen customer primacy and democratise access to their products at checkout.',
        ],
      },
    ],
  },
  {
    slug: 'pay-by-bank-the-future-of-payments',
    date: 'October 8, 2025',
    dateISO: '2025-10-08',
    title: 'Pay by Bank: The Future of Payments',
    seoTitle: 'Pay by Bank Explained: Lower Fees, No Chargebacks | Quidkey',
    description:
      'Pay by Bank lets customers pay directly from their bank. Lower fees, instant settlement, no chargebacks. Learn how it works globally.',
    keyword: 'pay by bank',
    author: 'Quidkey Team',
    blocks: [
      { type: 'h2', text: 'What is Pay by Bank?' },
      {
        type: 'p',
        text: "Pay by Bank is a fast and secure way for customers to pay directly from their bank account at checkout. Instead of entering card details, the customer selects their bank, approves the payment in their banking app, and the funds are transferred instantly. No card networks. No intermediaries. Just a direct, secure payment.",
      },
      {
        type: 'p',
        text: 'In the United Kingdom, Pay by Bank is powered by Open Banking and the Faster Payments network. Across Europe, it runs on SEPA/Instant SEPA, and similar systems are now emerging worldwide, including PIX in Brazil, UPI in India, and FedNow in the United States.',
      },
      { type: 'h3', text: 'How Pay by Bank Works' },
      {
        type: 'ul',
        items: [
          'Customer selects Pay by Bank at checkout',
          'They choose their bank from a list',
          'They are redirected to their banking app with the payment details pre-filled',
          'The customer approves the payment using Strong Customer Authentication (SCA) through biometrics or secure login',
          'Funds are transferred directly to the merchant',
        ],
      },
      {
        type: 'p',
        text: 'No card numbers. No intermediaries. No risk of stolen details.',
      },
      { type: 'h3', text: 'Why Merchants Should Care' },
      {
        type: 'p',
        text: 'For businesses, Pay by Bank is not just another payment option. It is a way to solve some of the biggest challenges in online commerce:',
      },
      {
        type: 'ul',
        items: [
          'Lower fees: no card networks or interchange costs.',
          'Instant settlement: funds land in your account usually within seconds, improving cash flow.',
          'Reduced fraud and no chargebacks in most markets: every payment is authenticated by the customer\'s own bank using Strong Customer Authentication (SCA).',
          'Higher conversion: customers already trust their bank, making them more likely to complete checkout.',
        ],
      },
      { type: 'h3', text: 'Payment Rails Behind Pay by Bank Around the World' },
      {
        type: 'p',
        text: 'While the United Kingdom has led adoption, Pay by Bank is expanding rapidly across global markets:',
      },
      {
        type: 'ul',
        items: [
          'United Kingdom: Faster Payments.',
          'EU: SEPA and SEPA Instant payments.',
          'Brazil: PIX is now the dominant payment method.',
          'US: ACH, FedNow and RTP.',
          'Australia: New Payments Platform (NPP).',
          'India: UPI, processing billions of instant transactions each month.',
        ],
      },
      {
        type: 'p',
        text: 'Merchants everywhere are embracing Pay by Bank for its lower costs and stronger security. The challenge is that most of these systems are designed for domestic payments, and using them across borders remains fragmented and expensive.',
      },
      { type: 'h2', text: 'How Quidkey Makes Pay by Bank Better' },
      {
        type: 'p',
        text: 'Pay by Bank is powerful but fragmented. Each country runs its own rail and most providers only connect to a limited set of them. For merchants, this creates unnecessary complexity.',
      },
      {
        type: 'p',
        text: 'Quidkey solves this with one integration and global reach. Our platform connects to multiple providers and networks across markets, and Quidkey orchestrates the best route for every transaction.',
      },
      {
        type: 'p',
        text: 'Here is how Quidkey makes Pay by Bank work for merchants:',
      },
      {
        type: 'ul',
        items: [
          "Bank prediction at checkout: automatically detects and displays the customer's bank as the first payment option to reduce friction and increase conversion.",
          'Cross-border and FX: built-in multi-currency support with seamless international settlement.',
          'Refunds: simple one-click refunds, just like card payments.',
          'Plug-and-play integrations: iFrame, Shopify, WooCommerce, Magento, iOS SDK, Android SDK, and API.',
          'Faster go-live: start accepting payments in minutes without heavy development work.',
        ],
      },
      {
        type: 'p',
        text: 'Quidkey is available to merchants in more than 90 jurisdictions, enabling sales into the UK, EU, US, and Australia.',
      },
      { type: 'h2', text: 'Conclusion' },
      {
        type: 'p',
        text: 'Pay by Bank is more than a buzzword. It is a smarter, safer, and cheaper way for merchants to get paid. The model is already live in the United Kingdom and is rapidly expanding worldwide.',
      },
      {
        type: 'p',
        text: 'With Quidkey, you can enable Pay by Bank through a single integration, reduce your costs, eliminate fraud and chargebacks, and unlock a global payment solution built for merchants.',
      },
    ],
  },
  {
    slug: 'open-banking-payments-in-the-uk',
    date: 'September 10, 2025',
    dateISO: '2025-09-10',
    title: 'Open Banking Payments in the UK',
    seoTitle: 'Open Banking Payments UK: How to Accept Bank Payments | Quidkey',
    description:
      'Accept Open Banking payments in the UK with instant settlement, no chargebacks, and lower fees. Complete guide for UK merchants.',
    keyword: 'open banking payments UK',
    author: 'Quidkey Team',
    blocks: [
      { type: 'h2', text: 'What is Open Banking in the UK?' },
      {
        type: 'p',
        text: 'Open banking is a regulatory and technological framework that allows consumers and businesses in the United Kingdom (UK) and European Union (EU) to securely connect their bank accounts and share their financial data with authorised third-party providers. These providers can:',
      },
      {
        type: 'ul',
        items: [
          "Initiate payments on the user's behalf: These are called Payment Initiation Service Providers, or PISPs.",
          'Access and collect account information: These are known as Account Information Service Providers, or AISPs.',
        ],
      },
      {
        type: 'p',
        text: 'To ensure improved consumer protection and lower fraud rates, the open banking framework also requires heightened security standards to manage consumer authentication and protect consumer data.',
      },
      {
        type: 'p',
        text: 'To make this secure and scalable, UK regulators required all major banks to implement standardised APIs. These APIs allow licensed developers to build services on top of bank infrastructure without compromising security or privacy.',
      },
      { type: 'h2', text: 'Open Banking in the United Kingdom: From Regulation to Real-World Adoption' },
      {
        type: 'p',
        text: 'Open banking started as a regulatory initiative under the European PSD2 directive, with the goal of increasing competition, transparency, and innovation in financial services. In the UK, it was driven forward by the Competition and Markets Authority (CMA).',
      },
      {
        type: 'p',
        text: 'Today, open banking is no longer experimental. In the UK alone, over 15 million users rely on open banking services every month, and the infrastructure is subject to oversight and control from the Financial Conduct Authority (FCA).',
      },
      { type: 'h2', text: 'Open Banking Use Cases' },
      {
        type: 'p',
        text: 'Open banking is already powering a range of useful services across the UK and the EU. Here are a few common examples:',
      },
      {
        type: 'ul',
        items: [
          'Payment Initiation: Users can bypass card networks and pay directly from their bank accounts. This includes retail options like Pay by Bank at checkout.',
          'Account aggregation, personal finance tools and budgeting apps: Apps like Emma, Moneyhub, and Snoop use open banking to show users all their bank accounts in one place.',
          'Credit Underwriting: Lenders can use open banking to provide faster lending and credit checks.',
          'Small business accounting tools: Platforms like Xero and QuickBooks can automatically pull in bank transactions to simplify bookkeeping.',
          'Subscription and payment management: Some services help users find and manage their subscriptions or recurring payments.',
        ],
      },
      { type: 'h2', text: 'Benefits of Open Banking for UK businesses and consumers' },
      { type: 'h3', text: 'For Merchants' },
      {
        type: 'ul',
        items: [
          'Instant settlement: Payments clear in seconds via Faster Payments, helping improve float and cash flow.',
          'No chargebacks or card fraud: Payments are authenticated by the customer\'s bank, removing fraud risk and related disputes.',
          'Lower fees: By bypassing card networks and intermediaries, businesses can reduce processing costs.',
        ],
      },
      { type: 'h3', text: 'For Customers' },
      {
        type: 'ul',
        items: [
          'Stronger protection against fraud: Every payment requires secure bank authentication. No card numbers means nothing to steal.',
          'Faster checkout: Customers approve payments directly in their banking app, often with biometrics.',
          'Real time control and visibility: Payments are authorised through the customer\'s own bank, with instant confirmation.',
        ],
      },
      { type: 'h2', text: 'How Open Banking Payments Work in the UK' },
      {
        type: 'p',
        text: "If you are a UK business looking to accept open banking payments, the process can be time consuming and complex. Here's what most businesses face:",
      },
      {
        type: 'ul',
        items: [
          'Work with a licensed open banking provider: These are regulated third party providers (TPPs) that connect your business to customer bank accounts.',
          'Build an integration: Implementing open banking directly usually requires development resources.',
          'You handle compliance and user experience: You need to ensure your solution meets payment regulations and supports Strong Customer Authentication.',
        ],
      },
      { type: 'h3', text: 'Open Banking Payment Flow in the UK' },
      {
        type: 'ul',
        items: [
          'Customer selects Pay by Bank at checkout and chooses their bank from a list',
          'They are redirected to their bank app or online banking with transaction details pre-filled',
          'The customer completes Strong Customer Authentication (SCA) using biometrics or two factor login',
          'Payment is approved and funds are transferred directly to the merchant via Faster Payments',
          'Customer is redirected back to the merchant with instant confirmation',
        ],
      },
      { type: 'h2', text: 'How Quidkey Simplifies Open Banking Payments' },
      {
        type: 'p',
        text: 'At Quidkey, we handle the complexity so you can be free to focus on your business. Our platform connects to multiple third party providers across different markets and automatically selects the best path for each transaction.',
      },
      { type: 'h3', text: 'Quidkey vs Traditional Open Banking Solutions' },
      {
        type: 'p',
        text: 'Quidkey simplifies payments so you can focus on growing your business. Accept payments across borders, support multiple currencies, and go live in minutes.',
      },
      { type: 'h2', text: 'What Quidkey Adds to Open Banking' },
      {
        type: 'p',
        text: 'Open banking provides the rails. Quidkey makes them usable.',
      },
      {
        type: 'p',
        text: 'While providers like Tink, TrueLayer, and Token offer secure access to bank accounts, they stop short of delivering the full checkout experience. Quidkey fills that gap by combining real time orchestration, bank prediction, cross-border support, and merchant-ready integrations.',
      },
      { type: 'h2', text: 'Get Started with Quidkey' },
      {
        type: 'p',
        text: "Quidkey is not just another payment provider. It's open banking actually done right.",
      },
      {
        type: 'p',
        text: 'Instant payouts. No fraud. No chargebacks. Lower fees. Seamless integration.',
      },
      {
        type: 'p',
        text: 'Go live in minutes and take control of how your business gets paid.',
      },
    ],
  },
  {
    slug: 'a2a-payments-explained-why-traditional-payment-fees-hurt-merchants-profit-margins-and-how-to-fix-it',
    date: 'March 18, 2025',
    dateISO: '2025-03-18',
    title: 'A2A Payments Explained: Why Traditional Payment Fees Hurt Merchants Profit Margins and How to Fix It',
    seoTitle: 'A2A Payments: Cut Transaction Fees by 60% | Quidkey',
    description:
      'A2A payments offer 60% lower fees than cards, instant settlement, and zero chargebacks. Learn why UK merchants are switching.',
    keyword: 'A2A payments',
    author: 'Quidkey Team',
    blocks: [
      {
        type: 'p',
        text: "As a merchant, you're always looking for ways to reduce costs, streamline payments, and improve the customer experience. Traditional payment methods — like credit cards — come with high fees, slow processing times, and fraud risks that eat into your margins.",
      },
      { type: 'h2', text: 'What are A2A Payments?' },
      { type: 'h3', text: 'Too many middlemen in todays card process' },
      {
        type: 'p',
        text: "Current card payment processes include multiple checks and approvals from various banks and card processers. A2A payments moves money directly from your customers bank account to yours — no middlemen, no card networks, no excessive fees.",
      },
      {
        type: 'p',
        text: 'Instead of routing payments through card networks (Visa, Mastercard), A2A payments use Open Banking technology to allow real-time, direct bank transfers between accounts.',
      },
      {
        type: 'p',
        text: 'How does it work?',
      },
      {
        type: 'ul',
        items: [
          'Customer selects "Pay by Bank" at checkout.',
          'They authenticate the payment via their bank app (Face ID, fingerprint, etc.).',
          'Funds move instantly from their account to yours.',
          'No card fees. No chargebacks. Just instant money.',
        ],
      },
      { type: 'h2', text: '5 reasons UK Merchants are Switching to A2A Payments' },
      { type: 'h3', text: 'Lower Transaction Costs' },
      {
        type: 'p',
        text: 'Card payments: Cost you anywhere from 1.5%-5% in transaction fees.',
      },
      {
        type: 'p',
        text: 'A2A payments: Cost as little as 0.5%.',
      },
      {
        type: 'p',
        text: 'More money in your pocket, less in the hands of card networks.',
      },
      { type: 'h3', text: 'Instant Settlements (Because Cash Flow Matters)' },
      {
        type: 'p',
        text: 'Waiting days for card payments to settle? With A2A, payments arrive instantly. That means faster access to your money and better cash flow — perfect for SMEs managing tight margins.',
      },
      { type: 'h3', text: 'No Chargebacks (Goodbye, Fraudsters!)' },
      {
        type: 'p',
        text: 'Card payments come with the nightmare of fraudulent chargebacks — where customers dispute transactions, and you lose revenue.',
      },
      {
        type: 'p',
        text: 'With A2A payments:',
      },
      {
        type: 'ul',
        items: [
          'No chargebacks.',
          'Less fraud risk.',
          'More peace of mind.',
        ],
      },
      { type: 'h3', text: 'Frictionless Customer Experience' },
      {
        type: 'ul',
        items: [
          'No card details to enter.',
          'No CVVs to type in.',
          'No expired cards.',
        ],
      },
      {
        type: 'p',
        text: "Just a seamless, one-click payment straight from your customer's bank.",
      },
      { type: 'h3', text: 'No More Expired or Declined Cards' },
      {
        type: 'p',
        text: 'Subscription services and recurring payments can suffer from failed transactions due to expired or cancelled cards. A2A payments eliminate this problem, ensuring uninterrupted service and reducing churn.',
      },
      { type: 'h2', text: 'Why Bank-Branded Payments with Quidkey = A Better Customer Experience' },
      {
        type: 'p',
        text: "One of the key reasons merchants are choosing Quidkey's A2A solution is because of the frictionless, bank-branded payment experience we provide.",
      },
      { type: 'h3', text: 'Built on Trust' },
      {
        type: 'p',
        text: "When customers pay through Quidkey, they're using their own trusted bank interface to approve the payment. There's no need to share sensitive card details with third parties, which gives customers greater peace of mind.",
      },
      {
        type: 'p',
        text: 'Did you know? Studies show that customers are more likely to complete payments when they see a trusted bank brand during checkout, compared to entering credit card details on an unfamiliar page.',
      },
      { type: 'h3', text: 'No Card Fatigue, No Expired Details' },
      {
        type: 'p',
        text: "Unlike card payments, customers don't have to worry about:",
      },
      {
        type: 'ul',
        items: [
          'Entering long card numbers.',
          'Typing in CVVs or expiry dates.',
          'Dealing with outdated or expired cards that cause payment failures.',
        ],
      },
      {
        type: 'p',
        text: 'With Quidkey, customers authenticate through their bank\'s app using biometrics (Face ID, fingerprint) or secure PIN verification. Payments are confirmed in seconds, reducing cart abandonment.',
      },
      { type: 'h3', text: 'Simplicity' },
      {
        type: 'p',
        text: "Quidkey allows for seamless payments directly from the customer's bank. Once authenticated, customers can breeze through future checkouts without needing to re-enter any details.",
      },
      {
        type: 'p',
        text: 'Less hassle = fewer abandoned carts and more completed purchases.',
      },
      { type: 'h3', text: 'Instant Confirmation = No Worries About Pending Payments' },
      {
        type: 'p',
        text: "Ever had a customer panic when their payment didn't seem to go through immediately? With instant bank transfers via Quidkey, both you and your customer get real-time payment confirmations. No awkward waiting.",
      },
      { type: 'h2', text: 'How Can Quidkey Support Your Business?' },
      {
        type: 'p',
        text: "Quidkey doesn't just offer A2A payments — we deliver a superior payment experience for your customers while boosting your bottom line.",
      },
      { type: 'h3', text: 'Simple Integration' },
      {
        type: 'p',
        text: "Our payment solution integrates easily with e-commerce platforms, point-of-sale systems, and invoicing tools. Whether you're using Shopify, WooCommerce, or a custom-built platform, we've got you covered.",
      },
      { type: 'h3', text: 'Save on Fees' },
      {
        type: 'p',
        text: "With Quidkey's low-cost model, you can reduce transaction fees by up to 60% compared to card payments. No hidden fees or nasty surprises.",
      },
      { type: 'h3', text: 'Real-Time Payments, 24/7' },
      {
        type: 'p',
        text: 'Enjoy instant or near-instant settlements any day of the week. No waiting for "banking hours" or 3-5 day processing windows.',
      },
      { type: 'h3', text: 'Built-In Fraud Protection' },
      {
        type: 'p',
        text: 'We help safeguard your business with bank-level security and fraud prevention measures. Forget chargebacks, thanks to our secure and verified Open Banking infrastructure.',
      },
      { type: 'h2', text: 'Why Wait? Make your Checkout Stronger Today' },
      {
        type: 'p',
        text: 'Final Thought: Still paying 2% or more in card fees and watching customers drop off during checkout?',
      },
      {
        type: 'p',
        text: "Give your customers a smoother, safer, and faster payment experience. Let's grow your business together — without the payment headaches.",
      },
    ],
  },
]

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

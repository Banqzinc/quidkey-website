export type BlogPostBlock =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'html'; html: string }
  | { type: 'youtube'; videoId: string; title: string }
  | { type: 'table'; headers: string[]; rows: string[][] }

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
  /** Optional LinkedIn URL for the author */
  authorLinkedIn?: string
  /** Featured image path (relative to /images/blog/) */
  image: string
  /** Image rendering mode in blog cards and article header */
  imageFit?: 'cover' | 'contain'
  blocks: BlogPostBlock[]
  featured?: boolean
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'open-finance-in-the-us-part-3-building-a-pay-by-bank-in-the-us',
    date: 'March 12, 2026',
    dateISO: '2026-03-12',
    title: 'Open Finance in the US Part 3: Building a Pay By Bank in the US',
    seoTitle: 'Building a Pay By Bank in the US | Open Finance Part 3',
    description:
      'Part 3 of our US open finance series explains what it actually takes to build Pay By Bank in the US, from ACH risk and reversals to cross-border acceptance.',
    keyword: 'Pay By Bank in the US',
    author: 'Rabea Bader',
    authorLinkedIn: 'https://www.linkedin.com/in/rabea-bader/',
    image: '/images/blog/open-finance-us-part-3.png',
    imageFit: 'contain',
    featured: true,
    blocks: [
      {
        type: 'p',
        text: 'In our previous articles (Open Finance in the US Part 1, Open Finance in the US Part 2 -Rule 1033) we covered how open finance works in the US today and the regulatory landscape around Section 1033. In this piece we get into the technical weeds, what it actually takes to build a Pay By Bank solution in the US compared to the EU and UK, why the infrastructure differences matter more than most people think, and how Quidkey has engineered its way through every one of these challenges to deliver a global solution that actually works.',
      },
      {
        type: 'h3',
        text: 'The EU and UK: One Integration, Direct Push Payment Bank APIs, and Irrevocable Payments',
      },
      {
        type: 'p',
        text: "If you're building a Pay By Bank solution in the EU or the UK, the architecture is, at least conceptually, straightforward. The regulatory framework (PSD2) mandates that banks provide APIs for data access and payment initiation. So you connect to a single aggregation layer or scheme, and through that connection you can push payments directly from the payer's bank account to the merchant. One integration, standardized APIs, and you're live across thousands of banks.",
      },
      {
        type: 'p',
        text: "That sounds great on paper, and in many ways it is. The payment model is a push payment, meaning the customer authorizes the payment from their bank and the funds move. Once a payment is confirmed the funds move immediately and are final, unlike card payments which allow disputes and chargebacks. For merchants this is a massive advantage because it means the moment a payment clears, you have certainty that the funds are yours.",
      },
      {
        type: 'p',
        text: "But here's the thing nobody talks about enough: the bank APIs themselves are, to put it politely, unreliable and poorly implemented (mostly). Banks in the EU and UK build these APIs because regulation forces them to, not because they see it as a revenue opportunity or a competitive differentiator. And when you're forced to do something because the regulator told you to, and not because you want to, the quality tends to reflect that. You get inconsistent data formats, unreliable uptime, and an overall experience that makes integration painful even when the theoretical framework is clean. Banks do it for the sake of complying with applicable regulation, and nothing else.",
      },
      {
        type: 'p',
        text: "Still, the core mechanics work in your favor. You can connect once, access data, push payments, and once a payment is confirmed there's no way to cancel it. The funds are captured and sent. For a payment company building in that ecosystem, the challenges are real but they're mostly about dealing with bad API implementations, not about fundamentally rethinking how money moves.",
      },
      {
        type: 'h3',
        text: 'The US (Currently): No Regulatory Rails, No Push Payments, and a Whole Lot of Complexity',
      },
      {
        type: 'p',
        text: 'Now take everything I just described and throw it out the window, because building Pay By Bank in the US is an entirely different engineering challenge.',
      },
      {
        type: 'p',
        text: "As we covered in our previous articles, there is no comprehensive regulatory framework mandating standardized bank APIs in the US. Section 1033 is coming eventually but it's currently paused, contested, and even when it does arrive it won't look like PSD2. Some banks have built APIs. Many haven't. The ones that have built them did so on their own terms, with their own specs, their own authentication flows, their own ideas about what data they want to share and how and, crucially, what they're going to charge for access. This fragmentation means you can't just connect to one integration layer and call it done. You need to work with multiple providers, multiple connection methods, and account for the fact that coverage is never going to be 100% through any single channel.",
      },
      {
        type: 'p',
        text: "But the bigger technical challenge isn't the APIs. It's the payment rails.",
      },
      {
        type: 'p',
        text: 'In the EU and UK, push payments are the standard. The customer initiates, the bank sends the money, done. In the US, push payments through FedNow and RTP are emerging but they\'re not yet universally supported across banks. So what do we have? We have ACH.',
      },
      {
        type: 'p',
        text: "ACH is the backbone of US bank-to-bank payments. It's been around for decades. And here's the funny thing about it: it's actually incredibly reliable, almost never breaks, and it's connected to essentially every bank in the United States. You will not find a US bank that doesn't support ACH. In terms of coverage, it's as close to universal as you can get.",
      },
      {
        type: 'p',
        text: "The problem is how ACH works mechanically. ACH doesn't move money instantly. When you initiate a Same Day ACH payment, the funds are pulled on the next available processing window. And between the time the payment is initiated and the time the funds are actually debited, other transactions can take priority. Loan payments to the bank, ATM withdrawals, other ACH debits, they can all hit first. So if a customer has $1,000 in their account, commits to an $800 ACH payment and then goes to an ATM and withdraws $500 before that ACH settles, the ACH payment fails. The money simply isn't there anymore.",
      },
      {
        type: 'p',
        text: "Now, is that fraud? Sometimes. In some cases regulators and banks will flag it as a fraudulent transaction. But in many cases it's just normal human behavior. As a customer, you make a payment, you see a confirmation, and as far as you're concerned that payment is done. So you look at your remaining balance and spend accordingly. You're not trying to commit fraud. You just don't understand the mechanics of how ACH settlement works, and frankly, why should you? That's not the customer's problem to solve.",
      },
      {
        type: 'h3',
        text: 'How Quidkey Solved the ACH Problem',
      },
      {
        type: 'p',
        text: "This is where we had to get creative, because simply doing a balance check at the moment of payment, which is what most of our competitors do, won't cut it. A balance check tells you the customer has the funds right now. It tells you nothing about whether those funds will still be there when the ACH actually settles. And that's why so many ACH-based payment providers see high failure rates. They check the balance, initiate the payment, and then a meaningful percentage of those payments bounce because the funds were spent or moved before settlement.",
      },
      {
        type: 'p',
        text: "At Quidkey we took a fundamentally different approach. We study the payment patterns of customers in partnership with our banking and payment partners and we build a risk profile for each customer in real time. When a customer initiates a payment, we don't just check their balance. Instead, we analyze their transaction history, their spending patterns, their incoming deposits, their existing commitments, and we make an instant decision on whether that payment is going to complete successfully.",
      },
      {
        type: 'p',
        text: "When we confirm the payment, we inform the merchant that the money is on its way, and we stand behind that. We want to make sure that the merchant receives the money. This is not a \"we'll try and let you know if it fails\" situation. We're making a commitment based on data and real time risk assessment.",
      },
      {
        type: 'p',
        text: "With every subsequent payment, the risk profile improves. More data, better predictions, higher completion rates. This is why Quidkey delivers the best payment completion rates in the market, because we're not relying on a snapshot balance check. We're building a living, evolving understanding of each customer's financial behavior.",
      },
      {
        type: 'h3',
        text: 'The Reversal Problem: 60 Days of Uncertainty',
      },
      {
        type: 'p',
        text: "Here's another fundamental difference between the US and the EU/UK that shapes everything about how you build a payment product: In the EU and UK, once a payment is confirmed, it's done. There is no reversal mechanism. The money has moved, the transaction is final. Full stop.",
      },
      {
        type: 'p',
        text: 'In the US, ACH payments are reversible within 60 days. Sixty days. That means a customer can make a payment, receive the goods or services, and then reverse the payment up to two months later. This creates an entirely different risk landscape for merchants and for payment providers.',
      },
      {
        type: 'p',
        text: 'So part of our risk profiling at Quidkey isn\'t just about predicting whether the payment will complete. It\'s also about predicting whether the customer is likely to reverse the funds after the fact. We check refund and reversal rates across multiple payment companies and banking partners, building a picture of each customer\'s history with reversals. Are they someone who has reversed payments before? How often? With which merchants? This allows us to predict the likelihood of a reversal and factor that into our risk assessment, protecting merchants from what the industry calls "friendly fraud", where the customer isn\'t technically stealing, but they\'re using the reversal mechanism in ways that leave merchants holding the bag.',
      },
      {
        type: 'h3',
        text: 'The Cross-Border Problem Nobody Else Has Solved',
      },
      {
        type: 'p',
        text: "Now here's where it gets really interesting, and where Quidkey has done something that, as far as we know, nobody else in the market has been able to do.",
      },
      {
        type: 'p',
        text: "ALL other US Pay By Bank providers can only service local US entities. That's it. If you're a company incorporated in the US, great, they can help you. If you're a UK company, an EU company, an Australian company, a Brazilian company selling into the US market, you're out of luck.",
      },
      {
        type: 'p',
        text: "Why? Because, among other things, US banks are risk averse when it comes to reversible payments leaving the country. If an ACH payment can be reversed within 60 days and the funds have already been sent to a foreign entity, the bank's ability to recoup those funds is severely limited. There are many other reasons US banks don't like cross-border ACH exposure, but the reversal risk is a big one. Banks simply don't want to be on the hook for money that's left the US and may not come back, nor do they have the infrastructure in place to solve for this.",
      },
      {
        type: 'p',
        text: "And by the way, this same dynamic is exactly what we see with card acceptance rates. If you're a UK or EU or Australian company selling into the US and you're running your payments through a Stripe account without a local US entity, your card acceptance rates are going to be around 85%. If you're a Brazilian company, your acceptance rates drop below 50%. US banks and card networks just don't trust cross-border transactions, and they express that distrust through declined transactions.",
      },
      {
        type: 'p',
        text: "This was a material challenge for us to solve, and we attacked it head on. We worked extensively with our payment partners and local US financial institutions to provide them with the trust needed through our technology and compliance processes. They've seen how our risk profiling works. They've seen our fraud prevention capabilities. They've seen our compliance framework. And based on that trust, they have allowed us to onboard and service non-US entities.",
      },
      {
        type: 'p',
        text: "What this means in practice is that any company outside of the US, from over 90 jurisdictions, can implement Quidkey and start selling into the US market. As long as their end customers, whether individuals or businesses, have a US bank account, the payment works. Our acceptance rates are effectively 100% because we're not running through card networks that decline based on the merchant's country of incorporation. We're going direct to the customer's bank.",
      },
      {
        type: 'p',
        text: "This solution can remove the need for a Merchant of Record (yes, an MOR does more than just this, and I'll write another blog that explains the full picture of why and how) and allows companies to sell directly from their home country without the financial and operational headache of setting up and maintaining legal entities in the US.",
      },
      {
        type: 'h3',
        text: 'Trust at Checkout: Why the Bank Brand Matters',
      },
      {
        type: 'p',
        text: "There's one more challenge that exists across the market and it's not a technical one, it's a behavioral one. In the US, credit cards are deeply embedded in consumer behavior. People are used to pulling out a card. They trust the process. Getting them to pay differently requires building trust instantly at the point of checkout.",
      },
      {
        type: 'p',
        text: "This is something we've thought about deeply at Quidkey. When a customer reaches the checkout they don't see a Quidkey Pay By Bank option and we don't show them a generic bank selection screen like other companies. Our predictive technology identifies the customer's primary bank and surfaces that bank's brand and logo first. That's instant recognition. That's trust. You're not asking them to try something unfamiliar. You're showing them their own bank and saying \"Pay with Chase\"",
      },
      {
        type: 'p',
        text: "We've also been able to enable merchants to offer points, rewards, and discounts through our solution, which further drives adoption. But that's a whole topic on its own, and I'll get into it in the next blog.",
      },
      {
        type: 'h3',
        text: 'The Bottom Line',
      },
      {
        type: 'p',
        text: 'Building Pay By Bank in the US is a fundamentally different engineering challenge than building it in the EU or UK. The lack of standardized APIs, the absence of push payment rails, the reversibility of ACH, the cross-border restrictions, and the behavioral barriers around credit card dominance all combine to make this one of the most complex payment problems in fintech.',
      },
      {
        type: 'p',
        text: "At Quidkey, we didn't just work around these challenges. We built technology specifically designed to solve each one of them. Real time risk profiling that goes far beyond balance checks. Reversal prediction that protects merchants. Cross-border capabilities that nobody else has been able to unlock. And a streamlined checkout experience that builds trust by showing customers their own bank.",
      },
      {
        type: 'p',
        text: "If you've read our previous articles on how open finance works in the US and the regulatory status of Rule 1033, this piece should give you a sense of the technical reality behind everything we're building. The regulatory framework will catch up eventually. In the meantime, the technology has to be smarter than the infrastructure it runs on. And that's exactly what we've built.",
      },
    ],
  },
  {
    slug: 'quidkey-is-live-on-shopify',
    date: 'March 10, 2026',
    dateISO: '2026-03-10',
    title: 'Quidkey is Live on the Shopify App Store',
    seoTitle: 'Quidkey is Live on the Shopify App Store',
    description:
      'Quidkey is now an approved Shopify payment partner. Add Pay by Bank to your checkout in a few clicks — lower fees, faster settlement, and one-click refunds.',
    keyword: 'Shopify Pay by Bank',
    author: 'Quidkey Team',
    image: '/images/blog/quidkey-shopify-pay-by-bank.png',
    featured: true,
    blocks: [
      {
        type: 'html',
        html: '<strong>Quidkey has been quietly live in the Shopify App Store.</strong>',
      },
      {
        type: 'p',
        text: 'Over the past few months we\'ve been working with merchants, improving the product, and refining the checkout experience.',
      },
      {
        type: 'html',
        html: '<strong>Now we\'re officially sharing it.</strong>',
      },
      {
        type: 'p',
        text: 'As an approved Shopify payment partner, merchants can now integrate Quidkey in just a few clicks and add Pay by Bank as a payment option at checkout.',
      },
      {
        type: 'p',
        text: 'Pay by Bank means customers pay directly from their bank account. No card numbers, no redirects. They authorise in their banking app and the payment goes through.',
      },
      {
        type: 'p',
        text: 'For merchants, this changes three things.',
      },
      {
        type: 'html',
        html: '<strong>Fees drop.</strong> Card networks take a cut of every transaction. Pay by Bank removes that cost, so every order is more profitable.',
      },
      {
        type: 'html',
        html: '<strong>Settlement is faster.</strong> Bank payments clear quickly. Funds reach your account sooner, without the processing lag that comes with cards.',
      },
      {
        type: 'html',
        html: '<strong>Checkout converts better.</strong> A simpler payment flow means fewer customers abandon at the last step. Less friction, more completed orders.',
      },
      {
        type: 'html',
        html: 'Traditionally, Pay by Bank has presented merchants with added complexity when processing refunds, with extra steps and extra costs. Quidkey changes that, with <a href="/blog/pay-by-bank-refunds-shopify-merchants">one-click refunds</a> managed within the Shopify merchant portal.',
      },
      {
        type: 'p',
        text: 'The Shopify partnership means it is simple to get started. Merchants don\'t need a custom integration or a development team. Simply install the app, connect your store, and Pay by Bank appears as a payment option at checkout. Payments and refunds are managed in one place.',
      },
      {
        type: 'html',
        html: 'Watch it in action below, or install the Shopify app <a href="https://apps.shopify.com/quidkey-checkout">here</a>.',
      },
      {
        type: 'youtube',
        videoId: '_DdLIu7tR7c',
        title: 'Quidkey on Shopify — Pay by Bank Demo',
      },
    ],
  },
  {
    slug: 'open-finance-in-the-us-part-2-rule-1033',
    date: 'March 5, 2026',
    dateISO: '2026-03-05',
    title: 'Open Finance in the US: The Status of CFPB Rule 1033',
    seoTitle: 'Open Finance in the US: CFPB Rule 1033 Status | Quidkey',
    description:
      'The CFPB issued Rule 1033 to make consumer financial data access a legal right. Learn the current status, what it means for merchants, and how Quidkey simplifies open finance regardless of regulation.',
    keyword: 'CFPB Rule 1033',
    author: 'Matthew Bartlett',
    authorLinkedIn: 'https://www.linkedin.com/in/matthew-bartlett-b6587346/',
    image: '/images/blog/open-finance-us-rule-1033.png',
    featured: true,
    blocks: [
      {
        type: 'ul',
        items: [
          'Open finance lets both business and consumers control and share their financial data with third-party apps, which allows, among other things, businesses to accept direct account-to-account (A2A) bank payments from their customers.',
          'The CFPB has finally promulgated a rule under Section 1033 of the Dodd-Frank Act, which is designed to bolster US open finance and turn consumer data access into a legal right, not a negotiated privilege — but the new rule is currently paused by litigation.',
          'Incumbent banks in the US continue to oppose open finance under Section 1033, arguing instead for paid access and contractual control.',
          'Despite regulatory delays, consumer demand for integrated financial services continues to drive increasing adoption of US open finance solutions, benefitting both business and their customers.',
        ],
      },
      { type: 'h3', text: 'What is Open Finance in the US?' },
      {
        type: 'html',
        html: 'Open finance is the idea that <em><strong>people – not financial institutions – should control the flow of their financial data</strong></em>. In practice this means you can permission an app or service (payments, identity, budgeting, lending, investing, accounting, payroll) via Application Programming Interfaces (APIs) to securely access your accounts and transaction history, and you can revoke that access when you want. You can find more information on US open finance <a href="/blog/open-finance-in-the-us-part-1"><strong>here</strong></a>.',
      },
      {
        type: 'html',
        html: 'In the EU and the UK this paradigm is implemented via a consistent regulatory framework (PSD2) requiring banks to build data-sharing infrastructure to provide secure data access to consumers and authorized third parties via standardized, free and seamless APIs. You can find more information on EU/UK open-banking <a href="/blog/open-banking-payments-in-the-uk"><strong>here</strong></a>.',
      },
      {
        type: 'p',
        text: 'Until recently, however, US authorities have eschewed a comprehensive regulatory framework. This regulatory vacuum in the US has led to a fragmented, inconsistent and expensive – what industry insiders euphemistically label the "market-led" – approach to open-finance, which has developed as a permissioned pay-to-play scheme where financial institutions make consumer data available to a limited number of aggregators for a hefty fee.',
      },
      {
        type: 'p',
        text: 'Now, with US business and consumers waking up to the possibilities of choice and control when it comes to their financial data, they have begun to demand more from their financial service providers. This user driven push, combined with the deficiencies inherent in a purely market lead approach, has prompted the Consumer Financial Protection Bureau (CFPB) to finally make good in its legal mandate and formalize rules relating to the data access requirements in Section 1033 of the Dodd-Frank Act.',
      },
      { type: 'h3', text: 'Section 1033: US Consumer Demand and CFPB Regulatory Catch-Up' },
      {
        type: 'p',
        text: 'Section 1033 was drafted as part of the broader Dodd-Frank Wall Street Reform and Consumer Protection Act of 2010. It mandates that financial institutions provide consumers with access to their personal financial transaction data, enabling them to share it with authorized third parties, fostering "open banking" for better financial products and services. Obviously, the major financial institutions have been opposed to the notion that consumers should own, and control access to, their own data from the start, engineering a miasma of political interference and regulatory inertia that has delayed action on this mandate for over a decade while other jurisdictions (UK, EU, APAC, etc.) race ahead. However, despite ongoing litigation as entrenched financial intuitions attempt to delay or prevent enforcement, the CFPB finally promulgated its Personal Financial Data Rights rule in October 2024, initiating a phased implementation of Section 1033.',
      },
      {
        type: 'p',
        text: 'The new rule issued by the CFPB under Section 1033 requires covered "data providers" to make "covered data" available electronically to consumers and to "authorized third parties," using secure and reliable mechanisms. Two points became especially contentious with financial institutions:',
      },
      {
        type: 'ol',
        items: [
          'No-fee access / charging restrictions – banks generally want to monetize access; consumers and innovators want data portability at marginal cost.',
          'You can\'t satisfy the obligation by allowing screen scraping – the rule is designed to push the market toward safer, permissioned access methods via APIs and direct integration.',
        ],
      },
      {
        type: 'html',
        html: 'It should come as no surprise that the new rule under Section 1033 has not been embraced by US banks, who have instead sued to stop implementation, arguing that the new rule (i) imposes large implementation costs, (ii) forces infrastructure investment on an aggressive timeline, (iii) creates data security vulnerabilities, and (iv) exceeds CFPB authority. On their face, these self-serving bank arguments present as disingenuous pretense and are difficult to reconcile with the fact that (a) most of these same US financial institutions opposing the rule have already made the implementation investments to comply with EU/UK PSD2 requirements overseas and (b) security requirements in connection with Secure Customer Authorization (SCA) under the PSD2 framework have vastly improved data security in connection with open-banking standards as compared to traditional banking models. However, the CFPB has nonetheless paused enforcement and is currently revisiting the proposed framework, which given its DOGE induced near-death experience and significantly reduced capacity, could take some time. <em><strong>Despite this, consumer demand for integrated financial services continues to drive significantly increased adoption of open finance solutions every day.</strong></em>',
      },
      { type: 'html', html: '<strong>Key Takeaways of Section 1033:</strong>' },
      {
        type: 'html',
        html: '<ul><li><strong>Consumer Right to Data:</strong> Consumers can request their transaction history, account details (balances, fees, usage), and other related information from their financial providers.</li><li><strong>Data Sharing and Data Portability:</strong> Allows consumers to direct their data to other apps or services (like budgeting tools or fintech apps) to compare options and get better financial management. Provides for easy transfer of consumer financial data between different providers, promoting competition and innovation by making financial data portable.</li><li><strong>Recent Regulatory Activity:</strong><ul><li><strong>Final Rule (Nov 2024):</strong> The Consumer Financial Protection Bureau (CFPB) issued the Personal Financial Data Rights (PFDR) Rule, mandating data providers (banks, lenders) share transaction/usage data and establishing protocols for third-party access, aiming to give consumers control over their financial information.</li><li><strong>Implementation Focus:</strong> The rule introduces phased compliance, with larger institutions starting April 2026 and smaller ones by April 2030, emphasizing secure data sharing and consumer authorization.</li><li><strong>Legal Challenges:</strong> Banks have filed lawsuits challenging the rule and seeking to protect their entrenched tollbooth status, leading the CFPB to pause enforcement and compliance deadlines.</li><li><strong>Interim Rule Consideration:</strong> The CFPB is actively working on an interim rule for Section 1033, signaling adjustments to the original final rule to smooth out technical and implementation hurdles.</li></ul></li></ul>',
      },
      { type: 'h3', text: 'Where Do We Go From Here?' },
      {
        type: 'p',
        text: 'Well – that\'s really anyone\'s guess, but here are a couple plausible paths for consideration:',
      },
      {
        type: 'html',
        html: '<strong><u>Future A</u>: Regulatory baseline promoting innovation and competition (1033 revived, revised or reissued by CFPB)</strong>',
      },
      {
        type: 'p',
        text: 'If a revised 1033 rule becomes operative after the current stay, expect these structural shifts:',
      },
      {
        type: 'ol',
        items: [
          'Data access becomes a right, not a negotiated privilege: Data providers must support access to covered data for consumers and authorized third parties on standardized terms.',
          'Screen scraping gets squeezed out: The rule is designed to make secure, permissioned access the norm.',
          'More uniform security + authorization expectations: The rule\'s "authorized third party" concept is meant to formalize responsibilities on the receiving side (privacy, security, authorization procedures).',
          'Standards emerge for APIs and other technical requirements. Increased technical standardization boosts access and adoption.',
        ],
      },
      { type: 'html', html: '<strong>Who benefits:</strong>' },
      {
        type: 'ul',
        items: [
          'Consumers (clearer rights and revocation)',
          'Innovators (predictable access)',
          'Competition and switching',
        ],
      },
      { type: 'html', html: '<strong>Who loses leverage:</strong>' },
      {
        type: 'ul',
        items: [
          'Large incumbent banks that rely on monopolized data control',
          'Institutions that monetize access scarcity',
        ],
      },
      {
        type: 'html',
        html: '<strong><u>Future B</u>: Industry Lead, monopolized control of your data (contracts and toll-trolls)</strong>',
      },
      {
        type: 'p',
        text: 'If the CFPB framework stays weakened or stalled long-term, we\'ll see open finance continue to betray its moniker as it further consolidates around power centers.',
      },
      {
        type: 'ol',
        items: [
          'Paid access becomes the default: The reported JPMorgan approach — charging aggregators for access — becomes standard among large banks.',
          'Bilateral terms shape competition: Access, rate limits, feature completeness (ex., balances, pending transactions, enriched metadata), and uptime SLOs become commercial levers.',
          'Security remains uneven: Big banks can enforce strong security requirements via contracts, but smaller institutions may lag or outsource, producing a two-tier ecosystem.',
          'Higher barriers for startups and reduced innovation: If every major bank has fees + bespoke onboarding + legal review, early-stage fintechs face "integration tax," which tends to favor incumbents and well-funded platforms at the expense of consumers.',
        ],
      },
      { type: 'html', html: '<strong>Who Benefits:</strong>' },
      {
        type: 'ul',
        items: [
          'Big banks: retain pricing and platform control',
          'Large aggregators: may become "regulated-like utilities" through private deals',
        ],
      },
      { type: 'html', html: '<strong>Who gets railroaded:</strong>' },
      {
        type: 'ul',
        items: [
          'Consumers: experience depends heavily on which institutions they use and which apps can afford access; higher expenses with less innovation and limited choice and control',
          'Innovators: face higher barriers to entry and slower time-to-market',
        ],
      },
      {
        type: 'p',
        text: 'While in reality we\'ll likely end up somewhere in between, the debate around Rule 1033 really boils down to whether financial data belongs to the institution that holds it or the user it pertains to. And despite the lack of clarity on the regulatory front, two corresponding themes are becoming increasingly apparent:',
      },
      {
        type: 'ol',
        items: [
          'Users are demanding open access and control over their financial data in standardized, innovative and usable ways; and',
          'Businesses across the board benefit by incorporating open-finance solutions into their business operations and payment flows by increasing conversion and reducing processing costs.',
        ],
      },
      {
        type: 'h3',
        text: 'How Quidkey Solves and Simplifies Open Finance in Any Regulatory Environment to Help Your Business Grow',
      },
      {
        type: 'html',
        html: 'Regardless of the regulatory forces at work – or the lack thereof – <em>Quidkey solves the issues inherent in the US open finance ecosystem and handles the complexity so you can be free to focus on your business</em>.',
      },
      {
        type: 'ul',
        items: [
          'Our comprehensive platform coordinates payment orchestration across different geographical markets and automatically selects the best solution for each payment to eliminate coverage gaps, outages and throttling, thus ensuring the highest success rate.',
          'We manage all bank integrations and authentication flows, exclusively utilizing direct tokenized/OAuth connections, instead of data scraping, to protect user data and eliminate the risk of broken integrations.',
          'We\'ve engineered consistent data workflows providing easily managed data parameters.',
          'We\'ve built customizable A2A payment workflows allowing you to manage the flow of funds, refunds and treasury to suit your business needs.',
          'We provide a global solution, supporting currency exchange and cross border payments, and serving you a single interface for your business to start accepting cross-border open finance payments instantly.',
          'Our predictive algorithm automatically identifies and displays the customer\'s bank at checkout, making the experience faster, more intuitive, and built upon the recognition customers already have with their bank, leading to higher conversion rates and lower cost payments.',
        ],
      },
      {
        type: 'p',
        text: 'Quidkey simplifies payments so you can focus on growing your business. Customize your payment flows, accept payments across borders, support multiple currencies, and go live in minutes.',
      },
      {
        type: 'html',
        html: '<strong>Quidkey vs. Existing Fragmented Open Finance Providers in the US</strong>',
      },
      {
        type: 'table',
        headers: ['', 'Quidkey', 'Existing Fragmented Options in US'],
        rows: [
          [
            'Integration',
            'One-click integration, no technical expertise required',
            'Requires extensive technical expertise and development resources',
          ],
          ['Coverage', 'US, UK, EU, AUS, CAN', 'Limited to domestic solutions only'],
          ['Cross-border & FX', 'Supported with built-in FX management', 'Not supported'],
          [
            'Bank Prediction at Checkout',
            "Proprietary technology surfaces customer's bank automatically at checkout",
            'Customer must choose bank manually from long list, increasing drop off rates',
          ],
          [
            'Customizable Payment Flows',
            'Customize and automate your funds flows to support your business needs',
            'Not supported',
          ],
          [
            'Rewards',
            'Merchants can offer loyalty programs and rewards to encourage bank payments',
            'Not supported',
          ],
          [
            'All major e-commerce platforms (yes, including Shopify)',
            'Open finance solutions available and active on Shopify exclusively with Quidkey',
            'Not supported',
          ],
          ['Refunds', 'One-click refunds supported', 'Requires manual credit via merchant bank account'],
          [
            'Payment Links',
            'Send white-labeled payment links to customers or suppliers',
            'Not supported',
          ],
          [
            'Fraud and reputation checks on consumers',
            'Real-time fraud and consumer reputation checks to reduce "friendly fraud", reversals and chargebacks',
            'Not supported',
          ],
          [
            'Flexible pricing with no commitments',
            'Always - usage based with no rigid contractual commitments',
            'No – must commit to long term contractual obligations and fees',
          ],
        ],
      },
      {
        type: 'p',
        text: 'Existing players in the US market offer fragmented infrastructure built upon screen scraping, uneven security standards and clunky user experiences, falling short of delivering a seamless and secure checkout experience. Quidkey fills that gap by combining real time orchestration, predictive bank selection, customizable payments workflows, platform integrations, and built in cross-border support for an innovative and globalized open finance solution.',
      },
      { type: 'h3', text: 'Open Finance Benefits for Business and Consumers' },
      { type: 'html', html: '<strong>For Merchants</strong>' },
      {
        type: 'html',
        html: "<ul><li><strong>Customizable flows and Increased liquidity:</strong> Customize your funds flow and direct receivables to enhance operating efficiency. Payments clear with same-day ACH or instant payments (RTP /FedNow), helping improve float and cash flow.</li><li><strong>Greater protections against chargebacks and fraud:</strong> Real time data analytics evaluating consumer profile and reputation. Payments are authenticated by the customer's bank, reducing fraud risk and related disputes. No card network mandated chargebacks.</li><li><strong>Lower fees:</strong> By bypassing card networks and intermediaries, businesses can significantly reduce processing costs.</li></ul>",
      },
      { type: 'html', html: '<strong>For Customers</strong>' },
      {
        type: 'html',
        html: "<ul><li><strong>Stronger protection against fraud:</strong> Every payment requires secure bank authentication, often with biometrics or two factor login. And no card numbers mean there is nothing to steal.</li><li><strong>Faster checkout:</strong> Customers approve payments directly in their banking app.</li><li><strong>Real time control and visibility:</strong> Payments are authorized through the customer's own bank, with instant confirmation and a clear transaction record.</li></ul>",
      },
      {
        type: 'html',
        html: '<strong>Add Quidkey to your checkout today – </strong><a href="https://merchants.quidkey.com/signup">Start Accepting Payments</a>',
      },
    ],
  },
  {
    slug: 'we-launched-a-new-website-in-a-day',
    date: 'March 4, 2026',
    dateISO: '2026-03-04',
    title:
      "We launched a new website in a day. Here's everything you need to know.",
    seoTitle:
      "We launched a new website in a day. Here's everything you need to know.",
    description:
      'How we built and shipped the new Quidkey website in a single day using Claude Code and Cursor — and how our team now maintains it directly from Slack.',
    keyword: 'AI website launch',
    author: 'Quidkey Team',
    image: '/images/blog/website-launch-ai.png',
    featured: true,
    blocks: [
      {
        type: 'p',
        text: 'Last week, we launched the new Quidkey website. We built it in a single day, using two AI-powered tools: Claude Code and Cursor. We started with a proposal in the morning. By evening, it was live.',
      },
      {
        type: 'p',
        text: 'Claude Code handled the core build — writing and structuring the code, translating our direction into a working site. Cursor let us iterate quickly on the frontend side with its built-in browser, catching issues in real time and keeping momentum through the day. There was no agency, no review cycle, no waiting. Just a clear proposal, the right tools, and a focused day of work.',
      },
      {
        type: 'p',
        text: 'The stack itself is modern and lightweight: TanStack Start with React, Tailwind for styling, Vite for builds, deployed to Netlify. There\'s no CMS, no database, and no moving parts to break, which makes it fast, really fast, SEO friendly, and easy to maintain.',
      },
      {
        type: 'p',
        text: 'The tech and build time alone was worth noting. But it\'s not the most interesting part.',
      },
      {
        type: 'h3',
        text: 'The bigger shift',
      },
      {
        type: 'p',
        text: 'The bigger shift is in how the site gets maintained now it\'s live. Our UX and UI team can update the website directly from Slack. No code editor, no developer dependency. They send a message to Claude Code describing what needs to change. The update happens. That\'s it.',
      },
      {
        type: 'p',
        text: 'It means the people closest to our messaging and customer experience — the ones who notice when something\'s off or needs updating — can now fix it themselves. Changes that used to involve a developer ticket and a wait now take minutes.',
      },
      {
        type: 'p',
        text: 'We built it this way because fast teams need tools that match their pace.',
      },
      {
        type: 'html',
        html: '<strong>AI didn\'t replace the thinking. It just removed the friction between thinking and shipping.</strong>',
      },
      {
        type: 'html',
        html: 'Watch it in action below and check out the finished version at <a href="https://quidkey.com">quidkey.com</a>.',
      },
      {
        type: 'youtube',
        videoId: '6dTTvOK-W9I',
        title: 'Quidkey Website Launch — Built in a Day with AI',
      },
    ],
  },
  {
    slug: 'open-finance-in-the-us-part-1',
    date: 'February 26, 2026',
    dateISO: '2026-02-26',
    title:
      'Open Finance in the US: How User Control Over Financial Data Benefits Both Businesses and Consumers',
    seoTitle: 'Open Finance in the US: A2A Payments Guide | Quidkey',
    description:
      'Learn how open finance in the US works, how it differs from EU/UK open banking, and how Quidkey solves fragmentation for global A2A payments.',
    keyword: 'open finance US',
    author: 'Matthew Bartlett',
    authorLinkedIn: 'https://www.linkedin.com/in/matthew-bartlett-b6587346/',
    image: '/images/blog/open-finance-us-part-1.png',
    featured: true,
    blocks: [
      { type: 'h3', text: 'Executive Summary' },
      {
        type: 'ul',
        items: [
          'Open finance lets both business and consumers control and share their financial data with third-party apps, which allows, among other things, businesses to accept direct account-to-account (A2A) bank payments from their customers.',
          'In the EU and UK, open banking is mandated by regulation and implemented via standardized schemes.',
          'A regulatory vacuum in the US resulted in a fragmented and convoluted open finance ecosystem developed via private contracts instead of regulation.',
          'Despite regulatory delays, consumer demand for integrated financial services continues to drive increasing adoption of US open finance solutions, benefitting both business and their customers.',
        ],
      },
      { type: 'h3', text: 'What is Open Finance in the US?' },
      {
        type: 'html',
        html: 'Open finance is the idea that <em><strong>people – not financial institutions – should control the flow of their financial data</strong></em>. In practice this means you can permission an app or service (payments, identity, budgeting, lending, investing, accounting, payroll) via Application Programming Interfaces (APIs) to securely access your accounts and transaction history, and you can revoke that access when you want. In the US, this includes permissioned access to things like:',
      },
      {
        type: 'ul',
        items: [
          'A2A payment initiation',
          'checking and savings accounts',
          'credit cards',
          'payment apps and wallets',
          'lending and cash-flow data',
          'investments, insurance, tuition, etc.',
        ],
      },
      {
        type: 'p',
        text: 'While the terms "open-banking" and "open-finance" are often thrown around interchangeably, open finance refers to a framework that reaches beyond checking accounts into a broader ecosystem of financial activity driven by the needs of consumers and businesses.',
      },
      {
        type: 'h3',
        text: 'How Does Open-Finance in the US differ from EU/UK style Open-Banking?',
      },
      {
        type: 'html',
        html: 'Unlike the laissez-faire approach developing inconsistently in the US thus far, the EU and the UK have taken the lead in developing a consistent regulatory framework (PSD2) that requires banks to build data-sharing infrastructure that provides secure data access to consumers and authorized third parties via standardized, free and seamless APIs. This regulatorily mandated approach has led to increased innovation, competition, personalization and consumer choice, loosening the stranglehold of entrenched financial institutions on consumer data and providing the people with more flexibility and control over their finances. You can find more information on EU/UK open-banking <a href="/blog/open-banking-payments-in-the-uk"><strong>here</strong></a>.',
      },
      {
        type: 'p',
        text: 'While other major markets embrace the revolution of consumer control over their own financial data, users in the US have been chronically stuck under an antiquated regime imposed by powerful financial institutions with limited incentive to give up their monopoly on our data.',
      },
      {
        type: 'p',
        text: 'Without analogous regulatory requirements to mandate standardized access, US open finance has become a bespoke web of bilateral relationships between established financial industry institutions, such as:',
      },
      {
        type: 'ol',
        items: [
          'Traditional banks (e.g., JPMorgan Chase, Bank of America, Citibank, etc.); and',
          'Data aggregators and scrapers (e.g. Plaid, MX, Finicity/Mastercard, Akoya, etc.)',
        ],
      },
      {
        type: 'p',
        text: 'This regulatory vacuum in the US has led to a fragmented, inconsistent and expensive – what industry insiders euphemistically label the "market-led" – approach to open-finance, which has developed as a permissioned pay-to-play scheme where financial institutions make consumer data available to a limited number of aggregators for a hefty fee. This had previously left US consumers years behind the advancements of global peers, without access and control over their data, choices, and financial lives.',
      },
      { type: 'h3', text: 'Section 1033: CFPB Regulatory Catch-Up' },
      {
        type: 'p',
        text: 'Now, with US business and consumers waking up to the possibilities of choice and control when it comes to their financial data, they have begun to demand more from their financial service providers. This user driven push, combined with the deficiencies inherent in a purely market lead approach, has prompted the Consumer Financial Protection Bureau (CFPB) to finally promulgate the Personal Financial Data Rights rule in October 2024, initiating a phased implementation of Section 1033 of the Dodd-Frank Act.',
      },
      {
        type: 'p',
        text: 'The new rule issued by the CFPB under Section 1033 requires covered "data providers" to make "covered data" available electronically to consumers and to "authorized third parties," using secure and reliable mechanisms. However, various elements of the new rule are currently subject to litigation by US financial institutions causing the CFPB to pause enforcement and revise the proposed framework. You can find more information on the status of Rule 1033 in our next article on Rule 1033.',
      },
      { type: 'h3', text: 'How Open Finance Works in the US Today' },
      {
        type: 'p',
        text: "Even with regulatory action under Section 1033 paused for now, open finance is still fully operational with the right technology partners and it's being increasingly adopted by merchants and consumers every day.",
      },
      { type: 'p', text: 'Most flows currently look like this:' },
      {
        type: 'html',
        html: '<strong>User → Fintech app → Aggregator → Bank List → Data provider (bank/issuer) → back</strong>',
      },
      {
        type: 'ul',
        items: [
          'The fintech app outsources connectivity to an aggregator.',
          'The aggregator maintains hundreds/thousands of bank integrations (APIs where available; credential-based screen scraping where not).',
          'Consent UX varies: some banks support OAuth-style permissioning; others still rely on older and less secure methods like data scraping.',
        ],
      },
      {
        type: 'html',
        html: "<strong>What's improved in the last few years (even before 1033)</strong>",
      },
      {
        type: 'ul',
        items: [
          'More banks have moved toward tokenized/OAuth connections.',
          'U.S. industry groups have pushed standardization—though not universally mandated.',
          'Banks have increased scrutiny on "credential sharing" and moved to contract + API programs.',
        ],
      },
      { type: 'html', html: '<strong>What still needs work</strong>' },
      {
        type: 'ul',
        items: [
          'Coverage gaps: long-tail institutions lag.',
          'Inconsistent data metrics and inputs',
          'Issues with reliability: outages, throttling, broken integrations.',
          'Limited to domestic only solutions.',
          'Liability and redress: no clear framework for handling fraud, disputes or even refunds.',
        ],
      },
      {
        type: 'h3',
        text: 'How Quidkey Solves and Simplifies Open Finance, Providing a Global Solution to Help Your Business Grow',
      },
      {
        type: 'p',
        text: 'At Quidkey, we solve the issues inherent in the US open finance ecosystem and handle the complexity so you can be free to focus on your business.',
      },
      {
        type: 'ul',
        items: [
          'Our comprehensive platform coordinates payment orchestration across different geographical markets and automatically selects the best solution for each payment to eliminate coverage gaps, outages and throttling, thus ensuring the highest success rate.',
          'We manage all bank integrations and authentication flows, exclusively utilizing direct tokenized/OAuth connections, instead of data scraping, to protect user data and eliminate the risk of broken integrations.',
          "We've engineered consistent data workflows providing easily managed data parameters.",
          "We've built customizable A2A payment workflows allowing you to manage the flow of funds, refunds and treasury to suit your business needs.",
          'We provide a global solution, supporting currency exchange and cross border payments, and serving you a single interface for your business to start accepting cross-border open finance payments instantly.',
          "Our predictive algorithm automatically identifies and displays the customer's bank at checkout, making the experience faster, more intuitive, and built upon the recognition customers already have with their bank, leading to higher conversion rates and lower cost payments.",
        ],
      },
      {
        type: 'p',
        text: 'Quidkey simplifies payments so you can focus on growing your business. Customize your payment flows, accept payments across borders, support multiple currencies, and go live in minutes.',
      },
      {
        type: 'html',
        html: '<strong>Quidkey vs. Existing Fragmented Open Finance Providers in the US</strong>',
      },
      {
        type: 'table',
        headers: ['', 'Quidkey', 'Existing Fragmented Options in US'],
        rows: [
          [
            'Integration',
            'One-click integration, no technical expertise required',
            'Requires extensive technical expertise and development resources',
          ],
          ['Coverage', 'US, UK, EU, AUS, CAN', 'Limited to domestic solutions only'],
          ['Cross-border & FX', 'Supported with built-in FX management', 'Not supported'],
          [
            'Bank Prediction at Checkout',
            "Proprietary technology surfaces customer's bank automatically at checkout",
            'Customer must choose bank manually from long list, increasing drop off rates',
          ],
          [
            'Customizable Payment Flows',
            'Customize and automate your funds flows to support your business needs',
            'Not supported',
          ],
          [
            'Rewards',
            'Merchants can offer loyalty programs and rewards to encourage bank payments',
            'Not supported',
          ],
          [
            'All major e-commerce platforms (yes, including Shopify)',
            'Open finance solutions available and active on Shopify exclusively with Quidkey',
            'Not supported',
          ],
          ['Refunds', 'One-click refunds supported', 'Requires manual credit via merchant bank account'],
          [
            'Payment Links',
            'Send white-labeled payment links to customers or suppliers',
            'Not supported',
          ],
          [
            'Fraud and reputation checks on consumers',
            'Real-time fraud and consumer reputation checks to reduce "friendly fraud", reversals and chargebacks',
            'Not supported',
          ],
          [
            'Flexible pricing with no commitments',
            'Always - usage based with no rigid contractual commitments',
            'No – must commit to long term contractual obligations and fees',
          ],
        ],
      },
      {
        type: 'p',
        text: 'Existing players in the US market offer fragmented infrastructure built upon screen scraping, uneven security standards and clunky user experiences, falling short of delivering a seamless and secure checkout experience. Quidkey fills that gap by combining real time orchestration, predictive bank selection, secure user authorization, customizable payments workflows, platform integrations, and built in cross-border support for an innovative and globalized open finance solution.',
      },
      { type: 'h3', text: 'Open Finance Benefits for Business and Consumers' },
      { type: 'html', html: '<strong>For Merchants</strong>' },
      {
        type: 'html',
        html: "<ul><li><strong>Customizable flows and Increased liquidity:</strong> Customize your funds flow and direct receivables to enhance operating efficiency. Payments clear with same-day ACH or instant payments (RTP /FedNow), helping improve float and cash flow.</li><li><strong>Greater protections against chargebacks and fraud:</strong> Real time data analytics evaluating consumer profile and reputation. Payments are authenticated by the customer's bank, reducing fraud risk and related disputes. No card network mandated chargebacks.</li><li><strong>Lower fees:</strong> By bypassing card networks and intermediaries, businesses can significantly reduce processing costs.</li></ul>",
      },
      { type: 'html', html: '<strong>For Customers</strong>' },
      {
        type: 'html',
        html: "<ul><li><strong>Stronger protection against fraud:</strong> Every payment requires secure bank authentication, often with biometrics or two factor login. And no card numbers mean there is nothing to steal.</li><li><strong>Faster checkout:</strong> Customers approve payments directly in their banking app.</li><li><strong>Real time control and visibility:</strong> Payments are authorized through the customer's own bank, with instant confirmation and a clear transaction record.</li></ul>",
      },
      { type: 'h2', text: 'Get Started with Quidkey' },
      {
        type: 'html',
        html: "<em><strong>Quidkey is not just another payment provider. It's open finance actually done right.</strong></em>",
      },
      { type: 'p', text: 'Instant payouts. Reduced fraud. Lower fees. Seamless integration.' },
      {
        type: 'p',
        text: 'Go live in minutes and take control of how your business gets paid.',
      },
      {
        type: 'html',
        html: '<strong>Add Quidkey to your checkout today – </strong><a href="https://merchants.quidkey.com/signup">Start Accepting Payments</a>',
      },
    ],
  },
  {
    slug: 'pay-by-bank-refunds-shopify-merchants',
    date: 'February 24, 2026',
    dateISO: '2026-02-24',
    title: 'Pay by Bank Refunds at Quidkey: Everything You Need to Know',
    seoTitle: 'Pay by Bank Refunds for Shopify Merchants | Quidkey',
    description:
      'Quidkey launches Pay by Bank refunds for Shopify merchants. Issue instant refunds from a dedicated balance without manual bank transfers or extra steps.',
    keyword: 'pay by bank refunds',
    author: 'Quidkey Team',
    image: '/images/blog/pay-by-bank-refunds.webp',
    featured: true,
    blocks: [
      {
        type: 'p',
        text: "We've launched Pay by Bank Refunds at Quidkey. Here's everything you need to know.",
      },
      {
        type: 'p',
        text: "Refunds have always been a friction point for online merchants accepting bank payments. Unlike card networks, Pay by Bank payments don't have a built in reversal mechanism, leaving merchants to handle repayments manually.",
      },
      {
        type: 'p',
        text: "Quidkey's refund functionality lets you issue refunds quickly and reliably directly from your Quidkey merchant account without depending on your bank to initiate outbound payments. And now, Shopify merchants can process Pay by Bank refunds directly from the Shopify merchant portal, in exactly the same way as card refunds, no separate system, no extra steps.",
      },
      {
        type: 'p',
        text: "This is done via a dedicated Refund Account, a separate balance you fund and use exclusively for processing refunds. You'll also be able to set rules to automatically allocate a portion of your revenue into your Refund Account, keeping it topped up automatically.",
      },
      {
        type: 'p',
        text: "When you issue a refund, Quidkey checks your refund balance and, if sufficient, executes the refund so the customer receives it instantly. If the balance is insufficient, the refund moves into a pending state and automatically executes once the balance is topped up. What's more, every refund is logged against the original transaction so your records stay clean.",
      },
      {
        type: 'p',
        text: 'Quidkey helps merchants cut payment fees, get paid faster, and increase checkout conversion. Quidkey is an approved payment partner of Shopify.',
      },
      {
        type: 'p',
        text: 'Watch it in action below, or get in touch to see how it works for your business.',
      },
      {
        type: 'youtube',
        videoId: 'C9VWeFozBUM',
        title: 'Pay by Bank Refunds at Quidkey — Product Demo',
      },
    ],
  },
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
    image: '/images/blog/soc2-compliance.webp',
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
    image: '/images/blog/global-clearing-house.webp',
    blocks: [
      {
        type: 'p',
        text: "Founded in early 2023, Quidkey has quickly established itself as a trusted provider of next-generation Account-to-account (A2A) payments. Also known as 'Pay by Bank'. Leveraging AI-powered bank prediction, instant settlement, and a streamlined user experience, Quidkey is redefining how global businesses collect payments.",
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
    seoTitle: 'Quidkey + Tryp.com: Pay by Bank Travel | Quidkey',
    description:
      'Quidkey and Tryp.com partner to deliver instant settlement and 3x lower payment costs for travel bookings using Pay by Bank.',
    keyword: 'pay by bank travel payments',
    author: 'Quidkey Team',
    image: '/images/blog/tryp-partnership.webp',
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
    seoTitle: 'Real-Time Settlement & Instant Refunds | Quidkey',
    description:
      'Learn how Open Banking enables real-time settlement, seamless refunds, and loyalty rewards to improve merchant cash flow by 15-30%.',
    keyword: 'real-time settlement',
    author: 'Quidkey Team',
    image: '/images/blog/refunds-rewards-settlement.webp',
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
    image: '/images/blog/transfermate-partnership.webp',
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
    image: '/images/blog/pay-by-bank.webp',
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
    seoTitle: 'Open Banking Payments UK: Merchant Guide | Quidkey',
    description:
      'Accept Open Banking payments in the UK with instant settlement, no chargebacks, and lower fees. Complete guide for UK merchants.',
    keyword: 'open banking payments UK',
    author: 'Quidkey Team',
    image: '/images/blog/open-banking-uk.webp',
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
    seoTitle: 'A2A Payments: Cut Transaction Fees by 70% | Quidkey',
    description:
      'A2A payments offer 70% lower fees than cards, instant settlement, and zero chargebacks. Learn why UK merchants are switching.',
    keyword: 'A2A payments',
    author: 'Quidkey Team',
    image: '/images/blog/a2a-payments.webp',
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
        text: "With Quidkey's low-cost model, you can reduce transaction fees by up to 70% compared to card payments. No hidden fees or nasty surprises.",
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

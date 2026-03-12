import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
  head: () =>
    buildSeo({
      title: 'Website Terms of Use: Acceptable Use | Quidkey',
      description:
        "Read Quidkey's website terms, acceptable use rules, disclaimers, and third-party link guidance, plus how to contact us with questions.",
      path: '/terms',
    }),
})

function TermsPage() {
  return (
    <PageLayout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Quidkey - End-User Terms &amp; Conditions
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-12">
            <span>Last updated September 25, 2024</span>
          </div>

          <div className="space-y-10">
            {/* Quidkey - Terms and Conditions */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Quidkey - Terms and Conditions</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <p>
                  Thank you for visiting our website (together with any of our other websites,
                  sub-domains and mobile applications, the &ldquo;<strong>Website</strong>&rdquo;) and
                  for using our Services (defined below). Access to our Services and our Website, the
                  home page of which is located at{' '}
                  <a
                    className="text-primary hover:underline"
                    href="https://www.quidkey.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.quidkey.com
                  </a>
                  , is offered to you, the individual end-user (you may also be referred to herein as a
                  &ldquo;<strong>Consumer</strong>&rdquo;) by Bnqz Inc. and its subsidiaries and
                  affiliates (collectively, &ldquo;<strong>Quidkey</strong>&rdquo;, the &ldquo;
                  <strong>Company</strong>&rdquo; or &ldquo;<strong>we</strong>&rdquo;, &ldquo;
                  <strong>us</strong>&rdquo;, &ldquo;<strong>our</strong>&rdquo;)
                  <strong> </strong>subject to your acceptance of these Terms and Conditions (the
                  &ldquo;<strong>Terms</strong>&rdquo;)<strong>.</strong>
                </p>
                <p>
                  Please read these Terms carefully. These Terms are a legal agreement between you and
                  us and shall govern your access to and use of the Services and the Website, including
                  features and content available on the Website and the websites of our merchant
                  partners and our financial institution partners with respect to the Services. Your
                  access to, review of, and/or use of the Website and the Services is conditioned on
                  your acceptance of and compliance with these Terms and any other policies or terms
                  referenced herein or posted on the Website or throughout the Services. You also
                  acknowledge that you have read and understand our{' '}
                  <a className="text-primary hover:underline" href="/privacy">
                    Privacy Notice
                  </a>{' '}
                  (the &ldquo;<strong>Privacy Notice</strong>&rdquo;) for the Website and the Services.
                  It explains how we&apos;ll collect and use your personal information to provide you
                  with the Services and access to the Website.
                </p>
                <p>
                  If you have any questions about these terms, please contact customer support at{' '}
                  <a className="text-primary hover:underline" href="mailto:support@quidkey.com">
                    support@quidkey.com
                  </a>
                  .
                </p>
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    <p>The Services</p>
                    <ol className="list-decimal pl-6 space-y-4 mt-2">
                      <li>
                        Quidkey provides proprietary SaaS payment technology, which allows merchants to
                        offer, and Consumers to access, card network and cardless payment solutions and
                        consumer finance solutions (including but not limited to, account-to-account
                        transfers, FX and remittance services, direct debit transactions, consumer
                        loans, closed-end installment loans and payment deferral options) (collectively,
                        &ldquo;Consumer Finance Products&rdquo;) provided by certain of our payment
                        service partners and/or directly from your own preferred financial institution
                        (each, a &ldquo;Financial Institution&rdquo;) at the point of purchase both
                        in-store or on a given merchant&apos;s e-commerce checkout page (collectively,
                        the &ldquo;Service(s)&rdquo;).
                      </li>
                      <li>
                        The Service leverages the banking and payments infrastructure of our Financial
                        Institution partners and utilizes application programming interface
                        (&ldquo;API&rdquo;) integration between certain banking/financial institutions,
                        payment service providers, e-commerce merchant servers and point-of-sale
                        terminals to identify your retail banking relationships and present the Consumer
                        Finance Products offered by your Financial Institutions. The Service also
                        provide both cardless and card-network payment gateway services, including
                        collecting and transmitting Consumer information to the Consumer&apos;s Financial
                        Institution and instructing Financial Institutions to initiate fund transfers to
                        merchant accounts on your behalf, as well as merchant onboarding and
                        verification.
                      </li>
                      <li>
                        <strong>No Responsibility for Consumer Financial Products. </strong>All Consumer
                        Finance Products, payment solutions and related transactions will be offered,
                        provided, consummated, serviced and administered by our payment service
                        providers and/or your Financial Institutions and their respective transaction
                        partners. Our Services are limited to SaaS technologies that facilitate, among
                        other things, distribution of certain payment solutions and Commercial Finance
                        Products to you by your Financial Institutions. Quidkey does not provide
                        Consumer Finance Products, financial advice, lending, payment initiation, money
                        transfer, account settlement, payment processing, payment services or any other
                        banking or financial services of any kind. All terms governing any payment
                        solution or Consumer Finance Product accessed by you through our service
                        (including all costs, fees, interest rates, repayment terms and default terms)
                        shall be governed by separate agreement between you and your Financial
                        Institution and/or relevant payment service provider, as applicable.{' '}
                        <strong>
                          Accordingly, we encourage you to review the terms governing any payment
                          solutions or Consumer Finance Products carefully.
                        </strong>
                      </li>
                      <li>
                        Third Party Terms and Policies. For the avoidance of doubt, for the purposes of
                        these Terms, the Financial Institutions, merchants and other third-party service
                        providers affiliated with our Services or Website are companies that may have
                        executed agreements with the Company to receive, utilize, provide aspects of
                        and/or participate in the Service. They may have additional terms and conditions
                        governing access to and use of their own services, websites and data practices,
                        and any payment solutions, Consumer Finance Products or related transactions. We
                        are not responsible for their service offerings, websites, practices, the terms
                        of any payment solutions, Consumer Finance Products or related transactions or
                        your relationships and/or interactions with Financial Institutions or merchants.
                        Accordingly, we encourage you to read their terms and conditions and privacy
                        policies carefully.
                      </li>
                    </ol>
                  </li>
                </ol>
              </div>
            </section>

            {/* General Use and Eligibility */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">General Use and Eligibility</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    By accessing the Website and/or using the Services, you agree to be bound by these
                    Terms and our Privacy Notice, including, in each case, any subsequent changes
                    published by Quidkey, as well as any additional service terms governing your use of
                    our Website or a particular aspect of the Service, all of which are incorporated
                    herein by reference. IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT USE THE
                    SERVICES OR ACCESS THE WEBSITE.
                  </li>
                  <li>
                    You must be 18 years or older. Quidkey does not target our Service or the Website
                    to children under 18, and we do not permit any Consumers under 18 to use our
                    Service. By using our Website or any aspect of the Service, you warrant that you are
                    18 years of age or older and have the legal authority to enter into these Terms.
                  </li>
                </ol>
              </div>
            </section>

            {/* Restrictions */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Restrictions</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Your use of the Website and the Service must not violate any applicable laws,
                    including copyright or trademark laws, export control laws, or other laws in your
                    jurisdiction. You are responsible for making sure that your use of the Website and
                    the Service is in compliance with all applicable laws, any applicable regulations,
                    and these Terms. You agree not to access or use the Website or the Service for any
                    unlawful purpose or for any purpose other than that for which Quidkey makes each of
                    the Website and Service available.
                  </li>
                  <li>
                    <p>
                      You acknowledge and agree that you shall not under any circumstances:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>
                        engage in any activities in connection with the Website or the Services that
                        violate any applicable law, statute, regulation, ordinance or these Terms or any
                        other agreement or policy that you have with Quidkey;
                      </li>
                      <li>
                        provide false, inaccurate, fraudulent, or misleading information through the
                        Website or the Service, including in connection with any Consumer verification
                        process or any transaction that utilizes the Service ;
                      </li>
                      <li>
                        use any device, software, routine, file, or other tool or technology, including
                        but not limited to any viruses, trojan horses, worms, time bombs, or cancelbots,
                        intended to damage or interfere with the Website or the Services or to
                        surreptitiously intercept or expropriate any data from the Website or the
                        Service, or otherwise knowingly transmit on or through the Website or the
                        Service any viruses, trojan horses, worms, time bombs, or cancelbots or other
                        malicious or harmful code or attachment;
                      </li>
                      <li>
                        use any robot, spider, crawler, scraper or similar applications or automated
                        means to access the Website or the Services for any purpose;
                      </li>
                      <li>
                        access the Services, Website or any related systems with fraudulent information,
                        passwords or credentials;
                      </li>
                      <li>
                        impersonate any person or entity, including, without limitation, (i) any other
                        Consumer in connection with the use of the Website or Services or (ii) any of
                        our employees or representatives, including through false association with
                        Quidkey, or by fraudulently misrepresenting your identity or organization&apos;s
                        purpose;
                      </li>
                      <li>
                        sublicense, transfer or assign the Service or any part thereof to any third
                        party, with or without consideration;
                      </li>
                      <li>
                        knowingly interfere with, burden, or disrupt the Website&apos;s or the
                        Service&apos;s functionality or take any action that imposes an unreasonable or
                        disproportionately large load on Quidkey&apos;s infrastructure, including but
                        not limited to denial of service attacks, &ldquo;spam,&rdquo; or any other such
                        unsolicited overload technique;
                      </li>
                      <li>
                        work around any technical limitations of the Website or the Service, or use any
                        tool to enable features or functionalities that are otherwise disabled,
                        inaccessible or undocumented in the Website or the Service;
                      </li>
                      <li>
                        breach the security of the Website or the Service, identify, probe, or scan any
                        security vulnerabilities in the Website or the Service other than such activities
                        performed in mutual agreement with Quidkey;
                      </li>
                      <li>
                        attempt to disrupt or tamper with Quidkey&apos;s servers in ways that could harm
                        our Website or Service, to place undue burden on Quidkey&apos;s servers through
                        automated means, or to access Quidkey&apos;s Website or Service in ways that
                        exceed your authorization;
                      </li>
                      <li>
                        copy, reproduce, modify, alter, republish, mirror, frame, adapt, create
                        derivative works, transmit, distribute or resell in any way any the Services,
                        Service Assets or any other material or information from Quidkey;
                      </li>
                      <li>
                        decompile, disassemble, reverse engineer, or otherwise attempt to identify the
                        underlying source code of any aspect of the Services or the Website; or
                      </li>
                      <li>
                        access and use the Website or the Service for an unlawful purpose or in order to
                        develop, or create, or permit others to develop or create, any product or
                        service competing with the Services.
                      </li>
                    </ol>
                  </li>
                  <li>
                    <p>Ownership and Intellectual Property</p>
                    <ol className="list-decimal pl-6 space-y-4 mt-2">
                      <li>
                        The Website and the Service are each a proprietary offering of Quidkey,
                        protected under contractual law, copyright laws and international copyright
                        treaties, trade secret law and other intellectual property rights of general
                        applicability. All intellectual property rights related to the Website and
                        Services shall be owned by Quidkey absolutely and in their entirety. The Website
                        and the Services are offered to the Consumer for use and access only in
                        accordance with these Terms and is not sold or licensed in any other way. You
                        acknowledge and agree that all rights, title, and interest, including database
                        rights, patents, copyrights, trademarks (whether registered or unregistered),
                        service marks, trade names, trade secrets, design rights (whether registered or
                        unregistered) know-how, moral rights, and all similar rights that may exist now
                        or later in any jurisdiction, including without limitation any applications and
                        registrations for the foregoing and any goodwill associated with any of the
                        foregoing (collectively, &ldquo;Intellectual Property Rights&rdquo;), in and to
                        the Website and each of the Services, including all of the content displayed on
                        or accessed via any aspect of the Service or the Website, including, without
                        limitation the Quidkey name, logos, designs, domain names, web designs, text,
                        graphics, icons, scripts, service marks, features, functions, button icons,
                        images, software, data compilations and other distinctive brand features, moving
                        images, sound, illustrations, and the compilation and organization thereof
                        (collectively, &ldquo;Content&rdquo;), the computer code, SDKs, application
                        programming interfaces (APIs), modules, widgets, data (including any service
                        data), graphic design, layout and the user interfaces of the Service
                        (collectively with the Content, the &ldquo;Service Assets&rdquo;), are and will
                        remain at all times, owned by, controlled by or licensed to, Quidkey. All such
                        Intellectual Property Rights are and will remain the exclusive property of
                        Quidkey and its subsidiaries, affiliates, partners and licensors, and are
                        protected by United States and international laws, including by contractual
                        rights, trademark, copyright, moral rights and other laws relating to
                        intellectual property rights.
                      </li>
                      <li>
                        Except for your access to and use of the Website and the Service in accordance
                        with these Terms, Quidkey does not grant or assign to the Consumer any other
                        license, right, title, or interest in or to the Website or the Service, or the
                        Intellectual Property Rights. The Website, the Services and the Service Assets
                        may only be used for the intended purpose for which each is being made available.
                        Except as explicitly provided herein, you may not use, copy, duplicate,
                        reproduce, republish, upload, post, transmit, distribute, sell, re-sell, modify
                        or otherwise access or exploit the Website, the Content or any other Service
                        Assets, including the Quidkey trademarks, in any way, including in advertising
                        or publicity pertaining to distribution of materials on the Service, without
                        Quidkey&apos;s prior written consent. The use of the Service Assets on any other
                        website is not permitted. The Service and its Content and any other Service
                        Assets, and all related rights shall remain the exclusive property of Quidkey or
                        its licensors.
                      </li>
                      <li>
                        The Consumer may provide Quidkey with feedback, including information pertaining
                        to bugs, errors and malfunctions of the Service, performance of the Service, and
                        accuracy of the Service, the Service&apos;s compatibility and interoperability,
                        and information or content concerning enhancements, changes, or additions to the
                        Service that the Consumer requests, desires or suggests. The Consumer hereby
                        assigns, without charge, all right, title, and interest in and to such feedback
                        to Quidkey, including the right to make commercial use thereof, for any purpose
                        Quidkey deems appropriate.
                      </li>
                    </ol>
                  </li>
                  <li>
                    <p>Disclaimer; Indemnity; Limitation of Liability</p>
                    <ol className="list-decimal pl-6 space-y-4 mt-2">
                      <li>
                        Disclaimer. THE SERVICES, AND THE WEBSITE, MATERIALS, PRODUCTS AND THE CONTENT
                        PROVIDED ON, THROUGH, OR IN CONNECTION WITH THE SERVICE OR THE WEBSITE OR
                        OTHERWISE PROVIDED BY US AND ALL OTHER QUIDKEY SERVICES PROVIDED HEREUNDER ARE
                        PROVIDED SOLELY ON AN &ldquo;AS IS&rdquo; BASIS WITHOUT ANY WARRANTIES OF ANY
                        KIND. QUIDKEY DOES NOT MAKE, AND HEREBY DISCLAIMS, ANY AND ALL OTHER EXPRESS AND
                        IMPLIED WARRANTIES, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY, QUALITY,
                        PERFORMANCE, SECURITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT,
                        TITLE, OR ARISING FROM COURSE OF DEALING, USAGE, OR TRADE PRACTICE, IN
                        CONNECTION WITH THESE TERMS, THE WEBSITE OR THE SERVICE. QUIDKEY DOES NOT
                        REPRESENT OR WARRANT THAT THE SERVICE OR ACCESS TO THE WEBSITE WILL BE
                        UNINTERRUPTED, ERROR-FREE, COMPLETELY SECURE OR THAT THAT DEFECTS WILL BE
                        CORRECTED, OR THAT THE WEBSITE OR THE SERVICES ARE FREE OF VIRUSES OR OTHER
                        HARMFUL COMPONENTS. TO FURTHER CLARIFY, QUIDKEY DOES NOT MAKE ANY WARRANTIES OR
                        REPRESENTATIONS REGARDING THE COMPLETENESS, CORRECTNESS, ACCURACY, ADEQUACY,
                        USEFULNESS, TIMELINESS OR RELIABILITY OF THE SERVICE, THE WEBSITE OR ANY
                        INFORMATION QUIDKEY PROVIDES, OR ANY OTHER WARRANTY. THE INFORMATION, MATERIALS,
                        PRODUCTS AND CONTENT PROVIDED ON OR THROUGH THE WEBSITE OR THE SERVICE MAY BE
                        OUT OF DATE, AND NEITHER QUIDKEY NOR ANY OF ITS AFFILIATES MAKES ANY COMMITMENT
                        OR ASSUMES ANY DUTY TO UPDATE SUCH INFORMATION, MATERIALS, PRODUCTS OR CONTENT.
                        THE FOREGOING EXCLUSIONS OF IMPLIED WARRANTIES DO NOT APPLY TO THE EXTENT
                        PROHIBITED BY APPLICABLE LAW. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN,
                        OBTAINED FROM QUIDKEY OR THROUGH QUIDKEY&apos;S WEBSITE, PRODUCTS AND SERVICES
                        WILL CREATE ANY WARRANTY NOT EXPRESSLY MADE HEREIN.
                      </li>
                    </ol>
                  </li>
                  <li>
                    Indemnification. You shall defend, indemnify and hold harmless Quidkey and its
                    respective directors, officers, employees, and subcontractors, against any damages,
                    liabilities, losses, costs, expenses and payments, including reasonable
                    attorney&apos;s fees and legal expenses, arising from or connected to claims by
                    third parties (including, but not limited to, merchants) related to or in connection
                    with (i) your use of the Services and/or the Website, (ii) your violation of any
                    term or condition of these Terms, (iii) your violation of any third-party rights,
                    including without limitation any right of privacy, publicity rights or intellectual
                    property rights, (iv) your violation of any applicable law or regulation or any
                    country, (v) your negligence, misconduct, recklessness, errors or omissions, and
                    (vi) any other party&apos;s access and use of the Service with any of your unique
                    email address, phone number, or other appropriate unique identifiers. Quidkey shall
                    expeditiously notify you of an indemnifiable claim, give you control over the
                    defense and settlement of the indemnifiable claim, and cooperate with you (at your
                    expense) in the defense and settlement of the claim. Each party shall refrain from
                    taking any steps that are reasonably likely to prejudice the other party in
                    connection with the indemnifiable claim.
                  </li>
                </ol>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability.</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW AND EXCEPT IN THE EVENT OF
                  QUIDKEY&apos;S INTENTIONAL MISCONDUCT, QUIDKEY, INCLUDING ITS EMPLOYEES, DIRECTORS,
                  OFFICERS, SHAREHOLDERS, ADVISORS, AGENTS AND ANYONE ACTING ON ITS BEHALF, WILL NOT
                  BE RESPONSIBLE OR LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL,
                  STATUTORY OR PUNITIVE DAMAGES, LOSSES (INCLUDING LOSS OF PROFIT, LOSS OF BUSINESS OR
                  BUSINESS OPPORTUNITIES AND LOSS OF DATA), COSTS, EXPENSES AND PAYMENTS, EITHER IN
                  TORT, CONTRACT, OR IN ANY OTHER FORM OR THEORY OF LIABILITY (INCLUDING NEGLIGENCE),
                  ARISING FROM, OR IN CONNECTION, WITH THESE TERMS, ANY USE OF, OR THE INABILITY TO USE
                  THE SERVICE, THE SERVICE DATA OR THE WEBSITE, ANY RELIANCE UPON THE WEBSITE, THE
                  SERVICE, ANY PAYMENT PLANS OR OTHER CONSUMER FINANCE PRODUCTS, OR ANY ERROR,
                  INCOMPLETENESS, INCORRECTNESS OR INACCURACY OF THE WEBSITE, THE SERVICE, ANY RELATED
                  SERVICE DATA OR ANY CONSUMER FINANCE PRODUCT. TO THE MAXIMUM EXTENT PERMITTED BY
                  APPLICABLE LAW, AND EXCEPT IN THE EVENT OF QUIDKEY&apos;S INTENTIONAL MISCONDUCT,
                  YOU AGREE THAT YOUR SOLE REMEDY IS TO CEASE USING THE WEBSITE AND THE SERVICES. IN
                  NO EVENT SHALL THE TOTAL AND AGGREGATE LIABILITY OF QUIDLEY AND ITS EMPLOYEES,
                  DIRECTORS, OFFICERS, SHAREHOLDERS, ADVISORS, AND ANYONE ACTING ON THEIR BEHALF, FOR
                  DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT, THE WEBSITE, THE SERVICE, OR THE
                  SERVICE DATA, FOR ALL DAMAGES, LOSSES, AND CAUSES OF ACTION WHETHER IN CONTRACT, TORT
                  (INCLUDING, BUT NOT LIMITED TO, NEGLIGENCE), OR OTHERWISE EXCEED THE GREATER OF NET
                  TRANSACTION FEES ACTUALLY RECEIVED BY QUIDKEY IN CONNECTION WITH YOUR USE OF THE
                  SERVICES DURING THE PRECEDING 60 DAYS.
                </p>
              </div>
            </section>

            {/* Relationship of the Parties */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Relationship of the Parties; No Professional Advice
              </h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    The relationship between the parties hereto is strictly that of independent
                    contractors, and neither party is an agent, partner, joint ventures, or employee of
                    the other.
                  </li>
                  <li>
                    Any information or data contained in or made available through the Services or the
                    Website is provided for informational purposes only and cannot substitute for the
                    services of trained professionals. Quidkey does not give professional advice and is
                    not in the business of providing legal, financial, accounting, taxation or other
                    professional services or advice. Consumer should independently verify and research
                    or obtain independent financial advice from a trusted and competent professional in
                    connection with, any payment solution, Consumer Finance Product, or any information
                    or data contained in or made available through the Services or Website for the
                    purpose of making any financial decisions or otherwise. Quidkey expressly disclaims
                    any liability, whether in contract, tort (including negligence) or otherwise, in
                    respect of any damage, expense or other loss Consumer may suffer arising out of such
                    information or data, or any use of or reliance upon such information or data.
                  </li>
                </ol>
              </div>
            </section>

            {/* Dispute Resolution and Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Dispute Resolution and Governing Law</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    <p>Binding Individual Arbitration.</p>
                    <ol className="list-decimal pl-6 space-y-4 mt-2">
                      <li>
                        You and Quidkey agree that any and all claims, controversies, or dispute between
                        you and Quidkey, its processors, suppliers or licensors (or their respective
                        affiliates, agents, directors or employees), whether arising before or during
                        the effective period of these Terms, and including any claim, controversy, or
                        dispute based on any conduct of you or Quidkey that occurred before the
                        effective date of these Terms, including any claims relating in any way to these
                        Terms or the Services, or any other aspect of our relationship (collectively,
                        &ldquo;<strong>Disputes</strong>&rdquo; and each a &ldquo;
                        <strong>Dispute</strong>&rdquo;), shall be resolved exclusively through
                        arbitration by a neutral arbitrator who has the power to award the same
                        individual damages and individual relief that a court can, except that you may
                        assert individual claims in small claims court, if your claims qualify. ANY
                        ARBITRATION UNDER THESE TERMS WILL ONLY BE ON AN INDIVIDUAL BASIS AND NOT AS
                        PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION OR
                        PROCEEDING. CLASS ARBITRATIONS, CLASS ACTIONS, REPRESENTATIVE ACTIONS, AND
                        CONSOLIDATION WITH OTHER ARBITRATIONS ARE NOT PERMITTED. YOU WAIVE ANY RIGHT TO
                        HAVE YOUR CASE DECIDED BY A JURY. Also, the arbitrator may award relief
                        (including monetary, injunctive, and declaratory relief) only in favor of the
                        individual party seeking relief and only to the extent necessary to provide
                        relief necessitated by that party&apos;s individual claim(s). If any provision
                        of this arbitration agreement is found unenforceable, the unenforceable provision
                        will be severed, and the remaining arbitration terms will be enforced (but in no
                        case will there be a class or representative arbitration).
                      </li>
                      <li>
                        <strong>Pre-arbitration dispute resolution</strong>. Most concerns can be
                        resolved quickly and to all parties&apos; satisfaction by emailing our support
                        team at{' '}
                        <a
                          className="text-primary hover:underline"
                          href="mailto:support@quidkey.com"
                        >
                          support@quidkey.com
                        </a>
                        . If such efforts prove unsuccessful, a party who intends to seek arbitration
                        must first send to the other, by certified mail, a written Notice of Dispute
                        (&ldquo;<strong>Notice</strong>&rdquo;). The Notice to Quidkey should be sent to
                        480 NE 31st Street, Unit 1507, Miami, Florida 33137, Attn: General Counsel,
                        with email copy to{' '}
                        <a className="text-primary hover:underline" href="mailto:legal@quidkey.com">
                          legal@quidkey.com
                        </a>
                        . The Notice must (i) describe the nature and basis of the claim or dispute and
                        (ii) set forth the specific relief sought. If you and Quidkey do not resolve the
                        claim within sixty (60) calendar days after the Notice is received, you or
                        Quidkey may commence an arbitration proceeding. During the arbitration, the
                        amount of any settlement offer made during any pre-arbitration proceedings by
                        Quidkey or you shall not be disclosed to the arbitrator until after the
                        arbitrator determines the amount, if any, to which you or Quidkey is entitled.
                      </li>
                      <li>
                        <strong>Arbitration Procedures</strong>. If we are not able to resolve the
                        Dispute by informal negotiation, all Disputes will be resolved finally and
                        exclusively by binding individual arbitration with a single arbitrator (the
                        <strong> &ldquo;Arbitrator</strong>&rdquo;) administered by the American
                        Arbitration Association (https://www.adr.org) according to this Section and the
                        commercial arbitration rules for that forum, except you and Quidkey will have
                        the right to file early for summary dispositive motions and to request that the
                        AAA&apos;s Expedited Procedures apply regardless of the claim amount. Except as
                        set forth above, the Arbitrator shall be responsible for determining all
                        threshold arbitrability issues, including issues relating to whether these Terms
                        (or any aspect thereof) are enforceable, unconscionable or illusory and any
                        defense to arbitration, including waiver, delay, laches, or estoppel. In
                        accordance with the AAA Rules, the party initiating the arbitration (either you
                        or us) is responsible for paying the applicable filing fee.
                      </li>
                      <li>
                        The Federal Arbitration Act, 9 U.S.C. &sect;&sect; 1-16, including its
                        procedural provisions, shall apply. The venue of arbitration shall be in Los
                        Angeles, California, United States of America, but the arbitration shall, to the
                        greatest extent possible, be held by videoconference or teleconference, and by
                        written submission. The language of the arbitration shall be the English language
                        and the number of arbitrators shall be one. The Arbitrator&apos;s award will be
                        binding on the parties and may be entered as a judgment in any court of
                        competent jurisdiction. Each of the parties shall maintain the confidential
                        nature of the arbitration and shall not (without the prior written consent of
                        the other party) disclose to any third party the fact, existence, content, award,
                        or other result of the arbitration, except as may be necessary to enforce,
                        enter, or challenge such award in a court of competent jurisdiction or as
                        otherwise required by applicable law. While an arbitrator may award declaratory
                        or injunctive relief, the Arbitrator may do so only with respect to the
                        individual party seeking relief and only to the extent necessary to provide
                        relief warranted by the individual party&apos;s claim. The Arbitrator&apos;s
                        decision and judgment thereon will not have a precedential or collateral estoppel
                        effect.
                      </li>
                      <li>
                        You may reject this provision, in which case only a court may be used to resolve
                        any Dispute. To reject this provision, you must send us an opt-out notice within
                        thirty (30) days after your first use of the Website or the Service, whichever
                        occurs first. The opt-out notice must be sent to{' '}
                        <a className="text-primary hover:underline" href="mailto:legal@quidkey.com">
                          legal@quidkey.com
                        </a>
                        , expressly state your intention to opt out, and include your name, address,
                        phone number and the email address(es) you used to access the Services. This is
                        the only way of opting out of this provision. Opting out will not affect any
                        other aspect of these Terms, or the Services, and will have no effect on any
                        other or future agreements you may reach to arbitrate with us.
                      </li>
                      <li>
                        Any action or proceeding by you relating to any Dispute must commence within one
                        year after the cause of action accrues.
                      </li>
                    </ol>
                  </li>
                  <li>
                    Governing Law. These Terms, Consumer&apos;s use of the Website and Services, and
                    any Dispute will be governed by the Federal Arbitration Act, as set forth above, and
                    laws of the State of Delaware and/or applicable federal law, without regard to the
                    choice of law or conflicts of law principles thereof that would cause the
                    application of the laws of any other jurisdiction. Subject to and without waiver of
                    the arbitration provisions above, you agree that any judicial proceedings arising
                    out of or relating to your use of the Services or these Merchant Terms will be
                    brought, and you hereby consent to the exclusive jurisdiction of the Delaware Court
                    of Chancery and any state appellate court therefrom within the state of Delaware
                    (unless the Delaware Court of Chancery shall decline to accept jurisdiction over a
                    particular matter, in which case, in any Delaware State or Federal court within the
                    state of Delaware).
                  </li>
                  <li>
                    Waiver of Jury Trial. SUBJECT TO AND WITHOUT WAIVER OF THE ARBITRATION PROVISIONS
                    ABOVE, YOU HEREBY IRREVOCABLY WAIVE ALL RIGHT TO TRIAL BY JURY IN ANY ACTION,
                    PROCEEDING OR COUNTERCLAIM (WHETHER BASED ON CONTRACT, TORT OR OTHERWISE) ARISING
                    OUT OF OR RELATING TO THE SERVICE, THE WEBSITE OR THESE TERMS, OR THE ACTIONS OF
                    QUIDKEY IN THE ADMINISTRATION, PERFORMANCE AND ENFORCEMENT HEREOF. YOU AGREE THAT
                    WE MAY FILE A COPY OF THIS SECTION 8.3 WITH ANY COURT AS WRITTEN EVIDENCE OF THE
                    KNOWING, VOLUNTARY AND BARGAINED-FOR AGREEMENT BY YOU TO IRREVOCABLY TO WAIVE
                    TRIAL BY JURY.
                  </li>
                  <li>
                    Notwithstanding the foregoing, Quidkey may assert a claim against any user of the
                    Service pursuant to the indemnity in Section &lrm;5.2, in any court adjudicating a
                    third party claim covered by the indemnity in Section &lrm;5.2.
                  </li>
                </ol>
              </div>
            </section>

            {/* Miscellaneous */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Miscellaneous</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Privacy. Please review our privacy policy which is available at{' '}
                    <a className="text-primary hover:underline" href="/privacy">
                      www.quidkey.com/privacy
                    </a>
                    . By accessing our Website or using our Services, you consent to the practices set
                    forth in our privacy policies.
                  </li>
                  <li>
                    <p>Consent to Electronic Communication.</p>
                    <ol className="list-decimal pl-6 space-y-4 mt-2">
                      <li>
                        By accessing the Website or otherwise using the Service, you consent to
                        receiving electronic communications, including electronic notices, from Quidkey.
                        Quidkey may provide all communications in electronic form. These electronic
                        communications may include administrative messages, disclosures, agreements and
                        policies required to use the Website or Services, notices about applicable fees
                        and charges, payment authorizations, transactional information and receipts, and
                        any other information concerning or related to the Service or the Website
                        (collectively, &ldquo;<strong>Communications</strong>&rdquo;). These electronic
                        Communications are part of your relationship with Quidkey. You agree that any
                        notices, agreements, disclosures or other Communications that we send you
                        electronically will satisfy any legal communication requirements, including any
                        requirements under the U.S. Federal Electronic Signatures in Global and National
                        Commerce Act (&ldquo;<strong>ESIGN Act</strong>&rdquo;), the Delaware Uniform
                        Electronic Transactions Act (&ldquo;<strong>DUETA</strong>&rdquo;), or any other
                        similar state laws based on the Uniform Electronic Transactions Act, and any
                        comparable law, regulation or directive in alternative jurisdictions, or any or
                        any other requirements that such communications be in writing.
                      </li>
                      <li>
                        In order to and retain electronic Communications, you will need the following
                        computer hardware and software: (i) a computer or mobile device with internet or
                        mobile connectivity; (ii) for website-based Communications, a recent web-browser
                        that includes 256-bit encryption, with cookies enabled; (iii) (a) for mobile or
                        application based Communications, a recent device operating system that supports
                        mobile messaging, downloading and applications and (b) the most recent versions
                        of Apple Safari or Google Chrome for iOS or Android OS; and (iv) a valid email
                        address. By consenting to these Terms, you are confirming that you have access to
                        the necessary equipment and are able to receive, open, and print or download a
                        copy of any Communications for your records. You may print or save a copy of
                        these Communications for your records as they may not be accessible online at a
                        later date.
                      </li>
                      <li>
                        If, after you consent to receive Communications electronically, you would like a
                        paper copy of a Communication we previously sent you, you may request a copy
                        within 180 days of the date we provided the Communication to you by contacting
                        us as described herein. We will send your paper copy to you by U.S. mail. In
                        order for us to send you paper copies, you must provide and/or confirm your
                        current street address and email address.
                      </li>
                      <li>
                        <strong>
                          It is your responsibility to keep your primary email address up to date so that
                          Quidkey can communicate with you electronically.
                        </strong>{' '}
                        You understand and agree that if Quidkey sends you an electronic Communication,
                        but you do not receive it because your primary email address on file is
                        incorrect, out of date, blocked by your service provider, or you are otherwise
                        unable to receive electronic Communications, Quidkey will be deemed to have
                        provided the Communication to you. Please note that if you use a spam filter
                        that blocks or re-routes emails from senders not listed in your email address
                        book, you must add Quidkey to your email address book so that you will be able
                        to receive the Communications we send to you.
                      </li>
                    </ol>
                  </li>
                  <li>
                    Electronic Execution of Assignments and Certain Other Documents. You agree that any
                    document to be signed in connection with your use of the Website, the Service or any
                    transactions contemplated thereby shall be deemed to include electronic signatures,
                    electronic consents and contract formations on electronic platforms approved by
                    Quidkey, or the keeping of records in electronic form, each of which shall be of the
                    same legal effect, validity or enforceability as a manually executed signature or
                    the use of a paper-based recordkeeping system, as the case may be, to the extent and
                    as provided for in any applicable law, including the ESIGN Act, the DUETA, or any
                    other comparable law, regulation or directive in alternative jurisdictions.
                  </li>
                  <li>
                    No Assignment. Unless expressly authorized by Quidkey in writing, these Term, and
                    any rights and licenses granted hereunder, may not be transferred or assigned by you
                    and any attempted transfer or assignment shall be null and void.
                  </li>
                  <li>
                    Changes to the Agreement. Quidkey may change these Terms at any time, in our sole
                    discretion. Such updates may be required to enhance our Services, our Website or to
                    comply with applicable law. We will post the updated terms to{' '}
                    <a className="text-primary hover:underline" href="/terms">
                      www.quidkey.com/terms
                    </a>
                    . Consumer use of the Website or Service after such change constitutes its agreement
                    to be bound by these Terms, as they are amended or updated from time to time. Your
                    sole and exclusive remedy in the event you do not accept the Terms as they are
                    amended or updated from time to time is to cease your access to and use of the
                    Services and the Website.
                  </li>
                  <li>
                    Complete Agreement and Severability. These Terms constitute the entire and complete
                    agreement between Quidkey and the Consumer concerning the subject matter herein and
                    supersede all prior oral or written statements, understandings, negotiations, and
                    representations with respect to the subject matter herein. In the event that any of
                    the provisions in the Terms are held to be invalid or unenforceable in whole or in
                    part, all other provisions will nevertheless continue to be valid and enforceable
                    with the invalid or unenforceable parts severed from the remainder of the Terms.
                  </li>
                  <li>
                    No Waiver. Any waiver of a provision of these Terms will only be valid if provided
                    in writing and applies only to the specific occurrence so waived. Failure to enforce
                    any provision will not constitute a waiver.
                  </li>
                </ol>
              </div>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}


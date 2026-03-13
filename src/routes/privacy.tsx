import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
  head: () =>
    buildSeo({
      title: 'Website Privacy Notice: Data Use & Rights | Quidkey',
      description:
        'How Quidkey collects, uses, and protects personal data when you browse this website, contact our team, or apply for a role.',
      path: '/privacy',
    }),
})

function PrivacyPage() {
  return (
    <PageLayout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Quidkey - Website Privacy Notice
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-12">
            <span>Last updated June 2025</span>
          </div>

          <div className="space-y-10">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <p>
                  Bnqz Inc. and its affiliates (collectively, &ldquo;<strong>Quidkey</strong>&rdquo;,
                  the &ldquo;<strong>Company</strong>&rdquo; or &ldquo;<strong>we</strong>&rdquo;,
                  &ldquo;<strong>us</strong>&rdquo;, &ldquo;<strong>our</strong>&rdquo;) is committed
                  to maintaining the security, confidentiality and integrity of the personal data in
                  our control and complying with applicable data protection laws, including the EU and
                  the UK General Data Protection Regulation (&ldquo;<strong>GDPR</strong>&rdquo;) and
                  the California Consumer Privacy Act of 2018 (&ldquo;<strong>CCPA</strong>&rdquo;).
                </p>
                <p>
                  This Privacy Policy (&ldquo;<strong>Policy</strong>&rdquo;) explains how information
                  about you is collected, stored, processed, and used by us in connection with your
                  use of our Website provided directly from your accessing, using and filling out of
                  the Beta registration (collectively, the &ldquo;<strong>Website</strong>&rdquo;).
                  The Website is not directed to users under the age of 18. We do not knowingly
                  collect information or data from children under the age of 18 or knowingly allow
                  minors under the age of 18 to use the Service.
                  <strong>
                    {' '}
                    By using any aspect of the Website, you warrant that you are 18 years of age or
                    older, have read and have the legal capacity to understand this Policy.
                  </strong>
                </p>
                <p>
                  This Policy may be amended from time to time. If the revised version requires notice
                  in accordance with applicable law, we will provide you with a 30-day prior notice by
                  posting notice of the change or revised Policy on the Privacy Policy page of our
                  Website. If you are a new Website user or are receiving this Policy for the first
                  time and there is an upcoming change described on the Privacy Policy page at the time
                  you receive this Policy, such upcoming change will apply to you on the indicated
                  effective date.
                </p>
                <p>
                  <strong>Contact us</strong>
                </p>
                <p>
                  Quidkey has a dedicated team focused on data protection issues. If you have any
                  questions, comments or concerns regarding this Policy or our processing of your
                  personal information, please contact us at{' '}
                  <a className="text-primary hover:underline" href="mailto:privacy@quidkey.com">
                    privacy@quidkey.com
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* What we collect and why */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">What we collect and why</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-3 text-left font-semibold">Collection scenario</th>
                      <th className="border border-border p-3 text-left font-semibold">Purpose of processing</th>
                      <th className="border border-border p-3 text-left font-semibold">Legal basis for collection and processing</th>
                      <th className="border border-border p-3 text-left font-semibold">Data Subject</th>
                      <th className="border border-border p-3 text-left font-semibold">Category of Personal Data processed or collected</th>
                      <th className="border border-border p-3 text-left font-semibold">Data Controller</th>
                      <th className="border border-border p-3 text-left font-semibold">Data Recipients</th>
                      <th className="border border-border p-3 text-left font-semibold">International Data Transfer</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr>
                      <td className="border border-border p-3"><strong>Contacting us with an inquiry through our Email or our online contact form</strong></td>
                      <td className="border border-border p-3">Responding to individual inquiries</td>
                      <td className="border border-border p-3">Our legitimate interest in responding to individual queries</td>
                      <td className="border border-border p-3">Website User</td>
                      <td className="border border-border p-3">Your full name, email address, mobile phone number, the subject of your inquiry and the text of your message.</td>
                      <td className="border border-border p-3">Quidkey</td>
                      <td className="border border-border p-3">
                        Data Processor:<br />
                        &bull; Cloud providers (such as Google Cloud, subject to the following additional policy:{' '}
                        <a className="text-primary hover:underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>);<br />
                        &bull; Technology providers or potential partners provide software or services to help us provide the Website
                      </td>
                      <td className="border border-border p-3">Personal Data we collect is stored on infrastructure provided by Google Cloud Platform (GCP), which may be located within the United States, the UK, the EU or Australia (&ldquo;Storage Locations&rdquo;)</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3"><strong>When you provide us with your feedback and reviews</strong></td>
                      <td className="border border-border p-3">Responding to your feedback or reviews</td>
                      <td className="border border-border p-3">Our legitimate interest to address your feedback and improve our Website.</td>
                      <td className="border border-border p-3">Website User</td>
                      <td className="border border-border p-3">Full name, email address, mobile phone number and the feedback or review.</td>
                      <td className="border border-border p-3">Quidkey</td>
                      <td className="border border-border p-3">
                        Data Processor:<br />
                        &bull; Cloud providers (such as Google Cloud, subject to the following additional policy:{' '}
                        <a className="text-primary hover:underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>);<br />
                        &bull; Technology providers or potential partners provide software or services to help us provide the Website
                      </td>
                      <td className="border border-border p-3">Personal Data we collect is stored on infrastructure provided by Google Cloud Platform (GCP), which may be located within the United States, the UK, the EU or Australia (&ldquo;Storage Locations&rdquo;)</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3"><strong>When you fill out the Beta Registration Form on our Website</strong></td>
                      <td className="border border-border p-3">To be able to be considered as one of our Merchants</td>
                      <td className="border border-border p-3">Our legitimate interest to consider you to become one of our Merchants</td>
                      <td className="border border-border p-3">Website User</td>
                      <td className="border border-border p-3">Full name, email, mobile phone number and URL.</td>
                      <td className="border border-border p-3">Quidkey</td>
                      <td className="border border-border p-3">
                        Data Processor:<br />
                        &bull; Cloud providers (such as Google Cloud, subject to the following additional policy:{' '}
                        <a className="text-primary hover:underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>);<br />
                        &bull; Technology providers or potential partners provide software or services to help us provide the Website
                      </td>
                      <td className="border border-border p-3">Personal Data we collect is stored on infrastructure provided by Google Cloud Platform (GCP), which may be located within the United States, the UK, the EU or Australia (&ldquo;Storage Locations&rdquo;)</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3"><strong>If a judicial, governmental or regulatory authority requires us to disclose your information</strong></td>
                      <td className="border border-border p-3">Complying with a binding request from a competent authority</td>
                      <td className="border border-border p-3">Necessity for compliance with a legal obligation to which Quidkey is subject</td>
                      <td className="border border-border p-3">Website User</td>
                      <td className="border border-border p-3">Hole or part of the above-mentioned information as necessary for complying with a binding request from a competent authority</td>
                      <td className="border border-border p-3">Quidkey</td>
                      <td className="border border-border p-3">
                        Independent Data Controller:<br />
                        &bull; Competent authorities<br />
                        Data Processor:<br />
                        &bull; Cloud providers (such as Google Cloud, subject to the following additional policy:{' '}
                        <a className="text-primary hover:underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>)
                      </td>
                      <td className="border border-border p-3">Personal Data we collect is stored on infrastructure provided by Google Cloud Platform (GCP), which may be located within the United States, the UK, the EU or Australia (&ldquo;Storage Locations&rdquo;)</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3"><strong>If the operation of the Service or our business is organized within a different framework, or through another legal structure or entity</strong></td>
                      <td className="border border-border p-3">Enabling a structural change in the operation of the Service and our business</td>
                      <td className="border border-border p-3">Legitimate interest in our business continuity. In that regard, the personal data will be shared in accordance with the data minimization principle, only disclosing what is necessary for the relevant step of the structural change) and without prejudice to any additional information notice to be provided to you.</td>
                      <td className="border border-border p-3">Website User</td>
                      <td className="border border-border p-3">Hole or apart of the above-mentioned information controlled by the former entity</td>
                      <td className="border border-border p-3">Quidkey</td>
                      <td className="border border-border p-3">
                        Independent Data Controller:<br />
                        &bull; The target entity of the merger or acquisition;<br />
                        &bull; Legal counsels, and<br />
                        &bull; Advisors.<br />
                        Data Processor:<br />
                        &bull; Cloud providers (such as Google Cloud, subject to the following additional policy:{' '}
                        <a className="text-primary hover:underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>);<br />
                        &bull; Technology providers or potential partners provide software or services to help us provide the Website
                      </td>
                      <td className="border border-border p-3">Personal Data we collect is stored on infrastructure provided by Google Cloud Platform (GCP), which may be located within the United States, the UK, the EU or Australia (&ldquo;Storage Locations&rdquo;)</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3"><strong>Further uses of non-personal data</strong></td>
                      <td className="border border-border p-3">Anonymization and aggregation of personal data resulting for such processing would no longer be personal data under GDPR</td>
                      <td className="border border-border p-3">Legitimate interest to preserve privacy of the Data Subjects and abide by data minimization of GDPR</td>
                      <td className="border border-border p-3">Website User</td>
                      <td className="border border-border p-3">All or part of the above-mentioned information</td>
                      <td className="border border-border p-3">Quidkey</td>
                      <td className="border border-border p-3">
                        Independent Data Controller:<br />
                        &bull; Our subsidiary affiliates within our corporate group;<br />
                        &bull; Service providers and other third parties as our financial partners, like financial institutions, payment networks, e-money institutions, money transmitters, payment card associations, and credit bureaus.<br />
                        Data Processor:<br />
                        &bull; Cloud providers (such as Google Cloud, subject to the following additional policy:{' '}
                        <a className="text-primary hover:underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>);<br />
                        &bull; Technology providers or potential partners provide software or services to help us provide the Website
                      </td>
                      <td className="border border-border p-3">Personal Data we collect is stored on infrastructure provided by Google Cloud Platform (GCP), which may be located within the United States, the UK, the EU or Australia (&ldquo;Storage Locations&rdquo;)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-base text-muted-foreground mt-4">
                You do not have a legal obligation to provide the information that we request. However,
                if you choose not to provide this information to us, we may not be able to process your
                feedback and respond to your inquiry or otherwise provide the Website.
              </p>
            </section>

            {/* Methods and sources */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Methods and sources for collecting your personal information</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <p>We collect the personal information from several sources:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Through your interactions with and use of the Website, including both information you provide to us and information we derive from such usage;</li>
                  <li>When provided to us through our email, online contact form or registration forms;</li>
                  <li>Through the device you use to access our Website, including through third party cookies and analytics tools, such as Google Analytics.</li>
                </ul>
                <p>
                  You are not legally obligated to provide us with your personal information, but if you
                  do not, we will not be able to handle or respond to your inquiry, or to provide our
                  Website functionalities.
                </p>
              </div>
            </section>

            {/* Data retention and security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Data retention and security</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <p>
                  <strong>
                    We will retain your information for as long as needed to provide you with our
                    Website and/or as necessary to comply with our contractual and legal obligations,
                    resolve disputes, and enforce our agreements
                  </strong>
                  .
                </p>
                <p>
                  We will retain your information for as long as needed for the purposes identified in
                  this Policy, including to operate the Website, to comply with our legal obligations,
                  resolve disputes, establish and defend legal claims, enforce our agreements and
                  protect against fraudulent activity. The specific retention periods depend on the
                  nature of the information and why it is collected and processed and the nature of the
                  legal requirement.
                </p>
                <p>We will retain your personal data for the longest of the following periods:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Seven years from the collection of the personal data;</li>
                  <li>Any statute of limitations applicable thereto;</li>
                  <li>Any applicable legal retention periods; and</li>
                  <li>Any ongoing or otherwise not yet final judicial or administrative proceedings.</li>
                </ul>
                <p>
                  Subsequent to the applicable retention period, we will either delete, anonymize or
                  otherwise store your personal data in a way that would no longer allow for your
                  direct identification or in an archived format.{' '}
                  <strong>We implement measures to secure your information.</strong>
                </p>
                <p>
                  We implement measures to reduce the risks of damage, loss of information and
                  unauthorized access or use of information, such as customary SOC 2 standards, Strong
                  Customer Authentication (SCA) standards, as applicable, encryption and HTTPS.
                  However, these measures do not provide absolute information security. Therefore,
                  although efforts are made to secure your personal information, there is no guarantee
                  that it will be immune from information security risks.
                </p>
              </div>
            </section>

            {/* How to exercise your privacy rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">How to exercise your privacy rights</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <p>
                  For privacy requests, you can email us directly at{' '}
                  <a className="text-primary hover:underline" href="mailto:privacy@quidkey.com">
                    privacy@quidkey.com
                  </a>
                  . Once we receive your request, we will verify it by requesting that you confirm
                  certain personal information. You may also be entitled to submit a request through
                  an authorized agent.
                </p>
                <p>
                  To the extent we are acting on behalf of a third party, you can exercise these rights
                  directly with such third party. As the case may be, we will indicate such third party
                  when you replay to your inquiry.
                </p>
                <p>
                  We will not discriminate against you if you exercise these privacy rights, or deny,
                  charge different prices for, or provide a different quality of our Website if you
                  choose to exercise these rights.
                </p>
                <p>
                  <strong>Do Not Track (DNT)</strong>
                </p>
                <p>
                  This is a privacy preference that users can set in some web browsers, allowing users
                  to opt out of tracking by websites and online services. At the present time, the
                  World Wide Web Consortium, or W3C, has not yet established universal standards for
                  recognizable DNT signals, and therefore Quidkey and the Website do not recognize DNT.
                </p>
              </div>
            </section>

            {/* Information regarding children */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information regarding children</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <p>
                  The Website is not directed to children under 18 (or other age as required by local
                  law), and, except for limited circumstances set forth below, we do not knowingly
                  collect personal information from children. If you learn that your child has provided
                  us with personal information without your consent, you may contact us as set forth
                  herein. If we learn that we have collected a child&apos;s personal information in
                  violation of applicable law, we will promptly take steps to delete such information
                  or, if appropriate and possible, seek written consent from such child&apos;s guardian.
                </p>
              </div>
            </section>

            {/* Additional information for the EU, UK and Switzerland */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Additional information for the EU, UK and Switzerland</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <p>
                  The following sections apply when the processing of your personal data is subject to
                  the data protection framework of the UK (UK GDPR), the EEA (EU GDPR) and/or
                  Switzerland (FADP).
                </p>

                <p className="underline">
                  <strong>Controller</strong>
                </p>
                <p>
                  <strong>
                    If you are a merchant, partner, website visitor or other individual that Quidkey
                    has a direct relationship with and you are located in the EU or UK, Bnqz, Inc. is
                    the controller of your personal data. If you provide your information to a merchant
                    that utilizes the Website, the merchant is your data controller and we are acting
                    as a processor on their behalf.
                  </strong>
                </p>

                <div className="overflow-x-auto">
                  <table className="text-sm border-collapse border border-border">
                    <tbody>
                      <tr>
                        <td className="border border-border p-3 font-semibold">Name</td>
                        <td className="border border-border p-3 font-semibold">Address</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3"><strong>Bnqz, Inc.</strong></td>
                        <td className="border border-border p-3">480 NE 31st Street<br />Miami, FL 33137</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="underline">
                  <strong>International data transfers</strong>
                </p>
                <p>
                  Personal Data we collect is stored on infrastructure provided by Google Cloud Platform
                  (GCP), which may be located within the United States, the United Kingdom (UK), the
                  European Union (EU) or Australia (&ldquo;<strong>Storage Locations</strong>&rdquo;).
                </p>
                <p>
                  To facilitate processing your information through the Website and by our service
                  providers, it may be necessary to collect, process and transfer your information
                  across borders to Storage Locations in countries as applicable by each jurisdiction.
                  Some of these jurisdictions do not offer a level of data protection deemed
                  &ldquo;adequate&rdquo; by EU, UK and Swiss standards. Consequently, when applicable,
                  we do so under the terms of a data transfer agreement which contains standard data
                  protection contract clauses with adequate safeguards determined by the EU Commission
                  and UK Information Commissioner&apos;s Office, including implementing the EU
                  Commission&apos;s Standard Contractual Clauses and Standard Contractual Clauses
                  adopted pursuant to or permitted under Article 46 of the UK GDPR. You may request a
                  copy of such data transfer mechanism, expunged of any elements not relevant to data
                  protection aspects, by contacting{' '}
                  <a className="text-primary hover:underline" href="mailto:privacy@quidkey.com">
                    privacy@quidkey.com
                  </a>
                  .
                </p>

                <p className="underline">
                  <strong>Data subject rights</strong>
                </p>
                <p>You have the following rights under such framework:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong>Right to Access </strong>and receive a copy of your personal information
                    that we process.
                  </li>
                  <li>
                    <strong>Right to Rectify</strong> inaccurate personal information we have
                    concerning you and to have incomplete personal information completed.
                  </li>
                  <li>
                    <strong>Right to easily, freely and at any time withdraw your consent</strong>{' '}
                    when such consent is the legal basis for the processing of your personal data. The
                    withdrawal of consent will not affect the lawfulness of processing based on consent
                    before its withdrawal.
                  </li>
                  <li>
                    <strong>Right to opt-out</strong> of the sharing of your personal information for
                    marketing purposes.
                  </li>
                  <li>
                    <strong>Right to Data Portability</strong>, that is, to receive the personal
                    information that you provided to us, in a structured, commonly used, and
                    machine-readable format, which has been processed (i) under the consent or
                    necessity for the performance of a contract legal basis and (ii) by electronic
                    means. You have the right to transmit this data to another person or entity. Where
                    technically feasible, you have the right to have your personal information
                    transmitted directly from us to the person or entity you designate.
                  </li>
                  <li>
                    <strong>Right to Object</strong> to our processing of your personal information
                    based on our legitimate interest. However, we may override the objection if we
                    demonstrate compelling legitimate grounds, or if we need to process such personal
                    information for the establishment, exercise, or defense of legal claims.
                  </li>
                  <li>
                    <strong>
                      Right to Obtain Human Intervention, to express your point of view and contest
                    </strong>{' '}
                    to a decision which was made as a result of the profiling of your information.
                  </li>
                  <li>
                    <strong>Right to Restrict </strong>us from processing your personal information
                    (except for storing it): (a) if you contest the accuracy of the personal
                    information (in which case the restriction applies only for a period enabling us to
                    determine the accuracy of the personal information); (b) if the processing is
                    unlawful and you prefer to restrict the processing of the personal information
                    rather than requiring the deletion of such data by us; (c) if we no longer need
                    the personal information for the purposes outlined in this Policy, but you require
                    the personal information to establish, exercise or defend legal claims; or (d) if
                    you object to our processing based on our legitimate interest (in which case the
                    restriction applies only for the period enabling us to determine whether our
                    legitimate grounds for processing override yours).
                  </li>
                  <li>
                    <strong>Right to be Forgotten</strong>. Under certain circumstances, such as when
                    you object to our processing of your personal information based on our legitimate
                    interest and there are no overriding legitimate grounds for the processing, you
                    have the right to ask us to erase your personal information. However,
                    notwithstanding such request, we may still process your personal information if it
                    is necessary to comply with our legal obligations, or for the establishment,
                    exercise, or defense of legal claims.
                  </li>
                </ol>
                <p>
                  You also have the right to not be subject to a decision exclusively based on
                  automated decision making.
                </p>
                <p>
                  In certain jurisdictions, such as France, you may also provide us with directive on
                  how your personal data may be used post-mortem.
                </p>
                <p>
                  If you wish to exercise any of these rights, please contact us through the channels
                  listed in this Policy.
                </p>
                <p>
                  We do not charge a fee to give you access to your Personal Data or to exercise any of
                  the other rights described above. We may, however, charge a reasonable fee if your
                  request for access is clearly unfounded or excessive or we may refuse to comply with
                  the request.
                </p>
                <p>
                  <strong>
                    If you are in the EEA or UK, or otherwise granted rights under the EU GDPR or UK
                    GDPR, you may contact our representative under Art. 27 GDPR at the following email
                    address:{' '}
                  </strong>
                  <a
                    className="text-primary hover:underline font-semibold"
                    href="mailto:QuidKey.GDPR.REPRESENTATIVE@klgates.com"
                  >
                    QuidKey.GDPR.REPRESENTATIVE@klgates.com
                  </a>
                </p>
                <p>
                  When you contact us, we reserve the right to ask for reasonable evidence to verify
                  your identity before we provide you with information. Where we are not able to
                  provide you with <strong>information</strong> that you have asked for, we will
                  explain the reason.
                </p>
                <p>
                  While we would appreciate you contacting us to resolve any issue you may have
                  relating to the processing of your personal data by us, you have the right to lodge a
                  complaint with your local data protection authority.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    If you are in the EU, then according to Article 77 of the GDPR, you can lodge a
                    complaint to the supervisory authority, in the Member State of your residence,
                    place of work or place of alleged infringement of the GDPR. For a list of
                    supervisory authorities in the EU, see the{' '}
                    <a
                      className="text-primary hover:underline"
                      href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      EDPB list of supervisory authorities.
                    </a>
                  </li>
                  <li>
                    If you are in the UK, you can lodge a complaint to the Information
                    Commissioner&apos;s Office (ICO) pursuant to the{' '}
                    <a
                      className="text-primary hover:underline"
                      href="https://ico.org.uk/make-a-complaint/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ICO complaint instructions
                    </a>
                    .
                  </li>
                  <li>
                    If you are in Switzerland, you can lodge a complaint to the Federal Data Protection
                    and Information Commissioner (FDPIC) pursuant to the{' '}
                    <a
                      className="text-primary hover:underline"
                      href="https://www.edoeb.admin.ch/en/contact-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      FDPIC complaint instructions
                    </a>
                    .
                  </li>
                </ul>
              </div>
            </section>

            {/* Additional notice for U.S. states */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Additional notice for individuals residing in certain U.S. states</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <p>
                  The following Section applies to individuals residing in certain U.S. states,
                  including, but not limited to, California, Colorado, Connecticut, Utah, Virginia and
                  Nevada, and supplements the information contained in this Policy.
                </p>
                <p>
                  In addition to the rights provided in the Policy above, the California Consumer
                  Privacy Act of 2018 (&ldquo;<strong>CCPA</strong>&rdquo;) and other U.S. state based
                  privacy laws, specifically the Colorado Privacy Act, the Connecticut Act Concerning
                  Personal Data Privacy and Online Monitoring, the Utah Consumer Privacy Act, Nevada
                  Revised Statutes Chapter 603A and the Virginia Consumer Data Protection Act
                  (collectively with the CCPA, the &ldquo;<strong>US State Privacy Laws</strong>
                  &rdquo;) provides certain U.S. residents with specific rights regarding their
                  personal information, subject to limited exceptions. Under the US State Privacy Laws,
                  &ldquo;personal information&rdquo; includes information that identifies, relates to,
                  describes, is capable of being associated with, or could reasonably be linked,
                  directly or indirectly, with a particular consumer or household. We may also collect
                  personal information that may be covered by other laws, rules and regulations,
                  including but not limited to the Gramm-Leach-Bliley Act and its related implementing
                  regulations, and, therefore, such personal information may be exempt from the
                  provisions of US State Privacy Laws.
                </p>
                <p>
                  Although some categories of data collected by us may be exempt from the CCPA or other
                  US State Privacy Laws, for purposes of US State Privacy Laws, we do not
                  &ldquo;sell&rdquo; your personal information to third parties for direct marketing
                  purposes. The full list of categories of personal information we collect and why can
                  be found above under &ldquo;What We Collect and Why&rdquo;.
                </p>

                <p>
                  <strong>Your Rights and Choices</strong>
                </p>
                <p>
                  Subject to certain restrictions and depending on where you live, you may have some or
                  all of the following rights to access, correct and/or delete the personal information
                  that we collect about you. You may also have the right to designate an agent to
                  exercise these rights on your behalf, subject to verification of that agency
                  relationship, which may require our collecting of additional information, such as a
                  government issued ID, to verify your identity before processing your request to
                  protect your information. This section describes how to exercise those rights and our
                  process for handling those requests, including our means of verifying your identity.
                  If you would like further information regarding your legal rights under applicable law
                  or would like to exercise any of them, please contact us at{' '}
                  <a className="text-primary hover:underline" href="mailto:privacy@quidkey.com">
                    privacy@quidkey.com
                  </a>
                  .
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Right to request access to your personal information: You may have the right to
                    request that we disclose to you the personal information we collect, use, or
                    disclose about you, and information about our data practices.
                  </li>
                  <li>
                    Right to request deletion of your personal information. You may have the right to
                    request that we delete personal information that we have collected about you.
                    However, as described herein under &ldquo;Data retention and security&rdquo;, we
                    may retain certain personal information as authorized under applicable law, such as
                    personal information required as necessary to provide our services, comply with
                    applicable law and/or our contractual obligations, protect our business and systems
                    from fraudulent activity and to debug and identify errors that impair existing
                    functionality.
                  </li>
                  <li>
                    Sales of personal information: You may opt out of the sale of your personal
                    information. We do not &quot;sell&quot; your personal information as we understand
                    that term to be defined by US State Privacy Laws and their respective implementing
                    regulations.
                  </li>
                  <li>
                    Non-discrimination rights: You may have the right to not be discriminated against
                    for exercising their rights as described in this section. We will not discriminate
                    against you for exercising your rights described herein.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

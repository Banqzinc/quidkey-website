import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Building2, Globe, Shield, Banknote, ArrowRightLeft, FileCheck } from 'lucide-react'

export const Route = createFileRoute('/products/local-accounts')({
  component: LocalAccountsPage,
  head: () => ({
    meta: [
      { title: 'Local Collection Accounts | Quidkey' },
      { name: 'description', content: 'Collect payments locally in GBP, EUR, USD, and AUD without a local entity. Reduce FX costs and improve customer experience with local bank accounts.' },
    ],
  }),
})

function LocalAccountsPage() {
  const features = [
    {
      icon: Building2,
      title: 'No Local Entity Required',
      description: 'Collect in local currency without establishing a legal presence. We provide the account, you receive the funds.',
    },
    {
      icon: Globe,
      title: 'Four Major Markets',
      description: 'GBP accounts in the UK, EUR in the EU, USD in the US, and AUD in Australia. Cover the major markets.',
    },
    {
      icon: Shield,
      title: 'Fully Compliant',
      description: 'Accounts are held with regulated partners. All AML and KYC requirements handled for you.',
    },
    {
      icon: Banknote,
      title: 'Reduced FX Costs',
      description: 'Collect locally, convert when optimal. Avoid costly same-day FX rates on every transaction.',
    },
    {
      icon: ArrowRightLeft,
      title: 'Flexible Settlement',
      description: 'Hold funds locally or sweep to your home currency. You control when and how to convert.',
    },
    {
      icon: FileCheck,
      title: 'Complete Reconciliation',
      description: 'Real-time balance updates, transaction history, and automated reconciliation.',
    },
  ]

  const benefits = [
    {
      stat: '2-3%',
      statLabel: 'FX savings',
      title: 'Reduce currency costs',
      description: 'Batch conversions and time your FX. Stop paying retail rates on every transaction.',
    },
    {
      stat: 'Days',
      statLabel: 'not months',
      title: 'Fast activation',
      description: 'Get local accounts in days, not the months required to establish a local entity.',
    },
    {
      stat: '4',
      statLabel: 'currencies',
      title: 'Global treasury',
      description: 'Manage GBP, EUR, USD, and AUD from a single dashboard. One view of your global cash.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Complete verification',
      description: 'Submit your business details and required documentation. We handle the compliance.',
    },
    {
      step: '2',
      title: 'Receive account details',
      description: 'Get local account numbers for each currency. Share with customers or connect to payment flows.',
    },
    {
      step: '3',
      title: 'Collect and manage',
      description: 'Funds flow in automatically. View balances, schedule conversions, and sweep to your bank.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Treasury"
        title="Local accounts. Global reach."
        titleGradient="No local entity required."
        description="Collect payments in GBP, EUR, USD, and AUD with local bank accounts. Reduce FX costs and improve customer experience without establishing local entities."
        features={['4 major currencies', 'No local entity', 'Reduce FX costs']}
      />

      <FeatureGrid
        title="Treasury infrastructure for global commerce"
        subtitle="The banking infrastructure you need, without the operational burden."
        features={features}
      />

      <BenefitsSection
        title="Why businesses choose local accounts"
        subtitle="Reduce costs, improve control, expand globally."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Get started with local accounts"
        subtitle="Fast activation, complete support."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

const ANIMATION_DURATION = 6000
const STEP_DURATION = 600

type AnimationStep =
  | 'idle'
  | 'customer-active'
  | 'travel-to-collection'
  | 'collection-active'
  | 'travel-to-tax'
  | 'tax-active'
  | 'travel-to-outputs'
  | 'outputs-active'
  | 'complete'

type NodeKey = 'customer' | 'collection' | 'tax' | 'taxAccount' | 'merchant'

type FlowLayout = {
  width: number
  height: number
  nodes: Record<NodeKey, { x: number; y: number }>
  paths: {
    main: string
    tax: string
    net: string
  }
}

const formatMoney = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)

const round = (value: number) => Math.round(value * 10) / 10

// Build smooth bezier curves between points
const buildCurve = (from: { x: number; y: number }, to: { x: number; y: number }, isDesktop: boolean) => {
  if (isDesktop) {
    // Horizontal: curve control points extend horizontally
    const dx = Math.max(30, Math.abs(to.x - from.x) * 0.35)
    return `C ${round(from.x + dx)} ${round(from.y)} ${round(to.x - dx)} ${round(to.y)} ${round(to.x)} ${round(to.y)}`
  }
  // Vertical: curve control points extend vertically
  const dy = Math.max(30, Math.abs(to.y - from.y) * 0.35)
  return `C ${round(from.x)} ${round(from.y + dy)} ${round(to.x)} ${round(to.y - dy)} ${round(to.x)} ${round(to.y)}`
}

// Build path with offset edge points so card travels between nodes
const buildEdgePath = (
  nodes: { x: number; y: number }[],
  isDesktop: boolean,
  nodeWidth = 80,
  nodeHeight = 35
) => {
  if (nodes.length < 2) return ''

  // Create edge points offset from node centers
  const edgePoints = nodes.map((node, i) => {
    const isFirst = i === 0
    const isLast = i === nodes.length - 1

    if (isDesktop) {
      // Horizontal flow: offset left/right from nodes
      const xOffset = isFirst ? nodeWidth / 2 + 8 : isLast ? -nodeWidth / 2 - 8 : 0
      return { x: node.x + xOffset, y: node.y }
    } else {
      // Vertical flow: offset top/bottom from nodes
      const yOffset = isFirst ? nodeHeight / 2 + 8 : isLast ? -nodeHeight / 2 - 8 : 0
      return { x: node.x, y: node.y + yOffset }
    }
  })

  const [first, ...rest] = edgePoints
  const start = `M ${round(first.x)} ${round(first.y)}`
  const curves = rest
    .map((point, index) => buildCurve(edgePoints[index], point, isDesktop))
    .join(' ')
  return `${start} ${curves}`
}

const buildPath = (points: { x: number; y: number }[], isDesktop: boolean) => {
  return buildEdgePath(points, isDesktop)
}

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
    }, { threshold: 0.35, ...options })

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

function useFlowLayout(containerRef: React.RefObject<HTMLDivElement>, isDesktop: boolean) {
  const [layout, setLayout] = useState<FlowLayout | null>(null)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      if (!width || !height) return

      // Desktop: horizontal flow with more spacing
      // Mobile: vertical flow with generous gaps
      const nodes = isDesktop
        ? {
            customer: { x: width * 0.08, y: height * 0.5 },
            collection: { x: width * 0.28, y: height * 0.5 },
            tax: { x: width * 0.50, y: height * 0.5 },
            taxAccount: { x: width * 0.80, y: height * 0.28 },
            merchant: { x: width * 0.80, y: height * 0.72 },
          }
        : {
            customer: { x: width * 0.5, y: height * 0.10 },
            collection: { x: width * 0.5, y: height * 0.30 },
            tax: { x: width * 0.5, y: height * 0.52 },
            taxAccount: { x: width * 0.28, y: height * 0.82 },
            merchant: { x: width * 0.72, y: height * 0.82 },
          }

      const main = buildPath([nodes.customer, nodes.collection, nodes.tax], isDesktop)
      const tax = buildPath([nodes.tax, nodes.taxAccount], isDesktop)
      const net = buildPath([nodes.tax, nodes.merchant], isDesktop)

      setLayout({
        width,
        height,
        nodes,
        paths: { main, tax, net },
      })
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [containerRef, isDesktop])

  return layout
}

// Node Components - Compact and refined
function CustomerBankNode({ isActive }: { isActive: boolean }) {
  return (
    <div 
      className={`payment-flow-node payment-flow-node--indigo ${isActive ? 'payment-flow-node--active' : ''}`}
      data-node="customer"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
          <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="18" height="12" rx="2" />
            <path d="M7 15h.01M12 15h.01M17 15h.01" />
          </svg>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Customer</div>
          <div className="text-xs font-bold text-slate-800">Chase Bank</div>
        </div>
      </div>
    </div>
  )
}

function CollectionNode({ isActive, amount }: { isActive: boolean; amount: number | null }) {
  return (
    <div 
      className={`payment-flow-node payment-flow-node--indigo ${isActive ? 'payment-flow-node--active' : ''}`}
      data-node="collection"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
          <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </svg>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Collection</div>
          <div className={`payment-flow-amount text-xs ${amount !== null ? 'payment-flow-amount--visible' : ''}`}>
            {amount !== null ? formatMoney(amount) : '\u00A0'}
          </div>
        </div>
      </div>
    </div>
  )
}

function TaxCalculateNode({ isActive, showDetails }: { isActive: boolean; showDetails: boolean }) {
  return (
    <div 
      className={`payment-flow-node payment-flow-node--teal ${isActive ? 'payment-flow-node--active' : ''}`}
      data-node="tax"
    >
      <div className="flex flex-col items-center gap-1.5 py-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 shadow-sm">
          <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="12" y2="14" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">US Sales Tax</div>
          <div 
            className={`text-[11px] font-semibold text-teal-600 transition-all duration-300 ${
              showDetails ? 'opacity-100 mt-0.5' : 'opacity-0 h-0 overflow-hidden'
            }`}
          >
            CA @ 8.25%
          </div>
        </div>
      </div>
    </div>
  )
}

function TaxAccountNode({ isActive, amount }: { isActive: boolean; amount: number | null }) {
  return (
    <div 
      className={`payment-flow-node payment-flow-node--red ${isActive ? 'payment-flow-node--active' : ''}`}
      data-node="tax-account"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
          <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2M13 17v2M13 11v2" />
          </svg>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tax</div>
          <div className={`payment-flow-amount text-xs ${amount !== null ? 'payment-flow-amount--visible' : ''}`}>
            {amount !== null ? formatMoney(amount) : '\u00A0'}
          </div>
        </div>
      </div>
    </div>
  )
}

function MerchantAccountNode({ isActive, amount }: { isActive: boolean; amount: number | null }) {
  return (
    <div 
      className={`payment-flow-node payment-flow-node--green ${isActive ? 'payment-flow-node--active' : ''}`}
      data-node="merchant"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
          <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M12 9v6M9 12h6" />
          </svg>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Merchant</div>
          <div className={`payment-flow-amount text-xs ${amount !== null ? 'payment-flow-amount--visible' : ''}`}>
            {amount !== null ? formatMoney(amount) : '\u00A0'}
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentFlowVisualization({ isPlaying }: { isPlaying: boolean }) {
  const [step, setStep] = useState<AnimationStep>('idle')
  const [cycle, setCycle] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const layout = useFlowLayout(containerRef, isDesktop)

  const paymentAmount = 100
  const taxRate = 0.0825
  const taxAmount = paymentAmount * taxRate
  const netAmount = paymentAmount - taxAmount

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) {
      setStep('idle')
      return
    }

    const steps: { step: AnimationStep; delay: number }[] = [
      { step: 'customer-active', delay: 0 },
      { step: 'travel-to-collection', delay: STEP_DURATION },
      { step: 'collection-active', delay: STEP_DURATION * 2 },
      { step: 'travel-to-tax', delay: STEP_DURATION * 3 },
      { step: 'tax-active', delay: STEP_DURATION * 4 },
      { step: 'travel-to-outputs', delay: STEP_DURATION * 5 },
      { step: 'outputs-active', delay: STEP_DURATION * 6 },
      { step: 'complete', delay: STEP_DURATION * 7 },
    ]

    const timeouts = steps.map(({ step: nextStep, delay }) =>
      window.setTimeout(() => setStep(nextStep), delay)
    )

    const loopTimeout = window.setTimeout(() => {
      setStep('idle')
      setCycle((prev) => prev + 1)
    }, ANIMATION_DURATION)

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout))
      window.clearTimeout(loopTimeout)
    }
  }, [isPlaying, prefersReducedMotion, cycle])

  const customerActive = ['customer-active', 'travel-to-collection'].includes(step)
  const collectionActive = ['collection-active', 'travel-to-tax'].includes(step)
  const taxActive = ['tax-active', 'travel-to-outputs'].includes(step)
  const outputsActive = ['outputs-active', 'complete'].includes(step)

  const showCollectionAmount = ['collection-active', 'travel-to-tax', 'tax-active', 'travel-to-outputs', 'outputs-active', 'complete'].includes(step)
  const showTaxDetails = ['tax-active', 'travel-to-outputs', 'outputs-active', 'complete'].includes(step)
  const showOutputAmounts = ['outputs-active', 'complete'].includes(step)

  const showMainCard = ['customer-active', 'travel-to-collection', 'collection-active', 'travel-to-tax', 'tax-active'].includes(step)
  const showSplitCards = ['travel-to-outputs', 'outputs-active'].includes(step)

  const connection1Active = step === 'travel-to-collection'
  const connection2Active = step === 'travel-to-tax'
  const connection3Active = step === 'travel-to-outputs'

  const mainOffset = step === 'customer-active'
    ? 0
    : step === 'travel-to-collection' || step === 'collection-active'
    ? 50
    : 100

  const outputOffset = step === 'travel-to-outputs' ? 0 : 100

  if (!layout) {
    return <div ref={containerRef} className="payment-flow-diagram" />
  }

  if (prefersReducedMotion) {
    return (
      <div ref={containerRef} className="payment-flow-diagram">
        <div
          className="payment-flow-node-position"
          style={{ left: layout.nodes.customer.x, top: layout.nodes.customer.y }}
        >
          <CustomerBankNode isActive={false} />
        </div>
        <div
          className="payment-flow-node-position"
          style={{ left: layout.nodes.collection.x, top: layout.nodes.collection.y }}
        >
          <CollectionNode isActive={false} amount={paymentAmount} />
        </div>
        <div
          className="payment-flow-node-position"
          style={{ left: layout.nodes.tax.x, top: layout.nodes.tax.y }}
        >
          <TaxCalculateNode isActive={false} showDetails={true} />
        </div>
        <div
          className="payment-flow-node-position"
          style={{ left: layout.nodes.taxAccount.x, top: layout.nodes.taxAccount.y }}
        >
          <TaxAccountNode isActive={false} amount={taxAmount} />
        </div>
        <div
          className="payment-flow-node-position"
          style={{ left: layout.nodes.merchant.x, top: layout.nodes.merchant.y }}
        >
          <MerchantAccountNode isActive={false} amount={netAmount} />
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="payment-flow-diagram">
      <svg className="payment-flow-edges" viewBox={`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="none">
        <path
          d={layout.paths.main}
          className={`payment-flow-edge ${connection1Active || connection2Active ? 'payment-flow-edge--active' : ''}`}
        />
        <path
          d={layout.paths.tax}
          className={`payment-flow-edge ${connection3Active ? 'payment-flow-edge--active' : ''}`}
        />
        <path
          d={layout.paths.net}
          className={`payment-flow-edge ${connection3Active ? 'payment-flow-edge--active' : ''}`}
        />
      </svg>

      <div
        className="payment-flow-node-position"
        style={{ left: layout.nodes.customer.x, top: layout.nodes.customer.y }}
      >
        <CustomerBankNode isActive={customerActive} />
      </div>
      <div
        className="payment-flow-node-position"
        style={{ left: layout.nodes.collection.x, top: layout.nodes.collection.y }}
      >
        <CollectionNode isActive={collectionActive} amount={showCollectionAmount ? paymentAmount : null} />
      </div>
      <div
        className="payment-flow-node-position"
        style={{ left: layout.nodes.tax.x, top: layout.nodes.tax.y }}
      >
        <TaxCalculateNode isActive={taxActive} showDetails={showTaxDetails} />
      </div>
      <div
        className="payment-flow-node-position"
        style={{ left: layout.nodes.taxAccount.x, top: layout.nodes.taxAccount.y }}
      >
        <TaxAccountNode isActive={outputsActive} amount={showOutputAmounts ? taxAmount : null} />
      </div>
      <div
        className="payment-flow-node-position"
        style={{ left: layout.nodes.merchant.x, top: layout.nodes.merchant.y }}
      >
        <MerchantAccountNode isActive={outputsActive} amount={showOutputAmounts ? netAmount : null} />
      </div>

      {showMainCard && (
        <motion.div
          className="payment-flow-card"
          initial={false}
          animate={{
            opacity: showMainCard ? 1 : 0,
            offsetDistance: `${mainOffset}%`,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={
            {
              offsetPath: `path('${layout.paths.main}')`,
              offsetRotate: '0deg',
            } as React.CSSProperties
          }
        >
          <div className="payment-flow-card__label">Payment</div>
          <div className="payment-flow-card__amount">{formatMoney(paymentAmount)}</div>
        </motion.div>
      )}

      {showSplitCards && (
        <>
          <motion.div
            className="payment-flow-card payment-flow-card--tax"
            initial={false}
            animate={{
              opacity: showSplitCards ? 1 : 0,
              offsetDistance: `${outputOffset}%`,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={
              {
                offsetPath: `path('${layout.paths.tax}')`,
                offsetRotate: '0deg',
              } as React.CSSProperties
            }
          >
            <div className="payment-flow-card__label">Tax</div>
            <div className="payment-flow-card__amount">{formatMoney(taxAmount)}</div>
          </motion.div>
          <motion.div
            className="payment-flow-card payment-flow-card--net"
            initial={false}
            animate={{
              opacity: showSplitCards ? 1 : 0,
              offsetDistance: `${outputOffset}%`,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={
              {
                offsetPath: `path('${layout.paths.net}')`,
                offsetRotate: '0deg',
              } as React.CSSProperties
            }
          >
            <div className="payment-flow-card__label">Net</div>
            <div className="payment-flow-card__amount">{formatMoney(netAmount)}</div>
          </motion.div>
        </>
      )}
    </div>
  )
}

export function HowItWorksSection() {
  const { ref, isInView } = useInView()

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>} 
      id="how-it-works" 
      className="py-16 md:py-24 lg:py-32 bg-secondary/50"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Watch how Quidkey automatically calculates and routes US sales tax from a customer payment.
          </p>
        </div>

        {/* Animated visualization */}
        <PaymentFlowVisualization isPlaying={isInView} />

        {/* Caption */}
        <p className="text-center text-sm text-muted-foreground mt-8 max-w-lg mx-auto">
          Payment flows from customer's bank through Quidkey. Tax is calculated by jurisdiction and automatically routed to your tax account.
        </p>
      </div>
    </section>
  )
}

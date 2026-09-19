import { useState } from 'react'

import { track } from '@/lib/track'

import { exampleResponseJson, registrationCurl } from './api-example'

type Tab = 'request' | 'response'

// The hero's visual and the agent's call to action in one: the registration
// request as it will be sent, the response it returns, and a copy button.
export function RegistrationSnippet() {
  const [tab, setTab] = useState<Tab>('request')
  const [status, setStatus] = useState('')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(registrationCurl())
      setStatus('Request copied.')
    } catch {
      setStatus('Select and copy the request.')
    }
    track({ name: 'homepage_cta_click', location: 'hero', label: 'register', audience: 'agents' })
  }

  return (
    <div className="ag-snippet-wrap" id="api">
      <div className="dev__editor ag-snippet">
        <div className="ag-snippet__head">
          <span className="ag-snippet__label">Reserve handle now</span>
          <button type="button" className="ag-snippet__copy" onClick={copy}>
            Copy request
          </button>
        </div>
        <div className="dev__tabs" role="tablist" aria-label="Registration request and response">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'request'}
            className={`dev__tab ${tab === 'request' ? 'is-on' : ''}`}
            onClick={() => setTab('request')}
          >
            Request
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'response'}
            className={`dev__tab ${tab === 'response' ? 'is-on' : ''}`}
            onClick={() => setTab('response')}
          >
            Response
          </button>
        </div>
        <pre className="dev__code">
          <code>{tab === 'request' ? registrationCurl() : exampleResponseJson()}</code>
        </pre>
        <div className="ag-snippet__foot">
          <a href="/.well-known/agent-registration.json" target="_blank" rel="noopener noreferrer">
            Agent instructions ↗
          </a>
          <span>Endpoint planned at core.quidkey.com · not live yet</span>
          <span role="status" className="ag-snippet__status">
            {status}
          </span>
        </div>
      </div>
      <p className="ag-caption">Quidkey reserves the right to reject handle reservations for any reason.</p>
    </div>
  )
}

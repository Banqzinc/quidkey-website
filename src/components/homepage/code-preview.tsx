// Tabbed code preview. Maps to CodePreview at app.jsx:3772.

import { useEffect, useState } from 'react'

export type CodeTab = { name: string; lang?: string; code: string }

type CodePreviewProps =
  | { tabs: CodeTab[]; single?: undefined }
  | { single: CodeTab; tabs?: undefined }

export function CodePreview(props: CodePreviewProps) {
  const list = props.single ? [props.single] : props.tabs
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setIdx(0)
  }, [list])

  const tab = list[idx] ?? list[0]

  return (
    <div className="dev__editor intg__editor">
      <div className="dev__tabs">
        {list.map((t, i) => (
          <button
            key={t.name}
            type="button"
            className={`dev__tab ${idx === i ? 'is-on' : ''}`}
            onClick={() => setIdx(i)}
          >
            {t.name}
          </button>
        ))}
      </div>
      <pre className="dev__code">
        <code>{tab.code}</code>
      </pre>
    </div>
  )
}

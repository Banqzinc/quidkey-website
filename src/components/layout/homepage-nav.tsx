// Homepage-only Nav. Used only by routes/index.tsx; other routes keep using MegaMenu.
// Stub for step 5 — full port from app.jsx:268-387 lands in step 6.

export function HomepageNav() {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="container">
        <div className="nav__inner">
          <a href="#" className="nav__brand" aria-label="Quidkey">
            <span className="nav__brand-tag">quidkey</span>
          </a>
        </div>
      </div>
    </nav>
  )
}

import { Link } from '@tanstack/react-router'

import type { BlogCategory } from '@/lib/blog-meta'

export function ArticleBreadcrumb({ category }: { category: BlogCategory }) {
  return (
    <nav className="acrumb" aria-label="Breadcrumb">
      <div className="container">
        <div className="acrumb__row">
          <Link to="/">Quidkey</Link>
          <span className="acrumb__sep" aria-hidden="true">/</span>
          <Link to="/blog">Blog</Link>
          <span className="acrumb__sep" aria-hidden="true">/</span>
          <span className="acrumb__here">{category}</span>
        </div>
      </div>
    </nav>
  )
}

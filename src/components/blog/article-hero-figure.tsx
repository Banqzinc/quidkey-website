import type { BlogPost } from '@/lib/blog-posts'

export function ArticleHeroFigure({ post }: { post: BlogPost }) {
  const isContain = post.imageFit === 'contain'
  return (
    <div className="container">
      <figure className="afig">
        <div className={`afig__media${isContain ? ' afig__media--contain' : ''}`}>
          <img
            src={post.image}
            alt={post.title}
            width={post.imageWidth ?? 1600}
            height={post.imageHeight ?? 900}
            loading="eager"
            decoding="async"
          />
        </div>
      </figure>
    </div>
  )
}

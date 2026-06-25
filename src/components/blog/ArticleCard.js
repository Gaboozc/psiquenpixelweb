import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';

const ArticleCard = ({ title, excerpt, slug, date, tags = [], category, coverImage }) => (
  <Link href={`/blog/${slug}`} className="block group">
    <article
      className="pixel-border h-full flex flex-col transition-all duration-150 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:pixel-border-purple"
      style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >

      {/* Thumbnail — cover image if available, pixel art pattern otherwise */}
      <div className="w-full h-36 bg-brand-bg overflow-hidden relative">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, #16151a 0, #16151a 4px, #0d0d0f 4px, #0d0d0f 8px),
                repeating-linear-gradient(-45deg, rgba(155,89,247,0.05) 0, rgba(155,89,247,0.05) 2px, transparent 2px, transparent 6px)
              `,
            }}
            aria-hidden="true"
          >
            <span className="text-brand-border text-[10px]" style={{ fontFamily: 'var(--font-pixel)' }}>▓▓▓</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Category + date */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {category && <Badge color="purple">{category}</Badge>}
          {date && (
            <span
              className="text-brand-muted text-[8px]"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              {formatDate(date)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-brand-text text-sm leading-snug group-hover:text-brand-purple transition-colors"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-brand-muted text-xs leading-relaxed flex-1 font-body line-clamp-3">
          {excerpt}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-brand-border">
            {tags.map((tag) => (
              <Badge key={tag} color="muted">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  </Link>
);

export default ArticleCard;

import Image from "next/image";
import Link from "next/link";
import type { BookInfo, Cover } from "@/lib/types";

export function BookCover({ cover, className = "" }: { cover: Cover; className?: string }) {
  if (cover.image) {
    return (
      <Image
        src={cover.image}
        alt=""
        width={848}
        height={1264}
        sizes="(max-width: 640px) 50vw, 240px"
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <svg viewBox="0 0 150 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <rect width="150" height="200" fill={cover.sky} />
      <circle cx="104" cy="62" r="24" fill={cover.sun} />
      <path d="M0 132c30-30 62-30 90-10s42 14 60 0v78H0z" fill={cover.hills[0]} />
      <path d="M0 164c26-16 56-16 82-4s48 10 68-4v44H0z" fill={cover.hills[1]} />
    </svg>
  );
}

export function BookCard({
  book,
  href,
  percent,
  savedWords,
}: {
  book: BookInfo;
  href?: string;
  percent?: number;
  savedWords?: number;
}) {
  return (
    <Link href={href ?? `/books/${book.slug}`} scroll={false} className="group block min-w-0">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-chip transition-transform group-hover:-translate-y-0.5">
        <BookCover cover={book.cover} className="size-full" />
        <span className="absolute left-2 top-2 rounded-lg bg-white/85 px-2 py-0.5 text-xs font-medium">
          {book.level}
        </span>
        <span className="absolute bottom-2 right-2 rounded-lg bg-white/85 px-2 py-0.5 text-xs font-medium">
          {book.minutes} мин
        </span>
      </div>
      <h3 className="mt-2 font-semibold leading-snug">{book.title}</h3>
      {percent === undefined ? (
        <p className="truncate text-sm text-muted">{book.author}</p>
      ) : (
        <div className="mt-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-chip">
            <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-1 flex justify-between text-sm text-muted">
            <span>{percent}% оқылды</span>
            {savedWords ? <span>+{savedWords} сөз</span> : null}
          </p>
        </div>
      )}
    </Link>
  );
}

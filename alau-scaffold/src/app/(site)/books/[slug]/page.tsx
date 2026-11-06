import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { BookPanel } from "@/components/book-panel";
import { Catalog, CatalogSkeleton } from "@/components/catalog";
import { findAvailableBook, listAvailableBooks } from "@/lib/catalog";

type Params = Promise<{ slug: string }>;

async function BookView({ params }: { params: Params }) {
  const { slug } = await params;
  await connection();
  const now = new Date();
  const book = findAvailableBook(slug, now);
  if (!book) notFound();
  return (
    <>
      <Catalog books={listAvailableBooks(now)} />
      <BookPanel book={book} />
    </>
  );
}

export default function BookPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <BookView params={params} />
    </Suspense>
  );
}

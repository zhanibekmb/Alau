import { connection } from "next/server";
import { Suspense } from "react";
import { Catalog, CatalogSkeleton } from "@/components/catalog";
import { listAvailableBooks } from "@/lib/catalog";

async function CatalogForNow() {
  // Checked per request, so an expired license removes the book without a rebuild.
  await connection();
  return <Catalog books={listAvailableBooks(new Date())} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogForNow />
    </Suspense>
  );
}

import { connection } from "next/server";
import { Suspense } from "react";
import { CatalogSkeleton } from "@/components/catalog";
import { MyBooks } from "@/components/my-books";
import { listAvailableBooks } from "@/lib/catalog";

async function MyBooksForNow() {
  await connection();
  return <MyBooks books={listAvailableBooks(new Date())} />;
}

export default function MyBooksPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <MyBooksForNow />
    </Suspense>
  );
}

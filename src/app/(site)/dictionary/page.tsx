import { connection } from "next/server";
import { Suspense } from "react";
import { Dictionary } from "@/components/dictionary";
import { listAvailableBooks } from "@/lib/catalog";

async function DictionaryForNow() {
  // Covers and authors for the "by book" view; checked per request like the catalog.
  await connection();
  return <Dictionary books={listAvailableBooks(new Date())} />;
}

export default function DictionaryPage() {
  return (
    <Suspense fallback={<div className="mx-auto h-40 w-full max-w-[913px] px-5 pt-14 md:px-8" />}>
      <DictionaryForNow />
    </Suspense>
  );
}

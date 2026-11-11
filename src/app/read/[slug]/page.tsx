import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Reader, Unavailable } from "@/components/reader/reader";
import { googleCredentials } from "@/lib/auth";
import { findAvailableBook, findEdition } from "@/lib/catalog";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

async function ReaderView({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  await connection();

  if (!findEdition(slug)) notFound();
  const book = findAvailableBook(slug, new Date());
  if (!book) {
    return (
      <main className="mx-auto max-w-[680px] px-4">
        <Unavailable />
      </main>
    );
  }

  const parsed = Number(page);
  const startPage = Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  return (
    <Reader
      key={`${slug}:${startPage ?? "resume"}`}
      book={book}
      startPage={startPage}
      googleEnabled={googleCredentials() !== null}
    />
  );
}

export default function ReadPage(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#fcfbf7]" />}>
      <ReaderView {...props} />
    </Suspense>
  );
}

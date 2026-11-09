import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/password-reset";

export const metadata: Metadata = { title: "Жаңа құпиясөз · Alau", robots: { index: false } };

export default function ResetPasswordPage() {
  // The token arrives in the address (?token=…), which is only known in the browser.
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/password-reset";

export const metadata: Metadata = { title: "Құпиясөзді қалпына келтіру · Alau" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

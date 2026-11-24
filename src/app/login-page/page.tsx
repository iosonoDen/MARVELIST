import type { Metadata } from "next";
import { AuthPage } from "@/components/AuthPage";

export const metadata: Metadata = {
  title: "Accedi · MARVELIST",
  robots: { index: false },
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}

import type { Metadata } from "next";
import { bebasNeue } from "@/app/fonts";
import { AuthPage } from "@/components/AuthPage";

export const metadata: Metadata = {
  title: "Registrati · MARVELIST",
  robots: { index: false },
};

export default function SignupPage() {
  return <AuthPage mode="signup" headlineFont={bebasNeue.className} />;
}

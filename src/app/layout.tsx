import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Foundations Quiz — Phase 1 | TM Systems",
  description:
    "AI Foundations Training Programme Phase 1 assessment covering LLM architecture, tokenisation, prompt engineering, and safe AI use.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="noise-bg min-h-screen font-sans">
        {/* Ambient clay glow orbs */}
        <div className="fixed top-[-10%] left-[15%] w-[500px] h-[500px] bg-brand-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-[-5%] right-[10%] w-[400px] h-[400px] bg-info/4 rounded-full blur-3xl pointer-events-none" />

        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}

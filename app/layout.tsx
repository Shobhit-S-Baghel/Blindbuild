import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { ToastContainer } from "@/components/ToastContainer";
import { GuardrailLogDrawer } from "@/components/GuardrailLogDrawer";
import { DemoModeBanner } from "@/components/DemoModeBanner";

export const metadata: Metadata = {
  title: "BlindBuild | Double-Blind Skill-Verified Venture Incubator",
  description:
    "Ideas and code speak first. Identities unlock only after mutual technical validation. Eliminate batch-year and networking bias on college campuses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#08090d] text-gray-100 antialiased selection:bg-electric-cyan/30 selection:text-electric-cyan">
        <AppProvider>
          {/* Subtle hacker grid pattern */}
          <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

          {/* Glowing ambient radial orbs */}
          <div className="fixed top-[-100px] left-1/4 w-[500px] h-[500px] bg-electric-cyan/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="fixed bottom-[-100px] right-1/4 w-[600px] h-[600px] bg-electric-violet/10 rounded-full blur-[160px] pointer-events-none -z-10" />

          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>

          <GuardrailLogDrawer />
          <ToastContainer />
          <DemoModeBanner />
        </AppProvider>
      </body>
    </html>
  );
}

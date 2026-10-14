import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { ToastContainer } from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "SkillSync - Find Your People. Build Something Extraordinary.",
  description:
    "Student skill discovery, project collaboration, and intelligent team formation platform with an explainable skill matching engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090D16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}

import "./globals.css";

import { Metadata } from "next";
import Script from "next/script";
import { RootLayout } from "src/app/RootLayout";
import { ToTop } from "src/components/ToTop";
import { Footer } from "src/layout/Footer";
import { Header } from "src/layout/Header";

export const metadata: Metadata = {
  title: "ddadaal.me",
  description: "ddadaal's personal website",
  manifest: "/site.webmanifest",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const monitorHost = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://services.ddadaal.me";

  return (
    <RootLayout>
      <Script
        data-host={monitorHost}
        data-dnt="false"
        src={`${monitorHost}/monitor/script.js`}
        id="ZwSg9rf6GA"
        async
        defer
      />
      <Header />
      <div>
        {children}
      </div>
      <Footer />
      <ToTop />
    </RootLayout>
  );
}

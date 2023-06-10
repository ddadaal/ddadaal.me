import "./globals.css";

import { Metadata } from "next";
import { RootLayout } from "src/app/RootLayout";
import { getResume } from "src/data/resume";
import { Footer } from "src/layout/Footer";
import { Header } from "src/layout/Header";

export const metadata: Metadata = {
  title: "ddadaal.me",
  description: "ddadaal's personal website",
  manifest: "/site.webmanifest",
};

export default async function Layout({ children }: { children: React.ReactNode }) {

  const resume = await getResume();

  return (
    <RootLayout>
      <Header resumeLangs={resume?.langVersions.map((x) => x.lang) ?? []} />
      <div>
        {children}
      </div>
      <Footer />
    </RootLayout>
  );
}

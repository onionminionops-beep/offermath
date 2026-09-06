import type { Metadata } from "next";
import { PostHogProvider } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "OfferMath | Salary & Equity Offer Calculator",
  description: "Calculate and compare total compensation from your job offers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}

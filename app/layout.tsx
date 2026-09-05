import type { Metadata } from "next";
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
      <body className="antialiased bg-slate-50">{children}</body>
    </html>
  );
}

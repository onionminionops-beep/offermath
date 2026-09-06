"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import posthog from "posthog-js";

function SuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    posthog.capture("checkout_completed", {
      product: "offermath",
      session_id: sessionId,
    });
  }, [searchParams]);

  return (
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center">
      <div className="text-6xl mb-6">✓</div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">
        Payment Successful!
      </h1>
      <p className="text-xl text-slate-600 mb-8">
        Your OfferMath analysis is now unlocked.
      </p>
      <p className="text-slate-600 mb-8">
        Go back to the calculator to view your complete compensation breakdown,
        recruiter questions, and email template.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
      >
        Back to Calculator
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center">
          <div className="text-6xl mb-6">✓</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Loading...</h1>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}

import Link from "next/link";
import PurchaseTracker from "@/app/components/PurchaseTracker";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <PurchaseTracker product="OfferMath" />
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
    </div>
  );
}

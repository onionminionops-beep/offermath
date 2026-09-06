"use client";
import posthog from "posthog-js";

import { useState } from "react";
import { OfferInput } from "@/lib/types";

export default function HomePage() {
  const [formData, setFormData] = useState<OfferInput>({
    baseSalary: 0,
    bonus: 0,
    equityShares: undefined,
    equityPercent: undefined,
    strikePrice: undefined,
    fmv: undefined,
    vestingYears: 4,
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
      setShowPaywall(true);
    } catch (error) {
      console.error("Error analyzing offer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    try {
      posthog.capture("checkout_cta_clicked", { product: "OfferMath" });
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    }
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">OfferMath</h1>
          <p className="text-xl text-slate-600">
            Calculate your total compensation in seconds
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Base Salary ($)
                </label>
                <input
                  type="number"
                  value={formData.baseSalary || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, baseSalary: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-mono"
                  placeholder="150000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Annual Bonus ($)
                </label>
                <input
                  type="number"
                  value={formData.bonus || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bonus: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-mono"
                  placeholder="20000"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Equity Details</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Equity Shares
                  </label>
                  <input
                    type="number"
                    value={formData.equityShares || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, equityShares: Number(e.target.value) || undefined })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-mono"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Strike Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.strikePrice ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, strikePrice: Number(e.target.value) || undefined })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-mono"
                    placeholder="0.50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Fair Market Value ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fmv || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, fmv: Number(e.target.value) || undefined })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-mono"
                    placeholder="5.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Vesting Period (years)
                  </label>
                  <input
                    type="number"
                    value={formData.vestingYears}
                    onChange={(e) =>
                      setFormData({ ...formData, vestingYears: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-mono"
                    placeholder="4"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Calculating..." : "Calculate Total Comp"}
            </button>
          </form>
        </div>

        {result && showPaywall && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-slate-900 mb-2">
                {formatter.format(result.totalCompPerYear)}
              </div>
              <div className="text-slate-600 text-lg">Annual Total Compensation</div>
            </div>

            {!isPaid ? (
              <div className="relative">
                <div className="filter blur-sm select-none pointer-events-none">
                  <div className="bg-slate-50 rounded-lg p-6 mb-4">
                    <p className="text-slate-700 whitespace-pre-line">
                      {result.summary.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="font-semibold text-slate-800 mb-3">
                      Questions to Ask Your Recruiter
                    </h3>
                    <ul className="space-y-2">
                      {result.questions.slice(0, 3).map((q: string, i: number) => (
                        <li key={i} className="text-slate-700">• {q}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-500 p-8 max-w-md">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      Unlock Full Analysis
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Get the complete breakdown, recruiter questions checklist, and email template
                    </p>
                    <div className="text-3xl font-bold text-blue-600 mb-6">$19</div>
                    <button
                      onClick={handleUnlock}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
                    >
                      Unlock Now
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-line text-slate-700">
                      {result.summary}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-800 mb-4 text-lg">
                    Questions to Ask Your Recruiter
                  </h3>
                  <ul className="space-y-3">
                    {result.questions.map((q: string, i: number) => (
                      <li key={i} className="text-slate-700 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-800 mb-4 text-lg">
                    Email Template
                  </h3>
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
                    {result.emailTemplate}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result.emailTemplate);
                    }}
                    className="mt-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center items-center gap-4">
          <a href="https://thesaasdir.com/product/offermath?ref=badge" rel="dofollow">
            <img src="https://thesaasdir.com/badge/offermath.svg" alt="Featured on TheSaaSDir" width="182" height="46" />
          </a>
          <a href="https://themicrosaasdir.com/product/offermath?ref=badge" rel="dofollow">
            <img src="https://themicrosaasdir.com/badge/offermath.svg" alt="Featured on TheMicroSaaSDir" width="182" height="46" />
          </a>
          <a href="https://indielineup.com/product/offermath?ref=badge" rel="dofollow">
            <img src="https://indielineup.com/badge/offermath.svg" alt="Featured on IndieLineup" width="182" height="46" />
          </a>
          <a href="https://saaslineup.com/product/offermath?ref=badge" rel="dofollow">
            <img src="https://saaslineup.com/badge/offermath.svg" alt="Featured on SaaSLineup" width="182" height="46" />
          </a>
          <a href="https://theaitoolsdir.com/product/offermath?ref=badge" rel="dofollow">
            <img src="https://theaitoolsdir.com/badge/offermath.svg" alt="Featured on TheAIToolsDir" width="182" height="46" />
          </a>
          <a
            href="https://www.promptfrenzy.com/directory"
            rel="noopener"
            target="_blank"
            title="Featured on PromptFrenzy AI Directory"
          >
            <img
              src="https://www.promptfrenzy.com/badges/directory.svg"
              alt="Featured on PromptFrenzy AI Directory"
              width={220}
              height={44}
              loading="lazy"
            />
          </a>
          <a
            href="https://ainexfinder.com"
            target="_blank"
            rel="noopener"
            title="Featured on AInexfinder"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: '#7150E6',
              border: '1px solid #6347D1',
              borderRadius: '10px',
              textDecoration: 'none',
              fontFamily: 'ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif',
              lineHeight: '1'
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,.85)'
              }}
            >
              Featured on
            </span>
            <img
              src="https://ainexfinder.com/brand/ainexfinder-logo-white.png"
              alt="AInexfinder — AI Tools Directory"
              height={22}
              style={{
                display: 'block',
                height: '22px',
                width: 'auto'
              }}
            />
          </a>
        </div>
      </footer>
    </div>
  );
}

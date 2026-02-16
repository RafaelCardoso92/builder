"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, AlertCircle, CheckCircle, Upload, X } from "lucide-react";

interface QuoteRequestFormProps {
  profile: {
    id: string;
    businessName: string;
    trades: Array<{
      trade: {
        id: string;
        name: string;
      };
    }>;
  };
  isLoggedIn: boolean;
  userId?: string;
}

const timeframes = [
  { value: "ASAP", label: "As soon as possible" },
  { value: "1_WEEK", label: "Within 1 week" },
  { value: "2_WEEKS", label: "Within 2 weeks" },
  { value: "1_MONTH", label: "Within 1 month" },
  { value: "FLEXIBLE", label: "I\u0027m flexible" },
];

const budgetRanges = [
  { value: "UNDER_500", label: "Under £500" },
  { value: "500_1000", label: "£500 - £1,000" },
  { value: "1000_2500", label: "£1,000 - £2,500" },
  { value: "2500_5000", label: "£2,500 - £5,000" },
  { value: "5000_10000", label: "£5,000 - £10,000" },
  { value: "OVER_10000", label: "Over £10,000" },
  { value: "NOT_SURE", label: "Not sure yet" },
];

export default function QuoteRequestForm({ profile, isLoggedIn, userId }: QuoteRequestFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [formData, setFormData] = useState({
    // Contact (for non-logged in users)
    name: "",
    email: "",
    phone: "",
    // Job details
    title: "",
    description: "",
    tradeType: profile.trades[0]?.trade.name || "",
    // Location
    postcode: "",
    address: "",
    // Timing & Budget
    timeframe: "FLEXIBLE",
    preferredDates: "",
    budgetRange: "NOT_SURE",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addImageUrl = () => {
    if (newImageUrl && !imageUrls.includes(newImageUrl)) {
      setImageUrls([...imageUrls, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          profileId: profile.id,
          images: imageUrls,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quote request");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Quote Request Sent!</h2>
        <p className="text-slate-600 mb-6">
          {profile.businessName} will review your request and get back to you soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${profile.id}`}
            className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200"
          >
            Back to Profile
          </Link>
          {isLoggedIn && (
            <Link
              href="/account/quotes"
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
            >
              View My Quotes
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Contact Details (if not logged in) */}
      {!isLoggedIn && (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Your Contact Details</h3>
          <p className="text-sm text-slate-500">
            <Link href="/login" className="text-primary-600 hover:underline">Sign in</Link>
            {" "}to save your quote requests and track responses.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLoggedIn}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required={!isLoggedIn}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="07123 456789"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required={!isLoggedIn}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="you@example.com"
            />
          </div>
        </div>
      )}

      {/* Job Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Job Details</h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Type of Work *
          </label>
          <select
            name="tradeType"
            value={formData.tradeType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {profile.trades.map((t) => (
              <option key={t.trade.id} value={t.trade.name}>
                {t.trade.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g. Bathroom renovation, Boiler repair"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Describe What You Need *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Please provide as much detail as possible about the work you need done..."
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Photos (optional)
          </label>
          <p className="text-sm text-slate-500 mb-3">
            Add photos to help explain what you need
          </p>
          
          <div className="flex gap-2 mb-3">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Paste image URL"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Add
            </button>
          </div>

          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Location</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Postcode *
            </label>
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="M1 1AA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address (optional)
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="123 Main Street"
            />
          </div>
        </div>
      </div>

      {/* Timing & Budget */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Timing & Budget</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              When do you need this done?
            </label>
            <select
              name="timeframe"
              value={formData.timeframe}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {timeframes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Budget Range
            </label>
            <select
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {budgetRanges.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Preferred Dates/Times (optional)
          </label>
          <input
            type="text"
            name="preferredDates"
            value={formData.preferredDates}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g. Weekday mornings, Saturdays"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          {isLoading ? "Sending..." : "Send Quote Request"}
        </button>
        <p className="text-xs text-slate-500 text-center mt-4">
          By sending this request, you agree to our{" "}
          <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </form>
  );
}

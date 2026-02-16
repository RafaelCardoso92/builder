"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, AlertCircle, CheckCircle } from "lucide-react";

interface QuoteResponseFormProps {
  quoteId: string;
}

export default function QuoteResponseForm({ quoteId }: QuoteResponseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    message: "",
    estimatedCost: "",
    availableDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/quotes/${quoteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send response");
      }

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <p className="font-medium text-slate-900">Response sent successfully!</p>
        <p className="text-sm text-slate-600 mt-1">The customer has been notified.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Introduce yourself, ask any clarifying questions, and let them know how you can help..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estimated Cost (optional)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">£</span>
            <input
              type="text"
              name="estimatedCost"
              value={formData.estimatedCost}
              onChange={handleChange}
              className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. 500 - 750"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Available From (optional)
          </label>
          <input
            type="date"
            name="availableDate"
            value={formData.availableDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        <Send className="w-5 h-5" />
        {isLoading ? "Sending..." : "Send Response"}
      </button>
    </form>
  );
}

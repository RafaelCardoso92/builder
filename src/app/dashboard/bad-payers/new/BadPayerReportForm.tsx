'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  PoundSterling,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

export default function BadPayerReportForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    incidentDate: '',
    workDescription: '',
    agreedAmount: '',
    amountOwed: '',
    paymentTerms: '',
    locationArea: '',
    locationPostcode: '',
    invoiceReference: '',
    contractReference: '',
    communicationSummary: '',
    legalConsentGiven: false,
    truthDeclaration: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/bad-payers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Report Submitted</h2>
        <p className="text-slate-600 mb-6">
          Your report has been submitted and is pending review. We will notify
          you once it has been reviewed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard/bad-payers"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            View My Reports
          </Link>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                incidentDate: '',
                workDescription: '',
                agreedAmount: '',
                amountOwed: '',
                paymentTerms: '',
                locationArea: '',
                locationPostcode: '',
                invoiceReference: '',
                contractReference: '',
                communicationSummary: '',
                legalConsentGiven: false,
                truthDeclaration: false,
              });
            }}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm whitespace-pre-line">{error}</p>
        </div>
      )}

      {/* Incident Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Incident Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="date"
            name="incidentDate"
            value={formData.incidentDate}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">When did the work take place?</p>
      </div>

      {/* Work Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Work Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="workDescription"
          value={formData.workDescription}
          onChange={handleChange}
          required
          rows={4}
          minLength={50}
          placeholder="Describe the work you completed. Do NOT include personal names, addresses, or other identifying information."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Minimum 50 characters. {formData.workDescription.length}/50
        </p>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Agreed Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              name="agreedAmount"
              value={formData.agreedAmount}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Amount Owed <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              name="amountOwed"
              value={formData.amountOwed}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Payment Terms
        </label>
        <input
          type="text"
          name="paymentTerms"
          value={formData.paymentTerms}
          onChange={handleChange}
          placeholder="e.g., 50% upfront, 50% on completion"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Location Area <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="locationArea"
              value={formData.locationArea}
              onChange={handleChange}
              required
              placeholder="e.g., South London, Manchester city centre"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Postcode Area
          </label>
          <input
            type="text"
            name="locationPostcode"
            value={formData.locationPostcode}
            onChange={handleChange}
            placeholder="e.g., SW1 (first part only)"
            maxLength={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
          />
          <p className="text-xs text-slate-500 mt-1">First part only for privacy</p>
        </div>
      </div>

      {/* References */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Invoice Reference
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="invoiceReference"
              value={formData.invoiceReference}
              onChange={handleChange}
              placeholder="INV-001"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Contract Reference
          </label>
          <input
            type="text"
            name="contractReference"
            value={formData.contractReference}
            onChange={handleChange}
            placeholder="Contract ID"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Communication Summary */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Communication Summary
        </label>
        <textarea
          name="communicationSummary"
          value={formData.communicationSummary}
          onChange={handleChange}
          rows={3}
          placeholder="Briefly describe your attempts to contact the customer about payment. Do NOT include names or contact details."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Legal Declarations */}
      <div className="bg-slate-50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-slate-900">Legal Declarations</h3>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="truthDeclaration"
            checked={formData.truthDeclaration}
            onChange={handleChange}
            required
            className="w-5 h-5 mt-0.5 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-slate-700">
            I declare that the information provided is true and accurate to the best
            of my knowledge. I understand that submitting false information may result
            in legal action against me.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="legalConsentGiven"
            checked={formData.legalConsentGiven}
            onChange={handleChange}
            required
            className="w-5 h-5 mt-0.5 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-slate-700">
            I consent to this report being published publicly after review. I understand
            that the accused party may dispute this report and that my business name
            will be visible as the reporter.
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/bad-payers"
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading || !formData.legalConsentGiven || !formData.truthDeclaration}
          className="flex-1 py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </form>
  );
}

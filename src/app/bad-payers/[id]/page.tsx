import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  Calendar,
  MapPin,
  PoundSterling,
  FileText,
  Shield,
  ArrowLeft,
  MessageSquare,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import DisputeForm from './DisputeForm';

async function getReport(id: string) {
  const report = await prisma.badPayerReport.findUnique({
    where: { id },
    include: {
      reporter: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          isVerified: true,
          city: true,
        },
      },
      evidence: true,
      disputes: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // Only return if published and public
  if (!report || report.status !== 'PUBLISHED' || !report.isPublic) {
    return null;
  }

  return report;
}

export default async function BadPayerReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/bad-payers"
            className="inline-flex items-center gap-2 text-red-100 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Bad Payer Report</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amount Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Amount Owed</p>
                  <p className="text-4xl font-bold text-red-600 flex items-center gap-2">
                    <PoundSterling className="w-8 h-8" />
                    {report.amountOwed.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Original Amount</p>
                  <p className="text-xl font-semibold text-slate-700">
                    £{report.agreedAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              {report.paymentTerms && (
                <p className="text-sm text-slate-500 mt-4">
                  Payment terms: {report.paymentTerms}
                </p>
              )}
            </div>

            {/* Work Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Work Description</h2>
              <p className="text-slate-700 whitespace-pre-line">
                {report.workDescription}
              </p>
            </div>

            {/* Communication Summary */}
            {report.communicationSummary && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-4">
                  Communication Attempts
                </h2>
                <p className="text-slate-700 whitespace-pre-line">
                  {report.communicationSummary}
                </p>
              </div>
            )}

            {/* Evidence */}
            {report.evidence.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-4">
                  Supporting Evidence
                </h2>
                <div className="space-y-3">
                  {report.evidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {ev.fileName}
                        </p>
                        <p className="text-xs text-slate-500">{ev.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disputes */}
            {report.disputes.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h2 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Disputes ({report.disputes.length})
                </h2>
                <div className="space-y-4">
                  {report.disputes.map((dispute) => (
                    <div
                      key={dispute.id}
                      className="bg-white rounded-lg p-4 border border-orange-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-orange-700">
                          {dispute.reason.replace(/_/g, ' ')}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            dispute.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : dispute.status === 'UPHELD'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {dispute.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{dispute.explanation}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(dispute.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dispute Form */}
            <DisputeForm reportId={report.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Incident Date</p>
                    <p className="font-medium text-slate-900">
                      {new Date(report.incidentDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-medium text-slate-900">
                      {report.locationArea}
                      {report.locationPostcode && ` (${report.locationPostcode})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Reported</p>
                    <p className="font-medium text-slate-900">
                      {new Date(report.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {report.invoiceReference && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Invoice Ref</p>
                      <p className="font-medium text-slate-900">
                        {report.invoiceReference}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reporter Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Reported By</h2>
              <Link
                href={`/${report.reporter.slug}`}
                className="flex items-center gap-3 hover:bg-slate-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">
                    {report.reporter.businessName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 flex items-center gap-1">
                    {report.reporter.businessName}
                    {report.reporter.isVerified && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </p>
                  <p className="text-sm text-slate-500">{report.reporter.city}</p>
                </div>
              </Link>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Disclaimer
              </h3>
              <p className="text-xs text-amber-800">
                This report represents an allegation made by the reporter. The
                information has not been independently verified. If you believe this
                report is inaccurate, you may submit a dispute using the form below.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

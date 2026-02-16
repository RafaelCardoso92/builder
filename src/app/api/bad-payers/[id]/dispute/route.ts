import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/bad-payers/[id]/dispute - Create a dispute
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const report = await prisma.badPayerReport.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    if (report.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Only published reports can be disputed' },
        { status: 400 }
      );
    }

    const body = await req.json();

    const { contactEmail, contactPhone, contactName, reason, explanation } = body;

    // Validate required fields
    if (!contactEmail || !reason || !explanation) {
      return NextResponse.json(
        { error: 'Contact email, reason, and explanation are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (explanation.length < 50) {
      return NextResponse.json(
        { error: 'Explanation must be at least 50 characters' },
        { status: 400 }
      );
    }

    // Check if already disputed by this email
    const existingDispute = await prisma.badPayerDispute.findFirst({
      where: {
        reportId: id,
        contactEmail: contactEmail.toLowerCase(),
      },
    });

    if (existingDispute) {
      return NextResponse.json(
        { error: 'A dispute has already been submitted from this email address' },
        { status: 400 }
      );
    }

    // Create dispute
    const dispute = await prisma.badPayerDispute.create({
      data: {
        reportId: id,
        contactEmail: contactEmail.toLowerCase(),
        contactPhone: contactPhone || null,
        contactName: contactName || null,
        reason,
        explanation: explanation.trim(),
        status: 'PENDING',
      },
    });

    // Update report status to DISPUTED
    await prisma.badPayerReport.update({
      where: { id },
      data: { status: 'DISPUTED' },
    });

    return NextResponse.json({ dispute }, { status: 201 });
  } catch (error) {
    console.error('Error creating dispute:', error);
    return NextResponse.json(
      { error: 'Failed to create dispute' },
      { status: 500 }
    );
  }
}

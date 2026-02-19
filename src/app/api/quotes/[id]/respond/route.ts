import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendQuoteResponseNotification } from '@/lib/email';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get tradesperson profile
    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get quote and verify ownership
    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
      include: {
        customer: {
          select: { email: true, name: true },
        },
      },
    });

    if (!quote || quote.profileId !== profile.id) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (quote.status === 'RESPONDED' || quote.status === 'ACCEPTED' || quote.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Already responded to this quote' }, { status: 400 });
    }

    const body = await req.json();
    const { message, estimatedCost, availableDate } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Update quote status
    await prisma.quoteRequest.update({
      where: { id },
      data: {
        status: 'RESPONDED',
      },
    });

    // Create a conversation for messaging (simplified - just store response in a message)
    const conversation = await prisma.conversation.create({
      data: {
        quoteRequestId: id,
        participants: {
          create: [
            { userId: session.user.id },
            { userId: quote.customerId },
          ],
        },
        messages: {
          create: {
            senderId: session.user.id,
            content: message + (estimatedCost ? `\n\nEstimated cost: £${estimatedCost}` : '') + (availableDate ? `\nAvailable from: ${availableDate}` : ''),
          },
        },
      },
    });

    // Update profile response stats
    const allQuotes = await prisma.quoteRequest.findMany({
      where: { profileId: profile.id },
    });

    const respondedQuotes = allQuotes.filter(q => 
      q.status === 'RESPONDED' || q.status === 'ACCEPTED' || q.status === 'COMPLETED'
    );

    const responseRate = (respondedQuotes.length / allQuotes.length) * 100;

    await prisma.tradesProfile.update({
      where: { id: profile.id },
      data: {
        responseRate,
        responseTime: 'Within 24 hours', // Simplified - would need actual calculation
      },
    });

    // Send email notification to customer
    if (quote.customer.email) {
      await sendQuoteResponseNotification({
        customerEmail: quote.customer.email,
        customerName: quote.customer.name || 'there',
        tradespersonName: session.user.name || 'A tradesperson',
        businessName: profile.businessName,
        quoteTitle: quote.title,
        responseMessage: message,
      }).catch((err) => {
        // Log but don't fail the request if email fails
        console.error('Failed to send quote response email:', err);
      });
    }

    return NextResponse.json({
      message: 'Response sent successfully',
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('Quote response error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

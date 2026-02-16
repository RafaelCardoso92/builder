import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      profileId,
      name,
      email,
      phone,
      title,
      description,
      tradeType,
      postcode,
      address,
      timeframe,
      preferredDates,
      budgetRange,
      images,
    } = body;

    // Validate required fields
    if (!profileId || !title || !description || !postcode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check profile exists
    const profile = await prisma.tradesProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile || !profile.isActive) {
      return NextResponse.json(
        { error: 'Tradesperson not found' },
        { status: 404 }
      );
    }

    // Check subscription limits for tradesperson
    if (profile.subscriptionTier === 'FREE') {
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const monthlyQuotes = await prisma.quoteRequest.count({
        where: {
          profileId,
          createdAt: { gte: thisMonth },
        },
      });

      if (monthlyQuotes >= 10) {
        return NextResponse.json(
          { error: 'This tradesperson has reached their monthly quote limit. Please try again later.' },
          { status: 400 }
        );
      }
    }

    let customerId = session?.user?.id;

    // If not logged in, create or find guest user
    if (!customerId) {
      if (!name || !email || !phone) {
        return NextResponse.json(
          { error: 'Please provide your contact details' },
          { status: 400 }
        );
      }

      // Check if user exists with this email
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Create guest user
        user = await prisma.user.create({
          data: {
            email,
            name,
            phone,
            role: 'CUSTOMER',
          },
        });
      }

      customerId = user.id;
    }

    // Create quote request
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        profileId,
        customerId,
        title,
        description,
        tradeType,
        postcode: postcode.toUpperCase(),
        address,
        timeframe,
        preferredDates,
        budgetRange,
        images: images || [],
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      message: 'Quote request submitted successfully',
      quoteRequest: {
        id: quoteRequest.id,
      },
    });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      businessName,
      tagline,
      description,
      phone,
      email,
      website,
      address,
      city,
      postcode,
      coverageRadius,
      selectedTrades,
    } = body;

    // Get existing profile
    const existingProfile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Update profile
    const profile = await prisma.tradesProfile.update({
      where: { userId: session.user.id },
      data: {
        businessName,
        tagline,
        description,
        phone,
        email,
        website,
        address,
        city,
        postcode: postcode.toUpperCase(),
        coverageRadius: parseInt(coverageRadius) || 25,
      },
    });

    // Update trades
    if (selectedTrades && selectedTrades.length > 0) {
      // Remove existing trades
      await prisma.tradesProfileTrade.deleteMany({
        where: { profileId: profile.id },
      });

      // Add new trades
      await prisma.tradesProfileTrade.createMany({
        data: selectedTrades.map((tradeId: string) => ({
          profileId: profile.id,
          tradeId,
        })),
      });
    }

    return NextResponse.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      businessName,
      tagline,
      description,
      phone,
      email,
      website,
      address,
      city,
      postcode,
      coverageRadius,
      selectedTrades,
    } = body;

    // Check if profile already exists
    const existingProfile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = slugify(businessName, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.tradesProfile.findUnique({ where: { slug } })) {
      slug = baseSlug + '-' + counter;
      counter++;
    }

    // Create profile
    const profile = await prisma.tradesProfile.create({
      data: {
        userId: session.user.id,
        businessName,
        slug,
        tagline,
        description,
        phone,
        email,
        website,
        address,
        city,
        postcode: postcode.toUpperCase(),
        coverageRadius: parseInt(coverageRadius) || 25,
        trades: selectedTrades?.length > 0 ? {
          create: selectedTrades.map((tradeId: string) => ({
            tradeId,
          })),
        } : undefined,
      },
    });

    // Update user role if not already tradesperson
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: 'TRADESPERSON' },
    });

    return NextResponse.json({ message: 'Profile created successfully', profile });
  } catch (error) {
    console.error('Profile creation error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      businessName,
      phone,
      city,
      postcode,
      coverageRadius,
      selectedTrades,
    } = body;

    // Validate required fields
    if (!name || !email || !password || !businessName || !phone || !city || !postcode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!selectedTrades || selectedTrades.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one trade' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Generate unique slug for the business
    let baseSlug = slugify(businessName, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.tradesProfile.findUnique({ where: { slug } })) {
      slug = baseSlug + '-' + counter;
      counter++;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'TRADESPERSON',
        },
      });

      // Create tradesperson profile
      const profile = await tx.tradesProfile.create({
        data: {
          userId: user.id,
          businessName,
          slug,
          phone,
          email,
          city,
          postcode: postcode.toUpperCase(),
          coverageRadius: parseInt(coverageRadius) || 25,
          trades: {
            create: selectedTrades.map((tradeId: string) => ({
              tradeId,
            })),
          },
        },
      });

      return { user, profile };
    });

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      profile: {
        id: result.profile.id,
        businessName: result.profile.businessName,
        slug: result.profile.slug,
      },
    });
  } catch (error) {
    console.error('Tradesperson registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

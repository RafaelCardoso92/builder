import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/jobs - List jobs with filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trade = searchParams.get('trade');
    const postcode = searchParams.get('postcode');
    const status = searchParams.get('status') || 'OPEN';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = 10;

    // Bounds check for pagination
    const safePage = Math.max(1, Math.min(page, 1000));

    const where: any = {};

    // Status filter - also filter out expired jobs
    if (status === 'OPEN') {
      where.status = status;
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ];
    } else if (status) {
      where.status = status;
    }

    // Trade filter (by name or parent name)
    if (trade) {
      where.trade = {
        OR: [
          { name: { contains: trade, mode: 'insensitive' } },
          { slug: { contains: trade.toLowerCase() } },
          { parent: { name: { contains: trade, mode: 'insensitive' } } },
        ],
      };
    }

    // Postcode area filter
    if (postcode) {
      const postcodeArea = postcode.split(' ')[0].toUpperCase();
      where.postcode = { startsWith: postcodeArea };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          trade: {
            select: { name: true, slug: true },
          },
          customer: {
            select: { name: true },
          },
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (safePage - 1) * perPage,
        take: perPage,
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page: safePage,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to post a job' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      tradeId,
      postcode,
      address,
      budgetMin,
      budgetMax,
      timeframe,
      images,
    } = body;

    // Validate required fields
    if (!title || !description || !tradeId || !postcode) {
      return NextResponse.json(
        { error: 'Title, description, trade, and postcode are required' },
        { status: 400 }
      );
    }

    // Verify trade exists
    const trade = await prisma.trade.findUnique({
      where: { id: tradeId },
    });

    if (!trade) {
      return NextResponse.json(
        { error: 'Invalid trade category' },
        { status: 400 }
      );
    }

    // Set expiry date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create the job
    const job = await prisma.job.create({
      data: {
        customerId: session.user.id,
        title,
        description,
        tradeId,
        postcode: postcode.toUpperCase(),
        address,
        budgetMin: budgetMin ? parseInt(budgetMin) : null,
        budgetMax: budgetMax ? parseInt(budgetMax) : null,
        timeframe,
        images: images || [],
        status: 'OPEN',
        expiresAt,
      },
      include: {
        trade: { select: { name: true } },
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

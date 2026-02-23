import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { title, description, location, images } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        profileId: profile.id,
        title,
        description,
        location,
        images: images || [],
      },
    });

    return NextResponse.json({ message: 'Project created', portfolioItem });
  } catch (error) {
    console.error('Portfolio creation error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

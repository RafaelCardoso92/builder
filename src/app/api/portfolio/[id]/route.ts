import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if portfolio item belongs to user
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!portfolioItem || portfolioItem.profileId !== profile.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.portfolioItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Portfolio deletion error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if portfolio item belongs to user
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!portfolioItem || portfolioItem.profileId !== profile.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    const { title, description, location, images } = body;

    const updated = await prisma.portfolioItem.update({
      where: { id },
      data: {
        title,
        description,
        location,
        images: images || [],
      },
    });

    return NextResponse.json({ message: 'Project updated', portfolioItem: updated });
  } catch (error) {
    console.error('Portfolio update error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

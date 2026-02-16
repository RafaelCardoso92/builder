import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/conversations/[id] - Get conversation details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        participants: {
          some: { userId: session.user.id },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true,
                tradesProfile: {
                  select: {
                    businessName: true,
                    slug: true,
                    logo: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const otherParticipant = conversation.participants.find(
      p => p.userId !== session.user.id
    );

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        createdAt: conversation.createdAt,
        otherParticipant: otherParticipant?.user || null,
      },
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

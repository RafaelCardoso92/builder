import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/conversations - List user's conversations
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
          },
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
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Format conversations with unread count
    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const participant = conv.participants.find(p => p.userId === session.user.id);
        const otherParticipant = conv.participants.find(p => p.userId !== session.user.id);

        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: session.user.id },
            createdAt: {
              gt: participant?.lastReadAt || new Date(0),
            },
          },
        });

        return {
          id: conv.id,
          updatedAt: conv.updatedAt,
          lastMessage: conv.messages[0] || null,
          unreadCount,
          otherParticipant: otherParticipant?.user || null,
        };
      })
    );

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create or get existing conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { recipientId, initialMessage } = body;

    if (!recipientId) {
      return NextResponse.json(
        { error: 'Recipient ID is required' },
        { status: 400 }
      );
    }

    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Check for existing conversation between these two users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: { userId: session.user.id },
            },
          },
          {
            participants: {
              some: { userId: recipientId },
            },
          },
        ],
      },
      include: {
        participants: true,
      },
    });

    if (existingConversation) {
      // If there's an initial message, add it
      if (initialMessage && initialMessage.trim()) {
        await prisma.message.create({
          data: {
            conversationId: existingConversation.id,
            senderId: session.user.id,
            content: initialMessage.trim(),
            attachments: [],
          },
        });

        await prisma.conversation.update({
          where: { id: existingConversation.id },
          data: { updatedAt: new Date() },
        });
      }

      return NextResponse.json({
        conversation: { id: existingConversation.id },
        isNew: false,
      });
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: session.user.id, lastReadAt: new Date() },
            { userId: recipientId },
          ],
        },
      },
    });

    // Add initial message if provided
    if (initialMessage && initialMessage.trim()) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: session.user.id,
          content: initialMessage.trim(),
          attachments: [],
        },
      });
    }

    return NextResponse.json({
      conversation: { id: conversation.id },
      isNew: true,
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ChatInterface from './ChatInterface';

async function getConversation(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { userId },
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
            },
          },
        },
      },
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!conversation) return null;

  // Update last read time
  const participant = conversation.participants.find(p => p.userId === userId);
  if (participant) {
    await prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: { lastReadAt: new Date() },
    });
  }

  const otherParticipant = conversation.participants.find(p => p.userId !== userId);

  return {
    ...conversation,
    otherParticipant: otherParticipant?.user,
  };
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const conversation = await getConversation(id, session.user.id);

  if (!conversation) {
    notFound();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
        <Link
          href="/dashboard/messages"
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-3">
          {conversation.otherParticipant?.image ? (
            <img
              src={conversation.otherParticipant.image}
              alt={conversation.otherParticipant.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {conversation.otherParticipant?.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
          <div>
            <h2 className="font-semibold text-slate-900">
              {conversation.otherParticipant?.name || 'Unknown User'}
            </h2>
            <p className="text-sm text-slate-500">Customer</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface
        conversationId={conversation.id}
        currentUserId={session.user.id}
        initialMessages={conversation.messages}
      />
    </div>
  );
}

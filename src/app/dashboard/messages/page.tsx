import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Clock } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
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
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Get unread counts
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const participant = conv.participants.find(p => p.userId === userId);
      const otherParticipant = conv.participants.find(p => p.userId !== userId);

      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: userId },
          createdAt: {
            gt: participant?.lastReadAt || new Date(0),
          },
        },
      });

      return {
        ...conv,
        unreadCount,
        otherParticipant: otherParticipant?.user,
      };
    })
  );

  return conversationsWithUnread;
}

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return new Date(date).toLocaleDateString('en-GB', { weekday: 'short' });
  } else {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  }
}

export default async function DashboardMessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const conversations = await getConversations(session.user.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-600 mt-1">
          Communicate with customers about their projects
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No messages yet</h2>
          <p className="text-slate-600">
            When customers contact you, their messages will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={'/dashboard/messages/' + conv.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {conv.otherParticipant?.image ? (
                    <img
                      src={conv.otherParticipant.image}
                      alt={conv.otherParticipant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-lg">
                        {conv.otherParticipant?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={'font-medium truncate ' + (conv.unreadCount > 0 ? 'text-slate-900' : 'text-slate-700')}>
                      {conv.otherParticipant?.name || 'Unknown User'}
                    </h3>
                    <span className="flex-shrink-0 text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(conv.updatedAt)}
                    </span>
                  </div>
                  <p className={'text-sm truncate mt-1 ' + (conv.unreadCount > 0 ? 'text-slate-900 font-medium' : 'text-slate-500')}>
                    {conv.messages[0]?.content || 'No messages yet'}
                  </p>
                </div>

                {/* Unread Badge */}
                {conv.unreadCount > 0 && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full">
                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

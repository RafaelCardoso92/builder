import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Clock, ExternalLink } from 'lucide-react';
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
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Get unread counts and format
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

export default async function AccountMessagesPage() {
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
          Your conversations with tradespeople
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No messages yet</h2>
          <p className="text-slate-600 mb-6">
            When you contact a tradesperson, your conversation will appear here.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
          >
            Find Tradespeople
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {conversations.map((conv) => {
              const tradesperson = conv.otherParticipant;
              const profile = tradesperson?.tradesProfile;

              return (
                <Link
                  key={conv.id}
                  href={'/account/messages/' + conv.id}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {profile?.logo ? (
                      <img
                        src={profile.logo}
                        alt={profile.businessName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-lg">
                          {profile?.businessName?.charAt(0) || tradesperson?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className={'font-medium truncate ' + (conv.unreadCount > 0 ? 'text-slate-900' : 'text-slate-700')}>
                          {profile?.businessName || tradesperson?.name || 'Unknown'}
                        </h3>
                        {profile?.slug && (
                          <span
                            className="text-slate-400 hover:text-primary-600"
                            title={`View ${profile.businessName} profile`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </span>
                        )}
                      </div>
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

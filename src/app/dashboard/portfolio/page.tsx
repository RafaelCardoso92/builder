import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Plus, Image as ImageIcon, Edit } from 'lucide-react';
import DeletePortfolioButton from './DeleteButton';

async function getPortfolio(userId: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
    include: {
      portfolio: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  return profile;
}

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const profile = await getPortfolio(session.user.id);

  if (!profile) {
    redirect('/dashboard/profile');
  }

  const totalPhotos = profile.portfolio.reduce((acc, item) => acc + item.images.length, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio</h1>
          <p className="text-slate-600 mt-1">
            Showcase your best work to attract more customers
          </p>
        </div>
        <Link
          href="/dashboard/portfolio/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </Link>
      </div>

      {/* Photo Count */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Total photos</span>
          <span className="text-sm font-medium text-slate-900">
            {totalPhotos}
          </span>
        </div>
      </div>

      {/* Portfolio Grid */}
      {profile.portfolio.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No projects yet</h2>
          <p className="text-slate-600 mb-6">
            Add your first project to showcase your work
          </p>
          <Link
            href="/dashboard/portfolio/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.portfolio.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden group"
            >
              {/* Image */}
              <div className="aspect-video bg-slate-100 relative">
                {item.images[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                {item.images.length > 1 && (
                  <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                    +{item.images.length - 1} more
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                )}
                {item.location && (
                  <p className="text-xs text-slate-400 mt-2">{item.location}</p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <Link
                    href={`/dashboard/portfolio/${item.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <DeletePortfolioButton id={item.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

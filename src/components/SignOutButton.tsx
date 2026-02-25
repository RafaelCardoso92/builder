'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps {
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export default function SignOutButton({
  className = '',
  showIcon = true,
  children
}: SignOutButtonProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <button
      onClick={handleSignOut}
      className={className}
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      {children || 'Sign out'}
    </button>
  );
}

'use client';

import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      await signInWithGoogle();
    }
  };

  return (
    <div className="absolute top-6 left-6 right-6 z-50 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-black">Szafometr</h1>
      
      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2">
            {user.photoURL && (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="text-sm font-medium text-black/80 hidden sm:block">
              {user.displayName}
            </span>
          </div>
        )}
        
        <button
          onClick={handleAuthAction}
          disabled={loading}
          className="bg-white/30 backdrop-blur rounded px-3 py-2 hover:bg-white/40 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 text-black/80 animate-spin" />
          ) : user ? (
            <>
              <LogOut className="w-4 h-4 text-black/80" />
              <span className="text-sm font-medium text-black/80">Wyloguj</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 text-black/80" />
              <span className="text-sm font-medium text-black/80">Zaloguj</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
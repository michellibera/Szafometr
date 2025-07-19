import { LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  onToggleLogin: () => void;
}

export default function Header({ isLoggedIn, onToggleLogin }: HeaderProps) {
  return (
    <div className="absolute top-6 left-6 right-6 z-50 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-black">Szafometr</h1>
      <button
        onClick={onToggleLogin}
        className="bg-white/30 backdrop-blur rounded px-3 py-2 hover:bg-white/40 transition-all duration-200 flex items-center gap-2"
      >
        {isLoggedIn ? (
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
  );
}
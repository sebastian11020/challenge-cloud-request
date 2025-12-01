import type { User } from '../../types/user';
import { UserAvatar } from './UserAvatar';
import { RoleBadge } from './RoleBadge';

interface UserTileProps {
  user: User;
  onSelect: (user: User) => void;
}

export function UserTile({ user, onSelect }: UserTileProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      className="group relative flex aspect-[3/4] w-32 select-none flex-col items-center justify-center rounded-3xl border border-slate-700/70 bg-slate-900/70 px-4 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.75)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-sky-400/80 hover:bg-slate-900/90 hover:shadow-[0_22px_60px_rgba(15,23,42,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 sm:w-36 md:w-40"
    >
      <div className="mb-4 scale-110 transition-transform duration-200 group-hover:scale-125">
        <UserAvatar displayName={user.displayName} size="lg" />
      </div>

      <p className="line-clamp-2 text-center text-sm font-semibold leading-snug text-slate-50">
        {user.displayName}
      </p>

      <div className="mt-2">
        <RoleBadge role={user.role} size="md" />
      </div>
    </button>
  );
}

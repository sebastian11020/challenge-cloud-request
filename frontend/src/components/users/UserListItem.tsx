import type { User } from '../../types/user';
import { RoleBadge } from './RoleBadge';
import { UserAvatar } from './UserAvatar';

interface UserListItemProps {
  user: User;
  onSelect: (user: User) => void;
}

export function UserListItem({ user, onSelect }: UserListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(user)}
        className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm transition-all duration-150 hover:-translate-y-[1px] hover:border-slate-300 hover:shadow-md"
      >
        {/* Avatar */}
        <UserAvatar displayName={user.displayName} />

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium text-slate-900">
              {user.displayName}
            </span>
            <RoleBadge role={user.role} />
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{user.username}</p>
        </div>

        <span className="ml-1 text-slate-300 transition-colors group-hover:text-slate-500">
          →
        </span>
      </button>
    </li>
  );
}

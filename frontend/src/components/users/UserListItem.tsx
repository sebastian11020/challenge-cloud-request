import type { User } from "../../types/user";
import { RoleBadge } from "./RoleBadge";
import { UserAvatar } from "./UserAvatar";

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
                className="
          w-full flex items-center gap-3
          rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left
          shadow-sm hover:border-slate-300 hover:shadow-md
          hover:-translate-y-[1px] transition-all duration-150 group
        "
            >
                {/* Avatar */}
                <UserAvatar displayName={user.displayName} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-900 text-sm truncate">
              {user.displayName}
            </span>
                        <RoleBadge role={user.role} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{user.username}</p>
                </div>

                <span className="ml-1 text-slate-300 group-hover:text-slate-500 transition-colors">
          →
        </span>
            </button>
        </li>
    );
}

import type { User } from "../../types/user";
import { UserAvatar } from "./UserAvatar";
import { RoleBadge } from "./RoleBadge";

interface UserTileProps {
    user: User;
    onSelect: (user: User) => void;
}

export function UserTile({ user, onSelect }: UserTileProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(user)}
            className="
        group relative flex flex-col items-center justify-center
        w-32 sm:w-36 md:w-40
        aspect-[3/4]
        rounded-3xl border border-slate-700/70
        bg-slate-900/70 backdrop-blur-xl
        shadow-[0_18px_45px_rgba(15,23,42,0.75)]
        hover:border-sky-400/80 hover:bg-slate-900/90
        hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.9)]
        transition-all duration-200
        px-4 py-5
        select-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80
      "
        >
            <div className="mb-4 scale-110 group-hover:scale-125 transition-transform duration-200">
                <UserAvatar displayName={user.displayName} size="lg" />
            </div>

            <p className="text-sm font-semibold text-slate-50 text-center leading-snug line-clamp-2">
                {user.displayName}
            </p>

            <div className="mt-2">
                <RoleBadge role={user.role} size="md" />
            </div>
        </button>
    );
}

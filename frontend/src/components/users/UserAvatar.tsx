export interface UserAvatarProps {
    displayName: string;
    size?: "sm" | "lg"; // small / large
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function UserAvatar({ displayName, size = "sm" }: UserAvatarProps) {
    const sizeClasses =
        size === "lg"
            ? "h-20 w-20 text-xl"
            : "h-10 w-10 text-sm";

    return (
        <div
            className={`
        flex items-center justify-center rounded-full 
        bg-sky-500 font-semibold text-white 
        shadow-lg ${sizeClasses}
      `}
        >
            {getInitials(displayName)}
        </div>
    );
}

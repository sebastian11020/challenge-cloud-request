import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import type {ReactNode} from "react";
import type { User } from "../types/user";

interface UserContextValue {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUserState] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
            try {
                setCurrentUserState(JSON.parse(stored) as User);
            } catch {
                localStorage.removeItem("currentUser");
            }
        }
    }, []);

    const setCurrentUser = (user: User | null) => {
        setCurrentUserState(user);
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
        } else {
            localStorage.removeItem("currentUser");
        }
    };

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return ctx;
}

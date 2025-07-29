
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut, deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = ["dhandesaurav52@gmail.com"];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthManager({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    const refreshUser = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            await currentUser.reload();
            const refreshedUser = auth.currentUser;
            setUser(refreshedUser);
            setIsAdmin(refreshedUser ? ADMIN_EMAILS.includes(refreshedUser.email || "") : false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAdmin(user ? ADMIN_EMAILS.includes(user.email || "") : false);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        await firebaseSignOut(auth);
        router.push("/");
    };
    
    const deleteAccount = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            await deleteUser(currentUser);
            router.push("/");
        } else {
            throw new Error("No user is currently signed in.");
        }
    };

    const value = { user, loading, isAdmin, signOut, refreshUser, deleteAccount };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthManager>{children}</AuthManager>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

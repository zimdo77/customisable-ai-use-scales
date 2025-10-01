"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type UserContextType = {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    avatar?: string;
  } | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserContextType["user"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        setUser(null);
      } else {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.full_name,
          role: data.user.user_metadata.role,
          avatar: data.user.user_metadata.avatar,
        });
      }
      setLoading(false);
    };

    loadUser();

    // Listen for auth state changes (login, logout, refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.full_name,
          role: session.user.user_metadata.role,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// custom hook for easy use
export const useUser = () => useContext(UserContext);

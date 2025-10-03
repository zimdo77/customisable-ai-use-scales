// hooks/useRole.ts
import { useEffect, useState } from 'react';
import { getUserRole, type UserRole } from '@/lib/auth-helpers';
import { supabase } from '@/lib/supabaseClient';

interface UseRoleReturn {
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  isUser: boolean;
  error: Error | null;
}

/**
 * Hook to get and monitor user role from JWT
 * Automatically updates when auth state changes
 */
export function useRole(): UseRoleReturn {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial role fetch
    fetchRole();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // User signed in or token refreshed - get role from new JWT
        await fetchRole();
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        setRole(null);
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchRole() {
    try {
      setLoading(true);
      setError(null);

      const userRole = await getUserRole();
      setRole(userRole);

      console.log('Role fetched from JWT:', userRole);
    } catch (err) {
      console.error('Error fetching role:', err);
      setError(err as Error);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }

  return {
    role,
    loading,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    error,
  };
}

/**
 * Hook for protecting components based on role
 * Redirects if user doesn't have required role
 */
export function useRequireRole(
  requiredRole: UserRole,
  redirectTo: string = '/unauthorized',
) {
  const { role, loading } = useRole();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (role === requiredRole) {
        setHasAccess(true);
      } else {
        // Redirect if role doesn't match
        window.location.href = redirectTo;
      }
    }
  }, [role, loading, requiredRole, redirectTo]);

  return { hasAccess, loading };
}

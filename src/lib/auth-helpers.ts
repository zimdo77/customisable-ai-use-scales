// lib/auth-helpers.ts
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Type definitions
export type UserRole = 'admin' | 'user';

export interface UserWithRole extends User {
  role: UserRole;
}

/**
 * Gets the current user with their role from JWT
 * No database call needed - role is in the token!
 */
export async function getCurrentUser(): Promise<UserWithRole | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Extract role from JWT (app_metadata)
    // This comes from our custom_access_token_hook
    const role = (user.app_metadata?.role as UserRole) || 'user';

    return {
      ...user,
      role,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Quick role checks - no database calls!
 */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

export async function isUser(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'user';
}

/**
 * Get the raw JWT token (useful for debugging)
 */
export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Decode and inspect JWT claims (for debugging)
 */
export async function inspectToken() {
  const session = await getSession();

  if (!session?.access_token) {
    console.log('No active session');
    return null;
  }

  // Decode the JWT (it's base64 encoded)
  const parts = session.access_token.split('.');
  if (parts.length !== 3) {
    console.error('Invalid JWT format');
    return null;
  }

  // Decode the payload (second part)
  const payload = JSON.parse(atob(parts[1]));

  console.log('JWT Claims:', {
    userId: payload.sub,
    email: payload.email,
    role: payload.app_metadata?.role || payload.user_role,
    issuedAt: new Date(payload.iat * 1000).toLocaleString(),
    expiresAt: new Date(payload.exp * 1000).toLocaleString(),
    appMetadata: payload.app_metadata,
    userMetadata: payload.user_metadata,
  });

  return payload;
}

/**
 * Force refresh the session (useful after role changes)
 */
export async function refreshUserSession() {
  const { data, error } = await supabase.auth.refreshSession();

  if (error) {
    console.error('Error refreshing session:', error);
    return false;
  }

  console.log('Session refreshed. New role:', data.user?.app_metadata?.role);
  return true;
}

/**
 * Sign out the user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    return false;
  }
  return true;
}

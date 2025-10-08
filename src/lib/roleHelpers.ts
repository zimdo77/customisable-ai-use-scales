// lib/roleHelpers.ts
import { supabase } from '@/lib/supabaseClient';

/**
 * Get the current user's role from the database
 */
export async function getUserRole(): Promise<'admin' | 'user' | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching role:', error);
      return null;
    }

    return data?.role as 'admin' | 'user' | null;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
}

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'admin';
}

/**
 * Check if current user is a regular user
 */
export async function isUser(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'user';
}

/**
 * Get full user profile including role
 */
export async function getUserProfile() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

/**
 * Admin function: Update a user's role (admin only)
 */
export async function updateUserRole(
  userId: string,
  newRole: 'admin' | 'user',
): Promise<boolean> {
  try {
    // First check if current user is admin
    const currentUserRole = await getUserRole();

    if (currentUserRole !== 'admin') {
      console.error('Only admins can update roles');
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      console.error('Error updating role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return false;
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  try {
    // Check if current user is admin
    const currentUserRole = await getUserRole();

    if (currentUserRole !== 'admin') {
      console.error('Only admins can view all users');
      return [];
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
}

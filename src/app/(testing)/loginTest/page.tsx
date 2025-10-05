// app/test-role/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestRolePage() {
  const [status, setStatus] = useState<string>('Loading...');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [profileInfo, setProfileInfo] = useState<any>(null);

  useEffect(() => {
    checkEverything();
  }, []);

  const checkEverything = async () => {
    try {
      // Step 1: Check if user is logged in
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setStatus(`❌ Auth Error: ${userError.message}`);
        return;
      }

      if (!user) {
        setStatus('❌ Not logged in');
        return;
      }

      setUserInfo({
        id: user.id,
        email: user.email,
      });

      setStatus(`✅ Logged in as: ${user.email}`);

      // Step 2: Try to fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single

      if (profileError) {
        setStatus(
          (prev) => prev + `\n❌ Profile Error: ${profileError.message}`,
        );
        setProfileInfo({ error: profileError.message });
      } else if (!profile) {
        setStatus((prev) => prev + '\n⚠️ No profile found');
        setProfileInfo({ error: 'No profile exists' });
      } else {
        setStatus((prev) => prev + `\n✅ Profile found! Role: ${profile.role}`);
        setProfileInfo(profile);
      }
    } catch (error: any) {
      setStatus(`❌ Unexpected error: ${error.message}`);
    }
  };

  const createProfile = async () => {
    if (!userInfo) {
      alert('Not logged in!');
      return;
    }

    setStatus('Creating profile...');

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userInfo.id,
        email: userInfo.email,
        role: 'user',
      })
      .select()
      .single();

    if (error) {
      setStatus(`❌ Failed to create: ${error.message}`);
    } else {
      setStatus(`✅ Profile created with role: ${data.role}`);
      setProfileInfo(data);
    }
  };

  const makeAdmin = async () => {
    if (!userInfo) {
      alert('Not logged in!');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userInfo.id)
      .select()
      .single();

    if (error) {
      setStatus(`❌ Failed to update: ${error.message}`);
    } else {
      setStatus(`✅ You are now an admin!`);
      setProfileInfo(data);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Role Testing Page</h1>

      {/* Status Display */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <pre className="whitespace-pre-wrap">{status}</pre>
      </div>

      {/* User Info */}
      {userInfo && (
        <div className="bg-blue-50 p-4 rounded mb-6">
          <h2 className="font-bold mb-2">User Info:</h2>
          <p>ID: {userInfo.id}</p>
          <p>Email: {userInfo.email}</p>
        </div>
      )}

      {/* Profile Info */}
      {profileInfo && !profileInfo.error && (
        <div className="bg-green-50 p-4 rounded mb-6">
          <h2 className="font-bold mb-2">Profile Info:</h2>
          <p>Role: {profileInfo.role}</p>
          <p>Created: {profileInfo.created_at}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={checkEverything}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>

        {profileInfo?.error && (
          <button
            onClick={createProfile}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Profile
          </button>
        )}

        {profileInfo && !profileInfo.error && profileInfo.role !== 'admin' && (
          <button
            onClick={makeAdmin}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Make Me Admin
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold mb-2">If you see errors:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>The profiles table might not exist</li>
          <li>Your profile might not have been created</li>
          <li>Click "Create Profile" if you see that button</li>
          <li>If nothing works, check the Supabase SQL Editor</li>
        </ol>
      </div>
    </div>
  );
}

// Profile & Settings
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/UserContext';

export default function ProfilePage() {
  const router = useRouter();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const { user, loading } = useUser();

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated!');
    await supabase.auth.updateUser({ password: newPassword });
    await supabase.auth.signOut();
    router.push('/signin#changed_password=true');
  };
  
  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Name updated!');
    await supabase.auth.updateUser({ data: { full_name: newUsername } });
    setNewUsername('');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  }

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold tracking-tighter">
                Profile and Settings
              </h1>
              <h2 className="text-xl font-semibold">
                Welcome {user?.name || ''}!
              </h2>
              <p className="text-muted-foreground">
                Update your account details below
              </p>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="w-24 h-24 border-2 border-black">
                <AvatarImage src={user?.avatar || ''} alt="Profile" />
                <AvatarFallback>◎</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Edit Photo
              </Button>
            </div>
            {/* Change Name Form*/}
            <form className="space-y-4" onSubmit={handleNameChange}>
              <Input
                type="text"
                placeholder="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Confirm
              </Button>
            </form>


            {/* Password form */}
            <form className="space-y-4" onSubmit={handlePassword}>
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Confirm
              </Button>
            </form>

            {/* Sign out */}
            <Button variant="secondary" className="w-full" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

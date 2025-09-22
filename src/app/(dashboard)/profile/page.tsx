// Profile & Settings
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated!');
  };

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
              <p className="text-muted-foreground">
                Update your account details below
              </p>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="w-24 h-24 border-2 border-black">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback>◎</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Edit Photo
              </Button>
            </div>

            {/* Password form */}
            <form className="space-y-4" onSubmit={handleConfirm}>
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
            <Button variant="secondary" className="w-full">
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

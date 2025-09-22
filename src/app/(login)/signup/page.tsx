'use client';

import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SignUpPage() {
  // Code here
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Sign up handler
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    // Reset error state
    setError('');

    // Check if passwords match
    if (password != confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password Strength
    if (password.length < 6) {
      setError('Password should be at least 6 characters long');
    }

    setLoading(true);

    try {
      // sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Check if email confirmation needed
        if (data.user.identities?.length == 0) {
          setSuccess(true);
          setError('');
          // Clear form
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        } else {
          // Don't need email confirmation
          router.push('/login');
        }
      }
    } catch (err) {
      setError('An unexpected error occured. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // This div basically centers everything with a light grey background
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      {/* Panel fades and drops in */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Make the card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* The Header */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold tracking-tighter">Sign Up</h1>
            <p className="text-muted-foreground">
              Please sign up to save and view templates!
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>
                Registration successful! Please check your email to confirm your
                account.
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              {/* htmlFor="email" links this label to id=email */}
              <Label htmlFor="email">Email</Label>
              {/* id, links it to hmtlFor, and type tells the browser this field is an email */}
              <Input
                id="email"
                type="email"
                placeholder="Please enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              ></Input>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              {/* relative is means to reference this div later when we change the positioning of objects */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Please enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                ></Input>
                {/* Creating the eye icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Re-enter Password</Label>
              {/* relative is means to reference this div later when we change the positioning of objects */}
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Please re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                ></Input>
                {/* Creating the eye icon */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              {loading ? 'Creating account ...' : 'Register'}
            </Button>
          </form>

          {/* Added link to sign in */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{' '}
            </span>
            <button
              onClick={() => router.push('/signin')}
              className="text-primary hover:underline font-medium"
              disabled={loading} // ← Also disabled during loading
            >
              Sign in
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

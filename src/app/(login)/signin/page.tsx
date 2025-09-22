// magic-link login, no siderbar
'use client';

import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail } from 'lucide-react';

export default function LoginPage() {
  // Code here
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
            <h1 className="text-3xl font-bold tracking-tighter">
              Welcome back!
            </h1>
            <p className="text-muted-foreground">
              Please login to view your templates
            </p>
          </div>

          <form className="space-y-4">
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
              ></Input>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              {/* relative is means to reference this div later when we change the positioning of objects */}
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Please enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/signup')}
          >
            <Mail className="mr-2 h-4 2-4"></Mail>
            Create New Account
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

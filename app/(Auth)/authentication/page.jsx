'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GoogleIcon, GitHubIcon, LogoIcon } from '../../Icons';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard'); // redirect if already signed in
      }
    };
    checkSession();
  }, [router, supabase]);

  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`, // must be set in Supabase dashboard
      },
    });
    if (error) console.error('OAuth error:', error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4 grid-bg">
      <div className="absolute inset-0 z-[-1] animate-spin-slow bg-gradient-radial from-violet-600/10 via-indigo-500/10 to-transparent" />
      <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-violet-900/20 p-8">
        <div className="text-center mb-8">
          <a href="#" className="inline-flex items-center space-x-3">
            <LogoIcon />
            <span className="text-3xl font-bold text-white">Meritly</span>
          </a>
        </div>

        <h2 className="text-center text-2xl font-bold mb-2">Welcome back</h2>
        <p className="text-center text-sm text-gray-400 mb-8">Sign in to continue to Meritly</p>

        <div className="space-y-4">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white/5 border border-white/20 rounded-lg text-white font-medium hover:bg-white/10 transition"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
          <button
            onClick={() => handleOAuthLogin('github')}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white/5 border border-white/20 rounded-lg text-white font-medium hover:bg-white/10 transition"
          >
            <GitHubIcon />
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="flex items-center my-8">
          <hr className="flex-grow border-t border-white/10" />
          <span className="mx-4 text-xs text-gray-400">OR</span>
          <hr className="flex-grow border-t border-white/10" />
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
              alert(error.message);
            } else {
              router.push('/dashboard');
            }
          }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <a href="#" className="text-xs font-medium text-violet-400 hover:text-violet-300">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-violet-500"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Don't have an account?{' '}
          <a href="/signup" className="font-medium text-violet-400 hover:text-violet-300">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

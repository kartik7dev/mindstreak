// app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-6"
      >
        <Card className="shadow-2xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold tracking-tight">
              Welcome to MindStreak
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Track habits. Unlock insights. Stay consistent.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              variant="outline"
              className="gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <FcGoogle className="w-5 h-5" />
              Sign in with Google
            </Button>

            {/* You can add more auth providers below if needed */}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

'use client';

import { SubmitEventHandler, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, AtSign, Zap, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as NextAuthReact from 'next-auth/react';

import { SportButton } from '@/app/ui/components/SportButton';
import { useToast } from '@/app/ui/hooks/use-toast';
import { DomainError, DomainErrorName } from '@/app/domain/shared/DomainError';
import { domainErrorMessages } from '@/app/ui/lib/utils';

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const result = await NextAuthReact.signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.replace('/group');
    } catch (error) {
      const defaultMessage = 'Erro ao fazer login. Tente novamente.';

      const errorMessage = error instanceof Error
        ? domainErrorMessages[error.message as DomainErrorName] ?? defaultMessage
        : defaultMessage;

      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.2 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary blur-3xl"
        />
      </div>

      <div className="relative w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-4">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Bem-vindo
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Entre na sua conta para continuar
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl shadow-card p-6 space-y-5"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Nome de usuário
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="seu_usuario"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <SportButton type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </SportButton>
          </form>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              ou
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-primary font-semibold"
            >
              Cadastre-se
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
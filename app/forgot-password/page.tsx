'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast(); // Initialize useToast

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        toast({
          title: 'Erro ao Redefinir Senha',
          description: resetError.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'E-mail Enviado',
          description: 'Se o e-mail estiver registrado, você receberá um link para redefinir sua senha.',
        });
      }
    } catch (err) {
      console.error('Unexpected error during password reset request:', err);
      toast({
        title: 'Erro Inesperado',
        description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Esqueceu a Senha?</CardTitle>
          <CardDescription>Digite seu e-mail para receber um link de redefinição de senha.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Redefinir Senha'
              )}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Lembrou da senha?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:underline">
                Faça login
              </a>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}

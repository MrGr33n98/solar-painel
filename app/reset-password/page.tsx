'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast(); // Initialize useToast

  // Optional: Check if user is already logged in or if there's a valid token
  // useEffect(() => {
  //   const checkUser = async () => {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (user) {
  //       router.push('/dashboard'); // Redirect if already logged in
  //     }
  //   };
  //   checkUser();
  // }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        toast({
          title: 'Erro ao Redefinir Senha',
          description: updateError.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Senha Redefinida',
          description: 'Sua senha foi redefinida com sucesso! Redirecionando para o login...',
        });
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
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
          <CardTitle className="text-2xl font-bold text-gray-900">Redefinir Senha</CardTitle>
          <CardDescription>Digite sua nova senha.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redefinindo...
                </>
              ) : (
                'Redefinir Senha'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

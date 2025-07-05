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

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast(); // Initialize useToast

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        toast({
          title: 'Erro no Registro',
          description: signUpError.message,
          variant: 'destructive',
        });
      } else if (data.user) {
        toast({
          title: 'Registro Bem-Sucedido',
          description: 'Verifique seu e-mail para confirmar a conta.',
        });
        // Optionally redirect after a short delay or on email confirmation
        // router.push('/login'); 
      } else {
        toast({
          title: 'Registro Bem-Sucedido',
          description: 'Verifique seu e-mail para confirmar a conta.',
        });
      }
    } catch (err) {
      console.error('Unexpected error during registration:', err);
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
          <CardTitle className="text-2xl font-bold text-gray-900">Criar Conta</CardTitle>
          <CardDescription>Preencha seus dados para criar uma nova conta.</CardDescription>
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
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
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
                  Registrando...
                </>
              ) : (
                'Registrar'
              )}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
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

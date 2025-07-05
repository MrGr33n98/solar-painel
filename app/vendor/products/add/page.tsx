'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Save,
  Upload,
  Plus,
  Minus,
  Package,
  Award,
  Shield,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, ProductSchemaType } from '@/lib/schemas/product';

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProductSchemaType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      vendorId: '', // This will be set by the authenticated user
      images: [],
    },
  });

  const productImages = watch('images'); // Watch images field for rendering

  const categories = [
    'Painéis Solares',
    'Inversores',
    'Baterias',
    'Estruturas de Fixação',
    'Cabos e Conectores',
    'Monitoramento',
    'Kits Completos',
    'Serviços de Instalação'
  ];

  const commonCertifications = [
    'INMETRO',
    'IEC 61215',
    'IEC 61730',
    'ABNT NBR 16149',
    'UN38.3',
    'Qualivolt'
  ];

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles(prev => [...prev, e.target.files![0]]);
    }
  };

  const removeImageFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('products') // Assuming you have a bucket named 'products'
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const onSubmit = async (data: ProductSchemaType) => {
    setIsLoading(true);

    try {
      // Upload images to Supabase Storage
      const uploadedImageUrls: string[] = [];
      for (const file of imageFiles) {
        const url = await uploadImage(file);
        uploadedImageUrls.push(url);
      }

      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Erro',
          description: 'Usuário não autenticado.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Prepare product data to send to the backend API
      const productDataToSend = {
        name: data.name,
        description: data.description,
        price: data.price,
        vendorId: user.id, // Use the authenticated user's ID as vendorId
        images: uploadedImageUrls, // Send uploaded image URLs
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productDataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      toast({
        title: 'Sucesso',
        description: 'Produto cadastrado com sucesso!',
      });
      router.push('/vendor/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: 'Erro ao cadastrar produto',
        description: error.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Adicionar Novo Produto</h1>
          <p className="text-gray-600 mt-1">
            Cadastre um novo produto ou serviço de energia solar
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ex: Painel Solar Monocristalino 450W"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <select
                  id="category"
                  {...register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descreva as características e benefícios do produto..."
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <Label htmlFor="stock">Estoque *</Label>
                <Input
                  id="stock"
                  type="number"
                  {...register('stock', { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Imagens do Produto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              {imageFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input value={file.name} readOnly className="flex-1" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImageFile(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Specifications - Keep as is for now, not part of ProductSchema */}
        <Card>
          <CardHeader>
            <CardTitle>Especificações Técnicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ... existing specification logic ... */}
            {/* This part is not directly validated by ProductSchema yet */}
            <p className="text-sm text-gray-500">As especificações não são validadas pelo Zod neste momento.</p>
          </CardContent>
        </Card>

        {/* Warranty and Certifications - Keep as is for now, not part of ProductSchema */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Garantia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="warranty">Informações de Garantia *</Label>
              <Textarea
                id="warranty"
                {...register('warranty')}
                placeholder="Ex: 25 anos para potência, 12 anos para produto"
                rows={3}
              />
              {errors.warranty && <p className="text-red-500 text-sm mt-1">{errors.warranty.message}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ... existing certification logic ... */}
              {/* This part is not directly validated by ProductSchema yet */}
              <p className="text-sm text-gray-500">As certificações não são validadas pelo Zod neste momento.</p>
            </CardContent>
          </Card>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Cadastrar Produto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

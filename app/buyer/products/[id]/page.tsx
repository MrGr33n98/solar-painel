""use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Award,
  Building2,
  Phone,
  Mail,
  MapPin,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product details');
        toast({
          title: 'Erro',
          description: err.message || 'Falha ao carregar detalhes do produto.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAddToCart = () => {
    // Add to cart logic
    toast({
      title: 'Adicionado ao Carrinho',
      description: `${quantity} unidade(s) de ${product.name} adicionada(s) ao carrinho!`,
    });
  };

  const handleAddReview = () => {
    if (newReview.comment.trim()) {
      const review = {
        id: reviews.length + 1,
        userName: 'Usuário Atual',
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date()
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      toast({
        title: 'Avaliação Enviada',
        description: 'Sua avaliação foi adicionada com sucesso!',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-gray-600">Carregando produto...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Erro: {error}</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-600">Produto não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <span>Marketplace</span> / <span>{product.category || 'N/A'}</span> / <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images && product.images.length > 0 ? product.images[selectedImage] : 'https://via.placeholder.com/400'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-green-500' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>

          {/* Rating - Assuming product has rating and reviews count for now */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < (product.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {(product.rating || 0).toFixed(1)} ({(product.reviewsCount || 0)} avaliações)
            </span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(product.price)}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{product.category || 'Geral'}</Badge>
              <Badge className="bg-green-100 text-green-800">
                {product.stock || 0} em estoque
              </Badge>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certificações
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.certification && product.certification.map((cert: string, index: number) => (
                <Badge key={index} variant="outline">{cert}</Badge>
              ))}
            </div>
          </div>

          {/* Warranty */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Garantia
            </h3>
            <p className="text-gray-600">{product.warranty || 'Não especificado'}</p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="font-medium">Quantidade:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {[...Array(Math.min(10, product.stock || 0))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={(product.stock || 0) === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {(product.stock || 0) === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? 'text-red-600 border-red-600' : ''}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Frete calculado no checkout • Entrega em todo o Brasil</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Especificações Técnicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications && product.specifications.map((spec: { key: string, value: string }, index: number) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium">{spec.key}:</span>
                <span className="text-gray-600">{spec.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Info - Placeholder for now, will be fetched from DB later */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Sobre o Vendedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Informações do vendedor serão carregadas aqui.</p>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Avaliações dos Clientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Review */}
          <div className="border-b pb-6">
            <h3 className="font-medium mb-4">Deixe sua avaliação</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nota:</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`h-6 w-6 ${
                        star <= newReview.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="h-full w-full" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comentário:</label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Conte sobre sua experiência com este produto..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddReview}>Enviar Avaliação</Button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{review.userName}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Intl.DateTimeFormat('pt-BR').format(review.date)}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

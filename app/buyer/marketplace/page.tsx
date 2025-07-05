"use client";

import { useState, useEffect } from 'react';
import ProductCard from '@/components/products/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ShoppingCart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
        toast({
          title: 'Erro ao carregar produtos',
          description: err.message || 'Não foi possível carregar os produtos. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setCart(prev => [...prev]); // Simplified for now, actual cart logic would be here
      toast({
        title: 'Item Adicionado',
        description: `${product.name} foi adicionado ao carrinho.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Solar Energy Marketplace
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover high-quality solar panels, inverters, and installation services 
          from trusted vendors across the country.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Solar Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for solar panels, inverters, batteries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="ml-2 text-gray-600">Carregando produtos...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-500">Erro ao carregar produtos: {error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">
            Nenhum produto encontrado. Tente ajustar sua busca ou filtros.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
          <div className="flex items-center gap-2 text-sm">
            <ShoppingCart className="h-4 w-4" />
            <span>{cart.length} items in cart</span>
            <Button size="sm" className="ml-2">
              View Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { DataService } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Plus, 
  X, 
  Star, 
  Check, 
  Minus,
  ShoppingCart,
  Heart,
  Share2
} from 'lucide-react';

export default function ProductComparePage() {
  const [products, setProducts] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const dataService = DataService.getInstance();
      const allProducts = (await dataService.getProducts()).filter(p => p.status === 'active');
      setAvailableProducts(allProducts);

      // Load from localStorage if available
      const saved = localStorage.getItem('compareList');
      if (saved) {
        const savedIds = JSON.parse(saved);
        const savedProducts = allProducts.filter(p => savedIds.includes(p.id));
        setCompareList(savedProducts);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('compareList', JSON.stringify(compareList.map(p => p.id)));
  }, [compareList]);

  const addToCompare = (product) => {
    if (compareList.length < 4 && !compareList.find(p => p.id === product.id)) {
      setCompareList([...compareList, product]);
    }
  };

  const removeFromCompare = (productId) => {
    setCompareList(compareList.filter(p => p.id !== productId));
  };

  const clearAll = () => {
    setCompareList([]);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getComparisonValue = (products, field, type = 'number') => {
    if (type === 'number') {
      const values = products.map(p => {
        if (field.includes('.')) {
          const [obj, key] = field.split('.');
          return parseFloat(p[obj]?.[key]) || 0;
        }
        return parseFloat(p[field]) || 0;
      });
      const max = Math.max(...values);
      const min = Math.min(...values);
      return { max, min };
    }
    return null;
  };

  const isHighlight = (product, field, type = 'number', highlight = 'max') => {
    if (compareList.length < 2) return false;
    
    const comparison = getComparisonValue(compareList, field, type);
    if (!comparison) return false;
    
    let value;
    if (field.includes('.')) {
      const [obj, key] = field.split('.');
      value = parseFloat(product[obj]?.[key]) || 0;
    } else {
      value = parseFloat(product[field]) || 0;
    }
    
    if (highlight === 'max') {
      return value === comparison.max && comparison.max !== comparison.min;
    } else {
      return value === comparison.min && comparison.max !== comparison.min;
    }
  };

  const specifications = [
    { key: 'Potência', field: 'specifications.Potência' },
    { key: 'Eficiência', field: 'specifications.Eficiência' },
    { key: 'Dimensões', field: 'specifications.Dimensões' },
    { key: 'Peso', field: 'specifications.Peso' },
    { key: 'Garantia', field: 'warranty' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Comparar Produtos</h1>
          <p className="text-gray-600 mt-1">
            Compare até 4 produtos lado a lado para tomar a melhor decisão
          </p>
        </div>
        {compareList.length > 0 && (
          <Button variant="outline" onClick={clearAll}>
            Limpar Comparação
          </Button>
        )}
      </div>

      {/* Add Products Section */}
      {compareList.length < 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Produtos à Comparação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableProducts
                .filter(p => !compareList.find(cp => cp.id === p.id))
                .slice(0, 6)
                .map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.vendorName}</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addToCompare(product)}
                    className="w-full"
                    disabled={compareList.length >= 4}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Comparar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      {compareList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Comparação de Produtos ({compareList.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-4 w-48">Características</th>
                    {compareList.map((product) => (
                      <th key={product.id} className="text-center p-4 min-w-64">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-100 hover:bg-red-200"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded mx-auto mb-2"
                          />
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">
                            {product.vendorName}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr className="border-t">
                    <td className="p-4 font-medium">Preço</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className={`text-lg font-bold ${
                          isHighlight(product, 'price', 'number', 'min') 
                            ? 'text-green-600 bg-green-50 rounded px-2 py-1' 
                            : 'text-gray-900'
                        }`}>
                          {formatCurrency(product.price)}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="border-t">
                    <td className="p-4 font-medium">Avaliação</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className={`flex items-center justify-center space-x-1 ${
                          isHighlight(product, 'rating', 'number', 'max') 
                            ? 'bg-yellow-50 rounded px-2 py-1' 
                            : ''
                        }`}>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{product.rating}</span>
                          <span className="text-sm text-gray-600">
                            ({product.reviews})
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Stock */}
                  <tr className="border-t">
                    <td className="p-4 font-medium">Estoque</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className={`${
                          isHighlight(product, 'stock', 'number', 'max') 
                            ? 'text-green-600 bg-green-50 rounded px-2 py-1 font-medium' 
                            : product.stock < 10 
                              ? 'text-red-600' 
                              : 'text-gray-900'
                        }`}>
                          {product.stock} unidades
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Specifications */}
                  {specifications.map((spec) => (
                    <tr key={spec.key} className="border-t">
                      <td className="p-4 font-medium">{spec.key}</td>
                      {compareList.map((product) => {
                        let value;
                        if (spec.field.includes('.')) {
                          const [obj, key] = spec.field.split('.');
                          value = product[obj]?.[key] || 'N/A';
                        } else {
                          value = product[spec.field] || 'N/A';
                        }
                        
                        return (
                          <td key={product.id} className="p-4 text-center">
                            <div className="text-sm">{value}</div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Certifications */}
                  <tr className="border-t">
                    <td className="p-4 font-medium">Certificações</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="space-y-1">
                          {product.certification.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr className="border-t bg-gray-50">
                    <td className="p-4 font-medium">Ações</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="space-y-2">
                          <Button size="sm" className="w-full">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Adicionar ao Carrinho
                          </Button>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {compareList.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum produto selecionado
            </h3>
            <p className="text-gray-600 mb-6">
              Adicione produtos à comparação para ver as diferenças lado a lado
            </p>
            <Button onClick={() => window.location.href = '/buyer/marketplace'}>
              Explorar Produtos
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comparison Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Dicas para Comparação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Valores em Destaque
              </h4>
              <p className="text-sm text-gray-600">
                Valores destacados em verde indicam o melhor preço, e em amarelo a melhor avaliação.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                Considere as Avaliações
              </h4>
              <p className="text-sm text-gray-600">
                Produtos com mais avaliações tendem a ser mais confiáveis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
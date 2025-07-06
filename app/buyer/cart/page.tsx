"use client";

import { useState, useEffect } from 'react';
import { DataService } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Truck,
  MapPin,
  Calculator
} from 'lucide-react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const ds = DataService.getInstance();
    ds.getCart().then(items => {
      setCartItems(items.map(i => ({
        id: i.productId,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images?.[0] || '',
        vendorName: i.product.vendorId
      })))
    })
  }, []);

  const [shippingInfo, setShippingInfo] = useState({
    cep: '',
    address: '',
    city: '',
    state: '',
    complement: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [couponCode, setCouponCode] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    const ds = DataService.getInstance();
    if (newQuantity === 0) {
      ds.removeCartItem(id).then(() =>
        setCartItems(items => items.filter(item => item.id !== id))
      )
      return;
    }
    ds.updateCartItem(id, newQuantity).then(() =>
      setCartItems(items =>
        items.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    )
  };

  const removeItem = (id: string) => {
    const ds = DataService.getInstance();
    ds.removeCartItem(id).then(() =>
      setCartItems(items => items.filter(item => item.id !== id))
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 150.00; // Mock shipping cost
  const discount = 0; // Mock discount
  const total = subtotal + shipping - discount;

  const handleCheckout = () => {
    const ds = DataService.getInstance();
    ds.checkout({
      shippingAddress: `${shippingInfo.address}, ${shippingInfo.city} - ${shippingInfo.state}`,
      paymentMethod,
    }).then(order => {
      if (order) {
        setCartItems([]);
        alert('Pedido realizado com sucesso!');
      }
    });
  };

  const calculateShipping = () => {
    // Mock shipping calculation
    alert('Frete calculado: R$ 150,00');
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-600 mb-6">Adicione produtos ao seu carrinho para continuar</p>
        <Button onClick={() => window.history.back()}>
          Continuar Comprando
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
        <p className="text-gray-600 mt-1">
          Revise seus itens e finalize sua compra
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Itens do Carrinho ({cartItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">por {item.vendorName}</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="cep"
                      value={shippingInfo.cep}
                      onChange={(e) => setShippingInfo({...shippingInfo, cep: e.target.value})}
                      placeholder="00000-000"
                    />
                    <Button variant="outline" onClick={calculateShipping}>
                      <Calculator className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  placeholder="Rua, número"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <select
                    id="state"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecione</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="RS">Rio Grande do Sul</option>
                    {/* Add more states */}
                  </select>
                </div>
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={shippingInfo.complement}
                    onChange={(e) => setShippingInfo({...shippingInfo, complement: e.target.value})}
                    placeholder="Apto, bloco, etc."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto:</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="space-y-2">
                <Label htmlFor="coupon">Cupom de Desconto</Label>
                <div className="flex space-x-2">
                  <Input
                    id="coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Digite o código"
                  />
                  <Button variant="outline">Aplicar</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Forma de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="pix"
                    checked={paymentMethod === 'pix'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>PIX (5% de desconto)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="credit"
                    checked={paymentMethod === 'credit'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cartão de Crédito</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="boleto"
                    checked={paymentMethod === 'boleto'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Boleto Bancário</span>
                </label>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Finalizar Compra
              </Button>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Entrega em 5-10 dias úteis</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
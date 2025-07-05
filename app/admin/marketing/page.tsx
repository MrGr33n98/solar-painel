"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Percent, 
  DollarSign, 
  Truck, 
  Image, 
  Calendar,
  Users,
  TrendingUp,
  Send,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      name: 'Promoção Verão Solar',
      type: 'email',
      status: 'active',
      sent: 1250,
      opened: 875,
      clicked: 156,
      createdAt: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'Black Friday Solar',
      type: 'banner',
      status: 'scheduled',
      views: 0,
      clicks: 0,
      createdAt: new Date('2024-01-25')
    }
  ]);

  const [coupons, setCoupons] = useState([
    {
      id: 'SOLAR20',
      name: '20% Off Painéis',
      type: 'percentage',
      value: 20,
      category: 'Painéis Solares',
      used: 45,
      limit: 100,
      expiresAt: new Date('2024-03-01'),
      status: 'active'
    },
    {
      id: 'FRETEGRATIS',
      name: 'Frete Grátis',
      type: 'shipping',
      value: 0,
      category: 'Todos',
      used: 23,
      limit: 50,
      expiresAt: new Date('2024-02-15'),
      status: 'active'
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email',
    subject: '',
    content: '',
    targetAudience: 'all'
  });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    name: '',
    type: 'percentage',
    value: 0,
    category: 'Todos',
    limit: 100,
    expiresAt: ''
  });

  const handleCreateCampaign = () => {
    const campaign = {
      id: Date.now().toString(),
      ...newCampaign,
      status: 'draft',
      sent: 0,
      opened: 0,
      clicked: 0,
      views: 0,
      clicks: 0,
      createdAt: new Date()
    };
    setCampaigns([campaign, ...campaigns]);
    setNewCampaign({ name: '', type: 'email', subject: '', content: '', targetAudience: 'all' });
    alert('Campanha criada com sucesso!');
  };

  const handleCreateCoupon = () => {
    const coupon = {
      id: newCoupon.code,
      ...newCoupon,
      used: 0,
      status: 'active',
      expiresAt: new Date(newCoupon.expiresAt)
    };
    setCoupons([coupon, ...coupons]);
    setNewCoupon({ code: '', name: '', type: 'percentage', value: 0, category: 'Todos', limit: 100, expiresAt: '' });
    alert('Cupom criado com sucesso!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketing e Promoções</h1>
        <p className="text-gray-600 mt-1">
          Gerencie campanhas, cupons e promoções da plataforma
        </p>
      </div>

      {/* Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Campanhas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">E-mails Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + (c.sent || 0), 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Abertura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">69.8%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cupons Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.filter(c => c.status === 'active').length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Campanhas de E-mail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create Campaign Form */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-3">Nova Campanha</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="campaignName">Nome da Campanha</Label>
                  <Input
                    id="campaignName"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    placeholder="Ex: Promoção Primavera Solar"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="campaignType">Tipo</Label>
                    <select
                      id="campaignType"
                      value={newCampaign.type}
                      onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="email">E-mail</option>
                      <option value="banner">Banner</option>
                      <option value="push">Push Notification</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="targetAudience">Público</Label>
                    <select
                      id="targetAudience"
                      value={newCampaign.targetAudience}
                      onChange={(e) => setNewCampaign({...newCampaign, targetAudience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="all">Todos</option>
                      <option value="buyers">Compradores</option>
                      <option value="vendors">Vendedores</option>
                    </select>
                  </div>
                </div>
                {newCampaign.type === 'email' && (
                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      value={newCampaign.subject}
                      onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                      placeholder="Assunto do e-mail"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                    placeholder="Conteúdo da campanha..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateCampaign} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Campanha
                </Button>
              </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Tipo: {campaign.type} • Criada em {campaign.createdAt.toLocaleDateString('pt-BR')}
                  </div>
                  {campaign.type === 'email' && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Enviados:</span>
                        <div className="font-medium">{campaign.sent}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Abertos:</span>
                        <div className="font-medium">{campaign.opened}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Cliques:</span>
                        <div className="font-medium">{campaign.clicked}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    {campaign.status === 'draft' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Send className="h-4 w-4 mr-1" />
                        Enviar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Coupons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Cupons de Desconto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create Coupon Form */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-3">Novo Cupom</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="couponCode">Código</Label>
                    <Input
                      id="couponCode"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                      placeholder="SOLAR20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="couponName">Nome</Label>
                    <Input
                      id="couponName"
                      value={newCoupon.name}
                      onChange={(e) => setNewCoupon({...newCoupon, name: e.target.value})}
                      placeholder="20% Off Painéis"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="couponType">Tipo</Label>
                    <select
                      id="couponType"
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="percentage">Percentual</option>
                      <option value="fixed">Valor Fixo</option>
                      <option value="shipping">Frete Grátis</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="couponValue">Valor</Label>
                    <Input
                      id="couponValue"
                      type="number"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon({...newCoupon, value: parseFloat(e.target.value)})}
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="couponLimit">Limite</Label>
                    <Input
                      id="couponLimit"
                      type="number"
                      value={newCoupon.limit}
                      onChange={(e) => setNewCoupon({...newCoupon, limit: parseInt(e.target.value)})}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="couponCategory">Categoria</Label>
                    <select
                      id="couponCategory"
                      value={newCoupon.category}
                      onChange={(e) => setNewCoupon({...newCoupon, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Todos">Todos</option>
                      <option value="Painéis Solares">Painéis Solares</option>
                      <option value="Inversores">Inversores</option>
                      <option value="Baterias">Baterias</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="couponExpires">Expira em</Label>
                    <Input
                      id="couponExpires"
                      type="date"
                      value={newCoupon.expiresAt}
                      onChange={(e) => setNewCoupon({...newCoupon, expiresAt: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateCoupon} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Cupom
                </Button>
              </div>
            </div>

            {/* Coupons List */}
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{coupon.name}</h4>
                      <div className="text-sm text-gray-600">Código: {coupon.id}</div>
                    </div>
                    <Badge className={getStatusColor(coupon.status)}>
                      {coupon.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Valor:</span>
                      <div className="font-medium">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : 
                         coupon.type === 'fixed' ? formatCurrency(coupon.value) : 'Frete Grátis'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Usado:</span>
                      <div className="font-medium">{coupon.used}/{coupon.limit}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    Categoria: {coupon.category} • Expira em {coupon.expiresAt.toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banners Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Banners e Destaques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <h3 className="font-medium mb-2">Banner Principal</h3>
              <p className="text-sm text-gray-600 mb-4">1200x400px</p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Banner
              </Button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <h3 className="font-medium mb-2">Banner Lateral</h3>
              <p className="text-sm text-gray-600 mb-4">300x600px</p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Banner
              </Button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <h3 className="font-medium mb-2">Banner Rodapé</h3>
              <p className="text-sm text-gray-600 mb-4">1200x200px</p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Banner
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
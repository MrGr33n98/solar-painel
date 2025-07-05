"use client";

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  MessageCircle,
  Star,
  Filter
} from 'lucide-react';

export default function VendorCRMPage() {
  const [customers, setCustomers] = useState([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-8888',
      city: 'São Paulo',
      state: 'SP',
      status: 'lead',
      source: 'website',
      totalPurchases: 0,
      lastContact: new Date('2024-01-25'),
      createdAt: new Date('2024-01-20'),
      notes: 'Interessado em sistema residencial 5kWp',
      tags: ['residencial', 'primeira-compra']
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      phone: '(21) 99999-7777',
      city: 'Rio de Janeiro',
      state: 'RJ',
      status: 'customer',
      source: 'referral',
      totalPurchases: 15999.99,
      lastContact: new Date('2024-01-22'),
      createdAt: new Date('2024-01-10'),
      notes: 'Cliente satisfeita, possível expansão do sistema',
      tags: ['comercial', 'fidelizado']
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      email: 'carlos@construtora.com',
      phone: '(31) 99999-6666',
      city: 'Belo Horizonte',
      state: 'MG',
      status: 'prospect',
      source: 'simulator',
      totalPurchases: 0,
      lastContact: new Date('2024-01-24'),
      createdAt: new Date('2024-01-22'),
      notes: 'Solicitou orçamento para condomínio',
      tags: ['comercial', 'grande-porte']
    }
  ]);

  const [interactions, setInteractions] = useState([
    {
      id: '1',
      customerId: '1',
      type: 'call',
      subject: 'Primeira conversa sobre energia solar',
      description: 'Cliente demonstrou interesse em sistema residencial',
      date: new Date('2024-01-25'),
      duration: 30
    },
    {
      id: '2',
      customerId: '2',
      type: 'email',
      subject: 'Proposta de expansão do sistema',
      description: 'Enviada proposta para adicionar mais 2kWp',
      date: new Date('2024-01-22')
    }
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [showNewInteraction, setShowNewInteraction] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    source: 'website',
    notes: '',
    tags: ''
  });

  const [newInteraction, setNewInteraction] = useState({
    type: 'call',
    subject: '',
    description: '',
    duration: ''
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'website': return 'bg-purple-100 text-purple-800';
      case 'referral': return 'bg-green-100 text-green-800';
      case 'simulator': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAddCustomer = () => {
    const customer = {
      id: Date.now().toString(),
      ...newCustomer,
      status: 'lead',
      totalPurchases: 0,
      lastContact: new Date(),
      createdAt: new Date(),
      tags: newCustomer.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    setCustomers([customer, ...customers]);
    setNewCustomer({
      name: '', email: '', phone: '', city: '', state: '',
      source: 'website', notes: '', tags: ''
    });
    setShowNewCustomer(false);
    alert('Cliente adicionado com sucesso!');
  };

  const handleAddInteraction = () => {
    const interaction = {
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      ...newInteraction,
      date: new Date(),
      duration: newInteraction.type === 'call' ? parseInt(newInteraction.duration) : undefined
    };
    setInteractions([interaction, ...interactions]);
    
    // Update last contact
    setCustomers(customers.map(c => 
      c.id === selectedCustomer.id 
        ? { ...c, lastContact: new Date() }
        : c
    ));
    
    setNewInteraction({
      type: 'call', subject: '', description: '', duration: ''
    });
    setShowNewInteraction(false);
    alert('Interação registrada com sucesso!');
  };

  const customerInteractions = selectedCustomer 
    ? interactions.filter(i => i.customerId === selectedCustomer.id)
    : [];

  const totalCustomers = customers.length;
  const totalLeads = customers.filter(c => c.status === 'lead').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
  const conversionRate = totalCustomers > 0 ? (customers.filter(c => c.status === 'customer').length / totalCustomers) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">CRM - Gestão de Clientes</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus leads, prospects e clientes
          </p>
        </div>
        <Button onClick={() => setShowNewCustomer(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Leads Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {conversionRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lista de Clientes
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Todos os Status</option>
                  <option value="lead">Leads</option>
                  <option value="prospect">Prospects</option>
                  <option value="customer">Clientes</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div 
                    key={customer.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedCustomer?.id === customer.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{customer.name}</h3>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                        <Badge className={getSourceColor(customer.source)}>
                          {customer.source}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {customer.city}, {customer.state}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(customer.totalPurchases)}
                      </div>
                    </div>

                    {customer.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {customer.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Último contato: {customer.lastContact.toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Details */}
        <div>
          {selectedCustomer ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Detalhes do Cliente</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowNewInteraction(true)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{selectedCustomer.name}</h3>
                  <div className="flex space-x-2 mt-1">
                    <Badge className={getStatusColor(selectedCustomer.status)}>
                      {selectedCustomer.status}
                    </Badge>
                    <Badge className={getSourceColor(selectedCustomer.source)}>
                      {selectedCustomer.source}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {selectedCustomer.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {selectedCustomer.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {selectedCustomer.city}, {selectedCustomer.state}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Informações Comerciais</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Compras:</span>
                      <div className="font-medium text-green-600">
                        {formatCurrency(selectedCustomer.totalPurchases)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Cliente desde:</span>
                      <div className="font-medium">
                        {selectedCustomer.createdAt.toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedCustomer.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Observações</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {selectedCustomer.notes}
                    </p>
                  </div>
                )}

                {selectedCustomer.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedCustomer.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactions History */}
                <div>
                  <h4 className="font-medium mb-2">Histórico de Interações</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {customerInteractions.map((interaction) => (
                      <div key={interaction.id} className="border rounded p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{interaction.subject}</span>
                          <Badge variant="outline" className="text-xs">
                            {interaction.type}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-1">{interaction.description}</p>
                        <div className="text-xs text-gray-500">
                          {interaction.date.toLocaleDateString('pt-BR')}
                          {interaction.duration && ` • ${interaction.duration} min`}
                        </div>
                      </div>
                    ))}
                    {customerInteractions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        Nenhuma interação registrada
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecione um Cliente
                </h3>
                <p className="text-gray-600">
                  Clique em um cliente da lista para ver os detalhes
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Customer Modal */}
      {showNewCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Novo Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Nome</Label>
                <Input
                  id="customerName"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="customerEmail">E-mail</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Telefone</Label>
                  <Input
                    id="customerPhone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="customerCity">Cidade</Label>
                  <Input
                    id="customerCity"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <Label htmlFor="customerState">Estado</Label>
                  <select
                    id="customerState"
                    value={newCustomer.state}
                    onChange={(e) => setNewCustomer({...newCustomer, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecione</option>
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    {/* Add more states */}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="customerSource">Origem</Label>
                <select
                  id="customerSource"
                  value={newCustomer.source}
                  onChange={(e) => setNewCustomer({...newCustomer, source: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="website">Website</option>
                  <option value="referral">Indicação</option>
                  <option value="simulator">Simulador</option>
                  <option value="social">Redes Sociais</option>
                  <option value="phone">Telefone</option>
                </select>
              </div>
              <div>
                <Label htmlFor="customerTags">Tags (separadas por vírgula)</Label>
                <Input
                  id="customerTags"
                  value={newCustomer.tags}
                  onChange={(e) => setNewCustomer({...newCustomer, tags: e.target.value})}
                  placeholder="residencial, primeira-compra"
                />
              </div>
              <div>
                <Label htmlFor="customerNotes">Observações</Label>
                <Textarea
                  id="customerNotes"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                  placeholder="Observações sobre o cliente..."
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddCustomer} className="flex-1">
                  Adicionar Cliente
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewCustomer(false)}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Interaction Modal */}
      {showNewInteraction && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Nova Interação - {selectedCustomer.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="interactionType">Tipo de Interação</Label>
                <select
                  id="interactionType"
                  value={newInteraction.type}
                  onChange={(e) => setNewInteraction({...newInteraction, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="call">Ligação</option>
                  <option value="email">E-mail</option>
                  <option value="meeting">Reunião</option>
                  <option value="visit">Visita</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div>
                <Label htmlFor="interactionSubject">Assunto</Label>
                <Input
                  id="interactionSubject"
                  value={newInteraction.subject}
                  onChange={(e) => setNewInteraction({...newInteraction, subject: e.target.value})}
                  placeholder="Assunto da interação"
                />
              </div>
              <div>
                <Label htmlFor="interactionDescription">Descrição</Label>
                <Textarea
                  id="interactionDescription"
                  value={newInteraction.description}
                  onChange={(e) => setNewInteraction({...newInteraction, description: e.target.value})}
                  placeholder="Descreva o que foi discutido..."
                  rows={3}
                />
              </div>
              {newInteraction.type === 'call' && (
                <div>
                  <Label htmlFor="interactionDuration">Duração (minutos)</Label>
                  <Input
                    id="interactionDuration"
                    type="number"
                    value={newInteraction.duration}
                    onChange={(e) => setNewInteraction({...newInteraction, duration: e.target.value})}
                    placeholder="30"
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <Button onClick={handleAddInteraction} className="flex-1">
                  Registrar Interação
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewInteraction(false)}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
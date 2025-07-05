"use client";

import { useState, useEffect } from 'react';
import { DataService } from '@/lib/data';
import { AuthService } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search, 
  Calculator,
  Send,
  Eye,
  Edit,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react';

export default function VendorQuotesPage() {
  const [quotes, setQuotes] = useState([
    {
      id: 'COT-001',
      customerName: 'João Silva',
      customerEmail: 'joao.silva@email.com',
      customerPhone: '(11) 99999-8888',
      status: 'draft',
      systemPower: 5.0,
      totalValue: 22500.00,
      validUntil: new Date('2024-02-15'),
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-25'),
      items: [
        { id: '1', name: 'Painel Solar 450W', quantity: 12, unitPrice: 899.99, total: 10799.88 },
        { id: '2', name: 'Inversor 5kW', quantity: 1, unitPrice: 3299.99, total: 3299.99 },
        { id: '3', name: 'Estrutura de Fixação', quantity: 1, unitPrice: 1500.00, total: 1500.00 },
        { id: '4', name: 'Instalação e Projeto', quantity: 1, unitPrice: 6900.13, total: 6900.13 }
      ],
      notes: 'Sistema residencial com garantia estendida'
    },
    {
      id: 'COT-002',
      customerName: 'Maria Santos',
      customerEmail: 'maria@empresa.com',
      customerPhone: '(21) 99999-7777',
      status: 'sent',
      systemPower: 10.0,
      totalValue: 42000.00,
      validUntil: new Date('2024-02-20'),
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-24'),
      items: [
        { id: '1', name: 'Painel Solar 450W', quantity: 24, unitPrice: 899.99, total: 21599.76 },
        { id: '2', name: 'Inversor 10kW', quantity: 1, unitPrice: 5999.99, total: 5999.99 },
        { id: '3', name: 'Estrutura Comercial', quantity: 1, unitPrice: 2500.00, total: 2500.00 },
        { id: '4', name: 'Instalação Comercial', quantity: 1, unitPrice: 11900.25, total: 11900.25 }
      ],
      notes: 'Sistema comercial com monitoramento avançado'
    }
  ]);

  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showNewQuote, setShowNewQuote] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [newQuote, setNewQuote] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    systemPower: '',
    validUntil: '',
    notes: '',
    items: [
      { name: '', quantity: 1, unitPrice: 0 }
    ]
  });

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'expired': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const addQuoteItem = () => {
    setNewQuote({
      ...newQuote,
      items: [...newQuote.items, { name: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const updateQuoteItem = (index, field, value) => {
    const updatedItems = [...newQuote.items];
    updatedItems[index][field] = value;
    setNewQuote({ ...newQuote, items: updatedItems });
  };

  const removeQuoteItem = (index) => {
    const updatedItems = newQuote.items.filter((_, i) => i !== index);
    setNewQuote({ ...newQuote, items: updatedItems });
  };

  const calculateQuoteTotal = () => {
    return newQuote.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };

  const handleCreateQuote = () => {
    const quote = {
      id: `COT-${String(quotes.length + 1).padStart(3, '0')}`,
      ...newQuote,
      status: 'draft',
      systemPower: parseFloat(newQuote.systemPower),
      totalValue: calculateQuoteTotal(),
      validUntil: new Date(newQuote.validUntil),
      createdAt: new Date(),
      updatedAt: new Date(),
      items: newQuote.items.map((item, index) => ({
        id: String(index + 1),
        ...item,
        total: item.quantity * item.unitPrice
      }))
    };

    setQuotes([quote, ...quotes]);
    setNewQuote({
      customerName: '', customerEmail: '', customerPhone: '',
      systemPower: '', validUntil: '', notes: '',
      items: [{ name: '', quantity: 1, unitPrice: 0 }]
    });
    setShowNewQuote(false);
    alert('Orçamento criado com sucesso!');
  };

  const handleSendQuote = (quoteId) => {
    setQuotes(quotes.map(q => 
      q.id === quoteId 
        ? { ...q, status: 'sent', updatedAt: new Date() }
        : q
    ));
    alert('Orçamento enviado para o cliente!');
  };

  const totalQuotes = quotes.length;
  const draftQuotes = quotes.filter(q => q.status === 'draft').length;
  const sentQuotes = quotes.filter(q => q.status === 'sent').length;
  const acceptedQuotes = quotes.filter(q => q.status === 'accepted').length;
  const totalValue = quotes.reduce((sum, q) => sum + q.totalValue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Cotações</h1>
          <p className="text-gray-600 mt-1">
            Crie e gerencie orçamentos personalizados para seus clientes
          </p>
        </div>
        <Button onClick={() => setShowNewQuote(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Cotação
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Cotações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rascunhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{draftQuotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Enviadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{sentQuotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aceitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{acceptedQuotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quotes List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Lista de Cotações
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar cotações..."
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
                  <option value="draft">Rascunho</option>
                  <option value="sent">Enviada</option>
                  <option value="accepted">Aceita</option>
                  <option value="rejected">Rejeitada</option>
                  <option value="expired">Expirada</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredQuotes.map((quote) => (
                  <div 
                    key={quote.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedQuote?.id === quote.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedQuote(quote)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{quote.id}</h3>
                      <Badge className={getStatusColor(quote.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(quote.status)}
                          <span>{quote.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                      <div>Cliente: {quote.customerName}</div>
                      <div>Sistema: {quote.systemPower} kWp</div>
                      <div>Valor: {formatCurrency(quote.totalValue)}</div>
                      <div>Válido até: {quote.validUntil.toLocaleDateString('pt-BR')}</div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Criado em {quote.createdAt.toLocaleDateString('pt-BR')} • 
                      Atualizado em {quote.updatedAt.toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quote Details */}
        <div>
          {selectedQuote ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Detalhes da Cotação</span>
                  <div className="flex space-x-2">
                    {selectedQuote.status === 'draft' && (
                      <Button 
                        size="sm"
                        onClick={() => handleSendQuote(selectedQuote.id)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Enviar
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{selectedQuote.id}</h3>
                  <Badge className={getStatusColor(selectedQuote.status)}>
                    {selectedQuote.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div><strong>Cliente:</strong> {selectedQuote.customerName}</div>
                  <div><strong>E-mail:</strong> {selectedQuote.customerEmail}</div>
                  <div><strong>Telefone:</strong> {selectedQuote.customerPhone}</div>
                  <div><strong>Sistema:</strong> {selectedQuote.systemPower} kWp</div>
                  <div><strong>Válido até:</strong> {selectedQuote.validUntil.toLocaleDateString('pt-BR')}</div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Itens da Cotação</h4>
                  <div className="space-y-2">
                    {selectedQuote.items.map((item) => (
                      <div key={item.id} className="border rounded p-2 text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          {item.quantity}x {formatCurrency(item.unitPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      {formatCurrency(selectedQuote.totalValue)}
                    </span>
                  </div>
                </div>

                {selectedQuote.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Observações</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {selectedQuote.notes}
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  <div>Criado: {selectedQuote.createdAt.toLocaleDateString('pt-BR')}</div>
                  <div>Atualizado: {selectedQuote.updatedAt.toLocaleDateString('pt-BR')}</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecione uma Cotação
                </h3>
                <p className="text-gray-600">
                  Clique em uma cotação da lista para ver os detalhes
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Quote Modal */}
      {showNewQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-4xl my-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Nova Cotação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="customerName">Nome do Cliente</Label>
                  <Input
                    id="customerName"
                    value={newQuote.customerName}
                    onChange={(e) => setNewQuote({...newQuote, customerName: e.target.value})}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">E-mail</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={newQuote.customerEmail}
                    onChange={(e) => setNewQuote({...newQuote, customerEmail: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Telefone</Label>
                  <Input
                    id="customerPhone"
                    value={newQuote.customerPhone}
                    onChange={(e) => setNewQuote({...newQuote, customerPhone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systemPower">Potência do Sistema (kWp)</Label>
                  <Input
                    id="systemPower"
                    type="number"
                    step="0.1"
                    value={newQuote.systemPower}
                    onChange={(e) => setNewQuote({...newQuote, systemPower: e.target.value})}
                    placeholder="5.0"
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Válido até</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={newQuote.validUntil}
                    onChange={(e) => setNewQuote({...newQuote, validUntil: e.target.value})}
                  />
                </div>
              </div>

              {/* Quote Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Itens da Cotação</h3>
                  <Button variant="outline" size="sm" onClick={addQuoteItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {newQuote.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 border rounded">
                      <div className="md:col-span-2">
                        <Input
                          placeholder="Nome do item"
                          value={item.name}
                          onChange={(e) => updateQuoteItem(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Qtd"
                          value={item.quantity}
                          onChange={(e) => updateQuoteItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Preço unit."
                          value={item.unitPrice}
                          onChange={(e) => updateQuoteItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </span>
                        {newQuote.items.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuoteItem(index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-4 p-3 bg-gray-50 rounded">
                  <div className="text-lg font-bold">
                    Total: {formatCurrency(calculateQuoteTotal())}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newQuote.notes}
                  onChange={(e) => setNewQuote({...newQuote, notes: e.target.value})}
                  placeholder="Observações sobre a cotação..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleCreateQuote} className="flex-1">
                  Criar Cotação
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewQuote(false)}
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
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save, DollarSign, Shield, Mail, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'SolarHub Brasil',
    commissionRate: 5.0,
    minOrderValue: 100.0,
    maxOrderValue: 100000.0,
    supportEmail: 'suporte@solarhub.com.br',
    supportPhone: '(11) 4000-0000',
    termsOfService: 'Termos e condições do marketplace...',
    privacyPolicy: 'Política de privacidade...',
    pixKey: 'solarhub@pix.com.br',
    bankAccount: 'Banco do Brasil - Ag: 1234-5 - CC: 12345-6',
    autoApproveVendors: false,
    requireDocumentVerification: true,
    enableEmailNotifications: true,
    enableSmsNotifications: false
  });

  const handleSave = () => {
    // Here you would save to backend
    console.log('Saving settings:', settings);
    alert('Configurações salvas com sucesso!');
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Configurações da Plataforma</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as configurações gerais do marketplace
          </p>
        </div>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="platformName">Nome da Plataforma</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => handleInputChange('platformName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="supportEmail">Email de Suporte</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="supportPhone">Telefone de Suporte</Label>
              <Input
                id="supportPhone"
                value={settings.supportPhone}
                onChange={(e) => handleInputChange('supportPhone', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Configurações Financeiras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="commissionRate">Taxa de Comissão (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.1"
                value={settings.commissionRate}
                onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="minOrderValue">Valor Mínimo do Pedido (R$)</Label>
              <Input
                id="minOrderValue"
                type="number"
                step="0.01"
                value={settings.minOrderValue}
                onChange={(e) => handleInputChange('minOrderValue', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="maxOrderValue">Valor Máximo do Pedido (R$)</Label>
              <Input
                id="maxOrderValue"
                type="number"
                step="0.01"
                value={settings.maxOrderValue}
                onChange={(e) => handleInputChange('maxOrderValue', parseFloat(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configurações de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pixKey">Chave PIX da Empresa</Label>
              <Input
                id="pixKey"
                value={settings.pixKey}
                onChange={(e) => handleInputChange('pixKey', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bankAccount">Conta Bancária</Label>
              <Input
                id="bankAccount"
                value={settings.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configurações de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoApproveVendors"
                checked={settings.autoApproveVendors}
                onChange={(e) => handleInputChange('autoApproveVendors', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="autoApproveVendors">Aprovar vendedores automaticamente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requireDocumentVerification"
                checked={settings.requireDocumentVerification}
                onChange={(e) => handleInputChange('requireDocumentVerification', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="requireDocumentVerification">Exigir verificação de documentos</Label>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configurações de Notificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enableEmailNotifications"
                checked={settings.enableEmailNotifications}
                onChange={(e) => handleInputChange('enableEmailNotifications', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="enableEmailNotifications">Habilitar notificações por email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enableSmsNotifications"
                checked={settings.enableSmsNotifications}
                onChange={(e) => handleInputChange('enableSmsNotifications', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="enableSmsNotifications">Habilitar notificações por SMS</Label>
            </div>
          </CardContent>
        </Card>

        {/* Legal Documents */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Documentos Legais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="termsOfService">Termos de Serviço</Label>
              <Textarea
                id="termsOfService"
                rows={6}
                value={settings.termsOfService}
                onChange={(e) => handleInputChange('termsOfService', e.target.value)}
                placeholder="Digite os termos de serviço..."
              />
            </div>
            <div>
              <Label htmlFor="privacyPolicy">Política de Privacidade</Label>
              <Textarea
                id="privacyPolicy"
                rows={6}
                value={settings.privacyPolicy}
                onChange={(e) => handleInputChange('privacyPolicy', e.target.value)}
                placeholder="Digite a política de privacidade..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
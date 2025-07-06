"use client";

import { useState, useEffect } from 'react';
import { DataService } from '@/lib/data';
import { AuthService } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  Save, 
  Upload, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Award,
  Users,
  Calendar
} from 'lucide-react';

export default function CompanyProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState({
    name: '',
    cnpj: '',
    inscricaoEstadual: '',
    address: '',
    city: '',
    state: '',
    cep: '',
    phone: '',
    website: '',
    description: '',
    logo: '',
    certifications: [''],
    foundedYear: new Date().getFullYear(),
    employeeCount: '',
    serviceAreas: ['']
  });

  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const employeeRanges = [
    '1-10',
    '11-50',
    '51-100',
    '101-500',
    '500+'
  ];

  const commonCertifications = [
    'INMETRO',
    'ABNT',
    'Qualivolt',
    'ISO 9001',
    'ISO 14001',
    'CRESESB'
  ];

  useEffect(() => {
    const fetchCompany = async () => {
      const authService = AuthService.getInstance();
      const dataService = DataService.getInstance();
      const currentUser = authService.getCurrentUser();

      if (currentUser) {
        const existingCompany = await dataService.getCompanyByVendorId(currentUser.id);
        if (existingCompany) {
          setCompany(existingCompany);
        } else {
          // Initialize with user data
          setCompany(prev => ({
            ...prev,
            name: currentUser.company || '',
            phone: currentUser.phone || '',
            cnpj: currentUser.cnpj || ''
          }));
        }
      }
    };

    fetchCompany();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setCompany(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'certifications' | 'serviceAreas', index: number, value: string) => {
    const newArray = [...company[field]];
    newArray[index] = value;
    setCompany(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field: 'certifications' | 'serviceAreas') => {
    setCompany(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'certifications' | 'serviceAreas', index: number) => {
    setCompany(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const formatCNPJ = (value: string) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatCEP = (value: string) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authService = AuthService.getInstance();
      const dataService = DataService.getInstance();
      const currentUser = authService.getCurrentUser();

      if (!currentUser) {
        alert('Usuário não autenticado');
        return;
      }

      // Filter out empty arrays
      const filteredCertifications = company.certifications.filter(cert => cert.trim());
      const filteredServiceAreas = company.serviceAreas.filter(area => area.trim());

      const companyData = {
        ...company,
        id: company.id || Date.now().toString(),
        vendorId: currentUser.id,
        certifications: filteredCertifications,
        serviceAreas: filteredServiceAreas
      };

      await dataService.updateCompany(currentUser.id, companyData);
      alert('Perfil da empresa atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Perfil da Empresa</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as informações públicas da sua empresa
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Razão Social *</Label>
                <Input
                  id="name"
                  value={company.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome da empresa"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={company.cnpj}
                  onChange={(e) => handleInputChange('cnpj', formatCNPJ(e.target.value))}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  value={company.inscricaoEstadual}
                  onChange={(e) => handleInputChange('inscricaoEstadual', e.target.value)}
                  placeholder="000.000.000.000"
                />
              </div>
              <div>
                <Label htmlFor="foundedYear">Ano de Fundação</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  value={company.foundedYear}
                  onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição da Empresa *</Label>
              <Textarea
                id="description"
                value={company.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva sua empresa, especialidades e diferenciais..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeCount">Número de Funcionários</Label>
                <select
                  id="employeeCount"
                  value={company.employeeCount}
                  onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  {employeeRanges.map(range => (
                    <option key={range} value={range}>{range} funcionários</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="logo">URL do Logo</Label>
                <Input
                  id="logo"
                  value={company.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={company.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={company.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.empresa.com.br"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={company.cep}
                  onChange={(e) => handleInputChange('cep', formatCEP(e.target.value))}
                  placeholder="00000-000"
                  maxLength={9}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={company.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Nome da cidade"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">Estado *</Label>
                <select
                  id="state"
                  value={company.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Endereço Completo *</Label>
              <Input
                id="address"
                value={company.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua, número, bairro"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {company.certifications.map((cert, index) => (
              <div key={index} className="flex items-center space-x-2">
                <select
                  value={cert}
                  onChange={(e) => handleArrayChange('certifications', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione uma certificação</option>
                  {commonCertifications.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {company.certifications.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('certifications', index)}
                  >
                    Remover
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('certifications')}
              className="w-full"
            >
              Adicionar Certificação
            </Button>
          </CardContent>
        </Card>

        {/* Service Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Áreas de Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {company.serviceAreas.map((area, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={area}
                  onChange={(e) => handleArrayChange('serviceAreas', index, e.target.value)}
                  placeholder="Ex: São Paulo, Rio de Janeiro"
                  className="flex-1"
                />
                {company.serviceAreas.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('serviceAreas', index)}
                  >
                    Remover
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('serviceAreas')}
              className="w-full"
            >
              Adicionar Área de Atendimento
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Perfil
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
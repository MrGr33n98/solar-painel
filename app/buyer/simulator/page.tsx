"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calculator, 
  Zap, 
  Home, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  Sun,
  Battery,
  Lightbulb,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';

export default function SolarSimulatorPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Location
    cep: '',
    city: '',
    state: '',
    
    // Step 2: Property
    propertyType: 'residential',
    roofArea: '',
    roofType: 'ceramic',
    shading: 'none',
    
    // Step 3: Energy Consumption
    monthlyBill: '',
    monthlyConsumption: '',
    tariff: 0.75,
    
    // Step 4: Preferences
    systemType: 'grid-tied',
    budget: '',
    installationUrgency: 'flexible'
  });

  const [results, setResults] = useState(null);

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const solarIrradiation = {
    'SP': 4.5, 'RJ': 4.8, 'MG': 5.2, 'RS': 4.2, 'PR': 4.3,
    'SC': 4.1, 'BA': 5.8, 'PE': 5.9, 'CE': 6.1, 'GO': 5.5,
    'DF': 5.4, 'MT': 5.6, 'MS': 5.3, 'ES': 5.0, 'RN': 6.0,
    'PB': 5.8, 'AL': 5.7, 'SE': 5.6, 'PI': 5.9, 'MA': 5.4,
    'TO': 5.7, 'PA': 5.1, 'AM': 4.8, 'RR': 4.9, 'AP': 4.7,
    'AC': 4.6, 'RO': 4.9
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateSystem = () => {
    const monthlyConsumption = parseFloat(formData.monthlyConsumption) || 
                              (parseFloat(formData.monthlyBill) / formData.tariff);
    
    const dailyConsumption = monthlyConsumption / 30;
    const irradiation = solarIrradiation[formData.state] || 5.0;
    const systemEfficiency = 0.8; // 80% efficiency
    
    // Calculate required system power
    const requiredPower = (dailyConsumption / (irradiation * systemEfficiency)) * 1000; // in Watts
    
    // Calculate number of panels (assuming 450W panels)
    const panelPower = 450;
    const numberOfPanels = Math.ceil(requiredPower / panelPower);
    const actualSystemPower = numberOfPanels * panelPower;
    
    // Calculate costs
    const pricePerWatt = 4.5; // R$ per Watt installed
    const systemCost = (actualSystemPower / 1000) * pricePerWatt * 1000;
    
    // Calculate savings
    const monthlyGeneration = (actualSystemPower / 1000) * irradiation * 30 * systemEfficiency;
    const monthlySavings = monthlyGeneration * formData.tariff;
    const paybackPeriod = systemCost / (monthlySavings * 12);
    const savings25Years = (monthlySavings * 12 * 25) - systemCost;
    
    // Environmental impact
    const co2Reduction = monthlyGeneration * 12 * 0.0817; // kg CO2 per kWh
    
    setResults({
      systemPower: actualSystemPower / 1000,
      numberOfPanels,
      systemCost,
      monthlyGeneration,
      monthlySavings,
      paybackPeriod,
      savings25Years,
      co2Reduction,
      roofAreaNeeded: numberOfPanels * 2.5, // m² per panel
      irradiation
    });
    
    setStep(5);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value, decimals = 1) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      calculateSystem();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-yellow-500 p-3 rounded-full">
            <Calculator className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Simulador de Energia Solar
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descubra o potencial de economia e o sistema solar ideal para sua propriedade
        </p>
      </div>

      {step <= 4 && (
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Etapa {step} de 4
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((step / 4) * 100)}% concluído
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {step === 1 && <><MapPin className="h-5 w-5" /> Localização</>}
                {step === 2 && <><Home className="h-5 w-5" /> Propriedade</>}
                {step === 3 && <><Zap className="h-5 w-5" /> Consumo de Energia</>}
                {step === 4 && <><Sun className="h-5 w-5" /> Preferências do Sistema</>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Location */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleInputChange('cep', e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Nome da cidade"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <select
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Selecione</option>
                        {brazilianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <Lightbulb className="h-4 w-4 inline mr-2" />
                      A localização é importante para calcular a irradiação solar da sua região.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Property */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label>Tipo de Propriedade</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('propertyType', 'residential')}
                        className={`p-4 border rounded-lg text-center ${
                          formData.propertyType === 'residential' 
                            ? 'border-yellow-500 bg-yellow-50' 
                            : 'border-gray-300'
                        }`}
                      >
                        <Home className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium">Residencial</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('propertyType', 'commercial')}
                        className={`p-4 border rounded-lg text-center ${
                          formData.propertyType === 'commercial' 
                            ? 'border-yellow-500 bg-yellow-50' 
                            : 'border-gray-300'
                        }`}
                      >
                        <div className="h-6 w-6 mx-auto mb-2 bg-gray-400 rounded"></div>
                        <div className="font-medium">Comercial</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="roofArea">Área do Telhado Disponível (m²)</Label>
                    <Input
                      id="roofArea"
                      type="number"
                      value={formData.roofArea}
                      onChange={(e) => handleInputChange('roofArea', e.target.value)}
                      placeholder="Ex: 50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="roofType">Tipo de Telhado</Label>
                    <select
                      id="roofType"
                      value={formData.roofType}
                      onChange={(e) => handleInputChange('roofType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="ceramic">Cerâmico</option>
                      <option value="concrete">Concreto</option>
                      <option value="metal">Metálico</option>
                      <option value="fiber-cement">Fibrocimento</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="shading">Sombreamento</Label>
                    <select
                      id="shading"
                      value={formData.shading}
                      onChange={(e) => handleInputChange('shading', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="none">Sem sombreamento</option>
                      <option value="partial">Sombreamento parcial</option>
                      <option value="significant">Sombreamento significativo</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Energy Consumption */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="monthlyBill">Valor da Conta de Luz Mensal (R$)</Label>
                    <Input
                      id="monthlyBill"
                      type="number"
                      step="0.01"
                      value={formData.monthlyBill}
                      onChange={(e) => handleInputChange('monthlyBill', e.target.value)}
                      placeholder="Ex: 250.00"
                    />
                  </div>

                  <div className="text-center text-gray-500">ou</div>

                  <div>
                    <Label htmlFor="monthlyConsumption">Consumo Mensal (kWh)</Label>
                    <Input
                      id="monthlyConsumption"
                      type="number"
                      value={formData.monthlyConsumption}
                      onChange={(e) => handleInputChange('monthlyConsumption', e.target.value)}
                      placeholder="Ex: 350"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tariff">Tarifa de Energia (R$/kWh)</Label>
                    <Input
                      id="tariff"
                      type="number"
                      step="0.01"
                      value={formData.tariff}
                      onChange={(e) => handleInputChange('tariff', parseFloat(e.target.value))}
                      placeholder="Ex: 0.75"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Valor médio no Brasil: R$ 0,75/kWh
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      <TrendingUp className="h-4 w-4 inline mr-2" />
                      Essas informações nos ajudam a calcular o sistema ideal para sua economia.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: System Preferences */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <Label>Tipo de Sistema</Label>
                    <div className="space-y-3 mt-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('systemType', 'grid-tied')}
                        className={`w-full p-4 border rounded-lg text-left ${
                          formData.systemType === 'grid-tied' 
                            ? 'border-yellow-500 bg-yellow-50' 
                            : 'border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <Zap className="h-5 w-5 mr-3" />
                          <div>
                            <div className="font-medium">On-Grid (Conectado à Rede)</div>
                            <div className="text-sm text-gray-600">
                              Sistema conectado à rede elétrica, com compensação de energia
                            </div>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('systemType', 'off-grid')}
                        className={`w-full p-4 border rounded-lg text-left ${
                          formData.systemType === 'off-grid' 
                            ? 'border-yellow-500 bg-yellow-50' 
                            : 'border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <Battery className="h-5 w-5 mr-3" />
                          <div>
                            <div className="font-medium">Off-Grid (Isolado)</div>
                            <div className="text-sm text-gray-600">
                              Sistema independente com baterias para armazenamento
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="budget">Orçamento Disponível (R$) - Opcional</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="Ex: 25000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="installationUrgency">Urgência da Instalação</Label>
                    <select
                      id="installationUrgency"
                      value={formData.installationUrgency}
                      onChange={(e) => handleInputChange('installationUrgency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="flexible">Flexível (até 6 meses)</option>
                      <option value="moderate">Moderada (até 3 meses)</option>
                      <option value="urgent">Urgente (até 1 mês)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  Anterior
                </Button>
                <Button onClick={nextStep}>
                  {step === 4 ? 'Calcular Sistema' : 'Próximo'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results */}
      {step === 5 && results && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Seu Sistema Solar Personalizado
            </h2>
            <p className="text-gray-600">
              Baseado nas informações fornecidas, este é o sistema ideal para você
            </p>
          </div>

          {/* System Overview */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {formatNumber(results.systemPower)} kWp
                  </div>
                  <div className="text-gray-600">Potência do Sistema</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(results.systemCost)}
                  </div>
                  <div className="text-gray-600">Investimento Total</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatNumber(results.paybackPeriod)} anos
                  </div>
                  <div className="text-gray-600">Tempo de Retorno</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Detalhes do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Número de Painéis:</span>
                  <span className="font-medium">{results.numberOfPanels} unidades</span>
                </div>
                <div className="flex justify-between">
                  <span>Área Necessária:</span>
                  <span className="font-medium">{formatNumber(results.roofAreaNeeded)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span>Irradiação Solar:</span>
                  <span className="font-medium">{formatNumber(results.irradiation)} kWh/m²/dia</span>
                </div>
                <div className="flex justify-between">
                  <span>Geração Mensal:</span>
                  <span className="font-medium">{formatNumber(results.monthlyGeneration)} kWh</span>
                </div>
              </CardContent>
            </Card>

            {/* Financial Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Análise Financeira
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Economia Mensal:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(results.monthlySavings)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Economia Anual:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(results.monthlySavings * 12)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Economia em 25 anos:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(results.savings25Years)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ROI (25 anos):</span>
                  <span className="font-medium text-green-600">
                    {formatNumber((results.savings25Years / results.systemCost) * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environmental Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-5 w-5 bg-green-500 rounded-full"></div>
                Impacto Ambiental
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(results.co2Reduction)} kg
                  </div>
                  <div className="text-gray-600">CO₂ evitado por ano</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(results.co2Reduction * 25 / 1000)} ton
                  </div>
                  <div className="text-gray-600">CO₂ evitado em 25 anos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(results.co2Reduction * 25 / 21)}
                  </div>
                  <div className="text-gray-600">Árvores equivalentes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
              <ArrowRight className="h-5 w-5 mr-2" />
              Ver Produtos Recomendados
            </Button>
            <Button variant="outline" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Baixar Relatório PDF
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-5 w-5 mr-2" />
              Compartilhar Resultado
            </Button>
          </div>

          {/* Start Over */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                setStep(1);
                setResults(null);
                setFormData({
                  cep: '', city: '', state: '',
                  propertyType: 'residential', roofArea: '', roofType: 'ceramic', shading: 'none',
                  monthlyBill: '', monthlyConsumption: '', tariff: 0.75,
                  systemType: 'grid-tied', budget: '', installationUrgency: 'flexible'
                });
              }}
            >
              Nova Simulação
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
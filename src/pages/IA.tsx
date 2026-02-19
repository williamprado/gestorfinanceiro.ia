import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Upload, Key, Brain, FileText, Settings, Check, AlertCircle, X, FileUp, Edit, Trash2 } from "lucide-react";
import { EditarResultadoIAModal } from "@/components/EditarResultadoIAModal";
import { useToast } from "@/hooks/use-toast";
import { useIAConfiguracoes } from "@/hooks/useIAConfiguracoes";
import { useIAAnalysis, type AnalysisResult } from "@/hooks/useIAAnalysis";
import { useCategorias } from "@/hooks/useCategorias";
import { supabase } from "@/integrations/supabase/client";
import { AIConfigPanel } from "@/components/ia/AIConfigPanel";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'pdf';
  size: string;
}


const IA = () => {
  const { toast } = useToast();
  const { configuracao, isLoading: configLoading, salvarConfiguracao, isConfigured } = useIAConfiguracoes();
  const { results: analysisResults, atualizarStatus, atualizarCategoria, editarResultado, excluirResultado, salvarResultado } = useIAAnalysis();
  const { categoriasDespesa, categoriasReceita } = useCategorias();
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // Atualizar campos quando configuração carrega
  useEffect(() => {
    if (configuracao) {
      setApiKey(configuracao.api_key);
      setSelectedModel(configuracao.modelo);
    }
  }, [configuracao]);

  const openaiModels = [
    { value: 'gpt-4o', label: 'GPT-4o (Recomendado para visão)' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Mais rápido)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' }
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSaveConfig = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma chave API válida.",
        variant: "destructive",
      });
      return;
    }

    await salvarConfiguracao(apiKey, selectedModel);
  };

  const processFiles = (files: FileList) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 10MB.`,
          variant: "destructive",
        });
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: `${file.name} não é um tipo de arquivo suportado.`,
          variant: "destructive",
        });
        return;
      }

      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';

      const uploadedFile: UploadedFile = {
        id: fileId,
        file,
        type: fileType,
        size: formatFileSize(file.size)
      };

      // Create preview for images
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => prev.map(f =>
            f.id === fileId ? { ...f, preview: e.target?.result as string } : f
          ));
        };
        reader.readAsDataURL(file);
      }

      setUploadedFiles(prev => [...prev, uploadedFile]);
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    processFiles(files);
    event.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get just the base64 data
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeWithOpenAI = async (file: File): Promise<void> => {
    try {
      const base64Image = await convertFileToBase64(file);

      const prompt = `Analise este comprovante financeiro e extraia as seguintes informações em formato JSON:

{
  "tipo": "receita" ou "despesa",
  "descricao": "descrição clara da transação",
  "valor": número (apenas o valor numérico, sem símbolos),
  "categoria": "categoria apropriada (ex: Alimentação, Transporte, Saúde, Salário, etc.)",
  "data": "data no formato YYYY-MM-DD",
  "confianca": número de 0 a 100 indicando a confiança na análise
}

Regras importantes:
- Se for uma nota fiscal de compra/pagamento = "despesa"
- Se for um comprovante de pagamento recebido/depósito = "receita"
- Para o valor, extraia apenas números (ex: se vê "R$ 150,50", retorne 150.5)
- Para categoria, use termos como: Alimentação, Transporte, Saúde, Educação, Lazer, Moradia, Salário, Freelance, Vendas
- Para data, tente extrair a data da transação, não a data de emissão
- Seja preciso na classificação entre receita e despesa

Responda APENAS com o JSON, sem explicações adicionais.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${file.type};base64,${base64Image}`,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Remove markdown code blocks if present and parse JSON response
      const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
      const analysisData = JSON.parse(cleanContent);

      const resultado: Omit<AnalysisResult, 'id'> = {
        file_name: file.name,
        tipo: analysisData.tipo,
        descricao: analysisData.descricao,
        valor: parseFloat(analysisData.valor),
        categoria: analysisData.categoria,
        data: analysisData.data,
        confianca: analysisData.confianca,
        status: 'pending'
      };

      await salvarResultado(resultado);
    } catch (error) {
      console.error('Erro na análise OpenAI:', error);
      throw error;
    }
  };

  const analyzeFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "Nenhum arquivo",
        description: "Adicione arquivos antes de analisar.",
        variant: "destructive",
      });
      return;
    }

    if (!isConfigured) {
      toast({
        title: "Configuração necessária",
        description: "Configure sua chave API OpenAI primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const results = [];

      for (const uploadedFile of uploadedFiles) {
        if (uploadedFile.type === 'image') {
          try {
            await analyzeWithOpenAI(uploadedFile.file);
            results.push({} as any); // Placeholder para contagem
          } catch (error) {
            console.error('Erro na análise de arquivo:', error);
          }
        } else {
          // Para PDFs, mostrar mensagem que não é suportado ainda
          toast({
            title: "PDF não suportado",
            description: `${uploadedFile.file.name}: Análise de PDF será implementada em breve.`,
            variant: "destructive",
          });
        }
      }

      setUploadedFiles([]);

      toast({
        title: "Análise concluída",
        description: `${results.length} arquivo(s) analisado(s) com sucesso!`,
      });
    } catch (error) {
      console.error('Erro na análise:', error);
      toast({
        title: "Erro na análise",
        description: "Verifique sua chave API e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApproveResult = async (result: AnalysisResult) => {
    try {
      // Criar despesa ou receita baseado no tipo
      if (result.tipo === 'despesa') {
        const { error } = await supabase
          .from('despesas')
          .insert({
            descricao: result.descricao,
            valor: result.valor,
            data: result.data,
            categoria_id: result.categoria_id,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('receitas')
          .insert({
            descricao: result.descricao,
            valor: result.valor,
            data: result.data,
            categoria_id: result.categoria_id,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (error) throw error;
      }

      // Atualizar status para aprovado
      await atualizarStatus(result.id, 'approved');

      toast({
        title: "Sucesso",
        description: `${result.tipo === 'despesa' ? 'Despesa' : 'Receita'} criada com sucesso!`,
      });
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar transação. Verifique se uma categoria foi selecionada.",
        variant: "destructive",
      });
    }
  };

  const handleRejectResult = (id: string) => {
    atualizarStatus(id, 'rejected');
  };

  const handleCategoryChange = (resultId: string, categoryId: string) => {
    atualizarCategoria(resultId, categoryId);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-wa-green-light/20 rounded-full p-3">
            <Brain className="w-6 h-6 text-wa-green-dark" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inteligência Artificial</h1>
            <p className="text-gray-600">Analise automaticamente seus comprovantes e cupons fiscais</p>
          </div>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">Upload & Análise</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Configurações OpenAI</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key" className="flex items-center space-x-2">
                    <Key className="w-4 h-4" />
                    <span>Chave API OpenAI</span>
                  </Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="mt-2"
                    disabled={configLoading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Sua chave API será armazenada com segurança no banco de dados
                  </p>
                </div>

                <div>
                  <Label htmlFor="model-select">Modelo OpenAI</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {openaiModels.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveConfig} className="w-full bg-wa-green hover:bg-wa-green-dark" disabled={configLoading}>
                  {isConfigured ? 'Atualizar Configuração' : 'Salvar Configuração'}
                </Button>

                {isConfigured && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">API configurada e pronta para uso</span>
                  </div>
                )}
              </div>
            </Card>

            <AIConfigPanel />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <FileUp className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Upload de Comprovantes</h2>
              </div>

              {!isConfigured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-yellow-800">
                      Configure sua chave API OpenAI na aba Configurações antes de fazer upload.
                    </p>
                  </div>
                </div>
              )}

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver
                  ? 'border-wa-green bg-wa-green-light/10'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isAnalyzing}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Clique ou arraste arquivos aqui
                  </p>
                  <p className="text-sm text-gray-500">
                    Aceita imagens (PNG, JPG, GIF) e arquivos PDF até 10MB
                  </p>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Arquivos Carregados ({uploadedFiles.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border rounded-lg p-4 relative">
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {file.type === 'image' && file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.file.name}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                        )}

                        <p className="text-sm font-medium truncate" title={file.file.name}>
                          {file.file.name}
                        </p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={analyzeFiles}
                    disabled={isAnalyzing || !isConfigured}
                    className="w-full bg-wa-green hover:bg-wa-green-dark"
                  >
                    {isAnalyzing ? 'Analisando com OpenAI...' : `Analisar ${uploadedFiles.length} arquivo(s) com IA`}
                  </Button>
                </div>
              )}
            </Card>

            {analysisResults.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Resultados da Análise OpenAI</h3>
                <div className="space-y-4">
                  {analysisResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <span className="font-medium text-gray-900">{result.file_name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${result.tipo === 'receita'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {result.tipo}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Confiança: {result.confianca}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Descrição:</span>
                          <p className="font-medium">{result.descricao}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Valor:</span>
                          <p className="font-medium">R$ {result.valor.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Categoria:</span>
                          {result.status === 'pending' ? (
                            <Select
                              value={result.categoria_id || ''}
                              onValueChange={(value) => handleCategoryChange(result.id, value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                {(result.tipo === 'despesa' ? categoriasDespesa : categoriasReceita).map((categoria) => (
                                  <SelectItem key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="font-medium">{result.categoria}</p>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500">Data:</span>
                          <p className="font-medium">{new Date(result.data).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {result.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveResult(result)}
                              className="bg-wa-green hover:bg-wa-green-dark"
                            >
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectResult(result.id)}
                            >
                              Rejeitar
                            </Button>
                          </div>
                        )}

                        {result.status === 'approved' && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-medium">Aprovado e adicionado</span>
                          </div>
                        )}

                        {result.status === 'rejected' && (
                          <div className="flex items-center space-x-2 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Rejeitado</span>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <EditarResultadoIAModal
                            resultado={result}
                            onSave={editarResultado}
                          />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir resultado?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. O resultado da análise será excluído permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => excluirResultado(result.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Histórico de Análises</h2>
              {analysisResults.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma análise realizada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">{result.file_name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${result.status === 'approved' ? 'bg-green-100 text-green-800' :
                          result.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                          {result.status === 'approved' ? 'Aprovado' :
                            result.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        R$ {result.valor.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default IA;

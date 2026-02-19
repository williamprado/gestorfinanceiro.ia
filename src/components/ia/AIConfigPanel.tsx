
import { useState, useEffect } from "react";
import { AIAgentConfig, DEFAULT_AI_CONFIG, getAIConfig, saveAIConfig } from "@/lib/aiConfigStorage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bot, Save, RotateCcw } from "lucide-react";

export const AIConfigPanel = () => {
    const { toast } = useToast();
    const [config, setConfig] = useState<AIAgentConfig>(DEFAULT_AI_CONFIG);

    useEffect(() => {
        setConfig(getAIConfig());
    }, []);

    const handleChange = (field: keyof AIAgentConfig, value: any) => {
        setConfig(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        saveAIConfig(config);
        toast({
            title: "Configuração Salva",
            description: "As alterações no assistente foram aplicadas com sucesso.",
        });
    };

    const handleReset = () => {
        setConfig(DEFAULT_AI_CONFIG);
        saveAIConfig(DEFAULT_AI_CONFIG);
        toast({
            title: "Configuração Restaurada",
            description: "As configurações foram redefinidas para o padrão.",
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-emerald-600" />
                    <CardTitle>Configuração do Agente</CardTitle>
                </div>
                <CardDescription>Personalize o comportamento e a aparência do seu assistente financeiro.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Ativar/Desativar */}
                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg bg-gray-50">
                    <div className="space-y-0.5">
                        <Label className="text-base font-semibold">Ativar Assistente</Label>
                        <p className="text-sm text-gray-500">Exibir o botão flutuante na interface.</p>
                    </div>
                    <Switch
                        checked={config.enabled}
                        onCheckedChange={(val) => handleChange('enabled', val)}
                    />
                </div>

                {/* Nome do Agente */}
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="agentName">Nome do Agente</Label>
                    <Input
                        id="agentName"
                        value={config.agentName}
                        onChange={(e) => handleChange('agentName', e.target.value)}
                        placeholder="Ex: Financeiro IA"
                    />
                </div>

                {/* Modelo */}
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="model">Modelo de IA</Label>
                    <Select
                        value={config.model}
                        onValueChange={(val) => handleChange('model', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gpt-4o">GPT-4o (Recomendado)</SelectItem>
                            <SelectItem value="gpt-4o-mini">GPT-4o Mini (Rápido)</SelectItem>
                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Prompt do Sistema */}
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="systemPrompt">Instruções do Sistema (System Prompt)</Label>
                    <Textarea
                        id="systemPrompt"
                        value={config.systemPrompt}
                        onChange={(e) => handleChange('systemPrompt', e.target.value)}
                        placeholder="Defina como o agente deve se comportar..."
                        className="min-h-[100px]"
                    />
                    <p className="text-xs text-gray-500">Defina a personalidade e as regras de resposta do agente.</p>
                </div>

                {/* Temperatura */}
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label>Criatividade (Temperatura): {config.temperature}</Label>
                    </div>
                    <Slider
                        defaultValue={[config.temperature]}
                        max={1}
                        step={0.1}
                        onValueChange={(vals) => handleChange('temperature', vals[0])}
                    />
                    <p className="text-xs text-gray-500">0 = Preciso e focado, 1 = Criativo e variado.</p>
                </div>

                {/* Restrição de Dados */}
                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                    <div className="space-y-0.5">
                        <Label className="font-medium">Restringir aos Dados do Usuário</Label>
                        <p className="text-sm text-gray-500">Se ativado, o agente priorizará respostas baseadas apenas nos seus dados financeiros.</p>
                    </div>
                    <Switch
                        checked={config.restrictToUserData}
                        onCheckedChange={(val) => handleChange('restrictToUserData', val)}
                    />
                </div>

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Resetar Padrões
                </Button>
                <Button onClick={handleSave} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                </Button>
            </CardFooter>
        </Card>
    );
};

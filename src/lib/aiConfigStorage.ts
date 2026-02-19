
export interface AIAgentConfig {
    enabled: boolean;
    agentName: string;
    systemPrompt: string;
    temperature: number;
    model: string; // 'gpt-4o', 'gpt-4o-mini', etc.
    restrictToUserData: boolean;
    position: {
        x: number;
        y: number;
    };
}

export const DEFAULT_AI_CONFIG: AIAgentConfig = {
    enabled: true,
    agentName: "Financeiro IA",
    systemPrompt: "Você é um assistente financeiro especialista. Responda com clareza e objetividade.",
    temperature: 0.7,
    model: "gpt-4o-mini",
    restrictToUserData: true,
    position: { x: window.innerWidth - 80, y: window.innerHeight - 80 }, // Canto inferior direito padrão
};

export const AI_CONFIG_KEY = "ai_agent_config";

export const getAIConfig = (): AIAgentConfig => {
    try {
        const stored = localStorage.getItem(AI_CONFIG_KEY);
        if (!stored) return DEFAULT_AI_CONFIG;

        const parsed = JSON.parse(stored);
        return { ...DEFAULT_AI_CONFIG, ...parsed }; // Merge com defaults para segurança
    } catch (error) {
        console.error("Erro ao carregar configuração da IA:", error);
        return DEFAULT_AI_CONFIG;
    }
};

export const saveAIConfig = (config: AIAgentConfig): void => {
    try {
        localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
        // Disparar evento para atualizar componentes que ouvem mudanças
        window.dispatchEvent(new Event("ai-config-changed"));
    } catch (error) {
        console.error("Erro ao salvar configuração da IA:", error);
    }
};

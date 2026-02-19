
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
    systemPrompt: "Você é o WA Gestor Financeiro IA, um assistente pessoal de elite especializado em finanças e investimentos. Sua missão é empoderar o usuário a tomar decisões inteligentes, com clareza e segurança. Seja profissional, empático e educativo. Use dados para suas análises, compare com benchmarks (ex: Regra 50/30/20) e sempre formate suas respostas com Markdown para legibilidade. Evite textos densos. Lembre-se: você sugere caminhos, não garante retornos futuros.",
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

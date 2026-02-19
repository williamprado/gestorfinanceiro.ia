
import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageSquare, Sparkles, ChevronDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useAIAssistant } from "./useAIAssistant";
import { AIAgentConfig } from "@/lib/aiConfigStorage";
import { useIAConfiguracoes } from "@/hooks/useIAConfiguracoes";
import { useToast } from "@/hooks/use-toast";

interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
}

export const AIAssistant = () => {
    const { toast } = useToast();
    const { config, isOpen, setIsOpen, position, handlers, isDragging } = useAIAssistant();
    const { configuracao: creds } = useIAConfiguracoes();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: `Olá! Sou ${config.agentName}. Como posso ajudar você hoje?`,
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on updates
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isTyping]);

    // Update initial message if agent name changes
    useEffect(() => {
        if (messages.length === 1 && messages[0].role === "assistant") {
            setMessages([{
                ...messages[0],
                content: `Olá! Sou ${config.agentName}. Como posso ajudar você hoje?`
            }]);
        }
    }, [config.agentName]);

    const generateAIResponse = async (userMessage: string): Promise<string> => {
        if (!creds?.api_key) {
            return "Por favor, configure sua chave de API nas configurações da IA Financeira.";
        }

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${creds.api_key}`,
                },
                body: JSON.stringify({
                    model: config.model || creds.modelo || "gpt-4o-mini",
                    temperature: config.temperature,
                    messages: [
                        { role: "system", content: config.systemPrompt },
                        ...messages.filter(m => m.role !== 'system').map(m => ({
                            role: m.role,
                            content: m.content
                        })),
                        { role: "user", content: userMessage }
                    ],
                    max_tokens: 500
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error("Erro OpenAI:", errData);
                throw new Error(`Erro na API (${response.status}): ${errData?.error?.message || 'Falha desconhecida'}`);
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content ?? "Não entendi, pode repetir?";

        } catch (error) {
            console.error("Erro ao gerar resposta:", error);
            toast({
                title: "Erro na IA",
                description: "Não foi possível conectar com o assistente.",
                variant: "destructive"
            });
            return "Desculpe, estou com problemas de conexão no momento.";
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userText = inputValue;
        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: userText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputValue("");
        setIsTyping(true);

        // Chamada real à API
        try {
            // Pequeno delay para UX (sensação de "pensando" se for muito rápido)
            // await new Promise(resolve => setTimeout(resolve, 600)); 

            const responseContent = await generateAIResponse(userText);

            const newAiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: responseContent,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, newAiMessage]);
        } catch (err) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Ocorreu um erro ao processar sua mensagem.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const suggestions = [
        "Como organizar meu orçamento?",
        "Qual a regra 50/30/20?",
        "Dicas para economizar",
        "Como começar a investir?",
    ];

    if (!config.enabled) return null;

    return (
        <>
            {/* Botão Flutuante Draggable */}
            <div
                style={{
                    position: 'fixed',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    touchAction: 'none'
                }}
                className={`z-50 transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handlers.onMouseDown}
                onTouchStart={handlers.onTouchStart}
                onClick={handlers.onClick}
            >
                <Button
                    className="h-14 md:h-16 rounded-full shadow-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                >
                    <div className="relative">
                        <Bot className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            {!creds?.api_key ? (
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            ) : (
                                <>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </>
                            )}
                        </span>
                    </div>
                    <span className="font-semibold text-base md:text-lg hidden md:inline">{config.agentName}</span>
                </Button>
            </div>

            {/* Janela do Chat */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[90%] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <Card className="flex-1 flex flex-col shadow-2xl border-0 overflow-hidden rounded-2xl">
                        {/* Header */}
                        <div
                            className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 flex items-center justify-between text-white shrink-0 cursor-move"
                        // Se quiser dragging da janela também, teria que implementar lógica. Por enquanto fixo bottom-right.
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{config.agentName}</h3>
                                    <p className="text-xs text-emerald-100 flex items-center gap-1">
                                        {!creds?.api_key ? (
                                            <>
                                                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                API Não Configurada
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                                                Online • {config.model}
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20 rounded-full"
                            >
                                <ChevronDown className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4 bg-gray-50/50" ref={scrollRef}>
                            <div className="space-y-4 pb-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-sm md:text-base shadow-sm ${msg.role === "user"
                                                ? "bg-emerald-600 text-white rounded-br-none"
                                                : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                                }`}
                                        >
                                            {/* Renderização simples de markdown aqui seria ideal, mas texto puro por segurança por enquanto */}
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                            {messages.length < 3 && (
                                <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-none">
                                    {suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setInputValue(suggestion)}
                                            className="whitespace-nowrap px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs md:text-sm rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative flex items-center gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    placeholder={!creds?.api_key ? "Configure a API Key primeiro..." : "Digite sua dúvida..."}
                                    disabled={!creds?.api_key || isTyping}
                                    className="rounded-full pr-12 h-12 bg-gray-50 border-gray-200 focus-visible:ring-emerald-500"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    size="icon"
                                    className="absolute right-1 w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50"
                                    disabled={!inputValue.trim() || isTyping || !creds?.api_key}
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                            {!creds?.api_key && (
                                <p className="text-xs text-red-500 mt-2 text-center">
                                    <AlertCircle className="w-3 h-3 inline mr-1" />
                                    Chave de API não configurada. Vá em IA Financeira {'>'} Configurações.
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

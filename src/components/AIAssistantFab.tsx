import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageSquare, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export const AIAssistantFab = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Olá! Sou seu assistente financeiro inteligente. Como posso ajudar você a economizar hoje?",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simular resposta da IA
        setTimeout(() => {
            const responseContent = generateResponse(newUserMessage.content);
            const newAiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: responseContent,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, newAiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (input: string): string => {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes("gastando mais") || lowerInput.includes("gastos")) {
            return "Analisando suas transações recentes, notei que sua maior categoria de despesa este mês é 'Alimentação', representando 35% do total. Que tal definirmos uma meta de economia para restaurantes?";
        }
        if (lowerInput.includes("investir")) {
            return "Com base no seu saldo atual de R$ 3.450,00 e suas despesas previstas, você poderia investir com segurança cerca de R$ 500,00 este mês sem comprometer seu fluxo de caixa.";
        }
        if (lowerInput.includes("economizar")) {
            return "Você pode economizar revisando suas assinaturas mensais. Detectei dois serviços de streaming que somam R$ 89,90 e não foram muito utilizados nas últimas semanas.";
        }
        return "Entendi. Estou analisando seus dados financeiros para fornecer a melhor orientação. Pode me dar mais detalhes sobre o que precisa?";
    };

    const suggestions = [
        "Onde estou gastando mais?",
        "Posso investir esse mês?",
        "Quanto posso economizar?",
        "Analise minhas dívidas",
    ];

    return (
        <>
            {/* Botão Flutuante */}
            <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 md:h-16 rounded-full shadow-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 flex items-center gap-3 transition-transform hover:scale-105"
                >
                    <div className="relative">
                        <Bot className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    </div>
                    <span className="font-semibold text-base md:text-lg hidden md:inline">Perguntar para IA</span>
                </Button>
            </div>

            {/* Janela do Chat */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[90%] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <Card className="flex-1 flex flex-col shadow-2xl border-0 overflow-hidden rounded-2xl">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 flex items-center justify-between text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Financeiro IA</h3>
                                    <p className="text-xs text-emerald-100 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                                        Online
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

                        {/* Suggestions & Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                            {messages.length < 3 && (
                                <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-none">
                                    {suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setInputValue(suggestion);
                                                // Optional: auto send
                                            }}
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
                                    placeholder="Digite sua dúvida financeira..."
                                    className="rounded-full pr-12 h-12 bg-gray-50 border-gray-200 focus-visible:ring-emerald-500"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    size="icon"
                                    className="absolute right-1 w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                    disabled={!inputValue.trim() || isTyping}
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

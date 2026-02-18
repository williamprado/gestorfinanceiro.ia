import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Lightbulb, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Transacao } from "@/hooks/useTransacoes";

interface SmartInsightCardProps {
    transacoes: Transacao[];
    loading?: boolean;
}

export const SmartInsightCard = ({ transacoes, loading }: SmartInsightCardProps) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const insight = useMemo(() => {
        if (loading || !transacoes.length) return null;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filter transactions for current month
        const currentMonthTransactions = transacoes.filter(t => {
            const d = new Date(t.data);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.tipo === 'despesa';
        });

        // Filter transactions for last month
        const lastMonthTransactions = transacoes.filter(t => {
            const d = new Date(t.data);
            // Handle January case
            const targetMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const targetYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return d.getMonth() === targetMonth && d.getFullYear() === targetYear && t.tipo === 'despesa';
        });

        const currentTotal = currentMonthTransactions.reduce((acc, t) => acc + Number(t.valor), 0);
        const lastTotal = lastMonthTransactions.reduce((acc, t) => acc + Number(t.valor), 0);

        // Initial State or not enough data
        if (lastTotal === 0 && currentTotal === 0) {
            return {
                type: "neutral",
                title: "Começando sua jornada",
                message: "Continue registrando suas transações para receber insights inteligentes sobre seus gastos.",
                suggestion: "Registre sua primeira despesa hoje!",
                icon: Lightbulb
            };
        }

        // Comparison Logic
        if (currentTotal < lastTotal) {
            const economy = lastTotal - currentTotal;
            const percent = lastTotal > 0 ? ((economy / lastTotal) * 100).toFixed(0) : "0";
            return {
                type: "positive",
                title: "Economia Inteligente",
                message: `Você reduziu suas despesas em ${percent}% comparado ao mês anterior.`,
                suggestion: "Que tal investir essa diferença em sua meta financeira?",
                icon: TrendingDown // Expenses trending down is good
            };
        } else if (currentTotal > lastTotal) {
            const increase = currentTotal - lastTotal;
            const percent = lastTotal > 0 ? ((increase / lastTotal) * 100).toFixed(0) : "100";

            return {
                type: "warning", // Changed semantics to be less aggressive
                title: "Atenção aos Gastos",
                message: `Identificamos um aumento de ${percent}% nas despesas este mês.`,
                suggestion: "Revise os gastos variáveis recentes para manter o equilíbrio.",
                icon: AlertTriangle // Can use help icon or other
            };
        }

        return {
            type: "neutral",
            title: "Gastos Estáveis",
            message: "Seus gastos estão no mesmo patamar do mês anterior.",
            suggestion: "Manter a estabilidade é o primeiro passo para o crescimento.",
            icon: CheckCircle2
        };

    }, [transacoes, loading]);

    if (!insight) return null;

    const getStyles = () => {
        switch (insight.type) {
            case "positive":
                return "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100 text-emerald-900";
            case "warning":
                // Using amber/orange instead of red for "Psychological UX"
                return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100 text-amber-900";
            default:
                return "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-100 text-slate-800";
        }
    };

    const getIconContainerStyles = () => {
        switch (insight.type) {
            case "positive": return "bg-emerald-100 text-emerald-600 ring-emerald-200";
            case "warning": return "bg-amber-100 text-amber-600 ring-amber-200";
            default: return "bg-slate-100 text-slate-600 ring-slate-200";
        }
    };

    return (
        <Card className={`p-6 mb-8 border transition-all duration-700 hover:shadow-lg ${getStyles()} ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className={`p-3 rounded-xl shadow-sm ring-1 ring-inset ${getIconContainerStyles()} shrink-0`}>
                    <insight.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg">
                            {insight.title}
                        </h3>
                        {insight.type === 'positive' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 animate-pulse">
                                Ótimo Desempenho
                            </span>
                        )}
                    </div>
                    <p className="text-base font-medium opacity-90">
                        {insight.message}
                    </p>
                    <p className="text-sm opacity-75 italic mt-1 bg-white/50 p-2 rounded-lg inline-block border border-black/5">
                        💡 Dica: {insight.suggestion}
                    </p>
                </div>
            </div>
        </Card>
    );
};

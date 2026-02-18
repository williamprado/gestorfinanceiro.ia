import { useMemo } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Transacao } from "@/hooks/useTransacoes";

interface CashFlowChartProps {
    transacoes: Transacao[];
    loading?: boolean;
}

export const CashFlowChart = ({ transacoes, loading }: CashFlowChartProps) => {
    const data = useMemo(() => {
        if (!transacoes.length) return [];

        const today = new Date();
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            return {
                date: d,
                monthName: d.toLocaleString("pt-BR", { month: "short" }),
                receita: 0,
                despesa: 0,
                sortKey: d.getTime(), // For sorting back to chronological order
            };
        }).reverse();

        transacoes.forEach((t) => {
            const tDate = new Date(t.data);
            const monthData = last6Months.find(
                (m) =>
                    m.date.getMonth() === tDate.getMonth() &&
                    m.date.getFullYear() === tDate.getFullYear()
            );

            if (monthData) {
                if (t.tipo === "receita") {
                    monthData.receita += Number(t.valor);
                } else {
                    monthData.despesa += Number(t.valor);
                }
            }
        });

        return last6Months;
    }, [transacoes]);

    if (loading) {
        return (
            <Card className="p-6 h-[350px] flex items-center justify-center bg-gray-50/50">
                <div className="text-gray-400 text-sm">Carregando gráfico...</div>
            </Card>
        );
    }

    return (
        <Card className="p-6 h-[400px] shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Fluxo de Caixa</h3>
                <p className="text-sm text-gray-500">
                    Entradas e saídas dos últimos 6 meses
                </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barSize={20}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="monthName"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        tickFormatter={(value) =>
                            `R$ ${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`
                        }
                    />
                    <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value: number) =>
                            value.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })
                        }
                    />
                    <Legend
                        iconType="circle"
                        wrapperStyle={{ paddingTop: "20px" }}
                        formatter={(value) => <span className="text-sm text-gray-600 ml-1">{value}</span>}
                    />
                    <Bar
                        dataKey="receita"
                        name="Receitas"
                        fill="#10B981" // Green-500
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                    />
                    <Bar
                        dataKey="despesa"
                        name="Despesas"
                        fill="#EF4444" // Red-500 - Note: User requested less aggressive red
                    // Let's use a softer red or adjust opacity in CSS, or maybe Orange-500/Rose-500?
                    // Actually user said "Nunca vermelho agressivo" for warning messages/backgrounds.
                    // For charts, semantic red is usually okay, but let's try Rose-500 which is slightly distinct, or standard Red but maybe slightly desaturated?
                    // Standard Red-500 is ok for strict "Despesa" meaning, but let's use Rose-500 (#F43F5E) for a modern look.
                    // Or maybe muted red.
                    // Let's stick to standard Tailwind colors but maybe Rose.
                    // Actually, for "Psychological" maybe use Orange-500/Amber-600 which is "Spend" but not "Loss".
                    // But "Despesa" is usually red. I'll use Rose-500.
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

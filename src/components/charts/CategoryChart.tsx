import { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Transacao } from "@/hooks/useTransacoes";

interface CategoryChartProps {
    transacoes: Transacao[];
    loading?: boolean;
}

const COLORS = [
    "#10B981", // Emerald-500
    "#3B82F6", // Blue-500
    "#F59E0B", // Amber-500
    "#EC4899", // Pink-500
    "#8B5CF6", // Violet-500
    "#6366F1", // Indigo-500
    "#9CA3AF", // Gray-400 (Others)
];

export const CategoryChart = ({ transacoes, loading }: CategoryChartProps) => {
    const data = useMemo(() => {
        if (!transacoes.length) return [];

        const expenses = transacoes.filter((t) => t.tipo === "despesa");
        const categoryMap = new Map<string, number>();

        expenses.forEach((t) => {
            const categoryName = t.categorias?.nome || "Sem Categoria";
            categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + Number(t.valor));
        });

        const sortedData = Array.from(categoryMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // Group others if more than 5 categories
        if (sortedData.length > 5) {
            const top5 = sortedData.slice(0, 5);
            const others = sortedData.slice(5).reduce((acc, curr) => acc + curr.value, 0);
            return [...top5, { name: "Outros", value: others }];
        }

        return sortedData;
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
                <h3 className="text-lg font-bold text-gray-900">Categorias</h3>
                <p className="text-sm text-gray-500">Distribuição de despesas</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                strokeWidth={0}
                            />
                        ))}
                        <Label
                            value={`${data.length}`}
                            position="center"
                            content={({ viewBox }) => {
                                const { cx, cy } = viewBox as { cx: number; cy: number };
                                return (
                                    <text
                                        x={cx}
                                        y={cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={cx}
                                            dy="-0.5em"
                                            fontSize="24"
                                            fontWeight="bold"
                                            fill="#111827"
                                        >
                                            {data.reduce((acc, curr) => acc + curr.value, 0).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                                notation: "compact",
                                                maximumFractionDigits: 1
                                            })}
                                        </tspan>
                                        <tspan x={cx} dy="1.5em" fontSize="12" fill="#6B7280">
                                            Total
                                        </tspan>
                                    </text>
                                );
                            }}
                        />
                    </Pie>
                    <Tooltip
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
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        iconType="circle"
                        formatter={(value) => <span className="text-sm text-gray-600 ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};

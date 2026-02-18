import { useMemo, useState } from "react";
import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DollarSign,
    TrendingDown,
    TrendingUp,
    Calendar,
    Tag,
    FileText,
    Home,
    Utensils,
    Car,
    ShoppingCart,
    Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types matching the one in useTransacoes but localized for component needs
interface Transaction {
    id: string;
    tipo: 'receita' | 'despesa';
    descricao: string;
    valor: number;
    data: string;
    categorias?: {
        nome: string;
        cor: string;
        icone: string;
    };
}

interface EnhancedTransactionListProps {
    transactions: Transaction[];
    onViewAll?: () => void;
}

export const EnhancedTransactionList = ({ transactions, onViewAll }: EnhancedTransactionListProps) => {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const groupedTransactions = useMemo(() => {
        const groups: { [key: string]: Transaction[] } = {
            "Hoje": [],
            "Ontem": [],
            "Esta Semana": [],
            "Anterior": []
        };

        transactions.slice(0, 10).forEach(t => { // Show max 10 in dashboard widget
            const date = parseISO(t.data);
            if (isToday(date)) {
                groups["Hoje"].push(t);
            } else if (isYesterday(date)) {
                groups["Ontem"].push(t);
            } else if (isThisWeek(date)) {
                groups["Esta Semana"].push(t);
            } else {
                groups["Anterior"].push(t);
            }
        });

        // Remove empty groups
        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    }, [transactions]);

    const getIcon = (transaction: Transaction) => {
        const categoryName = transaction.categorias?.nome || "";
        const type = transaction.tipo;

        // Normalize category name for matching
        const normalizedName = categoryName.toLowerCase();

        if (normalizedName.includes("salário") || normalizedName.includes("freelance") || normalizedName.includes("renda")) return DollarSign;
        if (normalizedName.includes("investimento")) return TrendingUp;
        if (normalizedName.includes("moradia") || normalizedName.includes("casa") || normalizedName.includes("aluguel")) return Home;
        if (normalizedName.includes("alimentação") || normalizedName.includes("comida") || normalizedName.includes("restaurante")) return Utensils;
        if (normalizedName.includes("transporte") || normalizedName.includes("carro") || normalizedName.includes("uber")) return Car;
        if (normalizedName.includes("mercado") || normalizedName.includes("compras")) return ShoppingCart;
        if (normalizedName.includes("trabalho")) return Briefcase;

        return type === 'receita' ? DollarSign : TrendingDown;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <>
            <Card className="p-0 border-none shadow-none md:border md:shadow-sm md:p-6 mb-8">
                <div className="flex items-center justify-between mb-6 px-4 md:px-0 pt-4 md:pt-0">
                    <h2 className="text-xl font-bold text-gray-900">Últimas Transações</h2>
                    <Button
                        variant="ghost"
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                        onClick={onViewAll}
                    >
                        Ver todas
                    </Button>
                </div>

                <ScrollArea className="h-[400px] w-full pr-4">
                    <div className="space-y-6 px-4 md:px-0 pb-4">
                        {groupedTransactions.length > 0 ? (
                            groupedTransactions.map(([label, groupItems]) => (
                                <div key={label}>
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1">
                                        {label}
                                    </h3>
                                    <div className="space-y-2">
                                        {groupItems.map((t) => {
                                            const Icon = getIcon(t);
                                            return (
                                                <div
                                                    key={t.id}
                                                    onClick={() => setSelectedTransaction(t)}
                                                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer gap-2 sm:gap-4"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`p-2.5 rounded-full ${t.tipo === 'receita' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} transition-colors group-hover:bg-opacity-80`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm md:text-base">{t.descricao}</p>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                {t.categorias?.nome && (
                                                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                                                                        {t.categorias.nome}
                                                                    </span>
                                                                )}
                                                                <span>{format(parseISO(t.data), "dd/MM/yyyy")}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <span className={`block font-bold text-sm md:text-base ${t.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {t.tipo === 'receita' ? '+' : '-'}{formatCurrency(t.valor)}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                Nenhuma transação encontrada.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </Card>

            <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Transação</DialogTitle>
                        <DialogDescription>
                            Visualizar informações completas (apenas leitura).
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTransaction && (
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-center py-4">
                                <div className={`flex flex-col items-center justify-center p-6 rounded-full w-24 h-24 ${selectedTransaction.tipo === 'receita' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {selectedTransaction.tipo === 'receita' ? <TrendingUp className="w-8 h-8 text-green-600" /> : <TrendingDown className="w-8 h-8 text-red-600" />}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium text-gray-500 text-sm flex items-center justify-end gap-2">
                                        <Tag className="w-4 h-4" /> Tipo
                                    </span>
                                    <span className={`col-span-3 font-semibold ${selectedTransaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedTransaction.tipo === 'receita' ? 'Receita' : 'Despesa'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium text-gray-500 text-sm flex items-center justify-end gap-2">
                                        <FileText className="w-4 h-4" /> Descrição
                                    </span>
                                    <span className="col-span-3 font-medium text-gray-900">
                                        {selectedTransaction.descricao}
                                    </span>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium text-gray-500 text-sm flex items-center justify-end gap-2">
                                        <DollarSign className="w-4 h-4" /> Valor
                                    </span>
                                    <span className="col-span-3 font-bold text-lg text-gray-900">
                                        {formatCurrency(selectedTransaction.valor)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium text-gray-500 text-sm flex items-center justify-end gap-2">
                                        <Calendar className="w-4 h-4" /> Data
                                    </span>
                                    <span className="col-span-3 text-gray-700">
                                        {format(parseISO(selectedTransaction.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </span>
                                </div>

                                {selectedTransaction.categorias && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <span className="text-right font-medium text-gray-500 text-sm flex items-center justify-end gap-2">
                                            <Tag className="w-4 h-4" /> Categoria
                                        </span>
                                        <span className="col-span-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {selectedTransaction.categorias.nome}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

import { useMetas, Meta } from "@/hooks/useMetas";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FinancialGoalProgress = () => {
    const { metas, loading } = useMetas();
    const navigate = useNavigate();

    if (loading) {
        return (
            <Card className="p-6 h-[200px] flex items-center justify-center bg-gray-50/50">
                <div className="text-gray-400 text-sm">Carregando metas...</div>
            </Card>
        );
    }

    const activeMeta = metas.filter(m => m.status === 'ativa')[0];

    if (!activeMeta) {
        return (
            <Card className="p-6 h-[200px] flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
                <div className="p-3 bg-indigo-100 rounded-full">
                    <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-indigo-900">Defina sua primeira meta!</h3>
                    <p className="text-sm text-indigo-600/80 max-w-[200px]">Transforme seus sonhos em objetivos financeiros claros.</p>
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                    onClick={() => navigate('/metas')}
                >
                    Criar Meta
                </Button>
            </Card>
        );
    }

    const progress = Math.min((activeMeta.valor_atual / activeMeta.valor_alvo) * 100, 100);
    const restante = activeMeta.valor_alvo - activeMeta.valor_atual;
    const isCompleted = progress >= 100;

    return (
        <Card className="p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none transition-transform group-hover:scale-110 duration-500" />

            <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isCompleted ? 'bg-yellow-100' : 'bg-indigo-100'}`}>
                            {isCompleted ? (
                                <Trophy className={`w-5 h-5 ${isCompleted ? 'text-yellow-600' : 'text-indigo-600'}`} />
                            ) : (
                                <Target className="w-5 h-5 text-indigo-600" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 line-clamp-1">{activeMeta.titulo}</h3>
                            <p className="text-xs text-gray-500">
                                {isCompleted ? 'Meta alcançada!' : `Faltam ${restante.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}
                            </p>
                        </div>
                    </div>
                    {activeMeta.data_limite && !isCompleted && (
                        <div className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {new Date(activeMeta.data_limite).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-600">{progress.toFixed(0)}%</span>
                        <span className="text-indigo-600">
                            {activeMeta.valor_atual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                    </div>
                    <Progress value={progress} className="h-2 bg-gray-100" />
                </div>
            </div>
        </Card>
    );
};

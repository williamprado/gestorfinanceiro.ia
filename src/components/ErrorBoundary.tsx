import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public handleReset = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                        <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ops! Algo deu errado.</h1>
                        <p className="text-gray-600 mb-6">
                            Encontramos um erro inesperado. Tente recarregar a página.
                        </p>
                        {this.state.error && (
                            <div className="bg-gray-100 p-4 rounded-lg text-left text-xs font-mono text-gray-700 mb-6 overflow-auto max-h-40">
                                {this.state.error.toString()}
                            </div>
                        )}
                        <Button onClick={this.handleReset} className="w-full bg-primary hover:bg-primary/90">
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Recarregar Aplicação
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

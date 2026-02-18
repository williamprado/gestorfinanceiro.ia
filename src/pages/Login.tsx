import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useSearchParams } from "react-router-dom";

type AuthMode = "login" | "register" | "forgot-password" | "reset-password";

const Login = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(() => {
    // Se tiver o token de redefinição de senha na URL, mostra o formulário de reset
    return searchParams.get("type") === "recovery" ? "reset-password" : "login";
  });

  const renderAuthForm = () => {
    switch (mode) {
      case "login":
        return (
          <LoginForm
            onSwitchToRegister={() => setMode("register")}
            onSwitchToForgot={() => setMode("forgot-password")}
          />
        );
      case "register":
        return <RegisterForm onSwitchToLogin={() => setMode("login")} />;
      case "forgot-password":
        return <ForgotPasswordForm onSwitchToLogin={() => setMode("login")} />;
      case "reset-password":
        return <ResetPasswordForm onSwitchToLogin={() => setMode("login")} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DCF8C6] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-[#25D366] rounded-lg p-3">
                <span className="text-white font-bold text-2xl">W</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">WA Gestor Financeiro IA</h1>
            <p className="text-gray-600 mt-2">
              {mode === "login" && "Faça login em sua conta"}
              {mode === "register" && "Crie sua conta"}
              {mode === "forgot-password" && "Recupere sua senha"}
              {mode === "reset-password" && "Defina sua nova senha"}
            </p>
          </div>

          {/* Auth Form */}
          {renderAuthForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;

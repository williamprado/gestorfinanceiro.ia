
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordForm = ({ onSwitchToLogin }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await resetPassword(email);

    if (!error) {
      setEmailSent(true);
    }

    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 font-medium mb-2">Email enviado com sucesso!</h3>
          <p className="text-green-700 text-sm">
            Enviamos um link para redefinir sua senha para o email {email}.
            Verifique sua caixa de entrada e spam.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onSwitchToLogin}
          className="w-full"
        >
          Voltar para o login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          Digite seu email para receber um link de redefinição de senha.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#25D366] hover:bg-[#128C7E]"
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Enviar link de recuperação"}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-[#25D366] hover:text-[#128C7E]"
        >
          Voltar para o login
        </button>
      </div>
    </form>
  );
};

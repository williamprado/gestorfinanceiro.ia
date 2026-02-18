import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal = ({
  isOpen,
  onClose,
}: DeleteAccountModalProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (confirmText !== "EXCLUIR") {
      toast({
        title: "Confirmação inválida",
        description: 'Digite "EXCLUIR" para confirmar.',
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Chamar a função RPC para deletar a conta
      const { data, error } = await supabase.rpc("delete_user_account", {
        user_id: user.id,
      });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Erro ao excluir conta");
      }

      // Fazer logout
      await signOut();

      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso.",
      });

      // Redirecionar para página inicial
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível excluir sua conta. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Excluir Conta Permanentemente
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              <strong>Esta ação é irreversível!</strong> Ao excluir sua conta:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Todos os seus dados financeiros serão perdidos</li>
              <li>Suas transações, metas e relatórios serão deletados</li>
              <li>Não será possível recuperar as informações</li>
            </ul>
            <div className="mt-4">
              <Label htmlFor="confirmDelete" className="text-sm font-medium">
                Digite "EXCLUIR" para confirmar:
              </Label>
              <Input
                id="confirmDelete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="EXCLUIR"
                className="mt-2"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={isLoading || confirmText !== "EXCLUIR"}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Excluindo..." : "Excluir Conta"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

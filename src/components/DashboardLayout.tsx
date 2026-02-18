import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AIAssistantFab } from "@/components/AIAssistantFab";
import {
  Home,
  TrendingUp,
  TrendingDown,
  FileText,
  BarChart3,
  Tag,
  PieChart,
  Target,
  Users,
  Bot,
  ShoppingCart,
  Car,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: TrendingUp, label: "Receitas", path: "/receitas" },
    { icon: TrendingDown, label: "Despesas", path: "/despesas" },
    { icon: FileText, label: "Transações", path: "/transacoes" },
    { icon: PieChart, label: "Dívidas", path: "/dividas" },
    { icon: Tag, label: "Categorias", path: "/categorias" },
    { icon: BarChart3, label: "Relatórios", path: "/relatorios" },
    { icon: Target, label: "Metas", path: "/metas" },
    { icon: ShoppingCart, label: "Mercado", path: "/mercado" },
    { icon: Car, label: "Veículos", path: "/veiculos" },
    { icon: Users, label: "Perfil", path: "/perfil" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("isAuthenticated");

    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });

    navigate("/");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Menu Button - Only show when menu is closed */}
      {!isMobileMenuOpen && (
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-white shadow-md rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen
          ${isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
          transition-all duration-300 ease-in-out
          bg-white border-r border-gray-100 shadow-xl lg:shadow-none
          flex flex-col z-50
          ${isCollapsed ? "w-20" : "w-72"}
        `}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-gray-50">
          <div className="flex items-center gap-3 w-full overflow-hidden">
            <div className="bg-gradient-to-tr from-green-600 to-emerald-500 rounded-xl p-2.5 shadow-lg shadow-green-200 shrink-0">
              <span className="text-white font-bold text-xl leading-none">W</span>
            </div>

            <div className={`flex flex-col transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
              <span className="font-bold text-gray-900 text-lg leading-tight truncate">WA Gestor</span>
              <span className="text-xs text-green-600 font-medium truncate">Financeiro IA</span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-auto h-8 w-8 text-gray-500"
            onClick={closeMobileMenu}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Collapse Toggle - Desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          className={`
            hidden lg:flex absolute top-20 -right-3 z-50
            h-6 w-6 rounded-full bg-white border border-gray-200 shadow-sm
            text-gray-500 hover:text-green-600 hover:border-green-200
            items-center justify-center transition-all duration-200
            ${isCollapsed ? 'rotate-180' : ''}
          `}
        >
          <ChevronLeft className="h-3 w-3" />
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                title={isCollapsed ? item.label : undefined}
                className={`
                  relative group flex items-center px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? "bg-green-50 text-green-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }
                  ${isCollapsed ? "justify-center" : "justify-start"}
                `}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-600 rounded-r-full transition-all duration-300 ${isCollapsed ? 'h-6 left-1' : ''}`} />
                )}

                {/* Icon with hover effect */}
                <item.icon
                  className={`
                    w-5 h-5 transition-transform duration-200 shrink-0
                    ${isActive ? "stroke-[2.5px]" : "stroke-2 group-hover:scale-110"}
                    ${isCollapsed ? "" : "mr-3"}
                  `}
                />

                {/* Label with transition */}
                <span
                  className={`
                    font-medium text-sm whitespace-nowrap transition-all duration-300 origin-left overflow-hidden
                    ${isCollapsed ? "w-0 opacity-0" : "w-24 opacity-100 ml-3"}
                  `}
                >
                  {item.label}
                </span>

                {/* Collapsed Tooltip-like popup on hover (optional enhancement) */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile Summary or Logout */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <Button
            variant="ghost"
            className={`
              w-full text-gray-500 hover:text-red-600 hover:bg-red-50 
              transition-colors duration-200 group
              ${isCollapsed ? "px-0 justify-center" : "justify-start px-3"}
            `}
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            title="Sair"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:stroke-red-600 transition-colors" />

            <span
              className={`
                font-medium text-sm transition-all duration-300 overflow-hidden
                ${isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"}
              `}
            >
              Sair
            </span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`
          flex-1 min-h-screen transition-all duration-300 ease-in-out
          ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}
        `}
      >
        <div className="lg:hidden h-16" /> {/* Mobile Header Spacer */}

        <div className="w-full max-w-8xl mx-auto">
          {children}
        </div>
      </main>

      {/* Floating AI Assistant - Always present */}
      <AIAssistantFab />
    </div>
  );
};

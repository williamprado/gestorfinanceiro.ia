
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "O WA Gestor Financeiro IA é gratuito?",
      answer: "Sim! O WA Gestor Financeiro IA oferece um plano gratuito completo com recursos essenciais para controle financeiro. Você pode fazer upgrade para planos pagos quando precisar de recursos avançados."
    },
    {
      question: "Como funciona a integração com WhatsApp?",
      answer: "Nosso assistente virtual permite que você registre receitas e despesas enviando mensagens simples. Basta escrever algo como 'Gastei R$ 50 no supermercado' e a transação será automaticamente registrada."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Absolutamente! Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança. Seus dados financeiros são protegidos com o mesmo nível de segurança dos bancos."
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento. Não há contratos ou taxas de cancelamento. Seu acesso aos recursos premium será mantido até o final do período pago."
    },
    {
      question: "Há limite de transações?",
      answer: "No plano gratuito, você pode registrar até 100 transações por mês. Nos planos pagos, não há limite de transações."
    },
    {
      question: "Posso importar dados de outros apps?",
      answer: "Sim! Oferecemos importação de dados de planilhas Excel, CSV e integração com os principais bancos brasileiros (em desenvolvimento)."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">PERGUNTAS FREQUENTES</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tire suas dúvidas sobre o WA Gestor Financeiro IA
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white mb-4 rounded-lg border border-gray-200">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

import { ChatbotClient } from "@/components/dashboard/chatbot-client";

export default function ChatbotPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Agri-Chat</h1>
        <p className="text-muted-foreground">
          Your AI-powered agricultural advisor. Ask me anything!
        </p>
      </div>
      <div className="flex-1">
        <ChatbotClient />
      </div>
    </div>
  );
}

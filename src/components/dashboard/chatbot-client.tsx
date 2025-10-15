"use client";

import { askChatbot } from "@/app/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, Send, User } from "lucide-react";
import { FormEvent, useRef, useState, useTransition } from "react";
import Markdown from "react-markdown";
import { useAuth } from "../auth-provider";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "model";
  content: { text: string }[];
}

export function ChatbotClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSumbit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userId = user?.uid || "anonymous-user";

    const userMessage: Message = { role: "user", content: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    startTransition(async () => {
      const res = await askChatbot(newMessages, input, userId);
      let botMessage: Message;
      if (res.error) {
        botMessage = { role: 'model', content: [{ text: res.error }] };
      } else {
        botMessage = { role: 'model', content: [{ text: res.advice || 'Sorry, something went wrong.' }] };
      }
      setMessages((prev) => [...prev, botMessage]);
      setTimeout(() => {
        if(scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
      }, 100);
    });
  };

  return (
    <div className="h-full flex flex-col bg-card border rounded-lg">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-4",
                message.role === "user" ? "justify-end" : ""
              )}
            >
              {message.role === "model" && (
                <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot />
                    </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-lg p-3 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <div className="prose prose-sm max-w-none text-current">
                  <Markdown>{message.content.map(c => c.text).join('')}</Markdown>
                </div>
              </div>
              {message.role === "user" && (
                 <Avatar className="h-8 w-8 border">
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
           {isPending && (
            <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot />
                    </AvatarFallback>
                </Avatar>
                <div className="bg-secondary text-secondary-foreground max-w-[75%] rounded-lg p-3 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse delay-0"></span>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse delay-150"></span>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse delay-300"></span>
                </div>
            </div>
           )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSumbit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about crop rotation, pest control, etc."
            disabled={isPending}
          />
          <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

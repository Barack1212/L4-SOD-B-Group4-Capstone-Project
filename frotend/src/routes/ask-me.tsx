import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { CROPS, FARMING_TIPS } from "@/lib/farming-data";

export const Route = createFileRoute("/ask-me")({
  component: AskMePage,
  head: () => ({
    meta: [
      { title: "Ask Me · Smart Farming Rwanda" },
      {
        name: "description",
        content: "Ask our AI assistant any questions about farming, crops, and best practices.",
      },
    ],
  }),
});

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

function AskMePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hello! I am your Smart Farming Assistant. Ask me anything about crops, planting seasons, or farming tips in Rwanda!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  function simulateAIResponse(userMessage: string) {
    const text = userMessage.toLowerCase();
    let response = "I'm not quite sure about that. Could you ask about a specific crop (like maize, beans, coffee) or general farming tips?";

    // Match crops
    const mentionedCrop = CROPS.find((c) => text.includes(c.name.toLowerCase()) || text.includes(c.id));
    
    if (mentionedCrop) {
      response = `${mentionedCrop.name} is a great crop! It is best grown during the ${mentionedCrop.bestSeasons.join(" and ")} seasons (${mentionedCrop.months}). It has a ${mentionedCrop.waterNeed.toLowerCase()} water need. Expert tip: ${mentionedCrop.notes}`;
    } else if (text.includes("tip") || text.includes("advice") || text.includes("help")) {
      // Random farming tip
      const tip = FARMING_TIPS[Math.floor(Math.random() * FARMING_TIPS.length)];
      response = `Here is a useful tip for you: **${tip.title}**. ${tip.body}`;
    } else if (text.includes("season") || text.includes("when to plant")) {
      response = "Rwanda generally has 4 agricultural seasons: Itumba (Long rains: Feb-May), Impeshyi (Long dry: Jun-Aug), Umuhindo (Short rains: Sep-Nov), and Urugaryi (Short dry: Dec-Jan). The best planting seasons for most crops are Itumba and Umuhindo.";
    }

    return response;
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate network delay and "thinking"
    setTimeout(() => {
      const aiResponse = simulateAIResponse(userMsg.content);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponse,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5s - 2.5s delay
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      
      <main className="container mx-auto flex flex-1 flex-col px-4 py-8 max-w-4xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-primary md:text-4xl">Ask the Expert</h1>
          <p className="mt-2 text-muted-foreground">
            Your personal AI agronomist for Rwandan agriculture.
          </p>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm" style={{ boxShadow: "var(--shadow-card)", minHeight: "500px", maxHeight: "70vh" }}>
          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 md:p-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`rounded-2xl px-5 py-3.5 max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted/50 text-foreground rounded-tl-sm"}`}>
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4 flex-row">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <div className="rounded-2xl px-5 py-4 bg-muted/50 rounded-tl-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border/50 bg-card p-4 md:p-5">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about crops, seasons, or farming tips..."
                className="w-full rounded-full border-none bg-muted/50 px-6 py-4 pr-16 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 h-10 w-10 rounded-full"
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              AI responses are based on expert farming data for Rwanda.
            </p>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
